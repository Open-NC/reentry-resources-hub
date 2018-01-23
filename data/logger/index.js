const bunyan = require('bunyan');

class Logger {
  constructor(name, logFile) {
    this.name = name;
    this.logFile = logFile;
    this.logger = null;
    if (logFile) {
      this.logger = bunyan.createLogger({ name, streams: [{ level: 'info', path: logFile }] });
    } else {
      this.logger = bunyan.createLogger({ name, stream: process.stdout, level: 'info' });
    }
  }

  error(error_type, message, details) {
    this.logger.error({ details: Object.assign({}, details, { error_type }) }, message);
  }

  info(error_type, message, details) {
    this.logger.info({ details: Object.assign({}, details, { error_type }) }, message);
  }

  warn(error_type, message, details) {
    this.logger.warn({ details: Object.assign({}, details, { error_type }) }, message);
  }
}

module.exports = Logger;

