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
exports.closeBrowser = exports.shareBrowser = exports.updateGuestPlot = exports.updateGuestGlobalenv = exports.updateGuestRequest = exports.attachActiveGuest = exports.detachGuest = exports.initGuest = exports.browserDisposables = exports.guestResDir = exports.guestGlobalenv = void 0;
const path = require("path");
const vscode = __importStar(require("vscode"));
const extension_1 = require("../extension");
const util_1 = require("../util");
const session_1 = require("../session");
const _1 = require(".");
const shareTree_1 = require("./shareTree");
const virtualDocs_1 = require("./virtualDocs");
// Workspace Vars
let guestPid;
let rVer;
let info;
// Browser Vars
// Used to keep track of shared browsers
exports.browserDisposables = [];
function initGuest(context) {
    // create status bar item that contains info about the *guest* session watcher
    console.info('Create guestSessionStatusBarItem');
    const sessionStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000);
    sessionStatusBarItem.command = 'r.attachActiveGuest';
    sessionStatusBarItem.text = 'Guest R: (not attached)';
    sessionStatusBarItem.tooltip = 'Click to attach to host terminal';
    sessionStatusBarItem.show();
    context.subscriptions.push(sessionStatusBarItem, vscode.workspace.registerTextDocumentContentProvider(virtualDocs_1.docScheme, virtualDocs_1.docProvider));
    _1.rGuestService.setStatusBarItem(sessionStatusBarItem);
    exports.guestResDir = path.join(context.extensionPath, 'dist', 'resources');
}
exports.initGuest = initGuest;
function detachGuest() {
    console.info('[Guest Service] detach guest from workspace');
    _1._sessionStatusBarItem.text = 'Guest R: (not attached)';
    _1._sessionStatusBarItem.tooltip = 'Click to attach to host terminal';
    exports.guestGlobalenv = undefined;
    extension_1.rWorkspace === null || extension_1.rWorkspace === void 0 ? void 0 : extension_1.rWorkspace.refresh();
}
exports.detachGuest = detachGuest;
function attachActiveGuest() {
    if ((0, util_1.config)().get('sessionWatcher')) {
        console.info('[attachActiveGuest]');
        void _1.rGuestService.requestAttach();
    }
    else {
        void vscode.window.showInformationMessage('This command requires that r.sessionWatcher be enabled.');
    }
}
exports.attachActiveGuest = attachActiveGuest;
// Guest version of session.ts updateRequest(), no need to check for changes in files
// as this is handled by the session.ts variant
// the force parameter is used for ensuring that the 'attach' case is appropriately called on guest join
async function updateGuestRequest(file, force = false) {
    const requestContent = await (0, util_1.readContent)(file, 'utf8');
    console.info(`[updateGuestRequest] request: ${requestContent}`);
    if (typeof (requestContent) === 'string') {
        const request = JSON.parse(requestContent);
        if (request && !force) {
            if (request.uuid === null || request.uuid === undefined || request.uuid === _1.UUID) {
                switch (request.command) {
                    case 'help': {
                        if (extension_1.globalRHelp) {
                            console.log(request.requestPath);
                            void extension_1.globalRHelp.showHelpForPath(request.requestPath, request.viewer);
                        }
                        break;
                    }
                    case 'httpgd': {
                        break;
                    }
                    case 'attach': {
                        guestPid = String(request.pid);
                        console.info(`[updateGuestRequest] attach PID: ${guestPid}`);
                        _1._sessionStatusBarItem.text = `Guest R ${rVer}: ${guestPid}`;
                        _1._sessionStatusBarItem.tooltip = `${info.version}\nProcess ID: ${guestPid}\nCommand: ${info.command}\nStart time: ${info.start_time}\nClick to attach to host terminal.`;
                        break;
                    }
                    case 'browser': {
                        await (0, session_1.showBrowser)(request.url, request.title, request.viewer);
                        break;
                    }
                    case 'webview': {
                        void (0, session_1.showWebView)(request.file, request.title, request.viewer);
                        break;
                    }
                    case 'dataview': {
                        void (0, session_1.showDataView)(request.source, request.type, request.title, request.file, request.viewer);
                        break;
                    }
                    case 'rstudioapi': {
                        console.error(`[GuestService] ${request.command} not supported`);
                        break;
                    }
                    default:
                        console.error(`[updateRequest] Unsupported command: ${request.command}`);
                }
            }
        }
        else {
            guestPid = String(request.pid);
            rVer = String(request.version);
            info = request.info;
            console.info(`[updateGuestRequest] attach PID: ${guestPid}`);
            _1._sessionStatusBarItem.text = `Guest R ${rVer}: ${guestPid}`;
            _1._sessionStatusBarItem.tooltip = `${info.version}\nProcess ID: ${guestPid}\nCommand: ${info.command}\nStart time: ${info.start_time}\nClick to attach to host terminal.`;
            _1._sessionStatusBarItem.show();
        }
    }
}
exports.updateGuestRequest = updateGuestRequest;
// Call from host, pass parsed globalenvfile
function updateGuestGlobalenv(hostEnv) {
    if (hostEnv) {
        exports.guestGlobalenv = hostEnv;
        void (extension_1.rWorkspace === null || extension_1.rWorkspace === void 0 ? void 0 : extension_1.rWorkspace.refresh());
        console.info('[updateGuestGlobalenv] Done');
    }
}
exports.updateGuestGlobalenv = updateGuestGlobalenv;
// Instead of creating a file, we pass the base64 of the plot image
// to the guest, and read that into an html page
let panel = undefined;
async function updateGuestPlot(file) {
    const plotContent = await (0, util_1.readContent)(file, 'base64');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const guestPlotView = vscode.ViewColumn[(0, util_1.config)().get('session.viewers.viewColumn.plot')];
    if (plotContent) {
        if (panel) {
            panel.webview.html = getGuestImageHtml(plotContent);
            panel.reveal(guestPlotView, true);
        }
        else {
            panel = vscode.window.createWebviewPanel('dataview', 'R Guest Plot', {
                preserveFocus: true,
                viewColumn: guestPlotView,
            }, {
                enableScripts: true,
                enableFindWidget: true,
                retainContextWhenHidden: true,
                localResourceRoots: [vscode.Uri.file(exports.guestResDir)],
            });
            const content = getGuestImageHtml(plotContent);
            panel.webview.html = content;
            panel.onDidDispose(() => {
                panel = undefined;
            }, undefined, extension_1.extensionContext.subscriptions);
        }
    }
}
exports.updateGuestPlot = updateGuestPlot;
// Purely used in order to decode a base64 string into
// an image format, bypassing saving a file onto the guest's system
function getGuestImageHtml(content) {
    return `
<!doctype HTML>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style type="text/css">
    body {
        color: black;
        background-color: var(--vscode-editor-background);
    }
    img {
        position: absolute;
        top:0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
    }
  </style>
</head>
<body>
  <img src = "data:image/png;base64, ${String(content)}">
</body>
</html>
`;
}
// Share and close browser are called from the
// host session
// Automates sharing browser sessions through the
// shareServer method
async function shareBrowser(url, name, force = false) {
    if (shareTree_1.autoShareBrowser || force) {
        const _url = new URL(url);
        const server = {
            port: parseInt(_url.port),
            displayName: name,
            browseUrl: url,
        };
        const disposable = await _1.liveSession.shareServer(server);
        console.log(`[HostService] shared ${name} at ${url}`);
        exports.browserDisposables.push({ Disposable: disposable, url, name });
    }
}
exports.shareBrowser = shareBrowser;
function closeBrowser(url) {
    var _a;
    (_a = exports.browserDisposables.find(e => e.url === url)) === null || _a === void 0 ? void 0 : _a.Disposable.dispose();
    for (const [key, item] of exports.browserDisposables.entries()) {
        if (item.url === url) {
            exports.browserDisposables.splice(key, 1);
        }
    }
}
exports.closeBrowser = closeBrowser;
//# sourceMappingURL=shareSession.js.map