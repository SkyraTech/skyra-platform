'use client';

import React from 'react';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { DocsHeader } from '@/components/docs/DocsHeader';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { Callout } from '@/components/docs/Callout';
import { HeadingAnchor } from '@/components/docs/HeadingAnchor';
import { Card } from '@/components/ui';

export default function GettingStartedPage() {
  const toc = [
    { id: 'overview', label: 'Platform Overview' },
    { id: 'installation', label: 'Installation' },
    { id: 'tokens', label: 'Design Tokens Setup' },
    { id: 'consumption', label: 'Consuming Components' },
    { id: 'ssr-hydration', label: 'SSR & Hydration' },
    { id: 'next-steps', label: 'Next Steps' },
  ];

  return (
    <DocsLayout toc={toc}>
      <DocsHeader 
        title="Getting Started with Skyra Platform"
        description="The authoritative developer guide for installing, configuring, and integrating Skyra Platform design tokens and Web Components into your applications."
        breadcrumbs={[
          { label: 'Developer Documentation', href: '/docs' },
          { label: 'Getting Started' }
        ]}
        badges={[
          { label: 'Guide', variant: 'tech' },
          { label: 'v0.1.0', variant: 'stable' }
        ]}
      />

      <HeadingAnchor id="overview">Platform Overview</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
        Skyra Platform is the centralized design system and reusable UI component foundation for all Skyra applications (such as Skyra LogHub, Skyra Business Suite, and Skyra Incident Service).
        All visual UI components are built as <strong>framework-agnostic native Web Components</strong>. This ensures zero vendor lock-in and seamless interoperability across React, Next.js, Angular, Vue, and vanilla HTML applications.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', margin: '1.5rem 0 2rem 0' }}>
        <Card style={{ padding: '1.25rem' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--skyra-primary)', fontWeight: 600 }}>Framework Neutral</h4>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--skyra-text-muted)', lineHeight: 1.5 }}>
            Native Custom Elements run directly in the browser DOM with Shadow DOM encapsulation.
          </p>
        </Card>
        <Card style={{ padding: '1.25rem' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--skyra-primary)', fontWeight: 600 }}>Design Token Foundation</h4>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--skyra-text-muted)', lineHeight: 1.5 }}>
            Synchronized CSS custom properties for colors, typography, elevations, radiuses, and light/dark modes.
          </p>
        </Card>
        <Card style={{ padding: '1.25rem' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--skyra-primary)', fontWeight: 600 }}>Enterprise Accessibility</h4>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--skyra-text-muted)', lineHeight: 1.5 }}>
            WAI-ARIA compliance, full keyboard navigation, roving tabindex, and automated axe-core test coverage.
          </p>
        </Card>
      </div>

      <HeadingAnchor id="installation">Installation</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7 }}>
        Install the design tokens package along with the components you need:
      </p>

      <CodeBlock 
        language="bash"
        code={`# Install core design tokens and foundational UI components
pnpm add @skyra-tech-platform/design-tokens @skyra-tech-platform/button @skyra-tech-platform/input @skyra-tech-platform/badge`}
      />

      <HeadingAnchor id="tokens">Design Tokens Setup</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7 }}>
        Import the platform tokens CSS file at the absolute root of your application before any component imports. In Next.js (App Router), add it to <code style={{ color: 'var(--skyra-primary)' }}>app/layout.tsx</code> or your global stylesheet:
      </p>

      <CodeBlock 
        language="tsx"
        code={`// app/layout.tsx
import '@skyra-tech-platform/design-tokens/tokens.css';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="skyra-app">{children}</body>
    </html>
  );
}`}
      />

      <Callout type="info" title="Theming & Dark Mode">
        Skyra tokens automatically support light and dark modes. Toggle dark mode by adding the <code style={{ color: 'var(--skyra-primary)' }}>dark</code> class or <code style={{ color: 'var(--skyra-primary)' }}>data-theme=&quot;dark&quot;</code> attribute to your root element:
        <br />
        <code style={{ fontSize: '0.85em', color: 'var(--skyra-primary)' }}>&lt;html class=&quot;dark&quot;&gt;</code>
      </Callout>

      <HeadingAnchor id="consumption">Consuming Components</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7 }}>
        Importing a component package automatically registers its custom element tag with the browser&apos;s <code style={{ color: 'var(--skyra-primary)' }}>customElements</code> registry:
      </p>

      <CodeBlock 
        language="tsx"
        code={`// In your React/Next.js client component or Vanilla script
'use client';

import '@skyra-tech-platform/button';
import '@skyra-tech-platform/badge';

export function UserHeader() {
  return (
    <header className="flex items-center justify-between p-4 bg-[var(--skyra-surface)] border-b border-[var(--skyra-border)]">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-[var(--skyra-text)]">Admin Console</h1>
        <skyra-tech-badge variant="success" dot>Live</skyra-tech-badge>
      </div>
      <skyra-tech-button variant="primary" onClick={() => alert('Saved!')}>
        Deploy Changes
      </skyra-tech-button>
    </header>
  );
}`}
      />

      <HeadingAnchor id="ssr-hydration">SSR &amp; Hydration Best Practices</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7 }}>
        Because Skyra Web Components execute in the browser DOM, ensure client-side rendering conventions are respected in SSR frameworks like Next.js:
      </p>

      <ul style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.8, paddingLeft: '1.25rem' }}>
        <li>Add <code style={{ color: 'var(--skyra-primary)' }}>&apos;use client&apos;;</code> at the top of React files rendering interactive custom elements.</li>
        <li>In TypeScript projects, declare custom element tag signatures in <code style={{ color: 'var(--skyra-primary)' }}>custom-elements.d.ts</code> so JSX compiler accepts them without errors.</li>
        <li>All Skyra Platform packages include built-in <code style={{ color: 'var(--skyra-primary)' }}>typeof HTMLElement !== &apos;undefined&apos;</code> guards, preventing server evaluation crashes during Node.js compilation.</li>
      </ul>

      <HeadingAnchor id="next-steps">Next Steps</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7 }}>
        Continue exploring the platform documentation:
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
        <a href="/docs/frameworks" style={{ textDecoration: 'none' }}>
          <Card style={{ padding: '1.25rem', height: '100%', border: '1px solid var(--skyra-border)' }}>
            <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--skyra-primary)' }}>Framework Guides &rarr;</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--skyra-text-muted)' }}>Detailed setup for React, Angular, Vue 3, and Svelte.</p>
          </Card>
        </a>
        <a href="/components" style={{ textDecoration: 'none' }}>
          <Card style={{ padding: '1.25rem', height: '100%', border: '1px solid var(--skyra-border)' }}>
            <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--skyra-primary)' }}>Component Catalog &rarr;</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--skyra-text-muted)' }}>Explore all 31 platform UI components with live interactive examples.</p>
          </Card>
        </a>
        <a href="/docs/contributing" style={{ textDecoration: 'none' }}>
          <Card style={{ padding: '1.25rem', height: '100%', border: '1px solid var(--skyra-border)' }}>
            <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--skyra-primary)' }}>Contribution Guide &rarr;</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--skyra-text-muted)' }}>Learn how to author and publish new Platform packages.</p>
          </Card>
        </a>
      </div>
    </DocsLayout>
  );
}

