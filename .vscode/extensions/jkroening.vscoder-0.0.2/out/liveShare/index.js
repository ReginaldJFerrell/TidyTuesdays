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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuestService = exports.HostService = exports.LiveSessionListener = exports.initLiveShare = exports.isHost = exports.isGuest = exports.isLiveShare = exports.UUID = exports.service = exports.ShareProviderName = exports._sessionStatusBarItem = exports.isGuestSession = exports.liveSession = exports.rGuestService = exports.rHostService = void 0;
// re-exported variables
__exportStar(require("./shareCommands"), exports);
__exportStar(require("./shareSession"), exports);
__exportStar(require("./shareTree"), exports);
__exportStar(require("./virtualDocs"), exports);
const vscode = __importStar(require("vscode"));
const vsls = __importStar(require("vsls"));
const extension_1 = require("../extension");
const shareSession_1 = require("./shareSession");
const shareTree_1 = require("./shareTree");
const shareCommands_1 = require("./shareCommands");
const session_1 = require("../session");
const util_1 = require("../util");
/// LiveShare
exports.rHostService = undefined;
exports.rGuestService = undefined;
// service vars
exports.ShareProviderName = 'vscode-r';
exports.service = undefined;
// random number to fake a UUID for differentiating between
// host calls and guest calls (specifically for the workspace
// viewer 'View' function)
exports.UUID = Math.floor(Math.random() * Date.now());
/// state-tracking bools
// Bool to check if live share is loaded and active
function isLiveShare() {
    var _a;
    const shareStarted = (_a = exports.liveSession === null || exports.liveSession === void 0 ? void 0 : exports.liveSession.session) === null || _a === void 0 ? void 0 : _a.id;
    // If there is a hosted session*, return true
    // else return false
    // * using vsls.getApi() instead of vsls.getApi().session.id
    // * will always return true, even if a session is not active
    // * (a session id will only exist if a session is active)
    return !!shareStarted;
}
exports.isLiveShare = isLiveShare;
function isGuest() {
    if (isLiveShare()) {
        return exports.liveSession.session.role === vsls.Role.Guest;
    }
    else {
        return false;
    }
}
exports.isGuest = isGuest;
function isHost() {
    if (isLiveShare()) {
        return exports.liveSession.session.role === vsls.Role.Host;
    }
    else {
        return false;
    }
}
exports.isHost = isHost;
// Initialises the Liveshare functionality for host & guest
// * session watcher is required *
async function initLiveShare(context) {
    if (extension_1.enableSessionWatcher) {
        await LiveSessionListener();
        exports.isGuestSession = isGuest();
        if (!exports.isGuestSession) {
            // Construct tree view for host
            (0, shareTree_1.initTreeView)();
        }
        else {
            // Construct guest session watcher
            (0, shareSession_1.initGuest)(context);
        }
        // Set context value for hiding buttons for guests
        void vscode.commands.executeCommand('setContext', 'r.liveShare:isGuest', exports.isGuestSession);
        // push commands
        if (!exports.isGuestSession) {
            context.subscriptions.push(vscode.commands.registerCommand('r.liveShare.toggle', (node) => node.toggle(shareTree_1.rLiveShareProvider)), vscode.commands.registerCommand('r.liveShare.retry', async () => {
                await LiveSessionListener();
                shareTree_1.rLiveShareProvider.refresh();
            }));
        }
        else {
            context.subscriptions.push(vscode.commands.registerCommand('r.attachActiveGuest', () => (0, shareSession_1.attachActiveGuest)()));
        }
    }
}
exports.initLiveShare = initLiveShare;
// Listens for the activation of a LiveShare session
async function LiveSessionListener() {
    exports.rHostService = new HostService;
    exports.rGuestService = new GuestService;
    // catch errors in case of issues with the
    // LiveShare extension/API (see #671)
    async function tryAPI() {
        try {
            return await Promise.race([
                vsls.getApi(),
                new Promise((res) => setTimeout(() => res(null), (0, util_1.config)().get('liveShare.timeout')))
            ]);
        }
        catch (e) {
            console.log('[LiveSessionListener] an error occured when attempting to access the Live Share API.', e);
            return null;
        }
    }
    // Return out when the vsls extension isn't
    // installed/available
    const liveSessionStatus = await tryAPI();
    void vscode.commands.executeCommand('setContext', 'r.liveShare:aborted', !liveSessionStatus);
    if (!liveSessionStatus) {
        console.log('[LiveSessionListener] aborted');
        return;
    }
    exports.liveSession = liveSessionStatus;
    console.log('[LiveSessionListener] started');
    // When the session state changes, attempt to
    // start a liveSession service, which is responsible
    // for providing session-watcher functionality
    // to guest sessions
    exports.liveSession.onDidChangeSession(async (e) => {
        switch (e.session.role) {
            case vsls.Role.None:
                console.log('[LiveSessionListener] end event');
                await sessionCleanup();
                break;
            case vsls.Role.Guest:
                console.log('[LiveSessionListener] guest event');
                await exports.rGuestService.startService();
                break;
            case vsls.Role.Host:
                console.log('[LiveSessionListener] host event');
                await exports.rHostService.startService();
                shareTree_1.rLiveShareProvider.refresh();
                break;
            default:
                console.log('[LiveSessionListener] default case');
                break;
        }
    }, null, extension_1.extensionContext.subscriptions);
    // onDidChangeSession seems to only activate when the host joins/leaves,
    // or roles are changed somehow - may be a regression in API,
    // this is a workaround for the time being
    switch (exports.liveSession.session.role) {
        case vsls.Role.None:
            break;
        case vsls.Role.Guest:
            console.log('[LiveSessionListener] guest event');
            await exports.rGuestService.startService();
            break;
        default:
            console.log('[LiveSessionListener] host event');
            await exports.rHostService.startService();
            break;
    }
}
exports.LiveSessionListener = LiveSessionListener;
// Communication between the HostService and the GuestService
// typically falls under 2 communication paths (there are exceptions):
//
// 1. a function on the HostService is called, which pushes
// an event (notify), which is picked up by a callback (onNotify)
// e.g. rHostService.notifyRequest
//
// 2. a function on the GuestService is called, which pushes a
// request to the HostService, which is picked up the HostService
// callback and * returned * to the GuestService
// e.g. rGuestService.requestFileContent
//
// Note: If you are wanting the guest/host to run code, you must either ensure that
// the code is accessible from the guest/host, or the guest/host is notified of the
// method by the other role. Calling, for instance, a GuestService method from
// a method only accessible to the host will NOT call the method for the guest.
class HostService {
    constructor() {
        this._isStarted = false;
    }
    // Service state getter
    isStarted() {
        return this._isStarted;
    }
    async startService() {
        // Provides core liveshare functionality
        // The shared service is used as a RPC service
        // to pass messages between the host and guests
        exports.service = await exports.liveSession.shareService(exports.ShareProviderName);
        if (exports.service) {
            this._isStarted = true;
            for (const command in shareCommands_1.Commands.host) {
                void (0, shareCommands_1.liveShareOnRequest)(command, shareCommands_1.Commands.host[command], exports.service);
                console.log(`[HostService] added ${command} callback`);
            }
        }
        else {
            console.error('[HostService] service activation failed');
        }
    }
    async stopService() {
        await exports.liveSession.unshareService(exports.ShareProviderName);
        exports.service = null;
        this._isStarted = false;
    }
    /// Session Syncing ///
    // These are called from the host in order to tell the guest session
    // to update the env/request/plot
    // This way, we don't have to re-create a guest version of the session
    // watcher, and can rely on the host to tell when something needs to be
    // updated
    notifyGlobalenv(hostEnv) {
        if (this._isStarted && shareTree_1.shareWorkspace) {
            void (0, shareCommands_1.liveShareRequest)("NotifyEnvUpdate" /* NotifyEnvUpdate */, hostEnv);
        }
    }
    notifyRequest(file, force = false) {
        if (this._isStarted && shareTree_1.shareWorkspace) {
            void (0, shareCommands_1.liveShareRequest)("NotifyRequestUpdate" /* NotifyRequestUpdate */, file, force);
            void this.notifyGlobalenv(session_1.globalenv);
        }
    }
    notifyPlot(file) {
        if (this._isStarted && shareTree_1.shareWorkspace) {
            void (0, shareCommands_1.liveShareRequest)("NotifyPlotUpdate" /* NotifyPlotUpdate */, file);
        }
    }
    notifyGuestPlotManager(url) {
        if (this._isStarted) {
            void (0, shareCommands_1.liveShareRequest)("NotifyGuestPlotManager" /* NotifyGuestPlotManager */, url);
        }
    }
    orderGuestDetach() {
        if (this._isStarted) {
            void (0, shareCommands_1.liveShareRequest)("OrderDetach" /* OrderDetach */);
        }
    }
}
exports.HostService = HostService;
class GuestService {
    constructor() {
        this._isStarted = false;
    }
    isStarted() {
        return this._isStarted;
    }
    async startService() {
        exports.service = await exports.liveSession.getSharedService(exports.ShareProviderName);
        if (exports.service) {
            this._isStarted = true;
            this.requestAttach();
            for (const command in shareCommands_1.Commands.guest) {
                void (0, shareCommands_1.liveShareOnRequest)(command, shareCommands_1.Commands.guest[command], exports.service);
                console.log(`[GuestService] added ${command} callback`);
            }
        }
        else {
            console.error('[GuestService] service request failed');
        }
    }
    setStatusBarItem(sessionStatusBarItem) {
        exports._sessionStatusBarItem = sessionStatusBarItem;
    }
    // The guest requests the host returns the attach specifications to the guest
    // This ensures that guests without read/write access can still view the
    // R workspace
    requestAttach() {
        if (this._isStarted) {
            void (0, shareCommands_1.liveShareRequest)("RequestAttachGuest" /* RequestAttachGuest */);
            // focus guest term if it exists
            const rTermNameOptions = ['R [Shared]', 'R Interactive [Shared]'];
            const activeTerminalName = vscode.window.activeTerminal.name;
            if (!rTermNameOptions.includes(activeTerminalName)) {
                for (const [i] of vscode.window.terminals.entries()) {
                    const terminal = vscode.window.terminals[i];
                    const terminalName = terminal.name;
                    if (rTermNameOptions.includes(terminalName)) {
                        terminal.show(true);
                    }
                }
            }
        }
    }
    // Used to ensure that the guest can run workspace viewer commands
    // e.g.view, remove, clean
    // * Permissions are handled host-side
    requestRunTextInTerm(text) {
        if (this._isStarted) {
            void (0, shareCommands_1.liveShareRequest)("RequestRunTextInTerm" /* RequestRunTextInTerm */, text);
        }
    }
    async requestFileContent(file, encoding) {
        if (this._isStarted) {
            if (encoding !== undefined) {
                const content = await (0, shareCommands_1.liveShareRequest)("GetFileContent" /* GetFileContent */, file, encoding);
                if (typeof content === 'string') {
                    return content;
                }
                else {
                    console.error('[GuestService] failed to retrieve file content (not of type "string")');
                }
            }
            else {
                const content = await (0, shareCommands_1.liveShareRequest)("GetFileContent" /* GetFileContent */, file);
                if (content) {
                    return content;
                }
                else {
                    console.error('[GuestService] failed to retrieve file content (not of type "Buffer")');
                }
            }
        }
    }
    async requestHelpContent(file) {
        const content = await (0, shareCommands_1.liveShareRequest)("GetHelpFileContent" /* GetHelpFileContent */, file);
        if (content) {
            return content;
        }
        else {
            console.error('[GuestService] failed to retrieve help content from host');
        }
    }
}
exports.GuestService = GuestService;
// Clear up any listeners & disposables, so that vscode-R
// isn't slowed down if liveshare is ended
// This is used instead of relying on context disposables,
// as an R session can continue even when liveshare is ended
async function sessionCleanup() {
    if (exports.rHostService.isStarted()) {
        console.log('[HostService] stopping service');
        await exports.rHostService.stopService();
        for (const [key, item] of shareSession_1.browserDisposables.entries()) {
            console.log(`[HostService] disposing of browser ${item.url}`);
            item.Disposable.dispose();
            shareSession_1.browserDisposables.splice(key);
        }
        shareTree_1.rLiveShareProvider.refresh();
    }
}
//# sourceMappingURL=index.js.map