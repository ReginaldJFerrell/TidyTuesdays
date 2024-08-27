"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageService = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const os = require("os");
const path = require("path");
const net = require("net");
const url = require("url");
const node_1 = require("vscode-languageclient/node");
const vscode_1 = require("vscode");
const util_1 = require("./util");
class LanguageService {
    constructor() {
        this.clients = new Map();
        this.initSet = new Set();
        this.startLanguageService(this);
    }
    dispose() {
        return this.stopLanguageService();
    }
    async createClient(config, selector, cwd, workspaceFolder, outputChannel) {
        const installed = await (0, util_1.isRPkgIntalled)('languageserver', cwd, true, 'R package {languageserver} is required to enable R language service features such as code completion, function signature, find references, etc. Do you want to install it?', 'You may need to reopen an R file to start the language service after the package is installed.');
        if (!installed) {
            return undefined;
        }
        let client;
        const debug = config.get('lsp.debug');
        const rPath = await (0, util_1.getRpath)();
        if (debug) {
            console.log(`R path: ${rPath}`);
        }
        const use_stdio = config.get('lsp.use_stdio');
        const env = Object.create(process.env);
        const lang = config.get('lsp.lang');
        if (lang !== '') {
            env.LANG = lang;
        }
        else if (env.LANG === undefined) {
            env.LANG = 'en_US.UTF-8';
        }
        if (debug) {
            console.log(`LANG: ${env.LANG}`);
        }
        const options = { cwd: cwd, env: env };
        const initArgs = config.get('lsp.args').concat('--silent', '--slave');
        const tcpServerOptions = () => new Promise((resolve, reject) => {
            // Use a TCP socket because of problems with blocking STDIO
            const server = net.createServer(socket => {
                // 'connection' listener
                console.log('R process connected');
                socket.on('end', () => {
                    console.log('R process disconnected');
                });
                socket.on('error', (e) => {
                    console.log(`R process error: ${e.message}`);
                    reject(e);
                });
                server.close();
                resolve({ reader: socket, writer: socket });
            });
            // Listen on random port
            server.listen(0, '127.0.0.1', () => {
                const port = server.address().port;
                const expr = debug ? `languageserver::run(port=${port},debug=TRUE)` : `languageserver::run(port=${port})`;
                // const cmd = `${rPath} ${initArgs.join(' ')} -e "${expr}"`;
                const args = initArgs.concat(['-e', expr]);
                const childProcess = (0, util_1.spawn)(rPath, args, options);
                client.outputChannel.appendLine(`R Language Server (${childProcess.pid}) started`);
                childProcess.stderr.on('data', (chunk) => {
                    client.outputChannel.appendLine(chunk.toString());
                });
                childProcess.on('exit', (code, signal) => {
                    client.outputChannel.appendLine(`R Language Server (${childProcess.pid}) exited ` +
                        (signal ? `from signal ${signal}` : `with exit code ${code}`));
                    if (code !== 0) {
                        client.outputChannel.show();
                    }
                    void client.stop();
                });
                return childProcess;
            });
        });
        // Options to control the language client
        const clientOptions = {
            // Register the server for selected R documents
            documentSelector: selector,
            uriConverters: {
                // VS Code by default %-encodes even the colon after the drive letter
                // NodeJS handles it much better
                code2Protocol: uri => new url.URL(uri.toString(true)).toString(),
                protocol2Code: str => vscode_1.Uri.parse(str)
            },
            workspaceFolder: workspaceFolder,
            outputChannel: outputChannel,
            synchronize: {
                // Synchronize the setting section 'r' to the server
                configurationSection: 'r.lsp',
                fileEvents: vscode_1.workspace.createFileSystemWatcher('**/*.{R,r}'),
            },
            revealOutputChannelOn: node_1.RevealOutputChannelOn.Never,
            errorHandler: {
                error: () => node_1.ErrorAction.Shutdown,
                closed: () => node_1.CloseAction.DoNotRestart,
            },
        };
        // Create the language client and start the client.
        if (use_stdio && process.platform !== 'win32') {
            let args;
            if (debug) {
                args = initArgs.concat(['-e', `languageserver::run(debug=TRUE)`]);
            }
            else {
                args = initArgs.concat(['-e', `languageserver::run()`]);
            }
            client = new node_1.LanguageClient('r', 'R Language Server', { command: rPath, args: args, options: options }, clientOptions);
        }
        else {
            client = new node_1.LanguageClient('r', 'R Language Server', tcpServerOptions, clientOptions);
        }
        return client;
    }
    checkClient(name) {
        if (this.initSet.has(name)) {
            return true;
        }
        this.initSet.add(name);
        const client = this.clients.get(name);
        return client && client.needsStop();
    }
    getKey(uri) {
        switch (uri.scheme) {
            case 'untitled':
                return uri.scheme;
            case 'vscode-notebook-cell':
                return `vscode-notebook:${uri.fsPath}`;
            default:
                return uri.toString(true);
        }
    }
    startLanguageService(self) {
        const config = vscode_1.workspace.getConfiguration('r');
        const outputChannel = vscode_1.window.createOutputChannel('R Language Server');
        async function didOpenTextDocument(document) {
            if (document.uri.scheme !== 'file' && document.uri.scheme !== 'untitled' && document.uri.scheme !== 'vscode-notebook-cell') {
                return;
            }
            if (document.languageId !== 'r' && document.languageId !== 'rmd') {
                return;
            }
            const folder = vscode_1.workspace.getWorkspaceFolder(document.uri);
            // Each notebook uses a server started from parent folder
            if (document.uri.scheme === 'vscode-notebook-cell') {
                const key = self.getKey(document.uri);
                if (!self.checkClient(key)) {
                    console.log(`Start language server for ${document.uri.toString(true)}`);
                    const documentSelector = [
                        { scheme: 'vscode-notebook-cell', language: 'r', pattern: `${document.uri.fsPath}` },
                    ];
                    const client = await self.createClient(config, documentSelector, path.dirname(document.uri.fsPath), folder, outputChannel);
                    if (client) {
                        client.start();
                        self.clients.set(key, client);
                    }
                    self.initSet.delete(key);
                }
                return;
            }
            if (folder) {
                // Each workspace uses a server started from the workspace folder
                const key = self.getKey(folder.uri);
                if (!self.checkClient(key)) {
                    console.log(`Start language server for ${document.uri.toString(true)}`);
                    const pattern = `${folder.uri.fsPath}/**/*`;
                    const documentSelector = [
                        { scheme: 'file', language: 'r', pattern: pattern },
                        { scheme: 'file', language: 'rmd', pattern: pattern },
                    ];
                    const client = await self.createClient(config, documentSelector, folder.uri.fsPath, folder, outputChannel);
                    if (client) {
                        client.start();
                        self.clients.set(key, client);
                    }
                    self.initSet.delete(key);
                }
            }
            else {
                // All untitled documents share a server started from home folder
                if (document.uri.scheme === 'untitled') {
                    const key = self.getKey(document.uri);
                    if (!self.checkClient(key)) {
                        console.log(`Start language server for ${document.uri.toString(true)}`);
                        const documentSelector = [
                            { scheme: 'untitled', language: 'r' },
                            { scheme: 'untitled', language: 'rmd' },
                        ];
                        const client = await self.createClient(config, documentSelector, os.homedir(), undefined, outputChannel);
                        if (client) {
                            client.start();
                            self.clients.set(key, client);
                        }
                        self.initSet.delete(key);
                    }
                    return;
                }
                // Each file outside workspace uses a server started from parent folder
                if (document.uri.scheme === 'file') {
                    const key = self.getKey(document.uri);
                    if (!self.checkClient(key)) {
                        console.log(`Start language server for ${document.uri.toString(true)}`);
                        const documentSelector = [
                            { scheme: 'file', pattern: document.uri.fsPath },
                        ];
                        const client = await self.createClient(config, documentSelector, path.dirname(document.uri.fsPath), undefined, outputChannel);
                        if (client) {
                            client.start();
                            self.clients.set(key, client);
                        }
                        self.initSet.delete(key);
                    }
                    return;
                }
            }
        }
        function didCloseTextDocument(document) {
            if (document.uri.scheme === 'untitled') {
                const result = vscode_1.workspace.textDocuments.find((doc) => doc.uri.scheme === 'untitled');
                if (result) {
                    // Stop the language server when all untitled documents are closed.
                    return;
                }
            }
            if (document.uri.scheme === 'vscode-notebook-cell') {
                const result = vscode_1.workspace.textDocuments.find((doc) => doc.uri.scheme === document.uri.scheme && doc.uri.fsPath === document.uri.fsPath);
                if (result) {
                    // Stop the language server when all cell documents are closed (notebook closed).
                    return;
                }
            }
            // Stop the language server when single file outside workspace is closed, or the above cases.
            const key = self.getKey(document.uri);
            const client = self.clients.get(key);
            if (client) {
                self.clients.delete(key);
                self.initSet.delete(key);
                void client.stop();
            }
        }
        vscode_1.workspace.onDidOpenTextDocument(didOpenTextDocument);
        vscode_1.workspace.onDidCloseTextDocument(didCloseTextDocument);
        vscode_1.workspace.textDocuments.forEach((doc) => void didOpenTextDocument(doc));
        vscode_1.workspace.onDidChangeWorkspaceFolders((event) => {
            for (const folder of event.removed) {
                const key = self.getKey(folder.uri);
                const client = self.clients.get(key);
                if (client) {
                    self.clients.delete(key);
                    self.initSet.delete(key);
                    void client.stop();
                }
            }
        });
    }
    stopLanguageService() {
        const promises = [];
        for (const client of this.clients.values()) {
            promises.push(client.stop());
        }
        return Promise.all(promises).then(() => undefined);
    }
}
exports.LanguageService = LanguageService;
//# sourceMappingURL=languageService.js.map