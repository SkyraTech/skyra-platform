'use client';

import React from 'react';
import Link from 'next/link';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { DocsHeader } from '@/components/docs/DocsHeader';
import { PackageMeta } from '@/components/docs/PackageMeta';
import { HeadingAnchor } from '@/components/docs/HeadingAnchor';
import { CodeBlock } from '@/components/docs/CodeBlock';

const TOC = [
  { id: 'overview', label: 'Overview' },
  { id: 'installation', label: 'Installation and imports' },
  { id: 'quick-start', label: 'Quick start' },
  { id: 'configuration', label: 'Properties and configuration' },
  { id: 'events', label: 'Events and lifecycle' },
  { id: 'methods', label: 'Public methods' },
  { id: 'limitations', label: 'Accessibility and limitations' },
  { id: 'workbench', label: 'Interactive Workbench' },
];

const properties = [
  ['src', 'src', 'URL string as an attribute; JavaScript property also accepts Blob, ArrayBuffer or undefined. Set after connection to avoid overlapping initial loads.'],
  ['docTitle', 'title', 'Document label; defaults to Document Preview. docTitle reflects to title.'],
  ['currentPage', 'initial-page', 'One-based page. currentPage accepts only pages within the loaded document; initial-page seeds loading and is clamped after load.'],
  ['zoom', 'initial-zoom', 'Percentage, default 100. zoom and setZoom clamp to 50–300; initial-zoom is parsed directly before load.'],
  ['rotation', '—', 'Rotation in degrees modulo 360; rotate() adds 90 degrees.'],
  ['—', 'worker-src', 'PDF.js module-worker URL. Configure before setting src; changes affect global PDF.js worker configuration.'],
];
const events = [
  ['skyra-load-start', 'none', 'A nonempty source starts loading.'],
  ['skyra-document-loaded', '{ totalPages: number }', 'The document has loaded; page rendering may still be pending.'],
  ['skyra-render-complete', '{ page: number }', 'The current main page render completes.'],
  ['skyra-error', 'string', 'Document loading fails with a non-cancellation error. Render errors may instead appear in the viewer.'],
  ['skyra-page-change', 'number', 'A valid, different currentPage is assigned.'],
  ['skyra-zoom-change', 'number', 'The clamped zoom percentage changes.'],
  ['skyra-print / skyra-download', 'none', 'The corresponding method is invoked, before the browser action; not proof of completion.'],
];

function ReferenceTable({ headings, rows }: { headings: string[]; rows: string[][] }) {
  return <div style={{ overflowX: 'auto', margin: '1rem 0', border: '1px solid var(--skyra-border)', borderRadius: 'var(--skyra-radius-md)' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
      <thead><tr>{headings.map(text => <th key={text} scope="col" style={{ padding: '0.75rem', background: 'var(--skyra-bg-muted)' }}>{text}</th>)}</tr></thead>
      <tbody>{rows.map(row => <tr key={row[0]}>{row.map((text, index) => <td key={index} style={{ padding: '0.75rem', verticalAlign: 'top', borderTop: '1px solid var(--skyra-border)' }}>{text}</td>)}</tr>)}</tbody>
    </table>
  </div>;
}

export default function PdfViewerDocsPage() {
  return <div className="pdf-viewer-docs">
    <style>{`
      .pdf-viewer-docs { overflow-wrap: anywhere; }
      @media (max-width: 900px) {
        .pdf-viewer-docs > div > div:last-child { flex-direction: column !important; padding: 1rem !important; gap: 1rem !important; }
        .pdf-viewer-docs > div > div:last-child > div:first-child { width: 100%; }
        .pdf-viewer-docs .docs-toc { display: none !important; }
      }
    `}</style>
    <DocsLayout toc={TOC}>
    <DocsHeader title="PDF Viewer" description="Technical documentation for the framework-independent PDF.js canvas viewer. The interactive Workbench is available separately."
      breadcrumbs={[{ label: 'Components', href: '/components' }, { label: 'PDF Viewer documentation' }]}
      badges={[{ label: 'stable', variant: 'stable' }, { label: 'Web Component', variant: 'tech' }]} />
    <PackageMeta packageName="@skyra-tech-platform/pdf-viewer" version="0.1.0" type="Web Component / PDF.js" />
    <div style={{ color: 'var(--skyra-text)', lineHeight: 1.7 }}>
      <section><HeadingAnchor id="overview">Overview</HeadingAnchor>
        <p>Render PDF documents for invoice previews, contracts and reports using a reusable custom element with its own Shadow DOM toolbar, page canvas and thumbnails. The package handles document viewing, not PDF generation or editing.</p>
        <p>This page documents the package API. The Dashboard Workbench demonstrates that same component with a sample document; it is not a separate implementation.</p>
        <Link href="/pdf-viewer">Open Interactive Workbench</Link>
      </section>
      <section><HeadingAnchor id="installation">Installation and imports</HeadingAnchor>
        <CodeBlock language="bash" code="pnpm add @skyra-tech-platform/pdf-viewer" />
        <p>This is the declared package installation command; external registry installation has not been verified here. The package declares pdfjs-dist 4.4.168 as a dependency and declares no peers.</p>
        <CodeBlock language="typescript" code={`import '@skyra-tech-platform/pdf-viewer';
// The only named public export:
import { SkyraPdfViewerElement } from '@skyra-tech-platform/pdf-viewer';`} />
        <p>The root entry provides ESM, CommonJS and TypeScript declarations. Importing it in a browser automatically registers <code>skyra-tech-pdf-viewer</code> if the tag is not already defined. No separate registration helper, stylesheet subpath or public options/event-detail type is exported. Load the module in the browser; SSR evaluation alone does not register a browser element.</p>
      </section>
      <section><HeadingAnchor id="quick-start">Quick start</HeadingAnchor>
        <p>Browser TypeScript example for an application bundled with the installed package. Serve a real PDF and a matching PDF.js 4.4.168 worker from the asset URLs below; these paths are application-owned examples, not files supplied by this package.</p>
        <CodeBlock language="typescript" code={`import { SkyraPdfViewerElement } from '@skyra-tech-platform/pdf-viewer';

const viewer = document.createElement('skyra-tech-pdf-viewer') as SkyraPdfViewerElement;
viewer.setAttribute('title', 'Contract');
viewer.setAttribute('worker-src', '/assets/pdf.worker.min.mjs');
viewer.setAttribute('initial-page', '1');
viewer.setAttribute('initial-zoom', '100');
document.body.append(viewer);
// Set source after connection, rather than starting a load before mounting.
viewer.src = '/documents/contract.pdf';`} />
        <p>Copy the module worker from the matching pdfjs-dist build into your application's public assets. Without explicit configuration, the component uses a versioned unpkg worker URL when PDF.js has no worker configured. Network access, CORS and Content Security Policy must permit both the document and worker. For private documents, use a Blob or ArrayBuffer property; this component exposes no request-header options.</p>
      </section>
      <section><HeadingAnchor id="configuration">Properties and configuration</HeadingAnchor>
        <ReferenceTable headings={['JavaScript property', 'HTML attribute', 'Behavior']} rows={properties} />
        <p>Use kebab-case initial-page and initial-zoom attributes, not React-style initialPage or initialZoom attributes. The page count comes from the loaded PDF; totalPages is not a supported configuration input. Thumbnails are controlled by the toolbar and responsive viewport behavior, not a public visibility property. Width defaults to 100% and host height to 520px; applications can style the host.</p>
        <CodeBlock language="typescript" code={`// After skyra-document-loaded:
viewer.goToPage(2); // Only if the document has at least two pages.
viewer.setZoom(125);
viewer.rotate();
viewer.fitWidth(); // Estimates fit using an A4-width reference.
// Alternative binary source:
// viewer.src = pdfBlob; // Blob, or an ArrayBuffer`} />
      </section>
      <section><HeadingAnchor id="events">Events and lifecycle</HeadingAnchor>
        <ReferenceTable headings={['Event name', 'event.detail', 'Dispatch condition']} rows={events} />
        <p>Listen directly on the element: these CustomEvents use default non-bubbling, non-composed behavior. Subscribe before setting src. On disconnect the element cancels loading/rendering and removes its global listeners.</p>
        <CodeBlock language="typescript" code={`const onLoaded = (event: Event) => {
  console.log((event as CustomEvent<{ totalPages: number }>).detail.totalPages);
};
const onError = (event: Event) => console.error((event as CustomEvent<string>).detail);
viewer.addEventListener('skyra-document-loaded', onLoaded);
viewer.addEventListener('skyra-error', onError);
// On application teardown:
viewer.removeEventListener('skyra-document-loaded', onLoaded);
viewer.removeEventListener('skyra-error', onError);
viewer.remove();`} />
      </section>
      <section><HeadingAnchor id="methods">Public methods</HeadingAnchor>
        <p><code>nextPage()</code>, <code>previousPage()</code> and <code>goToPage(number)</code> navigate within the document. <code>zoomIn()</code> and <code>zoomOut()</code> step by 25; <code>setZoom(number)</code> uses percentage values. <code>rotate()</code>, <code>fitWidth()</code> and <code>toggleFullscreen()</code> correspond to toolbar actions.</p>
        <CodeBlock language="typescript" code={`// Invoke from your own user-activated controls:
printButton.addEventListener('click', () => { void viewer.print(); });
downloadButton.addEventListener('click', () => { void viewer.download(); });`} />
        <p>The asynchronous print() method opens the source in a hidden iframe and requests browser printing after load. download() creates a temporary anchor for the source. Browser permissions, cross-origin behavior and user activation can limit these actions; their events do not confirm successful printing or downloading.</p>
      </section>
      <section><HeadingAnchor id="limitations">Accessibility, responsive behavior and limitations</HeadingAnchor>
        <p>The host defaults to a focusable region with an aria-label; toolbar buttons have accessible labels. While focused, ArrowRight/PageDown and ArrowLeft/PageUp navigate; + or = zoom in, and − (the minus key) zooms out. Fullscreen uses the browser Fullscreen API when available.</p>
        <p>Styles consume Skyra theme variables. The toolbar wraps; the thumbnail sidebar starts open at viewport widths of at least 1024px and uses an overlay layout below 768px. Verify space and keyboard operation in your application.</p>
        <p>No source shows a skeleton preview; loading shows a progress message; load/render failures show an error. Canvas rendering does not provide a selectable text layer, screen-reader document text or annotation editing. These UI semantics are not a claim of complete PDF accessibility or universal browser compatibility.</p>
        <p>A destroyed-worker error can result from interrupted or overlapping loading. Keep the viewer connected while loading and configure the worker before assigning src. Repeated source changes and framework remounts require application testing.</p>
      </section>
      <section><HeadingAnchor id="workbench">Interactive Workbench</HeadingAnchor>
        <p>Try the existing sample document and toolbar without leaving the documentation route as your reference.</p>
        <Link href="/pdf-viewer">Open Interactive Workbench</Link>
      </section>
    </div>
    </DocsLayout>
  </div>;
}
