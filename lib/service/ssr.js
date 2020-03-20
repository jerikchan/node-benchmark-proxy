const http = require('http');

const getSsrArgs = (moduleId, hostname) => {
  return new Promise((resolve, reject) => {
    const req = http.request(`${hostname}?_logSsrArgs=true`, ({ headers }) => {
      const url = `${hostname}ajax/ssrProxy_h.jsp?cmd=readLogs&flow=${headers['fai-w-flow']}&moduleId=${moduleId}`;
      const req = http.request(url, (res) => {
        let chunk = '';
        res.on('data', (c) => {
          chunk += c;
        });
        res.on('end', async () => {
          const data = JSON.parse(chunk);
          if (!data.success) {
            reject(data);
            return;
          }
          const args = data.msg;
          resolve(args);
        });
      });
      req.end();
    });
    req.end();
  })
};

module.exports = {
  getSsrArgs
};