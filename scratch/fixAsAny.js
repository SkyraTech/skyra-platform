const fs = require('fs');
const files = [
  'dashboard/src/app/(dashboard)/components/forms/dynamic-form/page.tsx',
  'dashboard/src/app/responsive-sandbox/page.tsx',
  'dashboard/src/examples/dynamic-form/dynamic-form-basic.tsx'
];

for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/\(el as any\)/g, `(el as SkyraTechDynamicFormElement)`);
  content = content.replace(/\(form as any\)/g, `(form as SkyraTechDynamicFormElement)`);
  fs.writeFileSync(f, content);
}
