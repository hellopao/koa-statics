"use strict";

import test from "ava";
import * as request from "supertest";
import * as Koa from 'koa';

import serve = require('..');

test('request an exsist file', async (t) => {
    const app = new Koa();
    app.use(serve('../'));

    const result = await request(app.listen())
        .get('/package.json')

    t.is(result.res.statusCode, 200);
});

test('request a nonexistent file', async (t) => {
    const app = new Koa();
    app.use(serve('../'));

    const result = await request(app.listen())
        .get('/package.jso')

    t.is(result.res.statusCode, 404);
});

test('matched content-type', async (t) => {
    const app = new Koa();
    app.use(serve('../'));

    const result = await request(app.listen())
        .get('/package.json')

    t.regex(result.res.headers['content-type'], /^application\/json/);
});

test('request index.html with root path', async (t) => {
    const app = new Koa();
    app.use(serve('../test/fixtures'));

    const result = await request(app.listen())
        .get('/')

    t.is(result.res.statusCode, 200);
});
