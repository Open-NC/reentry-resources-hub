const sql = require('msSql');
require('msnodesqlv8');

function connection(ci) {
  let c = null;
  const config = {
    driver: 'msnodesqlv8',
    server: ci.host,
    port: ci.port,
    database: ci.database,
    options: {
      trustedConnection: (ci.authMethod === 'ad'),
    },
  };
  if (ci.authMethod === 'ad') {
    c = new sql.Connection(config);
  } else {
    throw new Error(`${ci.authMethod} authMethod not supported`);
  }
  return c;
}

module.exports = connection;
