'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGitignore = void 0;
const fs_extra_1 = require("fs-extra");
const fs_1 = require("fs");
const path_1 = require("path");
const vscode_1 = require("vscode");
const extension_1 = require("./extension");
const util_1 = require("./util");
async function createGitignore() {
    var _a;
    // .gitignore template from "https://github.com/github/gitignore/blob/main/R.gitignore"
    const ignoreFileTemplate = extension_1.extensionContext.asAbsolutePath('R/template/R.gitignore');
    const ignoreFileContent = (0, fs_1.readFileSync)(ignoreFileTemplate);
    const currentWorkspaceFolder = (_a = (0, util_1.getCurrentWorkspaceFolder)()) === null || _a === void 0 ? void 0 : _a.uri.fsPath;
    if (currentWorkspaceFolder === undefined) {
        void vscode_1.window.showWarningMessage('Please open a workspace to create .gitignore');
        return;
    }
    const ignorePath = (0, path_1.join)(currentWorkspaceFolder, '.gitignore');
    if ((0, fs_1.existsSync)(ignorePath)) {
        const overwrite = await vscode_1.window.showWarningMessage('".gitignore" file is already exist. Do you want to overwrite?', 'Yes', 'No');
        if (overwrite === 'No') {
            return;
        }
    }
    (0, fs_extra_1.writeFile)(ignorePath, ignoreFileContent, (err) => {
        try {
            if (err) {
                void vscode_1.window.showErrorMessage(err.name);
            }
        }
        catch (e) {
            void vscode_1.window.showErrorMessage(e);
        }
    });
}
exports.createGitignore = createGitignore;
//# sourceMappingURL=rGitignore.js.map