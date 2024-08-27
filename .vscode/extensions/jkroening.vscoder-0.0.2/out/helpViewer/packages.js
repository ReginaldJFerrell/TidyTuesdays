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
exports.PackageManager = exports.TopicType = void 0;
const cheerio = __importStar(require("cheerio"));
const vscode = __importStar(require("vscode"));
const util_1 = require("../util");
const cran_1 = require("./cran");
// This file implements a rudimentary 'package manager'
// The exported class PackageManager contains methods to
//  * list installed packages
//  * list help topics from a package
//  * let the user pick a package and/or help topic
//  * remove installed packages
//  * install packages, selected from CRAN using a quickpick
// Types of help topics
var TopicType;
(function (TopicType) {
    // "Home page" of a package, e.g. .../base-package.html
    TopicType[TopicType["HOME"] = 0] = "HOME";
    // An Index file, e.g. list of packages or list of topics in a package
    TopicType[TopicType["INDEX"] = 1] = "INDEX";
    // E.g. DESCRIPTION
    TopicType[TopicType["META"] = 2] = "META";
    // Regular help topic containing help about an R function etc.
    TopicType[TopicType["NORMAL"] = 3] = "NORMAL";
})(TopicType = exports.TopicType || (exports.TopicType = {}));
class PackageManager {
    constructor(args) {
        // names of packages to be highlighted in the package list
        // public favoriteNames: string[] = [];
        this.favoriteNames = new Set();
        this.rHelp = args.rHelp;
        this.state = args.persistentState;
        this.cwd = args.cwd;
        this.pullFavoriteNames();
    }
    // Functions to force a refresh of listed packages
    // Useful e.g. after installing/removing packages
    async refresh() {
        await this.clearCachedFiles();
        this.pullFavoriteNames();
    }
    // Funciton to clear only the cached files regarding an individual package etc.
    async clearCachedFiles(re) {
        let cache;
        if (re) {
            const oldCache = this.state.get('r.helpPanel.cachedIndexFiles', []);
            cache = oldCache.filter(v => !((typeof re === 'string' && v.path === re)
                || (typeof re !== 'string' && re.exec(v.path))));
        }
        else {
            cache = undefined;
        }
        await this.state.update('r.helpPanel.cachedIndexFiles', cache);
    }
    // Function to add/remove packages from favorites
    addFavorite(pkgName) {
        this.pullFavoriteNames();
        this.favoriteNames.add(pkgName);
        this.pushFavoriteNames();
        return [...this.favoriteNames.values()];
    }
    removeFavorite(pkgName) {
        this.pullFavoriteNames();
        this.favoriteNames.delete(pkgName);
        this.pushFavoriteNames();
        return [...this.favoriteNames.values()];
    }
    // return the index file if cached, else undefined
    getCachedIndexFile(path) {
        const cache = this.state.get('r.helpPanel.cachedIndexFiles', []);
        const ind = cache.findIndex(v => v.path === path);
        if (ind < 0) {
            return undefined;
        }
        else {
            return cache[ind].items;
        }
    }
    // Save a new file to the cache (or update existing entry)
    async updateCachedIndexFile(path, items) {
        const cache = this.state.get('r.helpPanel.cachedIndexFiles', []);
        const ind = cache.findIndex(v => v.path === path);
        if (ind < 0) {
            cache.push({
                path: path,
                items: items
            });
        }
        else {
            cache[ind].items = items;
        }
        await this.state.update('r.helpPanel.cachedIndexFiles', cache);
    }
    // Private functions used to sync favoriteNames with global state / workspace state
    // Is used frequently when list of favorites is shared globally to sync between sessions
    pullFavoriteNames() {
        if (this.state) {
            this.favoriteNames = this.state.get('r.helpPanel.favoriteNamesSet') || this.favoriteNames;
        }
    }
    pushFavoriteNames() {
        if (this.state) {
            void this.state.update('r.helpPanel.favoriteNamesSet', this.favoriteNames);
        }
    }
    // let the user pick and install a package from CRAN 
    async pickAndInstallPackages(pickMany = false) {
        const packages = await (0, util_1.doWithProgress)(() => this.getPackages(true));
        if (!(packages === null || packages === void 0 ? void 0 : packages.length)) {
            return false;
        }
        const pkgs = await pickPackages(packages, 'Please selecte a package.', pickMany);
        if (pkgs === null || pkgs === void 0 ? void 0 : pkgs.length) {
            const pkgsConfirmed = await confirmPackages('Are you sure you want to install these packages?', pkgs);
            if (pkgsConfirmed === null || pkgsConfirmed === void 0 ? void 0 : pkgsConfirmed.length) {
                const names = pkgsConfirmed.map(v => v.name);
                return await this.installPackages(names, true);
            }
        }
        return false;
    }
    // remove a specified package. The packagename is selected e.g. in the help tree-view
    async removePackage(pkgName) {
        const rPath = await (0, util_1.getRpath)();
        const args = ['--silent', '--slave', '-e', `remove.packages('${pkgName}')`];
        const cmd = `${rPath} ${args.join(' ')}`;
        const confirmation = 'Yes, remove package!';
        const prompt = `Are you sure you want to remove package ${pkgName}?`;
        if (await (0, util_1.getConfirmation)(prompt, confirmation, cmd)) {
            await (0, util_1.executeAsTask)('Remove Package', rPath, args, true);
            return true;
        }
        else {
            return false;
        }
    }
    // actually install packages
    // confirmation can be skipped (e.g. if the user has confimred before)
    async installPackages(pkgNames, skipConfirmation = false) {
        const rPath = await (0, util_1.getRpath)();
        const cranUrl = await (0, util_1.getCranUrl)('', this.cwd);
        const args = [`--silent`, '--slave', `-e`, `install.packages(c(${pkgNames.map(v => `'${v}'`).join(',')}),repos='${cranUrl}')`];
        const cmd = `${rPath} ${args.join(' ')}`;
        const pluralS = pkgNames.length > 1 ? 's' : '';
        const confirmation = `Yes, install package${pluralS}!`;
        const prompt = `Are you sure you want to install package${pluralS}: ${pkgNames.join(', ')}?`;
        if (skipConfirmation || await (0, util_1.getConfirmation)(prompt, confirmation, cmd)) {
            await (0, util_1.executeAsTask)('Install Package', rPath, args, true);
            return true;
        }
        return false;
    }
    async updatePackages(skipConfirmation = false) {
        const rPath = await (0, util_1.getRpath)();
        const cranUrl = await (0, util_1.getCranUrl)('', this.cwd);
        const args = ['--silent', '--slave', '-e', `update.packages(ask=FALSE,repos='${cranUrl}')`];
        const cmd = `${rPath} ${args.join(' ')}`;
        const confirmation = 'Yes, update all packages!';
        const prompt = 'Are you sure you want to update all installed packages? This might take some time!';
        if (skipConfirmation || await (0, util_1.getConfirmation)(prompt, confirmation, cmd)) {
            await (0, util_1.executeAsTask)('Update Packages', rPath, args, true);
            return true;
        }
        else {
            return false;
        }
    }
    async getPackages(fromCran = false) {
        let packages;
        this.pullFavoriteNames();
        if (fromCran) {
            // Use a placeholder, since multiple different urls are attempted
            const CRAN_PATH_PLACEHOLDER = 'CRAN_PATH_PLACEHOLDER';
            packages = this.getCachedIndexFile(CRAN_PATH_PLACEHOLDER);
            if (!(packages === null || packages === void 0 ? void 0 : packages.length)) {
                const cranUrl = await (0, util_1.getCranUrl)('', this.cwd);
                packages = await (0, cran_1.getPackagesFromCran)(cranUrl);
                await this.updateCachedIndexFile(CRAN_PATH_PLACEHOLDER, packages);
            }
        }
        else {
            packages = await this.getParsedIndexFile(`/doc/html/packages.html`);
            if (!(packages === null || packages === void 0 ? void 0 : packages.length)) {
                void vscode.window.showErrorMessage('Help provider not available!');
            }
        }
        if (packages) {
            for (const pkg of packages) {
                pkg.isFavorite = this.favoriteNames.has(pkg.name);
                pkg.helpPath = (pkg.name === 'doc' ?
                    '/doc/html/packages.html' :
                    `/library/${pkg.name}/html/00Index.html`);
            }
        }
        return packages;
    }
    // parses a package's index file to produce a list of help topics
    // highlights ths 'home' topic and adds entries for the package index and DESCRIPTION file
    async getTopics(pkgName, summarize = false, skipMeta = false) {
        const indexEntries = await this.getParsedIndexFile(`/library/${pkgName}/html/00Index.html`);
        if (!indexEntries) {
            return undefined;
        }
        const topics = indexEntries.map(v => {
            const topic = {
                pkgName: pkgName,
                name: v.name,
                description: v.description,
                href: v.href || v.name,
                type: TopicType.NORMAL,
                helpPath: '' // replaced below
            };
            topic.type = (topic.name === `${topic.pkgName}-package` ? TopicType.HOME : TopicType.NORMAL);
            topic.helpPath = (topic.pkgName === 'doc' ?
                `/doc/html/${topic.href}` :
                `/library/${topic.pkgName}/html/${topic.href}`);
            return topic;
        });
        if (!skipMeta) {
            const ind = topics.findIndex(v => v.type === TopicType.HOME);
            let homeTopic = undefined;
            if (ind >= 0) {
                homeTopic = topics.splice(ind, 1)[0];
            }
            const indexTopic = {
                pkgName: pkgName,
                name: 'Index',
                description: '',
                href: '00Index.html',
                helpPath: `/library/${pkgName}/html/00Index.html`,
                type: TopicType.INDEX
            };
            const descriptionTopic = {
                pkgName: pkgName,
                name: 'DESCRIPTION',
                description: '',
                href: '../DESCRIPTION',
                helpPath: `/library/${pkgName}/DESCRIPTION`,
                type: TopicType.META
            };
            topics.unshift(indexTopic, descriptionTopic);
            if (homeTopic) {
                topics.unshift(homeTopic);
            }
        }
        const ret = (summarize ? summarizeTopics(topics) : topics);
        ret.sort((a, b) => {
            if (a.type === b.type) {
                return a.name.localeCompare(b.name);
            }
            else {
                return a.type - b.type;
            }
        });
        return ret;
    }
    // retrieve and parse an index file
    // (either list of all packages, or documentation entries of a package)
    async getParsedIndexFile(path) {
        let indexItems = this.getCachedIndexFile(path);
        // only read and parse file if not cached yet
        if (!indexItems) {
            const helpFile = await this.rHelp.getHelpFileForPath(path, false);
            if (!(helpFile === null || helpFile === void 0 ? void 0 : helpFile.html)) {
                // set missing files to null
                indexItems = undefined;
            }
            else {
                // parse and cache file
                indexItems = parseIndexFile(helpFile.html);
            }
            void this.updateCachedIndexFile(path, indexItems);
        }
        // return cache entry. make new array to avoid messing with the cache
        let ret = undefined;
        if (indexItems) {
            ret = [];
            ret.push(...indexItems);
        }
        return ret;
    }
}
exports.PackageManager = PackageManager;
function parseIndexFile(html) {
    const $ = cheerio.load(html);
    const tables = $('table');
    const ret = [];
    // loop over all tables on document and each row as one index entry
    // assumes that the provided html is from a valid index file
    tables.each((tableIndex, table) => {
        const rows = $('tr', table);
        rows.each((rowIndex, row) => {
            var _a, _b, _c, _d;
            const elements = $('td', row);
            if (elements.length === 2) {
                const e0 = elements[0];
                const e1 = elements[1];
                if (e0.type === 'tag' && e1.type === 'tag' &&
                    ((_a = e0.firstChild) === null || _a === void 0 ? void 0 : _a.type) === 'tag') {
                    const href = e0.firstChild.attribs['href'];
                    const name = ((_c = (_b = e0.firstChild) === null || _b === void 0 ? void 0 : _b.firstChild) === null || _c === void 0 ? void 0 : _c.data) || '';
                    const description = ((_d = e1.firstChild) === null || _d === void 0 ? void 0 : _d.data) || '';
                    ret.push({
                        name: name,
                        description: description,
                        href: href,
                    });
                }
            }
        });
    });
    const retSorted = ret.sort((a, b) => a.name.localeCompare(b.name));
    return retSorted;
}
// Used to let the user confirm their choice when installing/removing packages
async function confirmPackages(placeHolder, packages) {
    const qpItems = packages.map(pkg => ({
        label: pkg.name,
        detail: pkg.description,
        package: pkg,
        picked: true
    }));
    const qpOptions = {
        matchOnDescription: true,
        matchOnDetail: true,
        placeHolder: placeHolder
    };
    const qp = await vscode.window.showQuickPick(qpItems, { ...qpOptions, canPickMany: true });
    const ret = (qp === null || qp === void 0 ? void 0 : qp.map(v => v.package)) || [];
    return ret;
}
// Let the user pick a package, either from local installation or CRAN
async function pickPackages(packages, placeHolder, pickMany = false) {
    if (!(packages === null || packages === void 0 ? void 0 : packages.length)) {
        return undefined;
    }
    const qpItems = packages.map(pkg => ({
        label: pkg.name,
        detail: pkg.description,
        package: pkg
    }));
    const qpOptions = {
        matchOnDescription: true,
        matchOnDetail: true,
        placeHolder: placeHolder
    };
    let ret;
    if (pickMany) {
        const qp = await vscode.window.showQuickPick(qpItems, { ...qpOptions, canPickMany: true });
        ret = qp === null || qp === void 0 ? void 0 : qp.map(v => v.package);
    }
    else {
        const qp = await vscode.window.showQuickPick(qpItems, qpOptions);
        ret = (qp ? [qp.package] : undefined);
    }
    return ret;
}
// Used to summarize index-entries that point to the same help file
function summarizeTopics(topics) {
    const topicMap = new Map();
    for (const topic of topics) {
        if (topicMap.has(topic.helpPath)) {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
            const newTopic = topicMap.get(topic.helpPath); // checked above that key is present
            if (newTopic.aliases) {
                newTopic.aliases.push(topic.name);
            }
            // newTopic.topicType ||= topic.topicType;
            newTopic.type = (newTopic.type === TopicType.NORMAL ? topic.type : newTopic.type);
        }
        else {
            const newTopic = {
                ...topic,
                isGrouped: true
            };
            if (newTopic.type === TopicType.NORMAL && newTopic.description) {
                newTopic.aliases = [newTopic.name];
                [newTopic.name, newTopic.description] = [newTopic.description, newTopic.name];
            }
            topicMap.set(newTopic.helpPath, newTopic);
        }
    }
    const newTopics = [...topicMap.values()];
    return newTopics;
}
//# sourceMappingURL=packages.js.map