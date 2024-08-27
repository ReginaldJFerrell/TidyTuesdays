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
exports.ToggleNode = exports.LiveShareTreeProvider = exports.initTreeView = exports.rLiveShareProvider = exports.autoShareBrowser = exports.shareWorkspace = exports.forwardCommands = void 0;
const vscode = __importStar(require("vscode"));
const session_1 = require("../session");
const util_1 = require("../util");
const _1 = require(".");
function initTreeView() {
    // get default bool values from settings
    exports.shareWorkspace = (0, util_1.config)().get('liveShare.defaults.shareWorkspace');
    exports.forwardCommands = (0, util_1.config)().get('liveShare.defaults.commandForward');
    exports.autoShareBrowser = (0, util_1.config)().get('liveShare.defaults.shareBrowser');
    // create tree view for host controls
    exports.rLiveShareProvider = new LiveShareTreeProvider();
    void vscode.window.registerTreeDataProvider('rLiveShare', exports.rLiveShareProvider);
}
exports.initTreeView = initTreeView;
class LiveShareTreeProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    // If a node needs to be collapsible,
    // change the element condition & return value
    getChildren(element) {
        if (element) {
            return;
        }
        else {
            return this.getNodes();
        }
    }
    // To add a tree item to the LiveShare R view,
    // write a class object that extends Node and
    // add it to the list of nodes here
    getNodes() {
        let items = undefined;
        if ((0, _1.isLiveShare)()) {
            items = [
                new ShareNode(),
                new CommandNode(),
                new PortNode()
            ];
        }
        return items;
    }
}
exports.LiveShareTreeProvider = LiveShareTreeProvider;
// Base class for adding to
class Node extends vscode.TreeItem {
    constructor() {
        super('');
    }
}
// Class for any tree item that should have a toggleable state
// To implement a ToggleNode, in the super, provide a boolean
// that is used for tracking state.
// If a toggle is not required, extend a different Node type.
class ToggleNode extends Node {
    constructor(bool) {
        super();
        this.description = bool === true ? 'Enabled' : 'Disabled';
    }
    toggle(treeProvider) { treeProvider.refresh(); }
}
exports.ToggleNode = ToggleNode;
/// Nodes for changing R LiveShare variables
class ShareNode extends ToggleNode {
    constructor() {
        super(exports.shareWorkspace);
        this.label = 'Share R Workspace';
        this.tooltip = 'Whether guests can access the current R session and its workspace';
        this.contextValue = 'shareNode';
        this.iconPath = new vscode.ThemeIcon('broadcast');
        this.collapsibleState = vscode.TreeItemCollapsibleState.None;
    }
    toggle(treeProvider) {
        exports.shareWorkspace = !exports.shareWorkspace;
        this.description = exports.shareWorkspace === true ? 'Enabled' : 'Disabled';
        if (exports.shareWorkspace) {
            void _1.rHostService.notifyRequest(session_1.requestFile, true);
        }
        else {
            void _1.rHostService.orderGuestDetach();
        }
        treeProvider.refresh();
    }
}
class CommandNode extends ToggleNode {
    constructor() {
        super(exports.forwardCommands);
        this.label = 'Guest interaction with host R extension';
        this.tooltip = 'Whether commands to interact with the R extension should be forwarded from the guest to the host (bypasses permissions); shared R terminal (command line) permissions can be toggled in the Live Share extension';
        this.contextValue = 'commandNode';
        this.iconPath = new vscode.ThemeIcon('debug-step-over');
        this.collapsibleState = vscode.TreeItemCollapsibleState.None;
    }
    toggle(treeProvider) {
        exports.forwardCommands = !exports.forwardCommands;
        this.description = exports.forwardCommands === true ? 'Enabled' : 'Disabled';
        treeProvider.refresh();
    }
}
class PortNode extends ToggleNode {
    constructor() {
        super(exports.autoShareBrowser);
        this.label = 'Auto share ports';
        this.tooltip = 'Whether opened R browsers should be shared with guests';
        this.contextValue = 'portNode';
        this.iconPath = new vscode.ThemeIcon('plug');
        this.collapsibleState = vscode.TreeItemCollapsibleState.None;
    }
    toggle(treeProvider) {
        exports.autoShareBrowser = !exports.autoShareBrowser;
        this.description = exports.autoShareBrowser === true ? 'Enabled' : 'Disabled';
        treeProvider.refresh();
    }
}
//# sourceMappingURL=shareTree.js.map