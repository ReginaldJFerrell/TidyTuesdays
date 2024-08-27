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
exports.HelpViewProvider = exports.HelpTreeWrapper = void 0;
const vscode = __importStar(require("vscode"));
const util_1 = require("../util");
const packages_1 = require("./packages");
// this enum is re-assigned just for code readability
const CollapsibleState = vscode.TreeItemCollapsibleState;
// the commands contributed in package.json for the tree view 
// the commands are registered in HelpTreeWrapper.constructor
// the node-objects only need to handle the keys ('QUICKPICK' etc.) in Node.handleCommand()
const nodeCommands = {
    QUICKPICK: 'r.helpPanel.showQuickPick',
    CALLBACK: 'r.helpPanel.internalCallback',
    searchPackage: 'r.helpPanel.searchPackage',
    openInNewPanel: 'r.helpPanel.openInNewPanel',
    clearCache: 'r.helpPanel.clearCache',
    removeFromFavorites: 'r.helpPanel.removeFromFavorites',
    addToFavorites: 'r.helpPanel.addToFavorites',
    removePackage: 'r.helpPanel.removePackage',
    updatePackage: 'r.helpPanel.updatePackage',
    showOnlyFavorites: 'r.helpPanel.showOnlyFavorites',
    showAllPackages: 'r.helpPanel.showAllPackages',
    filterPackages: 'r.helpPanel.filterPackages',
    summarizeTopics: 'r.helpPanel.summarizeTopics',
    unsummarizeTopics: 'r.helpPanel.unsummarizeTopics',
    installPackages: 'r.helpPanel.installPackages',
    updateInstalledPackages: 'r.helpPanel.updateInstalledPackages'
};
////////////////////
// The following classes are mostly just an 'adapter layer' between vscode's treeview interface
// and the object oriented approach used here to present nodes of the treeview.
// The 'interesting' part of the nodes is implemented below
// wrapper around vscode.window.createTreeView()
// necessary to implement Node.refresh(),
// which is used to signal from a node that its contents/children have changed
class HelpTreeWrapper {
    constructor(rHelp) {
        this.rHelp = rHelp;
        this.helpViewProvider = new HelpViewProvider(this);
        this.helpView = vscode.window.createTreeView('rHelpPages', {
            treeDataProvider: this.helpViewProvider,
            showCollapseAll: true
        });
        // register the commands defiend in `nodeCommands`
        // they still need to be defined in package.json (apart from CALLBACK)
        for (const cmd in nodeCommands) {
            vscode.commands.registerCommand(nodeCommands[cmd], (node) => {
                // treeview-root is represented by `undefined`
                node || (node = this.helpViewProvider.rootItem);
                node.handleCommand(cmd);
            });
        }
    }
    refreshNode(node) {
        for (const listener of this.helpViewProvider.listeners) {
            listener(node);
        }
    }
    refreshPackageRootNode() {
        var _a, _b;
        (_b = (_a = this.helpViewProvider.rootItem) === null || _a === void 0 ? void 0 : _a.pkgRootNode) === null || _b === void 0 ? void 0 : _b.refresh();
    }
}
exports.HelpTreeWrapper = HelpTreeWrapper;
// mostly just a wrapper to implement vscode.TreeDataProvider
class HelpViewProvider {
    constructor(wrapper) {
        this.listeners = [];
        this.rootItem = new RootNode(wrapper);
    }
    onDidChangeTreeData(listener) {
        this.listeners.push(listener);
        return new vscode.Disposable(() => {
            // do nothing
        });
    }
    getChildren(element) {
        element || (element = this.rootItem);
        return element.getChildren();
    }
    getTreeItem(element) {
        return element;
    }
    getParent(element) {
        return element.parent;
    }
}
exports.HelpViewProvider = HelpViewProvider;
// Abstract base class for nodes of the treeview
// Is a rather technical base class to handle the intricacies of vscode's treeview API
// All the 'interesting' stuff hapens in the derived classes
// New commands should (if possible) be implemented by defining a new derived class,
// rather than modifying this class!
class Node extends vscode.TreeItem {
    // The default constructor just copies some info from parent
    constructor(parent, wrapper) {
        super('');
        this.collapsibleState = vscode.TreeItemCollapsibleState.None;
        this.contextValue = '';
        // set to null/undefined in derived class to expand/collapse on click
        this.command = {
            title: 'treeNodeCallback',
            command: nodeCommands.CALLBACK,
            arguments: [this]
        };
        this.children = undefined;
        if (parent) {
            wrapper || (wrapper = parent.wrapper);
            this.parent = parent;
            this.rootNode = parent.rootNode;
        }
        if (wrapper) {
            this.wrapper = wrapper;
            this.rHelp = this.wrapper.rHelp;
        }
        this.id = `${Node.newId++}`;
    }
    // Called when a node or command-button on a node is clicked
    // Only internal commands are handled here, custom commands are implemented in _handleCommand!
    handleCommand(cmd) {
        if (cmd === 'CALLBACK' && this.callBack) {
            void this.callBack();
        }
        else if (cmd === 'QUICKPICK') {
            if (this.quickPickCommand) {
                this._handleCommand(this.quickPickCommand);
            }
            else if (this.collapsibleState !== CollapsibleState.None) {
                void this.showQuickPick();
            }
            else {
                this.handleCommand('CALLBACK');
            }
        }
        else {
            this._handleCommand(cmd);
        }
    }
    _handleCommand() {
        // to be overwritten
    }
    // Shows a quickpick containing the children of a node
    // If the picked child has children itself, another quickpick is shown
    // Otherwise, its QUICKPICK or CALLBACK command is executed
    async showQuickPick() {
        const children = await this.makeChildren(true);
        if (!children) {
            return undefined;
        }
        const qpItems = children.map(v => {
            var _a, _b, _c;
            let label = v.label || '';
            if (typeof v.iconPath === 'object' && 'id' in v.iconPath) {
                label = `$(${v.iconPath.id}) ${label}`;
            }
            return {
                label: (_a = v.qpLabel) !== null && _a !== void 0 ? _a : label,
                detail: (_c = (_b = v.qpDetail) !== null && _b !== void 0 ? _b : v.description) !== null && _c !== void 0 ? _c : v.tooltip,
                child: v
            };
        });
        const qp = await vscode.window.showQuickPick(qpItems, {
            placeHolder: this.qpPrompt
        });
        if (qp) {
            const child = qp.child;
            child.handleCommand('QUICKPICK');
        }
    }
    // Called by vscode etc. to get the children of a node
    // Not meant to be modified in derived classes!
    async getChildren() {
        if (this.children === undefined) {
            this.children = await this.makeChildren();
        }
        return this.children;
    }
    makeChildren() {
        return [];
    }
    // Can be called by a method from the node itself or externally to refresh the node in the treeview
    refresh(refreshChildren = true) {
        if (refreshChildren) {
            this.children = undefined;
        }
        this.wrapper.refreshNode(this);
    }
    // Clear 'grandchildren' without triggering the treeview to update too often
    refreshChildren() {
        if (this.children) {
            for (const child of this.children) {
                child.children = undefined;
            }
        }
    }
    // show/focus the node in the treeview
    reveal(options) {
        void this.wrapper.helpView.reveal(this, options);
    }
    // These methods are used to update this.contextValue with possible command names
    // The constructed contextValue contains the command names of the commands applying to this node
    static makeContextValue(...args) {
        return args.map(v => `_${v}_`).join('');
    }
    addContextValues(...args) {
        args.forEach(val => {
            this.contextValue += `_${val}_`;
        });
        return this.contextValue;
    }
    removeContextValues(...args) {
        args.forEach(val => {
            this.contextValue = this.contextValue.replace(new RegExp(`_${val}_`), '');
        });
        return this.contextValue;
    }
    replaceContextValue(oldCmd, newCmd) {
        this.removeContextValues(oldCmd);
        return this.addContextValues(newCmd);
    }
}
// used to give unique ids to nodes
Node.newId = 0;
class MetaNode extends Node {
}
///////////////////////////////////
// The following classes contain the implementation of the help-view-specific behaviour
// PkgRootNode, PackageNode, and TopicNode are a bit more complex
// The remaining nodes mostly just contain an icon and a callback
// Root of the node. Is not actually used by vscode, but as 'imaginary' root item.
class RootNode extends MetaNode {
    constructor(wrapper) {
        super(undefined, wrapper);
        this.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
        this.label = 'root';
        this.rootNode = this;
    }
    makeChildren() {
        this.pkgRootNode = new PkgRootNode(this);
        return [
            new HomeNode(this),
            new Search1Node(this),
            new Search2Node(this),
            new OpenForSelectionNode(this),
            new RefreshNode(this),
            new InstallPackageNode(this),
            this.pkgRootNode,
        ];
    }
    refresh() {
        this.wrapper.refreshNode(undefined);
    }
}
// contains the list of installed packages
class PkgRootNode extends MetaNode {
    constructor() {
        super(...arguments);
        // TreeItem
        this.label = 'Help Topics by Package';
        this.iconPath = new vscode.ThemeIcon('list-unordered');
        this.description = '';
        this.command = undefined;
        this.collapsibleState = CollapsibleState.Collapsed;
        this.contextValue = Node.makeContextValue('QUICKPICK', 'clearCache', 'filterPackages', 'showOnlyFavorites', 'unsummarizeTopics');
        // quickpick
        this.qpPrompt = 'Please select a package.';
        // PkgRootNode
        this.showOnlyFavorites = false;
        this.summarizeTopics = true;
    }
    async _handleCommand(cmd) {
        if (cmd === 'clearCache') {
            // used e.g. after manually installing/removing a package
            this.refresh(true);
        }
        else if (cmd === 'showOnlyFavorites') {
            this.showOnlyFavorites = true;
            this.iconPath = new vscode.ThemeIcon('star-full');
            this.replaceContextValue('showOnlyFavorites', 'showAllPackages');
            this.refresh();
        }
        else if (cmd === 'showAllPackages') {
            this.showOnlyFavorites = false;
            this.iconPath = new vscode.ThemeIcon('list-unordered');
            this.replaceContextValue('showAllPackages', 'showOnlyFavorites');
            this.refresh();
        }
        else if (cmd === 'filterPackages') {
            // use validation function to continuously update filtered packages
            const validateInput = (value) => {
                this.filterText = value;
                this.refresh();
                return '';
            };
            // let user input filter text
            this.filterText = await vscode.window.showInputBox({
                validateInput: validateInput,
                value: this.filterText,
            });
            this.description = (this.filterText ? `"${this.filterText}"` : '');
            this.refresh();
        }
        else if (cmd === 'unsummarizeTopics') {
            this.summarizeTopics = false;
            this.replaceContextValue('unsummarizeTopics', 'summarizeTopics');
            this.refreshChildren(); // clears the 'grandchildren'
            this.refresh(false, false);
        }
        else if (cmd === 'summarizeTopics') {
            this.summarizeTopics = true;
            this.replaceContextValue('summarizeTopics', 'unsummarizeTopics');
            this.refreshChildren(); // clears the 'grandchildren'
            this.refresh(false, false);
        }
    }
    refresh(clearCache = false, refreshChildren = true) {
        if (clearCache) {
            this.rHelp.clearCachedFiles(`/doc/html/packages.html`);
            void this.rHelp.packageManager.clearCachedFiles(`/doc/html/packages.html`);
        }
        super.refresh(refreshChildren);
    }
    async makeChildren() {
        let packages = await this.rHelp.packageManager.getPackages(false);
        if (!packages) {
            return [];
        }
        if (this.filterText) {
            const re = new RegExp(this.filterText);
            packages = packages.filter(pkg => re.exec(pkg.name));
        }
        // favorites at the top
        const children = packages.filter(pkg => pkg.isFavorite);
        // nonFavorites below (if shown)
        if (!this.showOnlyFavorites) {
            children.push(...packages.filter(pkg => !pkg.isFavorite));
        }
        // make packageNode for each child
        return children.map(pkg => new PackageNode(this, pkg));
    }
}
// contains the topics belonging to an individual package
class PackageNode extends Node {
    constructor(parent, pkg) {
        super(parent);
        // TreeItem
        this.command = undefined;
        this.collapsibleState = CollapsibleState.Collapsed;
        this.contextValue = Node.makeContextValue('QUICKPICK', 'clearCache', 'removePackage', 'updatePackage');
        // QuickPick
        this.qpPrompt = 'Please select a Topic.';
        this.pkg = pkg;
        this.label = pkg.name;
        this.tooltip = pkg.description;
        this.qpDetail = pkg.description;
        if (this.pkg.isFavorite) {
            this.addContextValues('removeFromFavorites');
        }
        else {
            this.addContextValues('addToFavorites');
        }
        if (this.pkg.isFavorite && !this.parent.showOnlyFavorites) {
            this.iconPath = new vscode.ThemeIcon('star-full');
        }
    }
    async _handleCommand(cmd) {
        if (cmd === 'clearCache') {
            // useful e.g. when working on a package
            this.rHelp.clearCachedFiles(new RegExp(`^/library/${this.pkg.name}/`));
            this.refresh();
        }
        else if (cmd === 'addToFavorites') {
            this.rHelp.packageManager.addFavorite(this.pkg.name);
            this.parent.refresh();
        }
        else if (cmd === 'removeFromFavorites') {
            this.rHelp.packageManager.removeFavorite(this.pkg.name);
            this.parent.refresh();
        }
        else if (cmd === 'updatePackage') {
            const success = await this.rHelp.packageManager.installPackages([this.pkg.name]);
            // only reinstall if user confirmed removing the package (success === true)
            // might still refresh if install was attempted but failed
            if (success) {
                this.parent.refresh(true);
            }
        }
        else if (cmd === 'removePackage') {
            const success = await this.rHelp.packageManager.removePackage(this.pkg.name);
            // only refresh if user confirmed removing the package (success === true)
            // might still refresh if removing was attempted but failed
            if (success) {
                this.parent.refresh(true);
            }
        }
    }
    async makeChildren(forQuickPick = false) {
        var _a;
        const summarizeTopics = (forQuickPick ? false : ((_a = this.parent.summarizeTopics) !== null && _a !== void 0 ? _a : true));
        const topics = await this.rHelp.packageManager.getTopics(this.pkg.name, summarizeTopics, false);
        const ret = (topics === null || topics === void 0 ? void 0 : topics.map(topic => new TopicNode(this, topic))) || [];
        return ret;
    }
}
// Node representing an individual topic/help page
class TopicNode extends Node {
    constructor(parent, topic) {
        super(parent);
        // TreeItem
        this.iconPath = new vscode.ThemeIcon('circle-filled');
        this.contextValue = Node.makeContextValue('openInNewPanel');
        this.topic = topic;
        this.label = topic.name;
        this.iconPath = new vscode.ThemeIcon(TopicNode.iconPaths.get(this.topic.type) || 'circle-filled');
        if (this.topic.type === packages_1.TopicType.NORMAL) {
            this.qpLabel = this.topic.name;
        }
        if (this.topic.aliases) {
            this.tooltip = `Aliases:\n - ${this.topic.aliases.join('\n - ')}`;
        }
        else {
            this.tooltip = this.topic.description;
        }
    }
    _handleCommand(cmd) {
        if (cmd === 'CALLBACK') {
            void this.rHelp.showHelpForPath(this.topic.helpPath);
        }
        else if (cmd === 'openInNewPanel') {
            void this.rHelp.makeNewHelpPanel();
            void this.rHelp.showHelpForPath(this.topic.helpPath);
        }
    }
}
TopicNode.iconPaths = new Map([
    [packages_1.TopicType.HOME, 'home'],
    [packages_1.TopicType.INDEX, 'list-unordered'],
    [packages_1.TopicType.META, 'file-code'],
    [packages_1.TopicType.NORMAL, 'circle-filled']
]);
/////////////
// The following nodes only implement an individual command each
class HomeNode extends MetaNode {
    constructor() {
        super(...arguments);
        this.label = 'Home';
        this.collapsibleState = CollapsibleState.None;
        this.iconPath = new vscode.ThemeIcon('home');
        this.contextValue = Node.makeContextValue('openInNewPanel');
    }
    _handleCommand(cmd) {
        if (cmd === 'openInNewPanel') {
            void this.rHelp.makeNewHelpPanel();
            void this.rHelp.showHelpForPath('doc/html/index.html');
        }
    }
    callBack() {
        void this.rHelp.showHelpForPath('doc/html/index.html');
    }
}
class Search1Node extends MetaNode {
    constructor() {
        super(...arguments);
        this.label = 'Open Help Topic using `?`';
        this.iconPath = new vscode.ThemeIcon('zap');
    }
    callBack() {
        void this.rHelp.searchHelpByAlias();
    }
}
class Search2Node extends MetaNode {
    constructor() {
        super(...arguments);
        this.label = 'Search Help Topics using `??`';
        this.iconPath = new vscode.ThemeIcon('search');
    }
    callBack() {
        void this.rHelp.searchHelpByText();
    }
}
class RefreshNode extends MetaNode {
    constructor() {
        super(...arguments);
        this.label = 'Clear Cache & Restart Help Server';
        this.iconPath = new vscode.ThemeIcon('refresh');
    }
    async callBack() {
        await (0, util_1.doWithProgress)(() => this.rHelp.refresh());
        this.parent.pkgRootNode.refresh();
    }
}
class OpenForSelectionNode extends MetaNode {
    constructor() {
        super(...arguments);
        this.label = 'Open Help Page for Selected Text';
        this.iconPath = new vscode.ThemeIcon('symbol-key');
    }
    callBack() {
        void this.rHelp.openHelpForSelection();
    }
}
class InstallPackageNode extends MetaNode {
    constructor() {
        super(...arguments);
        this.label = 'Install CRAN Package';
        this.iconPath = new vscode.ThemeIcon('cloud-download');
        this.contextValue = Node.makeContextValue('installPackages', 'updateInstalledPackages');
    }
    async _handleCommand(cmd) {
        if (cmd === 'installPackages') {
            const ret = await this.rHelp.packageManager.pickAndInstallPackages(true);
            if (ret) {
                this.rootNode.pkgRootNode.refresh(true);
            }
        }
        else if (cmd === 'updateInstalledPackages') {
            const ret = await this.rHelp.packageManager.updatePackages();
            if (ret) {
                this.rootNode.pkgRootNode.refresh(true);
            }
        }
    }
    async callBack() {
        await this.rHelp.packageManager.pickAndInstallPackages();
        this.rootNode.pkgRootNode.refresh(true);
    }
}
//# sourceMappingURL=treeView.js.map