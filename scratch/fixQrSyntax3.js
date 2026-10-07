const fs = require('fs');
let content = fs.readFileSync('dashboard/src/app/(dashboard)/qr-code/page.tsx', 'utf8');
content = content.replace(
  /&gt;<\/span>&lt;\/<span style=\{\{ color: '#FDE047' \}\}>skyra-qr-code<\/span>&gt;/g,
  `{'>'}</span>{'<'}{'/'}<span style={{ color: '#FDE047' }}>skyra-qr-code</span>{'>'}`
);
fs.writeFileSync('dashboard/src/app/(dashboard)/qr-code/page.tsx', content);
