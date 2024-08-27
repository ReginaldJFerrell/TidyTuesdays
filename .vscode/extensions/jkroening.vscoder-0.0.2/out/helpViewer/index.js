"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
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
exports.RHelp = exports.initializeHelp = void 0;
const vscode = __importStar(require("vscode"));
const cheerio = __importStar(require("cheerio"));
const hljs = __importStar(require("highlight.js"));
const util_1 = require("../util");
const panel_1 = require("./panel");
const helpProvider_1 = require("./helpProvider");
const treeView_1 = require("./treeView");
const packages_1 = require("./packages");
const liveShare_1 = require("../liveShare");
// Initialization function that is called once when activating the extension
async function initializeHelp(context, rExtension) {
    var _a;
    // set context value to indicate that the help related tree-view should be shown
    void vscode.commands.executeCommand('setContext', 'r.helpViewer.show', true);
    // get the "vanilla" R path from config
    const rPath = await (0, util_1.getRpath)();
    // get the current working directory from vscode
    const cwd = ((_a = vscode.workspace.workspaceFolders) === null || _a === void 0 ? void 0 : _a.length)
        ? vscode.workspace.workspaceFolders[0].uri.fsPath
        : undefined;
    // get the Memento for storing cached help files (or create a dummy for this session)
    const cacheConfig = (0, util_1.config)().get('helpPanel.cacheIndexFiles');
    const persistentState = cacheConfig === 'Workspace'
        ? context.workspaceState
        : cacheConfig === 'Global'
            ? context.globalState
            : new util_1.DummyMemento();
    // Gather options used in r help related files
    const rHelpOptions = {
        webviewScriptPath: context.asAbsolutePath('/html/help/script.js'),
        webviewStylePath: context.asAbsolutePath('/html/help/theme.css'),
        rScriptFile: context.asAbsolutePath('R/help/getAliases.R'),
        rPath: rPath,
        cwd: cwd,
        persistentState: persistentState,
    };
    let rHelp = undefined;
    try {
        rHelp = new RHelp(rHelpOptions);
    }
    catch (e) {
        void vscode.window.showErrorMessage(`Help Panel not available`);
    }
    rExtension.helpPanel = rHelp;
    if (rHelp) {
        // make sure R child processes etc. are terminated when extension closes
        context.subscriptions.push(rHelp);
        // register help related commands
        context.subscriptions.push(vscode.commands.registerCommand('r.showHelp', () => rHelp === null || rHelp === void 0 ? void 0 : rHelp.treeViewWrapper.helpViewProvider.rootItem.showQuickPick()), vscode.commands.registerCommand('r.helpPanel.back', () => { var _a; return (_a = rHelp === null || rHelp === void 0 ? void 0 : rHelp.getActiveHelpPanel(false)) === null || _a === void 0 ? void 0 : _a.goBack(); }), vscode.commands.registerCommand('r.helpPanel.forward', () => { var _a; return (_a = rHelp === null || rHelp === void 0 ? void 0 : rHelp.getActiveHelpPanel(false)) === null || _a === void 0 ? void 0 : _a.goForward(); }), vscode.commands.registerCommand('r.helpPanel.openExternal', () => { var _a; return (_a = rHelp === null || rHelp === void 0 ? void 0 : rHelp.getActiveHelpPanel(false)) === null || _a === void 0 ? void 0 : _a.openInExternalBrowser(); }), vscode.commands.registerCommand('r.helpPanel.openForSelection', (preserveFocus = false) => rHelp === null || rHelp === void 0 ? void 0 : rHelp.openHelpForSelection(!!preserveFocus)), vscode.commands.registerCommand('r.helpPanel.openForPath', (path) => {
            if (path) {
                void (rHelp === null || rHelp === void 0 ? void 0 : rHelp.showHelpForPath(path));
            }
        }));
        vscode.window.registerWebviewPanelSerializer('rhelp', rHelp);
    }
    return rHelp;
}
exports.initializeHelp = initializeHelp;
// The name api.HelpPanel is a bit misleading
// This class manages all R-help and R-packages related functions
class RHelp {
    constructor(options) {
        // the webview panel(s) where the help is shown
        this.helpPanels = [];
        // cache for modified help files (syntax highlighting etc.)
        this.cachedHelpFiles = new Map();
        this.webviewScriptFile = vscode.Uri.file(options.webviewScriptPath);
        this.webviewStyleFile = vscode.Uri.file(options.webviewStylePath);
        const pkgListener = () => {
            void console.log('Restarting Help Server...');
            void this.refresh(true);
        };
        this.helpProvider = new helpProvider_1.HelpProvider({
            ...options,
            pkgListener: pkgListener,
        });
        this.aliasProvider = new helpProvider_1.AliasProvider(options);
        this.packageManager = new packages_1.PackageManager({ ...options, rHelp: this });
        this.treeViewWrapper = new treeView_1.HelpTreeWrapper(this);
        this.helpPanelOptions = options;
    }
    async deserializeWebviewPanel(webviewPanel, path) {
        const panel = this.makeNewHelpPanel(webviewPanel);
        await this.showHelpForPath(path, undefined, true, panel);
        return;
    }
    // used to close files, stop servers etc.
    dispose() {
        const children = [
            this.helpProvider,
            this.aliasProvider,
            this.packageManager,
            this.treeViewWrapper,
            ...this.helpPanels,
        ];
        for (const child of children) {
            if (child &&
                'dispose' in child &&
                typeof child.dispose === 'function') {
                try {
                    child.dispose();
                }
                catch (e) { }
            }
        }
    }
    // refresh cached help info
    async refresh(refreshTreeView = false) {
        var _a, _b, _c, _d, _e, _f;
        this.cachedHelpFiles.clear();
        await ((_b = (_a = this.helpProvider) === null || _a === void 0 ? void 0 : _a.refresh) === null || _b === void 0 ? void 0 : _b.call(_a));
        await ((_d = (_c = this.aliasProvider) === null || _c === void 0 ? void 0 : _c.refresh) === null || _d === void 0 ? void 0 : _d.call(_c));
        await ((_f = (_e = this.packageManager) === null || _e === void 0 ? void 0 : _e.refresh) === null || _f === void 0 ? void 0 : _f.call(_e));
        if (refreshTreeView) {
            this.treeViewWrapper.refreshPackageRootNode();
        }
        return true;
    }
    // refresh cached help info only for a specific file/package
    clearCachedFiles(re) {
        for (const path of this.cachedHelpFiles.keys()) {
            if ((typeof re === 'string' && path === re) ||
                (typeof re !== 'string' && re.exec(path))) {
                this.cachedHelpFiles.delete(path);
            }
        }
    }
    // create a new help panel
    makeNewHelpPanel(panel) {
        const helpPanel = new panel_1.HelpPanel(this.helpPanelOptions, this, panel);
        this.helpPanels.unshift(helpPanel);
        return helpPanel;
    }
    getActiveHelpPanel(fallBack = true) {
        for (const helpPanel of this.helpPanels) {
            if (helpPanel.panel && helpPanel.panel.active) {
                return helpPanel;
            }
        }
        if (fallBack) {
            return this.getNewestHelpPanel();
        }
        return undefined;
    }
    getNewestHelpPanel(createNewPanel = true) {
        if (this.helpPanels.length) {
            return this.helpPanels[0];
        }
        else if (createNewPanel) {
            return this.makeNewHelpPanel();
        }
        else {
            return undefined;
        }
    }
    // search function, similar to typing `?? ...` in R
    async searchHelpByText() {
        const searchTerm = await vscode.window.showInputBox({
            value: '',
            prompt: 'Please enter a search term',
        });
        if (searchTerm !== undefined) {
            return this.showHelpForPath(`/doc/html/Search?pattern=${searchTerm}`);
        }
        return false;
    }
    // quickly open help for selection
    async openHelpForSelection(preserveFocus = false) {
        // only use if we failed to show help page:
        let errMsg = '';
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            // the text to show help for:
            let txt = '';
            if (editor.selection.isEmpty) {
                // no text selected -> find word at current cursor position
                // use regex including ":" to capture package/namespace (e.g. base::print)
                const re = /([a-zA-Z0-9._:])+/;
                const range = editor.document.getWordRangeAtPosition(editor.selection.start, re);
                // check if the cursor is at a word (else: whitespace -> ignore)
                if (range) {
                    txt = editor.document.getText(range);
                }
            }
            else {
                // use selected text
                txt = editor.document.getText(editor.selection);
            }
            txt = txt.trim();
            if (txt) {
                const success = await this.openHelpByAlias(txt, preserveFocus);
                if (!success) {
                    errMsg = `Failed to open help for "${txt}"!`;
                }
            }
            else {
                errMsg = 'Cannot show help: No valid text selected!';
            }
        }
        else {
            errMsg = 'No editor active!';
        }
        if (errMsg) {
            void vscode.window.showErrorMessage(errMsg);
            return false;
        }
        return true;
    }
    // quickly open help page by alias
    async openHelpByAlias(token = '', preserveFocus = false) {
        const matchingAliases = await this.getMatchingAliases(token);
        let pickedAlias;
        if (!(matchingAliases === null || matchingAliases === void 0 ? void 0 : matchingAliases.length)) {
            return false;
        }
        else if (matchingAliases.length === 1) {
            pickedAlias = matchingAliases[0];
        }
        else {
            pickedAlias = await this.pickAlias(matchingAliases);
            if (!pickedAlias) {
                // aborted by user -> return successful
                return true;
            }
        }
        if (pickedAlias) {
            return await this.showHelpForAlias(pickedAlias, preserveFocus);
        }
        return false;
    }
    async getMatchingAliases(token) {
        const aliases = await this.getAllAliases();
        const matchingAliases = aliases === null || aliases === void 0 ? void 0 : aliases.filter((alias) => token === alias.name ||
            token === `${alias.package}::${alias.name}` ||
            token === `${alias.package}:::${alias.name}`);
        return matchingAliases;
    }
    // search function, similar to calling `?` in R
    async searchHelpByAlias() {
        const alias = await this.pickAlias();
        if (alias) {
            return this.showHelpForAlias(alias);
        }
        return false;
    }
    // helper function to get aliases from aliasprovider
    async getAllAliases() {
        const aliases = await (0, util_1.doWithProgress)(() => this.aliasProvider.getAllAliases());
        if (!aliases) {
            void vscode.window.showErrorMessage(`Failed to get list of R functions. Make sure that \`jsonlite\` is installed and r.${(0, util_1.getRPathConfigEntry)()} points to a valid R executable.`);
        }
        return aliases;
    }
    // let the user pick an alias from a supplied list of aliases
    // if no list supplied, get all aliases from alias provider
    async pickAlias(aliases, prompt) {
        prompt || (prompt = 'Please type a function name/documentation entry');
        aliases || (aliases = await this.getAllAliases());
        if (!aliases) {
            return undefined;
        }
        const qpItems = aliases.map((v) => {
            return {
                ...v,
                label: v.name,
                description: `(${v.package}::${v.name})`,
            };
        });
        const qpOptions = {
            matchOnDescription: true,
            placeHolder: prompt,
        };
        const qp = await vscode.window.showQuickPick(qpItems, qpOptions);
        return qp;
    }
    async showHelpForAlias(alias, preserveFocus = false) {
        return this.showHelpForPath(`/library/${alias.package}/html/${alias.alias}.html`, undefined, preserveFocus);
    }
    // shows help for request path as used by R's internal help server
    async showHelpForPath(requestPath, viewer, preserveFocus = false, panel) {
        // get and show helpFile
        // const helpFile = this.helpProvider.getHelpFileFromRequestPath(requestPath);
        const helpFile = await this.getHelpFileForPath(requestPath);
        if (helpFile) {
            return this.showHelpFile(helpFile, viewer, preserveFocus, panel);
        }
        else {
            const msg = `Couldn't show help for path:\n${requestPath}\n`;
            void vscode.window.showErrorMessage(msg);
            return false;
        }
    }
    async getHelpFileForPath(requestPath, modify = true) {
        // get helpFile from helpProvider if not cached
        if (!this.cachedHelpFiles.has(requestPath)) {
            const helpFile = !liveShare_1.isGuestSession
                ? await this.helpProvider.getHelpFileFromRequestPath(requestPath)
                : await liveShare_1.rGuestService.requestHelpContent(requestPath);
            this.cachedHelpFiles.set(requestPath, helpFile);
        }
        // modify the helpFile (syntax highlighting etc.)
        // modifications are optional and cached
        const helpFileCached = this.cachedHelpFiles.get(requestPath);
        if (!helpFileCached) {
            return undefined;
        }
        else if (modify && !helpFileCached.isModified) {
            pimpMyHelp(helpFileCached);
        }
        // make deep copy to avoid messing with cache
        const helpFile = {
            ...helpFileCached,
        };
        return helpFile;
    }
    // shows (internal) help file object in webview
    async showHelpFile(helpFile, viewer, preserveFocus = false, panel) {
        panel || (panel = this.getNewestHelpPanel());
        return await panel.showHelpFile(helpFile, undefined, undefined, viewer, preserveFocus);
    }
}
exports.RHelp = RHelp;
// improves the help display by applying syntax highlighting and adjusting hyperlinks
// only contains modifications that are independent of the webview panel
// (i.e. no modified file paths, scroll position etc.)
function pimpMyHelp(helpFile) {
    // Retun if the help file is already modified
    if (helpFile.isModified) {
        return helpFile;
    }
    // store original html content
    helpFile.html0 = helpFile.html;
    // Make sure the helpfile content is actually html
    const re = new RegExp('<html[^\\n]*>.*</html>', 'ms');
    helpFile.isHtml = !!re.exec(helpFile.html);
    if (!helpFile.isHtml) {
        const html = (0, util_1.escapeHtml)(helpFile.html);
        helpFile.html = `<html><head></head><body><pre>${html}</pre></body></html>`;
    }
    // parse the html string
    const $ = cheerio.load(helpFile.html);
    // Remove style elements specified in the html itself (replaced with custom CSS)
    $('head style').remove();
    // Apply syntax highlighting:
    if ((0, util_1.config)().get('helpPanel.enableSyntaxHighlighting')) {
        // find all code sections, enclosed by <pre>...</pre>
        const codeSections = $('pre');
        // apply syntax highlighting to each code section:
        codeSections.each((i, section) => {
            const styledCode = hljs.highlight($(section).text() || '', {
                language: 'r',
            });
            $(section).html(styledCode.value);
        });
    }
    // replace html of the helpfile
    helpFile.html = $.html();
    // flag help file as modified
    helpFile.isModified = true;
    return helpFile;
}
//# sourceMappingURL=index.js.map