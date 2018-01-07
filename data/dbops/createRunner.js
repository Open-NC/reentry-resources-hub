const fs = require('fs');
const JobRunner = require('./run_etl_jobs/JobRunner');

module.exports = function createRunner(args) {

  // Test that we have what we need
  const files = fs.readdirSync(args.workingDirectory);
  if (files.indexOf(args.jobFileName) < 0 || files.indexOf(args.jobFileDate) < 0) {
    args.logger.error(`Unable to find job file ${args.jobFileName} or job date file etl_jobs_date.json in ${args.workingDirectory}`);
    process.exit(1);
  }

  // See if we need to re-initialize
  let init = true;
  if (files.indexOf('jobs_start.json') >= 0) {
    const generatedDate = JSON.parse(fs.readFileSync(`${args.workingDirectory}/etl_jobs_date.json`, { encoding: 'utf8' }));
    const startDate = JSON.parse(fs.readFileSync(`${args.workingDirectory}/jobs_start.json`, { encoding: 'utf8' }));
    if (Number(generatedDate.dateValue) < Number(startDate.dateValue)) init = false;
  }

  if (init) {
    // TODO: After we have status of run, need to generate error if not done.
    JobRunner.initializeJobTracker(args.workingDirectory, args.jobFileName, args.logger);
    const d = Date.now();
    const fd = fs.openSync(`${args.workingDirectory}/jobs_start.json`, 'w');
    fs.writeFileSync(fd, JSON.stringify({ dateValue: d, dateString: new Date(d).toISOString() }));
    fs.closeSync(fd);
  }

  return new JobRunner(args.workingDirectory, args.jobFileName, args.logger);
};
