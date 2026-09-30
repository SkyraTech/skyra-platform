const fs = require('fs');
let txt = fs.readFileSync('packages/data-export/src/csv.ts', 'utf8');

txt = "import { formatDate } from './formatUtils';\n" + txt;

txt = txt.replace(
  '    nullValue = \'\',\n  } = options;',
  '    nullValue = \'\',\n    dateFormat,\n  } = options;'
);

txt = txt.replace(
  'const formatted = col.formatter ? col.formatter(rawValue, row) : rawValue;',
  'const formatted = col.formatter ? col.formatter(rawValue, row) : formatDate(rawValue, dateFormat);'
);

fs.writeFileSync('packages/data-export/src/csv.ts', txt, 'utf8');
console.log('Done csv');
