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
exports.RMarkdownManager = exports.KnitWorkingDirectory = void 0;
const util = __importStar(require("../util"));
const vscode = __importStar(require("vscode"));
const path = require("path");
const util_1 = require("../util");
var KnitWorkingDirectory;
(function (KnitWorkingDirectory) {
    KnitWorkingDirectory["documentDirectory"] = "document directory";
    KnitWorkingDirectory["workspaceRoot"] = "workspace root";
})(KnitWorkingDirectory = exports.KnitWorkingDirectory || (exports.KnitWorkingDirectory = {}));
const rMarkdownOutput = vscode.window.createOutputChannel('R Markdown');
class RMarkdownManager {
    constructor() {
        this.rPath = undefined;
        this.rMarkdownOutput = rMarkdownOutput;
        // uri that are in the process of knitting
        // so that we can't spam the knit/preview button
        this.busyUriStore = new Set();
    }
    getKnitDir(knitDir, docPath) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        switch (knitDir) {
            // the directory containing the R Markdown document
            case KnitWorkingDirectory.documentDirectory: {
                return (_c = (_b = (_a = path.dirname(docPath)) === null || _a === void 0 ? void 0 : _a.replace(/\\/g, '/')) === null || _b === void 0 ? void 0 : _b.replace(/['"]/g, '\\"')) !== null && _c !== void 0 ? _c : undefined;
            }
            // the root of the current workspace
            case KnitWorkingDirectory.workspaceRoot: {
                const currentDocumentWorkspace = (_j = (_h = (_g = vscode.workspace.getWorkspaceFolder((_d = vscode.Uri.file(docPath)) !== null && _d !== void 0 ? _d : (_f = (_e = vscode.window.activeTextEditor) === null || _e === void 0 ? void 0 : _e.document) === null || _f === void 0 ? void 0 : _f.uri)) === null || _g === void 0 ? void 0 : _g.uri) === null || _h === void 0 ? void 0 : _h.fsPath) !== null && _j !== void 0 ? _j : undefined;
                return (_l = (_k = currentDocumentWorkspace === null || currentDocumentWorkspace === void 0 ? void 0 : currentDocumentWorkspace.replace(/\\/g, '/')) === null || _k === void 0 ? void 0 : _k.replace(/['"]/g, '\\"')) !== null && _l !== void 0 ? _l : undefined;
            }
            // the working directory of the attached terminal, NYI
            // case 'current directory': {
            // 	return NULL
            // }
            default: return undefined;
        }
    }
    async knitDocument(args, token, progress) {
        // vscode.Progress auto-increments progress, so we use this
        // variable to set progress to a specific number
        let currentProgress = 0;
        let printOutput = true;
        return await new Promise((resolve, reject) => {
            const scriptArgs = args.scriptArgs;
            const scriptPath = args.scriptPath;
            const fileName = args.fileName;
            // const cmd = `${this.rPath} --silent --slave --no-save --no-restore -f "${scriptPath}"`;
            const cpArgs = [
                '--silent',
                '--slave',
                '--no-save',
                '--no-restore',
                '-f',
                scriptPath
            ];
            // When there's no LANG variable, we should try to set to a UTF-8 compatible one, as R relies
            // on locale setting (based on LANG) to render certain characters.
            // See https://github.com/REditorSupport/vscode-R/issues/933
            const env = process.env;
            if (env.LANG === undefined) {
                env.LANG = 'en_US.UTF-8';
            }
            const processOptions = {
                env: {
                    ...env,
                    ...scriptArgs
                },
                cwd: args.workingDirectory,
            };
            let childProcess;
            try {
                childProcess = (0, util_1.spawn)(this.rPath, cpArgs, processOptions, () => {
                    rMarkdownOutput.appendLine('[VSC-R] terminating R process');
                    printOutput = false;
                });
                progress.report({
                    increment: 0,
                    message: '0%'
                });
            }
            catch (e) {
                console.warn(`[VSC-R] error: ${e}`);
                reject({ cp: childProcess, wasCancelled: false });
            }
            this.rMarkdownOutput.appendLine(`[VSC-R] ${fileName} process started`);
            if (args.rCmd) {
                this.rMarkdownOutput.appendLine(`==> ${args.rCmd}`);
            }
            childProcess.stdout.on('data', (data) => {
                const dat = data.toString('utf8');
                if (printOutput) {
                    this.rMarkdownOutput.appendLine(dat);
                }
                const percentRegex = /[0-9]+(?=%)/g;
                const percentRegOutput = dat.match(percentRegex);
                if (percentRegOutput) {
                    for (const item of percentRegOutput) {
                        const perc = Number(item);
                        progress.report({
                            increment: perc - currentProgress,
                            message: `${perc}%`
                        });
                        currentProgress = perc;
                    }
                }
                if (token === null || token === void 0 ? void 0 : token.isCancellationRequested) {
                    resolve(childProcess);
                }
                else {
                    if (args.callback(dat, childProcess)) {
                        resolve(childProcess);
                    }
                }
            });
            childProcess.stderr.on('data', (data) => {
                const dat = data.toString('utf8');
                if (printOutput) {
                    this.rMarkdownOutput.appendLine(dat);
                }
            });
            childProcess.on('exit', (code, signal) => {
                this.rMarkdownOutput.appendLine(`[VSC-R] ${fileName} process exited ` +
                    (signal ? `from signal '${signal}'` : `with exit code ${code}`));
                if (code !== 0) {
                    reject({ cp: childProcess, wasCancelled: false });
                }
            });
            token === null || token === void 0 ? void 0 : token.onCancellationRequested(() => {
                reject({ cp: childProcess, wasCancelled: true });
            });
        });
    }
    async knitWithProgress(args) {
        let childProcess = undefined;
        await util.doWithProgress(async (token, progress) => {
            childProcess = await this.knitDocument(args, token, progress);
        }, vscode.ProgressLocation.Notification, `Knitting ${args.fileName} ${args.rOutputFormat ? 'to ' + args.rOutputFormat : ''} `, true).catch((rejection) => {
            var _a, _b;
            if (!rejection.wasCancelled) {
                void vscode.window.showErrorMessage('There was an error in knitting the document. Please check the R Markdown output stream.');
                this.rMarkdownOutput.show(true);
            }
            // this can occur when a successfuly knitted document is later altered (while still being previewed) and subsequently fails to knit
            (_a = args === null || args === void 0 ? void 0 : args.onRejection) === null || _a === void 0 ? void 0 : _a.call(args, args.filePath, rejection);
            (_b = rejection.cp) === null || _b === void 0 ? void 0 : _b.dispose();
        });
        return childProcess;
    }
}
exports.RMarkdownManager = RMarkdownManager;
//# sourceMappingURL=manager.js.map