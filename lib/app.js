'use strict';

require('events').defaultMaxListeners = Infinity;
const Koa = require('koa');
const Router = require('koa-router');
const { invokeHello } = require('./api/hello');
const { invokeEmpty } = require('./api/empty');
const { invokeSsr } = require('./api/ssr');

const app = new Koa();
const router = new Router();

router.get('/', async (ctx) => {
  await invokeEmpty();
  ctx.body = 'ok';
});
router.get('/hello/:name', async (ctx) => {
  await invokeHello(ctx.params.name);
  ctx.body = `Hello ${ctx.params.name}!`;
});
router.get('/ssr/:moduleId', async (ctx) => {
  await invokeSsr(ctx.params.moduleId);
  ctx.body = `render module ${ctx.params.moduleId}!`;
});

app.use(router.routes())
app.use(router.allowedMethods())

module.exports = app;