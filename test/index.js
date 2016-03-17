"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const ava_1 = require("ava");
const request = require("supertest");
const Koa = require('koa');
const serve = require('..');
ava_1.default('request an exsist file', (t) => __awaiter(this, void 0, void 0, function* () {
    const app = new Koa();
    app.use(serve('../'));
    const result = yield request(app.listen())
        .get('/package.json');
    t.is(result.res.statusCode, 200);
}));
ava_1.default('request a nonexistent file', (t) => __awaiter(this, void 0, void 0, function* () {
    const app = new Koa();
    app.use(serve('../'));
    const result = yield request(app.listen())
        .get('/package.jso');
    t.is(result.res.statusCode, 404);
}));
ava_1.default('matched content-type', (t) => __awaiter(this, void 0, void 0, function* () {
    const app = new Koa();
    app.use(serve('../'));
    const result = yield request(app.listen())
        .get('/package.json');
    t.regex(result.res.headers['content-type'], /^application\/json/);
}));
ava_1.default('request index.html with root path', (t) => __awaiter(this, void 0, void 0, function* () {
    const app = new Koa();
    app.use(serve('../test/fixtures'));
    const result = yield request(app.listen())
        .get('/');
    t.is(result.res.statusCode, 200);
}));
//# sourceMappingURL=index.js.map