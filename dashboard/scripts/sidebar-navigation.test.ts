import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import { Project, SyntaxKind, type ObjectLiteralExpression } from 'ts-morph';

const routes = path.resolve(__dirname, '../src/app/(dashboard)');
const project = new Project({ useInMemoryFileSystem: true });
const layout = project.createSourceFile('layout.tsx', fs.readFileSync(path.join(routes, 'layout.tsx'), 'utf8'));
const textProperty = (object: ObjectLiteralExpression, key: string) => object.getPropertyOrThrow(key)
  .asKindOrThrow(SyntaxKind.PropertyAssignment).getInitializerIfKindOrThrow(SyntaxKind.StringLiteral).getLiteralValue();
const sections = layout.getVariableDeclarationOrThrow('NAV_SECTIONS').getInitializerIfKindOrThrow(SyntaxKind.ArrayLiteralExpression)
  .getElements().map(node => {
    const section = node.asKindOrThrow(SyntaxKind.ObjectLiteralExpression);
    return {
      id: textProperty(section, 'id'), title: textProperty(section, 'title'),
      items: section.getPropertyOrThrow('items').asKindOrThrow(SyntaxKind.PropertyAssignment)
        .getInitializerIfKindOrThrow(SyntaxKind.ArrayLiteralExpression).getElements().map(item => {
          const object = item.asKindOrThrow(SyntaxKind.ObjectLiteralExpression);
          return { href: textProperty(object, 'href'), label: textProperty(object, 'label') };
        }),
    };
  });
const items = sections.flatMap(section => section.items);
const activeSource = layout.getDescendantsOfKind(SyntaxKind.VariableDeclaration)
  .find(node => node.getName() === 'isItemActive')!.getInitializerOrThrow().getText();
const activeCode = ts.transpileModule(`const active = ${activeSource}; active;`, {
  compilerOptions: { target: ts.ScriptTarget.ES2022 },
}).outputText;
const activeFor = (pathname: string) => vm.runInNewContext(activeCode, { pathname }) as (href: string) => boolean;

test('sidebar keeps distinct destinations in the four established groups', () => {
  assert.deepEqual(sections.map(section => section.title), ['Platform', 'Developer Documentation', 'Playground & Workbenches', 'Quality Tools']);
  assert.equal(items.length, 12);
  assert.equal(new Set(items.map(item => item.href)).size, items.length);
  assert.deepEqual(sections.find(section => section.id === 'platform')!.items.map(item => item.href), ['/overview', '/packages', '/releases']);
  assert.deepEqual(sections.find(section => section.id === 'playgrounds-workbenches')!.items.map(item => item.href), ['/ui-components']);
  assert.deepEqual(sections.find(section => section.id === 'quality-tools')!.items.map(item => item.href), ['/accessibility', '/responsive']);
  for (const item of items) assert(fs.existsSync(path.join(routes, item.href.slice(1), 'page.tsx')), item.href);
});

test('independent package references retain routes with unambiguous sidebar labels', () => {
  const docs = sections.find(section => section.id === 'documentation')!.items;
  assert.deepEqual(docs, [
    { href: '/components', label: 'Components' },
    { href: '/design-system', label: 'Design System' },
    { href: '/docs/design-tokens', label: 'Design Tokens' },
    { href: '/docs/utils', label: 'Utility Functions' },
    { href: '/docs/validation', label: 'Validation Schemas' },
    { href: '/docs/data-export', label: 'Data Export Docs' },
  ]);
  const helpers = fs.readFileSync(path.join(routes, 'docs/utils/page.tsx'), 'utf8');
  assert(helpers.includes('formatCurrency') && helpers.includes('@skyra-tech-platform/utils'));
  assert(fs.readFileSync(path.join(routes, 'docs/validation/page.tsx'), 'utf8').includes('Zod'));
  assert(fs.readFileSync(path.join(routes, 'docs/data-export/page.tsx'), 'utf8').includes('CSV'));
});

test('actual active-route matcher distinguishes docs, component categories and workbenches', () => {
  const cases: [string, string | undefined][] = [
    ['/components', '/components'], ['/components/utilities/qr', '/components'],
    ['/components/forms/dynamic-form', '/components'], ['/docs/utils', '/docs/utils'],
    ['/docs/utils/currency', '/docs/utils'], ['/docs/utils-extra', undefined],
    ['/docs/validation', '/docs/validation'], ['/docs/validation/common', '/docs/validation'],
    ['/docs/data-export/csv', '/docs/data-export'], ['/design-system/colors', '/design-system'],
    ['/docs/design-tokens/css', '/docs/design-tokens'], ['/packages/utils', '/packages'],
    ['/ui-components/popover', '/ui-components'], ['/qr-code', '/ui-components'],
    ['/export', '/ui-components'], ['/accessibility', '/accessibility'], ['/responsive', '/responsive'],
    ['/overview-extra', undefined],
  ];
  for (const [pathname, expected] of cases) {
    assert.deepEqual(items.filter(item => activeFor(pathname)(item.href)).map(item => item.href), expected ? [expected] : [], pathname);
  }
});
