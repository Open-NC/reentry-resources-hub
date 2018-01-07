/* eslint-disable no-console, spaced-comment, global-require */
const usageAndExit = require('./usage');
const CommandLineArgs = require('../common/CommandLineArgs');
const Logger = require('../logger');
const validTasks = ['create', 'drop', 'import', 'export'];

module.exports = function processAndValidateArgs(argv) {
  const args = new CommandLineArgs(argv);

  if (args.argCount() < 1) usageAndExit();

  const config = {
    task: args.args[0],
    logger: new Logger('dbops', args.getOption('logfile', null)),
  };
  if (validTasks.indexOf(config.task) < 0) usageAndExit();
  return config;
};

