const fs = require('fs');
const path = require('path');

const files = [
  'skyra-tech-time-range-field.ts',
  'skyra-tech-time-field.ts',
  'skyra-tech-date-time-field.ts',
  'skyra-tech-date-range-field.ts',
  'skyra-tech-date-field.ts'
];

for (const file of files) {
  const p = path.join('packages/date-time/src', file);
  let content = fs.readFileSync(p, 'utf8');
  content += '\n}\n';
  fs.writeFileSync(p, content);
}
