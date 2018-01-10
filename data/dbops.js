/* eslint-disable no-console, spaced-comment */
require('dotenv').config();
const processAndValidateArgs = require('./dbops/processAndValidateArgs');
const createTables = require('./dbops/createTables');
const dropTables = require('./dbops/dropTables');
const importData = require('./dbops/importData');
const exportData = null;

const tasks = {
  create: createTables,
  drop: dropTables,
  import: importData,
  export: exportData,
};

// Initialize
const args = processAndValidateArgs(process.argv.slice(2));
tasks[args.task](args)
.then((a) => {
  process.exit(0);
})
.catch((err) => {
  console.log(`Error running ${args.task}: ${err}`);
  process.exit(0);
});


