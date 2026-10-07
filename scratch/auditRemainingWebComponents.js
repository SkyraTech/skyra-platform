const fs = require('fs');
const path = require('path');
const packagesDir = 'c:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages';

const remaining = [
  'button', 'checkbox', 'date-time', 'dynamic-select',
  'input', 'notification', 'pdf-viewer', 'qr',
  'radio', 'switch', 'textarea', 'toast'
];

let report = {};

function grep(dir, regex) {
  let matches = [];
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const res = path.join(dir, file.name);
    if (file.isDirectory()) {
      matches.push(...grep(res, regex));
    } else if (file.isFile() && (res.endsWith('.ts') || res.endsWith('.tsx'))) {
      const content = fs.readFileSync(res, 'utf8');
      if (regex.test(content)) {
        matches.push(res);
      }
    }
  }
  return matches;
}

for (const pkg of remaining) {
  const pkgDir = path.join(packagesDir, pkg);
  const isWebComponent = grep(pkgDir, /customElements\.define/).length > 0;
  
  report[pkg] = {
    isWebComponent
  };
}

console.log(JSON.stringify(report, null, 2));
