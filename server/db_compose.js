const fs = require('fs');
const ConnectionManager = require('../data/db/connection_manager');
const connectionDefinitions = require('../data/connection_definitions');
const Logger = require('../data/logger');
const logger = new Logger('reentry', './reentry.log');

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


function vInterpolate(input, config) {
  const commonJ = config.common_jurisdiction;
  const localJ = config.local_jurisdiction;
  const baseUrl = config.base_url;
  return input.replace(/{{common_jurisdiction}}/g, commonJ)
  .replace(/{{local_jurisdiction}}/g, localJ)
  .replace(/{{base_url}}/g, baseUrl);
}

function loadConfig(path, inputConfig, callback) {
  try {
    const configArray = JSON.parse(fs.readFileSync(path));
    const config = {};

    configArray.pairs.forEach((item) => {
      config[item.name] = item.value;
    });

    callback(null, Object.assign({}, inputConfig, config));
  } catch (e) {
    callback(e);
  }
}

function loadJsonFile(path, callback) {
  try {
    callback(null, JSON.parse(fs.readFileSync(path)));
  } catch (e) {
    callback(e);
  }
}

function loadCommonTopic(topicName, config, contentDir, callback) {
  const topic = {};
  const file1 = `${contentDir}/topics/${topicName}/description.json`;
  loadJsonFile(file1, (err1, content) => {
    if (err1) callback(err1, null);
    else {
      topic.description = vInterpolate(content.description.join('\n'), config.config);
      const file2 = `${contentDir}/topics/${topicName}/resources_common.json`;
      loadJsonFile(file2, (err2, common) => {
        if (err2) callback(err2, null);
        else {
          topic.resources = common.resources;
          const file3 = `${contentDir}/topics/${topicName}/resources_local.json`;
          loadJsonFile(file3, (err3, local) => {
            if (err3) callback(err3, null);
            else {
              topic.local = local;
              callback(null, topic);
            }
          });
        }
      });
    }
  });
}

function loadJurisdictionTopic(jurisdiction, topicName, config, contentDir, callback) {
  const topic = {};
  const file1 = `${contentDir}/jurisdictions/${jurisdiction}/${topicName}/description.json`;
  if (!fs.existsSync(file1)) {
    topic.description = '';
    const file2 = `${contentDir}/jurisdictions/${jurisdiction}/${topicName}/resources_local.json`;
    if (!fs.existsSync(file2)) {
      topic.resources = [];
      callback(null, topic);
    } else {
      loadJsonFile(file2, (err2, local) => {
        if (err2) callback(err2, null);
        else {
          topic.resources = local.resources;
          callback(null, topic);
        }
      });
    }
  } else {
    loadJsonFile(file1, (err1, content) => {
      if (err1) callback(err1, null);
      else {
        topic.description = vInterpolate(content.description.join('\n'), config.config);
        const file2 = `${contentDir}/jurisdictions/${jurisdiction}/${topicName}/resources_local.json`;
        if (!fs.existsSync(file2)) {
          topic.resources = [];
          callback(null, topic);
        } else {
          loadJsonFile(file2, (err2, local) => {
            if (err2) callback(err2, null);
            else {
              topic.resources = local.resources;
              callback(null, topic);
            }
          });
        }
      }
    });
  }
}

function loadTopic(jurisdiction, topicName, config, contentDir, callback) {
  const topic = {
    config,
    common: {},
    jurisdiction: {},
  };
  loadCommonTopic(topicName, topic, contentDir, (err1, commonTopic) => {
    if (err1) callback(err1, null);
    else {
      topic.common = commonTopic;
      loadJurisdictionTopic(jurisdiction, topicName, topic, contentDir, (err2, jurisdictionTopic) => {
        if (err2) {
          callback(err2, null);
        } else {
          topic.jurisdiction = jurisdictionTopic;
          callback(null, topic);
        }
      });
    }
  });
}

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

    return Promise.resolve(config);
  })
  .catch(err => Promise.reject(`Query error: ${err.message}`));
}


function getPageContent(cn, config, jurisdictions, topic) {
  const jvalue = jurisdictions.reduce((accum, cur, idx) => {
    return `${accum}${idx > 0 ? ', ' : ''}${cur}`;
  }, '');

  const query = `SELECT * FROM pages WHERE jurisdiction = ANY('{${jvalue}}') AND topic = '${topic}';`;
  // console.log(`Now query: ${query}`);
  return cn.query(query, jurisdictions)
  .then((res) => {
    let lContent = '';
    let cContent = '';

    res.rows.forEach((row) => {
      if (row.jurisdiction === config.local_jurisdiction_id) {
        lContent = row.content;
      } else {
        cContent = row.content;
      }
    });

    return Promise.resolve(Object.assign({}, config, {
      common: { description: cContent },
      jurisdiction: { description: lContent },
    }));
  })
  .catch(err => Promise.reject(`Query error: ${err.message}`));
}

function compose(jurisdiction, topic, contentDir, callback) {
  const pageConfiguration = {
    config: null,
    common: null,
    jurisdiction: null,
  };
  // I'm doing a cheap shortcut to avoid SQL injection attack
  // by just removing all non-alphanumeric characters - I want to
  // do a single DB call with 3 statements in getConfiguration and
  // parameterizing multiple statements is not allowed).
  // Possible future TODO: write a single DB function to gather all.
  const tJurisdiction = jurisdiction.toLowerCase().replace(/\W/g, '');
  const tTopic = topic.toLowerCase().replace(/\W/g, '');

  const cn = connectionManager.getConnection('aws');
  if (!cn) {
    console.log('No database connection');
  }

  return getConfiguration(cn, tJurisdiction, tTopic)
  .then((config) => {
    const jurisdictions = [config.common_jurisdiction_id, config.local_jurisdiction_id];
    pageConfiguration.config = config;
    return getPageContent(cn, config, jurisdictions, config.topic_id);
  })
  .then((config) => {
    console.log(JSON.stringify(config));
    // Now get resources
  })
  .then((config) => {
    callback(pageConfiguration);
  });
}

function mainCompose(contentDir, callback) {
  const commonConfigFile = `${contentDir}/config.json`;
  const mainConfigFile = `${contentDir}/topics/main/config.json`; // main configuration
  const mainDescFile = `${contentDir}/topics/main/description.json`;
  const main = {
    config: {},
    common: {},
  };
  loadConfig(commonConfigFile, {}, (lc1Err, commonConfigRes) => {
    if (lc1Err) callback(lc1Err, null);
    else {
      loadConfig(mainConfigFile, commonConfigRes, (lc2Err, mainConfigRes) => {
        if (lc2Err) callback(lc2Err, null);
        else {
          main.config = mainConfigRes;
          loadJsonFile(mainDescFile, (lc3Err, mainDescRes) => {
            if (lc3Err) callback(lc3Err, null);
            else {
              main.common = mainDescRes;
              callback(main);
            }
          });
        }
      });
    }
  });
}

module.exports = { compose, mainCompose };

