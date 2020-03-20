'use strict';

require('events').defaultMaxListeners = Infinity;
const Koa = require('koa');
const Router = require('koa-router');
const { invokeHello } = require('./api/hello');
const { invokeEmpty } = require('./api/empty');
const { invokeSsr } = require('./api/ssr');
const { invokeOldssr } = require('./api.oldssr');

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
  const hostname = 'http://jerik94-6.iii.cc/';
  const templateUrl = 'http://1.ss.aaadns.com/js/dist/module.server.src.js';
  const result = await invokeSsr(ctx.params.moduleId, hostname, templateUrl);
  ctx.body = result;
});
router.get('/oldssr/:moduleId', async (ctx) => {
  const hostname = 'http://jerik94-6.iii.cc/';
  const templateUrl = 'http://1.ss.aaadns.com/js/dist/module.server.src.js';
  const result = await invokeOldssr(ctx.params.moduleId, hostname, templateUrl);
  ctx.body = result;
});

app.use(router.routes())
app.use(router.allowedMethods())

module.exports = app;