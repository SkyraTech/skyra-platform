import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import { Project } from 'ts-morph';
import { bootstrapRegistry } from '../src/docs-system/bootstrap';
import { docsRegistry } from '../src/docs-system/registry';

const root = path.resolve(__dirname, '../..');
const routes = path.join(root, 'dashboard/src/app/(dashboard)');
const project = new Project({ useInMemoryFileSystem: true });
const source = project.createSourceFile('page.tsx', fs.readFileSync(path.join(routes, 'components/page.tsx'), 'utf8'));
const initializer = source.getVariableDeclarationOrThrow('COMPONENT_GROUPS').getInitializerOrThrow().getText();
const groups = vm.runInNewContext(initializer) as { title: string; items: { packageId: string; href: string; label: string; desc: string; manualStatus?: string }[] }[];
bootstrapRegistry();
const resolver = vm.runInNewContext(ts.transpileModule(source.getFunctionOrThrow('resolveItem').getText() + '\nresolveItem;', {
  compilerOptions: { target: ts.ScriptTarget.ES2022 },
}).outputText, { docsRegistry }) as (item: object) => { status: string; href: string };

test('PDF Viewer resolves to its existing implemented package status and documentation', () => {
  const pdf = groups.find(group => group.title === 'Documents')!.items.find(item => item.packageId === '@skyra-tech-platform/pdf-viewer')!;
  assert.equal(pdf.manualStatus, undefined);
  assert.equal(resolver(pdf).status, 'stable');
  assert.equal(resolver(pdf).status, docsRegistry.getPackage(pdf.packageId)!.status);
  assert.equal(pdf.href, '/docs/pdf-viewer');
  assert(fs.existsSync(path.join(routes, 'docs/pdf-viewer/page.tsx')));
  assert(fs.existsSync(path.join(routes, 'pdf-viewer/page.tsx')));
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'packages/pdf-viewer/package.json'), 'utf8'));
  assert.equal(manifest.name, pdf.packageId);
  for (const target of Object.values(manifest.exports['.']) as string[]) assert(fs.existsSync(path.join(root, 'packages/pdf-viewer', target)));
  assert(fs.readFileSync(path.join(root, 'packages/pdf-viewer/dist/index.d.ts'), 'utf8').includes('export { SkyraPdfViewerElement }'));
});

test('Utilities contains the unchanged real QR entry and no generic future component', () => {
  const utilities = groups.find(group => group.title === 'Utilities')!;
  assert.equal(utilities.items.length, 1);
  const qr = utilities.items[0]!;
  assert.equal(qr.packageId, '@skyra-tech-platform/qr');
  assert.equal(qr.href, '/components/utilities/qr');
  assert.equal(qr.label, 'QR Code');
  assert(!groups.flatMap(group => group.items).some(item => item.packageId === 'future-misc' || item.label === 'Future components'));
});

test('all existing catalogue categories remain, with only the placeholder count removed', () => {
  assert.deepEqual(Array.from(groups, group => group.title), ['Basic Controls', 'Selection', 'Navigation', 'Layout', 'Forms', 'Feedback', 'Data Display', 'Disclosure', 'Overlays', 'Documents', 'Utilities']);
  assert.deepEqual(Array.from(groups, group => group.items.length), [6, 1, 1, 1, 2, 3, 1, 2, 5, 1, 1]);
});
