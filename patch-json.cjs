const fs = require('fs');
let txt = fs.readFileSync('packages/data-export/src/json.ts', 'utf8');

txt = "import { formatDate } from './formatUtils';\n" + txt;

txt = txt.replace(
  'const { columns: userColumns, pretty = true } = options;',
  'const { columns: userColumns, pretty = true, dateFormat } = options;'
);

txt = txt.replace(
  'const formatted = col.formatter ? col.formatter(rawValue, row) : rawValue;',
  'const formatted = col.formatter ? col.formatter(rawValue, row) : formatDate(rawValue, dateFormat);'
);

fs.writeFileSync('packages/data-export/src/json.ts', txt, 'utf8');
console.log('Done json');
