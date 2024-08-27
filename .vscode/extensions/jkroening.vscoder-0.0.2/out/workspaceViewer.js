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
exports.removeItem = exports.viewItem = exports.loadWorkspace = exports.saveWorkspace = exports.clearWorkspace = exports.WorkspaceItem = exports.WorkspaceDataProvider = void 0;
const path = __importStar(require("path"));
const vscode_1 = require("vscode");
const rTerminal_1 = require("./rTerminal");
const session_1 = require("./session");
const util_1 = require("./util");
const liveShare_1 = require("./liveShare");
const priorityAttr = [
    'list',
    'environment'
];
class WorkspaceDataProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode_1.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    refresh() {
        if (liveShare_1.isGuestSession) {
            this.data = liveShare_1.guestGlobalenv;
        }
        else {
            this.data = session_1.globalenv;
        }
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (element) {
            return element.str
                .split('\n')
                .filter((elem, index) => { return index > 0; })
                .map(strItem => new WorkspaceItem('', '', strItem.replace(/\s+/g, ' ').trim(), '', 0, element.treeLevel + 1));
        }
        else {
            return this.getWorkspaceItems(this.data);
        }
    }
    getWorkspaceItems(data) {
        const toItem = (key, rClass, str, type, size, dim) => {
            return new WorkspaceItem(key, rClass, str, type, size, 0, dim);
        };
        const items = data ? Object.keys(data).map((key) => toItem(key, data[key].class[0], data[key].str, data[key].type, data[key].size, data[key].dim)) : [];
        function sortItems(a, b) {
            if (priorityAttr.includes(a.contextValue) > priorityAttr.includes(b.contextValue)) {
                return -1;
            }
            else if (priorityAttr.includes(b.contextValue) > priorityAttr.includes(a.contextValue)) {
                return 1;
            }
            else {
                return 0 || a.label.localeCompare(b.label);
            }
        }
        return items.sort((a, b) => sortItems(a, b));
    }
}
exports.WorkspaceDataProvider = WorkspaceDataProvider;
class WorkspaceItem extends vscode_1.TreeItem {
    constructor(label, rClass, str, type, size, treeLevel, dim) {
        super(label, WorkspaceItem.setCollapsibleState(treeLevel, type, str));
        this.description = this.getDescription(dim, str, rClass);
        this.tooltip = this.getTooltip(label, rClass, size, treeLevel);
        this.contextValue = type;
        this.str = str;
        this.treeLevel = treeLevel;
        this.contextValue = treeLevel === 0 ? 'rootNode' : `childNode${treeLevel}`;
    }
    getDescription(dim, str, rClass) {
        if (dim !== undefined) {
            if (dim[1] === 1) {
                return `${rClass}: ${dim[0]} obs. of ${dim[1]} variable`;
            }
            else {
                return `${rClass}: ${dim[0]} obs. of ${dim[1]} variables`;
            }
        }
        else {
            return str;
        }
    }
    getSizeString(bytes) {
        if (bytes < 1024) {
            return `${bytes} bytes`;
        }
        else {
            const e = Math.floor(Math.log(bytes) / Math.log(1024));
            return (bytes / Math.pow(1024, e)).toFixed(0) + 'KMGTP'.charAt(e - 1) + 'b';
        }
    }
    getTooltip(label, rClass, size, treeLevel) {
        if (size !== undefined && treeLevel === 0) {
            return `${label} (${rClass}, ${this.getSizeString(size)})`;
        }
        else if (treeLevel === 1) {
            return null;
        }
        else {
            return `${label} (${rClass})`;
        }
    }
    /* This logic has to be implemented this way to allow it to be called
    during the super constructor above. I created it to give full control
    of what elements can have have 'child' nodes os not. It can be expanded
    in the futere for more tree levels.*/
    static setCollapsibleState(treeLevel, type, str) {
        if (treeLevel === 0 && priorityAttr.includes(type) && str.includes('\n')) {
            return vscode_1.TreeItemCollapsibleState.Collapsed;
        }
        else {
            return vscode_1.TreeItemCollapsibleState.None;
        }
    }
}
exports.WorkspaceItem = WorkspaceItem;
function clearWorkspace() {
    const removeHiddenItems = (0, util_1.config)().get('workspaceViewer.removeHiddenItems');
    const promptUser = (0, util_1.config)().get('workspaceViewer.clearPrompt');
    if ((liveShare_1.isGuestSession ? liveShare_1.guestGlobalenv : session_1.globalenv) !== undefined) {
        if (promptUser) {
            void vscode_1.window.showInformationMessage('Are you sure you want to clear the workspace? This cannot be reversed.', 'Confirm', 'Cancel').then(selection => {
                if (selection === 'Confirm') {
                    clear();
                }
            });
        }
        else {
            clear();
        }
    }
    function clear() {
        const hiddenText = 'rm(list = ls(all.names = TRUE))';
        const text = 'rm(list = ls())';
        if (removeHiddenItems) {
            void (0, rTerminal_1.runTextInTerm)(`${hiddenText}`);
        }
        else {
            void (0, rTerminal_1.runTextInTerm)(`${text}`);
        }
    }
}
exports.clearWorkspace = clearWorkspace;
function saveWorkspace() {
    if (session_1.globalenv !== undefined) {
        void vscode_1.window.showSaveDialog({
            defaultUri: vscode_1.Uri.file(`${session_1.workingDir}${path.sep}workspace.RData`),
            filters: {
                'Data': ['RData']
            },
            title: 'Save workspace'
        }).then(async (uri) => {
            if (uri) {
                return (0, rTerminal_1.runTextInTerm)(`save.image("${(uri.fsPath.split(path.sep).join(path.posix.sep))}")`);
            }
        });
    }
}
exports.saveWorkspace = saveWorkspace;
function loadWorkspace() {
    if (session_1.globalenv !== undefined) {
        void vscode_1.window.showOpenDialog({
            defaultUri: vscode_1.Uri.file(session_1.workingDir),
            filters: {
                'Data': ['RData'],
            },
            title: 'Load workspace'
        }).then(async (uri) => {
            if (uri) {
                const savePath = uri[0].fsPath.split(path.sep).join(path.posix.sep);
                return (0, rTerminal_1.runTextInTerm)(`load("${(savePath)}")`);
            }
        });
    }
}
exports.loadWorkspace = loadWorkspace;
function viewItem(node) {
    if ((0, liveShare_1.isLiveShare)()) {
        void (0, rTerminal_1.runTextInTerm)(`View(${node}, uuid = ${liveShare_1.UUID})`);
    }
    else {
        void (0, rTerminal_1.runTextInTerm)(`View(${node})`);
    }
}
exports.viewItem = viewItem;
function removeItem(node) {
    void (0, rTerminal_1.runTextInTerm)(`rm(${node})`);
}
exports.removeItem = removeItem;
//# sourceMappingURL=workspaceViewer.js.map