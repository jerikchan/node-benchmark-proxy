'use strict';

const logger = console;
const { RpcClient } = require('@jsnetkit/rpc').client;
const { FaiBuffer } = require('@jsnetkit/buffer');
const http = require('http');
const net = require('net');

require('events').defaultMaxListeners = Infinity;

// server info
const SERVER_HOST = process.env.SERVER_HOST || 'dep0.faisvr.cc';
const SERVER_PORT = process.env.SERVER_PORT || 12201;

const buf_cache = {};

// hello接口 求框架性能
async function invokeHello(name) {
  const client = new RpcClient({
    logger,
  });
  const consumer = client.createConsumer({
    interfaceName: 'com.nodejs.test.TestService',
    serverHost: SERVER_HOST + ':' + SERVER_PORT,
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

// 空接口 求极限性能
async function invokeEmpty() {
  const client = net.createConnection({
    port: SERVER_PORT,
    host: SERVER_HOST
  }, () => {
    client.write('helo');
  });

  return new Promise((resolve) => {
    client.on('data', (data) => {
      // console.log(data.toString());
      client.end();
      resolve(data.toString());
    });
  })
}

const server = http.createServer(async (req, res) => {
  const { url } = req;

  // 取url后的第一个路径
  const mt = /^\/(\w+)/.exec(url);
  const name = mt ? mt[1] : '';

  if (name) {
    await invokeHello(name);
    res.end('hello request ok');
  } else {
    await invokeEmpty();
    res.end('empty request ok');
  }
});

server.listen(12200, '0.0.0.0', () => {
  const addressInfo = server.address();
  console.log(`server listen at ${addressInfo.address}:${addressInfo.port}`);
});
