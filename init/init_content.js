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

if (fs.existsSync(`${destDirectory}/content`)) {
  console.error('Content directory should not exist - delete first.');
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

// Create the main content directory and the pages and jurisdictions subdirectories
const dirBase = `${destDirectory}/content/`;
fs.mkdirSync(dirBase);
createFile(`${dirBase}/config.json`, '{\n  "common_jurisdiction_name": "North Carolina",\n  "common_jurisdiction": "nc"\n}\n');
fs.mkdirSync(`${dirBase}/jurisdictions`);
fs.mkdirSync(`${dirBase}/pages`);

// Create the common pages content
pages.forEach((page) => {
  const pdir = `${dirBase}/pages/${page.tag}`;
  fs.mkdirSync(pdir);
  createFile(`${pdir}/description.html`, `<p>\n  Common ${page.name}: Sample Text\n</p>\n`);
  createFile(`${pdir}/config.json`, `{\n  "page_name": "${page.name}",\n  "page_tag": "${page.tag}"\n}\n`);
  createFile(`${pdir}/resources_local.json`, resourcesTemplate);
  createFile(`${pdir}/resources_highlighted.json`, '{\n  "resources": []\n}\n');
});

// Create the pages for all the counties
jurisdictions.forEach((name) => {
  const nName = normalizeName(name);
  const jdir = `${dirBase}/jurisdictions/${nName}`;
  fs.mkdirSync(jdir);
  createFile(`${jdir}/description.html`, `<p>\n  Sample Text for ${name} County\n</p>\n`);
  createFile(`${jdir}/config.json`, `{\n  "local_jurisdiction_name": "${name}",\n  "local_jurisdiction": "${nName}"\n}\n`);
  createFile(`${jdir}/resources_common.json`, '{\n  "resources": []\n}\n');
  createFile(`${jdir}/resources_local.json`, '{\n  "resources": []\n}\n');
  createFile(`${jdir}/resources_highlighted.json`, '{\n  "resources": []\n}\n');

  pages.forEach((page) => {
    const pdir = `${jdir}/${page.tag}`;
    fs.mkdirSync(pdir);
    createFile(`${pdir}/description.html`, `<p>\n  ${page.name}: Sample Text\n</p>\n`);
    createFile(`${pdir}/config.json`, `{\n  "page_name": "${page.name}",\n  "page_tag": "${page.tag}"\n}\n`);
    createFile(`${pdir}/resources_local.json`, '{\n  "resources": []\n}\n');
    createFile(`${pdir}/resources_highlighted.json`, '{\n  "resources": []\n}\n');
  });
});



