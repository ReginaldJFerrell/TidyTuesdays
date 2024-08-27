"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AliasProvider = exports.HelpProvider = void 0;
const vscode_1 = require("vscode");
const http = __importStar(require("http"));
const extension_1 = require("../extension");
const util_1 = require("../util");
// Class to forward help requests to a backgorund R instance that is running a help server
class HelpProvider {
    constructor(options) {
        this.rPath = options.rPath || 'R';
        this.cwd = options.cwd;
        this.pkgListener = options.pkgListener;
        this.cp = this.launchRHelpServer();
    }
    async refresh() {
        this.cp.dispose();
        this.cp = this.launchRHelpServer();
        await this.cp.port;
    }
    launchRHelpServer() {
        const lim = '---vsc---';
        const portRegex = new RegExp(`.*${lim}(.*)${lim}.*`, 'ms');
        const newPackageRegex = new RegExp('NEW_PACKAGES');
        // starts the background help server and waits forever to keep the R process running
        const scriptPath = extension_1.extensionContext.asAbsolutePath('R/help/helpServer.R');
        // const cmd = `${this.rPath} --silent --slave --no-save --no-restore -f "${scriptPath}"`;
        const args = [
            '--silent',
            '--slave',
            '--no-save',
            '--no-restore',
            '-f',
            scriptPath
        ];
        const cpOptions = {
            cwd: this.cwd,
            env: { ...process.env, 'VSCR_LIM': lim },
        };
        const childProcess = (0, util_1.spawn)(this.rPath, args, cpOptions);
        let str = '';
        // promise containing the port number of the process (or 0)
        const portPromise = new Promise((resolve) => {
            var _a;
            (_a = childProcess.stdout) === null || _a === void 0 ? void 0 : _a.on('data', (data) => {
                var _a;
                try {
                    // eslint-disable-next-line
                    str += data.toString();
                }
                catch (e) {
                    resolve(0);
                }
                if (portRegex.exec(str)) {
                    resolve(Number(str.replace(portRegex, '$1')));
                    str = str.replace(portRegex, '');
                }
                if (newPackageRegex.exec(str)) {
                    (_a = this.pkgListener) === null || _a === void 0 ? void 0 : _a.call(this);
                    str = str.replace(newPackageRegex, '');
                }
            });
            childProcess.on('close', () => {
                resolve(0);
            });
        });
        const exitHandler = () => {
            childProcess.port = 0;
        };
        childProcess.on('exit', exitHandler);
        childProcess.on('error', exitHandler);
        // await and store port number
        childProcess.port = portPromise;
        // is returned as a promise if not called with "await":
        return childProcess;
    }
    async getHelpFileFromRequestPath(requestPath) {
        var _a;
        const port = await ((_a = this.cp) === null || _a === void 0 ? void 0 : _a.port);
        if (!port || typeof port !== 'number') {
            return undefined;
        }
        // remove leading '/'
        while (requestPath.startsWith('/')) {
            requestPath = requestPath.substr(1);
        }
        // forward request to R instance
        // below is just a complicated way of getting a http response from the help server
        let url = `http://localhost:${port}/${requestPath}`;
        let html = '';
        const maxForwards = 3;
        for (let index = 0; index < maxForwards; index++) {
            const htmlPromise = new Promise((resolve, reject) => {
                let content = '';
                http.get(url, (res) => {
                    if (res.statusCode === 302) {
                        resolve({ redirect: res.headers.location });
                    }
                    else {
                        res.on('data', (chunk) => {
                            try {
                                // eslint-disable-next-line
                                content += chunk.toString();
                            }
                            catch (e) {
                                reject();
                            }
                        });
                        res.on('close', () => {
                            resolve({ content: content });
                        });
                        res.on('error', () => {
                            reject();
                        });
                    }
                });
            });
            const htmlResult = await htmlPromise;
            if (htmlResult.redirect) {
                const newUrl = new URL(htmlResult.redirect, url);
                requestPath = newUrl.pathname;
                url = newUrl.toString();
            }
            else {
                html = htmlResult.content || '';
                break;
            }
        }
        // return help file
        const ret = {
            requestPath: requestPath,
            html: html,
            isRealFile: false,
            url: url
        };
        return ret;
    }
    dispose() {
        this.cp.dispose();
    }
}
exports.HelpProvider = HelpProvider;
// Implements the aliasProvider required by the help panel
class AliasProvider {
    constructor(args) {
        this.rPath = args.rPath;
        this.cwd = args.cwd;
        this.rScriptFile = args.rScriptFile;
        this.persistentState = args.persistentState;
    }
    // delete stored aliases, will be generated on next request
    async refresh() {
        var _a;
        this.aliases = undefined;
        await ((_a = this.persistentState) === null || _a === void 0 ? void 0 : _a.update('r.helpPanel.cachedAliases', undefined));
        await this.makeAllAliases();
    }
    // get a list of all aliases
    async getAllAliases() {
        var _a, _b;
        // try this.aliases:
        if (this.aliases) {
            return this.aliases;
        }
        // try cached aliases:
        const cachedAliases = (_a = this.persistentState) === null || _a === void 0 ? void 0 : _a.get('r.helpPanel.cachedAliases');
        if (cachedAliases) {
            this.aliases = cachedAliases;
            return cachedAliases;
        }
        // try to make new aliases (returns undefined if unsuccessful):
        const newAliases = await this.makeAllAliases();
        this.aliases = newAliases;
        (_b = this.persistentState) === null || _b === void 0 ? void 0 : _b.update('r.helpPanel.cachedAliases', newAliases);
        return newAliases;
    }
    // converts aliases grouped by package to a flat list of aliases
    async makeAllAliases() {
        // get aliases from R (nested format)
        const allPackageAliases = await this.getAliasesFromR();
        if (!allPackageAliases) {
            return undefined;
        }
        // flatten aliases into one list:
        const allAliases = [];
        for (const pkg in allPackageAliases) {
            const pkgName = allPackageAliases[pkg].package || pkg;
            const pkgAliases = allPackageAliases[pkg].aliases || {};
            for (const fncName in pkgAliases) {
                allAliases.push({
                    name: fncName,
                    alias: pkgAliases[fncName],
                    package: pkgName
                });
            }
        }
        return allAliases;
    }
    // call R script `getAliases.R` and parse the output
    async getAliasesFromR() {
        const lim = '---vsc---';
        const options = {
            cwd: this.cwd,
            env: {
                ...process.env,
                VSCR_LIM: lim
            }
        };
        const args = [
            '--silent',
            '--slave',
            '--no-save',
            '--no-restore',
            '-f',
            this.rScriptFile
        ];
        try {
            const result = await (0, util_1.spawnAsync)(this.rPath, args, options);
            if (result.status !== 0) {
                throw result.error || new Error(result.stderr);
            }
            const re = new RegExp(`${lim}(.*)${lim}`, 'ms');
            const match = re.exec(result.stdout);
            if (match.length !== 2) {
                throw new Error('Could not parse R output.');
            }
            const json = match[1];
            return JSON.parse(json) || {};
        }
        catch (e) {
            console.log(e);
            void vscode_1.window.showErrorMessage(e.message);
        }
    }
}
exports.AliasProvider = AliasProvider;
//# sourceMappingURL=helpProvider.js.map