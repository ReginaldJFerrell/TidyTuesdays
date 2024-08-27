/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.activate = void 0;
const vscode_1 = __webpack_require__(1);
const name = "Compare View ";
const arrow = " ↔ ";
const scheme = "untitled";
const section = "compareView";
const tabNoRegex = new RegExp(`(?<=\\b${name}\\b)\\d+`, "g");
const compareViewTabPathRegex = new RegExp(`\\/\\b${name}\\b\\d+$`); // do not set global flag, to prevent lastIndex being set
const compareViewDiffTabLabelRegex = new RegExp(`^\\b${name}\\b\\d+\\b${arrow}${name}\\b\\d+$`);
let count = 0;
let closeRelatedTab = false;
let focusLeftSide = false;
function activate(context) {
    context.subscriptions.push(vscode_1.commands.registerCommand("compare-view.compareView", createCompareView));
    initCount();
    setConfiguration();
    subscribeCloseEvent();
    subscribeConfigChangedEvent();
}
exports.activate = activate;
const createCompareView = () => {
    const leftName = `${name}${++count}`;
    const leftUri = vscode_1.Uri.parse(`${scheme}:/${leftName}`);
    const rightName = `${name}${++count}`;
    const rightUri = vscode_1.Uri.parse(`${scheme}:/${rightName}`);
    vscode_1.window.showTextDocument(rightUri).then(() => {
        vscode_1.commands.executeCommand("vscode.diff", leftUri, rightUri, `${leftName}${arrow}${rightName}`);
        if (focusLeftSide) {
            vscode_1.commands.executeCommand("workbench.action.focusFirstSideEditor");
        }
    });
};
const setConfiguration = () => {
    const configs = vscode_1.workspace.getConfiguration(section);
    closeRelatedTab = configs.get("closeRelatedTab");
    focusLeftSide = configs.get("focusLeftSide");
};
const subscribeConfigChangedEvent = () => {
    vscode_1.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration(section)) {
            setConfiguration();
        }
    });
};
const initCount = () => {
    vscode_1.window.tabGroups.all
        .flatMap(({ tabs }) => tabs)
        .filter((tab) => {
        return isCompareViewTab(tab) || isCompareViewDiffTab(tab);
    })
        .map((tab) => tab.label)
        .forEach((label) => {
        var _a;
        (_a = label.match(tabNoRegex)) === null || _a === void 0 ? void 0 : _a.forEach((viewCount) => {
            count = Math.max(count, parseInt(viewCount));
        });
    });
};
const subscribeCloseEvent = () => {
    vscode_1.window.tabGroups.onDidChangeTabs((e) => {
        if (e.closed.length === 0 || !closeRelatedTab) {
            return;
        }
        e.closed
            .filter((tab) => {
            return isCompareViewDiffTab(tab);
        })
            .forEach((tab) => {
            const tabInputTextDiff = tab.input;
            const tabsToClose = [
                tabInputTextDiff.original.path,
                tabInputTextDiff.modified.path,
            ];
            vscode_1.window.tabGroups.all
                .flatMap(({ tabs }) => tabs)
                .filter((tab) => {
                return (isCompareViewTab(tab) &&
                    tabsToClose.includes(tab.input.uri.path));
            })
                .forEach((tab) => {
                vscode_1.window.tabGroups.close(tab);
            });
        });
    });
};
const isCompareViewDiffTab = (tab) => {
    return (tab.input instanceof vscode_1.TabInputTextDiff &&
        compareViewDiffTabLabelRegex.test(tab.label));
};
const isCompareViewTab = (tab) => {
    return (tab.input instanceof vscode_1.TabInputText &&
        tab.input.uri.scheme === scheme &&
        compareViewTabPathRegex.test(tab.input.uri.path));
};

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=extension.js.map