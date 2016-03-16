# koa-statics
static file server for `koa.js` v2.x, written in `typescript`

## install

```bash
npm install koa-statics
```

## usage

```javascript
const Koa = require("koa");
const statics = require("koa-statics");

const app = new Koa();

app.use(statics("./assets"));

app.listen(3000);
```