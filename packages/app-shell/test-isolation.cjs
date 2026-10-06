const { execSync } = require('child_process');
const fs = require('fs');

console.log(execSync('npm pack').toString());
const tgz = 'skyra-tech-platform-app-shell-0.1.0.tgz';

if (!fs.existsSync('C:/temp')) fs.mkdirSync('C:/temp');
if (!fs.existsSync('C:/temp/skyra-app-shell-test')) fs.mkdirSync('C:/temp/skyra-app-shell-test');

process.chdir('C:/temp/skyra-app-shell-test');
execSync('npm init -y');
console.log(execSync('npm install C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/app-shell/' + tgz).toString());

fs.writeFileSync('test.js', "require('@skyra-tech-platform/app-shell'); console.log('Successfully required App Shell in clean environment');");
console.log(execSync('node test.js').toString());
