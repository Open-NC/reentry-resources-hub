const Connection = require('./connection');

class ConnectionManager {
  constructor(config, logger) {
    this.connections = {};
    this.logger = logger;
    Object.getOwnPropertyNames(config).forEach(cname => {
      this.connections[cname] = {
        config: config[cname],
        connection: null,
      };
    });
  }

  getConnection(name) {
    let c = null;
    if (name in this.connections) {
      const connection = this.connections[name];
      c = connection.connection;
      if (!c) {
        c = connection.connection = new Connection(name, connection.config, this.logger);
      }
    } else {
      this.logger.error('unknown-db-connection', `Unknown database connection ${name}`, {});
    }
    return c;
  }
}

module.exports = ConnectionManager;
