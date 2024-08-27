/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use strict';
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
exports.writeSuccessResponse = exports.writeResponse = exports.getWebviewHtml = exports.getListHtml = exports.getTableHtml = exports.showDataView = exports.showWebView = exports.openExternalBrowser = exports.refreshBrowser = exports.showBrowser = exports.removeSessionFiles = exports.sessionDirectoryExists = exports.removeDirectory = exports.attachActive = exports.startRequestWatcher = exports.deploySessionWatcher = exports.globalenvFile = exports.workingDir = exports.sessionDir = exports.requestLockFile = exports.requestFile = exports.globalenv = void 0;
const fs = __importStar(require("fs-extra"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const vscode_1 = require("vscode");
const rTerminal_1 = require("./rTerminal");
const util_1 = require("./util");
const rstudioapi_1 = require("./rstudioapi");
const extension_1 = require("./extension");
const liveShare_1 = require("./liveShare");
let resDir;
let requestTimeStamp;
let responseTimeStamp;
let rVer;
let pid;
let info;
let globalenvLockFile;
let globalenvTimeStamp;
let plotFile;
let plotLockFile;
let plotTimeStamp;
let globalEnvWatcher;
let plotWatcher;
let activeBrowserPanel;
let activeBrowserUri;
let activeBrowserExternalUri;
function deploySessionWatcher(extensionPath) {
    console.info(`[deploySessionWatcher] extensionPath: ${extensionPath}`);
    resDir = path.join(extensionPath, 'dist', 'resources');
    const initPath = path.join(extensionPath, 'R', 'session', 'init.R');
    const linkPath = path.join((0, extension_1.homeExtDir)(), 'init.R');
    fs.writeFileSync(linkPath, `local(source("${initPath.replace(/\\/g, '\\\\')}", chdir = TRUE, local = TRUE))\n`);
    writeSettings();
    vscode_1.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('r')) {
            writeSettings();
        }
    });
}
exports.deploySessionWatcher = deploySessionWatcher;
function startRequestWatcher(sessionStatusBarItem) {
    console.info('[startRequestWatcher] Starting');
    exports.requestFile = path.join((0, extension_1.homeExtDir)(), 'request.log');
    exports.requestLockFile = path.join((0, extension_1.homeExtDir)(), 'request.lock');
    requestTimeStamp = 0;
    responseTimeStamp = 0;
    if (!fs.existsSync(exports.requestLockFile)) {
        fs.createFileSync(exports.requestLockFile);
    }
    fs.watch(exports.requestLockFile, {}, () => {
        void updateRequest(sessionStatusBarItem);
    });
    console.info('[startRequestWatcher] Done');
}
exports.startRequestWatcher = startRequestWatcher;
function attachActive() {
    if ((0, util_1.config)().get('sessionWatcher')) {
        console.info('[attachActive]');
        void (0, rTerminal_1.runTextInTerm)('.vsc.attach()');
        if ((0, liveShare_1.isLiveShare)() && liveShare_1.shareWorkspace) {
            liveShare_1.rHostService.notifyRequest(exports.requestFile, true);
        }
    }
    else {
        void vscode_1.window.showInformationMessage('This command requires that r.sessionWatcher be enabled.');
    }
}
exports.attachActive = attachActive;
function removeDirectory(dir) {
    console.info(`[removeDirectory] dir: ${dir}`);
    if (fs.existsSync(dir)) {
        console.info('[removeDirectory] dir exists');
        fs.readdirSync(dir)
            .forEach((file) => {
            const curPath = path.join(dir, file);
            console.info(`[removeDirectory] Remove ${curPath}`);
            fs.unlinkSync(curPath);
        });
        console.info(`[removeDirectory] Remove dir ${dir}`);
        fs.rmdirSync(dir);
    }
    console.info('[removeDirectory] Done');
}
exports.removeDirectory = removeDirectory;
function sessionDirectoryExists() {
    return (fs.existsSync(exports.sessionDir));
}
exports.sessionDirectoryExists = sessionDirectoryExists;
function removeSessionFiles() {
    console.info('[removeSessionFiles] ', exports.sessionDir);
    if (sessionDirectoryExists()) {
        removeDirectory(exports.sessionDir);
    }
    console.info('[removeSessionFiles] Done');
}
exports.removeSessionFiles = removeSessionFiles;
function writeSettings() {
    const settingPath = path.join((0, extension_1.homeExtDir)(), 'settings.json');
    fs.writeFileSync(settingPath, JSON.stringify((0, util_1.config)()));
}
function updateSessionWatcher() {
    console.info(`[updateSessionWatcher] PID: ${pid}`);
    console.info('[updateSessionWatcher] Create globalEnvWatcher');
    exports.globalenvFile = path.join(exports.sessionDir, 'globalenv.json');
    globalenvLockFile = path.join(exports.sessionDir, 'globalenv.lock');
    globalenvTimeStamp = 0;
    if (globalEnvWatcher !== undefined) {
        globalEnvWatcher.close();
    }
    if (fs.existsSync(globalenvLockFile)) {
        globalEnvWatcher = fs.watch(globalenvLockFile, {}, () => {
            void updateGlobalenv();
        });
        void updateGlobalenv();
    }
    else {
        console.info('[updateSessionWatcher] globalenvLockFile not found');
    }
    console.info('[updateSessionWatcher] Create plotWatcher');
    plotFile = path.join(exports.sessionDir, 'plot.png');
    plotLockFile = path.join(exports.sessionDir, 'plot.lock');
    plotTimeStamp = 0;
    if (plotWatcher !== undefined) {
        plotWatcher.close();
    }
    if (fs.existsSync(plotLockFile)) {
        plotWatcher = fs.watch(plotLockFile, {}, () => {
            void updatePlot();
        });
        void updatePlot();
    }
    else {
        console.info('[updateSessionWatcher] plotLockFile not found');
    }
    console.info('[updateSessionWatcher] Done');
}
async function updatePlot() {
    console.info(`[updatePlot] ${plotFile}`);
    const lockContent = await fs.readFile(plotLockFile, 'utf8');
    const newTimeStamp = Number.parseFloat(lockContent);
    if (newTimeStamp !== plotTimeStamp) {
        plotTimeStamp = newTimeStamp;
        if (fs.existsSync(plotFile) && fs.statSync(plotFile).size > 0) {
            void vscode_1.commands.executeCommand('vscode.open', vscode_1.Uri.file(plotFile), {
                preserveFocus: true,
                preview: true,
                viewColumn: vscode_1.ViewColumn[(0, util_1.config)().get('session.viewers.viewColumn.plot')],
            });
            console.info('[updatePlot] Done');
            if ((0, liveShare_1.isLiveShare)()) {
                void liveShare_1.rHostService.notifyPlot(plotFile);
            }
        }
        else {
            console.info('[updatePlot] File not found');
        }
    }
}
async function updateGlobalenv() {
    console.info(`[updateGlobalenv] ${exports.globalenvFile}`);
    const lockContent = await fs.readFile(globalenvLockFile, 'utf8');
    const newTimeStamp = Number.parseFloat(lockContent);
    if (newTimeStamp !== globalenvTimeStamp) {
        globalenvTimeStamp = newTimeStamp;
        if (fs.existsSync(exports.globalenvFile)) {
            const content = await fs.readFile(exports.globalenvFile, 'utf8');
            exports.globalenv = JSON.parse(content);
            void (extension_1.rWorkspace === null || extension_1.rWorkspace === void 0 ? void 0 : extension_1.rWorkspace.refresh());
            console.info('[updateGlobalenv] Done');
            if ((0, liveShare_1.isLiveShare)()) {
                liveShare_1.rHostService.notifyGlobalenv(exports.globalenv);
            }
        }
        else {
            console.info('[updateGlobalenv] File not found');
        }
    }
}
async function showBrowser(url, title, viewer) {
    console.info(`[showBrowser] uri: ${url}, viewer: ${viewer.toString()}`);
    const uri = vscode_1.Uri.parse(url);
    if (viewer === false) {
        void vscode_1.env.openExternal(uri);
    }
    else {
        const externalUri = await vscode_1.env.asExternalUri(uri);
        const panel = vscode_1.window.createWebviewPanel('browser', title, {
            preserveFocus: true,
            viewColumn: vscode_1.ViewColumn[String(viewer)],
        }, {
            enableFindWidget: true,
            enableScripts: true,
            retainContextWhenHidden: true,
        });
        if ((0, liveShare_1.isHost)()) {
            await (0, liveShare_1.shareBrowser)(url, title);
        }
        panel.onDidChangeViewState((e) => {
            if (e.webviewPanel.active) {
                activeBrowserPanel = panel;
                activeBrowserUri = uri;
                activeBrowserExternalUri = externalUri;
            }
            else {
                activeBrowserPanel = undefined;
                activeBrowserUri = undefined;
                activeBrowserExternalUri = undefined;
            }
            void vscode_1.commands.executeCommand('setContext', 'r.browser.active', e.webviewPanel.active);
        });
        panel.onDidDispose(() => {
            activeBrowserPanel = undefined;
            activeBrowserUri = undefined;
            activeBrowserExternalUri = undefined;
            if ((0, liveShare_1.isHost)()) {
                (0, liveShare_1.closeBrowser)(url);
            }
            void vscode_1.commands.executeCommand('setContext', 'r.browser.active', false);
        });
        panel.iconPath = new util_1.UriIcon('globe');
        panel.webview.html = getBrowserHtml(externalUri);
    }
    console.info('[showBrowser] Done');
}
exports.showBrowser = showBrowser;
function getBrowserHtml(uri) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    html, body {
        height: 100%;
        padding: 0;
        overflow: hidden;
    }
  </style>
</head>
<body>
    <iframe src="${uri.toString(true)}" width="100%" height="100%" frameborder="0" />
</body>
</html>
`;
}
function refreshBrowser() {
    console.log('[refreshBrowser]');
    if (activeBrowserPanel) {
        activeBrowserPanel.webview.html = '';
        activeBrowserPanel.webview.html = getBrowserHtml(activeBrowserExternalUri);
    }
}
exports.refreshBrowser = refreshBrowser;
function openExternalBrowser() {
    console.log('[openExternalBrowser]');
    if (activeBrowserUri) {
        void vscode_1.env.openExternal(activeBrowserUri);
    }
}
exports.openExternalBrowser = openExternalBrowser;
async function showWebView(file, title, viewer) {
    console.info(`[showWebView] file: ${file}, viewer: ${viewer.toString()}`);
    if (viewer === false) {
        void vscode_1.env.openExternal(vscode_1.Uri.file(file));
    }
    else {
        const dir = path.dirname(file);
        const webviewDir = extension_1.extensionContext.asAbsolutePath('html/session/webview/');
        const panel = vscode_1.window.createWebviewPanel('webview', title, {
            preserveFocus: true,
            viewColumn: vscode_1.ViewColumn[String(viewer)],
        }, {
            enableScripts: true,
            enableFindWidget: true,
            retainContextWhenHidden: true,
            localResourceRoots: [vscode_1.Uri.file(dir), vscode_1.Uri.file(webviewDir)],
        });
        panel.iconPath = new util_1.UriIcon('globe');
        panel.webview.html = await getWebviewHtml(panel.webview, file, title, dir, webviewDir);
    }
    console.info('[showWebView] Done');
}
exports.showWebView = showWebView;
async function showDataView(source, type, title, file, viewer) {
    console.info(`[showDataView] source: ${source}, type: ${type}, title: ${title}, file: ${file}, viewer: ${viewer}`);
    if (liveShare_1.isGuestSession) {
        resDir = liveShare_1.guestResDir;
    }
    if (source === 'table') {
        const panel = vscode_1.window.createWebviewPanel('dataview', title, {
            preserveFocus: true,
            viewColumn: vscode_1.ViewColumn[viewer],
        }, {
            enableScripts: true,
            enableFindWidget: true,
            retainContextWhenHidden: true,
            localResourceRoots: [vscode_1.Uri.file(resDir)],
        });
        const content = await getTableHtml(panel.webview, file);
        panel.iconPath = new util_1.UriIcon('open-preview');
        panel.webview.html = content;
    }
    else if (source === 'list') {
        const panel = vscode_1.window.createWebviewPanel('dataview', title, {
            preserveFocus: true,
            viewColumn: vscode_1.ViewColumn[viewer],
        }, {
            enableScripts: true,
            enableFindWidget: true,
            retainContextWhenHidden: true,
            localResourceRoots: [vscode_1.Uri.file(resDir)],
        });
        const content = await getListHtml(panel.webview, file);
        panel.iconPath = new util_1.UriIcon('open-preview');
        panel.webview.html = content;
    }
    else {
        if (liveShare_1.isGuestSession) {
            const fileContent = await liveShare_1.rGuestService.requestFileContent(file, 'utf8');
            await (0, liveShare_1.openVirtualDoc)(file, fileContent, true, true, vscode_1.ViewColumn[viewer]);
        }
        else {
            await vscode_1.commands.executeCommand('vscode.open', vscode_1.Uri.file(file), {
                preserveFocus: true,
                preview: true,
                viewColumn: vscode_1.ViewColumn[viewer],
            });
        }
    }
    console.info('[showDataView] Done');
}
exports.showDataView = showDataView;
async function getTableHtml(webview, file) {
    resDir = liveShare_1.isGuestSession ? liveShare_1.guestResDir : resDir;
    const content = await (0, util_1.readContent)(file, 'utf8');
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style media="only screen">
    html, body {
        height: 100%;
        width: 100%;
        margin: 0;
        box-sizing: border-box;
        -webkit-overflow-scrolling: touch;
    }

    html {
        position: absolute;
        top: 0;
        left: 0;
        padding: 0;
        overflow: auto;
    }

    body {
        padding: 0;
        overflow: auto;
    }

    /* Styling for wrapper and header */

    [class*="vscode"] div.ag-root-wrapper {
        background-color: var(--vscode-editor-background);
    }

    [class*="vscode"] div.ag-header {
        background-color: var(--vscode-sideBar-background);
    }

    [class*="vscode"] div.ag-header-cell[aria-sort="ascending"], div.ag-header-cell[aria-sort="descending"] {
        color: var(--vscode-textLink-activeForeground);
    }

    /* Styling for rows and cells */

    [class*="vscode"] div.ag-row {
        color: var(--vscode-editor-foreground);
    }

    [class*="vscode"] .ag-row-hover {
        background-color: var(--vscode-list-hoverBackground) !important;
        color: var(--vscode-list-hoverForeground);
    }

    [class*="vscode"] .ag-row-selected {
        background-color: var(--vscode-editor-selectionBackground) !important;
        color: var(--vscode-editor-selectionForeground) !important;
    }

    [class*="vscode"] div.ag-row-even {
        border: 0px;
        background-color: var(--vscode-editor-background);
    }

    [class*="vscode"] div.ag-row-odd {
        border: 0px;
        background-color: var(--vscode-sideBar-background);
    }

    [class*="vscode"] div.ag-ltr div.ag-has-focus div.ag-cell-focus:not(div.ag-cell-range-selected) {
        border-color: var(--vscode-editorCursor-foreground);
    }

    /* Styling for the filter pop-up */

    [class*="vscode"] div.ag-menu {
        background-color: var(--vscode-notifications-background);
        color: var(--vscode-notifications-foreground);
        border-color: var(--vscode-notifications-border);
    }

    [class*="vscode"] div.ag-filter-apply-panel-button {
        background-color: var(--vscode-button-background);
        color: var(--vscode-button-foreground);
        border: 0;
        padding: 5px 10px;
        font-size: 12px;
    }

    [class*="vscode"] div.ag-picker-field-wrapper {
        background-color: var(--vscode-editor-background);
        color: var(--vscode-editor-foreground);
        border-color: var(--vscode-notificationCenter-border);
    }

    [class*="vscode"] input[class^=ag-] {
        border-color: var(--vscode-notificationCenter-border) !important;
    }
  </style>
  <script src="${String(webview.asWebviewUri(vscode_1.Uri.file(path.join(resDir, 'ag-grid-community.min.noStyle.js'))))}"></script>
  <link href="${String(webview.asWebviewUri(vscode_1.Uri.file(path.join(resDir, 'ag-grid.min.css'))))}" rel="stylesheet">
  <link href="${String(webview.asWebviewUri(vscode_1.Uri.file(path.join(resDir, 'ag-theme-balham.min.css'))))}" rel="stylesheet">
  <link href="${String(webview.asWebviewUri(vscode_1.Uri.file(path.join(resDir, 'ag-theme-balham-dark.min.css'))))}" rel="stylesheet">
  <script>
    const dateFilterParams = {
        browserDatePicker: true,
        comparator: function (filterLocalDateAtMidnight, cellValue) {
            var dateAsString = cellValue;
            if (dateAsString == null) return -1;
            var dateParts = dateAsString.split('-');
            var cellDate = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2].substr(0, 2)));
            if (filterLocalDateAtMidnight.getTime() == cellDate.getTime()) {
                return 0;
            }
            if (cellDate < filterLocalDateAtMidnight) {
                return -1;
            }
            if (cellDate > filterLocalDateAtMidnight) {
                return 1;
            }
        }
    };
    const data = ${String(content)};
    const gridOptions = {
        defaultColDef: {
            sortable: true,
            resizable: true,
            filter: true,
            filterParams: {
            buttons: ['reset', 'apply']
            }
        },
        columnDefs: data.columns,
        rowData: data.data,
        rowSelection: 'multiple',
        pagination: true,
        enableCellTextSelection: true,
        ensureDomOrder: true,
        tooltipShowDelay: 100,
        onGridReady: function (params) {
            gridOptions.api.sizeColumnsToFit();
            autoSizeAll(false);
        }
    };
    function updateTheme() {
        const gridDiv = document.querySelector('#myGrid');
        if (document.body.classList.contains('vscode-light')) {
            gridDiv.className = 'ag-theme-balham';
        } else {
            gridDiv.className = 'ag-theme-balham-dark';
        }
    }
    function autoSizeAll(skipHeader) {
        var allColumnIds = [];
        gridOptions.columnApi.getAllColumns().forEach(function (column) {
            allColumnIds.push(column.colId);
        });
        gridOptions.columnApi.autoSizeColumns(allColumnIds, skipHeader);
    }
    document.addEventListener('DOMContentLoaded', () => {
        gridOptions.columnDefs.forEach(function(column) {
            if (column.type === 'dateColumn') {
                column.filterParams = dateFilterParams;
            }
        });
        const gridDiv = document.querySelector('#myGrid');
        new agGrid.Grid(gridDiv, gridOptions);
    });
    function onload() {
        updateTheme();
        const observer = new MutationObserver(function (event) {
            updateTheme();
        });
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class'],
            childList: false,
            characterData: false
        });
    }
  </script>
</head>
<body onload='onload()'>
  <div id="myGrid" style="height: 100%;"></div>
</body>
</html>
`;
}
exports.getTableHtml = getTableHtml;
async function getListHtml(webview, file) {
    resDir = liveShare_1.isGuestSession ? liveShare_1.guestResDir : resDir;
    const content = await (0, util_1.readContent)(file, 'utf8');
    return `
<!doctype HTML>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="${String(webview.asWebviewUri(vscode_1.Uri.file(path.join(resDir, 'jquery.min.js'))))}"></script>
  <script src="${String(webview.asWebviewUri(vscode_1.Uri.file(path.join(resDir, 'jquery.json-viewer.js'))))}"></script>
  <link href="${String(webview.asWebviewUri(vscode_1.Uri.file(path.join(resDir, 'jquery.json-viewer.css'))))}" rel="stylesheet">
  <style type="text/css">
    body {
        color: var(--vscode-editor-foreground);
        background-color: var(--vscode-editor-background);
    }

    .json-document {
        padding: 0 0;
    }

    pre#json-renderer {
        font-family: var(--vscode-editor-font-family);
        border: 0;
    }

    ul.json-dict, ol.json-array {
        color: var(--vscode-symbolIcon-fieldForeground);
        border-left: 1px dotted var(--vscode-editorLineNumber-foreground);
    }

    .json-literal {
        color: var(--vscode-symbolIcon-variableForeground);
    }

    .json-string {
        color: var(--vscode-symbolIcon-stringForeground);
    }

    a.json-toggle:before {
        color: var(--vscode-button-secondaryBackground);
    }

    a.json-toggle:hover:before {
        color: var(--vscode-button-secondaryHoverBackground);
    }

    a.json-placeholder {
        color: var(--vscode-input-placeholderForeground);
    }
  </style>
  <script>
    var data = ${String(content)};
    $(document).ready(function() {
      var options = {
        collapsed: false,
        rootCollapsable: false,
        withQuotes: false,
        withLinks: true
      };
      $("#json-renderer").jsonViewer(data, options);
    });
  </script>
</head>
<body>
  <pre id="json-renderer"></pre>
</body>
</html>
`;
}
exports.getListHtml = getListHtml;
async function getWebviewHtml(webview, file, title, dir, webviewDir) {
    const observerPath = vscode_1.Uri.file(path.join(webviewDir, 'observer.js'));
    const body = (await (0, util_1.readContent)(file, 'utf8')).toString()
        .replace(/<(\w+)(.*)\s+(href|src)="(?!\w+:)/g, `<$1 $2 $3="${String(webview.asWebviewUri(vscode_1.Uri.file(dir)))}/`);
    // define the content security policy for the webview
    // * whilst it is recommended to be strict as possible,
    // * there are several packages that require unsafe requests
    const CSP = `
        upgrade-insecure-requests;
        default-src https: data: filesystem:;
        style-src https: data: filesystem: 'unsafe-inline';
        script-src https: data: filesystem: 'unsafe-inline' 'unsafe-eval';
    `;
    return `
    <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="Content-Security-Policy" content="${CSP}">
                <title>${title}</title>
                <style>
                    body {
                        color: black;
                    }
                </style>
            </head>
            <body>
                <span id="webview-content">
                    ${body}
                </span>
            </body>
            <script src="${String(webview.asWebviewUri(observerPath))}"></script>
        </html>`;
}
exports.getWebviewHtml = getWebviewHtml;
function isFromWorkspace(dir) {
    if (vscode_1.workspace.workspaceFolders === undefined) {
        let rel = path.relative(os.homedir(), dir);
        if (rel === '') {
            return true;
        }
        rel = path.relative(fs.realpathSync(os.homedir()), dir);
        if (rel === '') {
            return true;
        }
    }
    else {
        for (const folder of vscode_1.workspace.workspaceFolders) {
            let rel = path.relative(folder.uri.fsPath, dir);
            if (!rel.startsWith('..') && !path.isAbsolute(rel)) {
                return true;
            }
            rel = path.relative(fs.realpathSync(folder.uri.fsPath), dir);
            if (!rel.startsWith('..') && !path.isAbsolute(rel)) {
                return true;
            }
        }
    }
    return false;
}
async function writeResponse(responseData, responseSessionDir) {
    const responseFile = path.join(responseSessionDir, 'response.log');
    const responseLockFile = path.join(responseSessionDir, 'response.lock');
    if (!fs.existsSync(responseFile) || !fs.existsSync(responseLockFile)) {
        throw ('Received a request from R for response' +
            'to a session directiory that does not contain response.log or response.lock: ' +
            responseSessionDir);
    }
    const responseString = JSON.stringify(responseData);
    console.info('[writeResponse] Started');
    console.info(`[writeResponse] responseData ${responseString}`);
    console.info(`[writeRespnse] responseFile: ${responseFile}`);
    await fs.writeFile(responseFile, responseString);
    responseTimeStamp = Date.now();
    await fs.writeFile(responseLockFile, `${responseTimeStamp}\n`);
}
exports.writeResponse = writeResponse;
async function writeSuccessResponse(responseSessionDir) {
    await writeResponse({ result: true }, responseSessionDir);
}
exports.writeSuccessResponse = writeSuccessResponse;
async function updateRequest(sessionStatusBarItem) {
    console.info('[updateRequest] Started');
    console.info(`[updateRequest] requestFile: ${exports.requestFile}`);
    const lockContent = await fs.readFile(exports.requestLockFile, 'utf8');
    const newTimeStamp = Number.parseFloat(lockContent);
    if (newTimeStamp !== requestTimeStamp) {
        requestTimeStamp = newTimeStamp;
        const requestContent = await fs.readFile(exports.requestFile, 'utf8');
        console.info(`[updateRequest] request: ${requestContent}`);
        const request = JSON.parse(requestContent);
        if (isFromWorkspace(request.wd)) {
            if (request.uuid === null || request.uuid === undefined || request.uuid === liveShare_1.UUID) {
                switch (request.command) {
                    case 'help': {
                        if (extension_1.globalRHelp) {
                            console.log(request.requestPath);
                            void extension_1.globalRHelp.showHelpForPath(request.requestPath, request.viewer);
                        }
                        break;
                    }
                    case 'httpgd': {
                        if (request.url) {
                            extension_1.globalHttpgdManager === null || extension_1.globalHttpgdManager === void 0 ? void 0 : extension_1.globalHttpgdManager.showViewer(request.url);
                        }
                        break;
                    }
                    case 'attach': {
                        rVer = String(request.version);
                        pid = String(request.pid);
                        info = request.info;
                        exports.sessionDir = path.join(request.tempdir, 'vscode-R');
                        exports.workingDir = request.wd;
                        console.info(`[updateRequest] attach PID: ${pid}`);
                        sessionStatusBarItem.text = `R ${rVer}: ${pid}`;
                        sessionStatusBarItem.tooltip = `${info.version}\nProcess ID: ${pid}\nCommand: ${info.command}\nStart time: ${info.start_time}\nClick to attach to active terminal.`;
                        sessionStatusBarItem.show();
                        updateSessionWatcher();
                        (0, rstudioapi_1.purgeAddinPickerItems)();
                        if (request.plot_url) {
                            extension_1.globalHttpgdManager === null || extension_1.globalHttpgdManager === void 0 ? void 0 : extension_1.globalHttpgdManager.showViewer(request.plot_url);
                        }
                        break;
                    }
                    case 'browser': {
                        await showBrowser(request.url, request.title, request.viewer);
                        break;
                    }
                    case 'webview': {
                        void showWebView(request.file, request.title, request.viewer);
                        break;
                    }
                    case 'dataview': {
                        void showDataView(request.source, request.type, request.title, request.file, request.viewer);
                        break;
                    }
                    case 'rstudioapi': {
                        await (0, rstudioapi_1.dispatchRStudioAPICall)(request.action, request.args, request.sd);
                        break;
                    }
                    default:
                        console.error(`[updateRequest] Unsupported command: ${request.command}`);
                }
            }
        }
        else {
            console.info(`[updateRequest] Ignored request outside workspace`);
        }
        if ((0, liveShare_1.isLiveShare)()) {
            void liveShare_1.rHostService.notifyRequest(exports.requestFile);
        }
    }
}
//# sourceMappingURL=session.js.map