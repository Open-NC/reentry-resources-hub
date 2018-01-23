/* eslint-disable no-console */
const fs = require('fs');
const Logger = require('../logger');
const ConnectionManager = require('../db/connection_manager');
const connectionDefinitions = require('../connection_definitions');

const logger = new Logger('MDA', './dbops.log');

const connectionManager = new ConnectionManager(connectionDefinitions, logger);

async function runSql(filePath, dbName) {
  const fdSql = fs.openSync(filePath, 'r');
  const sql = fs.readFileSync(fdSql, { encoding: 'utf8' });
  const cn = connectionManager.getConnection(dbName);
  if (!cn) {
    console.log('No database connection');
  }
  return cn.query(sql)
  .then((res) => {
    if (res instanceof Array) {
      return res[res.length - 1];
    }
    return res;
  })
  .catch(err => Promise.reject(`Query error: ${err.message}`));
}

async function runTaskSequence(tasks) {
  let result = null;
  let hasError = false;
  let errMessage = '';

  for (let i = 0; i < tasks.length && !hasError; i += 1) {
    const task = tasks[i];
    console.log(`Run task ${task}`);
    const filePath = `${__dirname}/sql/${task}.sql`;
    try {
      result = await runSql(filePath, 'aws');
    } catch (err) {
      hasError = true;
      errMessage = err;
      logger.error(`Error running ${filePath} SQL job: ${err}`);
    }
  }
  if (hasError) {
    console.log('We have an error!');

    return Promise.reject(`Error running the job. ${errMessage}`);
  }
  return Promise.resolve(result.rows);
}

const jobs = require('./sql/tables');

module.exports = function createTables(args) {
  return runTaskSequence(jobs.sql, 'db')
  .then((status) => {
    if (status[0].result !== 'OK') throw new Error(`Bad result creating tables: ${status[0].result}`);
  })
  .catch((err) => {
    console.log(`Error: ${err}`);
    logger.error(`Error: ${JSON.stringify(err)}`);
  });
};
