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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RMarkdownKnitManager = exports.knitDir = void 0;
const util = __importStar(require("../util"));
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs-extra"));
const path = require("path");
const yaml = require("js-yaml");
const manager_1 = require("./manager");
const rTerminal_1 = require("../rTerminal");
const extension_1 = require("../extension");
exports.knitDir = (_a = util.config().get('rmarkdown.knit.defaults.knitWorkingDirectory')) !== null && _a !== void 0 ? _a : undefined;
class RMarkdownKnitManager extends manager_1.RMarkdownManager {
    async renderDocument(rDocumentPath, docPath, docName, yamlParams, outputFormat) {
        var _a;
        const openOutfile = (_a = util.config().get('rmarkdown.knit.openOutputFile')) !== null && _a !== void 0 ? _a : false;
        const knitWorkingDir = this.getKnitDir(exports.knitDir, docPath);
        const knitWorkingDirText = knitWorkingDir ? `${knitWorkingDir}` : '';
        const knitCommand = await this.getKnitCommand(yamlParams, rDocumentPath, outputFormat);
        this.rPath = await util.getRpath();
        const lim = '<<<vsc>>>';
        const re = new RegExp(`.*${lim}(.*)${lim}.*`, 'gms');
        const scriptValues = {
            'VSCR_KNIT_DIR': knitWorkingDirText,
            'VSCR_LIM': lim,
            'VSCR_KNIT_COMMAND': knitCommand
        };
        const callback = (dat) => {
            var _a, _b;
            const outputUrl = (_b = (_a = re.exec(dat)) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.replace(re, '$1');
            if (outputUrl) {
                if (openOutfile) {
                    const outFile = vscode.Uri.file(outputUrl);
                    if (fs.existsSync(outFile.fsPath)) {
                        void vscode.commands.executeCommand('vscode.open', outFile);
                    }
                    else {
                        void vscode.window.showWarningMessage(`Could not find the output file at path: "${outFile.fsPath}"`);
                    }
                }
                return true;
            }
            else {
                return false;
            }
        };
        if (util.config().get('rmarkdown.knit.focusOutputChannel')) {
            this.rMarkdownOutput.show(true);
        }
        return await this.knitWithProgress({
            workingDirectory: knitWorkingDir,
            fileName: docName,
            filePath: rDocumentPath,
            scriptArgs: scriptValues,
            scriptPath: extension_1.extensionContext.asAbsolutePath('R/rmarkdown/knit.R'),
            rCmd: knitCommand,
            rOutputFormat: outputFormat,
            callback: callback
        });
    }
    getYamlFrontmatter(docPath) {
        const text = fs.readFileSync(docPath, 'utf8');
        const lines = text.split('\n');
        let startLine = -1;
        let endLine = -1;
        for (let i = 0; i < lines.length; i++) {
            if (/\S/.test(lines[i])) {
                if (startLine < 0) {
                    if (lines[i].startsWith('---')) {
                        startLine = i;
                    }
                    else {
                        break;
                    }
                }
                else {
                    if (lines[i].startsWith('---')) {
                        endLine = i;
                        break;
                    }
                }
            }
        }
        let yamlText = undefined;
        if (startLine + 1 < endLine) {
            yamlText = lines.slice(startLine + 1, endLine).join('\n');
        }
        let paramObj = {};
        if (yamlText) {
            try {
                paramObj = yaml.load(yamlText);
            }
            catch (e) {
                console.error(`Could not parse YAML frontmatter for "${docPath}". Error: ${String(e)}`);
            }
        }
        return paramObj;
    }
    async getKnitCommand(yamlParams, docPath, outputFormat) {
        let knitCommand;
        if (!(yamlParams === null || yamlParams === void 0 ? void 0 : yamlParams['site'])) {
            yamlParams['site'] = await this.findSiteParam();
        }
        // precedence:
        // knit > site > configuration
        if (yamlParams === null || yamlParams === void 0 ? void 0 : yamlParams['knit']) {
            const knitParam = yamlParams['knit'];
            knitCommand = outputFormat ?
                `${knitParam}(${docPath}, output_format = '${outputFormat}')` :
                `${knitParam}(${docPath})`;
        }
        else if (!this.isREADME(docPath) && (yamlParams === null || yamlParams === void 0 ? void 0 : yamlParams['site'])) {
            knitCommand = outputFormat ?
                `rmarkdown::render_site(${docPath}, output_format = '${outputFormat}')` :
                `rmarkdown::render_site(${docPath})`;
        }
        else {
            const cmd = util.config().get('rmarkdown.knit.command');
            knitCommand = outputFormat ?
                `${cmd}(${docPath}, output_format = '${outputFormat}')` :
                `${cmd}(${docPath})`;
        }
        return knitCommand.replace(/['"]/g, '\'');
    }
    // check if the workspace of the document is a R Markdown site.
    // the definition of what constitutes an R Markdown site differs
    // depending on the type of R Markdown site (i.e., "simple" vs. blogdown sites)
    async findSiteParam() {
        var _a, _b, _c, _d, _e;
        const wad = vscode.window.activeTextEditor.document.uri.fsPath;
        const rootFolder = (_d = (_c = (_b = (_a = vscode.workspace.workspaceFolders) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.uri) === null || _c === void 0 ? void 0 : _c.fsPath) !== null && _d !== void 0 ? _d : path.dirname(wad);
        const indexFile = (_e = (await vscode.workspace.findFiles(new vscode.RelativePattern(rootFolder, 'index.{Rmd,rmd, md}'), null, 1))) === null || _e === void 0 ? void 0 : _e[0];
        const siteRoot = path.join(path.dirname(wad), '_site.yml');
        // 'Simple' R Markdown websites require all docs to be in the root folder
        if (fs.existsSync(siteRoot)) {
            return 'rmarkdown::render_site';
            // Other generators may allow for docs in subdirs
        }
        else if (indexFile) {
            const indexData = this.getYamlFrontmatter(indexFile.fsPath);
            if (indexData === null || indexData === void 0 ? void 0 : indexData['site']) {
                return indexData['site'];
            }
        }
        return undefined;
    }
    // readme files should not be knitted via render_site
    isREADME(docPath) {
        return !!path.basename(docPath).includes('README');
    }
    // alters the working directory for evaluating chunks
    setKnitDir() {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const currentDocumentWorkspacePath = (_d = (_c = vscode.workspace.getWorkspaceFolder((_b = (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document) === null || _b === void 0 ? void 0 : _b.uri)) === null || _c === void 0 ? void 0 : _c.uri) === null || _d === void 0 ? void 0 : _d.fsPath;
        const currentDocumentFolderPath = path.dirname((_g = (_f = (_e = vscode.window) === null || _e === void 0 ? void 0 : _e.activeTextEditor.document) === null || _f === void 0 ? void 0 : _f.uri) === null || _g === void 0 ? void 0 : _g.fsPath);
        const items = [];
        if (currentDocumentWorkspacePath) {
            items.push({
                label: (exports.knitDir === manager_1.KnitWorkingDirectory.workspaceRoot ? '$(check)' : '') + manager_1.KnitWorkingDirectory.workspaceRoot,
                value: manager_1.KnitWorkingDirectory.workspaceRoot,
                detail: 'Use the workspace root as the knit working directory',
                description: (_h = currentDocumentWorkspacePath !== null && currentDocumentWorkspacePath !== void 0 ? currentDocumentWorkspacePath : currentDocumentFolderPath) !== null && _h !== void 0 ? _h : 'No available workspace'
            });
        }
        if (currentDocumentFolderPath && currentDocumentFolderPath !== '.') {
            items.push({
                label: (exports.knitDir === manager_1.KnitWorkingDirectory.documentDirectory ? '$(check)' : '') + manager_1.KnitWorkingDirectory.documentDirectory,
                value: manager_1.KnitWorkingDirectory.documentDirectory,
                detail: 'Use the document\'s directory as the knit working directory',
                description: currentDocumentFolderPath !== null && currentDocumentFolderPath !== void 0 ? currentDocumentFolderPath : 'No folder available'
            });
        }
        if (items.length > 0) {
            void vscode.window.showQuickPick(items, {
                title: 'Set knit working directory',
                canPickMany: false
            }).then(async (choice) => {
                if ((choice === null || choice === void 0 ? void 0 : choice.value) && exports.knitDir !== choice.value) {
                    exports.knitDir = choice.value;
                    await extension_1.rmdPreviewManager.updatePreview();
                }
            });
        }
        else {
            void vscode.window.showInformationMessage('Cannot set knit directory for untitled documents.');
        }
    }
    async knitRmd(echo, outputFormat) {
        const wad = vscode.window.activeTextEditor.document;
        // handle untitled rmd
        if (vscode.window.activeTextEditor.document.isUntitled) {
            void vscode.window.showWarningMessage('Cannot knit an untitled file. Please save the document.');
            await vscode.commands.executeCommand('workbench.action.files.save').then(() => {
                if (!vscode.window.activeTextEditor.document.isUntitled) {
                    void this.knitRmd(echo, outputFormat);
                }
            });
            return;
        }
        const isSaved = await util.saveDocument(wad);
        if (isSaved) {
            let rDocumentPath = util.ToRStringLiteral(wad.fileName, '"');
            let encodingParam = util.config().get('source.encoding');
            encodingParam = `encoding = "${encodingParam}"`;
            rDocumentPath = [rDocumentPath, encodingParam].join(', ');
            if (echo) {
                rDocumentPath = [rDocumentPath, 'echo = TRUE'].join(', ');
            }
            // allow users to opt out of background process
            if (util.config().get('rmarkdown.knit.useBackgroundProcess')) {
                const busyPath = wad.uri.fsPath + outputFormat;
                if (this.busyUriStore.has(busyPath)) {
                    return;
                }
                else {
                    this.busyUriStore.add(busyPath);
                    await this.renderDocument(rDocumentPath, wad.uri.fsPath, path.basename(wad.uri.fsPath), this.getYamlFrontmatter(wad.uri.fsPath), outputFormat);
                    this.busyUriStore.delete(busyPath);
                }
            }
            else {
                if (outputFormat === undefined) {
                    void (0, rTerminal_1.runTextInTerm)(`rmarkdown::render(${rDocumentPath})`);
                }
                else {
                    void (0, rTerminal_1.runTextInTerm)(`rmarkdown::render(${rDocumentPath}, '${outputFormat}')`);
                }
            }
        }
    }
}
exports.RMarkdownKnitManager = RMarkdownKnitManager;
//# sourceMappingURL=knit.js.map