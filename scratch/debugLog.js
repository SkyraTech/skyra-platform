const fs = require('fs');
let content = fs.readFileSync('packages/date-time/src/skyra-tech-date-field.ts', 'utf8');
content = content.replace("if (typeof customElements !== 'undefined'", "console.log('EVALUATING DATE FIELD');\nconsole.log('typeof customElements in module:', typeof customElements);\nif (typeof customElements !== 'undefined'");
fs.writeFileSync('packages/date-time/src/skyra-tech-date-field.ts', content);
