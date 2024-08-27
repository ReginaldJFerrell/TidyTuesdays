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
exports.RMarkdownPreviewManager = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs-extra"));
const cheerio = __importStar(require("cheerio"));
const path = require("path");
const crypto = require("crypto");
const util_1 = require("../util");
const extension_1 = require("../extension");
const knit_1 = require("./knit");
const manager_1 = require("./manager");
class RMarkdownPreview extends vscode.Disposable {
    constructor(title, cp, panel, resourceViewColumn, outputUri, filePath, RMarkdownPreviewManager, useCodeTheme, autoRefresh) {
        super(() => {
            var _a, _b, _c;
            (_a = this.cp) === null || _a === void 0 ? void 0 : _a.dispose();
            (_b = this.panel) === null || _b === void 0 ? void 0 : _b.dispose();
            (_c = this.fileWatcher) === null || _c === void 0 ? void 0 : _c.close();
            fs.removeSync(this.outputUri.fsPath);
        });
        this.title = title;
        this.cp = cp;
        this.panel = panel;
        this.resourceViewColumn = resourceViewColumn;
        this.outputUri = outputUri;
        this.autoRefresh = autoRefresh;
        this.mtime = fs.statSync(filePath).mtime.getTime();
        void this.refreshContent(useCodeTheme);
        this.startFileWatcher(RMarkdownPreviewManager, filePath);
    }
    styleHtml(useCodeTheme) {
        if (useCodeTheme) {
            this.panel.webview.html = this.htmlDarkContent;
        }
        else {
            this.panel.webview.html = this.htmlLightContent;
        }
    }
    async refreshContent(useCodeTheme) {
        this.getHtmlContent(await (0, util_1.readContent)(this.outputUri.fsPath, 'utf8'));
        this.styleHtml(useCodeTheme);
    }
    startFileWatcher(RMarkdownPreviewManager, filePath) {
        let fsTimeout;
        const fileWatcher = fs.watch(filePath, {}, () => {
            const mtime = fs.statSync(filePath).mtime.getTime();
            if (this.autoRefresh && !fsTimeout && mtime !== this.mtime) {
                fsTimeout = setTimeout(() => { fsTimeout = null; }, 1000);
                this.mtime = mtime;
                void RMarkdownPreviewManager.updatePreview(this);
            }
        });
        this.fileWatcher = fileWatcher;
    }
    getHtmlContent(htmlContent) {
        var _a, _b, _c, _d;
        let content = htmlContent.replace(/<(\w+)\s+(href|src)="(?!(\w+:)|#)/g, `<$1 $2="${String(this.panel.webview.asWebviewUri(vscode.Uri.file((0, extension_1.tmpDir)())))}/`);
        const re = new RegExp('<html[^\\n]*>.*</html>', 'ms');
        const isHtml = !!re.exec(content);
        if (!isHtml) {
            const html = (0, util_1.escapeHtml)(content);
            content = `<html><head></head><body><pre>${html}</pre></body></html>`;
        }
        const $ = cheerio.load(content);
        this.htmlLightContent = $.html();
        // make the output chunks a little lighter to stand out
        let chunkCol = String((0, util_1.config)().get('rmarkdown.chunkBackgroundColor'));
        let outCol;
        if (chunkCol) {
            const colReg = /[0-9.]+/g;
            const regOut = chunkCol.match(colReg);
            outCol = `rgba(${(_a = regOut[0]) !== null && _a !== void 0 ? _a : 128}, ${(_b = regOut[1]) !== null && _b !== void 0 ? _b : 128}, ${(_c = regOut[2]) !== null && _c !== void 0 ? _c : 128}, ${Math.max(0, Number((_d = regOut[3]) !== null && _d !== void 0 ? _d : 0.1) - 0.05)})`;
        }
        else {
            chunkCol = 'rgba(128, 128, 128, 0.1)';
            outCol = 'rgba(128, 128, 128, 0.05)';
        }
        const style = `<style>
            body {
                color: var(--vscode-editor-foreground);
                background: var(--vscode-editor-background);
            }
            .hljs {
                color: var(--vscode-editor-foreground);
            }
            code, pre {
                color: inherit;
                background: ${chunkCol};
                border-color: ${chunkCol};
            }
            pre:not([class]) {
                color: inherit;
                background: ${outCol};
            }
            pre > code {
                background: transparent;
            }
            h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6 {
                color: inherit;
            }
        </style>
        `;
        $('head').append(style);
        this.htmlDarkContent = $.html();
    }
}
class RMarkdownPreviewStore extends vscode.Disposable {
    constructor() {
        super(() => {
            for (const preview of this.store) {
                preview[1].dispose();
            }
            this.store.clear();
        });
        this.store = new Map();
    }
    add(filePath, preview) {
        return this.store.set(filePath, preview);
    }
    // dispose child and remove it from set
    delete(filePath) {
        this.store.get(filePath).dispose();
        return this.store.delete(filePath);
    }
    get(filePath) {
        return this.store.get(filePath);
    }
    getFilePath(preview) {
        for (const _preview of this.store) {
            if (_preview[1] === preview) {
                return _preview[0];
            }
        }
        return undefined;
    }
    has(filePath) {
        return this.store.has(filePath);
    }
    [Symbol.iterator]() {
        return this.store[Symbol.iterator]();
    }
}
class RMarkdownPreviewManager extends manager_1.RMarkdownManager {
    constructor() {
        super();
        // the currently selected RMarkdown preview
        this.activePreview = { filePath: null, preview: null, title: null };
        // store of all open RMarkdown previews
        this.previewStore = new RMarkdownPreviewStore;
        this.useCodeTheme = true;
        extension_1.extensionContext.subscriptions.push(this.previewStore);
    }
    async previewRmd(viewer, uri) {
        var _a, _b, _c, _d;
        const filePath = uri ? uri.fsPath : vscode.window.activeTextEditor.document.uri.fsPath;
        const fileName = path.basename(filePath);
        const currentViewColumn = (_c = (_b = (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.viewColumn) !== null && _b !== void 0 ? _b : vscode.ViewColumn.Active) !== null && _c !== void 0 ? _c : vscode.ViewColumn.One;
        // handle untitled rmd files
        if (!uri && vscode.window.activeTextEditor.document.isUntitled) {
            void vscode.window.showWarningMessage('Cannot knit an untitled file. Please save the document.');
            await vscode.commands.executeCommand('workbench.action.files.save').then(() => {
                if (!vscode.window.activeTextEditor.document.isUntitled) {
                    void this.previewRmd(viewer);
                }
            });
            return;
        }
        const isSaved = uri ?
            true :
            await (0, util_1.saveDocument)(vscode.window.activeTextEditor.document);
        if (isSaved) {
            // don't knit if the current uri is already being knit
            if (this.busyUriStore.has(filePath)) {
                return;
            }
            else if (this.previewStore.has(filePath)) {
                (_d = this.previewStore.get(filePath)) === null || _d === void 0 ? void 0 : _d.panel.reveal();
            }
            else {
                this.busyUriStore.add(filePath);
                await this.previewDocument(filePath, fileName, viewer, currentViewColumn);
                this.busyUriStore.delete(filePath);
            }
        }
    }
    enableAutoRefresh(preview) {
        var _a;
        if (preview) {
            preview.autoRefresh = true;
        }
        else if ((_a = this.activePreview) === null || _a === void 0 ? void 0 : _a.preview) {
            this.activePreview.preview.autoRefresh = true;
            void (0, util_1.setContext)('r.rmarkdown.preview.autoRefresh', true);
        }
    }
    disableAutoRefresh(preview) {
        var _a;
        if (preview) {
            preview.autoRefresh = false;
        }
        else if ((_a = this.activePreview) === null || _a === void 0 ? void 0 : _a.preview) {
            this.activePreview.preview.autoRefresh = false;
            void (0, util_1.setContext)('r.rmarkdown.preview.autoRefresh', false);
        }
    }
    toggleTheme() {
        this.useCodeTheme = !this.useCodeTheme;
        for (const preview of this.previewStore) {
            void preview[1].styleHtml(this.useCodeTheme);
        }
    }
    // show the source uri for the current preview.
    // has a few idiosyncracies with view columns due to some limitations with
    // vscode api. the view column will be set in order of priority:
    //    1. the original document's view column when the preview button was pressed
    //    2. the current webview's view column
    //    3. the current active editor
    // this is because we cannot tell the view column of a file if it is not visible
    // (e.g., is an unopened tab)
    async showSource() {
        var _a, _b, _c, _d, _e, _f, _g;
        if ((_a = this.activePreview) === null || _a === void 0 ? void 0 : _a.filePath) {
            await vscode.commands.executeCommand('vscode.open', vscode.Uri.file(this.activePreview.filePath), {
                preserveFocus: false,
                preview: false,
                viewColumn: (_g = (_d = (_c = (_b = this.activePreview) === null || _b === void 0 ? void 0 : _b.preview) === null || _c === void 0 ? void 0 : _c.resourceViewColumn) !== null && _d !== void 0 ? _d : (_f = (_e = this.activePreview) === null || _e === void 0 ? void 0 : _e.preview) === null || _f === void 0 ? void 0 : _f.panel.viewColumn) !== null && _g !== void 0 ? _g : vscode.ViewColumn.Active
            });
        }
    }
    async openExternalBrowser() {
        var _a, _b;
        if (this.activePreview) {
            await vscode.env.openExternal((_b = (_a = this.activePreview) === null || _a === void 0 ? void 0 : _a.preview) === null || _b === void 0 ? void 0 : _b.outputUri);
        }
    }
    async updatePreview(preview) {
        var _a, _b, _c;
        const toUpdate = preview !== null && preview !== void 0 ? preview : (_a = this.activePreview) === null || _a === void 0 ? void 0 : _a.preview;
        const previewUri = (_b = this.previewStore) === null || _b === void 0 ? void 0 : _b.getFilePath(toUpdate);
        (_c = toUpdate === null || toUpdate === void 0 ? void 0 : toUpdate.cp) === null || _c === void 0 ? void 0 : _c.dispose();
        if (toUpdate) {
            const childProcess = await this.previewDocument(previewUri, toUpdate.title).catch(() => {
                void vscode.window.showErrorMessage('There was an error in knitting the document. Please check the R Markdown output stream.');
                this.rMarkdownOutput.show(true);
                this.previewStore.delete(previewUri);
            });
            if (childProcess) {
                toUpdate.cp = childProcess;
            }
            this.refreshPanel(toUpdate);
        }
    }
    async previewDocument(filePath, fileName, viewer, currentViewColumn) {
        const knitWorkingDir = this.getKnitDir(knit_1.knitDir, filePath);
        const knitWorkingDirText = knitWorkingDir ? `${knitWorkingDir}` : '';
        this.rPath = await (0, util_1.getRpath)();
        const lim = '<<<vsc>>>';
        const re = new RegExp(`.*${lim}(.*)${lim}.*`, 'ms');
        const outputFile = path.join((0, extension_1.tmpDir)(), crypto.createHash('sha256').update(filePath).digest('hex') + '.html');
        const scriptValues = {
            'VSCR_KNIT_DIR': knitWorkingDirText,
            'VSCR_LIM': lim,
            'VSCR_FILE_PATH': filePath.replace(/\\/g, '/'),
            'VSCR_OUTPUT_FILE': outputFile.replace(/\\/g, '/'),
            'VSCR_TMP_DIR': (0, extension_1.tmpDir)().replace(/\\/g, '/')
        };
        const callback = (dat, childProcess) => {
            var _a, _b;
            const outputUrl = (_b = (_a = re.exec(dat)) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.replace(re, '$1');
            if (outputUrl) {
                if (viewer !== undefined) {
                    const autoRefresh = (0, util_1.config)().get('rmarkdown.preview.autoRefresh');
                    void this.openPreview(vscode.Uri.file(outputUrl), filePath, fileName, childProcess, viewer, currentViewColumn, autoRefresh);
                }
                return true;
            }
            return false;
        };
        const onRejected = (filePath) => {
            if (this.previewStore.has(filePath)) {
                this.previewStore.delete(filePath);
            }
        };
        return await this.knitWithProgress({
            workingDirectory: knitWorkingDir,
            fileName: fileName,
            filePath: filePath,
            scriptPath: extension_1.extensionContext.asAbsolutePath('R/rmarkdown/preview.R'),
            scriptArgs: scriptValues,
            rOutputFormat: 'html preview',
            callback: callback,
            onRejection: onRejected
        });
    }
    openPreview(outputUri, filePath, title, cp, viewer, resourceViewColumn, autoRefresh) {
        const panel = vscode.window.createWebviewPanel('previewRmd', `Preview ${title}`, {
            preserveFocus: true,
            viewColumn: viewer
        }, {
            enableFindWidget: true,
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [vscode.Uri.file((0, extension_1.tmpDir)())],
        });
        panel.iconPath = new util_1.UriIcon('preview');
        // Push the new rmd webview to the open proccesses array,
        // to keep track of running child processes
        // (primarily used in killing the child process, but also
        // general state tracking)
        const preview = new RMarkdownPreview(title, cp, panel, resourceViewColumn, outputUri, filePath, this, this.useCodeTheme, autoRefresh);
        this.previewStore.add(filePath, preview);
        // state change
        panel.onDidDispose(() => {
            var _a;
            // clear values
            this.activePreview = ((_a = this.activePreview) === null || _a === void 0 ? void 0 : _a.preview) === preview ? { filePath: null, preview: null, title: null } : this.activePreview;
            void (0, util_1.setContext)('r.rmarkdown.preview.active', false);
            this.previewStore.delete(filePath);
        });
        panel.onDidChangeViewState(({ webviewPanel }) => {
            void (0, util_1.setContext)('r.rmarkdown.preview.active', webviewPanel.active);
            if (webviewPanel.active) {
                this.activePreview.preview = preview;
                this.activePreview.filePath = filePath;
                this.activePreview.title = title;
                void (0, util_1.setContext)('r.rmarkdown.preview.autoRefresh', preview.autoRefresh);
            }
        });
    }
    refreshPanel(preview) {
        void preview.refreshContent(this.useCodeTheme);
    }
}
exports.RMarkdownPreviewManager = RMarkdownPreviewManager;
//# sourceMappingURL=preview.js.map