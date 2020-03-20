const logger = console;
const { RpcClient } = require('@jsnetkit/rpc').client;
const { FaiBuffer } = require('@jsnetkit/buffer');

const { getSsrArgs } = require('../service/ssr');

const buf_cache = {};

const client = new RpcClient({
  logger,
});

function getConsumer() {
  const consumer = client.createConsumer({
    interfaceName: 'fai.node.siteSsr',
    serverHost: '0.0.0.0' + ':' + 7002,
  });
  return consumer;
}

let _consumer;

// hello接口 求框架性能
async function invokeSsr(moduleId, hostname, templateUrl, keep = true) {
  let buf;
  if (buf_cache[hostname + '@-@' + moduleId]) {
    buf = buf_cache[hostname + '@-@' + moduleId];
  } else {
    const args = await getSsrArgs(moduleId, hostname);
    args.templateUrl = templateUrl;
    buf = new FaiBuffer();
    buf.putString(1, JSON.stringify(args));
    buf_cache[hostname + '@-@' + moduleId] = buf;
  }

  const consumer = keep ? (_consumer || (_consumer = getConsumer())) : getConsumer();
  await consumer.ready();
  
  const result = await consumer.invoke(11, [ buf ], { responseTimeout: 3000 });

  keep && consumer.close();

  const recvBody = new FaiBuffer(result);
  const htmlRef = {};
  recvBody.getString({}, htmlRef);

  resolve(htmlRef.value);
}

module.exports = {
  invokeSsr
};