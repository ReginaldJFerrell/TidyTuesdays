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
exports.liveShareRequest = exports.liveShareOnRequest = exports.Commands = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs-extra"));
const _1 = require(".");
const shareSession_1 = require("./shareSession");
const shareTree_1 = require("./shareTree");
const rTerminal_1 = require("../rTerminal");
const session_1 = require("../session");
const extension_1 = require("../extension");
// To contribute a request between the host and guest,
// add the method that will be triggered with the callback.
// method arguments should be defined as an array of 'args'
//
// A response should have the this typical structure:
// [Callback.name]: (args:[]): returnType => {
//   method
// }
//
// A request, by comparison, may look something like this:
// method(args) {
//      await request(Callback.name, args)
// }
exports.Commands = {
    'host': {
        /// Terminal commands ///
        // Command arguments are sent from the guest to the host,
        // and then the host sends the arguments to the console
        ["RequestAttachGuest" /* RequestAttachGuest */]: () => {
            if (shareTree_1.shareWorkspace) {
                void _1.rHostService.notifyRequest(session_1.requestFile, true);
            }
            else {
                void liveShareRequest("NotifyMessage" /* NotifyMessage */, 'The host has not enabled guest attach.', "warning" /* warning */);
            }
        },
        ["RequestRunTextInTerm" /* RequestRunTextInTerm */]: (args) => {
            if (shareTree_1.forwardCommands) {
                void (0, rTerminal_1.runTextInTerm)(`${args[0]}`);
            }
            else {
                void liveShareRequest("NotifyMessage" /* NotifyMessage */, 'The host has not enabled command forwarding. Command was not sent.', "warning" /* warning */);
            }
        },
        ["GetHelpFileContent" /* GetHelpFileContent */]: (args) => {
            return extension_1.globalRHelp.getHelpFileForPath(args[0]);
        },
        /// File Handling ///
        // Host reads content from file, then passes the content
        // to the guest session.
        ["GetFileContent" /* GetFileContent */]: async (args) => {
            return args[1] !== undefined ?
                await fs.readFile(args[0], args[1]) :
                await fs.readFile(args[0]);
        }
    },
    'guest': {
        ["NotifyRequestUpdate" /* NotifyRequestUpdate */]: (args) => {
            void (0, shareSession_1.updateGuestRequest)(args[0], args[1]);
        },
        ["NotifyEnvUpdate" /* NotifyEnvUpdate */]: (args) => {
            void (0, shareSession_1.updateGuestGlobalenv)(args[0]);
        },
        ["NotifyPlotUpdate" /* NotifyPlotUpdate */]: (args) => {
            void (0, shareSession_1.updateGuestPlot)(args[0]);
        },
        ["NotifyGuestPlotManager" /* NotifyGuestPlotManager */]: (args) => {
            extension_1.globalHttpgdManager === null || extension_1.globalHttpgdManager === void 0 ? void 0 : extension_1.globalHttpgdManager.showViewer(args[0]);
        },
        ["OrderDetach" /* OrderDetach */]: () => {
            void (0, shareSession_1.detachGuest)();
        },
        /// vscode Messages ///
        // The host sends messages to the guest, which are displayed as a vscode window message
        // E.g., teling the guest a terminal is not attached to the current session
        // This way, we don't have to do much error checking on the guests side, which is more secure
        // and less prone to error
        ["NotifyMessage" /* NotifyMessage */]: (args) => {
            switch (args[1]) {
                case "error" /* error */:
                    return void vscode.window.showErrorMessage(args[0]);
                case "information" /* information */:
                    return void vscode.window.showInformationMessage(args[0]);
                case "warning" /* warning */:
                    return void vscode.window.showWarningMessage(args[0]);
                case undefined:
                    return void vscode.window.showInformationMessage(args[0]);
            }
        }
    }
};
// The following onRequest and request methods are wrappers
// around the vsls RPC API. These are intended to simplify
// the API, so that the learning curve is minimal for contributing
// future callbacks.
//
// You can see that the onNotify and notify methods have been
// aggregated under these two methods. This is because the host service
// has no request methods, and for *most* purposes, there is little functional
// difference between request and notify.
function liveShareOnRequest(name, command, service) {
    if ((0, _1.isGuest)()) {
        // is guest service
        service.onNotify(name, command);
    }
    else {
        // is host service
        service.onRequest(name, command);
    }
}
exports.liveShareOnRequest = liveShareOnRequest;
function liveShareRequest(name, ...rest) {
    if ((0, _1.isGuest)()) {
        if (rest !== undefined) {
            return _1.service.request(name, rest);
        }
        else {
            return _1.service.request(name, []);
        }
    }
    else {
        if (rest !== undefined) {
            return _1.service.notify(name, { ...rest });
        }
        else {
            return _1.service.notify(name, {});
        }
    }
}
exports.liveShareRequest = liveShareRequest;
//# sourceMappingURL=shareCommands.js.map