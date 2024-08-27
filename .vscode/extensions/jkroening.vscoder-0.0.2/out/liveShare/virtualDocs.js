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
exports.openVirtualDoc = exports.docProvider = exports.docScheme = void 0;
const vscode = __importStar(require("vscode"));
exports.docScheme = 'vscode-r';
exports.docProvider = new class {
    // class can be expanded if needed
    provideTextDocumentContent(uri) {
        return uri.query;
    }
};
async function openVirtualDoc(file, content, preserveFocus, preview, viewColumn) {
    if (content) {
        const uri = vscode.Uri.parse(`${exports.docScheme}:${file}?${content}`);
        const doc = await vscode.workspace.openTextDocument(uri);
        await vscode.window.showTextDocument(doc, {
            preserveFocus: preserveFocus,
            preview: preview,
            viewColumn: viewColumn
        });
    }
}
exports.openVirtualDoc = openVirtualDoc;
//# sourceMappingURL=virtualDocs.js.map