/* eslint-disable no-console */
const fs = require('fs');
const commandLine = require('coa-command-line-args');

const usage = function usage() {
  const usageString = `Usage: ${commandLine.stripPath(process.argv[1])} destination_directory`;
  console.log(usageString);
};

const args = commandLine.extractOptions(process.argv.slice(2));
if (args.args.length < 1) {
  usage();
  process.exit(1);
}

const jurisictionsFile = 'jurisdictions.txt';
const resourcesFile = 'resources_local.json';
const destDirectory = args.args[0];

if (fs.existsSync(`${destDirectory}/content`)) {
  console.error('Content directory may not exist - delete first.');
  process.exit(1);
}

if (!fs.existsSync(jurisictionsFile)) {
  console.error(`Jurisdictions file ${jurisictionsFile} not found.`);
  process.exit(1);
}

if (!fs.existsSync(resourcesFile)) {
  console.error(`Localized resources template file ${resourcesFile} not found.`);
  process.exit(1);
}

let fd = fs.openSync(jurisictionsFile, 'r');
const jurisdictions = fs.readFileSync(fd, { encoding: 'utf8' }).split('\n');
fs.closeSync(fd);

fd = fs.openSync(resourcesFile, 'r');
const resourcesTemplate = fs.readFileSync(fd, { encoding: 'utf8' });
fs.closeSync(fd);


function normalizeName(name) {
  return name.toLowerCase().replace(/ /g, '');
}

function createFile(fileName, content) {
  fd = fs.openSync(fileName, 'w');
  fs.writeFileSync(fd, content, { encoding: 'utf8' });
  fs.closeSync(fd);
}

const dirBase = `${destDirectory}/content/`;
fs.mkdirSync(dirBase);

createFile(`${dirBase}/description.txt`, '<p>\n  Sample Text for North Carolina\n</p>\n');
createFile(`${dirBase}/config.json`, '{\n  "name": "North Carolina",\n  "tag": "nc",\n  "common_jurisdiction": "nc"\n}\n');
createFile(`${dirBase}/resources_common.json`, '{\n  "resources": []\n}\n');
createFile(`${dirBase}/resources_local.json`, resourcesTemplate);
createFile(`${dirBase}/resources_highlighted.json`, '{\n  "resources": []\n}\n');

const pages = [
  { tag: 'home', name: 'Home' },
  { tag: 'housing', name: 'Housing' },
  { tag: 'jobs', name: 'Jobs' },
  { tag: 'benefits', name: 'Public Benefits' },
  { tag: 'health', name: 'Health Care' },
  { tag: 'education', name: 'Education' },
  { tag: 'legal', name: 'Legal' },
  { tag: 'support', name: 'Support Programs' },
  { tag: 'other', name: 'Other Resources' },
];

jurisdictions.forEach((name) => {
  const nName = normalizeName(name);
  const jdir = `${dirBase}/${nName}`;
  fs.mkdirSync(jdir);
  createFile(`${jdir}/description.txt`, `<p>\n  Sample Text for ${name} County\n</p>\n`);
  createFile(`${jdir}/config.json`, `{\n  "name": "${name}",\n  "tag": "${nName}",\n  "local_jurisdiction": "${nName}"\n}\n`);
  createFile(`${jdir}/resources_common.json`, '{\n  "resources": []\n}\n');
  createFile(`${jdir}/resources_local.json`, '{\n  "resources": []\n}\n');
  createFile(`${jdir}/resources_highlighted.json`, '{\n  "resources": []\n}\n');

  pages.forEach((page) => {
    const pdir = `${jdir}/${page.tag}`;
    fs.mkdirSync(pdir);
    createFile(`${pdir}/description.txt`, `<p>\n  ${page.name}: Sample Text\n</p>\n`);
    createFile(`${pdir}/config.json`, `{\n  "name": "${page.name}",\n  "tag": "${page.tag}"\n}\n`);
    createFile(`${pdir}/resources_local.json`, '{\n  "resources": []\n}\n');
    createFile(`${pdir}/resources_highlighted.json`, '{\n  "resources": []\n}\n');
  });
});



