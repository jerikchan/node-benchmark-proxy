const logger = console;
const { RpcClient } = require('@jsnetkit/rpc').client;
const { FaiBuffer } = require('@jsnetkit/buffer');

const buf_cache = {};

// hello接口 求框架性能
async function invokeSsr(name) {
  const client = new RpcClient({
    logger,
  });
  const consumer = client.createConsumer({
    interfaceName: 'com.nodejs.test.TestService',
    serverHost: process.env.SERVER_HOST + ':' + 12200,
  });
  await consumer.ready();

  // 减少 buffer 的计算
  if (buf_cache[name]) {
    buf = buf_cache[name];
  } else {
    const obj = { name };
    buf = new FaiBuffer();
    buf.encodeString(JSON.stringify(obj));
  }

  await consumer.invoke(11, [ buf ], { responseTimeout: 3000 });
  client.close();

  return true;
}

module.exports = {
  invokeSsr
};