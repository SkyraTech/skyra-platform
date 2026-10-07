const fs = require('fs');

function fixFile(path) {
  if (!fs.existsSync(path)) return;
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(/allowCreate/g, 'allow-create');
  content = content.replace(/selectAll/g, 'select-all');
  content = content.replace(/maxVisibleValues/g, 'max-visible-values');
  content = content.replace(/maxSelections/g, 'max-selections');
  content = content.replace(/dropdownWidth/g, 'dropdown-width');
  content = content.replace(/maxMenuHeight/g, 'max-menu-height');
  fs.writeFileSync(path, content);
}

fixFile('dashboard/src/app/(dashboard)/components/selection/dynamic-select/page.tsx');
fixFile('dashboard/src/app/(dashboard)/ui-components/(details)/pagination/page.tsx');
fixFile('dashboard/src/app/(dashboard)/export/ExportWorkbench.tsx');
console.log('Fixed camelCase attributes for dynamic-select');
