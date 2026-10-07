const fs = require('fs');

const filesToUpdate = [
  'packages/qr/src/validation.ts',
  'packages/qr/src/types.ts',
  'packages/qr/src/render/svg.ts',
  'packages/qr/src/generate.ts',
  'dashboard/src/docs-system/metadata.ts',
  'CONTRIBUTING.md'
];

for (const file of filesToUpdate) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/@skyra\/qr/g, '@skyra-tech-platform/qr');
    fs.writeFileSync(file, content);
  }
}
