import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { extractCatalog, validateTargets, archiveRecords, generate, writeAtomic, ROOT } from './extract-api';
import { API_TARGETS } from '../src/docs-system/catalog-targets';
import { validateCatalogIntegrity, type CatalogBundle } from '../src/docs-system/catalog-integrity';
import { behavioralMetadataMap } from '../src/docs-system/behavioral-metadata';
import { historicalBehavioralMetadataMap, unboundHistoricalBehaviorIds } from '../src/docs-system/historical-behavioral-metadata';
import { Registry, docsRegistry } from '../src/docs-system/registry';
import { bootstrapRegistry } from '../src/docs-system/bootstrap';
import type { ApiMetadata } from '../src/docs-system/metadata';
import { buildSearchIndex } from '../src/docs-system/search';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ExampleViewer } from '../src/components/docs/ExampleViewer';

const dataDir = path.join(ROOT, 'dashboard/src/docs-system/data');
const current: ApiMetadata[] = JSON.parse(fs.readFileSync(path.join(dataDir, 'apis.json'), 'utf8'));
const historical: ApiMetadata[] = JSON.parse(fs.readFileSync(path.join(dataDir, 'historical-apis.json'), 'utf8'));
bootstrapRegistry();
function bundle(): CatalogBundle {
  return { current, historical, examples: JSON.parse(fs.readFileSync(path.join(dataDir, 'examples.json'), 'utf8')),
    historicalExamples: JSON.parse(fs.readFileSync(path.join(dataDir, 'historical-examples.json'), 'utf8')),
    capabilities: docsRegistry.getCapabilities(), behavioralIds: Object.keys(behavioralMetadataMap),
    historicalBehavioralIds: Object.keys(historicalBehavioralMetadataMap), unboundHistoricalBehaviorIds,
    releaseApiIds: docsRegistry.getReleases().flatMap(release => release.packages.flatMap(pkg => pkg.changes.flatMap(change => change.apiIds || []))) };
}
function fixture() {
  const root = fs.mkdtempSync(path.join(ROOT, '.tmp/f16/test-'));
  const target = { packageId: '@skyra-tech-platform/fixture', exportPath: '@skyra-tech-platform/fixture', capabilityId: 'fixture/core', entry: 'packages/fixture/dist/index.d.ts' };
  fs.mkdirSync(path.join(root, 'packages/fixture/dist'), { recursive: true });
  fs.writeFileSync(path.join(root, 'packages/fixture/package.json'), JSON.stringify({ name: target.packageId, exports: { '.': { types: './dist/index.d.ts' } } }));
  fs.writeFileSync(path.join(root, target.entry), 'export declare function sample(value: string): { ok: boolean };\nexport declare function sample(value: number): { ok: boolean };\n');
  const exampleDir = path.join(root, 'dashboard/src/examples');
  fs.mkdirSync(exampleDir, { recursive: true });
  fs.writeFileSync(path.join(exampleDir, 'sample.ts'), '/** @id sample\n * @apiId @skyra-tech-platform/fixture::sample\n * @packageId @skyra-tech-platform/fixture\n * @capabilityId fixture/core\n */\n');
  return { root, target, output: path.join(root, 'catalog.json') };
}

test('29 explicit declaration targets belong to 28 real canonical packages and exports', () => {
  validateTargets(ROOT, API_TARGETS);
  assert.equal(API_TARGETS.length, 29);
  assert.equal(new Set(API_TARGETS.map(target => target.packageId)).size, 28);
  assert(!API_TARGETS.some(target => target.packageId === '@skyra-tech-platform/ui'));
});
test('manifest identity and public subpath mismatches fail', () => {
  const f = fixture();
  fs.writeFileSync(path.join(f.root, 'packages/fixture/package.json'), JSON.stringify({ name: 'wrong', exports: { '.': { types: './dist/index.d.ts' } } }));
  assert.throws(() => validateTargets(f.root, [f.target]), /identity mismatch/);
  assert.throws(() => validateTargets(ROOT, [{ ...API_TARGETS[0]!, exportPath: API_TARGETS[0]!.packageId + '/missing' }]), /Unknown declaration export/);
});
test('missing declarations fail before an existing output is touched', () => {
  const f = fixture(); fs.writeFileSync(f.output, 'preserved');
  fs.renameSync(path.join(f.root, f.target.entry), path.join(f.root, 'held.d.ts'));
  assert.throws(() => generate(f.root, f.output, false, [f.target]), /Missing required declaration/);
  assert.equal(fs.readFileSync(f.output, 'utf8'), 'preserved');
});

test('missing named public exports fail rather than silently shrinking the catalog', () => {
  const f = fixture(); fs.writeFileSync(f.output, 'preserved');
  fs.appendFileSync(path.join(f.root, f.target.entry), 'export { absent as required } from "./other";\n');
  fs.writeFileSync(path.join(f.root, 'packages/fixture/dist/other.d.ts'), 'export declare const present: string;');
  assert.throws(() => generate(f.root, f.output, false, [f.target]), /Unresolved public export/);
  assert.equal(fs.readFileSync(f.output, 'utf8'), 'preserved');
});
test('class declarations and object returns/overloads use real declaration text', () => {
  assert.equal(current.find(api => api.id === '@skyra-tech-platform/dialog::SkyraTechDialog')?.kind, 'class');
  assert(!current.some(api => api.id === '@skyra-tech-platform/app-shell::ApplicationShell'));
  const f = fixture(), result = extractCatalog(f.root, [f.target]);
  assert(result[0]!.signature!.includes('{ ok: boolean }'));
  assert(result[0]!.signature!.includes('value: string'));
  assert(result[0]!.signature!.includes('value: number'));
  assert(!result[0]!.signature!.includes('React.FC'));
});
test('generation is deterministic and --check semantics detect drift without writes', () => {
  const f = fixture(); generate(f.root, f.output, false, [f.target]);
  const first = fs.readFileSync(f.output, 'utf8');
  generate(f.root, f.output, false, [f.target]);
  assert.equal(fs.readFileSync(f.output, 'utf8'), first);
  generate(f.root, f.output, true, [f.target]);
  fs.writeFileSync(f.output, 'drift');
  assert.throws(() => generate(f.root, f.output, true, [f.target]), /out of date/);
  assert.equal(fs.readFileSync(f.output, 'utf8'), 'drift');
});
test('invalid example annotations block replacement; failed atomic rename leaves existing destination intact', () => {
  const f = fixture(); fs.writeFileSync(f.output, 'preserved');
  fs.writeFileSync(path.join(f.root, 'dashboard/src/examples/sample.ts'), '/** @id sample\n * @apiId missing\n * @packageId missing\n */');
  assert.throws(() => generate(f.root, f.output, false, [f.target]), /Invalid current example join/);
  assert.equal(fs.readFileSync(f.output, 'utf8'), 'preserved');
  const dir = path.join(f.root, 'existing'); fs.mkdirSync(dir); fs.writeFileSync(path.join(dir, 'sentinel'), 'preserved');
  assert.throws(() => writeAtomic(dir, 'new'));
  assert.equal(fs.readFileSync(path.join(dir, 'sentinel'), 'utf8'), 'preserved');
  assert(!fs.readdirSync(f.root).some(name => name.endsWith('.tmp')));
});

test('referential validation failures occur before generated output replacement', () => {
  const f = fixture(); fs.writeFileSync(f.output, 'preserved');
  assert.throws(() => generate(f.root, f.output, false, [f.target], () => { throw new Error('invalid catalog references'); }), /invalid catalog references/);
  assert.equal(fs.readFileSync(f.output, 'utf8'), 'preserved');
});

test('a pre-existing atomic-write scratch collision is preserved', () => {
  const f = fixture(); fs.writeFileSync(f.output, 'original catalog');
  const collision = path.join(f.root, 'existing.tmp'); fs.writeFileSync(collision, 'unrelated evidence');
  assert.throws(() => writeAtomic(f.output, 'new catalog', collision));
  assert.equal(fs.readFileSync(f.output, 'utf8'), 'original catalog');
  assert.equal(fs.readFileSync(collision, 'utf8'), 'unrelated evidence');
});
test('historical classification preserves payloads without speculative aliases', () => {
  assert.equal(historical.length, 471);
  assert.equal(historical.filter(api => api.historyReason === 'retired-package').length, 325);
  assert.equal(historical.filter(api => api.historyReason === 'superseded').length, 145);
  assert.equal(historical.filter(api => api.historyReason === 'unresolved-symbol').length, 1);
  const original = historical.find(api => api.id === '@skyra/ui::Button')!;
  const archived = archiveRecords([original], current)[0]!;
  assert.equal(archived.id, original.id);
  assert.equal(archived.signature, original.signature);
  assert.equal(archived.historyReason, 'retired-package');
  assert(!current.some(api => api.id === '@skyra-tech-platform/button::Button'));
});
test('catalog, capabilities, examples, behavioral quarantine and release joins are consistent', () => {
  validateCatalogIntegrity(bundle());
  assert.equal(unboundHistoricalBehaviorIds.length, 4);
});
test('broken current identity/example/behavior and release references fail integrity checks', () => {
  assert.throws(() => validateCatalogIntegrity({ ...bundle(), current: [{ ...current[0]!, packageId: '@skyra/ui' }] }), /Invalid current API identity/);
  assert.throws(() => validateCatalogIntegrity({ ...bundle(), examples: [{ ...bundle().examples[0]!, apiId: '@skyra/ui::Button' }] }), /Invalid current example/);
  assert.throws(() => validateCatalogIntegrity({ ...bundle(), behavioralIds: ['missing'] }), /Unknown current behavioral/);
  assert.throws(() => validateCatalogIntegrity({ ...bundle(), historical: [{ ...historical[0]!, historyReason: undefined }] }), /Unclassified historical API/);
  assert.throws(() => validateCatalogIntegrity({ ...bundle(), releaseApiIds: ['missing'] }), /Unknown release API/);
});
test('legacy lookup, historical examples and QR public-subpath routes remain distinct', () => {
  assert.equal(docsRegistry.getApi('@skyra/ui::Button')?.catalogState, 'historical');
  assert.equal(docsRegistry.findApiForRoute('ui', 'components', 'Button')?.id, '@skyra/ui::Button');
  assert.equal(docsRegistry.findApiForRoute('dialogs', 'core', 'ConfirmDialog')?.catalogState, 'historical');
  assert.equal(docsRegistry.getApi('@skyra-tech-platform/app-shell::skyra-tech-app-shell')?.historyReason, 'unresolved-symbol');
  assert.equal(docsRegistry.findApiForRoute('qr', 'web-component', 'SkyraTechQRCodeElement')?.exportPath, '@skyra-tech-platform/qr/web-component');
  assert(docsRegistry.getExamplesForApi('@skyra/ui::Button').every(example => example.catalogState === 'historical'));
  assert.equal(docsRegistry.getHistoricalExamplesForApi('@skyra-tech-platform/qr::generateQRCode')[0]?.catalogState, 'historical');
  assert.equal(docsRegistry.getExamplesForApi('@skyra-tech-platform/qr::generateQRCode')[0]?.catalogState, 'current');
  assert(docsRegistry.getCurrentApis().every(api => api.catalogState === 'current'));
  const registry = new Registry(); registry.registerHistoricalApi(historical[0]!);
  registry.registerApi({ ...historical[0]!, catalogState: 'current' });
  assert.equal(registry.getApi(historical[0]!.id)?.catalogState, 'current');
  assert.equal(registry.getHistoricalApi(historical[0]!.id)?.catalogState, 'historical');
});
test('committed current catalog matches deterministic extraction', () => {
  assert.deepEqual(extractCatalog(), current);
});

test('normal search excludes historical APIs and historical capability records', () => {
  const index = buildSearchIndex();
  assert(index.some(doc => doc.apiId === '@skyra-tech-platform/dialog::SkyraTechDialog'));
  assert(!index.some(doc => doc.apiId?.startsWith('@skyra/') || doc.capabilityId === 'ui/components'));
});

test('archived examples render source rather than the newer mapped preview', () => {
  const html = renderToStaticMarkup(createElement(ExampleViewer, { example: {
    id: 'ui-button-basic', title: 'Archived', source: 'HISTORICAL_SOURCE_SENTINEL', language: 'tsx', catalogState: 'historical' } }));
  assert(html.includes('HISTORICAL_SOURCE_SENTINEL'));
  assert(html.includes('<pre'));
  assert(html.includes('disabled'));
});

test('updated example identities are proven by the actual element registration and source tag', () => {
  const pairs = [
    ['app-shell/app-shell-basic.tsx', 'app-shell/skyra-tech-app-shell.ts', 'skyra-tech-app-shell', 'SkyraAppShell'],
    ['data-table/data-table-basic.tsx', 'data-table/skyra-tech-data-table.ts', 'skyra-tech-data-table', 'SkyraTechDataTable'],
    ['dynamic-form/dynamic-form-basic.tsx', 'dynamic-form/skyra-tech-dynamic-form.ts', 'skyra-tech-dynamic-form', 'SkyraTechDynamicForm'],
    ['dialogs/confirm-dialog.tsx', 'dialog/skyra-tech-dialog.ts', 'skyra-tech-dialog', 'SkyraTechDialog'],
    ['ui/button-basic.tsx', 'button/skyra-tech-button.ts', 'skyra-tech-button', 'SkyraTechButton'],
  ];
  for (const [example, component, tag, symbol] of pairs) {
    const source = fs.readFileSync(path.join(ROOT, 'dashboard/src/examples', example!), 'utf8');
    const [slug, file] = component!.split('/');
    const implementation = fs.readFileSync(path.join(ROOT, 'packages', slug!, 'src', file!), 'utf8');
    assert(source.includes('<' + tag));
    assert(implementation.includes(`customElements.define('${tag}', ${symbol})`));
    assert(source.includes(`@apiId @skyra-tech-platform/${slug}::${symbol}`));
  }
});
