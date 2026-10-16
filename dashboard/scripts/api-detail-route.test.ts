import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { createRequire } from 'node:module';

// Execute the route's actual handlers without loading unrelated UI modules.
const file = path.resolve('dashboard/src/app/(dashboard)/packages/[slug]/[capability]/[api]/page.tsx');
const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
function handler(name: string, registry: object, notFound = () => { throw new Error('NOT_FOUND'); }) {
  const declaration = source.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === name);
  assert.ok(declaration);
  const code = ts.transpileModule(declaration.getText(source), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const exports: Record<string, Function> = {};
  new Function('exports', 'docsRegistry', 'notFound', 'require', code)(exports, registry, notFound, createRequire(path.resolve('dashboard/package.json')));
  return exports[name] || exports.default;
}

test('metadata awaits promised route parameters and preserves API title', async () => {
  const calls: string[][] = [];
  const metadata = handler('generateMetadata', { findApiForRoute: (...args: string[]) => { calls.push(args); return { name: 'SkyraDialog' }; } });
  assert.deepEqual(await metadata({ params: Promise.resolve({ slug: 'dialog', capability: 'core', api: 'SkyraDialog' }) }), { title: 'SkyraDialog — Skyra Platform' });
  assert.deepEqual(calls, [['dialog', 'core', 'SkyraDialog']]);
});

test('missing API metadata keeps the existing fallback title', async () => {
  const metadata = handler('generateMetadata', { findApiForRoute: () => undefined });
  assert.deepEqual(await metadata({ params: Promise.resolve({ slug: 'missing', capability: 'core', api: 'absent' }) }), { title: 'API Not Found' });
});

test('page awaits promised parameters and preserves not-found handling', async () => {
  const calls: string[][] = [];
  const page = handler('ApiDetailPage', {
    findApiForRoute: (...args: string[]) => { calls.push(args); return undefined; },
    getCapability: () => undefined, getPackage: () => undefined, getExamplesForApi: () => [],
  });
  await assert.rejects(page({ params: Promise.resolve({ slug: 'missing', capability: 'core', api: 'absent' }) }), /NOT_FOUND/);
  assert.deepEqual(calls, [['missing', 'core', 'absent']]);
});
