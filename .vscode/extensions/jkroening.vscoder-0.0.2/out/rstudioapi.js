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
exports.trackLastActiveTextEditor = exports.sendCodeToRTerminal = exports.launchAddinPicker = exports.purgeAddinPickerItems = exports.getAddinPickerItems = exports.documentNew = exports.projectPath = exports.documentSaveAll = exports.documentSave = exports.setSelections = exports.navigateToFile = exports.showDialog = exports.replaceTextInCurrentSelection = exports.insertOrModifyText = exports.documentContext = exports.activeEditorContext = exports.dispatchRStudioAPICall = void 0;
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
const vscode_1 = require("vscode");
const fs_extra_1 = require("fs-extra");
const path = __importStar(require("path"));
const session_1 = require("./session");
const rTerminal_1 = require("./rTerminal");
const util_1 = require("./util");
let lastActiveTextEditor;
async function dispatchRStudioAPICall(action, args, sd) {
    switch (action) {
        case 'active_editor_context': {
            await (0, session_1.writeResponse)(activeEditorContext(), sd);
            break;
        }
        case 'insert_or_modify_text': {
            await insertOrModifyText(args.query, args.id);
            await (0, session_1.writeSuccessResponse)(sd);
            break;
        }
        case 'replace_text_in_current_selection': {
            await replaceTextInCurrentSelection(args.text, args.id);
            await (0, session_1.writeSuccessResponse)(sd);
            break;
        }
        case 'show_dialog': {
            showDialog(args.message);
            await (0, session_1.writeSuccessResponse)(sd);
            break;
        }
        case 'navigate_to_file': {
            await navigateToFile(args.file, args.line, args.column);
            await (0, session_1.writeSuccessResponse)(sd);
            break;
        }
        case 'set_selection_ranges': {
            await setSelections(args.ranges, args.id);
            await (0, session_1.writeSuccessResponse)(sd);
            break;
        }
        case 'document_save': {
            await documentSave(args.id);
            await (0, session_1.writeSuccessResponse)(sd);
            break;
        }
        case 'document_save_all': {
            await documentSaveAll();
            await (0, session_1.writeSuccessResponse)(sd);
            break;
        }
        case 'get_project_path': {
            await (0, session_1.writeResponse)(projectPath(), sd);
            break;
        }
        case 'document_context': {
            await (0, session_1.writeResponse)(await documentContext(args.id), sd);
            break;
        }
        case 'document_new': {
            await documentNew(args.text, args.type, args.position);
            await (0, session_1.writeSuccessResponse)(sd);
            break;
        }
        case 'restart_r': {
            await (0, rTerminal_1.restartRTerminal)();
            await (0, session_1.writeSuccessResponse)(sd);
            break;
        }
        case 'send_to_console': {
            await sendCodeToRTerminal(args.code, args.execute, args.focus);
            await (0, session_1.writeSuccessResponse)(sd);
            break;
        }
        default:
            console.error(`[dispatchRStudioAPICall] Unsupported action: ${action}`);
    }
}
exports.dispatchRStudioAPICall = dispatchRStudioAPICall;
//rstudioapi
function activeEditorContext() {
    // info returned from RStudio:
    // list with:
    // id
    // path
    // contents
    // selection - a list of selections
    const currentDocument = getLastActiveTextEditor().document;
    return {
        id: currentDocument.uri,
        contents: currentDocument.getText(),
        path: currentDocument.fileName,
        selection: getLastActiveTextEditor().selections
    };
}
exports.activeEditorContext = activeEditorContext;
async function documentContext(id) {
    const target = findTargetUri(id);
    const targetDocument = await vscode_1.workspace.openTextDocument(target);
    console.info(`[documentContext] getting context for: ${target.path}`);
    return {
        id: targetDocument.uri
    };
}
exports.documentContext = documentContext;
async function insertOrModifyText(query, id = null) {
    const target = findTargetUri(id);
    const targetDocument = await vscode_1.workspace.openTextDocument(target);
    console.info(`[insertTextAtPosition] inserting text into: ${target.path}`);
    const edit = new vscode_1.WorkspaceEdit();
    query.forEach((op) => {
        assertSupportedEditOperation(op.operation);
        let editLocation;
        const editText = normaliseEditText(op.text, op.location, op.operation, targetDocument);
        if (op.operation === 'insertText') {
            editLocation = parsePosition(op.location, targetDocument);
            console.info(`[insertTextAtPosition] inserting at: ${JSON.stringify(editLocation)}`);
            console.info(`[insertTextAtPosition] inserting text: ${editText}`);
            edit.insert(target, editLocation, editText);
        }
        else {
            editLocation = parseRange(op.location, targetDocument);
            console.info(`[insertTextAtPosition] replacing at: ${JSON.stringify(editLocation)}`);
            console.info(`[insertTextAtPosition] replacing with text: ${editText}`);
            edit.replace(target, editLocation, editText);
        }
    });
    void vscode_1.workspace.applyEdit(edit);
}
exports.insertOrModifyText = insertOrModifyText;
async function replaceTextInCurrentSelection(text, id) {
    const target = findTargetUri(id);
    console.info(`[replaceTextInCurrentSelection] inserting: ${text} into ${target.path}`);
    const edit = new vscode_1.WorkspaceEdit();
    edit.replace(target, getLastActiveTextEditor().selection, text);
    await vscode_1.workspace.applyEdit(edit);
}
exports.replaceTextInCurrentSelection = replaceTextInCurrentSelection;
function showDialog(message) {
    void vscode_1.window.showInformationMessage(message);
}
exports.showDialog = showDialog;
async function navigateToFile(file, line, column) {
    const targetDocument = await vscode_1.workspace.openTextDocument(vscode_1.Uri.file(file));
    const editor = await vscode_1.window.showTextDocument(targetDocument);
    const targetPosition = parsePosition([line, column], targetDocument);
    editor.selection = new vscode_1.Selection(targetPosition, targetPosition);
    editor.revealRange(new vscode_1.Range(targetPosition, targetPosition));
}
exports.navigateToFile = navigateToFile;
async function setSelections(ranges, id) {
    // Setting selections can only be done on TextEditors not TextDocuments, but
    // it is the latter which are the things actually referred to by `id`. In
    // VSCode it's not possible to get a list of the open text editors. it is not
    // window.visibleTextEditors - this is only editors (tabs) with text showing.
    // The only editors we know about are those that are visible and the last
    // active (which may not be visible if it was overtaken by a WebViewPanel).
    // This function looks to see if a text editor for the document id is amongst
    // those known, and if not, it opens and shows that document, but in a
    // texteditor 'beside' the current one.
    // The rationale for this is:
    // If an addin is trying to set selections in an editor that is not the active
    // one it is most likely that it was active before the addin ran, but the addin
    // opened a something that overtook its' focus. The most likely culprit for
    // this is a shiny app. In the case that the target window is visible
    // alongside the shiny app, it will be found and used. If it is not visible,
    // there's a change it may be the last active, if the shiny app over took it.
    // If it is neither of these things a new one needs to be opened to set
    // selections and the question is whether open it in the same window as the
    // shiny app, or the one 'beside'. 'beside' is preferred since it allows shiny
    // apps that work interactively with an open document to behave more smoothly.
    // {prefixer} is an example of one of these.
    const target = findTargetUri(id);
    const targetDocument = await vscode_1.workspace.openTextDocument(target);
    const editor = await reuseOrCreateEditor(targetDocument);
    const selectionObjects = ranges.map(x => {
        const newRange = parseRange(x, targetDocument);
        const newSelection = new vscode_1.Selection(newRange.start, newRange.end);
        return (newSelection);
    });
    editor.selections = selectionObjects;
}
exports.setSelections = setSelections;
async function documentSave(id) {
    const target = findTargetUri(id);
    const targetDocument = await vscode_1.workspace.openTextDocument(target);
    await targetDocument.save();
}
exports.documentSave = documentSave;
async function documentSaveAll() {
    await vscode_1.workspace.saveAll();
}
exports.documentSaveAll = documentSaveAll;
function projectPath() {
    if (typeof vscode_1.workspace.workspaceFolders !== 'undefined') {
        // Is there a root folder open?
        if (vscode_1.workspace.workspaceFolders.length === 1) {
            // In single root common case, this will always work.
            return {
                path: vscode_1.workspace.workspaceFolders[0].uri.path
            };
        }
        else if (vscode_1.workspace.workspaceFolders.length > 1) {
            // In less common multi-root folder case is a bit tricky. If the active
            // text editor has scheme 'untitled:' (is unsaved), then
            // workspace.getWorkspaceFolder() won't be able to find its Uri in any
            // folder and will return undefined.
            const currentDocument = getLastActiveTextEditor().document;
            const currentDocFolder = vscode_1.workspace.getWorkspaceFolder(currentDocument.uri);
            if (typeof currentDocFolder !== 'undefined') {
                return {
                    path: currentDocFolder.uri.path
                };
            }
        }
    }
    // if we got to here either:
    //   - the workspaceFolders array was undefined (no folder open)
    //   - the activeText editor was an unsaved document, which has undefined workspace folder.
    // return undefined and handle with a message in R.
    return {
        path: undefined
    };
}
exports.projectPath = projectPath;
async function documentNew(text, type, position) {
    const documentUri = vscode_1.Uri.parse('untitled:' + path.join(projectPath().path, 'new_document.' + type));
    const targetDocument = await vscode_1.workspace.openTextDocument(documentUri);
    const edit = new vscode_1.WorkspaceEdit();
    const docLines = targetDocument.lineCount;
    edit.replace(documentUri, targetDocument.validateRange(new vscode_1.Range(new vscode_1.Position(0, 0), new vscode_1.Position(docLines + 1, 0))), text);
    void vscode_1.workspace.applyEdit(edit).then(async () => {
        const editor = await vscode_1.window.showTextDocument(targetDocument);
        editor.selections = [new vscode_1.Selection(parsePosition(position, targetDocument), parsePosition(position, targetDocument))];
    });
}
exports.documentNew = documentNew;
let addinQuickPicks = undefined;
async function getAddinPickerItems() {
    if (typeof addinQuickPicks === 'undefined') {
        const addins = await (0, fs_extra_1.readJSON)(path.join(session_1.sessionDir, 'addins.json')).
            then((result) => result, () => {
            throw ('Could not find list of installed addins.' +
                ' options(vsc.rstudioapi = TRUE) must be set in your .Rprofile to use ' +
                ' RStudio Addins');
        });
        const addinItems = addins.map((x) => {
            return {
                alwaysShow: false,
                description: `{${x.package}}`,
                label: x.name,
                detail: x.description,
                picked: false,
                binding: x.binding,
                package: x.package,
            };
        });
        addinQuickPicks = addinItems;
    }
    return addinQuickPicks;
}
exports.getAddinPickerItems = getAddinPickerItems;
function purgeAddinPickerItems() {
    addinQuickPicks = undefined;
}
exports.purgeAddinPickerItems = purgeAddinPickerItems;
async function launchAddinPicker() {
    if (!(0, util_1.config)().get('sessionWatcher')) {
        void vscode_1.window.showErrorMessage('{rstudioapi} emulation requires session watcher to be enabled in extension config.');
        return;
    }
    if (!(0, session_1.sessionDirectoryExists)()) {
        void vscode_1.window.showErrorMessage('No active R terminal session, attach one to use RStudio addins.');
        return;
    }
    const addinPickerOptions = {
        matchOnDescription: true,
        matchOnDetail: true,
        canPickMany: false,
        ignoreFocusOut: false,
        placeHolder: '',
        onDidSelectItem: undefined
    };
    const addinSelection = await vscode_1.window.showQuickPick(getAddinPickerItems(), addinPickerOptions);
    if (!(typeof addinSelection === 'undefined')) {
        await (0, rTerminal_1.runTextInTerm)(addinSelection.package + ':::' + addinSelection.binding + '()');
    }
}
exports.launchAddinPicker = launchAddinPicker;
async function sendCodeToRTerminal(code, execute, focus) {
    if (execute) {
        console.info(`[sendCodeToRTerminal] sending code: ${code}`);
    }
    else {
        console.info(`[sendCodeToRTerminal] inserting code: ${code}`);
    }
    await (0, rTerminal_1.runTextInTerm)(code, execute);
    if (focus) {
        const rTerm = await (0, rTerminal_1.chooseTerminal)();
        if (rTerm !== undefined) {
            rTerm.show();
        }
    }
}
exports.sendCodeToRTerminal = sendCodeToRTerminal;
//utils
function toVSCCoord(coord) {
    // this is necessary because RStudio will accept negative or infinite values,
    // replacing them with the min or max or the document.
    // These must be clamped non-negative integers accepted by VSCode.
    // For Inf, we set the value to a very large integer, relying on the
    // parsing functions to revise this down using the validatePosition/Range functions.
    let coord_value;
    if (coord === 'Inf') {
        coord_value = 10000000;
    }
    else if (coord === '-Inf') {
        coord_value = 0;
    }
    else if (coord <= 0) {
        coord_value = 0;
    }
    else { // coord > 0
        coord_value = coord - 1; // positions in the rstudioapi are 1 indexed.
    }
    return coord_value;
}
function parsePosition(rs_position, targetDocument) {
    if (rs_position.length !== 2) {
        throw ('an rstudioapi position must be an array of 2 numbers');
    }
    return (targetDocument.validatePosition(new vscode_1.Position(toVSCCoord(rs_position[0]), toVSCCoord(rs_position[1]))));
}
function parseRange(rs_range, targetDocument) {
    if (rs_range.start.length !== 2 || rs_range.end.length !== 2) {
        throw ('an rstudioapi range must be an object containing two numeric arrays');
    }
    return (targetDocument.validateRange(new vscode_1.Range(new vscode_1.Position(toVSCCoord(rs_range.start[0]), toVSCCoord(rs_range.start[1])), new vscode_1.Position(toVSCCoord(rs_range.end[0]), toVSCCoord(rs_range.end[1])))));
}
function assertSupportedEditOperation(operation) {
    if (operation !== 'insertText' && operation !== 'modifyRange') {
        throw ('Operation: ' + operation + ' not supported by VSCode-R API');
    }
}
function normaliseEditText(text, editLocation, operation, targetDocument) {
    // in a document with lines, does the line position extend past the existing
    // lines in the document? rstudioapi adds a newline in this case, so must we.
    // n_lines is a count, line is 0 indexed position hence + 1
    const editStartLine = operation === 'insertText' ?
        editLocation[0] :
        editLocation.start[0];
    if (editStartLine === 'Inf' ||
        (editStartLine + 1 > targetDocument.lineCount && targetDocument.lineCount > 0)) {
        return (text + '\n');
    }
    else {
        return text;
    }
}
// window.onActiveTextEditorDidChange handler
function trackLastActiveTextEditor(editor) {
    if (typeof editor !== 'undefined') {
        lastActiveTextEditor = editor;
    }
}
exports.trackLastActiveTextEditor = trackLastActiveTextEditor;
function getLastActiveTextEditor() {
    return (typeof vscode_1.window.activeTextEditor === 'undefined' ?
        lastActiveTextEditor : vscode_1.window.activeTextEditor);
}
function findTargetUri(id) {
    return (id === null ?
        getLastActiveTextEditor().document.uri : vscode_1.Uri.parse(id));
}
async function reuseOrCreateEditor(targetDocument) {
    // if there's a known text editor for a Uri, use it. if not, open a new one
    // 'beside' the current one. We know about the last active, and all visible.
    // Sometimes the last active is not visible in the case it was overtaken by a
    // WebViewPanel.
    const KnownEditors = [];
    KnownEditors.push(lastActiveTextEditor);
    KnownEditors.push(...vscode_1.window.visibleTextEditors);
    const matchingTextEditors = KnownEditors.filter((editor) => editor.document.uri.toString() === targetDocument.uri.toString());
    if (matchingTextEditors.length === 0) {
        const newEditor = await vscode_1.window.showTextDocument(targetDocument, vscode_1.ViewColumn.Beside);
        return (newEditor);
    }
    else {
        return (matchingTextEditors[0]);
    }
}
//# sourceMappingURL=rstudioapi.js.map