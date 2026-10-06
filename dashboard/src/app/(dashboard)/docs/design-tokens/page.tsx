'use client';

import React from 'react';
import { DocsLayout } from '../../../../components/docs/DocsLayout';
import { PackageMeta } from '../../../../components/docs/PackageMeta';
import { DocsHeader } from '../../../../components/docs/DocsHeader';
import { CodeBlock } from '../../../../components/docs/CodeBlock';
import { Callout } from '../../../../components/docs/Callout';
import { HeadingAnchor } from '../../../../components/docs/HeadingAnchor';
import Link from 'next/link';

// Token data derived directly from packages/design-tokens/src/index.ts
const TOKEN_GROUPS = [
  {
    category: 'Brand Colors',
    tokens: [
      { name: 'primary',       value: '#0A58CA',             cssVar: '--skyra-primary' },
      { name: 'primaryHover',  value: '#0847a8',             cssVar: '--skyra-primary-hover' },
      { name: 'primaryLight',  value: 'rgba(10,88,202,0.1)', cssVar: '--skyra-primary-light' },
      { name: 'orange',        value: '#FF6B00',             cssVar: '--skyra-orange' },
      { name: 'orangeHover',   value: '#e05e00',             cssVar: '--skyra-orange-hover' },
      { name: 'orangeLight',   value: 'rgba(255,107,0,0.1)', cssVar: '--skyra-orange-light' },
      { name: 'cyan',          value: '#00A3E0',             cssVar: '--skyra-cyan' },
      { name: 'cyanLight',     value: 'rgba(0,163,224,0.1)', cssVar: '--skyra-cyan-light' },
      { name: 'navy',          value: '#002B66',             cssVar: '--skyra-navy' },
    ],
  },
  {
    category: 'Semantic Colors',
    tokens: [
      { name: 'danger',        value: '#ef4444',                    cssVar: '--skyra-danger' },
      { name: 'dangerLight',   value: 'rgba(239,68,68,0.1)',        cssVar: '--skyra-danger-light' },
      { name: 'success',       value: '#10b981',                    cssVar: '--skyra-success' },
      { name: 'successLight',  value: 'rgba(16,185,129,0.1)',       cssVar: '--skyra-success-light' },
      { name: 'warning',       value: '#f59e0b',                    cssVar: '--skyra-warning' },
      { name: 'warningLight',  value: 'rgba(245,158,11,0.1)',       cssVar: '--skyra-warning-light' },
      { name: 'info',          value: '#3b82f6',                    cssVar: '--skyra-info' },
      { name: 'infoLight',     value: 'rgba(59,130,246,0.1)',       cssVar: '--skyra-info-light' },
    ],
  },
  {
    category: 'Surfaces',
    tokens: [
      { name: 'bg',            value: '#F4F7FC', cssVar: '--skyra-bg' },
      { name: 'surface',       value: '#FFFFFF', cssVar: '--skyra-surface' },
      { name: 'sidebarBg',     value: '#002B66', cssVar: '--skyra-sidebar-bg' },
      { name: 'bgDark',        value: '#0B111E', cssVar: '--skyra-bg-dark' },
      { name: 'surfaceDark',   value: '#151D30', cssVar: '--skyra-surface-dark' },
    ],
  },
  {
    category: 'Typography',
    tokens: [
      { name: 'text',          value: '#0f172a', cssVar: '--skyra-text' },
      { name: 'textMuted',     value: '#64748b', cssVar: '--skyra-text-muted' },
      { name: 'textSubtle',    value: '#94a3b8', cssVar: '--skyra-text-subtle' },
      { name: 'fontBody',      value: "'Inter', system-ui, sans-serif",   cssVar: '--skyra-font-body' },
      { name: 'fontDisplay',   value: "'Outfit', sans-serif",             cssVar: '--skyra-font-display' },
      { name: 'fontMono',      value: "'JetBrains Mono', monospace",      cssVar: '--skyra-font-mono' },
    ],
  },
  {
    category: 'Border & Radius',
    tokens: [
      { name: 'border',        value: '#e2e8f0', cssVar: '--skyra-border' },
      { name: 'borderFocus',   value: '#0A58CA', cssVar: '--skyra-border-focus' },
      { name: 'radiusSm',      value: '6px',     cssVar: '--skyra-radius-sm' },
      { name: 'radiusMd',      value: '10px',    cssVar: '--skyra-radius-md' },
      { name: 'radiusLg',      value: '14px',    cssVar: '--skyra-radius-lg' },
      { name: 'radiusXl',      value: '20px',    cssVar: '--skyra-radius-xl' },
      { name: 'radiusFull',    value: '9999px',  cssVar: '--skyra-radius-full' },
    ],
  },
  {
    category: 'Layout',
    tokens: [
      { name: 'sidebarWidth',     value: '280px', cssVar: '--skyra-sidebar-width' },
      { name: 'sidebarCollapsed', value: '72px',  cssVar: '--skyra-sidebar-collapsed' },
      { name: 'headerHeight',     value: '64px',  cssVar: '--skyra-header-height' },
    ],
  },
  {
    category: 'Breakpoints',
    tokens: [
      { name: 'bpXs',  value: '320px',  cssVar: '—' },
      { name: 'bpSm',  value: '375px',  cssVar: '—' },
      { name: 'bpMd',  value: '640px',  cssVar: '—' },
      { name: 'bpLg',  value: '768px',  cssVar: '—' },
      { name: 'bpXl',  value: '1024px', cssVar: '—' },
      { name: 'bp2xl', value: '1280px', cssVar: '—' },
      { name: 'bp3xl', value: '1536px', cssVar: '—' },
    ],
  },
];

const TOC = [
  { id: 'overview',     label: 'Overview' },
  { id: 'installation', label: 'Installation' },
  { id: 'css-usage',    label: 'CSS Usage' },
  { id: 'ts-usage',     label: 'TypeScript Usage' },
  { id: 'token-table',  label: 'Token Reference' },
  { id: 'css-var-helper', label: 'cssVar Helper' },
];

function ColorSwatch({ value }: { value: string }) {
  const isColor = value.startsWith('#') || value.startsWith('rgb');
  if (!isColor) return null;
  return (
    <span
      title={value}
      style={{
        display: 'inline-block',
        width: '14px',
        height: '14px',
        borderRadius: '3px',
        background: value,
        border: '1px solid var(--skyra-border)',
        marginRight: '0.375rem',
        verticalAlign: 'middle',
        flexShrink: 0,
      }}
    />
  );
}

export default function DesignTokensDocsPage() {
  return (
    <DocsLayout toc={TOC}>
      <DocsHeader
        title="Design Tokens"
        description="CSS custom properties and TypeScript constants that define the Skyra Platform visual foundation: color, typography, spacing, radius, and layout."
        breadcrumbs={[
          { label: 'Packages', href: '/packages' },
          { label: 'design-tokens', href: '/packages/design-tokens' },
          { label: 'Documentation' },
        ]}
        badges={[
          { label: 'stable', variant: 'stable' },
          { label: 'design-tokens', variant: 'tech' },
        ]}
      />

      <PackageMeta
        packageName="@skyra-tech-platform/design-tokens"
        type="CSS + TypeScript"
        version="0.1.0"
      />

      {/* Overview */}
      <section id="overview" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="overview" level={2}>Overview</HeadingAnchor>
        <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
          <code>@skyra-tech-platform/design-tokens</code> is the single source of truth for all visual decisions in the Skyra Platform.
          It ships two artifacts:
        </p>
        <ul style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.8, paddingLeft: '1.5rem' }}>
          <li><strong>tokens.css</strong> — CSS custom properties (CSS variables) applied to <code>:root</code>, used by all <code>@skyra</code> components.</li>
          <li><strong>TypeScript exports</strong> — Typed constants mirroring the same values; useful for inline styles, tests, and non-CSS contexts.</li>
        </ul>
        <Callout type="warning" title="Import order matters">
          Import <code>tokens.css</code> before any <code>@skyra</code> component styles. Components depend on these CSS variables at render time.
        </Callout>
      </section>

      {/* Installation */}
      <section id="installation" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="installation" level={2}>Installation</HeadingAnchor>
        <CodeBlock language="bash" code={`pnpm add @skyra-tech-platform/design-tokens`} />
        <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.875rem', marginTop: '0.75rem' }}>
          All packages are distributed via the internal workspace registry.
        </p>
      </section>

      {/* CSS Usage */}
      <section id="css-usage" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="css-usage" level={2}>CSS Usage</HeadingAnchor>
        <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
          Import the CSS files in your application entry point. The tokens are applied globally via <code>:root</code> and <code>[data-theme=dark]</code> selectors.
        </p>
        <CodeBlock
          language="typescript"
          code={`// Import once in your app entry point (e.g., layout.tsx or _app.tsx)
import '@skyra-tech-platform/design-tokens/tokens.css';

// Optional: normalize browser defaults
import '@skyra-tech-platform/design-tokens/reset.css';`}
        />
        <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7, marginTop: '1rem', marginBottom: '1rem' }}>
          Once imported, all CSS variables are available anywhere in your stylesheet:
        </p>
        <CodeBlock
          language="css"
          code={`.my-button {
  background: var(--skyra-primary);
  color: var(--skyra-surface);
  border-radius: var(--skyra-radius-md);
  font-family: var(--skyra-font-body);
}

.my-card {
  background: var(--skyra-surface);
  border: 1px solid var(--skyra-border);
  box-shadow: var(--skyra-shadow-sm);
}`}
        />
      </section>

      {/* TypeScript Usage */}
      <section id="ts-usage" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="ts-usage" level={2}>TypeScript Usage</HeadingAnchor>
        <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
          For inline styles, test assertions, or non-CSS contexts (e.g., React Native, email templates), import the <code>tokens</code> constant:
        </p>
        <CodeBlock
          language="typescript"
          code={`import { tokens, TokenKey, TokenValue, cssVar } from '@skyra-tech-platform/design-tokens';

// Access token values directly
console.log(tokens.primary);      // '#0A58CA'
console.log(tokens.radiusMd);     // '10px'
console.log(tokens.fontBody);     // "'Inter', system-ui, sans-serif"

// Type-safe token key
const key: TokenKey = 'primary';
const val: TokenValue = tokens[key];

// Use in inline styles
const style = { backgroundColor: tokens.primary };`}
        />
      </section>

      {/* Token Reference Table */}
      <section id="token-table" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="token-table" level={2}>Token Reference</HeadingAnchor>
        <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          All tokens exported from <code>@skyra-tech-platform/design-tokens</code>. The <strong>CSS Variable</strong> column shows the corresponding
          custom property that gets injected via <code>tokens.css</code>.
        </p>
        {TOKEN_GROUPS.map((group) => (
          <div key={group.category} style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem' }}>
              {group.category}
            </h3>
            <div style={{ overflowX: 'auto', borderRadius: 'var(--skyra-radius-md)', border: '1px solid var(--skyra-border)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', fontFamily: 'var(--skyra-font-mono)' }}>
                <thead>
                  <tr style={{ background: 'var(--skyra-bg-muted)', borderBottom: '1px solid var(--skyra-border)' }}>
                    <th style={{ textAlign: 'left', padding: '0.625rem 1rem', color: 'var(--skyra-text-muted)', fontFamily: 'var(--skyra-font-body)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Token</th>
                    <th style={{ textAlign: 'left', padding: '0.625rem 1rem', color: 'var(--skyra-text-muted)', fontFamily: 'var(--skyra-font-body)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Value</th>
                    <th style={{ textAlign: 'left', padding: '0.625rem 1rem', color: 'var(--skyra-text-muted)', fontFamily: 'var(--skyra-font-body)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CSS Variable</th>
                  </tr>
                </thead>
                <tbody>
                  {group.tokens.map((t, i) => (
                    <tr key={t.name} style={{ borderBottom: i < group.tokens.length - 1 ? '1px solid var(--skyra-border)' : 'none', background: i % 2 === 0 ? 'var(--skyra-surface)' : 'var(--skyra-bg-muted)' }}>
                      <td style={{ padding: '0.625rem 1rem', color: 'var(--skyra-text)' }}>
                        <code>tokens.{t.name}</code>
                      </td>
                      <td style={{ padding: '0.625rem 1rem', color: 'var(--skyra-text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <ColorSwatch value={t.value} />
                          <code style={{ fontSize: '0.8125rem' }}>{t.value}</code>
                        </div>
                      </td>
                      <td style={{ padding: '0.625rem 1rem', color: 'var(--skyra-text-muted)' }}>
                        <code>{t.cssVar}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </section>

      {/* cssVar helper */}
      <section id="css-var-helper" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="css-var-helper" level={2}>cssVar Helper</HeadingAnchor>
        <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
          The <code>cssVar</code> utility constructs a <code>var(--skyra-*)</code> reference string, useful when composing dynamic inline styles in TypeScript:
        </p>
        <CodeBlock
          language="typescript"
          code={`import { cssVar } from '@skyra-tech-platform/design-tokens';

// Returns: "var(--skyra-primary)"
const ref = cssVar('primary');

// Use in React inline style
<div style={{ color: cssVar('text-muted') }} />

// Useful for computed custom property names
const dynamicVar = (name: string) => cssVar(name);`}
        />
      </section>

      {/* Navigation footer */}
      <div style={{ borderTop: '1px solid var(--skyra-border)', paddingTop: '2rem', marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/packages/design-tokens" style={{ fontSize: '0.875rem', color: 'var(--skyra-text-muted)', textDecoration: 'none' }}>
          ← Package overview
        </Link>
        <Link href="/docs/utils" style={{ fontSize: '0.875rem', color: 'var(--skyra-primary)', textDecoration: 'none' }}>
          Next: Utils →
        </Link>
      </div>
    </DocsLayout>
  );
}
