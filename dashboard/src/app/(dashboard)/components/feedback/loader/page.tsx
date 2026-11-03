'use client';

import React, { useState } from 'react';
import '@skyra-tech-platform/loader';
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


const loaderPlaygroundControls: PlaygroundControlDef[] = [
  {
    name: 'component',
    label: 'Loader Primitive',
    type: 'select',
    defaultValue: 'spinner',
    options: [
      { label: 'Activity Spinner', value: 'spinner' },
      { label: 'Linear Progress', value: 'progress' },
      { label: 'Circular Progress', value: 'circular' },
      { label: 'Skeleton Placeholder', value: 'skeleton' },
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
      { label: 'Large (lg)', value: 'lg' },
    ],
  },
  {
    name: 'progressValue',
    label: 'Progress Value (%)',
    type: 'number',
    defaultValue: 65,
    min: 0,
    max: 100,
    step: 5,
  },
  {
    name: 'label',
    label: 'Status Label',
    type: 'text',
    defaultValue: 'Processing transaction...',
  },
];

export default function LoaderDocsPage() {
  const [progressVal, setProgressVal] = useState(45);

  const toc = [
    { id: 'quick-start', label: 'Quick Start' },
    { id: 'playground', label: 'Interactive Playground' },
    { id: 'spinners', label: 'Spinners' },
    { id: 'progress-bars', label: 'Linear Progress' },
    { id: 'circular-progress', label: 'Circular Progress' },
    { id: 'skeletons', label: 'Skeleton Placeholders' },
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
        title="Loader System"
        description="Comprehensive loading feedback primitives: activity spinners, linear progress meters, circular indicators, and skeleton wireframe placeholders."
        breadcrumbs={[
          { label: 'Components', href: '/components' },
          { label: 'Feedback' },
          { label: 'Loader' }
        ]}
        badges={[
          { label: 'Stable', variant: 'stable' },
          { label: 'Web Component', variant: 'tech' }
        ]}
      />

      <PackageMeta 
        packageName="@skyra-tech-platform/loader"
        elementName="<skyra-tech-spinner>, <skyra-tech-progress>, <skyra-tech-skeleton>"
        version="0.1.0"
        type="Web Component Suite"
      />

      <HeadingAnchor id="quick-start">Quick Start</HeadingAnchor>
      <InstallCommand packageName="@skyra-tech-platform/loader" />
      
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--skyra-text)', marginBottom: '1rem', marginTop: '3rem', letterSpacing: '-0.01em' }}>
        Basic Usage
      </h3>
      <LiveExample 
        language="html"
        code={`<script type="module">
  import '@skyra-tech-platform/loader';
</script>

<skyra-tech-spinner size="md"></skyra-tech-spinner>
<skyra-tech-progress value="60"></skyra-tech-progress>
<skyra-tech-circular-progress value="75" show-value></skyra-tech-circular-progress>`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '400px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <skyra-tech-spinner size="md"></skyra-tech-spinner>
            <span style={{ fontSize: '0.875rem', color: 'var(--skyra-text-muted)' }}>Loading records...</span>
          </div>
          <skyra-tech-progress value={60} label="Syncing..." show-label></skyra-tech-progress>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <skyra-tech-circular-progress value={75} show-value></skyra-tech-circular-progress>
            <span style={{ fontSize: '0.875rem', color: 'var(--skyra-text-muted)' }}>75% Storage Used</span>
          </div>
        </div>
      </LiveExample>

      
      <HeadingAnchor id="playground">Interactive Playground</HeadingAnchor>
      <ComponentPlayground
        title="Loader System Playground"
        description="Switch between spinners, progress bars, and skeletons to test dynamic feedback states."
        controls={loaderPlaygroundControls}
        render={(values, logEvent) => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start', minWidth: '280px' }}>
            {values.component === 'spinner' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <skyra-tech-spinner size={values.size} label={values.label} />
                <span style={{ fontSize: '0.875rem', color: 'var(--skyra-text-muted)' }}>{values.label}</span>
              </div>
            )}
            {values.component === 'progress' && (
              <div style={{ width: '100%', maxWidth: '360px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.8rem' }}>
                  <span>{values.label}</span>
                  <strong>{values.progressValue}%</strong>
                </div>
                <skyra-tech-progress value={values.progressValue} max={100} size={values.size} />
              </div>
            )}
            {values.component === 'circular' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <skyra-tech-circular-progress value={values.progressValue} max={100} size={values.size} show-label />
                <span style={{ fontSize: '0.875rem', color: 'var(--skyra-text-muted)' }}>{values.label}</span>
              </div>
            )}
            {values.component === 'skeleton' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', maxWidth: '320px' }}>
                <skyra-tech-skeleton variant="text" width="60%" />
                <skyra-tech-skeleton variant="rectangular" width="100%" height="40px" />
                <skyra-tech-skeleton variant="text" width="80%" />
              </div>
            )}
            <skyra-tech-button
              variant="outline"
              size="sm"
              onClick={() => logEvent('loader-interact', { component: values.component, size: values.size, value: values.progressValue })}
            >
              Log State Snapshot
            </skyra-tech-button>
          </div>
        )}
        generateCode={(values) => {
          if (values.component === 'spinner') return `<skyra-tech-spinner size="${values.size}" label="${values.label}"></skyra-tech-spinner>`;
          if (values.component === 'progress') return `<skyra-tech-progress value="${values.progressValue}" max="100" size="${values.size}"></skyra-tech-progress>`;
          if (values.component === 'circular') return `<skyra-tech-circular-progress value="${values.progressValue}" max="100" size="${values.size}" show-label></skyra-tech-circular-progress>`;
          return `<skyra-tech-skeleton variant="rectangular" width="100%" height="40px"></skyra-tech-skeleton>`;
        }}
      />

      <HeadingAnchor id="spinners">Spinners</HeadingAnchor>
      <LiveExample 
        language="tsx"
        title="Spinner Sizes & Labels"
        description="Activity spinners in xs, sm, md, lg, and xl sizes with optional accessible text labels."
        code={`<skyra-tech-spinner size="xs"></skyra-tech-spinner>
<skyra-tech-spinner size="sm"></skyra-tech-spinner>
<skyra-tech-spinner size="md"></skyra-tech-spinner>
<skyra-tech-spinner size="lg"></skyra-tech-spinner>
<skyra-tech-spinner size="xl"></skyra-tech-spinner>
<skyra-tech-spinner size="md" label="Exporting data..." show-label></skyra-tech-spinner>`}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <skyra-tech-spinner size="xs"></skyra-tech-spinner>
          <skyra-tech-spinner size="sm"></skyra-tech-spinner>
          <skyra-tech-spinner size="md"></skyra-tech-spinner>
          <skyra-tech-spinner size="lg"></skyra-tech-spinner>
          <skyra-tech-spinner size="xl"></skyra-tech-spinner>
          <skyra-tech-spinner size="md" label="Exporting data..." show-label></skyra-tech-spinner>
        </div>
      </LiveExample>

      <HeadingAnchor id="progress-bars">Linear Progress</HeadingAnchor>
      <LiveExample 
        language="tsx"
        title="Linear Progress Variants & States"
        description="Determinate and indeterminate progress bars supporting primary, success, warning, and danger variants."
        code={`<skyra-tech-progress value={45} size="md" label="Uploading file" show-label></skyra-tech-progress>
<skyra-tech-progress value={80} variant="success"></skyra-tech-progress>
<skyra-tech-progress value={92} variant="warning"></skyra-tech-progress>
<skyra-tech-progress value={15} variant="danger"></skyra-tech-progress>
<skyra-tech-progress indeterminate size="sm"></skyra-tech-progress>`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', maxWidth: '500px' }}>
          <skyra-tech-progress value={progressVal} size="md" label={`Uploading payload (${progressVal}%)`} show-label></skyra-tech-progress>
          <skyra-tech-progress value={80} variant="success"></skyra-tech-progress>
          <skyra-tech-progress value={92} variant="warning"></skyra-tech-progress>
          <skyra-tech-progress value={15} variant="danger"></skyra-tech-progress>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--skyra-text-muted)', display: 'block', marginBottom: '4px' }}>Indeterminate Stream</span>
            <skyra-tech-progress size="sm"></skyra-tech-progress>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <skyra-tech-button size="sm" variant="outline" onClick={() => setProgressVal(Math.max(10, progressVal - 15))}>Decrease</skyra-tech-button>
            <skyra-tech-button size="sm" variant="primary" onClick={() => setProgressVal(Math.min(100, progressVal + 15))}>Increase</skyra-tech-button>
          </div>
        </div>
      </LiveExample>

      <HeadingAnchor id="circular-progress">Circular Progress</HeadingAnchor>
      <LiveExample 
        language="tsx"
        title="Circular Progress"
        description="Circular meters for compact space constraints and dashboard widgets."
        code={`<skyra-tech-circular-progress value={35} variant="primary" show-value></skyra-tech-circular-progress>
<skyra-tech-circular-progress value={68} variant="success" show-value></skyra-tech-circular-progress>
<skyra-tech-circular-progress value={89} variant="warning" show-value></skyra-tech-circular-progress>
<skyra-tech-circular-progress variant="primary"></skyra-tech-circular-progress>`}
      >
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <skyra-tech-circular-progress value={35} variant="primary" show-value></skyra-tech-circular-progress>
          <skyra-tech-circular-progress value={68} variant="success" show-value></skyra-tech-circular-progress>
          <skyra-tech-circular-progress value={89} variant="warning" show-value></skyra-tech-circular-progress>
          <skyra-tech-circular-progress variant="primary"></skyra-tech-circular-progress>
        </div>
      </LiveExample>

      <HeadingAnchor id="skeletons">Skeleton Placeholders</HeadingAnchor>
      <LiveExample 
        language="tsx"
        title="Wireframe Skeleton Loading"
        description="Prevent layout shifts while content loads by rendering pulsating skeleton wireframes."
        code={`<div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
  <skyra-tech-skeleton width="48px" height="48px" radius="full"></skyra-tech-skeleton>
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <skyra-tech-skeleton width="60%" height="18px"></skyra-tech-skeleton>
    <skyra-tech-skeleton width="90%" height="14px"></skyra-tech-skeleton>
  </div>
</div>`}
      >
        <div style={{ width: '100%', maxWidth: '450px', padding: '1.25rem', background: 'var(--skyra-surface)', border: '1px solid var(--skyra-border)', borderRadius: '10px' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <skyra-tech-skeleton width="48px" height="48px" radius="full"></skyra-tech-skeleton>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <skyra-tech-skeleton width="65%" height="18px"></skyra-tech-skeleton>
              <skyra-tech-skeleton width="95%" height="14px"></skyra-tech-skeleton>
            </div>
          </div>
          <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <skyra-tech-skeleton width="100%" height="14px"></skyra-tech-skeleton>
            <skyra-tech-skeleton width="80%" height="14px"></skyra-tech-skeleton>
          </div>
        </div>
      </LiveExample>

      <HeadingAnchor id="usage">Usage Guidance</HeadingAnchor>
      <UsageGuidance 
        doItems={[
          'Use spinners for brief inline tasks or button loading states (< 2 seconds).',
          'Use linear progress for file transfers or quantified multi-step workloads.',
          'Use skeleton wireframes for initial dashboard content loads to prevent cumulative layout shift (CLS).'
        ]}
        dontItems={[
          'Do not display spinners indefinitely without a timeout or error fallback.',
          'Avoid showing multiple competing animated spinners on the same card or widget.',
          'Do not omit accessible aria-label or role attributes on progress elements.'
        ]}
      />

      <HeadingAnchor id="api">API Reference</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
        Reference specifications for all 4 custom elements provided by <code style={{ color: 'var(--skyra-primary)' }}>@skyra-tech-platform/loader</code>.
      </p>

      <ApiTabs tabs={[
        { id: 'spinner', label: 'Spinner Attributes', content: <ApiTable rows={[
          { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", defaultVal: "'md'", description: 'Physical outer diameter of spinner.' },
          { name: 'color', type: 'string', defaultVal: "'var(--skyra-primary)'", description: 'CSS color property for spinner arc.' },
          { name: 'label', type: 'string', defaultVal: "'Loading...'", description: 'Screen reader and optional visual text label.' },
          { name: 'show-label', type: 'boolean', defaultVal: 'false', description: 'When true, renders visible label beside spinner.' }
        ]} /> },
        { id: 'progress', label: 'Progress Attributes', content: <ApiTable rows={[
          { name: 'value', type: 'number', defaultVal: 'undefined (indeterminate)', description: 'Current progress value (0 to max).' },
          { name: 'max', type: 'number', defaultVal: '100', description: 'Maximum progress scale value.' },
          { name: 'variant', type: "'primary' | 'success' | 'warning' | 'danger'", defaultVal: "'primary'", description: 'Color theme of the filled bar.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", defaultVal: "'md'", description: 'Height thickness of the progress track.' },
          { name: 'show-label', type: 'boolean', defaultVal: 'false', description: 'Displays progress percentage or custom label.' }
        ]} /> },
        { id: 'circular', label: 'Circular Progress', content: <ApiTable rows={[
          { name: 'value', type: 'number', defaultVal: 'undefined (indeterminate)', description: 'Current completion percentage (0-100).' },
          { name: 'size', type: 'number', defaultVal: '40', description: 'Diameter in pixels.' },
          { name: 'stroke-width', type: 'number', defaultVal: '4', description: 'Stroke thickness in pixels.' },
          { name: 'variant', type: "'primary' | 'success' | 'warning' | 'danger'", defaultVal: "'primary'", description: 'Color fill of the indicator ring.' },
          { name: 'show-value', type: 'boolean', defaultVal: 'false', description: 'Displays numeric percentage inside center.' }
        ]} /> },
        { id: 'skeleton', label: 'Skeleton Attributes', content: <ApiTable rows={[
          { name: 'width', type: 'string', defaultVal: "'100%'", description: 'CSS width string.' },
          { name: 'height', type: 'string', defaultVal: "'1rem'", description: 'CSS height string.' },
          { name: 'radius', type: "'none' | 'sm' | 'md' | 'lg' | 'full'", defaultVal: "'md'", description: 'Corner border-radius token.' },
          { name: 'animation', type: "'pulse' | 'wave' | 'none'", defaultVal: "'pulse'", description: 'Shimmer animation type.' }
        ]} /> }
      ]} />

      <HeadingAnchor id="frameworks">Framework Usage</HeadingAnchor>
      <FrameworkSupport 
        frameworks={[
          { 
            name: 'Vanilla HTML / JS', 
            support: 'e2e', 
            integration: <p>Import <code style={{fontFamily: 'var(--skyra-font-mono)'}}>@skyra-tech-platform/loader</code> and place tags directly into HTML.</p> 
          },
          { 
            name: 'React / Next.js', 
            support: 'e2e', 
            integration: <p>Use <code style={{fontFamily: 'var(--skyra-font-mono)'}}>&lt;skyra-tech-spinner size="md" /&gt;</code> with standard JSX attributes.</p> 
          },
          { 
            name: 'Angular', 
            support: 'architecture', 
            integration: <p>Add <code style={{fontFamily: 'var(--skyra-font-mono)'}}>CUSTOM_ELEMENTS_SCHEMA</code> and bind <code style={{fontFamily: 'var(--skyra-font-mono)'}}>[value]="downloadProgress"</code>.</p> 
          },
          { 
            name: 'Vue 3', 
            support: 'architecture', 
            integration: <p>Native custom element support with reactive property bindings.</p> 
          },
          { 
            name: 'Svelte', 
            support: 'architecture', 
            integration: <p>Native custom element support.</p> 
          }
        ]}
      />

      <HeadingAnchor id="accessibility">Accessibility</HeadingAnchor>
      <AccessibilityPanel 
        features={[
          "Spinners expose role='status' with accessible live region text.",
          "Progress bars expose role='progressbar', aria-valuenow, and aria-valuemax.",
          "Skeleton loaders automatically set aria-hidden='true' to avoid confusing screen readers with non-semantic filler content.",
          "Supports prefers-reduced-motion media query by reducing or disabling pulsing animations."
        ]}
      />

      <HeadingAnchor id="styling">Styling</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '1.5rem' }}>
        Loaders integrate with official Skyra primary and semantic status colors.
      </p>
      <TokenGrid 
        groups={[
          {
            category: 'Loader Tokens',
            tokens: [
              { name: 'Primary Color', variable: '--skyra-primary', value: '#0A58CA' },
              { name: 'Success Color', variable: '--skyra-success', value: '#10B981' },
              { name: 'Warning Color', variable: '--skyra-warning', value: '#F59E0B' },
              { name: 'Danger Color', variable: '--skyra-danger', value: '#EF4444' },
              { name: 'Surface', variable: '--skyra-surface', value: '#ffffff' },
              { name: 'Border', variable: '--skyra-border', value: '#e2e8f0' },
            ]
          }
        ]}
      />

      <HeadingAnchor id="responsive">Responsive Behavior</HeadingAnchor>
      <ResponsiveDemo 
        description="Linear progress bars and skeletons fluidly span 100% of available container width, while spinners and circular progress remain fixed at specified dimensions."
        desktop={<skyra-tech-progress value={70} size="md" label="Desktop 70%"></skyra-tech-progress>}
        mobile={<skyra-tech-progress value={70} size="sm"></skyra-tech-progress>}
        fullWidth={<skyra-tech-progress value={95} size="lg" label="Full width data sync (95%)" show-label></skyra-tech-progress>}
      />

      <HeadingAnchor id="related">Related Components</HeadingAnchor>
      <RelatedComponents 
        components={[
          { title: 'Button', href: '/components/basic-controls/button', description: 'Buttons support integrated loading states.', category: 'Basic Controls' },
          { title: 'Empty State', href: '/components/feedback/empty-state', description: 'When loading finishes with 0 results.', category: 'Feedback' },
          { title: 'Toast', href: '/components/feedback/toast', description: 'For completion alerts after progress finishes.', category: 'Feedback' }
        ]}
      />

      <HeadingAnchor id="technical">Technical Reference</HeadingAnchor>
      <div style={{ background: 'var(--skyra-surface)', border: '1px solid var(--skyra-border)', borderRadius: '8px', padding: '1.5rem', marginTop: '1.5rem' }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--skyra-text)', fontWeight: 600 }}>Element Specification</h4>
        <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--skyra-text-muted)', lineHeight: 1.8 }}>
          <li>Custom Element Tags: <code style={{ color: 'var(--skyra-primary)' }}>&lt;skyra-tech-spinner&gt;</code>, <code style={{ color: 'var(--skyra-primary)' }}>&lt;skyra-tech-progress&gt;</code>, <code style={{ color: 'var(--skyra-primary)' }}>&lt;skyra-tech-circular-progress&gt;</code>, <code style={{ color: 'var(--skyra-primary)' }}>&lt;skyra-tech-skeleton&gt;</code></li>
          <li>Package: <code style={{ color: 'var(--skyra-primary)' }}>@skyra-tech-platform/loader</code></li>
          <li>Shadow DOM: Mode <code style={{ color: 'var(--skyra-primary)' }}>open</code></li>
          <li>SSR Safe: Native <code style={{ color: 'var(--skyra-primary)' }}>typeof HTMLElement</code> guard</li>
        </ul>
      </div>
    </DocsLayout>
  );
}

