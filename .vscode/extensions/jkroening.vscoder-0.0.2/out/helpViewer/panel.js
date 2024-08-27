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
exports.HelpPanel = void 0;
const vscode = __importStar(require("vscode"));
const cheerio = __importStar(require("cheerio"));
const util_1 = require("../util");
class HelpPanel {
    constructor(options, rHelp, panel) {
        this.viewColumn = vscode.ViewColumn.Two;
        // keep track of history to go back/forward:
        this.currentEntry = undefined;
        this.history = [];
        this.forwardHistory = [];
        this.webviewScriptFile = vscode.Uri.file(options.webviewScriptPath);
        this.webviewStyleFile = vscode.Uri.file(options.webviewStylePath);
        this.rHelp = rHelp;
        if (panel) {
            this.panel = panel;
            this.initializePanel();
        }
    }
    // used to close files, stop servers etc.
    dispose() {
        if (this.panel) {
            this.panel.dispose();
        }
    }
    // retrieves the stored webview or creates a new one if the webview was closed
    getWebview(preserveFocus = false) {
        // create webview if necessary
        if (!this.panel) {
            const webViewOptions = {
                enableScripts: true,
                enableFindWidget: true,
                retainContextWhenHidden: true // keep scroll position when not focussed
            };
            const showOptions = {
                viewColumn: this.viewColumn,
                preserveFocus: preserveFocus
            };
            this.panel = vscode.window.createWebviewPanel('rhelp', 'R Help', showOptions, webViewOptions);
            this.initializePanel();
        }
        this.panel.reveal(undefined, preserveFocus);
        void this.setContextValues();
        return this.panel.webview;
    }
    initializePanel() {
        if (!this.panel) {
            return;
        }
        this.panel.iconPath = new util_1.UriIcon('help');
        // virtual uris used to access local files
        this.webviewScriptUri = this.panel.webview.asWebviewUri(this.webviewScriptFile);
        this.webviewStyleUri = this.panel.webview.asWebviewUri(this.webviewStyleFile);
        // called e.g. when the webview panel is closed by the user
        this.panel.onDidDispose(() => {
            this.panel = undefined;
            this.history = [];
            this.forwardHistory = [];
            this.currentEntry = undefined;
            this.webviewScriptUri = undefined;
            this.webviewStyleUri = undefined;
            void this.setContextValues();
        });
        // sent by javascript added to the help pages, e.g. when a link or mouse button is clicked
        this.panel.webview.onDidReceiveMessage((e) => {
            void this.handleMessage(e);
        });
        // set context variable to show forward/backward buttons
        this.panel.onDidChangeViewState(() => {
            void this.setContextValues();
        });
    }
    async setContextValues() {
        var _a;
        await (0, util_1.setContext)('r.helpPanel.active', !!((_a = this.panel) === null || _a === void 0 ? void 0 : _a.active));
        await (0, util_1.setContext)('r.helpPanel.canGoBack', this.history.length > 0);
        await (0, util_1.setContext)('r.helpPanel.canGoForward', this.forwardHistory.length > 0);
    }
    // shows (internal) help file object in webview
    async showHelpFile(helpFile, updateHistory = true, currentScrollY = 0, viewer, preserveFocus = false) {
        if (viewer === undefined) {
            viewer = (0, util_1.config)().get('session.viewers.viewColumn.helpPanel');
        }
        // update this.viewColumn if a valid viewer argument was supplied
        if (typeof viewer === 'string') {
            this.viewColumn = vscode.ViewColumn[String(viewer)];
        }
        // get or create webview:
        const webview = this.getWebview(preserveFocus);
        // make sure helpFile is not a promise:
        helpFile = await helpFile;
        helpFile.scrollY = helpFile.scrollY || 0;
        // modify html
        helpFile = this.pimpMyHelp(helpFile, this.webviewStyleUri, this.webviewScriptUri);
        // actually show the hel page
        webview.html = helpFile.html;
        // update history to enable back/forward
        if (updateHistory) {
            if (this.currentEntry) {
                this.currentEntry.helpFile.scrollY = currentScrollY;
                this.history.push(this.currentEntry);
            }
            this.forwardHistory = [];
        }
        this.currentEntry = {
            helpFile: helpFile
        };
        await this.setContextValues();
        return true;
    }
    async openInExternalBrowser(helpFile) {
        if (!this.currentEntry) {
            return false;
        }
        if (!helpFile) {
            helpFile = this.currentEntry.helpFile;
        }
        const url = helpFile.url;
        if (!url) {
            return false;
        }
        const uri = vscode.Uri.parse(url);
        return vscode.env.openExternal(uri);
    }
    // go back/forward in the history of the webview:
    goBack() {
        var _a;
        void ((_a = this.panel) === null || _a === void 0 ? void 0 : _a.webview.postMessage({ command: 'goBack' }));
    }
    _goBack(currentScrollY = 0) {
        const entry = this.history.pop();
        if (entry) {
            if (this.currentEntry) { // should always be true
                this.currentEntry.helpFile.scrollY = currentScrollY;
                this.forwardHistory.push(this.currentEntry);
            }
            this.showHistoryEntry(entry);
        }
    }
    goForward() {
        var _a;
        void ((_a = this.panel) === null || _a === void 0 ? void 0 : _a.webview.postMessage({ command: 'goForward' }));
    }
    _goForward(currentScrollY = 0) {
        const entry = this.forwardHistory.pop();
        if (entry) {
            if (this.currentEntry) { // should always be true
                this.currentEntry.helpFile.scrollY = currentScrollY;
                this.history.push(this.currentEntry);
            }
            this.showHistoryEntry(entry);
        }
    }
    showHistoryEntry(entry) {
        const helpFile = entry.helpFile;
        void this.showHelpFile(helpFile, false);
    }
    // handle message produced by javascript inside the help page
    async handleMessage(msg) {
        if ('message' in msg && msg.message === 'linkClicked') {
            // handle hyperlinks clicked in the webview
            // normal navigation does not work in webviews (even on localhost)
            const href = msg.href || '';
            const currentScrollY = Number(msg.scrollY) || 0;
            console.log('Link clicked: ' + href);
            // remove first to path entries (if these are webview internal stuff):
            const uri = vscode.Uri.parse(href);
            const parts = uri.path.split('/');
            if (parts[0] !== 'library' && parts[0] !== 'doc') {
                parts.shift();
            }
            if (parts[0] !== 'library' && parts[0] !== 'doc') {
                parts.shift();
            }
            // actual request path as used by R:
            const requestPath = parts.join('/');
            // retrieve helpfile for path:
            const helpFile = await this.rHelp.getHelpFileForPath(requestPath);
            // if successful, show helpfile:
            if (helpFile) {
                if (uri.fragment) {
                    helpFile.hash = '#' + uri.fragment;
                }
                else {
                    helpFile.scrollY = 0;
                }
                if (uri.path.endsWith('.pdf')) {
                    void this.openInExternalBrowser(helpFile);
                }
                else if (uri.path.endsWith('.R')) {
                    const doc = await vscode.workspace.openTextDocument({
                        language: 'r',
                        content: helpFile.html0
                    });
                    void vscode.window.showTextDocument(doc);
                }
                else {
                    void this.showHelpFile(helpFile, true, currentScrollY);
                }
            }
        }
        else if (msg.message === 'mouseClick') {
            // use the additional mouse buttons to go forward/backwards
            const currentScrollY = Number(msg.scrollY) || 0;
            const button = Number(msg.button) || 0;
            if (button === 3) {
                this._goBack(currentScrollY);
            }
            else if (button === 4) {
                this._goForward(currentScrollY);
            }
        }
        else if (msg.message === 'text') {
            // used for logging/debugging
            console.log(`Message (text): ${String(msg.text)}`);
        }
        else {
            console.log('Unknown message:', msg);
        }
    }
    // improves the help display by applying syntax highlighting and adjusting hyperlinks:
    pimpMyHelp(helpFile, styleUri, scriptUri) {
        var _a;
        // get requestpath of helpfile
        const relPath = helpFile.requestPath + (helpFile.hash || '');
        // parse the html string
        const $ = cheerio.load(helpFile.html);
        // set relPath attribute. Used by js inside the page to adjust hyperlinks
        // scroll to top (=0) or last viewed position (if the page is from history)
        $('body').attr('relpath', relPath);
        $('body').attr('scrollyto', `${(_a = helpFile.scrollY) !== null && _a !== void 0 ? _a : -1}`);
        if (styleUri) {
            $('body').append(`\n<link rel="stylesheet" href="${styleUri.toString()}"></link>`);
        }
        if (scriptUri) {
            $('body').append(`\n<script src=${scriptUri.toString()}></script>`);
        }
        // convert to string
        helpFile.html = $.html();
        // return the html of the modified page:
        return helpFile;
    }
}
exports.HelpPanel = HelpPanel;
//# sourceMappingURL=panel.js.map