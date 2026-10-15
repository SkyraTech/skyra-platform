import fs from 'node:fs';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repository = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = '@skyra-tech-platform/dynamic-form';
const owners = new WeakSet();

export function createScratch(root) {
  const parent = path.join(fs.realpathSync(root), '.tmp', 'package-isolation');
  fs.mkdirSync(parent, { recursive: true });
  if (fs.realpathSync(parent) !== parent) throw new Error('Scratch parent is redirected');
  const directory = fs.mkdtempSync(path.join(parent, 'run-'));
  const token = randomBytes(32).toString('hex');
  fs.writeFileSync(path.join(directory, '.owner'), token, { flag: 'wx' });
  const stat = fs.statSync(directory);
  const owner = Object.freeze({ directory, parent, token, dev: stat.dev, ino: stat.ino });
  owners.add(owner);
  return owner;
}

export function cleanupOwned(owner) {
  if (!owners.has(owner)) return false;
  try {
    const stat = fs.lstatSync(owner.directory), marker = path.join(owner.directory, '.owner');
    if (path.dirname(owner.directory) !== owner.parent || !path.basename(owner.directory).startsWith('run-')
      || stat.isSymbolicLink() || stat.dev !== owner.dev || stat.ino !== owner.ino
      || fs.realpathSync(owner.parent) !== owner.parent || fs.realpathSync(owner.directory) !== owner.directory
      || fs.lstatSync(marker).isSymbolicLink() || fs.readFileSync(marker, 'utf8') !== owner.token) return false;
    // Delete only this invocation's exact, verified absolute path; never a shared fixture.
    fs.rmSync(owner.directory, { recursive: true });
    owners.delete(owner);
    return true;
  } catch { return false; } // Uncertain ownership preserves evidence.
}

export function dependencyClosure(root, name = target) {
  const packages = new Map(), selected = new Map();
  for (const slug of fs.readdirSync(path.join(root, 'packages'))) {
    const directory = path.join(root, 'packages', slug), file = path.join(directory, 'package.json');
    if (!fs.existsSync(file)) continue;
    const manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (packages.has(manifest.name)) throw new Error(`Duplicate package identity: ${manifest.name}`);
    packages.set(manifest.name, { directory, manifest });
  }
  function visit(id) {
    if (selected.has(id)) return;
    const pkg = packages.get(id);
    if (!pkg) throw new Error(`Missing internal dependency: ${id}`);
    selected.set(id, pkg);
    for (const [dependency, range] of Object.entries({ ...pkg.manifest.dependencies, ...pkg.manifest.optionalDependencies, ...pkg.manifest.peerDependencies })) {
      if (dependency.startsWith('@skyra-tech-platform/') || range.startsWith('workspace:')) visit(dependency);
    }
  }
  visit(name);
  return [...selected.values()].sort((a, b) => a.manifest.name.localeCompare(b.manifest.name));
}

export function archivePath(destination, manifest) {
  if (!/^@skyra-tech-platform\/[a-z0-9-]+$/.test(manifest.name) || !/^\d+\.\d+\.\d+(?:-[a-zA-Z0-9.-]+)?(?:\+[a-zA-Z0-9.-]+)?$/.test(manifest.version)) throw new Error('Invalid canonical package identity/version');
  return path.join(destination, `${manifest.name.slice(1).replace('/', '-')}-${manifest.version}.tgz`);
}

export function runCommand(command, args, { cwd, capture = false } = {}) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', shell: false, stdio: capture ? 'pipe' : 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${path.basename(command)} ${args.join(' ')} failed (${result.status}): ${result.stderr || ''}`);
  return result.stdout || '';
}

export function packageManagerLauncher(manager) {
  if (process.platform !== 'win32') return [manager, []];
  // Avoid cmd.exe path interpolation: invoke the JavaScript CLI with Node.
  const files = manager === 'npm' ? ['npm-cli.js'] : ['pnpm.cjs', 'pnpm.mjs'];
  for (const folder of (process.env.PATH || '').split(path.delimiter)) for (const file of files) {
    const cli = path.join(folder, 'node_modules', manager, 'bin', file);
    if (fs.existsSync(cli)) return [process.execPath, [cli]];
  }
  throw new Error(`Cannot locate the Windows ${manager} JavaScript launcher on PATH`);
}

export function validateArchive(destination, manifest, execute = runCommand) {
  const archive = archivePath(destination, manifest);
  if (!fs.existsSync(archive) || !fs.lstatSync(archive).isFile() || fs.lstatSync(archive).isSymbolicLink()) throw new Error(`Missing or unsafe expected archive: ${archive}`);
  const entries = execute('tar', ['-tf', archive], { capture: true }).trim().split(/\r?\n/);
  if (!entries.every(entry => entry.startsWith('package/') && !entry.split('/').includes('..'))) throw new Error(`Unsafe archive entries: ${archive}`);
  const packed = JSON.parse(execute('tar', ['-xOf', archive, 'package/package.json'], { capture: true }));
  if (packed.name !== manifest.name || packed.version !== manifest.version) throw new Error(`Archive identity mismatch: ${archive}`);
  for (const range of Object.values({ ...packed.dependencies, ...packed.optionalDependencies, ...packed.peerDependencies })) if (range.startsWith('workspace:')) throw new Error(`Unresolved workspace dependency in ${archive}`);
  function check(value) {
    if (typeof value === 'string' && value.startsWith('./') && !entries.includes(`package/${value.slice(2)}`)) throw new Error(`Missing export target ${value} in ${archive}`);
    if (value && typeof value === 'object') Object.values(value).forEach(check);
  }
  check(packed.exports);
  return { archive, manifest: packed };
}

export function consumerDependencies(archives) {
  const dependencies = {};
  for (const { archive, manifest } of archives) dependencies[manifest.name] = `file:${archive.replaceAll('\\', '/')}`;
  for (const { manifest } of archives) for (const [name, range] of Object.entries(manifest.peerDependencies || {})) {
    if (dependencies[name]?.startsWith('file:') || manifest.peerDependenciesMeta?.[name]?.optional) continue;
    if (Object.hasOwn(dependencies, name) && dependencies[name] !== range) throw new Error(`Conflicting peer requirements for ${name}`);
    dependencies[name] = range;
  }
  return dependencies;
}

export function runIsolation({ root = repository, execute = runCommand, launcher = packageManagerLauncher('pnpm'),
  installerLauncher = packageManagerLauncher('npm'), log = console.log } = {}) {
  const packages = dependencyClosure(root), owner = createScratch(root);
  const archivesDir = path.join(owner.directory, 'tarballs'), consumer = path.join(owner.directory, 'consumer');
  fs.mkdirSync(archivesDir); fs.mkdirSync(consumer);
  const [pnpm, prefix] = launcher;
  const invoke = (args, cwd) => execute(pnpm, [...prefix, ...args], { cwd });
  try {
    log(`Scratch directory: ${owner.directory}`);
    log(`Building and packing ${target} (${packages.length} packages including dependencies)...`);
    invoke(packages.flatMap(pkg => ['--filter', pkg.manifest.name]).concat('build'), root);
    const archives = packages.map(pkg => {
      invoke(['pack', '--pack-destination', archivesDir], pkg.directory);
      return validateArchive(archivesDir, pkg.manifest, execute);
    });
    fs.writeFileSync(path.join(consumer, 'package.json'), JSON.stringify({ name: 'skyra-isolated-consumer', private: true, type: 'module',
      packageManager: JSON.parse(fs.readFileSync(path.join(root, 'package.json'))).packageManager,
      dependencies: consumerDependencies(archives) }, null, 2), { flag: 'wx' });
    // npm (the original installer) resolves semver dependencies against the complete
    // local archive set. Offline/cache failures and unsatisfied peers propagate.
    const [npm, npmPrefix] = installerLauncher;
    execute(npm, [...npmPrefix, 'install', '--offline', '--ignore-scripts', '--strict-peer-deps', '--no-audit', '--no-fund'], { cwd: consumer });
    fs.writeFileSync(path.join(consumer, 'test.mjs'), `import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { SkyraTechDynamicForm } from '${target}';
const require = createRequire(import.meta.url);
const base = fs.realpathSync(fileURLToPath(new URL('.', import.meta.url)));
for (const name of Object.keys(require('./package.json').dependencies)) {
  assert(fs.realpathSync(require.resolve(name)).startsWith(path.join(base, 'node_modules') + path.sep), 'Dependency escaped isolated consumer: ' + name);
}
assert.equal(typeof SkyraTechDynamicForm, 'function');
console.log('Import successful!');
`, { flag: 'wx' });
    execute(process.execPath, [path.join(consumer, 'test.mjs')], { cwd: consumer });
    log('Package isolation verified successfully!');
    if (!cleanupOwned(owner)) log(`Scratch preserved because cleanup ownership could not be verified: ${owner.directory}`);
    return { packages: packages.length };
  } catch (error) { log(`Failed run artifacts preserved: ${owner.directory}`); throw error; }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { runIsolation(); } catch (error) { console.error('Package isolation test failed:', error.message); process.exitCode = 1; }
}
