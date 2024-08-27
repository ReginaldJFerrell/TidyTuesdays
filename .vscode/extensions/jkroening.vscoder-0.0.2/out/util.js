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
exports.isRPkgIntalled = exports.spawnAsync = exports.spawn = exports.asDisposable = exports.UriIcon = exports.getDir = exports.escapeHtml = exports.setContext = exports.DummyMemento = exports.executeRCommand = exports.getCranUrl = exports.doWithProgress = exports.executeAsTask = exports.getConfirmation = exports.saveDocument = exports.readContent = exports.getCurrentWorkspaceFolder = exports.checkIfFileExists = exports.checkForSpecialCharacters = exports.delay = exports.ToRStringLiteral = exports.getRterm = exports.getRpath = exports.getRPathConfigEntry = exports.getRpathFromSystem = exports.config = void 0;
const fs_extra_1 = require("fs-extra");
const fs = __importStar(require("fs"));
const winreg = require("winreg");
const path = __importStar(require("path"));
const vscode = __importStar(require("vscode"));
const cp = __importStar(require("child_process"));
const liveShare_1 = require("./liveShare");
const extension_1 = require("./extension");
function config() {
    return vscode.workspace.getConfiguration('r');
}
exports.config = config;
function getRfromEnvPath(platform) {
    let splitChar = ':';
    let fileExtension = '';
    if (platform === 'win32') {
        splitChar = ';';
        fileExtension = '.exe';
    }
    const os_paths = process.env.PATH.split(splitChar);
    for (const os_path of os_paths) {
        const os_r_path = path.join(os_path, 'R' + fileExtension);
        if (fs.existsSync(os_r_path)) {
            return os_r_path;
        }
    }
    return '';
}
async function getRpathFromSystem() {
    let rpath = '';
    const platform = process.platform;
    rpath || (rpath = getRfromEnvPath(platform));
    if (!rpath && platform === 'win32') {
        // Find path from registry
        try {
            const key = new winreg({
                hive: winreg.HKLM,
                key: '\\Software\\R-Core\\R',
            });
            const item = await new Promise((c, e) => key.get('InstallPath', (err, result) => err === null ? c(result) : e(err)));
            rpath = path.join(item.value, 'bin', 'R.exe');
        }
        catch (e) {
            rpath = '';
        }
    }
    return rpath;
}
exports.getRpathFromSystem = getRpathFromSystem;
function getRPathConfigEntry(term = false) {
    const trunc = (term ? 'rterm' : 'rpath');
    const platform = (process.platform === 'win32' ? 'windows' :
        process.platform === 'darwin' ? 'mac' :
            'linux');
    return `${trunc}.${platform}`;
}
exports.getRPathConfigEntry = getRPathConfigEntry;
async function getRpath(quote = false, overwriteConfig) {
    let rpath = '';
    // try the config entry specified in the function arg:
    if (overwriteConfig) {
        rpath = config().get(overwriteConfig);
    }
    // try the os-specific config entry for the rpath:
    const configEntry = getRPathConfigEntry();
    rpath || (rpath = config().get(configEntry));
    // read from path/registry:
    rpath || (rpath = await getRpathFromSystem());
    // represent all invalid paths (undefined, '', null) as undefined:
    rpath || (rpath = undefined);
    if (!rpath) {
        // inform user about missing R path:
        void vscode.window.showErrorMessage(`Cannot find R to use for help, package installation etc. Change setting r.${configEntry} to R path.`);
    }
    else if (quote && /^[^'"].* .*[^'"]$/.exec(rpath)) {
        // if requested and rpath contains spaces, add quotes:
        rpath = `"${rpath}"`;
    }
    else if (!quote) {
        rpath = rpath.replace(/^"(.*)"$/, '$1');
        rpath = rpath.replace(/^'(.*)'$/, '$1');
    }
    else if (process.platform === 'win32' && /^'.* .*'$/.exec(rpath)) {
        // replace single quotes with double quotes on windows
        rpath = rpath.replace(/^'(.*)'$/, '"$1"');
    }
    return rpath;
}
exports.getRpath = getRpath;
async function getRterm() {
    const configEntry = getRPathConfigEntry(true);
    let rpath = config().get(configEntry);
    rpath || (rpath = await getRpathFromSystem());
    if (rpath !== '') {
        return rpath;
    }
    void vscode.window.showErrorMessage(`Cannot find R for creating R terminal. Change setting r.${configEntry} to R path.`);
    return undefined;
}
exports.getRterm = getRterm;
function ToRStringLiteral(s, quote) {
    if (s === undefined) {
        return 'NULL';
    }
    return (quote +
        s.replace(/\\/g, '\\\\')
            .replace(/"""/g, `\\${quote}`)
            .replace(/\\n/g, '\\n')
            .replace(/\\r/g, '\\r')
            .replace(/\\t/g, '\\t')
            .replace(/\\b/g, '\\b')
            .replace(/\\a/g, '\\a')
            .replace(/\\f/g, '\\f')
            .replace(/\\v/g, '\\v') +
        quote);
}
exports.ToRStringLiteral = ToRStringLiteral;
async function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
exports.delay = delay;
function checkForSpecialCharacters(text) {
    return !/[~`!#$%^&*+=\-[\]\\';,/{}|\\":<>?\s]/g.test(text);
}
exports.checkForSpecialCharacters = checkForSpecialCharacters;
function checkIfFileExists(filePath) {
    return (0, fs_extra_1.existsSync)(filePath);
}
exports.checkIfFileExists = checkIfFileExists;
function getCurrentWorkspaceFolder() {
    if (vscode.workspace.workspaceFolders !== undefined) {
        if (vscode.workspace.workspaceFolders.length === 1) {
            return vscode.workspace.workspaceFolders[0];
        }
        else if (vscode.workspace.workspaceFolders.length > 1) {
            const currentDocument = vscode.window.activeTextEditor;
            if (currentDocument !== undefined) {
                return vscode.workspace.getWorkspaceFolder(currentDocument.document.uri);
            }
        }
    }
    return undefined;
}
exports.getCurrentWorkspaceFolder = getCurrentWorkspaceFolder;
function readContent(file, encoding) {
    if (liveShare_1.isGuestSession) {
        return encoding === undefined ? liveShare_1.rGuestService.requestFileContent(file) : liveShare_1.rGuestService.requestFileContent(file, encoding);
    }
    else {
        return encoding === undefined ? (0, fs_extra_1.readFile)(file) : (0, fs_extra_1.readFile)(file, encoding);
    }
}
exports.readContent = readContent;
async function saveDocument(document) {
    if (document.isUntitled) {
        void vscode.window.showErrorMessage('Document is unsaved. Please save and retry running R command.');
        return false;
    }
    const isSaved = document.isDirty ? (await document.save()) : true;
    if (!isSaved) {
        void vscode.window.showErrorMessage('Cannot run R command: document could not be saved.');
        return false;
    }
    return true;
}
exports.saveDocument = saveDocument;
// shows a quick pick asking the user for confirmation
// returns true if the user confirms, false if they cancel or dismiss the quickpick
async function getConfirmation(prompt, confirmation, detail) {
    confirmation || (confirmation = 'Yes');
    const items = [
        {
            label: confirmation,
            detail: detail
        },
        {
            label: 'Cancel'
        }
    ];
    const answer = await vscode.window.showQuickPick(items, {
        placeHolder: prompt
    });
    return answer === items[0];
}
exports.getConfirmation = getConfirmation;
async function executeAsTask(name, cmdOrProcess, args, asProcess = false) {
    let taskDefinition;
    let taskExecution;
    if (asProcess) {
        taskDefinition = { type: 'process' };
        taskExecution = new vscode.ProcessExecution(cmdOrProcess, args);
    }
    else {
        taskDefinition = { type: 'shell' };
        const quotedArgs = args.map(arg => { return { value: arg, quoting: vscode.ShellQuoting.Weak }; });
        taskExecution = new vscode.ShellExecution(cmdOrProcess, quotedArgs);
    }
    const task = new vscode.Task(taskDefinition, vscode.TaskScope.Global, name, 'R', taskExecution, []);
    const taskExecutionRunning = await vscode.tasks.executeTask(task);
    const taskDonePromise = new Promise((resolve) => {
        vscode.tasks.onDidEndTask(e => {
            if (e.execution === taskExecutionRunning) {
                resolve();
            }
        });
    });
    return await taskDonePromise;
}
exports.executeAsTask = executeAsTask;
// executes a callback and shows a 'busy' progress bar during the execution
// synchronous callbacks are converted to async to properly render the progress bar
// default location is in the help pages tree view
async function doWithProgress(cb, location = 'rHelpPages', title, cancellable) {
    const location2 = (typeof location === 'string' ? { viewId: location } : location);
    const options = {
        location: location2,
        cancellable: cancellable !== null && cancellable !== void 0 ? cancellable : false,
        title: title
    };
    let ret;
    await vscode.window.withProgress(options, async (progress, token) => {
        const retPromise = new Promise((resolve) => setTimeout(() => {
            const ret = cb(token, progress);
            resolve(ret);
        }));
        ret = await retPromise;
    });
    return ret;
}
exports.doWithProgress = doWithProgress;
// get the URL of a CRAN website
// argument path is optional and should be relative to the cran root
// currently the CRAN root url is hardcoded, this could be replaced by reading
// the url from config, R, or both
async function getCranUrl(path = '', cwd) {
    const defaultCranUrl = 'https://cran.r-project.org/';
    // get cran URL from R. Returns empty string if option is not set.
    const baseUrl = await executeRCommand('cat(getOption(\'repos\')[\'CRAN\'])', cwd);
    let url;
    try {
        url = new URL(path, baseUrl).toString();
    }
    catch (e) {
        url = new URL(path, defaultCranUrl).toString();
    }
    return url;
}
exports.getCranUrl = getCranUrl;
// executes an R command returns its output to stdout
// uses a regex to filter out output generated e.g. by code in .Rprofile
// returns the provided fallback when the command failes
//
// WARNING: Cannot handle double quotes in the R command! (e.g. `print("hello world")`)
// Single quotes are ok.
//
async function executeRCommand(rCommand, cwd, fallback) {
    const rPath = await getRpath();
    const options = {
        cwd: cwd,
    };
    const lim = '---vsc---';
    const args = [
        '--silent',
        '--slave',
        '--no-save',
        '--no-restore',
        '-e', `cat('${lim}')`,
        '-e', rCommand,
        '-e', `cat('${lim}')`
    ];
    let ret = undefined;
    try {
        const result = await spawnAsync(rPath, args, options);
        if (result.status !== 0) {
            throw result.error || new Error(result.stderr);
        }
        const re = new RegExp(`${lim}(.*)${lim}`, 'ms');
        const match = re.exec(result.stdout);
        if (match.length !== 2) {
            throw new Error('Could not parse R output.');
        }
        ret = match[1];
    }
    catch (e) {
        if (fallback) {
            ret = (typeof fallback === 'function' ? fallback(e) : fallback);
        }
        else {
            console.warn(e);
        }
    }
    return ret;
}
exports.executeRCommand = executeRCommand;
// This class is a wrapper around Map<string, any> that implements vscode.Memento
// Can be used in place of vscode.ExtensionContext.globalState or .workspaceState when no caching is desired
class DummyMemento {
    constructor() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.items = new Map();
    }
    get(key, defaultValue) {
        if (this.items.has(key)) {
            return this.items.get(key) || defaultValue;
        }
        else {
            return defaultValue;
        }
    }
    // eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    async update(key, value) {
        this.items.set(key, value);
    }
    keys() {
        return Object.keys(this.items);
    }
}
exports.DummyMemento = DummyMemento;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
async function setContext(key, value) {
    await vscode.commands.executeCommand('setContext', key, value);
}
exports.setContext = setContext;
// Helper function used to convert raw text files to html
function escapeHtml(source) {
    const entityMap = new Map(Object.entries({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        '\'': '&#39;',
        '/': '&#x2F;'
    }));
    return String(source).replace(/[&<>"'/]/g, (s) => entityMap.get(s) || '');
}
exports.escapeHtml = escapeHtml;
// creates a directory if it doesn't exist,
// returns the input string
function getDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
    return dirPath;
}
exports.getDir = getDir;
class UriIcon {
    constructor(id) {
        const extIconPath = extension_1.extensionContext.asAbsolutePath('images/icons');
        this.dark = vscode.Uri.file(path.join(extIconPath, 'dark', id + '.svg'));
        this.light = vscode.Uri.file(path.join(extIconPath, 'light', id + '.svg'));
    }
}
exports.UriIcon = UriIcon;
/**
 * As Disposable.
 *
 * Create a dispose method for any given object, and push it to the
 * extension subscriptions array
 *
 * @param {T} toDispose - the object to add dispose to
 * @param {Function} disposeFunction - the method called when the object is disposed
 * @returns returned object is considered types T and vscode.Disposable
 */
function asDisposable(toDispose, disposeFunction) {
    toDispose.dispose = () => disposeFunction();
    extension_1.extensionContext.subscriptions.push(toDispose);
    return toDispose;
}
exports.asDisposable = asDisposable;
function spawn(command, args, options, onDisposed) {
    const proc = cp.spawn(command, args, options);
    console.log(`Process ${proc.pid} spawned`);
    let running = true;
    const exitHandler = () => {
        running = false;
        console.log(`Process ${proc.pid} exited`);
    };
    proc.on('exit', exitHandler);
    proc.on('error', exitHandler);
    const disposable = asDisposable(proc, () => {
        if (running) {
            console.log(`Process ${proc.pid} terminating`);
            if (process.platform === 'win32') {
                cp.spawnSync('taskkill', ['/pid', proc.pid.toString(), '/f', '/t']);
            }
            else {
                proc.kill('SIGKILL');
            }
        }
        if (onDisposed) {
            onDisposed();
        }
    });
    return disposable;
}
exports.spawn = spawn;
async function spawnAsync(command, args, options, onDisposed) {
    return new Promise((resolve) => {
        var _a, _b;
        const result = {
            error: undefined,
            pid: undefined,
            output: undefined,
            stdout: '',
            stderr: '',
            status: undefined,
            signal: undefined
        };
        try {
            const childProcess = spawn(command, args, options, onDisposed);
            result.pid = childProcess.pid;
            (_a = childProcess.stdout) === null || _a === void 0 ? void 0 : _a.on('data', (chunk) => {
                result.stdout += chunk.toString();
            });
            (_b = childProcess.stderr) === null || _b === void 0 ? void 0 : _b.on('data', (chunk) => {
                result.stderr += chunk.toString();
            });
            childProcess.on('error', (err) => {
                result.error = err;
            });
            childProcess.on('exit', (code, signal) => {
                result.status = code;
                result.signal = signal;
                resolve(result);
            });
        }
        catch (e) {
            result.error = (e instanceof Error) ? e : new Error(e);
            resolve(result);
        }
    });
}
exports.spawnAsync = spawnAsync;
/**
 * Check if an R package is available or not
 *
 * @param name the R package name that need to be checked
 * @returns a boolean Promise
 */
async function isRPkgIntalled(name, cwd, promptToInstall = false, installMsg, postInstallMsg) {
    const cmd = `cat(requireNamespace('${name}', quietly=TRUE))`;
    const rOut = await executeRCommand(cmd, cwd, 'FALSE');
    const isInstalled = rOut === 'TRUE';
    if (promptToInstall && !isInstalled) {
        if (installMsg === undefined) {
            installMsg = `R package {${name}} is not installed. Do you want to install it?`;
        }
        void vscode.window.showErrorMessage(installMsg, 'Yes', 'No')
            .then(async function (select) {
            if (select === 'Yes') {
                const repo = await getCranUrl('', cwd);
                const rPath = await getRpath();
                const args = ['--silent', '--slave', '-e', `install.packages('${name}', repos='${repo}')`];
                void executeAsTask('Install Package', rPath, args, true);
                if (postInstallMsg) {
                    void vscode.window.showInformationMessage(postInstallMsg, 'OK');
                }
                return true;
            }
        });
    }
    return isInstalled;
}
exports.isRPkgIntalled = isRPkgIntalled;
//# sourceMappingURL=util.js.map