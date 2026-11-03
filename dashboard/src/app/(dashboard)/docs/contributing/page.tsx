'use client';

import React from 'react';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { DocsHeader } from '@/components/docs/DocsHeader';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { Callout } from '@/components/docs/Callout';
import { HeadingAnchor } from '@/components/docs/HeadingAnchor';
import { Card } from '@/components/ui';

export default function ContributingPage() {
  const toc = [
    { id: 'standards', label: 'Architecture Standards' },
    { id: 'package-structure', label: 'Package Structure' },
    { id: 'ssr-rule', label: 'SSR Safety Requirement' },
    { id: 'testing-a11y', label: 'Testing & Accessibility' },
    { id: 'catalog-sync', label: 'API Catalog Sync' },
    { id: 'releases', label: 'Changesets & Releases' },
  ];

  return (
    <DocsLayout toc={toc}>
      <DocsHeader 
        title="Component Contribution & Engineering Standards"
        description="The architectural guidelines, safety requirements, testing standards, and catalog registration process for contributing to Skyra Platform."
        breadcrumbs={[
          { label: 'Developer Documentation', href: '/docs' },
          { label: 'Contribution Guide' }
        ]}
        badges={[
          { label: 'P0 Standard', variant: 'stable' },
          { label: 'Web Components', variant: 'tech' }
        ]}
      />

      <HeadingAnchor id="standards">Architecture Standards</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7 }}>
        Skyra Platform is the single source of truth for all reusable UI across the Skyra ecosystem. All contributions must adhere to these foundational rules:
      </p>

      <ul style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.8, paddingLeft: '1.25rem' }}>
        <li><strong>Reusable Web Components:</strong> All UI elements must be implemented as native Custom Elements in <code style={{ color: 'var(--skyra-primary)' }}>packages/*</code>, never as dashboard-only React mocks.</li>
        <li><strong>Strict Token Usage:</strong> Do not introduce hardcoded hex colors or arbitrary px dimensions. Always consume official tokens from <code style={{ color: 'var(--skyra-primary)' }}>@skyra-tech-platform/design-tokens</code>.</li>
        <li><strong>No Breaking Regressions:</strong> Existing consumers like Skyra LogHub must continue to function without API or attribute incompatibilities.</li>
      </ul>

      <HeadingAnchor id="package-structure">Standard Package Structure</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7 }}>
        Every package in <code style={{ color: 'var(--skyra-primary)' }}>packages/&lt;name&gt;</code> contains:
      </p>

      <CodeBlock 
        language="text"
        code={`packages/my-component/
├── package.json          # Authoritative manifest, version, exports, and dependencies
├── tsconfig.json         # TypeScript configuration
├── tsup.config.ts        # Fast dual ESM/CJS build and .d.ts bundling
└── src/
    ├── index.ts          # Public exports, define function, and global HTMLElementTagNameMap
    ├── my-component.ts   # Custom element implementation with BaseClass SSR guard
    ├── my-component.css.ts # Scoped component CSS styles
    └── my-component.test.ts # Vitest unit and axe-core accessibility test suite`}
      />

      <HeadingAnchor id="ssr-rule">Mandatory SSR Safety Requirement (P0)</HeadingAnchor>
      <Callout type="warning" title="Never Extend HTMLElement Directly">
        Node.js does not have a global <code style={{ color: 'var(--skyra-primary)' }}>HTMLElement</code>. Extending <code style={{ color: 'var(--skyra-primary)' }}>HTMLElement</code> at module top-level causes catastrophic <code style={{ color: 'var(--skyra-primary)' }}>ReferenceError: HTMLElement is not defined</code> crashes in Next.js Turbopack SSR.
      </Callout>

      <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7, marginTop: '1rem' }}>
        Always use the conditional BaseClass pattern in every custom element file:
      </p>

      <CodeBlock 
        language="typescript"
        code={`// Safe BaseClass pattern for all Skyra Platform custom elements:
const BaseClass = typeof HTMLElement !== 'undefined' ? HTMLElement : (class {} as typeof HTMLElement);

export class SkyraTechMyComponent extends BaseClass {
  constructor() {
    super();
    // Guard DOM construction if evaluated in SSR
    if (typeof HTMLElement !== 'undefined') {
      this.attachShadow({ mode: 'open' });
      // build shadow DOM...
    }
  }
}

export function defineSkyraTechMyComponent(): void {
  if (typeof customElements !== 'undefined' && !customElements.get('skyra-tech-my-component')) {
    customElements.define('skyra-tech-my-component', SkyraTechMyComponent);
  }
}`}
      />

      <HeadingAnchor id="testing-a11y">Testing &amp; Accessibility</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7 }}>
        All packages run Vitest unit tests and automated axe-core audits:
      </p>

      <CodeBlock 
        language="typescript"
        code={`// packages/my-component/src/my-component.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import './index';

describe('SkyraTechMyComponent', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders without accessibility violations', async () => {
    const el = document.createElement('skyra-tech-my-component');
    document.body.appendChild(el);
    const results = await axe(el);
    expect(results).toHaveNoViolations();
  });
});`}
      />

      <HeadingAnchor id="catalog-sync">API Catalog Synchronization</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7 }}>
        Whenever public exports or new components are added, update the machine-extracted catalog:
      </p>

      <CodeBlock 
        language="bash"
        code={`# 1. Build the updated package
pnpm --filter @skyra-tech-platform/my-component build

# 2. Extract types and synchronize API signatures in dashboard
pnpm --filter dashboard catalog:extract

# 3. Verify consistency and test catalog integrity
pnpm --filter dashboard catalog:check`}
      />

      <HeadingAnchor id="releases">Changesets &amp; Releases</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7 }}>
        Skyra Platform uses Changesets for version control and automated release logs. Before submitting a pull request, run:
      </p>

      <CodeBlock 
        language="bash"
        code={`pnpm changeset`}
      />
      <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.875rem' }}>
        Select the affected packages, choose semver bump level (patch/minor/major), and write a clear release note summary.
      </p>
    </DocsLayout>
  );
}

