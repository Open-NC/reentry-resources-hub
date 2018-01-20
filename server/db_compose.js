const ConnectionManager = require('../data/db/connection_manager');
const connectionDefinitions = require('../data/connection_definitions');
const Logger = require('../data/logger');
const logger = new Logger('reentry', './reentry.log');

const connectionManager = new ConnectionManager(connectionDefinitions, logger);

function getConfiguration(cn, jurisdiction, topic) {
  const query = "SELECT * FROM configurations WHERE name IN ('common_jurisdiction_name', 'common_jurisdiction','base_url');"
    + `SELECT * FROM jurisdictions WHERE tag = '${jurisdiction}';`
    + `SELECT * FROM topics WHERE tag = '${topic}';`;

  return cn.query(query)
  .then((res) => {
    const config = {
      common_jurisdiction_name: null,
      common_jurisdiction: null,
      common_jurisdiction_id: null,
      base_url: null,
      page_name: null,
      page_tag: topic,
      topic_id: null,
      local_jurisdiction_name: null,
      local_jurisdiction: jurisdiction,
      local_jurisdiction_id: null,
    };
    res[0].rows.forEach((item) => {
      config[item.name] = item.value;
    });
    if (res[1].rowCount >= 1) {
      config.local_jurisdiction_name = res[1].rows[0].display_name;
      config.local_jurisdiction_id = res[1].rows[0].id;
      config.common_jurisdiction_id = res[1].rows[0].parent_jurisdiction;
      // Last is a hack. TODO: walk up ancestors until null.
    }
    if (res[2].rowCount >= 1) {
      config.page_name = res[2].rows[0].display_name;
      config.topic_id = res[2].rows[0].id;
    }

    return Promise.resolve({ config });
  })
  .catch(err => Promise.reject(`Query error: ${err.message}`));
}

function getPageContent(cn, data, jurisdictions, topic) {
  const jvalue = jurisdictions.reduce((accum, cur, idx) => {
    return `${accum}${idx > 0 ? ', ' : ''}${cur}`;
  }, '');

  const query = `SELECT * FROM pages WHERE jurisdiction = ANY('{${jvalue}}') AND topic = '${topic}';`;
  return cn.query(query, jurisdictions)
  .then((res) => {
    let lContent = '';
    let cContent = '';
    res.rows.forEach((row) => {
      if (row.jurisdiction === data.config.local_jurisdiction_id) {
        lContent = row.content;
      } else {
        cContent = row.content;
      }
    });

    return Promise.resolve(Object.assign({}, data, {
      common: { description: cContent },
      jurisdiction: { description: lContent },
    }));
  })
  .catch(err => Promise.reject(`Query error: ${err.message}`));
}

function getResources(cn, data, jurisdictions, topic) {
  const jvalue = jurisdictions.reduce((accum, cur, idx) => {
    return `${accum}${idx > 0 ? ', ' : ''}${cur}`;
  }, '');

  const query = 'SELECT rr.topic, rr.ordinal, rr.id AS ref_id, r.id AS resource_id, '
  + 'r.name, r.description, r.url, r.jurisdiction, r.localized, r.category '
  + 'FROM resource_references AS rr LEFT JOIN resources AS r '
  + 'ON rr.resource = r.id '
  + `WHERE r.jurisdiction = ANY('{${jvalue}}') AND rr.topic = '${topic}' ORDER BY rr.ordinal;`;
  const ndata = Object.assign({}, data);
  ndata.common.resources = [];
  ndata.common.local = { resources: [] };
  ndata.jurisdiction.resources = [];
  return cn.query(query, jurisdictions)
  .then((res) => {
    res.rows.forEach((row) => {
      if (row.jurisdiction === data.config.local_jurisdiction_id) {
        ndata.jurisdiction.resources.push(row);
      } else if (row.localized) {
        ndata.common.local.resources.push(row);
      } else {
        ndata.common.resources.push(row);
      }
    });
    return Promise.resolve(ndata);
  })
  .catch(err => Promise.reject(`Query error: ${err.message}`));
}

function compose(jurisdiction, topic, contentDir, callback) {
  // I'm doing a cheap shortcut to avoid SQL injection attack
  // by just removing all non-alphanumeric characters - I want to
  // do a single DB call with 3 statements in getConfiguration and
  // parameterizing multiple statements is not allowed).
  // Possible future TODO: write a single DB function to gather all.
  const tJurisdiction = jurisdiction.toLowerCase().replace(/\W/g, '');
  const tTopic = topic.toLowerCase().replace(/\W/g, '');

  const cn = connectionManager.getConnection('aws');
  if (!cn) throw new Error('No database connection');

  return getConfiguration(cn, tJurisdiction, tTopic)
  .then((data) => {
    const jurisdictions = [data.config.common_jurisdiction_id, data.config.local_jurisdiction_id];
    return getPageContent(cn, data, jurisdictions, data.config.topic_id);
  })
  .then((data) => {
    // Now get resources
    const jurisdictions = [data.config.common_jurisdiction_id, data.config.local_jurisdiction_id];
    return getResources(cn, data, jurisdictions, data.config.topic_id);
  })
  .then((config) => {
    callback(config);
  });
}

module.exports = { compose };

