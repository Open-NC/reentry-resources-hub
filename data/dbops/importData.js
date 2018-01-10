const fs = require('fs');
const Logger = require('../logger');
const ConnectionManager = require('../db/connection_manager');
const connectionDefinitions = require('./connection_definitions');
const generateUUID = require('../common/generateUUID');

const logger = new Logger('MDA', './mda.log');
const connectionManager = new ConnectionManager(connectionDefinitions, logger);

async function runSql(targetDir, table, dbName) {
  const files = fs.readdirSync(targetDir);
  if (files.indexOf(`${table}.json`) >= 0) {
    console.log(`Importing table ${table}`);
    let fd = fs.openSync(`${targetDir}/${table}.json`, 'r');
    const d = JSON.parse(fs.readFileSync(fd, { encoding: 'utf8' })).data;
    fs.closeSync(fd);
    const cn = connectionManager.getConnection(dbName);
    if (!cn) {
      console.log('No database connection');
    }

    const dstring = d.reduce((accum, cur) => {
      const id = (cur.id.length > 1) ? cur.id : generateUUID();
      console.log(`ID ${id} - ${cur.tag}`);
      if (accum.length > 0) {
        return `${accum}, ('${id}', '${cur.tag}', '${cur.display_name}', ${cur.parent_jurisdiction ? "'" + cur.parent_jurisdiction + "'" : 'null'}, '${cur.jurisdiction_type}')`;
      }
      return `('${id}', '${cur.tag}', '${cur.display_name}', ${cur.parent_jurisdiction ? "'" + cur.parent_jurisdiction + "'" : 'null'}, '${cur.jurisdiction_type}')`;
    }, '');
    // const cur = d[0];
    // dstring = `('${cur.id}', '${cur.tag}', '${cur.display_name}', ${cur.parent_jurisdiction ? "'" + cur.parent_jurisdiction + "'" : 'null'}, '${cur.jurisdiction_type}')`;

    console.log(dstring);
    const query = `insert into ${table} (id, tag, display_name, parent_jurisdiction, jurisdiction_type) VALUES ${dstring};`;

    console.log(query);
    return cn.query(query)
    .then(res => {
      console.log('Did the insert');
      return res;
    })
    .catch(err => {
      console.log(`Got an error: ${err}`);
      return Promise.reject(`Query error: ${err.message}`);
    });
  }
  // const cn = connectionManager.getConnection(dbName);
  // if (!cn) {
  //   console.log('No database connection');
  // }
  // const query = `select * from ${table}`;
  // return cn.query(query)
  // .then(res => {
  //   return res;
  // })
  // .catch(err => {
  //   return Promise.reject(`Query error: ${err.message}`);
  // });
}

async function runTaskSequence(tasks, target) {
  let result = null;
  let hasError = false;
  let errMessage = '';

  for (let i = 0; i < tasks.length && !hasError; i += 1) {
    const task = tasks[i];
    try {
      result = await runSql(target, task, 'aws');
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

module.exports = function importData(args) {
  console.log(`Importing data from directory ${args.target}`);
  return runTaskSequence(jobs.tables, args.target)
  .catch((err) => {
    console.log(`Error: ${err}`);
    logger.error(`Error: ${JSON.stringify(err)}`);
  });
};
