const fs = require('fs');
let content = fs.readFileSync('packages/qr/package.json', 'utf8');
content = content.replace(/\s*"lint": "eslint \.",\n/, '\n');
fs.writeFileSync('packages/qr/package.json', content);
