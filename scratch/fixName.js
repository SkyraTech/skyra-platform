const fs = require('fs');
const path = require('path');

const files = [
  'skyra-tech-time-range-field.ts',
  'skyra-tech-time-field.ts',
  'skyra-tech-date-range-field.ts',
  'skyra-tech-date-field.ts'
];

for (const file of files) {
  const p = path.join('packages/date-time/src', file);
  let content = fs.readFileSync(p, 'utf8');
  content = content.replace(/get name\(\) \{ return this\.getAttribute\('name'\) \|\| ''; \}/g, 
`get name() { return this.getAttribute('name') || ''; }
  set name(v) { if (v) this.setAttribute('name', v); else this.removeAttribute('name'); }`);
  
  if (!content.includes("'name'")) {
     // add 'name' to observedAttributes
     content = content.replace(/return \['value',/g, "return ['value', 'name',");
  }

  fs.writeFileSync(p, content);
}
