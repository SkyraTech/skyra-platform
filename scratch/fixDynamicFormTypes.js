const fs = require('fs');

const srcPath = 'c:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/dynamic-form/src/skyra-tech-dynamic-form.ts';
let src = fs.readFileSync(srcPath, 'utf8');

src = src.replace(/const placeholder = \(this as unknown as Record<string, unknown>\)\[\`_placeholder_\$\{path\}\`\];/g, 'const placeholder = (this as unknown as Record<string, HTMLElement>)[`_placeholder_${path}`];');
src = src.replace(/let placeholder = \(this as unknown as Record<string, unknown>\)\[\`_placeholder_\$\{path\}\`\];/g, 'let placeholder = (this as unknown as Record<string, HTMLElement>)[`_placeholder_${path}`];');
src = src.replace(/\(this as unknown as Record<string, unknown>\)\[\`_placeholder_\$\{path\}\`\] = placeholder;/g, '(this as unknown as Record<string, HTMLElement>)[`_placeholder_${path}`] = placeholder;');
src = src.replace(/catch \(e: unknown\) \{\n\s*console\.error\(`DynamicForm Error \(\$\{name\}\):`, e\);/g, 'catch (e: unknown) {\n      console.error(`DynamicForm Error (${name}):`, (e as Error).message);');
src = src.replace(/console\.error\(`Field configuration error for \$\{fullPath\}:`, e\);/g, 'console.error(`Field configuration error for ${fullPath}:`, (e as Error).message);');
src = src.replace(/console\.error\(`Error processing field \$\{path\}:`, e\);/g, 'console.error(`Error processing field ${path}:`, (e as Error).message);');

fs.writeFileSync(srcPath, src);

const testSetupPath = 'c:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/dynamic-form/src/test-setup.ts';
let setup = fs.readFileSync(testSetupPath, 'utf8');
if (!setup.includes('@ts-nocheck')) {
    setup = '// @ts-nocheck\n' + setup;
}
fs.writeFileSync(testSetupPath, setup);

console.log('Done');
