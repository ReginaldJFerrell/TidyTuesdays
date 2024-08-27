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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackagesFromCran = void 0;
const cheerio = __importStar(require("cheerio"));
const node_fetch_1 = __importDefault(require("node-fetch"));
async function getPackagesFromCran(cranUrl) {
    const cranSites = [
        {
            url: new URL('stats/descriptions', cranUrl).toString(),
            parseFunction: parseCranJson
        },
        {
            url: new URL('web/packages/available_packages_by_date.html', cranUrl).toString(),
            parseFunction: parseCranTable
        },
        {
            url: new URL('src/contrib/PACKAGES', cranUrl).toString(),
            parseFunction: parseCranPackagesFile
        }
    ];
    let packages = [];
    for (const site of cranSites) {
        try {
            // fetch html
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // seems to fail otherwise?
            const res = await (0, node_fetch_1.default)(site.url);
            const html = await (res).text();
            // parse html
            packages = site.parseFunction(html, site.url);
        }
        catch (e) {
            // These errors are expected, if the repo does not serve a specific URL
        }
        finally {
            // make sure to use safe https again
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';
        }
        // break if successfully fetched & parsed
        if (packages === null || packages === void 0 ? void 0 : packages.length) {
            break;
        }
    }
    return packages;
}
exports.getPackagesFromCran = getPackagesFromCran;
function parseCranPackagesFile(html) {
    var _a;
    const packageNames = ((_a = html.match(/^Package: .*$/gm)) === null || _a === void 0 ? void 0 : _a.map(s => s.replace(/^Package: /, ''))) || [];
    const packages = packageNames.map(s => ({
        name: s,
        description: '',
        isCran: true
    }));
    return packages;
}
function parseCranJson(jsonString) {
    const lines = jsonString.split('\n').filter(v => v);
    const pkgs = lines.map(line => {
        const j = JSON.parse(line);
        const pkg = {
            name: j['Package'],
            description: j['Title'],
            date: j['modified'],
            isCran: true
        };
        return pkg;
    });
    return pkgs;
}
function parseCranTable(html, baseUrl) {
    if (!html) {
        return [];
    }
    const $ = cheerio.load(html);
    const tables = $('table');
    const ret = [];
    // loop over all tables on document and each row as one index entry
    // assumes that the provided html is from a valid index file
    tables.each((tableIndex, table) => {
        const rows = $('tr', table);
        rows.each((rowIndex, row) => {
            var _a, _b, _c;
            const elements = $('td', row);
            if (elements.length === 3) {
                const e0 = elements[0];
                const e1 = elements[1];
                const e2 = elements[2];
                if (e0.type === 'tag' && e1.type === 'tag' &&
                    ((_a = e0.firstChild) === null || _a === void 0 ? void 0 : _a.type) === 'text' && e1.children[1].type === 'tag' &&
                    e2.type === 'tag') {
                    const href = e1.children[1].attribs['href'];
                    const url = new URL(href, baseUrl).toString();
                    ret.push({
                        date: (e0.firstChild.data || '').trim(),
                        name: (((_b = e1.children[1].firstChild) === null || _b === void 0 ? void 0 : _b.data) || '').trim(),
                        href: url,
                        description: (((_c = e2.firstChild) === null || _c === void 0 ? void 0 : _c.data) || '').trim(),
                        isCran: true
                    });
                }
            }
        });
    });
    const retSorted = ret.sort((a, b) => a.name.localeCompare(b.name));
    return retSorted;
}
//# sourceMappingURL=cran.js.map