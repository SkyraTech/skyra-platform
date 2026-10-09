'use client';

import React from 'react';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { PackageMeta } from '@/components/docs/PackageMeta';
import { DocsHeader } from '@/components/docs/DocsHeader';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { CodeTabs } from '@/components/docs/CodeTabs';
import { Callout } from '@/components/docs/Callout';
import { HeadingAnchor } from '@/components/docs/HeadingAnchor';
import { LiveExample } from '@/components/docs/LiveExample';
import { FrameworkSupport } from '@/components/docs/FrameworkSupport';
import { InstallCommand } from '@/components/docs/InstallCommand';
import { AccessibilityPanel } from '@/components/docs/AccessibilityPanel';

const TOC = [
  { id: 'overview',       label: 'Overview' },
  { id: 'installation',   label: 'Installation' },
  { id: 'basic-usage',    label: 'Basic Usage' },
  { id: 'slots',          label: 'Slots & Composition' },
  { id: 'properties',     label: 'Properties & Attributes' },
  { id: 'events',         label: 'Events' },
  { id: 'styling',        label: 'Styling & Themes' },
  { id: 'accessibility',  label: 'Accessibility' },
  { id: 'ssr',            label: 'SSR & Frameworks' }
];

const API_TABLE_STYLE: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '0.8125rem',
  marginTop: '1rem',
};

const TH_STYLE: React.CSSProperties = {
  textAlign: 'left',
  padding: '0.625rem 1rem',
  color: 'var(--skyra-text-muted)',
  fontFamily: 'var(--skyra-font-body)',
  fontWeight: 600,
  fontSize: '0.75rem',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  background: 'var(--skyra-bg-muted)',
  borderBottom: '1px solid var(--skyra-border)',
};

const TD_STYLE: React.CSSProperties = {
  padding: '0.625rem 1rem',
  borderBottom: '1px solid var(--skyra-border)',
  color: 'var(--skyra-text-muted)',
  verticalAlign: 'top',
};

const CODE_STYLE: React.CSSProperties = {
  fontFamily: 'var(--skyra-font-mono)',
  color: 'var(--skyra-text)',
  fontSize: '0.8125rem',
};

function ApiTable({ headers, rows }: { headers: string[], rows: (string | React.ReactNode)[][] }) {
  return (
    <div style={{ overflowX: 'auto', borderRadius: 'var(--skyra-radius-md)', border: '1px solid var(--skyra-border)' }}>
      <table style={API_TABLE_STYLE}>
        <thead>
          <tr>
            {headers.map(h => <th key={h} style={TH_STYLE}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'var(--skyra-surface)' : 'var(--skyra-bg-muted)' }}>
              {row.map((cell, j) => (
                <td key={j} style={{ ...TD_STYLE, fontFamily: j === 0 || j === 1 ? 'var(--skyra-font-mono)' : 'var(--skyra-font-body)' }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AppShellDocsPage() {
  return (
    <DocsLayout toc={TOC}>
      <DocsHeader
        title="App Shell"
        description="Framework-agnostic Web Component for application layout. Provides responsive sidebar, header, and content regions using Shadow DOM encapsulation."
        breadcrumbs={[
          { label: 'Components', href: '/components' },
          { label: 'Layout' },
          { label: 'App Shell' },
        ]}
        badges={[
          { label: 'stable', variant: 'stable' },
          { label: 'runtime-neutral', variant: 'tech' },
          { label: 'web-component', variant: 'tech' },
        ]}
      />

      <PackageMeta
        packageName="@skyra-tech-platform/app-shell"
        type="Web Component"
        version="0.1.0"
      />

      <section id="overview" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="overview" level={2}>Overview</HeadingAnchor>
        <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
          The App Shell is a native HTML Custom Element (<code>&lt;skyra-tech-app-shell&gt;</code>) that defines the structural scaffold of a dashboard or web application.
          It manages the complex responsive interactions between a sticky header, a collapsible desktop sidebar, and an off-canvas mobile drawer—leaving you to simply provide the slotted content.
        </p>
        <Callout type="warning" title="No React Dependency">
          This component has been entirely rewritten from legacy React constraints. It is now a pure Web Component utilizing Shadow DOM, making it 100% framework-agnostic.
        </Callout>
      </section>

      <section id="installation" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="installation" level={2}>Installation</HeadingAnchor>
        <InstallCommand packageName="@skyra-tech-platform/app-shell" />
      </section>

      <section id="basic-usage" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="basic-usage" level={2}>Basic Usage</HeadingAnchor>
        <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
          Import the registration function and execute it in the browser. Then use the <code>&lt;skyra-tech-app-shell&gt;</code> element directly in your HTML or JSX.
        </p>
        
        <CodeTabs tabs={[
          {
            label: 'React/Next.js',
            language: 'tsx',
            code: `import { registerAppShell } from '@skyra-tech-platform/app-shell';
import '@skyra-tech-platform/app-shell/styles.css';

// Ensure this only runs on the client
if (typeof window !== 'undefined') {
  registerAppShell();
}

export default function Layout({ children }) {
  return (
    <skyra-tech-app-shell>
      <div slot="header">My Application Header</div>
      <nav slot="sidebar">My Sidebar Links</nav>
      <main>{children}</main>
    </skyra-tech-app-shell>
  );
}`
          },
          {
            label: 'Vanilla HTML/JS',
            language: 'html',
            code: `<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="node_modules/@skyra-tech-platform/app-shell/dist/styles.css">
  <script type="module">
    import { registerAppShell } from './node_modules/@skyra-tech-platform/app-shell/dist/index.js';
    registerAppShell();
  </script>
</head>
<body>
  <skyra-tech-app-shell>
    <div slot="header">My Application Header</div>
    <nav slot="sidebar">My Sidebar Links</nav>
    <main>Main Application Content</main>
  </skyra-tech-app-shell>
</body>
</html>`
          }
        ]} />
      </section>

      <section id="slots" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="slots" level={2}>Slots & Composition</HeadingAnchor>
        <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
          The App Shell utilizes Shadow DOM <code>&lt;slot&gt;</code> elements to project your Light DOM markup into the application regions.
        </p>
        <ApiTable 
          headers={['Slot Name', 'Description']} 
          rows={[
            ['sidebar', 'Content for the left sidebar. On desktop, this is a fixed column. On mobile, it acts as an off-canvas drawer.'],
            ['header', 'Content for the top sticky header. Typically contains a sidebar toggle button and user profile.'],
            ['default (no name)', 'The main application content area. Takes up remaining viewport space.']
          ]} 
        />
      </section>

      <section id="properties" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="properties" level={2}>Properties & Attributes</HeadingAnchor>
        <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
          State is synchronized between DOM Attributes and JavaScript Properties.
        </p>
        <ApiTable 
          headers={['Property / Attribute', 'Type', 'Default', 'Description']} 
          rows={[
            ['collapsed', 'boolean', 'false', 'Controls whether the desktop sidebar is visually collapsed (slim mode).'],
            ['mobileOpen', 'boolean', 'false', 'Controls whether the mobile off-canvas drawer is currently visible.']
          ]} 
        />
        
        <CodeBlock language="typescript" code={`// JavaScript interaction
const shell = document.querySelector('skyra-tech-app-shell');

// Toggle properties
shell.collapsed = true;
shell.mobileOpen = false;

// Call methods
shell.toggle(); // Toggles collapsed on desktop, mobileOpen on mobile
`} />
      </section>

      <section id="events" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="events" level={2}>Events</HeadingAnchor>
        <ApiTable 
          headers={['Event Name', 'Detail', 'Description']} 
          rows={[
            ['skyra-sidebar-toggle', '{ collapsed: boolean, isMobile: boolean }', 'Fired whenever the sidebar state changes (user interaction or API call).']
          ]} 
        />
      </section>

      <section id="styling" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="styling" level={2}>Styling & Themes</HeadingAnchor>
        <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
          The web component provides <code>styles.css</code>, which includes classes to style your slotted content to match the platform aesthetics. 
          Use <code>.skyra-sidebar-item</code>, <code>.skyra-sidebar-item-icon</code>, and <code>.skyra-sidebar-item-label</code> inside the sidebar slot. 
          The component will automatically hide elements containing <code>.skyra-sidebar-item-label</code> when the shell is in the <code>collapsed</code> state.
        </p>
        <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
          It natively supports light/dark mode by consuming the CSS Custom Properties emitted by <code>@skyra-tech-platform/design-tokens</code>.
        </p>
      </section>

      <section id="accessibility" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="accessibility" level={2}>Accessibility</HeadingAnchor>
        <AccessibilityPanel features={[
          'Mobile drawer is constructed as an accessible modal overlay with ARIA attributes.',
          'Focus is trapped inside the mobile drawer when opened.',
          'Escape key successfully closes the mobile drawer.',
          'Backdrop clicks close the mobile drawer.',
          'Focus is restored to the toggle trigger upon closing.'
        ]} />
      </section>

      <section id="ssr" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="ssr" level={2}>SSR & Frameworks</HeadingAnchor>
        <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
          The module safely guards <code>window</code> and <code>customElements</code> interactions. To use in Next.js App Router, 
          declare the component as a Client Component, or wrap the registration call in a <code>typeof window !== 'undefined'</code> check.
        </p>
        <FrameworkSupport frameworks={[
          {
            name: 'React / Next.js',
            support: 'e2e',
            integration: 'Full native support via custom element wrapper (e.g. <skyra-tech-app-shell>). Safe for Next.js App Router (Client Components).'
          },
          {
            name: 'Vanilla JS / Web',
            support: 'e2e',
            integration: 'Native custom element support. Use DOM APIs to query and set properties or listen to events.'
          }
        ]} />
      </section>

    </DocsLayout>
  );
}
