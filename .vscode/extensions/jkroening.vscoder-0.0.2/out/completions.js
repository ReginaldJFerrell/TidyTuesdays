"use strict";
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
exports.LiveCompletionItemProvider = exports.StaticCompletionItemProvider = exports.HelpLinkHoverProvider = exports.HoverProvider = void 0;
const vscode = __importStar(require("vscode"));
const session = __importStar(require("./session"));
const selection_1 = require("./selection");
const lineCache_1 = require("./lineCache");
const extension_1 = require("./extension");
const util_1 = require("./util");
const rmarkdown_1 = require("./rmarkdown");
// Get with names(roxygen2:::default_tags())
const roxygenTagCompletionItems = [
    'export', 'exportClass', 'exportMethod', 'exportPattern', 'import', 'importClassesFrom',
    'importFrom', 'importMethodsFrom', 'rawNamespace', 'S3method', 'useDynLib', 'aliases',
    'author', 'backref', 'concept', 'describeIn', 'description', 'details',
    'docType', 'encoding', 'evalRd', 'example', 'examples', 'family',
    'field', 'format', 'inherit', 'inheritParams', 'inheritDotParams', 'inheritSection',
    'keywords', 'method', 'name', 'md', 'noMd', 'noRd',
    'note', 'param', 'rdname', 'rawRd', 'references', 'return',
    'section', 'seealso', 'slot', 'source', 'template', 'templateVar',
    'title', 'usage'
].map((x) => new vscode.CompletionItem(`${x} `));
class HoverProvider {
    provideHover(document, position) {
        var _a, _b;
        if (!session.globalenv) {
            return null;
        }
        if (document.languageId === 'rmd') {
            const chunks = (0, rmarkdown_1.getChunks)(document);
            const chunk = chunks.find((chunk) => chunk.language === 'r' && chunk.startLine < position.line && chunk.endLine > position.line);
            if (!chunk) {
                return null;
            }
        }
        const wordRange = document.getWordRangeAtPosition(position);
        const text = document.getText(wordRange);
        // use juggling check here for both
        // null and undefined
        // eslint-disable-next-line eqeqeq
        if (((_a = session.globalenv[text]) === null || _a === void 0 ? void 0 : _a.str) == null) {
            return null;
        }
        return new vscode.Hover(`\`\`\`\n${(_b = session.globalenv[text]) === null || _b === void 0 ? void 0 : _b.str}\n\`\`\``);
    }
}
exports.HoverProvider = HoverProvider;
class HelpLinkHoverProvider {
    async provideHover(document, position) {
        if (!(0, util_1.config)().get('helpPanel.enableHoverLinks')) {
            return null;
        }
        if (document.languageId === 'rmd') {
            const chunks = (0, rmarkdown_1.getChunks)(document);
            const chunk = chunks.find((chunk) => chunk.language === 'r' && chunk.startLine < position.line && chunk.endLine > position.line);
            if (!chunk) {
                return null;
            }
        }
        const re = /([a-zA-Z0-9._:])+/;
        const wordRange = document.getWordRangeAtPosition(position, re);
        const token = document.getText(wordRange);
        const aliases = await (extension_1.globalRHelp === null || extension_1.globalRHelp === void 0 ? void 0 : extension_1.globalRHelp.getMatchingAliases(token)) || [];
        const mds = aliases.map(a => {
            const cmdText = `${a.package}::${a.name}`;
            const args = [`/library/${a.package}/html/${a.alias}.html`];
            const encodedArgs = encodeURIComponent(JSON.stringify(args));
            const cmd = 'command:r.helpPanel.openForPath';
            const cmdUri = vscode.Uri.parse(`${cmd}?${encodedArgs}`);
            return `[\`${cmdText}\`](${cmdUri})`;
        });
        const md = new vscode.MarkdownString(mds.join('  \n'));
        md.isTrusted = true;
        return new vscode.Hover(md, wordRange);
    }
}
exports.HelpLinkHoverProvider = HelpLinkHoverProvider;
class StaticCompletionItemProvider {
    provideCompletionItems(document, position) {
        if (document.languageId === 'rmd') {
            const chunks = (0, rmarkdown_1.getChunks)(document);
            const chunk = chunks.find((chunk) => chunk.language === 'r' && chunk.startLine < position.line && chunk.endLine > position.line);
            if (!chunk) {
                return undefined;
            }
        }
        if (document.lineAt(position).text
            .substr(0, 2) === '#\'') {
            return roxygenTagCompletionItems;
        }
        return undefined;
    }
}
exports.StaticCompletionItemProvider = StaticCompletionItemProvider;
class LiveCompletionItemProvider {
    provideCompletionItems(document, position, token, completionContext) {
        const items = [];
        if (token.isCancellationRequested) {
            return items;
        }
        if (document.languageId === 'rmd') {
            const chunks = (0, rmarkdown_1.getChunks)(document);
            const chunk = chunks.find((chunk) => chunk.language === 'r' && chunk.startLine < position.line && chunk.endLine > position.line);
            if (!chunk) {
                return items;
            }
        }
        const trigger = completionContext.triggerCharacter;
        if (trigger === undefined) {
            Object.keys(session.globalenv).forEach((key) => {
                const obj = session.globalenv[key];
                const item = new vscode.CompletionItem(key, obj.type === 'closure' || obj.type === 'builtin'
                    ? vscode.CompletionItemKind.Function
                    : vscode.CompletionItemKind.Field);
                item.detail = '[session]';
                item.documentation = new vscode.MarkdownString(`\`\`\`r\n${obj.str}\n\`\`\``);
                items.push(item);
            });
        }
        else if (trigger === '$' || trigger === '@') {
            const symbolPosition = new vscode.Position(position.line, position.character - 1);
            const symbolRange = document.getWordRangeAtPosition(symbolPosition);
            const symbol = document.getText(symbolRange);
            const doc = new vscode.MarkdownString('Element of `' + symbol + '`');
            const obj = session.globalenv[symbol];
            let names;
            if (obj !== undefined) {
                if (completionContext.triggerCharacter === '$') {
                    names = obj.names;
                }
                else if (completionContext.triggerCharacter === '@') {
                    names = obj.slots;
                }
            }
            if (names) {
                items.push(...getCompletionItems(names, vscode.CompletionItemKind.Field, '[session]', doc));
            }
        }
        if (trigger === undefined || trigger === '[' || trigger === ',' || trigger === '"' || trigger === '\'') {
            items.push(...getBracketCompletionItems(document, position, token));
        }
        if (trigger === undefined || trigger === '(' || trigger === ',') {
            items.push(...getPipelineCompletionItems(document, position, token));
        }
        return items;
    }
}
exports.LiveCompletionItemProvider = LiveCompletionItemProvider;
function getCompletionItems(names, kind, detail, documentation) {
    const len = names.length.toString().length;
    let index = 0;
    return names.map((name) => {
        const item = new vscode.CompletionItem(name, kind);
        item.detail = detail;
        item.documentation = documentation;
        item.sortText = `0-${index.toString().padStart(len, '0')}`;
        index++;
        return item;
    });
}
function getBracketCompletionItems(document, position, token) {
    const items = [];
    let range = new vscode.Range(new vscode.Position(position.line, 0), position);
    let expectOpenBrackets = 0;
    let symbol;
    while (range) {
        if (token.isCancellationRequested) {
            return;
        }
        const text = document.getText(range);
        for (let i = text.length - 1; i >= 0; i -= 1) {
            const chr = text.charAt(i);
            if (chr === ']') {
                expectOpenBrackets += 1;
            }
            else if (chr === '[') {
                if (expectOpenBrackets === 0) {
                    const symbolPosition = new vscode.Position(range.start.line, i - 1);
                    const symbolRange = document.getWordRangeAtPosition(symbolPosition);
                    symbol = document.getText(symbolRange);
                    range = undefined;
                    break;
                }
                else {
                    expectOpenBrackets -= 1;
                }
            }
        }
        if ((range === null || range === void 0 ? void 0 : range.start.line) > 0) {
            range = document.lineAt(range.start.line - 1).range; // check previous line
        }
        else {
            range = undefined;
        }
    }
    if (!token.isCancellationRequested && symbol !== undefined) {
        const obj = session.globalenv[symbol];
        if (obj !== undefined && obj.names !== undefined) {
            const doc = new vscode.MarkdownString('Element of `' + symbol + '`');
            items.push(...getCompletionItems(obj.names, vscode.CompletionItemKind.Field, '[session]', doc));
        }
    }
    return items;
}
function getPipelineCompletionItems(document, position, token) {
    const items = [];
    const range = (0, selection_1.extendSelection)(position.line, (x) => document.lineAt(x).text, document.lineCount);
    let symbol;
    for (let i = range.startLine; i <= range.endLine; i++) {
        if (token.isCancellationRequested) {
            break;
        }
        const line = document.lineAt(i);
        if (line.isEmptyOrWhitespace) {
            continue;
        }
        const cleanedLine = (0, lineCache_1.cleanLine)(line.text);
        if (cleanedLine.length === 0) {
            continue;
        }
        const pipeSymbolIndex = line.text.search(/([\w_.]+)\s*(%.+%|\|>)/);
        if (pipeSymbolIndex < 0) {
            break;
        }
        const symbolPosition = new vscode.Position(i, pipeSymbolIndex);
        const symbolRange = document.getWordRangeAtPosition(symbolPosition);
        if (symbolRange !== undefined) {
            symbol = document.getText(symbolRange);
        }
        break;
    }
    if (!token.isCancellationRequested && symbol !== undefined) {
        const obj = session.globalenv[symbol];
        if (obj !== undefined && obj.names !== undefined) {
            const doc = new vscode.MarkdownString('Element of `' + symbol + '`');
            items.push(...getCompletionItems(obj.names, vscode.CompletionItemKind.Field, '[session]', doc));
        }
    }
    return items;
}
//# sourceMappingURL=completions.js.map