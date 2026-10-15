import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { Project, SyntaxKind } from 'ts-morph';

const root = path.resolve(__dirname, '../..');
const routes = path.join(root, 'dashboard/src/app/(dashboard)');
const project = new Project({ useInMemoryFileSystem: true });
const page = project.createSourceFile('page.tsx', fs.readFileSync(path.join(routes, 'ui-components/page.tsx'), 'utf8'));
const items = page.getVariableDeclarationOrThrow('CATALOGUE_ITEMS').getInitializerIfKindOrThrow(SyntaxKind.ArrayLiteralExpression)
  .getElements().map(node => {
    const object = node.asKindOrThrow(SyntaxKind.ObjectLiteralExpression);
    const value = (key: string) => object.getProperty(key)?.asKindOrThrow(SyntaxKind.PropertyAssignment)
      .getInitializerIfKindOrThrow(SyntaxKind.StringLiteral).getLiteralValue();
    return { id: value('id'), type: value('type'), showcase: value('showcaseHref'), docs: value('docsHref') };
  });

test('single card registry contains only functional categories and required destinations', () => {
  assert.equal(items.length, 26);
  assert.equal(new Set(items.map(item => item.id)).size, items.length);
  assert.equal(items.filter(item => item.type === 'interactive').length, 22);
  assert.equal(items.filter(item => item.type === 'workbench').length, 4);
  for (const item of items) {
    assert(['interactive', 'workbench'].includes(item.type!));
    assert(item.showcase?.startsWith('/'));
    const relative = item.showcase!.startsWith('/ui-components/')
      ? 'ui-components/(details)/' + item.showcase!.split('/').pop() : item.showcase!.slice(1);
    assert(fs.existsSync(path.join(routes, relative, 'page.tsx')), item.id);
  }
});

test('six formerly documentation-only cards keep Docs and reach new routes without redirects', () => {
  const config = fs.readFileSync(path.join(root, 'dashboard/next.config.ts'), 'utf8');
  for (const id of ['collapsible', 'popover', 'dropdown-menu', 'context-menu', 'command-palette', 'date-time']) {
    const item = items.find(item => item.id === id)!;
    assert.equal(item.showcase, '/ui-components/' + id);
    assert(item.docs);
    assert(fs.existsSync(path.join(routes, item.docs!.slice(1), 'page.tsx')));
    assert(!config.includes(`source: '${item.showcase}'`));
  }
});

test('inert Print Studio card is absent while its independent route is retained', () => {
  assert(!items.some(item => item.id === 'print-studio'));
  assert(fs.existsSync(path.join(routes, 'print/page.tsx')));
  assert(!page.getFullText().includes("label: `Documentation"));
  assert(!page.getFullText().includes('card-showcase-btn card-action-disabled'));
});
