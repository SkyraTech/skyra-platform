'use client';

import React from 'react';
import '@skyra-tech-platform/empty-state';
import '@skyra-tech-platform/button';
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
import { FolderSearch, Plus, RefreshCw, Inbox } from 'lucide-react';


const emptyStatePlaygroundControls: PlaygroundControlDef[] = [
  {
    name: 'variant',
    label: 'Variant',
    type: 'select',
    defaultValue: 'default',
    options: [
      { label: 'Default', value: 'default' },
      { label: 'Card', value: 'card' },
      { label: 'Dashed', value: 'dashed' },
    ],
  },
  {
    name: 'headline',
    label: 'Headline',
    type: 'text',
    defaultValue: 'No Deployment Targets Configured',
  },
  {
    name: 'description',
    label: 'Description',
    type: 'text',
    defaultValue: 'Configure your first target cluster to start receiving production build pipelines.',
  },
  {
    name: 'showActions',
    label: 'Show Action Buttons',
    type: 'boolean',
    defaultValue: true,
  },
];

export default function EmptyStateDocsPage() {
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
        title="Empty State"
        description="Communicates missing content, empty search results, or zero-data states with contextual icons, explanations, and action prompts."
        breadcrumbs={[
          { label: 'Components', href: '/components' },
          { label: 'Feedback' },
          { label: 'Empty State' }
        ]}
        badges={[
          { label: 'Stable', variant: 'stable' },
          { label: 'Web Component', variant: 'tech' }
        ]}
      />

      <PackageMeta 
        packageName="@skyra-tech-platform/empty-state"
        elementName="<skyra-tech-empty-state>"
        version="0.1.0"
        type="Web Component"
      />

      <HeadingAnchor id="quick-start">Quick Start</HeadingAnchor>
      <InstallCommand packageName="@skyra-tech-platform/empty-state" />
      
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--skyra-text)', marginBottom: '1rem', marginTop: '3rem', letterSpacing: '-0.01em' }}>
        Basic Usage
      </h3>
      <LiveExample 
        language="html"
        code={`<script type="module">
  import '@skyra-tech-platform/empty-state';
  import '@skyra-tech-platform/button';
</script>

<skyra-tech-empty-state 
  headline="No items found" 
  description="Get started by creating your first project."
>
  <div slot="actions">
    <skyra-tech-button variant="primary">Create Project</skyra-tech-button>
  </div>
</skyra-tech-empty-state>`}
      >
        <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
          <skyra-tech-empty-state 
            headline="No items found" 
            description="Get started by creating your first project."
          >
            <div slot="actions">
              <skyra-tech-button variant="primary">Create Project</skyra-tech-button>
            </div>
          </skyra-tech-empty-state>
        </div>
      </LiveExample>

      
      <HeadingAnchor id="playground">Interactive Playground</HeadingAnchor>
      <ComponentPlayground
        title="Empty State Playground"
        description="Switch container variants, customize messaging, and inspect action click events."
        controls={emptyStatePlaygroundControls}
        render={(values, logEvent) => (
          <skyra-tech-empty-state variant={values.variant}>
            <FolderSearch slot="icon" size={48} />
            <span slot="headline">{values.headline}</span>
            <span slot="description">{values.description}</span>
            {values.showActions && (
              <div slot="actions" style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <skyra-tech-button variant="primary" onClick={() => logEvent('action-click', { action: 'configure' })}>
                  <Plus size={16} slot="left-icon" />
                  Add Cluster
                </skyra-tech-button>
                <skyra-tech-button variant="outline" onClick={() => logEvent('action-click', { action: 'refresh' })}>
                  <RefreshCw size={16} slot="left-icon" />
                  Refresh
                </skyra-tech-button>
              </div>
            )}
          </skyra-tech-empty-state>
        )}
        generateCode={(values) => {
          return `<skyra-tech-empty-state variant="${values.variant}">
  <svg slot="icon">...</svg>
  <span slot="headline">${values.headline}</span>
  <span slot="description">${values.description}</span>
  <div slot="actions">
    <skyra-tech-button variant="primary">Add Cluster</skyra-tech-button>
  </div>
</skyra-tech-empty-state>`;
        }}
      />

      <HeadingAnchor id="examples">Examples</HeadingAnchor>
      
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem' }}>Variants</h3>
      <LiveExample 
        language="tsx"
        title="Variants"
        description="Supports default (frameless), dashed (dropzone-like container), outline (solid card border), and compact styling."
        code={`<skyra-tech-empty-state variant="dashed" headline="Dashed Container" description="...">
  ...
</skyra-tech-empty-state>

<skyra-tech-empty-state variant="outline" headline="Solid Card Outline" description="...">
  ...
</skyra-tech-empty-state>`}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', width: '100%' }}>
          <skyra-tech-empty-state 
            variant="dashed"
            headline="No Invoices Generated" 
            description="Create an invoice or import existing financial records."
          >
            <div slot="actions">
              <skyra-tech-button variant="outline" size="sm">Import CSV</skyra-tech-button>
            </div>
          </skyra-tech-empty-state>

          <skyra-tech-empty-state 
            variant="outline"
            headline="Empty Inbox" 
            description="All incoming tasks and approvals have been resolved."
          >
            <div slot="icon">
              <Inbox size={40} />
            </div>
            <div slot="actions">
              <skyra-tech-button variant="ghost" size="sm">Refresh</skyra-tech-button>
            </div>
          </skyra-tech-empty-state>
        </div>
      </LiveExample>

      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem', marginTop: '2rem' }}>Custom Icons & Slots</h3>
      <LiveExample 
        language="tsx"
        title="Custom Slots"
        description="Override any section using the icon, headline, description, or actions slots."
        code={`<skyra-tech-empty-state variant="dashed">
  <div slot="icon">
    <FolderSearch size={44} color="var(--skyra-primary)" />
  </div>
  <h3 slot="headline" style={{ color: 'var(--skyra-primary)' }}>No Matching Files</h3>
  <p slot="description">Check your spelling or reset the active search filters.</p>
  <div slot="actions">
    <skyra-tech-button variant="outline">Reset Filters</skyra-tech-button>
  </div>
</skyra-tech-empty-state>`}
      >
        <div style={{ width: '100%', maxWidth: '650px', margin: '0 auto' }}>
          <skyra-tech-empty-state variant="dashed">
            <div slot="icon">
              <FolderSearch size={44} style={{ color: 'var(--skyra-primary)' }} />
            </div>
            <h3 slot="headline" style={{ fontSize: '1.15rem', fontWeight: 600, margin: '0 0 8px 0', color: 'var(--skyra-primary)' }}>
              No Matching Files
            </h3>
            <p slot="description" style={{ margin: 0, color: 'var(--skyra-text-muted)', fontSize: '0.875rem' }}>
              We could not find any records matching your search query. Try clearing filters or revising terms.
            </p>
            <div slot="actions" style={{ display: 'flex', gap: '0.75rem' }}>
              <skyra-tech-button variant="outline" size="sm">
                <RefreshCw size={14} slot="left-icon" /> Reset Filters
              </skyra-tech-button>
              <skyra-tech-button variant="primary" size="sm">
                <Plus size={14} slot="left-icon" /> New File
              </skyra-tech-button>
            </div>
          </skyra-tech-empty-state>
        </div>
      </LiveExample>

      <HeadingAnchor id="usage">Usage Guidance</HeadingAnchor>
      <UsageGuidance 
        doItems={[
          'Always explain why the area is empty and provide a clear recovery path or primary call-to-action.',
          'Use friendly, concise language that guides the user toward productivity.',
          'Use dashed or outline variants to demarcate empty table containers or card dropzones.'
        ]}
        dontItems={[
          'Do not leave blank white space with no indication whether data is loading or truly empty.',
          'Avoid confusing technical error messages inside an empty state (use Notification for errors).',
          'Do not clutter the actions slot with more than two competing button options.'
        ]}
      />

      <HeadingAnchor id="api">API Reference</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
        The empty state element accepts attributes for simple copy and named slots for complex custom markup.
      </p>

      <ApiTabs tabs={[
        { id: 'attributes', label: 'Attributes & Properties', content: <ApiTable rows={[
          { name: 'variant', type: "'default' | 'dashed' | 'outline' | 'compact'", defaultVal: "'default'", description: 'Container border and padding styling.' },
          { name: 'headline', type: 'string', defaultVal: "''", description: 'Primary heading title (rendered in slot headline if slot omitted).' },
          { name: 'description', type: 'string', defaultVal: "''", description: 'Secondary descriptive text (rendered in slot description if slot omitted).' }
        ]} /> },
        { id: 'slots', label: 'Slots', content: <ApiTable rows={[
          { name: 'icon', type: 'HTML', defaultVal: 'Default SVG icon', description: 'Hero illustration or icon at top of the state.' },
          { name: 'headline', type: 'HTML', defaultVal: 'headline prop', description: 'Custom heading element.' },
          { name: 'description', type: 'HTML', defaultVal: 'description prop', description: 'Custom descriptive text or paragraphs.' },
          { name: 'actions', type: 'HTML', defaultVal: '-', description: 'Call-to-action buttons container.' },
          { name: 'default', type: 'HTML', defaultVal: '-', description: 'Additional arbitrary children placed between description and actions.' }
        ]} /> },
        { id: 'parts', label: 'CSS Parts', content: <ApiTable rows={[
          { name: 'container', type: 'part="container"', defaultVal: '-', description: 'The outer flex container.' },
          { name: 'icon', type: 'part="icon"', defaultVal: '-', description: 'The icon wrapper element.' },
          { name: 'title', type: 'part="title"', defaultVal: '-', description: 'The default heading element.' },
          { name: 'description', type: 'part="description"', defaultVal: '-', description: 'The default description element.' },
          { name: 'actions', type: 'part="actions"', defaultVal: '-', description: 'The actions button bar container.' }
        ]} /> }
      ]} />

      <HeadingAnchor id="frameworks">Framework Usage</HeadingAnchor>
      <FrameworkSupport 
        frameworks={[
          { 
            name: 'Vanilla HTML / JS', 
            support: 'e2e', 
            integration: <p>Import <code style={{fontFamily: 'var(--skyra-font-mono)'}}>@skyra-tech-platform/empty-state</code> and use <code style={{fontFamily: 'var(--skyra-font-mono)'}}>&lt;skyra-tech-empty-state&gt;</code> natively with standard slot names.</p> 
          },
          { 
            name: 'React / Next.js', 
            support: 'e2e', 
            integration: <p>Render with standard JSX and use the <code style={{fontFamily: 'var(--skyra-font-mono)'}}>slot</code> prop for icon and action children.</p> 
          },
          { 
            name: 'Angular', 
            support: 'architecture', 
            integration: <p>Enable <code style={{fontFamily: 'var(--skyra-font-mono)'}}>CUSTOM_ELEMENTS_SCHEMA</code>. Use standard Angular slot projections.</p> 
          },
          { 
            name: 'Vue 3', 
            support: 'architecture', 
            integration: <p>Native custom element support. Bind properties with <code style={{fontFamily: 'var(--skyra-font-mono)'}}>:headline</code> and slot content directly.</p> 
          },
          { 
            name: 'Svelte', 
            support: 'architecture', 
            integration: <p>Place custom element tags directly in Svelte templates.</p> 
          }
        ]}
      />

      <HeadingAnchor id="accessibility">Accessibility</HeadingAnchor>
      <AccessibilityPanel 
        features={[
          "The heading element defaults to an accessible h3 level within the shadow DOM.",
          "Custom headline slots allow consumers to calibrate heading hierarchy (h2, h3, h4) to match document outline.",
          "Decorative icons in the default slot are non-interactive; custom icons should include aria-hidden='true'.",
          "Action buttons maintain standard Tab keyboard navigation order."
        ]}
      />

      <HeadingAnchor id="styling">Styling</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '1.5rem' }}>
        Empty state uses design tokens for radius, typography, muted text colors, and borders.
      </p>
      <TokenGrid 
        groups={[
          {
            category: 'Empty State Tokens',
            tokens: [
              { name: 'Display Font', variable: '--skyra-font-display', value: 'Outfit, sans-serif' },
              { name: 'Body Font', variable: '--skyra-font-body', value: 'Inter, sans-serif' },
              { name: 'Radius MD', variable: '--skyra-radius-md', value: '10px' },
              { name: 'Border', variable: '--skyra-border', value: '#e2e8f0' },
              { name: 'Surface', variable: '--skyra-surface', value: '#ffffff' },
              { name: 'Text Muted', variable: '--skyra-text-muted', value: '#64748b' },
            ]
          }
        ]}
      />

      <HeadingAnchor id="responsive">Responsive Behavior</HeadingAnchor>
      <ResponsiveDemo 
        description="Empty states automatically center and flow down vertically on narrow screens, stacking actions if necessary."
        desktop={<skyra-tech-empty-state variant="outline" headline="Desktop Table Filter" description="No results found for active filter query." />}
        mobile={<skyra-tech-empty-state variant="compact" headline="No Messages" description="Check back soon." />}
        fullWidth={<skyra-tech-empty-state variant="dashed" headline="Full Width Data Container" description="Integrates cleanly across 100% of container width." />}
      />

      <HeadingAnchor id="related">Related Components</HeadingAnchor>
      <RelatedComponents 
        components={[
          { title: 'Loader System', href: '/components/feedback/loader', description: 'For states when data is actively fetching rather than missing.', category: 'Feedback' },
          { title: 'Notification', href: '/components/feedback/notification', description: 'For system errors and actionable alerts.', category: 'Feedback' },
          { title: 'Button', href: '/components/basic-controls/button', description: 'For call-to-action buttons inside empty states.', category: 'Basic Controls' }
        ]}
      />

      <HeadingAnchor id="technical">Technical Reference</HeadingAnchor>
      <div style={{ background: 'var(--skyra-surface)', border: '1px solid var(--skyra-border)', borderRadius: '8px', padding: '1.5rem', marginTop: '1.5rem' }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--skyra-text)', fontWeight: 600 }}>Element Specification</h4>
        <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--skyra-text-muted)', lineHeight: 1.8 }}>
          <li>Custom Element Tag: <code style={{ color: 'var(--skyra-primary)' }}>&lt;skyra-tech-empty-state&gt;</code></li>
          <li>Class Name: <code style={{ color: 'var(--skyra-primary)' }}>SkyraTechEmptyState</code></li>
          <li>Package: <code style={{ color: 'var(--skyra-primary)' }}>@skyra-tech-platform/empty-state</code></li>
          <li>Shadow DOM: Mode <code style={{ color: 'var(--skyra-primary)' }}>open</code></li>
          <li>SSR Safe: Native <code style={{ color: 'var(--skyra-primary)' }}>typeof HTMLElement</code> guard</li>
        </ul>
      </div>
    </DocsLayout>
  );
}

