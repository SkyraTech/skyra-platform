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
  const pkgJsonPath = path.join(pkgDir, 'package.json');
  let pkgData = { deps: {}, peers: {}, devDeps: {} };
  
  if (fs.existsSync(pkgJsonPath)) {
    const json = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
    pkgData.name = json.name;
    pkgData.deps = json.dependencies || {};
    pkgData.peers = json.peerDependencies || {};
    pkgData.devDeps = json.devDependencies || {};
  }
  
  let sourceFiles = [];
  const srcDir = path.join(pkgDir, 'src');
  if (fs.existsSync(srcDir)) {
    sourceFiles = fs.readdirSync(srcDir);
  }
  
  report[pkg] = { ...pkgData, sourceFiles };
}

fs.writeFileSync('c:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/scratch/auditReport.json', JSON.stringify(report, null, 2));
console.log('Audit generated at scratch/auditReport.json');
