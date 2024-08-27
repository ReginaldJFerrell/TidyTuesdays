"use strict";
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
exports.HttpgdViewer = exports.HttpgdManager = exports.initializeHttpgd = void 0;
const vscode = __importStar(require("vscode"));
const httpgd_1 = require("httpgd");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const ejs = __importStar(require("ejs"));
const util_1 = require("../util");
const extension_1 = require("../extension");
const commands = [
    'showViewers',
    'openUrl',
    'openExternal',
    'showIndex',
    'toggleStyle',
    'toggleFullWindow',
    'togglePreviewPlots',
    'exportPlot',
    'nextPlot',
    'prevPlot',
    'lastPlot',
    'firstPlot',
    'hidePlot',
    'closePlot',
    'resetPlots',
    'zoomIn',
    'zoomOut'
];
function initializeHttpgd() {
    const httpgdManager = new HttpgdManager();
    for (const cmd of commands) {
        const fullCommand = `r.plot.${cmd}`;
        const cb = httpgdManager.getCommandHandler(cmd);
        vscode.commands.registerCommand(fullCommand, cb);
    }
    return httpgdManager;
}
exports.initializeHttpgd = initializeHttpgd;
class HttpgdManager {
    constructor() {
        this.viewers = [];
        this.recentlyActiveViewers = [];
        const htmlRoot = extension_1.extensionContext.asAbsolutePath('html/httpgd');
        this.viewerOptions = {
            parent: this,
            htmlRoot: htmlRoot,
            preserveFocus: true
        };
    }
    showViewer(urlString) {
        const url = new URL(urlString);
        const host = url.host;
        const token = url.searchParams.get('token') || undefined;
        const ind = this.viewers.findIndex((viewer) => viewer.host === host);
        if (ind >= 0) {
            const viewer = this.viewers.splice(ind, 1)[0];
            this.viewers.unshift(viewer);
            viewer.show();
        }
        else {
            const conf = (0, util_1.config)();
            const colorTheme = conf.get('plot.defaults.colorTheme', 'vscode');
            this.viewerOptions.stripStyles = (colorTheme === 'vscode');
            this.viewerOptions.previewPlotLayout = conf.get('plot.defaults.plotPreviewLayout', 'multirow');
            this.viewerOptions.refreshTimeoutLength = conf.get('plot.timing.refreshInterval', 10);
            this.viewerOptions.resizeTimeoutLength = conf.get('plot.timing.resizeInterval', 100);
            this.viewerOptions.fullWindow = conf.get('plot.defaults.fullWindowMode', false);
            this.viewerOptions.token = token;
            const viewer = new HttpgdViewer(host, this.viewerOptions);
            this.viewers.unshift(viewer);
        }
    }
    registerActiveViewer(viewer) {
        const ind = this.recentlyActiveViewers.indexOf(viewer);
        if (ind) {
            this.recentlyActiveViewers.splice(ind, 1);
        }
        this.recentlyActiveViewers.unshift(viewer);
    }
    getRecentViewer() {
        return this.recentlyActiveViewers.find((viewer) => !!viewer.webviewPanel);
    }
    getNewestViewer() {
        return this.viewers[0];
    }
    getCommandHandler(command) {
        return (...args) => {
            this.handleCommand(command, ...args);
        };
    }
    async openUrl() {
        const clipText = await vscode.env.clipboard.readText();
        const val0 = clipText.trim().split(/[\n ]/)[0];
        const options = {
            value: val0,
            prompt: 'Please enter the httpgd url'
        };
        const urlString = await vscode.window.showInputBox(options);
        if (urlString) {
            this.showViewer(urlString);
        }
    }
    // generic command handler
    handleCommand(command, hostOrWebviewUri, ...args) {
        // the number and type of arguments given to a command can vary, depending on where it was called from:
        // - calling from the title bar menu provides two arguments, the first of which identifies the webview
        // - calling from the command palette provides no arguments
        // - calling from a command uri provides a flexible number/type of arguments
        // below  is an attempt to handle these different combinations efficiently and (somewhat) robustly
        //
        if (command === 'showViewers') {
            this.viewers.forEach(viewer => {
                viewer.show(true);
            });
            return;
        }
        else if (command === 'openUrl') {
            void this.openUrl();
            return;
        }
        // Identify the correct viewer
        let viewer;
        if (typeof hostOrWebviewUri === 'string') {
            const host = hostOrWebviewUri;
            viewer = this.viewers.find((viewer) => viewer.host === host);
        }
        else if (hostOrWebviewUri instanceof vscode.Uri) {
            const uri = hostOrWebviewUri;
            viewer = this.viewers.find((viewer) => viewer.getPanelPath() === uri.path);
        }
        // fall back to most recent viewer
        viewer || (viewer = this.getRecentViewer());
        // Abort if no viewer identified
        if (!viewer) {
            return;
        }
        // Get possible arguments for commands:
        const stringArg = findItemOfType(args, 'string');
        const boolArg = findItemOfType(args, 'boolean');
        // Call corresponding method, possibly with an argument:
        switch (command) {
            case 'showIndex': {
                void viewer.focusPlot(stringArg);
                break;
            }
            case 'nextPlot': {
                void viewer.nextPlot(boolArg);
                break;
            }
            case 'prevPlot': {
                void viewer.prevPlot(boolArg);
                break;
            }
            case 'lastPlot': {
                void viewer.nextPlot(true);
                break;
            }
            case 'firstPlot': {
                void viewer.prevPlot(true);
                break;
            }
            case 'resetPlots': {
                viewer.resetPlots();
                break;
            }
            case 'toggleStyle': {
                void viewer.toggleStyle(boolArg);
                break;
            }
            case 'togglePreviewPlots': {
                void viewer.togglePreviewPlots(stringArg);
                break;
            }
            case 'closePlot': {
                void viewer.closePlot(stringArg);
                break;
            }
            case 'hidePlot': {
                void viewer.hidePlot(stringArg);
                break;
            }
            case 'exportPlot': {
                void viewer.exportPlot(stringArg);
                break;
            }
            case 'zoomIn': {
                void viewer.zoomIn();
                break;
            }
            case 'zoomOut': {
                void viewer.zoomOut();
                break;
            }
            case 'openExternal': {
                void viewer.openExternal();
                break;
            }
            case 'toggleFullWindow': {
                void viewer.toggleFullWindow();
                break;
            }
            default: {
                break;
            }
        }
    }
}
exports.HttpgdManager = HttpgdManager;
class HttpgdViewer {
    // constructor called by the session watcher if a corresponding function was called in R
    // creates a new api instance itself
    constructor(host, options) {
        var _a, _b, _c, _d, _e, _f;
        // active plots
        this.plots = [];
        // Ids of plots that are not shown, but not closed inside httpgd
        this.hiddenPlots = [];
        this.defaultStripStyles = true;
        this.defaultPreviewPlotLayout = 'multirow';
        this.defaultFullWindow = false;
        this.zoom0 = 1;
        this.zoom = this.zoom0;
        this.resizeTimeoutLength = 1300;
        this.refreshTimeoutLength = 10;
        this.host = host;
        this.token = options.token;
        this.parent = options.parent;
        this.api = new httpgd_1.Httpgd(this.host, this.token, true);
        this.api.onPlotsChanged((newState) => {
            void this.refreshPlotsDelayed(newState.plots);
        });
        this.api.onConnectionChanged(() => {
            // todo
        });
        this.api.onDeviceActiveChanged(() => {
            // todo
        });
        const conf = (0, util_1.config)();
        this.customOverwriteCssPath = conf.get('plot.customStyleOverwrites', '');
        const localResourceRoots = (this.customOverwriteCssPath ?
            [extension_1.extensionContext.extensionUri, vscode.Uri.file(path.dirname(this.customOverwriteCssPath))] :
            undefined);
        this.htmlRoot = options.htmlRoot;
        this.htmlTemplate = fs.readFileSync(path.join(this.htmlRoot, 'index.ejs'), 'utf-8');
        this.smallPlotTemplate = fs.readFileSync(path.join(this.htmlRoot, 'smallPlot.ejs'), 'utf-8');
        this.showOptions = {
            viewColumn: (_a = options.viewColumn) !== null && _a !== void 0 ? _a : vscode.ViewColumn[conf.get('session.viewers.viewColumn.plot') || 'Two'],
            preserveFocus: !!options.preserveFocus
        };
        this.webviewOptions = {
            enableCommandUris: true,
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: localResourceRoots
        };
        this.defaultStripStyles = (_b = options.stripStyles) !== null && _b !== void 0 ? _b : this.defaultStripStyles;
        this.stripStyles = this.defaultStripStyles;
        this.defaultPreviewPlotLayout = (_c = options.previewPlotLayout) !== null && _c !== void 0 ? _c : this.defaultPreviewPlotLayout;
        this.previewPlotLayout = this.defaultPreviewPlotLayout;
        this.defaultFullWindow = (_d = options.fullWindow) !== null && _d !== void 0 ? _d : this.defaultFullWindow;
        this.fullWindow = this.defaultFullWindow;
        this.resizeTimeoutLength = (_e = options.refreshTimeoutLength) !== null && _e !== void 0 ? _e : this.resizeTimeoutLength;
        this.refreshTimeoutLength = (_f = options.refreshTimeoutLength) !== null && _f !== void 0 ? _f : this.refreshTimeoutLength;
        void this.api.connect();
        //void this.checkState();
    }
    // Computed properties:
    // Get/set active plot by index instead of id:
    get activeIndex() {
        if (!this.activePlot) {
            return -1;
        }
        return this.getIndex(this.activePlot);
    }
    set activeIndex(ind) {
        if (this.plots.length === 0) {
            this.activePlot = undefined;
        }
        else {
            ind = Math.max(ind, 0);
            ind = Math.min(ind, this.plots.length - 1);
            this.activePlot = this.plots[ind].id;
        }
    }
    // Methods to interact with the webview
    // Can e.g. be called by vscode commands + menu items:
    // Called to create a new webview if the user closed the old one:
    show(preserveFocus) {
        preserveFocus !== null && preserveFocus !== void 0 ? preserveFocus : (preserveFocus = this.showOptions.preserveFocus);
        if (!this.webviewPanel) {
            const showOptions = {
                ...this.showOptions,
                preserveFocus: preserveFocus
            };
            this.webviewPanel = this.makeNewWebview(showOptions);
            this.refreshHtml();
        }
        else {
            this.webviewPanel.reveal(undefined, preserveFocus);
        }
        this.parent.registerActiveViewer(this);
    }
    openExternal() {
        let urlString = `http://${this.host}/live`;
        if (this.token) {
            urlString += `?token=${this.token}`;
        }
        const uri = vscode.Uri.parse(urlString);
        void vscode.env.openExternal(uri);
    }
    // focus a specific plot id
    async focusPlot(id) {
        this.activePlot = id || this.activePlot;
        const plt = this.plots[this.activeIndex];
        if (plt.height !== this.viewHeight || plt.width !== this.viewHeight || plt.zoom !== this.zoom) {
            await this.refreshPlots(this.api.getPlots());
        }
        else {
            this._focusPlot();
        }
    }
    _focusPlot(plotId) {
        plotId !== null && plotId !== void 0 ? plotId : (plotId = this.activePlot);
        if (!plotId) {
            return;
        }
        const msg = {
            message: 'focusPlot',
            plotId: plotId
        };
        this.postWebviewMessage(msg);
        void this.setContextValues();
    }
    // navigate through plots (supply `true` to go to end/beginning of list)
    async nextPlot(last) {
        this.activeIndex = last ? this.plots.length - 1 : this.activeIndex + 1;
        await this.focusPlot();
    }
    async prevPlot(first) {
        this.activeIndex = first ? 0 : this.activeIndex - 1;
        await this.focusPlot();
    }
    // restore closed plots, reset zoom, redraw html
    resetPlots() {
        this.hiddenPlots = [];
        this.zoom = this.zoom0;
        void this.refreshPlots(this.api.getPlots(), true, true);
    }
    hidePlot(id) {
        id !== null && id !== void 0 ? id : (id = this.activePlot);
        if (!id) {
            return;
        }
        const tmpIndex = this.activeIndex;
        this.hiddenPlots.push(id);
        this.plots = this.plots.filter((plt) => !this.hiddenPlots.includes(plt.id));
        if (id === this.activePlot) {
            this.activeIndex = tmpIndex;
            this._focusPlot();
        }
        this._hidePlot(id);
    }
    _hidePlot(id) {
        const msg = {
            message: 'hidePlot',
            plotId: id
        };
        this.postWebviewMessage(msg);
    }
    async closePlot(id) {
        id !== null && id !== void 0 ? id : (id = this.activePlot);
        if (id) {
            this.hidePlot(id);
            await this.api.removePlot({ id: id });
        }
    }
    toggleStyle(force) {
        this.stripStyles = force !== null && force !== void 0 ? force : !this.stripStyles;
        const msg = {
            message: 'toggleStyle',
            useOverwrites: this.stripStyles
        };
        this.postWebviewMessage(msg);
    }
    toggleFullWindow(force) {
        this.fullWindow = force !== null && force !== void 0 ? force : !this.fullWindow;
        const msg = {
            message: 'toggleFullWindow',
            useFullWindow: this.fullWindow
        };
        this.postWebviewMessage(msg);
    }
    togglePreviewPlots(force) {
        if (force) {
            this.previewPlotLayout = force;
        }
        else if (this.previewPlotLayout === 'multirow') {
            this.previewPlotLayout = 'scroll';
        }
        else if (this.previewPlotLayout === 'scroll') {
            this.previewPlotLayout = 'hidden';
        }
        else if (this.previewPlotLayout === 'hidden') {
            this.previewPlotLayout = 'multirow';
        }
        const msg = {
            message: 'togglePreviewPlotLayout',
            style: this.previewPlotLayout
        };
        this.postWebviewMessage(msg);
    }
    zoomOut() {
        if (this.zoom > 0) {
            this.zoom -= 0.1;
            void this.resizePlot();
        }
    }
    zoomIn() {
        this.zoom += 0.1;
        void this.resizePlot();
    }
    async setContextValues(mightBeInBackground = false) {
        var _a;
        if ((_a = this.webviewPanel) === null || _a === void 0 ? void 0 : _a.active) {
            this.parent.registerActiveViewer(this);
            await (0, util_1.setContext)('r.plot.active', true);
            await (0, util_1.setContext)('r.plot.canGoBack', this.activeIndex > 0);
            await (0, util_1.setContext)('r.plot.canGoForward', this.activeIndex < this.plots.length - 1);
        }
        else if (!mightBeInBackground) {
            await (0, util_1.setContext)('r.plot.active', false);
        }
    }
    getPanelPath() {
        if (!this.webviewPanel) {
            return undefined;
        }
        const dummyUri = this.webviewPanel.webview.asWebviewUri(vscode.Uri.file(''));
        const m = /^[^.]*/.exec(dummyUri.authority);
        const webviewId = (m === null || m === void 0 ? void 0 : m[0]) || '';
        return `webview-panel/webview-${webviewId}`;
    }
    getIndex(id) {
        return this.plots.findIndex((plt) => plt.id === id);
    }
    handleResize(height, width, userTriggered = false) {
        this.viewHeight = height;
        this.viewWidth = width;
        if (userTriggered || this.resizeTimeoutLength === 0) {
            if (this.resizeTimeout) {
                clearTimeout(this.resizeTimeout);
            }
            this.resizeTimeout = undefined;
            void this.resizePlot();
        }
        else if (!this.resizeTimeout) {
            this.resizeTimeout = setTimeout(() => {
                void this.resizePlot().then(() => this.resizeTimeout = undefined);
            }, this.resizeTimeoutLength);
        }
    }
    async resizePlot(id) {
        id !== null && id !== void 0 ? id : (id = this.activePlot);
        if (!id) {
            return;
        }
        const plt = await this.getPlotContent(id, this.viewWidth, this.viewHeight, this.zoom);
        this.plotWidth = plt.width;
        this.plotHeight = plt.height;
        this.updatePlot(plt);
    }
    async refreshPlotsDelayed(plotsIdResponse, redraw = false, force = false) {
        if (this.refreshTimeoutLength === 0) {
            await this.refreshPlots(plotsIdResponse, redraw, force);
        }
        else {
            clearTimeout(this.refreshTimeout);
            this.refreshTimeout = setTimeout(() => {
                void this.refreshPlots(plotsIdResponse, redraw, force).then(() => this.refreshTimeout = undefined);
            }, this.refreshTimeoutLength);
        }
    }
    async refreshPlots(plotsIdResponse, redraw = false, force = false) {
        var _a;
        const nPlots = this.plots.length;
        let plotIds = plotsIdResponse.map((x) => x.id);
        plotIds = plotIds.filter((id) => !this.hiddenPlots.includes(id));
        const newPlotPromises = plotIds.map(async (id) => {
            const plot = this.plots.find((plt) => plt.id === id);
            if (force || !plot || id === this.activePlot) {
                return await this.getPlotContent(id, this.viewWidth, this.viewHeight, this.zoom);
            }
            else {
                return plot;
            }
        });
        const newPlots = await Promise.all(newPlotPromises);
        const oldPlotIds = this.plots.map(plt => plt.id);
        this.plots = newPlots;
        if (this.plots.length !== nPlots) {
            this.activePlot = (_a = this.plots[this.plots.length - 1]) === null || _a === void 0 ? void 0 : _a.id;
        }
        if (redraw || !this.webviewPanel) {
            this.refreshHtml();
        }
        else {
            for (const plt of this.plots) {
                if (oldPlotIds.includes(plt.id)) {
                    this.updatePlot(plt);
                }
                else {
                    this.addPlot(plt);
                }
            }
            this._focusPlot();
        }
    }
    updatePlot(plt) {
        const msg = {
            message: 'updatePlot',
            plotId: plt.id,
            svg: plt.data
        };
        this.postWebviewMessage(msg);
    }
    addPlot(plt) {
        const ejsData = this.makeEjsData();
        ejsData.plot = plt;
        const html = ejs.render(this.smallPlotTemplate, ejsData);
        const msg = {
            message: 'addPlot',
            html: html
        };
        this.postWebviewMessage(msg);
        void this.focusPlot(plt.id);
        void this.setContextValues();
    }
    // get content of a single plot
    async getPlotContent(id, width, height, zoom) {
        var _a, _b;
        const args = {
            id: id,
            height: height,
            width: width,
            zoom: zoom,
            renderer: 'svgp'
        };
        const plotContent = await this.api.getPlot(args);
        const svg = await (plotContent === null || plotContent === void 0 ? void 0 : plotContent.text()) || '';
        const plt = {
            id: id,
            data: svg,
            height: height,
            width: width,
            zoom: zoom,
        };
        (_a = this.viewHeight) !== null && _a !== void 0 ? _a : (this.viewHeight = plt.height);
        (_b = this.viewWidth) !== null && _b !== void 0 ? _b : (this.viewWidth = plt.width);
        return plt;
    }
    // functions for initial or re-drawing of html:
    refreshHtml() {
        var _a;
        (_a = this.webviewPanel) !== null && _a !== void 0 ? _a : (this.webviewPanel = this.makeNewWebview());
        this.webviewPanel.webview.html = '';
        this.webviewPanel.webview.html = this.makeHtml();
        // make sure that fullWindow is set correctly:
        this.toggleFullWindow(this.fullWindow);
        void this.setContextValues(true);
    }
    makeHtml() {
        const ejsData = this.makeEjsData();
        const html = ejs.render(this.htmlTemplate, ejsData);
        return html;
    }
    makeEjsData() {
        var _a;
        const asLocalPath = (relPath) => {
            if (!this.webviewPanel) {
                return relPath;
            }
            const localUri = vscode.Uri.file(path.join(this.htmlRoot, relPath));
            return localUri.fsPath;
        };
        const asWebViewPath = (localPath) => {
            if (!this.webviewPanel) {
                return localPath;
            }
            const localUri = vscode.Uri.file(path.join(this.htmlRoot, localPath));
            const webViewUri = this.webviewPanel.webview.asWebviewUri(localUri);
            return webViewUri.toString();
        };
        const makeCommandUri = (command, ...args) => {
            const argString = encodeURIComponent(JSON.stringify(args));
            return `command:${command}?${argString}`;
        };
        let overwriteCssPath = '';
        if (this.customOverwriteCssPath) {
            const uri = vscode.Uri.file(this.customOverwriteCssPath);
            overwriteCssPath = ((_a = this.webviewPanel) === null || _a === void 0 ? void 0 : _a.webview.asWebviewUri(uri).toString()) || '';
        }
        else {
            overwriteCssPath = asWebViewPath('styleOverwrites.css');
        }
        const ejsData = {
            overwriteStyles: this.stripStyles,
            previewPlotLayout: this.previewPlotLayout,
            plots: this.plots,
            largePlot: this.plots[this.activeIndex],
            activePlot: this.activePlot,
            host: this.host,
            asLocalPath: asLocalPath,
            asWebViewPath: asWebViewPath,
            makeCommandUri: makeCommandUri,
            overwriteCssPath: overwriteCssPath
        };
        return ejsData;
    }
    makeNewWebview(showOptions) {
        const webviewPanel = vscode.window.createWebviewPanel('RPlot', 'R Plot', showOptions || this.showOptions, this.webviewOptions);
        webviewPanel.iconPath = new util_1.UriIcon('graph');
        webviewPanel.onDidDispose(() => this.webviewPanel = undefined);
        webviewPanel.onDidChangeViewState(() => {
            void this.setContextValues();
        });
        webviewPanel.webview.onDidReceiveMessage((e) => {
            this.handleWebviewMessage(e);
        });
        return webviewPanel;
    }
    handleWebviewMessage(msg) {
        if (msg.message === 'log') {
            console.log(msg.body);
        }
        else if (msg.message === 'resize') {
            const height = msg.height;
            const width = msg.width;
            const userTriggered = msg.userTriggered;
            void this.handleResize(height, width, userTriggered);
        }
    }
    postWebviewMessage(msg) {
        var _a;
        (_a = this.webviewPanel) === null || _a === void 0 ? void 0 : _a.webview.postMessage(msg);
    }
    // export plot
    // if no format supplied, show a quickpick menu etc.
    // if no filename supplied, show selector window
    async exportPlot(id, rendererId, outFile) {
        var _a, _b, _c;
        // make sure id is valid or return:
        id || (id = this.activePlot || ((_a = this.plots[this.plots.length - 1]) === null || _a === void 0 ? void 0 : _a.id));
        const plot = this.plots.find((plt) => plt.id === id);
        if (!plot) {
            void vscode.window.showWarningMessage('No plot available for export.');
            return;
        }
        // make sure format is valid or return:
        if (!rendererId) {
            const renderers = this.api.getRenderers();
            const qpItems = renderers.map(renderer => ({
                label: renderer.name,
                detail: renderer.descr,
                id: renderer.id
            }));
            const options = {
                placeHolder: 'Please choose a file format'
            };
            // format = await vscode.window.showQuickPick(formats, options);
            const qpPick = await vscode.window.showQuickPick(qpItems, options);
            rendererId = qpPick === null || qpPick === void 0 ? void 0 : qpPick.id;
            if (!rendererId) {
                return;
            }
        }
        // make sure outFile is valid or return:
        if (!outFile) {
            const options = {};
            // Suggest a file extension:
            const renderer = this.api.getRenderers().find(r => r.id === rendererId);
            const ext = renderer === null || renderer === void 0 ? void 0 : renderer.ext.replace(/^\./, '');
            // try to set default URI:
            if (this.lastExportUri) {
                const noExtPath = this.lastExportUri.fsPath.replace(/\.[^.]*$/, '');
                const defaultPath = noExtPath + (ext ? `.${ext}` : '');
                options.defaultUri = vscode.Uri.file(defaultPath);
            }
            else {
                // construct default Uri
                const defaultFolder = (_c = (_b = vscode.workspace.workspaceFolders) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.uri.fsPath;
                if (defaultFolder) {
                    const defaultName = 'plot' + (ext ? `.${ext}` : '');
                    options.defaultUri = vscode.Uri.file(path.join(defaultFolder, defaultName));
                }
            }
            // set file extension filter
            if (ext && (renderer === null || renderer === void 0 ? void 0 : renderer.name)) {
                options.filters = {
                    [renderer.name]: [ext],
                    ['All']: ['*'],
                };
            }
            const outUri = await vscode.window.showSaveDialog(options);
            if (outUri) {
                this.lastExportUri = outUri;
                outFile = outUri.fsPath;
            }
            else {
                return;
            }
        }
        // get plot:
        const plt = await this.api.getPlot({
            id: this.activePlot,
            renderer: rendererId
        }); // I am not sure why eslint thinks this is the 
        // browser Response object and not the node-fetch one. 
        // cross-fetch problem or config problem in vscode-r?
        const dest = fs.createWriteStream(outFile);
        dest.on('error', (err) => void vscode.window.showErrorMessage(`Export failed: ${err.message}`));
        dest.on('close', () => void vscode.window.showInformationMessage(`Export done: ${outFile}`));
        void plt.body.pipe(dest);
    }
    // Dispose-function to clean up when vscode closes
    // E.g. to close connections etc., notify R, ...
    dispose() {
        this.api.disconnect();
    }
}
exports.HttpgdViewer = HttpgdViewer;
function findItemOfType(arr, type) {
    const item = arr.find((elm) => typeof elm === type);
    return item;
}
//# sourceMappingURL=index.js.map