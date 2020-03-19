'use strict';

const app = require('./app');
const cluster = require('cluster');
const numCPUs = process.env.instances || require('os').cpus().length;
const debug = require('debug')('lib/index');

if (cluster.isMaster) {
  debug(`master process ${process.pid} is running.`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  const server = app.listen(7010, '0.0.0.0', () => {
    const { address, port } = server.address();
    console.log(`server start on ${address}:${port}`);
  });
  debug(`work process ${process.pid} is running.`);
}
