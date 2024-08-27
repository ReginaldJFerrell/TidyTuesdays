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
exports.RTaskProvider = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const util_1 = require("./util");
const TYPE = 'R';
function makeRArgs(options, code) {
    const codeArgs = [];
    for (const line of code) {
        codeArgs.push('-e');
        codeArgs.push(line);
    }
    const args = options.concat(codeArgs);
    return args;
}
const defaultOptions = ['--no-echo', '--no-restore'];
const rtasks = [
    {
        definition: {
            type: TYPE,
            code: ['devtools::test()']
        },
        name: 'Test',
        group: vscode.TaskGroup.Test,
        problemMatchers: '$testthat'
    },
    {
        definition: {
            type: TYPE,
            code: ['devtools::build()']
        },
        name: 'Build',
        group: vscode.TaskGroup.Build,
        problemMatchers: []
    },
    {
        definition: {
            type: TYPE,
            code: ['devtools::check()']
        },
        name: 'Check',
        group: vscode.TaskGroup.Test,
        problemMatchers: []
    },
    {
        definition: {
            type: TYPE,
            code: ['devtools::document()']
        },
        name: 'Document',
        group: vscode.TaskGroup.Build,
        problemMatchers: []
    },
    {
        definition: {
            type: TYPE,
            code: ['devtools::install()']
        },
        name: 'Install',
        group: vscode.TaskGroup.Build,
        problemMatchers: []
    }
];
function asRTask(rPath, folder, info) {
    var _a;
    const args = makeRArgs((_a = info.definition.options) !== null && _a !== void 0 ? _a : defaultOptions, info.definition.code);
    const rtask = new vscode.Task(info.definition, folder, info.name, info.definition.type, new vscode.ProcessExecution(rPath, args, {
        cwd: info.definition.cwd,
        env: info.definition.env
    }), info.problemMatchers);
    rtask.group = info.group;
    return rtask;
}
class RTaskProvider {
    constructor() {
        this.type = TYPE;
    }
    async provideTasks() {
        const folders = vscode.workspace.workspaceFolders;
        if (!folders) {
            return [];
        }
        const tasks = [];
        const rPath = await (0, util_1.getRpath)(false);
        for (const folder of folders) {
            const isRPackage = fs.existsSync(path.join(folder.uri.fsPath, 'DESCRIPTION'));
            if (isRPackage) {
                for (const rtask of rtasks) {
                    const task = asRTask(rPath, folder, rtask);
                    tasks.push(task);
                }
            }
        }
        return tasks;
    }
    async resolveTask(task) {
        const taskInfo = {
            definition: task.definition,
            group: task.group,
            name: task.name
        };
        const rPath = await (0, util_1.getRpath)(false);
        return asRTask(rPath, vscode.TaskScope.Workspace, taskInfo);
    }
}
exports.RTaskProvider = RTaskProvider;
//# sourceMappingURL=tasks.js.map