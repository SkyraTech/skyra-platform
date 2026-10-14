import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import ts from 'typescript';

// F-05 consumer checks. Uses installed workspace packages and existing builds;
// does not edit manifests, install dependencies, or regenerate build artifacts.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const consumer = path.join(root, 'dashboard');
const cases = [
  ['app-shell', 'SkyraAppShell', true],
  ['data-export', 'exportToCsv', false],
  ['data-table', 'processTableData', true],
  ['date-time', 'toISODate', true],
  ['design-tokens', 'tokens', false],
  ['dialog', 'SkyraTechDialog', true],
  ['dynamic-form', 'evaluateCondition', true],
  ['qr', 'generateQRCode', false],
  ['qr/web-component', 'SkyraTechQRCodeElement', true],
  ['utils', 'simpleId', false],
  ['validation', 'emailSchema', false],
];
const normalizedPaths = new Map();
const normalize = file => {
  if (normalizedPaths.has(file)) return normalizedPaths.get(file);
  const absolute = path.resolve(file);
  const resolved = fs.existsSync(absolute) ? fs.realpathSync(absolute) : absolute;
  const normalized = resolved.replaceAll('\\', '/').toLowerCase();
  normalizedPaths.set(file, normalized);
  return normalized;
};
const same = (a, b) => normalize(a) === normalize(b);
const failures = [];

function compile(slug, symbol, mode, extension, mutation) {
  const packageDir = path.join(root, 'packages', slug.split('/')[0]);
  const manifestFile = path.join(packageDir, 'package.json');
  const subpath = slug.includes('/') ? './web-component' : '.';
  const file = path.join(consumer, `__f05_virtual_consumer${extension}`);
  const name = `@skyra-tech-platform/${slug}`;
  const source = extension === '.cts'
    ? `import p = require('${name}'); const value: typeof p.${symbol} = p.${symbol};`
    : `import { ${symbol} } from '${name}'; const value: typeof ${symbol} = ${symbol};`;
  const options = {
    noEmit: true, strict: true, skipLibCheck: true, types: [],
    target: ts.ScriptTarget.ES2022,
    module: mode === 'NodeNext' ? ts.ModuleKind.NodeNext : ts.ModuleKind.ESNext,
    moduleResolution: mode === 'NodeNext' ? ts.ModuleResolutionKind.NodeNext : ts.ModuleResolutionKind.Bundler,
  };
  const host = ts.createCompilerHost(options);
  const originalRead = host.readFile;
  const originalExists = host.fileExists;
  const originalSource = host.getSourceFile;
  const hiddenDeclaration = f => mutation === 'missing-declarations'
    && normalize(f).startsWith(normalize(path.join(packageDir, 'dist')) + '/')
    && /\.d\.(?:ts|cts|mts)$/i.test(f);
  host.fileExists = f => same(f, file) || (!hiddenDeclaration(f) && originalExists(f));
  host.readFile = f => {
    if (same(f, file)) return source;
    if (hiddenDeclaration(f)) return undefined;
    if (mutation === 'missing-target' && same(f, manifestFile)) {
      const pkg = JSON.parse(originalRead(f));
      pkg.exports[subpath] = {
        types: './dist/__f05_missing.d.ts',
        import: './dist/__f05_missing.js',
        require: './dist/__f05_missing.cjs',
      };
      return JSON.stringify(pkg);
    }
    return originalRead(f);
  };
  host.getSourceFile = (f, version, onError, fresh) => {
    if (same(f, file)) return ts.createSourceFile(f, source, version, true);
    if (hiddenDeclaration(f)) return undefined;
    return originalSource(f, version, onError, fresh);
  };
  const program = ts.createProgram([file], options, host);
  const diagnostics = ts.getPreEmitDiagnostics(program);
  const checker = program.getTypeChecker();
  if (!mutation && diagnostics.length === 0) {
    const statement = program.getSourceFile(file).statements[1];
    const valueType = checker.getTypeAtLocation(statement.declarationList.declarations[0].name);
    assert.equal(valueType.flags & ts.TypeFlags.Any, 0, `${name} resolved to any`);
  }
  const resolution = ts.resolveModuleName(name, file, options, host, undefined, undefined,
    extension === '.cts' ? ts.ModuleKind.CommonJS : ts.ModuleKind.ESNext).resolvedModule;
  return {
    errors: diagnostics.map(d => ({ code: d.code, message: ts.flattenDiagnosticMessageText(d.messageText, ' ') })),
    declaration: resolution?.resolvedFileName,
  };
}

function runtime(slug, symbol, dom, format) {
  // UI entry points run with a real jsdom custom-element registry. Pure libraries
  // run without DOM globals. Each probe has a separate process/registry.
  const jsdomAnchor = path.join(root, 'packages', 'button', 'package.json');
  const prelude = format === 'esm'
    ? "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);"
    : "const { createRequire } = require('node:module');";
  const environment = dom ? `
    const { JSDOM } = createRequire(${JSON.stringify(jsdomAnchor)})('jsdom');
    const window = new JSDOM('').window;
    for (const key of ['window', 'document', 'HTMLElement', 'customElements', 'CustomEvent', 'Element', 'Node']) globalThis[key] = window[key];
  ` : '';
  const name = `@skyra-tech-platform/${slug}`;
  const load = format === 'esm' ? `await import('${name}')` : `require('${name}')`;
  const exercise = {
    'data-export': "assert.equal(p.exportToCsv([{name:'Skyra'}], {columns:[{key:'name',header:'Name'}]}).includes('Skyra'), true);",
    'design-tokens': "assert.equal(p.tokens.primary, '#0A58CA');",
    'utils': "assert.equal(typeof p.simpleId(), 'string');",
    'validation': "assert.equal(p.emailSchema.safeParse('test@example.com').success, true);",
    'date-time': "assert.equal(p.toISODate(new Date(2026, 9, 14)), '2026-10-14');",
  }[slug] || '';
  const settle = slug === 'dynamic-form' ? `
    await Promise.all(['input', 'textarea', 'dynamic-select', 'checkbox', 'radio', 'switch', 'button', 'date-time']
      .map(name => import('@skyra-tech-platform/' + name)));
  ` : '';
  const body = `${environment}
    const assert = require('node:assert/strict');
    const p = ${load}; assert.notEqual(p.${symbol}, undefined, 'Missing public export');
    ${exercise}
    ${settle}
    assert.throws(() => require.resolve('${name}/__f05_nonexistent'), {code:'ERR_PACKAGE_PATH_NOT_EXPORTED'});
    ${dom ? 'window.close();' : ''}
  `;
  const code = `${prelude}\n(async () => {${body}})().catch(error => { console.error(error); process.exitCode = 1; });`;
  // Disable modern Node's syntax detection and require(ESM) conveniences so
  // ambiguous package metadata cannot silently pass on the local Node 24 host.
  const flags = ['--no-experimental-detect-module', '--no-experimental-require-module'];
  const result = spawnSync(process.execPath, [...flags, ...(format === 'esm' ? ['--input-type=module'] : []), '-e', code], {
    cwd: consumer, encoding: 'utf8', timeout: 20000,
  });
  assert.equal(result.status, 0, `${name} ${format}: ${result.error || result.stderr}`);
}

for (const [slug, symbol, dom] of cases) {
  try {
    const packageDir = path.join(root, 'packages', slug.split('/')[0]);
    const pkg = JSON.parse(fs.readFileSync(path.join(packageDir, 'package.json'), 'utf8'));
    const targets = [];
    const collect = value => typeof value === 'string' ? targets.push(value) : Object.values(value).forEach(collect);
    collect(pkg.exports);
    for (const target of targets) assert.ok(fs.existsSync(path.join(packageDir, target)), `Missing ${target}`);
    const declarations = {};
    for (const [mode, extension] of [['NodeNext', '.mts'], ['NodeNext', '.cts'], ['Bundler', '.mts']]) {
      const label = mode + extension;
      const result = compile(slug, symbol, mode, extension);
      assert.deepEqual(result.errors, [], `${slug} ${label}`);
      assert.ok(result.declaration && /\.d\.(ts|cts|mts)$/.test(result.declaration));
      declarations[label] = path.relative(root, result.declaration).replaceAll('\\', '/');
      for (const mutation of ['missing-target', 'missing-declarations']) {
        const broken = compile(slug, symbol, mode, extension, mutation);
        assert.ok(broken.errors.some(d => [2307, 7016].includes(d.code)), `${slug} ${label} failed to reject ${mutation}`);
      }
    }
    runtime(slug, symbol, dom, 'esm');
    runtime(slug, symbol, dom, 'cjs');
    console.log(JSON.stringify({ package: pkg.name, subpath: slug.includes('/') ? './web-component' : '.',
      exports: pkg.exports, targets: 'PASS', declarations, negativeTypeTests: 'PASS',
      esm: 'PASS', cjs: 'PASS', environment: dom ? 'jsdom' : 'node' }));
  } catch (error) {
    failures.push(slug);
    console.error(`FAIL ${slug}: ${error.stack}`);
  }
}
if (failures.length) { console.error(`Failed: ${failures.join(', ')}`); process.exitCode = 1; }
