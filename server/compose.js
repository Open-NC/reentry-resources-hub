const fs = require('fs');

function loadConfig(path, inputConfig, callback) {
  fs.open(path, 'r', (err, fd) => {
    if (err) callback(err, null);
    else {
      fs.readFile(fd, { encoding: 'utf8' }, (err, data) => {
        const config = JSON.parse(data);
        callback(null, Object.assign({}, inputConfig, config));
      });
    }
  });
}

function loadJsonFile(path, callback) {
  fs.open(path, 'r', (err, fd) => {
    if (err) callback(err, null);
    else {
      fs.readFile(fd, { encoding: 'utf8' }, (err, data) => {
        const content = JSON.parse(data);
        callback(null, content);
      });
    }
  });
}


function loadTextFile(path, callback) {
  fs.open(path, 'r', (err, fd) => {
    if (err) callback(err, null);
    else {
      fs.readFile(fd, { encoding: 'utf8' }, (err, data) => {
        callback(null, data);
      });
    }
  });
}

// Load and merge all the configurations
function loadConfigurations(jurisdiction, topic, callback) {
  let file = './content/config.json'; // site configuration
  loadConfig(file, {}, (err, config) => {
    if (err) callback(err, null);
    else {
      file = `./content/pages/${topic}/config.json`; // site topic configuration
      loadConfig(file, config, (err, config) => {
        if (err) callback(err, null);
        else {
          file = `./content/jurisdictions/${jurisdiction}/config.json`; // local configuration
          loadConfig(file,config, (err, config) => {
            if (err) callback(err, null);
            else {
              file = `./content/jurisdictions/${jurisdiction}/${topic}/config.json`; // local topic configuration
              loadConfig(file,config, (err, config) => {
                if (err) callback(err, null);
                else     callback(null, config);
              });
            }
          });
        }
      });
    }
  });
}

function loadCommonTopic(topicName, config, callback) {
  const topic = {};
  let file = `./content/pages/${topicName}/description.txt`;
  loadTextFile(file, (err, description) => {
    if (err) callback(err, null);
    else {
      topic.description = description;
      file = `./content/pages/${topicName}/resources_highlighted.json`;
      loadJsonFile(file, (err, highlighted) => {
        if (err) callback(err, null);
        else {
          topic.highlighted = highlighted;
          file = `./content/pages/${topicName}/resources_local.json`;
          loadJsonFile(file, (err, local) => {
            if (err) callback(err, null);
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

function loadJurisdictionTopic(jurisdiction, topicName, config, callback) {
  const topic = {};
  let file = `./content/jurisdictions/${jurisdiction}/${topicName}/description.txt`;
  loadTextFile(file, (err, description) => {
    if (err) callback(err, null);
    else {
      topic.description = description;
      file = `./content/jurisdictions/${jurisdiction}/${topicName}/resources_highlighted.json`;
      loadJsonFile(file, (err, highlighted) => {
        if (err) callback(err, null);
        else {
          topic.highlighted = highlighted;
          file = `./content/jurisdictions/${jurisdiction}/${topicName}/resources_local.json`;
          loadJsonFile(file, (err, local) => {
            if (err) callback(err, null);
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

function loadTopic(jurisdiction, topicName, config, callback) {
  const topic = {
    config,
    common: {},
    jurisdiction: {},
  };
  loadCommonTopic(topicName, topic, (err, commonTopic) => {
    console.log("Did loadCommon");
    if (err) callback(err, null);
    else {
      topic.common = commonTopic;
      loadJurisdictionTopic(jurisdiction, topicName, topic, (err, jurisdictionTopic) => {
        console.log("Did loadJurisdiction");
        if (err) callback(err, null);
        else {
          topic.jurisdiction = jurisdictionTopic;
          callback(null, topic);
        }
      });
    }
  });
}

function compose (jurisdiction, topic, callback) {
  loadConfigurations(jurisdiction, topic, (err, config) => {
    if (err) callback(err);
    else {
      loadTopic(jurisdiction, topic, config, (err, topic) => {
        if (err) callback(err);
        else     callback(topic);
      });
    }
  });
}

module.exports = compose;