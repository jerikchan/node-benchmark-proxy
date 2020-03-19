const net = require('net');

// 空接口 求极限性能
async function invokeEmpty() {
  const client = net.createConnection({
    host: process.env.SERVER_HOST,
    port: 12201,
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

module.exports = {
  invokeEmpty
};