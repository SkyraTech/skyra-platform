const fs = require('fs');

function fixFile(path) {
  if (!fs.existsSync(path)) return;
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(/autoResize/g, 'auto-resize');
  content = content.replace(/minRows/g, 'min-rows');
  content = content.replace(/maxRows/g, 'max-rows');
  content = content.replace(/showCount/g, 'show-count');
  content = content.replace(/helperText/g, 'helper-text');
  content = content.replace(/defaultValue/g, 'value');
  fs.writeFileSync(path, content);
}

fixFile('dashboard/src/app/(dashboard)/components/basic-controls/textarea/page.tsx');
fixFile('dashboard/src/app/(dashboard)/ui-components/(details)/inputs/page.tsx');
console.log('Fixed camelCase attributes');
