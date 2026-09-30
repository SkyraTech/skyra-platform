const fs = require('fs');
let txt = fs.readFileSync('packages/data-export/src/excel.ts', 'utf8');

txt = "import { formatDate } from './formatUtils';\n" + txt;

txt = txt.replace(
  '    headers = true,\n  } = options;',
  '    headers = true,\n    dateFormat,\n  } = options;'
);

const renderLogic = `
  // Calculate column widths
  const colWidths = new Map<string, number>();
  for (const col of effectiveColumns) {
    colWidths.set(col.key, Math.max(10, col.header.length));
  }

  if (Array.isArray(data)) {
    for (const row of data) {
      for (const col of effectiveColumns) {
        const rawValue = (row as any)[col.key];
        const formatted = col.formatter ? col.formatter(rawValue, row) : formatDate(rawValue, dateFormat);
        const len = String(formatted).length;
        if (len > colWidths.get(col.key)!) {
          colWidths.set(col.key, len);
        }
      }
    }
  }

  let columnsXml = '';
  for (const col of effectiveColumns) {
    // Width approximation: char count * 6.5, capped at 400
    const w = Math.min(400, colWidths.get(col.key)! * 6.5 + 20);
    columnsXml += \`\\n      <Column ss:AutoFitWidth="0" ss:Width="\${w}"/>\`;
  }

  let rowsXml = '';
`;

txt = txt.replace(/let rowsXml = '';/, renderLogic);

txt = txt.replace(
  'const formatted = col.formatter ? col.formatter(rawValue, row) : rawValue;',
  'const formatted = col.formatter ? col.formatter(rawValue, row) : formatDate(rawValue, dateFormat);'
);

txt = txt.replace(
  /<Table>\r?\n\s*\$\{rowsXml\}/,
  '<Table>${columnsXml}\n      ${rowsXml}'
);

fs.writeFileSync('packages/data-export/src/excel.ts', txt, 'utf8');
console.log('Done excel');
