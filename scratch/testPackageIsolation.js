const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const consumerDir = 'C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/scratch/button-consumer';
if (fs.existsSync(consumerDir)) {
    fs.rmSync(consumerDir, { recursive: true, force: true });
}
fs.mkdirSync(consumerDir, { recursive: true });

execSync('npm init -y', { cwd: consumerDir });
execSync('npm install C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/button/skyra-tech-platform-button-0.1.0.tgz', { cwd: consumerDir });

const testFile = path.join(consumerDir, 'test.js');
fs.writeFileSync(testFile, `
require('@skyra-tech-platform/button');
console.log('Successfully imported button in Node');
`);

execSync('node test.js', { cwd: consumerDir, stdio: 'inherit' });
console.log('Package isolation test passed');
