const fs = require('fs');
let content = fs.readFileSync('packages/notification/package.json', 'utf8');
content = content.replace(/\s*"lint": "echo 'lint ok'"(,\n|\n)/g, '\n');
fs.writeFileSync('packages/notification/package.json', content);
