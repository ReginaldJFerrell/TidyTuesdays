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
exports.activate = exports.rmdKnitManager = exports.rmdPreviewManager = exports.globalHttpgdManager = exports.enableSessionWatcher = exports.extensionContext = exports.globalRHelp = exports.rWorkspace = exports.tmpDir = exports.homeExtDir = void 0;
// interfaces, functions, etc. provided by vscode
const vscode = __importStar(require("vscode"));
const os = __importStar(require("os"));
const path = require("path");
// functions etc. implemented in this extension
const preview = __importStar(require("./preview"));
const rGitignore = __importStar(require("./rGitignore"));
const rTerminal = __importStar(require("./rTerminal"));
const session = __importStar(require("./session"));
const util = __importStar(require("./util"));
const rstudioapi = __importStar(require("./rstudioapi"));
const rmarkdown = __importStar(require("./rmarkdown"));
const workspaceViewer = __importStar(require("./workspaceViewer"));
const apiImplementation = __importStar(require("./apiImplementation"));
const rHelp = __importStar(require("./helpViewer"));
const completions = __importStar(require("./completions"));
const rShare = __importStar(require("./liveShare"));
const httpgdViewer = __importStar(require("./plotViewer"));
const languageService = __importStar(require("./languageService"));
const tasks_1 = require("./tasks");
// global objects used in other files
const homeExtDir = () => util.getDir(path.join(os.homedir(), '.vscode-R'));
exports.homeExtDir = homeExtDir;
const tmpDir = () => util.getDir(path.join((0, exports.homeExtDir)(), 'tmp'));
exports.tmpDir = tmpDir;
exports.rWorkspace = undefined;
exports.globalRHelp = undefined;
exports.enableSessionWatcher = undefined;
exports.globalHttpgdManager = undefined;
exports.rmdPreviewManager = undefined;
exports.rmdKnitManager = undefined;
// Called (once) when the extension is activated
async function activate(context) {
    if (vscode.extensions.getExtension('mikhail-arkhipov.r')) {
        void vscode.window.showInformationMessage('The R Tools (Mikhail-Arkhipov.r) extension is enabled and will have conflicts with vscode-R. To use vscode-R, please disable or uninstall the extension.');
        void vscode.commands.executeCommand('workbench.extensions.search', '@installed R Tools');
    }
    // create a new instance of RExtensionImplementation
    // is used to export an interface to the help panel
    // this export is used e.g. by vscode-r-debugger to show the help panel from within debug sessions
    const rExtension = new apiImplementation.RExtensionImplementation();
    // assign extension context to global variable
    exports.extensionContext = context;
    // assign session watcher setting to global variable
    exports.enableSessionWatcher = util.config().get('sessionWatcher');
    exports.rmdPreviewManager = new rmarkdown.RMarkdownPreviewManager();
    exports.rmdKnitManager = new rmarkdown.RMarkdownKnitManager();
    // register commands specified in package.json
    const commands = {
        // create R terminal
        'r.createRTerm': rTerminal.createRTerm,
        // run code from editor in terminal
        'r.nrow': () => rTerminal.runSelectionOrWord(['nrow']),
        'r.length': () => rTerminal.runSelectionOrWord(['length']),
        'r.head': () => rTerminal.runSelectionOrWord(['head']),
        'r.thead': () => rTerminal.runSelectionOrWord(['t', 'head']),
        'r.names': () => rTerminal.runSelectionOrWord(['names']),
        'r.runSource': () => { void rTerminal.runSource(false); },
        'r.runSelection': rTerminal.runSelection,
        'r.runFromLineToEnd': rTerminal.runFromLineToEnd,
        'r.runFromBeginningToLine': rTerminal.runFromBeginningToLine,
        'r.runSelectionRetainCursor': rTerminal.runSelectionRetainCursor,
        'r.runCommandWithSelectionOrWord': rTerminal.runCommandWithSelectionOrWord,
        'r.runCommandWithEditorPath': rTerminal.runCommandWithEditorPath,
        'r.runCommand': rTerminal.runCommand,
        'r.runSourcewithEcho': () => { void rTerminal.runSource(true); },
        // rmd related
        'r.knitRmd': () => { void exports.rmdKnitManager.knitRmd(false, undefined); },
        'r.knitRmdToPdf': () => { void exports.rmdKnitManager.knitRmd(false, 'pdf_document'); },
        'r.knitRmdToHtml': () => { void exports.rmdKnitManager.knitRmd(false, 'html_document'); },
        'r.knitRmdToAll': () => { void exports.rmdKnitManager.knitRmd(false, 'all'); },
        'r.selectCurrentChunk': rmarkdown.selectCurrentChunk,
        'r.runCurrentChunk': rmarkdown.runCurrentChunk,
        'r.runPreviousChunk': rmarkdown.runPreviousChunk,
        'r.runNextChunk': rmarkdown.runNextChunk,
        'r.runAboveChunks': rmarkdown.runAboveChunks,
        'r.runCurrentAndBelowChunks': rmarkdown.runCurrentAndBelowChunks,
        'r.runBelowChunks': rmarkdown.runBelowChunks,
        'r.runAllChunks': rmarkdown.runAllChunks,
        'r.goToPreviousChunk': rmarkdown.goToPreviousChunk,
        'r.goToNextChunk': rmarkdown.goToNextChunk,
        'r.runChunks': rTerminal.runChunksInTerm,
        'r.rmarkdown.newDraft': () => rmarkdown.newDraft(),
        'r.rmarkdown.setKnitDirectory': () => exports.rmdKnitManager.setKnitDir(),
        'r.rmarkdown.showPreviewToSide': () => exports.rmdPreviewManager.previewRmd(vscode.ViewColumn.Beside),
        'r.rmarkdown.showPreview': (uri) => exports.rmdPreviewManager.previewRmd(vscode.ViewColumn.Active, uri),
        'r.rmarkdown.preview.refresh': () => exports.rmdPreviewManager.updatePreview(),
        'r.rmarkdown.preview.openExternal': () => void exports.rmdPreviewManager.openExternalBrowser(),
        'r.rmarkdown.preview.showSource': () => exports.rmdPreviewManager.showSource(),
        'r.rmarkdown.preview.toggleStyle': () => exports.rmdPreviewManager.toggleTheme(),
        'r.rmarkdown.preview.enableAutoRefresh': () => exports.rmdPreviewManager.enableAutoRefresh(),
        'r.rmarkdown.preview.disableAutoRefresh': () => exports.rmdPreviewManager.disableAutoRefresh(),
        // editor independent commands
        'r.createGitignore': rGitignore.createGitignore,
        'r.loadAll': () => rTerminal.runTextInTerm('devtools::load_all()'),
        // environment independent commands. this is a workaround for using the Tasks API: https://github.com/microsoft/vscode/issues/40758
        'r.build': () => vscode.commands.executeCommand('workbench.action.tasks.runTask', 'R: Build'),
        'r.check': () => vscode.commands.executeCommand('workbench.action.tasks.runTask', 'R: Check'),
        'r.document': () => vscode.commands.executeCommand('workbench.action.tasks.runTask', 'R: Document'),
        'r.install': () => vscode.commands.executeCommand('workbench.action.tasks.runTask', 'R: Install'),
        'r.test': () => vscode.commands.executeCommand('workbench.action.tasks.runTask', 'R: Test'),
        // interaction with R sessions
        'r.previewDataframe': preview.previewDataframe,
        'r.previewEnvironment': preview.previewEnvironment,
        'r.attachActive': session.attachActive,
        'r.launchAddinPicker': rstudioapi.launchAddinPicker,
        // workspace viewer
        'r.workspaceViewer.refreshEntry': () => exports.rWorkspace === null || exports.rWorkspace === void 0 ? void 0 : exports.rWorkspace.refresh(),
        'r.workspaceViewer.view': (node) => workspaceViewer.viewItem(node.label),
        'r.workspaceViewer.remove': (node) => workspaceViewer.removeItem(node.label),
        'r.workspaceViewer.clear': workspaceViewer.clearWorkspace,
        'r.workspaceViewer.load': workspaceViewer.loadWorkspace,
        'r.workspaceViewer.save': workspaceViewer.saveWorkspace,
        // browser controls
        'r.browser.refresh': session.refreshBrowser,
        'r.browser.openExternal': session.openExternalBrowser,
        // (help related commands are registered in rHelp.initializeHelp)
    };
    for (const key in commands) {
        context.subscriptions.push(vscode.commands.registerCommand(key, commands[key]));
    }
    // keep track of terminals
    context.subscriptions.push(vscode.window.onDidCloseTerminal(rTerminal.deleteTerminal));
    // start language service
    if (util.config().get('lsp.enabled')) {
        const lsp = vscode.extensions.getExtension('reditorsupport.r-lsp');
        if (lsp) {
            void vscode.window.showInformationMessage('The R language server extension has been integrated into vscode-R. You need to disable or uninstall REditorSupport.r-lsp and reload window to use the new version.');
            void vscode.commands.executeCommand('workbench.extensions.search', '@installed r-lsp');
        }
        else {
            context.subscriptions.push(new languageService.LanguageService());
        }
    }
    // register on-enter rule for roxygen comments
    const wordPattern = /(-?\d*\.\d\w*)|([^`~!@$^&*()=+[{\]}\\|;:'",<>/\s]+)/g;
    vscode.languages.setLanguageConfiguration('r', {
        onEnterRules: [
            {
                // Automatically continue roxygen comments: #'
                action: { indentAction: vscode.IndentAction.None, appendText: '#\' ' },
                beforeText: /^\s*#'\s*[^\s]/, // matches a non-empty roxygen line
            },
            {
                // Automatically continue roxygen comments: #'
                action: { indentAction: vscode.IndentAction.None, appendText: '#\' ' },
                beforeText: /^\s*#'/,
                previousLineText: /^\s*([^#\s].*|#[^'\s].*|#'\s*[^\s].*|)$/, // matches everything but an empty roxygen line
            },
        ],
        wordPattern,
    });
    // register terminal-provider
    context.subscriptions.push(vscode.window.registerTerminalProfileProvider('r.terminal-profile', {
        async provideTerminalProfile() {
            return {
                options: await rTerminal.makeTerminalOptions()
            };
        }
    }));
    // initialize httpgd viewer
    exports.globalHttpgdManager = httpgdViewer.initializeHttpgd();
    // initialize the package/help related functions
    exports.globalRHelp = await rHelp.initializeHelp(context, rExtension);
    // register codelens and complmetion providers for r markdown
    vscode.languages.registerCodeLensProvider(['r', 'rmd'], new rmarkdown.RMarkdownCodeLensProvider());
    vscode.languages.registerCompletionItemProvider('rmd', new rmarkdown.RMarkdownCompletionItemProvider(), ' ', ',');
    // register (session) hover and completion providers
    vscode.languages.registerHoverProvider(['r', 'rmd'], new completions.HoverProvider());
    vscode.languages.registerHoverProvider(['r', 'rmd'], new completions.HelpLinkHoverProvider());
    vscode.languages.registerCompletionItemProvider(['r', 'rmd'], new completions.StaticCompletionItemProvider(), '@');
    // deploy liveshare listener
    await rShare.initLiveShare(context);
    // register task provider
    const taskProvider = new tasks_1.RTaskProvider();
    vscode.tasks.registerTaskProvider(taskProvider.type, taskProvider);
    // deploy session watcher (if configured by user)
    if (exports.enableSessionWatcher) {
        if (!rShare.isGuestSession) {
            console.info('Initialize session watcher');
            void session.deploySessionWatcher(context.extensionPath);
            // create status bar item that contains info about the session watcher
            console.info('Create sessionStatusBarItem');
            const sessionStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000);
            sessionStatusBarItem.command = 'r.attachActive';
            sessionStatusBarItem.text = 'R: (not attached)';
            sessionStatusBarItem.tooltip = 'Click to attach active terminal.';
            sessionStatusBarItem.show();
            context.subscriptions.push(sessionStatusBarItem);
            void session.startRequestWatcher(sessionStatusBarItem);
        }
        // track active text editor
        rstudioapi.trackLastActiveTextEditor(vscode.window.activeTextEditor);
        vscode.window.onDidChangeActiveTextEditor(rstudioapi.trackLastActiveTextEditor);
        // register the R Workspace tree view
        // creates a custom context value for the workspace view
        // only shows view when session watcher is enabled
        exports.rWorkspace = new workspaceViewer.WorkspaceDataProvider();
        vscode.window.registerTreeDataProvider('workspaceViewer', exports.rWorkspace);
        void vscode.commands.executeCommand('setContext', 'r.WorkspaceViewer:show', exports.enableSessionWatcher);
        // if session watcher is active, register dyamic completion provider
        const liveTriggerCharacters = ['', '[', '(', ',', '$', '@', '"', '\''];
        vscode.languages.registerCompletionItemProvider(['r', 'rmd'], new completions.LiveCompletionItemProvider(), ...liveTriggerCharacters);
    }
    return rExtension;
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map