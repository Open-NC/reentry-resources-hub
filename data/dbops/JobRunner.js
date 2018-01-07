/* eslint-disable no-console */
const fs = require('fs');
const fork = require('child_process').fork;
const { getJobPoints, recursivelyDeletePath, countPoints } = require('./utilities');

class JobRunner {
  constructor(workDir, jobFileName, logger) {
    this.logger = logger;
    this.workDir = workDir;
    this.jobFileName = jobFileName;
    this.jTracker = {};
    this.runningFiles = fs.readdirSync(`${this.workDir}/jobs`);
  }

  initializeRun() {
    this.loadJobTracker(this.workDir, this.jobFileName, this.logger);
  }

  harvestRunningJobs() {
    this.jTracker.running = this.jTracker.running.filter(job => {
      // Check the status of running job
      if (this.runningFiles.indexOf(job.name) < 0) {
        // Something is seriously wrong.
        this.logger.error({ job }, `Unable to find job file for running job ${job.name}`);
        process.exit(1);
      }
      const fd = fs.openSync(`${this.workDir}/jobs/${job.name}/status.json`, 'r');
      const jobStatus = JSON.parse(fs.readFileSync(fd, { encoding: 'utf8' }));
      fs.closeSync(fd);
      if (jobStatus.status === 'Done') {
        console.log(`Job ${job.name} is done!`);
        this.jTracker.jobStatus[job.name] = 'Done';
        job.job.depends.forEach(depName => {
          this.jTracker.refCount[depName] -= 1;
        });
        this.jTracker.completed.push(job);
        return null;
      }
      return job;
    });
    this.saveState();
  }

  saveState() {
    const fd = fs.openSync(`${this.workDir}/jobs_status.json`, 'w');
    fs.writeFileSync(fd, JSON.stringify(this.jTracker), { encoding: 'utf8' });
    fs.closeSync(fd);
  }

  loadJobTracker(workDir, jobFileName, logger) {
    this.jTracker = {
      startDate: new Date(),
      currentDate: new Date(),
      refCount: {},
      jobStatus: {},
      sequencedToDo: [],
      freeToDo: [],
      running: [],
      completed: [],
    };
    const files = fs.readdirSync(workDir);

    if (files.indexOf('jobs_status.json') < 0) {
      logger.error(`Unable to find jobs_status.json in jobs directory ${workDir}`);
      process.exit(1);
    }
    const fd = fs.openSync(`${workDir}/jobs_status.json`, 'r');
    this.jTracker = JSON.parse(fs.readFileSync(fd, { encoding: 'utf8' }));
    fs.closeSync(fd);
  }

  static initializeJobTracker(workDir, jobFileName, logger) {
    const jobTracker = {
      startDate: new Date(),
      currentDate: new Date(),
      refCount: {},
      jobStatus: {},
      sequencedToDo: [],
      freeToDo: [],
      running: [],
      completed: [],
    };
    const files = fs.readdirSync(workDir);

    if (files.indexOf(jobFileName) < 0) {
      logger.error(`Unable to find job file ${jobFileName} in jobs directory ${workDir}`);
      process.exit(1);
    }

    let fd = fs.openSync(`${workDir}/${jobFileName}`, 'r');
    const jobsDef = JSON.parse(fs.readFileSync(fd, { encoding: 'utf8' }));
    fs.closeSync(fd);

    // Let's just set up the dependencies by job name
    jobsDef.sequencedJobs.forEach(job => {
      if (!(job.name in jobTracker.jobStatus)) {
        if (!(job.name in jobTracker.refCount)) jobTracker.refCount[job.name] = 0;
        jobTracker.jobStatus[job.name] = 'Not Started';
        jobTracker.sequencedToDo.push(job);
        job.job.depends.forEach(dName => {
          if (!(dName in jobTracker.refCount)) jobTracker.refCount[dName] = 0;
          jobTracker.refCount[dName] += 1;
        });
      }
    });
    jobsDef.freeJobs.forEach(job => {
      if (!(job.name in jobTracker.jobStatus)) {
        jobTracker.jobStatus[job.name] = 'Not Started';
        jobTracker.freeToDo.push(job);
      }
    });
    fd = fs.openSync(`${workDir}/jobs_status.json`, 'w');
    fs.writeFileSync(fd, JSON.stringify(jobTracker), { encoding: 'utf8' });
    fs.closeSync(fd);

    if (files.indexOf('jobs') < 0) {
      fs.mkdirSync(`${workDir}/jobs`);
    } else {
      // TODO: We should delete all job files in the directory.
    }
  }

  fillJobQueue(loadPoints) {
    // If there are open slots, start new jobs and add to running
    let freeLoad = loadPoints - this.jTracker.running.reduce(countPoints, 0);
    console.log(`Free load is ${freeLoad}.`);
    let jobsTodo = ((freeLoad > 0) && (this.jTracker.sequencedToDo.length > 0 || this.jTracker.freeToDo.length > 0));
    while (jobsTodo) {
      let job;
      let haveSequencedJobs = this.jTracker.sequencedToDo.length > 0;
      // We prefer to run jobs that others may depend on
      if (haveSequencedJobs) {
        job = this.getNextSequencedJob(freeLoad);
        if (job) {
          console.log(`Got the next sequenced job: ${job.name}.`);
          if (job.job.type === null) { // just a sequencing dependency
            this.jTracker.jobStatus[job.name] = 'Done';
          } else { // Start the job
            this.startJob(job);
            this.saveState();
            freeLoad -= getJobPoints(job);
          }
        } else {
          haveSequencedJobs = false;
          console.log('No more sequenced jobs to do.');
        }
      }
      if (!haveSequencedJobs) { // Can't run any more sequenced, get some free ones.
        const toRun = [];
        const holdJobs = [];
        for (let i = 0; freeLoad > 0 && i < this.jTracker.freeToDo.length; i += 1) {
          const fjob = this.jTracker.freeToDo[i];
          if (getJobPoints(fjob) <= freeLoad) {
            toRun.push(fjob);
            freeLoad -= getJobPoints(fjob);
          } else {
            holdJobs.push(fjob);
          }
        }
        console.log(`Running ${toRun.length} free jobs!`);
        this.jTracker.freeToDo = holdJobs;
        while (toRun.length > 0) {
          job = toRun.shift();
          this.startJob(job);
        }
        jobsTodo = false;
        this.saveState();
      }
    }
  }

  // Sequencing-only dependencies are special. We wait
  // until all jobs depending on it are done.
  seqDepends(accum, currentDepend) {
    let ok = this.jTracker.jobStatus[currentDepend] === 'Done';
    if (currentDepend in this.jTracker.refCount) {
      if (this.jTracker.refCount[currentDepend] > 1) { // 1 because tester is one.
        ok = false;
      }
    }
    return ok && accum;
  }

  regDepends(accum, currentDepend) {
    return (this.jTracker.jobStatus[currentDepend] === 'Done') && accum;
  }

  getNextSequencedJob(maxPts) {
    let jobToRun = null;
    if (this.jTracker.sequencedToDo.length > 0) {
      const job = this.jTracker.sequencedToDo[0];
      const jpoints = getJobPoints(job);
      if (jpoints <= maxPts) {
        if (job.job.type == null) { // Sequencing job
          // Only kick off when depends are both done and have refcount = 1 (me)
          if (job.job.depends.reduce(this.seqDepends.bind(this), true)) {
            jobToRun = this.jTracker.sequencedToDo.shift();
          }
        } else if (job.job.depends.reduce(this.regDepends.bind(this), true)) {
          jobToRun = this.jTracker.sequencedToDo.shift();
        }
      }
    }
    return jobToRun;
  }

  startJob(job) {
    const jobDir = `${this.workDir}/jobs/${job.name}`;
    console.log(`Starting the job: ${job.name}`);
    if (this.runningFiles.indexOf(job.name) >= 0) {
      console.log(`Delete directory ${this.workDir}/jobs/${job.name}`);
      recursivelyDeletePath(`${this.workDir}/jobs/${job.name}`);
    }
    fs.mkdirSync(jobDir);
    const fd = fs.openSync(`${jobDir}/status.json`, 'w');
    fs.writeFileSync(fd, JSON.stringify({ name: job.name, path: job.path, job: job.job, status: 'Pending' }));
    fs.closeSync(fd);

    // Now fork a script that will run that job and write out the result at the end.
    const path = require.resolve('./run_job.js');
    const out = fs.openSync(`${this.workDir}/jobs/${job.name}/out.log`, 'a');
    const err = fs.openSync(`${this.workDir}/jobs/${job.name}/err.log`, 'a');
    const options = { detached: true, shell: false, stdio: ['ignore', out, err, 'ipc'] };

    const run = fork(path, [jobDir], options);

    run.unref();
    this.jTracker.running.push(job);
    this.jTracker.jobStatus[job.name] = 'Started';
  }
}

module.exports = JobRunner;
