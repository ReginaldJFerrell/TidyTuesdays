'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.previewDataframe = exports.previewEnvironment = void 0;
const fs_extra_1 = require("fs-extra");
const vscode_1 = require("vscode");
const rTerminal_1 = require("./rTerminal");
const selection_1 = require("./selection");
const util_1 = require("./util");
async function previewEnvironment() {
    if ((0, util_1.config)().get('sessionWatcher')) {
        await (0, rTerminal_1.runTextInTerm)('View(globalenv())');
    }
    else {
        if (!checkcsv()) {
            return;
        }
        const tmpDir = makeTmpDir();
        const pathToTmpCsv = `${tmpDir}/environment.csv`;
        const envName = 'name=ls()';
        const envClass = 'class=sapply(ls(), function(x) {class(get(x, envir = parent.env(environment())))[1]})';
        const envOut = 'out=sapply(ls(), function(x) {capture.output(str(get(x, envir = parent.env(environment()))), silent = T)[1]})';
        const rWriteCsvCommand = 'write.csv(data.frame('
            + `${envName},`
            + `${envClass},`
            + `${envOut}), '`
            + `${pathToTmpCsv}', row.names=FALSE, quote = TRUE)`;
        await (0, rTerminal_1.runTextInTerm)(rWriteCsvCommand);
        await openTmpCSV(pathToTmpCsv, tmpDir);
    }
}
exports.previewEnvironment = previewEnvironment;
async function previewDataframe() {
    if ((0, util_1.config)().get('sessionWatcher')) {
        const symbol = (0, selection_1.getWordOrSelection)();
        await (0, rTerminal_1.runTextInTerm)(`View(${symbol})`);
    }
    else {
        if (!checkcsv()) {
            return undefined;
        }
        const dataframeName = (0, selection_1.getWordOrSelection)();
        if (!(0, util_1.checkForSpecialCharacters)(dataframeName)) {
            void vscode_1.window.showInformationMessage('This does not appear to be a dataframe.');
            return false;
        }
        const tmpDir = makeTmpDir();
        // Create R write CSV command.  Turn off row names and quotes, they mess with Excel Viewer.
        const pathToTmpCsv = `${tmpDir}/${dataframeName}.csv`;
        const rWriteCsvCommand = `write.csv(${dataframeName}, `
            + `'${pathToTmpCsv}', row.names = FALSE, quote = FALSE)`;
        await (0, rTerminal_1.runTextInTerm)(rWriteCsvCommand);
        await openTmpCSV(pathToTmpCsv, tmpDir);
    }
}
exports.previewDataframe = previewDataframe;
async function openTmpCSV(pathToTmpCsv, tmpDir) {
    await (0, util_1.delay)(350); // Needed since file size has not yet changed
    if (!(0, util_1.checkIfFileExists)(pathToTmpCsv)) {
        void vscode_1.window.showErrorMessage('Dataframe failed to display.');
        (0, fs_extra_1.removeSync)(tmpDir);
        return false;
    }
    // Async poll for R to complete writing CSV.
    const success = await waitForFileToFinish(pathToTmpCsv);
    if (!success) {
        void vscode_1.window.showWarningMessage('Visual Studio Code currently limits opening files to 20 MB.');
        (0, fs_extra_1.removeSync)(tmpDir);
        return false;
    }
    // Open CSV in Excel Viewer and clean up.
    void vscode_1.workspace.openTextDocument(pathToTmpCsv)
        .then(async (file) => {
        await vscode_1.commands.executeCommand('csv.preview', file.uri);
        (0, fs_extra_1.removeSync)(tmpDir);
    });
}
async function waitForFileToFinish(filePath) {
    const fileBusy = true;
    let currentSize = 0;
    let previousSize = 1;
    while (fileBusy) {
        const stats = (0, fs_extra_1.statSync)(filePath);
        currentSize = stats.size;
        // UPDATE: We are now limited to 20 mb by MODEL_TOKENIZATION_LIMIT
        // Https://github.com/Microsoft/vscode/blob/master/src/vs/editor/common/model/textModel.ts#L34
        if (currentSize > 2 * 10000000) { // 20 MB
            return false;
        }
        if (currentSize === previousSize) {
            return true;
        }
        previousSize = currentSize;
        await (0, util_1.delay)(50);
    }
}
function makeTmpDir() {
    let tmpDir = vscode_1.workspace.workspaceFolders[0].uri.fsPath;
    if (process.platform === 'win32') {
        tmpDir = tmpDir.replace(/\\/g, '/');
        tmpDir += '/tmp';
    }
    else {
        tmpDir += '/.tmp';
    }
    if (!(0, fs_extra_1.existsSync)(tmpDir)) {
        (0, fs_extra_1.mkdirSync)(tmpDir);
    }
    return tmpDir;
}
function checkcsv() {
    const iscsv = vscode_1.extensions.getExtension('GrapeCity.gc-excelviewer');
    if (iscsv !== undefined && iscsv.isActive) {
        return true;
    }
    void vscode_1.window.showInformationMessage('This function need to install `GrapeCity.gc-excelviewer`, will you install?', 'Yes', 'No')
        .then((select) => {
        if (select === 'Yes') {
            void vscode_1.commands.executeCommand('workbench.extensions.installExtension', 'GrapeCity.gc-excelviewer');
        }
    });
    return false;
}
//# sourceMappingURL=preview.js.map