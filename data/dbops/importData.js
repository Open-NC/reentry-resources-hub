/* eslint-disable no-console */
const fs = require('fs');
const Logger = require('../logger');
const ConnectionManager = require('../db/connection_manager');
const connectionDefinitions = require('./connection_definitions');
const generateUUID = require('../common/generateUUID');

const logger = new Logger('MDA', './mda.log');
const connectionManager = new ConnectionManager(connectionDefinitions, logger);
const maps = {
  jurisdictions: {},
  topics: {},
  categories: {},
};

function jurisdictionQuery(d, table) {
  if (d.length > 0) {
    const dstring = d.reduce((accum, cur, index) => {
      const id = (cur.id.length > 1) ? cur.id : generateUUID();
      const comma = (index > 0) ? ',' : '';
      const pj = cur.parent_jurisdiction ? `'${cur.parent_jurisdiction}'` : 'null';
      return `${accum}${comma} ('${id}', '${cur.tag}', '${cur.display_name}', `
      + `${pj}, '${cur.jurisdiction_type}')`;
    }, '');

    return `insert into ${table} (id, tag, display_name, parent_jurisdiction, jurisdiction_type) VALUES ${dstring} RETURNING *;`;
  }
  return null;
}

function topicQuery(d, table) {
  if (d.length > 0) {
    const dstring = d.reduce((accum, cur, index) => {
      const id = (cur.id.length > 1) ? cur.id : generateUUID();
      const comma = (index > 0) ? ',' : '';
      return `${accum}${comma} ('${id}', '${cur.tag}', '${cur.display_name}')`;
    }, '');

    return `insert into ${table} (id, tag, display_name) VALUES ${dstring} returning *;`;
  }
  return null;
}

function categoryQuery(d, table) {
  if (d.length > 0) {
    const dstring = d.reduce((accum, cur, index) => {
      const id = (cur.id.length > 1) ? cur.id : generateUUID();
      const comma = (index > 0) ? ',' : '';
      return `${accum}${comma} ('${id}', '${cur.tag}', '${cur.display_name}', ${cur.description})`;
    }, '');

    return `insert into ${table} (id, tag, display_name, description) VALUES ${dstring} returning *;`;
  }
  return null;
}

function getTopic(topicTag) {
  return (maps.topics[topicTag]) ? maps.topics[topicTag].id : null;
}

function getJurisdiction(jTag) {
  return (maps.jurisdictions[jTag]) ? maps.jurisdictions[jTag].id : null;
}

function getCategory(cTag) {
  return (maps.categories[cTag]) ? maps.categories[cTag].id : null;
}

let args = null;

function pageQuery(d, table) {
  if (d.length > 0) {
    const dstring = d.reduce((accum, cur, index) => {
      const id = (cur.id.length > 1) ? cur.id : generateUUID();
      const comma = (index > 0) ? ',' : '';
      const topic = (cur.topic.length === 36) ? cur.topic : getTopic(cur.topic);
      const jurisdiction = (cur.jurisdiction.length === 36) ? cur.jurisdiction : getJurisdiction(cur.jurisdiction);
      const content = cur.content.replace(/"/g, '\\"').replace(/'/g, "''");
      const val = `${accum}${comma} ('${id}', '${topic}', '${jurisdiction}', '${content}')`;
      return val;
    }, '');

    return `insert into ${table} (id, topic, jurisdiction, content) VALUES ${dstring} RETURNING *;`;
  }
  return null;
}

function resourceQuery(d, table) {
  const refs = [];
  if (d.length > 0) {
    const dstring = d.reduce((accum, cur, index) => {
      const id = (cur.id.length > 1) ? cur.id : generateUUID();
      const comma = (index > 0) ? ',' : '';
      const topic = (cur.topic.length === 36) ? cur.topic : getTopic(cur.topic);
      const jurisdiction = (cur.jurisdiction.length === 36) ? cur.jurisdiction : getJurisdiction(cur.jurisdiction);
      refs.push({ id: generateUUID(), resource: id, topic, ordinal: cur.ordinal });
      const description = cur.description.replace(/"/g, '\\"').replace(/'/g, "''");
      const val = `${accum}${comma} ('${id}', '${cur.name}', '${description}', '${cur.url}', '${jurisdiction}', ${cur.localized ? 'true' : 'false'})`;
      return val;
    }, '');

    const rstring = refs.reduce((accum, cur, index) => {
      const comma = (index > 0) ? ',' : '';
      const val = `${accum}${comma} ('${cur.id}', '${cur.resource}', '${cur.topic}', ${cur.ordinal})`;
      return val;
    }, '');

    const query1 = `insert into ${table} (id, name, description, url, jurisdiction, localized) VALUES ${dstring} RETURNING *; `;
    const query2 = `insert into resource_references (id, resource, topic, ordinal) VALUES ${rstring} RETURNING *; `;
    return query1 + query2;
  }
  return null;
}

const inserts = {
  jurisdictions: jurisdictionQuery,
  topics: topicQuery,
  categories: categoryQuery,
  pages: pageQuery,
  resources: resourceQuery,
};

async function runSql(targetDir, table, dbName) {
  const files = fs.readdirSync(targetDir);
  args = [];
  if (files.indexOf(`${table}.json`) >= 0 && inserts[table]) {
    console.log(`   Importing table ${table}`);
    const fd = fs.openSync(`${targetDir}/${table}.json`, 'r');
    const d = JSON.parse(fs.readFileSync(fd, { encoding: 'utf8' })).data;
    fs.closeSync(fd);
    const cn = connectionManager.getConnection(dbName);
    if (!cn) throw new Error('No database connection');
    const query = inserts[table](d, table);
    if (query) {
      return cn.query(query)
      .then((result) => {
        if (maps[table]) {
          result.rows.forEach((item) => {
            maps[table][item.tag] = item;
          });
        }
      })
      .catch(err => Promise.reject(`Query error: ${err.message}`));
    }
  }
  return Promise.resolve(null);
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
