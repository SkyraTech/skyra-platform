const fs = require('fs');
let content = fs.readFileSync('packages/date-time/src/skyra-tech-date-range-field.ts', 'utf8');

content = content.replace(/this\.startValue = startIso \|\| '';\s*this\.endValue = endIso \|\| '';\s*this\.dispatchEvent\(new CustomEvent\('skyra-change', \{ detail: \{ value: \{ startDate: startIso, endDate: endIso \} \}, bubbles: true \}\)\);/g,
  `this.value = \`\${startIso || ''},\${endIso || ''}\`;\n        this.dispatchEvent(new CustomEvent('skyra-change', { detail: { value: this.value }, bubbles: true }));`);

content = content.replace(/this\.startValue = '';\s*this\.endValue = '';\s*this\.dispatchEvent\(new CustomEvent\('skyra-change', \{ detail: \{ value: \{ startDate: null, endDate: null \} \}, bubbles: true \}\)\);/g,
  `this.value = ',';\n      this.dispatchEvent(new CustomEvent('skyra-change', { detail: { value: this.value }, bubbles: true }));`);

content = content.replace(/this\.startValue = nextS;\s*this\.endValue = nextE;\s*this\.dispatchEvent\(new CustomEvent\('skyra-change', \{ detail: \{ value: \{ startDate: nextS \|\| null, endDate: nextE \|\| null \} \}, bubbles: true \}\)\);/g,
  `this.value = \`\${nextS || ''},\${nextE || ''}\`;\n      this.dispatchEvent(new CustomEvent('skyra-change', { detail: { value: this.value }, bubbles: true }));`);

fs.writeFileSync('packages/date-time/src/skyra-tech-date-range-field.ts', content);
