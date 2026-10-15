import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { createScratch, cleanupOwned, dependencyClosure, archivePath, validateArchive, consumerDependencies, runIsolation, runCommand } from './test-package-isolation.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = { name: '@skyra-tech-platform/dynamic-form', version: '0.1.0' };

function protectedState() {
  const state = {};
  function walk(file) {
    const stat = fs.lstatSync(file);
    if (stat.isSymbolicLink()) state[file] = { link: fs.readlinkSync(file) };
    else if (stat.isDirectory()) for (const child of fs.readdirSync(file)) walk(path.join(file, child));
    else state[file] = createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  }
  for (const file of ['.tmp/consumer-test', '.tmp-consumer', 'packages/button/skyra-tech-platform-button-0.1.0.tgz', 'dashboard/next-env.d.ts']) walk(path.join(root, file));
  return state;
}
const protectedBefore = protectedState();

test('unique scratch and successful cleanup preserve sibling runs and shared fixtures', () => {
  const first = createScratch(root), second = createScratch(root);
  assert.notEqual(first.directory, second.directory);
  fs.writeFileSync(path.join(second.directory, 'sentinel'), 'preserve');
  assert(cleanupOwned(first));
  assert.equal(fs.readFileSync(path.join(second.directory, 'sentinel'), 'utf8'), 'preserve');
  assert(fs.existsSync(path.join(root, '.tmp-consumer/package.json')));
  assert(fs.existsSync(path.join(root, '.tmp/consumer-test/package.json')));
  assert(cleanupOwned(second));
});

test('cleanup refuses unowned paths and changed owner markers', () => {
  assert.equal(cleanupOwned({ directory: root }), false);
  const owner = createScratch(root);
  fs.writeFileSync(path.join(owner.directory, '.owner'), 'another-owner');
  assert.equal(cleanupOwned(owner), false);
  assert(fs.existsSync(owner.directory)); // Preserve uncertain ownership, including this test's evidence.
});

test('deterministic selection ignores stale archives and rejects missing expected identity', () => {
  const owner = createScratch(root);
  fs.writeFileSync(path.join(owner.directory, 'unrelated.tgz'), 'stale');
  assert.equal(path.basename(archivePath(owner.directory, manifest)), 'skyra-tech-platform-dynamic-form-0.1.0.tgz');
  assert.throws(() => validateArchive(owner.directory, manifest), /Missing or unsafe expected archive/);
  assert.throws(() => archivePath(owner.directory, { ...manifest, name: '../escape' }), /Invalid canonical/);
  assert(cleanupOwned(owner));
});

test('archive validation rejects wrong identity, traversal, unresolved workspaces and missing exports', () => {
  const owner = createScratch(root);
  fs.writeFileSync(archivePath(owner.directory, manifest), 'test fixture');
  const execute = packed => (_cmd, args) => args[0] === '-tf' ? 'package/package.json\npackage/dist/index.js\n' : JSON.stringify(packed);
  assert.throws(() => validateArchive(owner.directory, manifest, execute({ ...manifest, name: '@skyra-tech-platform/utils' })), /identity mismatch/);
  assert.throws(() => validateArchive(owner.directory, manifest, () => 'package/../escape'), /Unsafe archive/);
  assert.throws(() => validateArchive(owner.directory, manifest, execute({ ...manifest, dependencies: { x: 'workspace:*' } })), /Unresolved workspace/);
  assert.throws(() => validateArchive(owner.directory, manifest, execute({ ...manifest, exports: { '.': './missing.js' } })), /Missing export target/);
  assert.equal(validateArchive(owner.directory, manifest, execute({ ...manifest, exports: { '.': './dist/index.js' } })).manifest.name, manifest.name);
  assert(cleanupOwned(owner));
});

test('internal dependency closure and declared external peers are explicit', () => {
  const closure = dependencyClosure(root);
  assert.equal(closure.length, 12);
  assert(closure.some(p => p.manifest.name === '@skyra-tech-platform/validation'));
  assert.throws(() => dependencyClosure(root, '@skyra-tech-platform/nonexistent'), /Missing internal dependency/);
  const archives = closure.map(p => ({ manifest: p.manifest, archive: archivePath('/scratch', p.manifest) }));
  assert.equal(consumerDependencies(archives).zod, '^3.22.0');
  assert.throws(() => consumerDependencies([{ archive: '/a', manifest: { name: 'a', peerDependencies: { zod: '^3' } } }, { archive: '/b', manifest: { name: 'b', peerDependencies: { zod: '^4' } } }]), /Conflicting peer/);
});

test('installer failure propagates and preserves artifacts rather than using workspace imports', () => {
  let scratch, imported = false;
  const execute = (_cmd, args, options) => {
    if (args[0] === 'pack') fs.writeFileSync(archivePath(args[2], JSON.parse(fs.readFileSync(path.join(options.cwd, 'package.json')))), 'fixture');
    if (args[0] === '-tf') return 'package/package.json\n';
    if (args[0] === '-xOf') {
      const name = path.basename(args[1]).replace(/-0\.1\.0\.tgz$/, '').replace('skyra-tech-platform-', '@skyra-tech-platform/');
      return JSON.stringify({ name, version: '0.1.0' });
    }
    if (args[0] === 'install') {
      assert(args.includes('--offline') && args.includes('--strict-peer-deps'));
      scratch = path.dirname(options.cwd);
      throw new Error('required dependency not cached');
    }
    if (args.some(arg => arg.endsWith('test.mjs'))) imported = true;
    return '';
  };
  assert.throws(() => runIsolation({ root, execute, launcher: ['mock-pnpm', []], installerLauncher: ['mock-npm', []], log() {} }), /required dependency not cached/);
  assert(fs.existsSync(path.join(scratch, 'consumer/package.json')));
  assert.equal(imported, false);
});

test('subprocess compiler/installer nonzero exits are never treated as success', () => {
  assert.throws(() => runCommand(process.execPath, ['-e', 'process.exit(7)'], { capture: true }), /failed \(7\)/);
});

test('missing transitive workspace dependencies fail; valid cycles terminate', () => {
  const owner = createScratch(root);
  const first = path.join(owner.directory, 'packages', 'dynamic-form');
  fs.mkdirSync(first, { recursive: true });
  fs.writeFileSync(path.join(first, 'package.json'), JSON.stringify({ ...manifest,
    dependencies: { '@skyra-tech-platform/required': 'workspace:*' } }));
  assert.throws(() => dependencyClosure(owner.directory), /Missing internal dependency: @skyra-tech-platform\/required/);
  const second = path.join(owner.directory, 'packages', 'required');
  fs.mkdirSync(second);
  fs.writeFileSync(path.join(second, 'package.json'), JSON.stringify({ name: '@skyra-tech-platform/required',
    version: '0.1.0', dependencies: { [manifest.name]: 'workspace:*' } }));
  assert.equal(dependencyClosure(owner.directory).length, 2);
  assert(cleanupOwned(owner));
});

test('fixture contents, links, Button archive and Dashboard generated file remain unchanged', () => {
  assert.deepEqual(protectedState(), protectedBefore);
});
