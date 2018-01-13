/* eslint-disable no-console */
const Logger = require('../logger');
const ConnectionManager = require('../db/connection_manager');
const connectionDefinitions = require('./connection_definitions');

const logger = new Logger('MDA', './dbops.log');

const connectionManager = new ConnectionManager(connectionDefinitions, logger);

async function runSql(table, dbName) {
  console.log(` Dropping table ${table}`);
  const cn = connectionManager.getConnection(dbName);
  if (!cn) {
    console.log('No database connection');
  }
  const query = `drop table if exists ${table}`;
  return cn.query(query)
  .then(res => {
    return res;
  })
  .catch(err => {
    return Promise.reject(`Query error: ${err.message}`);
  });
}

async function runTaskSequence(tasks) {
  let result = null;
  let hasError = false;
  let errMessage = '';

  for (let i = 0; i < tasks.length && !hasError; i += 1) {
    const task = tasks[i];
    try {
      result = await runSql(task, 'aws');
    } catch (err) {
      hasError = true;
      errMessage = err;
      logger.error(`Error dropping ${task}: ${err}`);
    }
  }
  if (hasError) {
    console.log('We have an error!');

    return Promise.reject(`Error running the job. ${errMessage}`);
  }
  return Promise.resolve('Done');
}

const jobs = require('./sql/tables');

module.exports = function dropTables(args) {
  return runTaskSequence(jobs.tables)
  .catch((err) => {
    console.log(`Error: ${err}`);
    logger.error(`Error: ${JSON.stringify(err)}`);
  });
};
