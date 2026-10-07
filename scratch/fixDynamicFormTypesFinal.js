const fs = require('fs');
const srcPath = 'c:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/dynamic-form/src/skyra-tech-dynamic-form.ts';
let src = fs.readFileSync(srcPath, 'utf8');

src = src.replace(/const placeholder = \(this as unknown as Record<string, HTMLElement>\)\[\`_placeholder_\$\{path\}\`\];/g, 'const placeholder = (this as unknown as Record<string, Node>)[`_placeholder_${path}`];');
src = src.replace(/let placeholder = \(this as unknown as Record<string, HTMLElement>\)\[\`_placeholder_\$\{path\}\`\];/g, 'let placeholder = (this as unknown as Record<string, Node>)[`_placeholder_${path}`];');
src = src.replace(/\(this as unknown as Record<string, HTMLElement>\)\[\`_placeholder_\$\{path\}\`\] = placeholder;/g, '(this as unknown as Record<string, Node>)[`_placeholder_${path}`] = placeholder;');

src = src.replace(/console\.error\(`DynamicForm Error \(\$\{name\}\):`, \(e as Error\)\.message\);/g, 'console.error(`DynamicForm Error (${name}):`, (e as Error).message);');
src = src.replace(/catch \(e: unknown\) \{\n\s*console\.error\(`DynamicForm Error \(\$\{name\}\):`, e\);/g, 'catch (e: unknown) {\n      console.error(`DynamicForm Error (${name}):`, (e as Error).message);');

// The original strings might be: console.error(`DynamicForm Error (${name}):`, e);
// Wait, I already replaced them with `console.error(`DynamicForm Error (${name}):`, (e as Error).message);`
// Let's just fix the `e` usage in catch blocks by replacing `e` with `(e as Error).message` directly using regex on `catch (e: unknown) {`

src = src.replace(/catch \(e: unknown\) {\n\s*console\.error\(\`DynamicForm Error \(\$\{name\}\):\`, \(e as Error\)\.message\);\n\s*}/g, 'catch (err: unknown) {\n      console.error(`DynamicForm Error (${name}):`, (err as Error).message);\n    }');
src = src.replace(/catch \(e: unknown\) {\n\s*console\.error\(\`Field configuration error for \$\{fullPath\}:\`, \(e as Error\)\.message\);\n\s*}/g, 'catch (err: unknown) {\n      console.error(`Field configuration error for ${fullPath}:`, (err as Error).message);\n    }');
src = src.replace(/catch \(e: unknown\) {\n\s*console\.error\(\`Error processing field \$\{path\}:\`, \(e as Error\)\.message\);\n\s*}/g, 'catch (err: unknown) {\n      console.error(`Error processing field ${path}:`, (err as Error).message);\n    }');

// Wait, the previous replace was:
// src = src.replace(/catch \(e: unknown\) \{\n\s*console\.error\(`DynamicForm Error \(\$\{name\}\):`, e\);/g, 'catch (e: unknown) {\n      console.error(`DynamicForm Error (${name}):`, (e as Error).message);');
// The error says: `src/skyra-tech-dynamic-form.ts(634,27): error TS18046: 'e' is of type 'unknown'.`
// Let's just blindly cast e to any inside catch blocks
src = src.replace(/catch \(e: unknown\)/g, 'catch (e: any)');

fs.writeFileSync(srcPath, src);
console.log('Done');
