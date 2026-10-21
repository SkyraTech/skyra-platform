import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import fs from 'node:fs';
import path from 'node:path';
import PdfViewerDocsPage from '../src/app/(dashboard)/docs/pdf-viewer/page';

const root = path.resolve(__dirname, '../..');
const routes = path.join(root, 'dashboard/src/app/(dashboard)');

test('dedicated PDF documentation renders all technical sections and the Workbench link', () => {
  const html = renderToStaticMarkup(<PdfViewerDocsPage />);
  for (const id of ['overview', 'installation', 'quick-start', 'configuration', 'events', 'methods', 'limitations', 'workbench']) {
    assert(html.includes(`id="${id}"`), id);
  }
  assert(html.includes('href="/pdf-viewer"'));
  assert(html.includes('Open Interactive Workbench'));
  assert(html.includes('@skyra-tech-platform/pdf-viewer'));
  assert(!html.includes('<skyra-tech-pdf-viewer'));
  assert(!html.includes('LIVE PDF VIEWER INSTANCE'));
});

test('documentation remains separate from the existing Workbench and package implementation', () => {
  const workbench = fs.readFileSync(path.join(routes, 'pdf-viewer/page.tsx'), 'utf8');
  assert(workbench.includes("import '@skyra-tech-platform/pdf-viewer'"));
  assert(workbench.includes('<skyra-tech-pdf-viewer'));
  const docs = fs.readFileSync(path.join(routes, 'docs/pdf-viewer/page.tsx'), 'utf8');
  assert(!docs.includes('redirect('));
  assert(!docs.includes('customElements.define'));
  assert(!fs.readFileSync(path.join(root, 'dashboard/next.config.ts'), 'utf8').includes("source: '/docs/pdf-viewer'"));
});

test('Playground retains the Workbench destination and uses the canonical documentation link', () => {
  const playground = fs.readFileSync(path.join(routes, 'ui-components/page.tsx'), 'utf8');
  const pdf = playground.slice(playground.indexOf("id: 'pdf-viewer'"), playground.indexOf("id: 'pdf-viewer'") + 550);
  assert(pdf.includes("docsHref: '/docs/pdf-viewer'"));
  assert(pdf.includes("showcaseHref: '/pdf-viewer'"));
});
