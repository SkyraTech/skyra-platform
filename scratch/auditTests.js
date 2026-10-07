const fs = require('fs');
const path = require('path');
const packagesDir = 'c:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages';

const remaining = [
  'button', 'checkbox', 'date-time', 'dynamic-select',
  'input', 'notification', 'pdf-viewer', 'qr',
  'radio', 'switch', 'textarea', 'toast'
];

let report = {};

for (const pkg of remaining) {
  const pkgDir = path.join(packagesDir, pkg);
  const srcDir = path.join(pkgDir, 'src');
  let testCount = 0;
  
  if (fs.existsSync(srcDir)) {
    const files = fs.readdirSync(srcDir);
    for (const f of files) {
      if (f.includes('.test.')) {
         const content = fs.readFileSync(path.join(srcDir, f), 'utf8');
         const tests = content.match(/it\(|test\(/g);
         if (tests) testCount += tests.length;
      }
    }
  }
  
  report[pkg] = testCount > 0 ? `${testCount} tests` : 'NONE';
}

console.log(JSON.stringify(report, null, 2));
