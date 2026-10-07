const fs = require('fs');
let content = fs.readFileSync('dashboard/src/app/(dashboard)/qr-code/page.tsx', 'utf8');
content = content.replace(
  /><\/span>\{'<\/'\}<span style=\{\{ color: '#FDE047' \}\}>skyra-qr-code<\/span>\{'>'\}/g,
  `{'>'}</span>{'</'}<span style={{ color: '#FDE047' }}>skyra-qr-code</span>{'>'}`
);
fs.writeFileSync('dashboard/src/app/(dashboard)/qr-code/page.tsx', content);
