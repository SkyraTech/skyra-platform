const fs = require('fs');
const pkgPath = 'c:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/dynamic-form/package.json';
const typesPath = 'c:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/dynamic-form/src/types.ts';
const testSetupPath = 'c:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/dynamic-form/src/test-setup.ts';
const srcPath = 'c:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/dynamic-form/src/skyra-tech-dynamic-form.ts';
const testPath = 'c:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/dynamic-form/src/skyra-tech-dynamic-form.test.ts';

// 1. package.json
let pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
if (pkg.peerDependencies) {
    delete pkg.peerDependencies['react'];
    delete pkg.peerDependencies['react-dom'];
    delete pkg.peerDependencies['lucide-react'];
}
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

// 2. types.ts
let types = fs.readFileSync(typesPath, 'utf8');
types = types.replace(/render\?: \(props: FieldRenderProps<TValues>\) => any;/g, 'render?: (props: FieldRenderProps<TValues>) => unknown;');
types = types.replace(/formRef\?: any;/g, 'formRef?: HTMLElement | null;');
fs.writeFileSync(typesPath, types);

// 3. src
let src = fs.readFileSync(srcPath, 'utf8');
src = src.replace(/for \(const key of Object\.keys\(this as any\)\) \{/g, 'for (const key of Object.keys(this as unknown as Record<string, unknown>)) {');
src = src.replace(/delete \(this as any\)\[key\];/g, 'delete (this as unknown as Record<string, unknown>)[key];');
src = src.replace(/\(el as any\)\.options = field\.options \?\? \[\];/g, '(el as unknown as Record<string, unknown>).options = field.options ?? [];');
src = src.replace(/e\.detail\?\.value \?\? e\.target\.value \?\? e\.target\.checked/g, '(e as CustomEvent).detail?.value ?? (e.target as HTMLInputElement).value ?? (e.target as HTMLInputElement).checked');
src = src.replace(/el\.addEventListener\('skyra-change', \(e: any\) =>/g, 'el.addEventListener("skyra-change", (e: Event) =>');
src = src.replace(/const items = \(getIn\(this\._values, fullPath\) as any\[\]\) \|\| \[\];/g, 'const items = (getIn(this._values, fullPath) as unknown[]) || [];');
src = src.replace(/\(el as any\)\.value = val;/g, '(el as HTMLInputElement).value = val as string;');
src = src.replace(/\(el as any\)\.value = val \?\? '';/g, '(el as HTMLInputElement).value = (val as string) ?? "";');
src = src.replace(/const placeholder = \(this as any\)\[\`_placeholder_\$\{path\}\`\];/g, 'const placeholder = (this as unknown as Record<string, unknown>)[`_placeholder_${path}`];');
src = src.replace(/let placeholder = \(this as any\)\[\`_placeholder_\$\{path\}\`\];/g, 'let placeholder = (this as unknown as Record<string, unknown>)[`_placeholder_${path}`];');
src = src.replace(/\(this as any\)\[\`_placeholder_\$\{path\}\`\] = placeholder;/g, '(this as unknown as Record<string, unknown>)[`_placeholder_${path}`] = placeholder;');
src = src.replace(/catch \(e: any\)/g, 'catch (e: unknown)');
src = src.replace(/private _dispatchEvent\(name: string, detail: any\)/g, 'private _dispatchEvent(name: string, detail: unknown)');
fs.writeFileSync(srcPath, src);

// 4. test-setup
let setup = fs.readFileSync(testSetupPath, 'utf8');
setup = setup.replace(/as any/g, 'as unknown as Record<string, unknown>'); // generic replace
setup = setup.replace(/\(e\.target as unknown as Record<string, unknown>\)\.value/g, '(e.target as HTMLInputElement).value');
fs.writeFileSync(testSetupPath, setup);

// 5. test
let test = fs.readFileSync(testPath, 'utf8');
test = test.replace(/await \(form as any\)\._handleSubmit\(event\);/g, 'await (form as unknown as { _handleSubmit: (e: Event) => Promise<void> })._handleSubmit(event);');
test = test.replace(/submitSpy\.mock\.calls\[0\]!\[0\] as any;/g, 'submitSpy.mock.calls[0]![0] as CustomEvent;');
fs.writeFileSync(testPath, test);

console.log('Done');
