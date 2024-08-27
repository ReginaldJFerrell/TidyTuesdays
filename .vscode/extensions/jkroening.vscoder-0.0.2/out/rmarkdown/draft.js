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
exports.newDraft = void 0;
const vscode_1 = require("vscode");
const extension_1 = require("../extension");
const util_1 = require("../util");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
async function getTemplateItems(cwd) {
    const lim = '---vsc---';
    const rPath = await (0, util_1.getRpath)();
    const options = {
        cwd: cwd,
        env: {
            ...process.env,
            VSCR_LIM: lim
        }
    };
    const rScriptFile = extension_1.extensionContext.asAbsolutePath('R/rmarkdown/templates.R');
    const args = [
        '--silent',
        '--slave',
        '--no-save',
        '--no-restore',
        '-f',
        rScriptFile
    ];
    try {
        const result = await (0, util_1.spawnAsync)(rPath, args, options);
        if (result.status !== 0) {
            throw result.error || new Error(result.stderr);
        }
        const re = new RegExp(`${lim}(.*)${lim}`, 'ms');
        const match = re.exec(result.stdout);
        if (match.length !== 2) {
            throw new Error('Could not parse R output.');
        }
        const json = match[1];
        const templates = JSON.parse(json) || [];
        const items = templates.map((x) => {
            return {
                alwaysShow: false,
                description: `{${x.package}}`,
                label: x.name + (x.create_dir ? ' $(new-folder)' : ''),
                detail: x.description,
                picked: false,
                info: x
            };
        });
        return items;
    }
    catch (e) {
        console.log(e);
        void vscode_1.window.showErrorMessage(e.message);
    }
}
async function launchTemplatePicker(cwd) {
    const options = {
        matchOnDescription: true,
        matchOnDetail: true,
        canPickMany: false,
        ignoreFocusOut: false,
        placeHolder: '',
        onDidSelectItem: undefined
    };
    const items = await getTemplateItems(cwd);
    const selection = await vscode_1.window.showQuickPick(items, options);
    return selection;
}
async function makeDraft(file, template, cwd) {
    const fileString = (0, util_1.ToRStringLiteral)(file, '');
    const cmd = `cat(normalizePath(rmarkdown::draft(file='${fileString}', template='${template.info.id}', package='${template.info.package}', edit=FALSE)))`;
    return await (0, util_1.executeRCommand)(cmd, cwd, (e) => {
        void vscode_1.window.showErrorMessage(e.message);
        return '';
    });
}
async function newDraft() {
    var _a, _b;
    const cwd = (_b = (_a = (0, util_1.getCurrentWorkspaceFolder)()) === null || _a === void 0 ? void 0 : _a.uri.fsPath) !== null && _b !== void 0 ? _b : os.homedir();
    const template = await launchTemplatePicker(cwd);
    if (!template) {
        return;
    }
    if (template.info.create_dir) {
        let defaultPath = path.join(cwd, 'draft');
        let i = 1;
        while (fs.existsSync(defaultPath)) {
            defaultPath = path.join(cwd, `draft_${++i}`);
        }
        const uri = await vscode_1.window.showSaveDialog({
            defaultUri: vscode_1.Uri.file(defaultPath),
            filters: {
                'Folder': ['']
            },
            saveLabel: 'Create Folder',
            title: 'R Markdown: New Draft'
        });
        if (uri) {
            const parsedPath = path.parse(uri.fsPath);
            const dir = path.join(parsedPath.dir, parsedPath.name);
            if (fs.existsSync(dir)) {
                if (await (0, util_1.getConfirmation)(`Folder already exists. Are you sure to replace the folder?`)) {
                    fs.rmdirSync(dir, { recursive: true });
                }
                else {
                    return;
                }
            }
            const draftPath = await makeDraft(uri.fsPath, template, cwd);
            if (draftPath) {
                await vscode_1.workspace.openTextDocument(draftPath)
                    .then(document => vscode_1.window.showTextDocument(document));
            }
        }
    }
    else {
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vscode-R-'));
        const tempFile = path.join(tempDir, 'draft.Rmd');
        const draftPath = await makeDraft(tempFile, template, cwd);
        if (draftPath) {
            const text = fs.readFileSync(draftPath, 'utf8');
            await vscode_1.workspace.openTextDocument({ language: 'rmd', content: text })
                .then(document => vscode_1.window.showTextDocument(document));
        }
        fs.rmdirSync(tempDir, { recursive: true });
    }
}
exports.newDraft = newDraft;
//# sourceMappingURL=draft.js.map