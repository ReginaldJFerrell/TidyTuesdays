'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanLine = exports.LineCache = void 0;
/**
 * Class to hold lines that have been fetched from the document after they have been preprocessed.
 */
class LineCache {
    constructor(getLine, lineCount) {
        this.getLine = getLine;
        this.lineCount = lineCount;
        this.lineCache = new Map();
        this.endsInOperatorCache = new Map();
    }
    addLineToCache(line) {
        const cleaned = cleanLine(this.getLine(line));
        const endsInOperator = doesLineEndInOperator(cleaned);
        this.lineCache.set(line, cleaned);
        this.endsInOperatorCache.set(line, endsInOperator);
    }
    getEndsInOperatorFromCache(line) {
        const lineInCache = this.lineCache.has(line);
        if (!lineInCache) {
            this.addLineToCache(line);
        }
        const s = this.endsInOperatorCache.get(line);
        return (s);
    }
    getLineFromCache(line) {
        const lineInCache = this.lineCache.has(line);
        if (!lineInCache) {
            this.addLineToCache(line);
        }
        const s = this.lineCache.get(line);
        return (s);
    }
}
exports.LineCache = LineCache;
function isQuote(c) {
    return c === '"' || c === '\'' || c === '`';
}
function isComment(c) {
    return c === '#';
}
function cleanLine(text) {
    let cleaned = '';
    let withinQuotes = null;
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (isQuote(c)) {
            if (withinQuotes === null) {
                withinQuotes = c;
            }
            else if (withinQuotes === c) {
                withinQuotes = null;
            }
        }
        if (isComment(c) && !withinQuotes) {
            break;
        }
        cleaned += c;
    }
    return (cleaned.trimEnd());
}
exports.cleanLine = cleanLine;
function doesLineEndInOperator(text) {
    const endingOperatorIndex = text.search(/(,|\+|!|\$|\^|&|\*|-|=|:|~|\||\/|\?|<|>|%.*%)(\s*|\s*#.*)$/);
    const spacesOnlyIndex = text.search(/^\s*$/);
    return ((endingOperatorIndex >= 0) || (spacesOnlyIndex >= 0));
}
//# sourceMappingURL=lineCache.js.map