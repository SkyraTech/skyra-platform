'use client';

import React from 'react';
import '@skyra-tech-platform/badge';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { DocsHeader } from '@/components/docs/DocsHeader';
import { PackageMeta } from '@/components/docs/PackageMeta';
import { InstallCommand } from '@/components/docs/InstallCommand';
import { LiveExample } from '@/components/docs/LiveExample';
import { ApiTable } from '@/components/docs/ApiTable';
import { ApiTabs } from '@/components/docs/ApiTabs';
import { FrameworkSupport } from '@/components/docs/FrameworkSupport';
import { UsageGuidance } from '@/components/docs/UsageGuidance';
import { AccessibilityPanel } from '@/components/docs/AccessibilityPanel';
import { TokenGrid } from '@/components/docs/TokenGrid';
import { ResponsiveDemo } from '@/components/docs/ResponsiveDemo';
import { RelatedComponents } from '@/components/docs/RelatedComponents';
import { HeadingAnchor } from '@/components/docs/HeadingAnchor';
import { ComponentPlayground, PlaygroundControlDef } from '@/components/docs/ComponentPlayground';


const badgePlaygroundControls: PlaygroundControlDef[] = [
  {
    name: 'variant',
    label: 'Variant',
    type: 'select',
    defaultValue: 'primary',
    options: [
      { label: 'Neutral', value: 'neutral' },
      { label: 'Info', value: 'info' },
      { label: 'Success', value: 'success' },
      { label: 'Warning', value: 'warning' },
      { label: 'Danger', value: 'danger' },
      { label: 'Primary', value: 'primary' },
      { label: 'Cyan', value: 'cyan' },
      { label: 'Purple', value: 'purple' },
      { label: 'Pink', value: 'pink' },
      { label: 'Orange', value: 'orange' },
    ],
  },
  {
    name: 'size',
    label: 'Size',
    type: 'select',
    defaultValue: 'md',
    options: [
      { label: 'Small (sm)', value: 'sm' },
      { label: 'Medium (md)', value: 'md' },
    ],
  },
  {
    name: 'dot',
    label: 'Status Dot',
    type: 'boolean',
    defaultValue: false,
  },
  {
    name: 'label',
    label: 'Badge Text',
    type: 'text',
    defaultValue: 'Live Status',
  },
];

export default function BadgeDocsPage() {
  const toc = [
    { id: 'quick-start', label: 'Quick Start' },
    { id: 'playground', label: 'Interactive Playground' },
    { id: 'examples', label: 'Examples' },
    { id: 'usage', label: 'Usage Guidance' },
    { id: 'api', label: 'API Reference' },
    { id: 'frameworks', label: 'Framework Usage' },
    { id: 'accessibility', label: 'Accessibility' },
    { id: 'styling', label: 'Styling' },
    { id: 'responsive', label: 'Responsive Behavior' },
    { id: 'related', label: 'Related Components' },
    { id: 'technical', label: 'Technical Reference' },
  ];

  return (
    <DocsLayout toc={toc}>
      <DocsHeader 
        title="Badge"
        description="Compact status, tag, and count indicator built with framework-independent Web Components and official Skyra tokens."
        breadcrumbs={[
          { label: 'Components', href: '/components' },
          { label: 'Basic Controls' },
          { label: 'Badge' }
        ]}
        badges={[
          { label: 'Stable', variant: 'stable' },
          { label: 'Web Component', variant: 'tech' }
        ]}
      />

      <PackageMeta 
        packageName="@skyra-tech-platform/badge"
        elementName="<skyra-tech-badge>"
        version="0.1.0"
        type="Web Component"
      />

      <HeadingAnchor id="quick-start">Quick Start</HeadingAnchor>
      <InstallCommand packageName="@skyra-tech-platform/badge" />
      
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--skyra-text)', marginBottom: '1rem', marginTop: '3rem', letterSpacing: '-0.01em' }}>
        Basic Usage
      </h3>
      <LiveExample 
        language="html"
        code={`<script type="module">
  import '@skyra-tech-platform/badge';
</script>

<skyra-tech-badge variant="primary">Platform</skyra-tech-badge>
<skyra-tech-badge variant="success" dot>Active</skyra-tech-badge>`}
      >
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <skyra-tech-badge variant="primary">Platform</skyra-tech-badge>
          <skyra-tech-badge variant="success" dot>Active</skyra-tech-badge>
        </div>
      </LiveExample>

      
      <HeadingAnchor id="playground">Interactive Playground</HeadingAnchor>
      <ComponentPlayground
        title="Badge Playground"
        description="Toggle color variants, size scale, status indicators, and custom labels in real time."
        controls={badgePlaygroundControls}
        render={(values, logEvent) => (
          <div onClick={() => logEvent('badge-interact', { variant: values.variant, label: values.label })}>
            <skyra-tech-badge
              variant={values.variant}
              size={values.size}
              dot={values.dot || undefined}
            >
              {values.label}
            </skyra-tech-badge>
          </div>
        )}
        generateCode={(values) => {
          const attrs: string[] = [];
          if (values.variant !== 'neutral') attrs.push(`variant="${values.variant}"`);
          if (values.size !== 'md') attrs.push(`size="${values.size}"`);
          if (values.dot) attrs.push('dot');
          const attrStr = attrs.length > 0 ? ' ' + attrs.join(' ') : '';
          return `<skyra-tech-badge${attrStr}>${values.label}</skyra-tech-badge>`;
        }}
      />

      <HeadingAnchor id="examples">Examples</HeadingAnchor>
      
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem' }}>Visual Variants</h3>
      <LiveExample 
        language="tsx"
        title="Variants"
        description="Badges support 10 token-driven semantic and decorative variants."
        code={`<skyra-tech-badge variant="primary">Primary</skyra-tech-badge>
<skyra-tech-badge variant="secondary">Secondary</skyra-tech-badge>
<skyra-tech-badge variant="neutral">Neutral</skyra-tech-badge>
<skyra-tech-badge variant="success">Success</skyra-tech-badge>
<skyra-tech-badge variant="warning">Warning</skyra-tech-badge>
<skyra-tech-badge variant="danger">Danger</skyra-tech-badge>
<skyra-tech-badge variant="info">Info</skyra-tech-badge>
<skyra-tech-badge variant="orange">Orange</skyra-tech-badge>
<skyra-tech-badge variant="cyan">Cyan</skyra-tech-badge>
<skyra-tech-badge variant="purple">Purple</skyra-tech-badge>`}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
          <skyra-tech-badge variant="primary">Primary</skyra-tech-badge>
          <skyra-tech-badge variant="secondary">Secondary</skyra-tech-badge>
          <skyra-tech-badge variant="neutral">Neutral</skyra-tech-badge>
          <skyra-tech-badge variant="success">Success</skyra-tech-badge>
          <skyra-tech-badge variant="warning">Warning</skyra-tech-badge>
          <skyra-tech-badge variant="danger">Danger</skyra-tech-badge>
          <skyra-tech-badge variant="info">Info</skyra-tech-badge>
          <skyra-tech-badge variant="orange">Orange</skyra-tech-badge>
          <skyra-tech-badge variant="cyan">Cyan</skyra-tech-badge>
          <skyra-tech-badge variant="purple">Purple</skyra-tech-badge>
        </div>
      </LiveExample>

      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem', marginTop: '2rem' }}>Sizes</h3>
      <LiveExample 
        language="tsx"
        title="Sizes"
        description="Available in small (20px height) and medium (24px height)."
        code={`<skyra-tech-badge size="sm" variant="primary">Small (sm)</skyra-tech-badge>
<skyra-tech-badge size="md" variant="primary">Medium (md)</skyra-tech-badge>`}
      >
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <skyra-tech-badge size="sm" variant="primary">Small (sm)</skyra-tech-badge>
          <skyra-tech-badge size="md" variant="primary">Medium (md)</skyra-tech-badge>
        </div>
      </LiveExample>

      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem', marginTop: '2rem' }}>Status Indicator Dots</h3>
      <LiveExample 
        language="tsx"
        title="Status Dots"
        description="Add a pulsing or static indicator dot with the dot attribute for operational state visibility."
        code={`<skyra-tech-badge variant="success" dot>Healthy</skyra-tech-badge>
<skyra-tech-badge variant="warning" dot>Degraded</skyra-tech-badge>
<skyra-tech-badge variant="danger" dot>Outage</skyra-tech-badge>
<skyra-tech-badge variant="info" dot>Provisioning</skyra-tech-badge>
<skyra-tech-badge variant="neutral" dot>Offline</skyra-tech-badge>`}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <skyra-tech-badge variant="success" dot>Healthy</skyra-tech-badge>
          <skyra-tech-badge variant="warning" dot>Degraded</skyra-tech-badge>
          <skyra-tech-badge variant="danger" dot>Outage</skyra-tech-badge>
          <skyra-tech-badge variant="info" dot>Provisioning</skyra-tech-badge>
          <skyra-tech-badge variant="neutral" dot>Offline</skyra-tech-badge>
        </div>
      </LiveExample>

      <HeadingAnchor id="usage">Usage Guidance</HeadingAnchor>
      <UsageGuidance 
        doItems={[
          'Use badges to display read-only metadata like statuses, tags, categories, or counts.',
          'Pair with a status dot to convey service health or workflow state.',
          'Use appropriate semantic variants (e.g., success for positive states, danger for errors).'
        ]}
        dontItems={[
          'Do not use badges as interactive buttons; use Button or Chip components instead.',
          'Avoid stuffing long sentences inside a badge; keep labels concise (1-3 words).',
          'Do not rely solely on color to convey critical information.'
        ]}
      />

      <HeadingAnchor id="api">API Reference</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
        The badge element supports both HTML attributes and DOM properties.
      </p>

      <ApiTabs tabs={[
        { id: 'attributes', label: 'Attributes & Properties', content: <ApiTable rows={[
          { name: 'variant', type: "'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'orange' | 'cyan' | 'purple'", defaultVal: "'neutral'", description: 'Color token variant applied to the badge.' },
          { name: 'size', type: "'sm' | 'md'", defaultVal: "'sm'", description: 'Dimensions and font size of the badge.' },
          { name: 'dot', type: 'boolean', defaultVal: 'false', description: 'When present, renders a colored status indicator dot before text.' }
        ]} /> },
        { id: 'slots', label: 'Slots', content: <ApiTable rows={[
          { name: 'default', type: 'HTML', defaultVal: '-', description: 'The text label or numeric counter rendered inside the badge.' }
        ]} /> },
        { id: 'parts', label: 'CSS Parts', content: <ApiTable rows={[
          { name: 'badge', type: 'part="badge"', defaultVal: '-', description: 'The outer badge container span.' },
          { name: 'dot', type: 'part="dot"', defaultVal: '-', description: 'The status dot element.' }
        ]} /> }
      ]} />

      <HeadingAnchor id="frameworks">Framework Usage</HeadingAnchor>
      <FrameworkSupport 
        frameworks={[
          { 
            name: 'Vanilla HTML / JS', 
            support: 'e2e', 
            integration: <p>Import <code style={{fontFamily: 'var(--skyra-font-mono)'}}>@skyra-tech-platform/badge</code> and use <code style={{fontFamily: 'var(--skyra-font-mono)'}}>&lt;skyra-tech-badge&gt;</code> directly.</p> 
          },
          { 
            name: 'React / Next.js', 
            support: 'e2e', 
            integration: <p>Import the package at module or app level. Render <code style={{fontFamily: 'var(--skyra-font-mono)'}}>&lt;skyra-tech-badge variant="success" dot&gt;Active&lt;/skyra-tech-badge&gt;</code>.</p> 
          },
          { 
            name: 'Angular', 
            support: 'architecture', 
            integration: <p>Add <code style={{fontFamily: 'var(--skyra-font-mono)'}}>CUSTOM_ELEMENTS_SCHEMA</code> to your module or component, then bind properties like <code style={{fontFamily: 'var(--skyra-font-mono)'}}>[variant]="myVariant"</code>.</p> 
          },
          { 
            name: 'Vue 3', 
            support: 'architecture', 
            integration: <p>Native custom element support. Configure <code style={{fontFamily: 'var(--skyra-font-mono)'}}>isCustomElement: tag =&gt; tag.startsWith(&apos;skyra-tech-&apos;)</code>.</p> 
          },
          { 
            name: 'Svelte', 
            support: 'architecture', 
            integration: <p>Works natively as a Custom Element with standard attributes and properties.</p> 
          }
        ]}
      />

      <HeadingAnchor id="accessibility">Accessibility</HeadingAnchor>
      <AccessibilityPanel 
        features={[
          "Renders semantic text in the light DOM accessible to screen readers.",
          "The internal status dot is marked aria-hidden='true' to prevent screen reader noise.",
          "Designed with minimum 4.5:1 contrast ratios for text against badge background in both light and dark themes.",
          "Always provide sufficient contextual text or an aria-label on parent elements if conveying critical status."
        ]}
      />

      <HeadingAnchor id="styling">Styling</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '1.5rem' }}>
        Badges consume official Skyra design tokens for radius, font, and semantic colors.
      </p>
      <TokenGrid 
        groups={[
          {
            category: 'Badge Tokens',
            tokens: [
              { name: 'Font', variable: '--skyra-font-body', value: 'Inter, sans-serif' },
              { name: 'Radius', variable: '--skyra-radius-sm', value: '6px' },
              { name: 'Primary Light', variable: '--skyra-primary-light', value: 'rgba(10, 88, 202, 0.1)' },
              { name: 'Success Light', variable: '--skyra-success-light', value: 'rgba(16, 185, 129, 0.1)' },
              { name: 'Warning Light', variable: '--skyra-warning-light', value: 'rgba(245, 158, 11, 0.1)' },
              { name: 'Danger Light', variable: '--skyra-danger-light', value: 'rgba(239, 68, 68, 0.1)' },
            ]
          }
        ]}
      />

      <HeadingAnchor id="responsive">Responsive Behavior</HeadingAnchor>
      <ResponsiveDemo 
        description="Badges feature inline-flex layout with white-space: nowrap to prevent awkward word splitting. They scale comfortably across desktop, tablet, and mobile viewports."
        desktop={<skyra-tech-badge variant="info" size="md">Production Server US-East</skyra-tech-badge>}
        mobile={<skyra-tech-badge variant="info" size="sm">US-East</skyra-tech-badge>}
        fullWidth={<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '0.75rem', background: 'var(--skyra-surface)', border: '1px solid var(--skyra-border)', borderRadius: '8px' }}><span>Database Status</span><skyra-tech-badge variant="success" dot>Operational</skyra-tech-badge></div>}
      />

      <HeadingAnchor id="related">Related Components</HeadingAnchor>
      <RelatedComponents 
        components={[
          { title: 'Button', href: '/components/basic-controls/button', description: 'For interactive actions and triggers.', category: 'Basic Controls' },
          { title: 'Notification', href: '/components/feedback/notification', description: 'For multi-line system and user alert banners.', category: 'Feedback' },
          { title: 'Empty State', href: '/components/feedback/empty-state', description: 'For zero-data placeholder displays.', category: 'Feedback' }
        ]}
      />

      <HeadingAnchor id="technical">Technical Reference</HeadingAnchor>
      <div style={{ background: 'var(--skyra-surface)', border: '1px solid var(--skyra-border)', borderRadius: '8px', padding: '1.5rem', marginTop: '1.5rem' }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--skyra-text)', fontWeight: 600 }}>Element Specification</h4>
        <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--skyra-text-muted)', lineHeight: 1.8 }}>
          <li>Custom Element Tag: <code style={{ color: 'var(--skyra-primary)' }}>&lt;skyra-tech-badge&gt;</code></li>
          <li>Class Name: <code style={{ color: 'var(--skyra-primary)' }}>SkyraTechBadge</code></li>
          <li>Shadow DOM: Mode <code style={{ color: 'var(--skyra-primary)' }}>open</code></li>
          <li>Package: <code style={{ color: 'var(--skyra-primary)' }}>@skyra-tech-platform/badge</code></li>
          <li>SSR Safe: Native <code style={{ color: 'var(--skyra-primary)' }}>typeof HTMLElement</code> guard</li>
        </ul>
      </div>
    </DocsLayout>
  );
}

