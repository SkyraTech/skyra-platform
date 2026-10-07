const fs = require('fs');
const files = [
  'dashboard/src/components/ui/YearField.tsx',
  'dashboard/src/components/ui/WeekField.tsx',
  'dashboard/src/components/ui/MonthField.tsx',
  'dashboard/src/components/ui/DateTimeRangeField.tsx'
];

for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/handleClear\(e as any\)/g, `handleClear(e)`);
  fs.writeFileSync(f, content);
}
