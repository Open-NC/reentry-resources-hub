/* eslint-disable no-console */
const { stripPath } = require('../common/utilities');

module.exports = function usageAndExit() {
  const usageString = '\nSet up database, import/export reentry data.\n\n'
                    + `Usage:\t${stripPath(process.argv[1])} [create | drop | import | export]`
                    + '\n\t\t[--parallelLoad=load_points]\n\n'
                    + 'NOTE: create command will destroy any existing data in tables.';
  console.log(usageString);
  process.exit(1);
};
