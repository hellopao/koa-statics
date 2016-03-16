"use strict";

import {join, resolve, normalize, extname, basename, sep} from "path";
import * as fs from "fs";
import * as assert from "assert";

import * as Koa from "koa";

interface IStaticOptions {
    index?: string;
    cache?: {
        maxage?: number;
        noCache?: boolean;
    }
}

function stat(path): Promise<fs.Stats> {
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stats) => {
            if (err) reject(err);
            resolve(stats);
        })
    })
}

async function statics(root: string, ctx: any, opts: IStaticOptions) {
    let path = join(root, ctx.path);

    try {
        let stats = await stat(path);
        if (stats.isDirectory()) {
            path = `${path}${sep}${opts.index}`;
            stats = await stat(path);
        }

        ctx.set('Last-Modified', stats.mtime.toUTCString());
        ctx.set('Content-Length', stats.size);

        if (!opts.cache) {
            if (opts.cache.noCache) {
                ctx.set('Cache-Control',"no-cache");
            } else {
                ctx.set('Cache-Control',`max-age=${(opts.cache.maxage / 1000 | 0)}`);
            }
        }
        ctx.type = extname(basename(path));
        ctx.body = fs.createReadStream(path);
    } catch (err) {
        if (~['ENOENT', 'ENAMETOOLONG', 'ENOTDIR'].indexOf(err.code)) return false;
        ctx.throw(err);
        return;
    }

    return true;
}

function serve(root: string, opts?: IStaticOptions) {
    assert(root, 'root directory is required to serve files');

    opts = opts || {};
    root = resolve(root);
    opts.index = opts.index || 'index.html';

    return async function(ctx: any, next: () => any) {
        if (ctx.method === "GET") {
            const exsist = await statics(root, ctx, opts);
            if (exsist) return;
        }
        await next();
    }
}

export default serve;