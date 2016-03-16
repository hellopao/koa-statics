"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const path_1 = require("path");
const fs = require("fs");
const assert = require("assert");
function stat(path) {
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stats) => {
            if (err)
                reject(err);
            resolve(stats);
        });
    });
}
function statics(root, ctx, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        let path = path_1.join(root, ctx.path);
        try {
            let stats = yield stat(path);
            if (stats.isDirectory()) {
                path = `${path}${path_1.sep}${opts.index}`;
                stats = yield stat(path);
            }
            ctx.set('Last-Modified', stats.mtime.toUTCString());
            ctx.set('Content-Length', stats.size);
            if (opts.cache) {
                ctx.set('Cache-Control', `max-age=${(opts.cache.maxage / 1000 | 0)}`);
            }
            else {
                ctx.set('Cache-Control', "no-cache");
            }
            ctx.type = path_1.extname(path_1.basename(path));
            ctx.body = fs.createReadStream(path);
        }
        catch (err) {
            if (~['ENOENT', 'ENAMETOOLONG', 'ENOTDIR'].indexOf(err.code))
                return false;
            ctx.throw(err, 500);
            return;
        }
        return true;
    });
}
module.exports = function serve(root, opts) {
    assert(root, 'root directory is required to serve files');
    opts = opts || {};
    root = path_1.resolve(root);
    opts.index = opts.index || 'index.html';
    return function (ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (ctx.method === "GET") {
                const exsist = yield statics(root, ctx, opts);
                if (exsist)
                    return;
            }
            yield next();
        });
    };
};
//# sourceMappingURL=index.js.map