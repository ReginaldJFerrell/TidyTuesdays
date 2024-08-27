'use strict';
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
exports.sendRangeToRepl = exports.runTextInTerm = exports.runChunksInTerm = exports.runSelectionInTerm = exports.chooseTerminal = exports.deleteTerminal = exports.restartRTerminal = exports.createRTerm = exports.makeTerminalOptions = exports.runFromLineToEnd = exports.runFromBeginningToLine = exports.runCommand = exports.runCommandWithEditorPath = exports.runCommandWithSelectionOrWord = exports.runSelectionOrWord = exports.runSelectionRetainCursor = exports.runSelection = exports.runSource = exports.rTerm = void 0;
const path = __importStar(require("path"));
const util_1 = require("util");
const vscode = __importStar(require("vscode"));
const extension_1 = require("./extension");
const util = __importStar(require("./util"));
const selection = __importStar(require("./selection"));
const selection_1 = require("./selection");
const session_1 = require("./session");
const util_2 = require("./util");
const liveShare_1 = require("./liveShare");
const fs = __importStar(require("fs"));
async function runSource(echo) {
    var _a;
    const wad = (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document;
    const isSaved = await util.saveDocument(wad);
    if (isSaved) {
        let rPath = util.ToRStringLiteral(wad.fileName, '"');
        let encodingParam = util.config().get('source.encoding');
        encodingParam = `encoding = "${encodingParam}"`;
        rPath = [rPath, encodingParam].join(', ');
        if (echo) {
            rPath = [rPath, 'echo = TRUE'].join(', ');
        }
        void runTextInTerm(`source(${rPath})`);
    }
}
exports.runSource = runSource;
async function runSelection() {
    await runSelectionInTerm(true);
}
exports.runSelection = runSelection;
async function runSelectionRetainCursor() {
    await runSelectionInTerm(false);
}
exports.runSelectionRetainCursor = runSelectionRetainCursor;
async function runSelectionOrWord(rFunctionName) {
    const text = selection.getWordOrSelection();
    const wrappedText = selection.surroundSelection(text, rFunctionName);
    await runTextInTerm(wrappedText);
}
exports.runSelectionOrWord = runSelectionOrWord;
async function runCommandWithSelectionOrWord(rCommand) {
    const text = selection.getWordOrSelection();
    const call = rCommand.replace(/\$\$/g, text);
    await runTextInTerm(call);
}
exports.runCommandWithSelectionOrWord = runCommandWithSelectionOrWord;
async function runCommandWithEditorPath(rCommand) {
    const wad = vscode.window.activeTextEditor.document;
    const isSaved = await util.saveDocument(wad);
    if (isSaved) {
        const rPath = util.ToRStringLiteral(wad.fileName, '');
        const call = rCommand.replace(/\$\$/g, rPath);
        await runTextInTerm(call);
    }
}
exports.runCommandWithEditorPath = runCommandWithEditorPath;
async function runCommand(rCommand) {
    await runTextInTerm(rCommand);
}
exports.runCommand = runCommand;
async function runFromBeginningToLine() {
    const endLine = vscode.window.activeTextEditor.selection.end.line;
    const charactersOnLine = vscode.window.activeTextEditor.document.lineAt(endLine).text.length;
    const endPos = new vscode.Position(endLine, charactersOnLine);
    const range = new vscode.Range(new vscode.Position(0, 0), endPos);
    const text = vscode.window.activeTextEditor.document.getText(range);
    await runTextInTerm(text);
}
exports.runFromBeginningToLine = runFromBeginningToLine;
async function runFromLineToEnd() {
    const startLine = vscode.window.activeTextEditor.selection.start.line;
    const startPos = new vscode.Position(startLine, 0);
    const endLine = vscode.window.activeTextEditor.document.lineCount;
    const range = new vscode.Range(startPos, new vscode.Position(endLine, 0));
    const text = vscode.window.activeTextEditor.document.getText(range);
    await runTextInTerm(text);
}
exports.runFromLineToEnd = runFromLineToEnd;
async function makeTerminalOptions() {
    const termPath = await (0, util_2.getRterm)();
    const shellArgs = (0, util_2.config)().get('rterm.option');
    const termOptions = {
        name: 'R Interactive',
        shellPath: termPath,
        shellArgs: shellArgs,
    };
    const newRprofile = extension_1.extensionContext.asAbsolutePath(path.join('R', 'session', 'profile.R'));
    const initR = extension_1.extensionContext.asAbsolutePath(path.join('R', 'session', 'init.R'));
    if ((0, util_2.config)().get('sessionWatcher')) {
        termOptions.env = {
            R_PROFILE_USER_OLD: process.env.R_PROFILE_USER,
            R_PROFILE_USER: newRprofile,
            VSCODE_INIT_R: initR,
            VSCODE_WATCHER_DIR: (0, extension_1.homeExtDir)()
        };
    }
    return termOptions;
}
exports.makeTerminalOptions = makeTerminalOptions;
async function createRTerm(preserveshow) {
    const termOptions = await makeTerminalOptions();
    const termPath = termOptions.shellPath;
    if (!termPath) {
        void vscode.window.showErrorMessage('Could not find R path. Please check r.term and r.path setting.');
        return false;
    }
    else if (!fs.existsSync(termPath)) {
        void vscode.window.showErrorMessage(`Cannot find R client at ${termPath}. Please check r.rterm setting.`);
        return false;
    }
    exports.rTerm = vscode.window.createTerminal(termOptions);
    exports.rTerm.show(preserveshow);
    return true;
}
exports.createRTerm = createRTerm;
async function restartRTerminal() {
    if (typeof exports.rTerm !== 'undefined') {
        exports.rTerm.dispose();
        deleteTerminal(exports.rTerm);
        await createRTerm(true);
    }
}
exports.restartRTerminal = restartRTerminal;
function deleteTerminal(term) {
    if ((0, util_1.isDeepStrictEqual)(term, exports.rTerm)) {
        exports.rTerm = undefined;
        if ((0, util_2.config)().get('sessionWatcher')) {
            (0, session_1.removeSessionFiles)();
        }
    }
}
exports.deleteTerminal = deleteTerminal;
async function chooseTerminal() {
    if ((0, util_2.config)().get('alwaysUseActiveTerminal')) {
        if (vscode.window.terminals.length < 1) {
            void vscode.window.showInformationMessage('There are no open terminals.');
            return undefined;
        }
        return vscode.window.activeTerminal;
    }
    let msg = '[chooseTerminal] ';
    msg += `A. There are ${vscode.window.terminals.length} terminals: `;
    for (let i = 0; i < vscode.window.terminals.length; i++) {
        msg += `Terminal ${i}: ${vscode.window.terminals[i].name} `;
    }
    if (vscode.window.terminals.length > 0) {
        const rTermNameOptions = ['R', 'R Interactive'];
        if (vscode.window.activeTerminal !== undefined) {
            const activeTerminalName = vscode.window.activeTerminal.name;
            if (rTermNameOptions.includes(activeTerminalName)) {
                return vscode.window.activeTerminal;
            }
            for (let i = vscode.window.terminals.length - 1; i >= 0; i--) {
                const terminal = vscode.window.terminals[i];
                const terminalName = terminal.name;
                if (rTermNameOptions.includes(terminalName)) {
                    terminal.show(true);
                    return terminal;
                }
            }
        }
        else {
            msg += `B. There are ${vscode.window.terminals.length} terminals: `;
            for (let i = 0; i < vscode.window.terminals.length; i++) {
                msg += `Terminal ${i}: ${vscode.window.terminals[i].name} `;
            }
            // Creating a terminal when there aren't any already does not seem to set activeTerminal
            if (vscode.window.terminals.length === 1) {
                const activeTerminalName = vscode.window.terminals[0].name;
                if (rTermNameOptions.includes(activeTerminalName)) {
                    return vscode.window.terminals[0];
                }
            }
            else {
                msg += `C. There are ${vscode.window.terminals.length} terminals: `;
                for (let i = 0; i < vscode.window.terminals.length; i++) {
                    msg += `Terminal ${i}: ${vscode.window.terminals[i].name} `;
                }
                console.info(msg);
                void vscode.window.showErrorMessage('Error identifying terminal! Please run command "Developer: Toggle Developer Tools", find the message starting with "[chooseTerminal]", and copy the message to https://github.com/REditorSupport/vscode-R/issues');
                return undefined;
            }
        }
    }
    if (exports.rTerm === undefined) {
        await createRTerm(true);
        await (0, util_2.delay)(200); // Let RTerm warm up
    }
    return exports.rTerm;
}
exports.chooseTerminal = chooseTerminal;
async function runSelectionInTerm(moveCursor, useRepl = true) {
    var _a;
    const selection = (0, selection_1.getSelection)();
    if (moveCursor && selection.linesDownToMoveCursor > 0) {
        const lineCount = vscode.window.activeTextEditor.document.lineCount;
        if (selection.linesDownToMoveCursor + vscode.window.activeTextEditor.selection.end.line === lineCount) {
            const endPos = new vscode.Position(lineCount, vscode.window.activeTextEditor.document.lineAt(lineCount - 1).text.length);
            await vscode.window.activeTextEditor.edit(e => e.insert(endPos, '\n'));
        }
        await vscode.commands.executeCommand('cursorMove', { to: 'down', value: selection.linesDownToMoveCursor });
        await vscode.commands.executeCommand('cursorMove', { to: 'wrappedLineFirstNonWhitespaceCharacter' });
    }
    if (useRepl && ((_a = vscode.debug.activeDebugSession) === null || _a === void 0 ? void 0 : _a.type) === 'R-Debugger') {
        await sendRangeToRepl(selection.range);
    }
    else {
        await runTextInTerm(selection.selectedText);
    }
}
exports.runSelectionInTerm = runSelectionInTerm;
async function runChunksInTerm(chunks) {
    const text = chunks
        .map((chunk) => vscode.window.activeTextEditor.document.getText(chunk).trim())
        .filter((chunk) => chunk.length > 0)
        .join('\n');
    if (text.length > 0) {
        return runTextInTerm(text);
    }
}
exports.runChunksInTerm = runChunksInTerm;
async function runTextInTerm(text, execute = true) {
    if (liveShare_1.isGuestSession) {
        liveShare_1.rGuestService.requestRunTextInTerm(text);
    }
    else {
        const term = await chooseTerminal();
        if (term === undefined) {
            return;
        }
        if ((0, util_2.config)().get('bracketedPaste')) {
            if (process.platform !== 'win32') {
                // Surround with ANSI control characters for bracketed paste mode
                text = `\x1b[200~${text}\x1b[201~`;
            }
            term.sendText(text, execute);
        }
        else {
            const rtermSendDelay = (0, util_2.config)().get('rtermSendDelay');
            const split = text.split('\n');
            const last_split = split.length - 1;
            for (const [count, line] of split.entries()) {
                if (count > 0) {
                    await (0, util_2.delay)(rtermSendDelay); // Increase delay if RTerm can't handle speed.
                }
                // Avoid sending newline on last line
                if (count === last_split && !execute) {
                    term.sendText(line, false);
                }
                else {
                    term.sendText(line);
                }
            }
        }
        setFocus(term);
        // Scroll console to see latest output
        await vscode.commands.executeCommand('workbench.action.terminal.scrollToBottom');
    }
}
exports.runTextInTerm = runTextInTerm;
function setFocus(term) {
    const focus = (0, util_2.config)().get('source.focus');
    if (focus !== 'none') {
        term.show(focus !== 'terminal');
    }
}
async function sendRangeToRepl(rng) {
    const editor = vscode.window.activeTextEditor;
    const sel0 = editor.selections;
    let sel1 = new vscode.Selection(rng.start, rng.end);
    while (/^[\r\n]/.exec(editor.document.getText(sel1))) {
        sel1 = new vscode.Selection(sel1.start.translate(1), sel1.end);
    }
    while (/\r?\n\r?\n$/.exec(editor.document.getText(sel1))) {
        sel1 = new vscode.Selection(sel1.start, sel1.end.translate(-1));
    }
    editor.selections = [sel1];
    await vscode.commands.executeCommand('editor.debug.action.selectionToRepl');
    editor.selections = sel0;
}
exports.sendRangeToRepl = sendRangeToRepl;
//# sourceMappingURL=rTerminal.js.map