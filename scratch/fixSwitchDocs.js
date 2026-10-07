const fs = require('fs');
const path = 'dashboard/src/app/(dashboard)/components/basic-controls/switch/page.tsx';
let c = fs.readFileSync(path, 'utf8');

c = c.replace(/<skyra-tech-switch\s+([\s\S]*?)description="([\s\S]*?)"/g, '<skyra-tech-switch $1helper-text="$2"');

fs.writeFileSync(path, c);
