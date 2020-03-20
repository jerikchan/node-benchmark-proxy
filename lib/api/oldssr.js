const { getSsrArgs } = require('../service/ssr');

async function invokeOldssr(moduleId, hostname, templateUrl) {
  const args = await getSsrArgs(moduleId, hostname);
  args.templateUrl = templateUrl;
}

module.exports = {
  invokeOldssr
};