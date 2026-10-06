'use client';

import React, { useState } from 'react';
import '@skyra-tech-platform/radio';;
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
import { Callout } from '@/components/docs/Callout';
import { HeadingAnchor } from '@/components/docs/HeadingAnchor';

export default function RadioDocsPage() {
  const [selected, setSelected] = useState('free');

  const toc = [
    { id: 'quick-start', label: 'Quick Start' },
    { id: 'examples', label: 'Examples' },
    { id: 'grouping', label: 'Grouping Behavior' },
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
        title="Radio"
        description="Framework-independent radio component for mutually exclusive, single-choice selections."
        breadcrumbs={[
          { label: 'Components', href: '/components' },
          { label: 'Basic Controls' },
          { label: 'Radio' }
        ]}
        badges={[
          { label: 'Stable', variant: 'stable' },
          { label: 'Web Component', variant: 'tech' }
        ]}
      />

      <PackageMeta 
        packageName="@skyra-tech-platform/radio"
        elementName="<skyra-tech-radio>"
        version="0.1.0"
        type="Web Component"
      />

      <HeadingAnchor id="quick-start">Quick Start</HeadingAnchor>
      <InstallCommand packageName="@skyra-tech-platform/radio" />
      
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--skyra-text)', marginBottom: '1rem', marginTop: '3rem', letterSpacing: '-0.01em' }}>
        Basic Usage
      </h3>
      <LiveExample 
        language="html"
        code={`<script type="module">
  import '@skyra-tech-platform/radio';
</script>

<skyra-tech-radio name="plan" value="basic" label="Basic Plan"></skyra-tech-radio>
<skyra-tech-radio name="plan" value="pro" label="Pro Plan" checked></skyra-tech-radio>`}
      >
        <div className="flex flex-col gap-4">
          <skyra-tech-radio name="plan" value="basic" label="Basic Plan" />
          <skyra-tech-radio name="plan" value="pro" label="Pro Plan" defaultChecked />
        </div>
      </LiveExample>

      <HeadingAnchor id="examples">Examples</HeadingAnchor>
      
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem' }}>Disabled</h3>
      <LiveExample 
        language="tsx"
        title="Disabled"
        description="Prevent user interaction."
        code={`<skyra-tech-radio label="Disabled Unchecked" disabled />
<skyra-tech-radio label="Disabled Checked" defaultChecked disabled />`}
      >
        <div className="flex flex-col gap-4">
          <skyra-tech-radio label="Disabled Unchecked" disabled />
          <skyra-tech-radio label="Disabled Checked" defaultChecked disabled />
        </div>
      </LiveExample>

      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem', marginTop: '2rem' }}>Helper & Error Text</h3>
      <LiveExample 
        language="tsx"
        title="Helper & Error"
        description="Provide additional guidance or validation feedback."
        code={`<skyra-tech-radio label="Subscribe" helper="We will never spam you." />
<skyra-tech-radio label="Accept Terms" required error="You must accept the terms to proceed." />`}
      >
        <div className="flex flex-col gap-4">
          <skyra-tech-radio label="Subscribe" helper="We will never spam you." />
          <skyra-tech-radio label="Accept Terms" required error="You must accept the terms to proceed." />
        </div>
      </LiveExample>

      <HeadingAnchor id="grouping">Grouping Behavior</HeadingAnchor>
      <p className="text-[var(--skyra-text-subtle)] mb-6">
        Radios automatically form mutually exclusive groups when they share the same <code>name</code> attribute within the same form context. The custom element scopes this grouping behavior to its closest Document or ShadowRoot context to maintain deterministic boundary isolation.
      </p>
      <LiveExample 
        language="tsx"
        title="Controlled Group"
        description="Example of a React controlled radio group."
        code={`const [selected, setSelected] = useState('free');

<skyra-tech-radio name="planGroup" value="free" label="Free Plan" checked={selected === 'free'} onChange={() => setSelected('free')} />
<skyra-tech-radio name="planGroup" value="pro" label="Pro Plan" checked={selected === 'pro'} onChange={() => setSelected('pro')} />
<skyra-tech-radio name="planGroup" value="enterprise" label="Enterprise" checked={selected === 'enterprise'} onChange={() => setSelected('enterprise')} />`}
      >
        <div className="p-8 border border-[var(--skyra-border)] rounded-md flex flex-col gap-4 max-w-sm">
          <skyra-tech-radio 
            name="planGroup" 
            value="free" 
            label="Free Plan" 
            checked={selected === 'free'}
            onChange={() => setSelected('free')}
          />
          <skyra-tech-radio 
            name="planGroup" 
            value="pro" 
            label="Pro Plan" 
            checked={selected === 'pro'}
            onChange={() => setSelected('pro')}
          />
          <skyra-tech-radio 
            name="planGroup" 
            value="enterprise" 
            label="Enterprise Plan" 
            checked={selected === 'enterprise'}
            onChange={() => setSelected('enterprise')}
          />
          <div className="mt-4 p-2 bg-[var(--skyra-bg-subtle)] border border-[var(--skyra-border)] rounded text-sm text-[var(--skyra-text-subtle)]">
            Selected: <strong>{selected}</strong>
          </div>
        </div>
      </LiveExample>

      <HeadingAnchor id="usage">Usage Guidance</HeadingAnchor>
      <UsageGuidance 
        doItems={[
          "Use radios for mutually exclusive, single-choice selections from a list of options.",
          "Provide a clear, concise label for each radio option.",
          "Group related radios together visually and programmatically using the same name."
        ]}
        dontItems={[
          "Don't use radios for multiple-choice selections (use Checkbox instead).",
          "Don't trigger immediate state changes (like navigating) on radio selection.",
          "Don't use radios for a single yes/no binary choice if it can be represented by a Checkbox or Switch."
        ]}
      />

      <ApiTabs tabs={[
        { id: 'props', label: 'Properties & Attributes', content: <ApiTable rows={[
          { name: 'checked', type: 'boolean', defaultVal: 'false', description: 'Whether the radio is checked.' },
          { name: 'disabled', type: 'boolean', defaultVal: 'false', description: 'Whether the radio is disabled.' },
          { name: 'required', type: 'boolean', defaultVal: 'false', description: 'Whether the radio is required for form submission.' },
          { name: 'name', type: 'string', defaultVal: '-', description: 'The name of the radio group, submitted with form data.' },
          { name: 'value', type: 'string', defaultVal: 'on', description: 'The value to submit if the radio is checked.' },
          { name: 'label', type: 'string', defaultVal: '-', description: 'The text label for the radio.' },
          { name: 'helper-text', type: 'string', defaultVal: '-', description: 'Additional context or description.' },
          { name: 'error', type: 'string', defaultVal: '-', description: 'Error message. If provided, sets invalid state.' },
          { name: 'invalid', type: 'boolean', defaultVal: 'false', description: 'Forces the invalid error state visually.' }
        ]} /> },
        { id: 'events', label: 'Events', content: <ApiTable rows={[
          { name: 'change', type: 'Event', defaultVal: '-', description: 'Fired when the checked state changes via user interaction.' }
        ]} /> },
        { id: 'slots', label: 'Slots', content: <ApiTable rows={[
          { name: 'label', type: 'HTML', defaultVal: '-', description: 'Slot for rich HTML labels.' },
          { name: 'helper', type: 'HTML', defaultVal: '-', description: 'Slot for rich HTML helper text.' }
        ]} /> }
      ]} />

      <HeadingAnchor id="frameworks">Framework Usage</HeadingAnchor>
      <FrameworkSupport 
        frameworks={[
          { 
            name: 'Vanilla HTML / JS', 
            support: 'e2e', 
            integration: <p>No wrapper needed. Import <code style={{fontFamily: 'var(--skyra-font-mono)'}}>@skyra-tech-platform/radio</code> and use <code style={{fontFamily: 'var(--skyra-font-mono)'}}>&lt;skyra-tech-radio&gt;</code> natively.</p> 
          },
          { 
            name: 'React / Next.js', 
            support: 'e2e', 
            integration: <p>Full support via the thin wrapper in <code style={{fontFamily: 'var(--skyra-font-mono)'}}>@skyra/ui</code>. Strongly typed with React event delegation.</p> 
          },
          { 
            name: 'Angular', 
            support: 'architecture', 
            integration: <p>Bind attributes and standard properties. Listen to <code>change</code> event.</p> 
          },
          { 
            name: 'Vue 3', 
            support: 'architecture', 
            integration: <p>Native custom element support.</p> 
          },
          { 
            name: 'Svelte', 
            support: 'architecture', 
            integration: <p>Native custom element support. Standard property bindings work automatically.</p> 
          }
        ]}
      />

      <HeadingAnchor id="accessibility">Accessibility</HeadingAnchor>
      <AccessibilityPanel 
        features={[
          "Exposes standard radio semantics to screen readers via ElementInternals.",
          "Labels are automatically linked to the internal native radio input.",
          "Keyboard operable (Arrow keys navigate the group, Spacebar selects).",
          "aria-invalid and aria-describedby automatically map to error/helper text.",
          "Preserves a minimum 44x44px touch target on mobile."
        ]}
      />

      <HeadingAnchor id="styling">Styling</HeadingAnchor>
      <p className="text-[var(--skyra-text-subtle)] mb-6">
        The Radio uses a minimal set of CSS custom properties for high-level customization.
      </p>
      <TokenGrid 
        groups={[
          {
            category: 'Radio',
            tokens: [
              { name: 'Size', variable: '--skyra-radio-size', value: '1.25rem' },
              { name: 'Border', variable: '--skyra-radio-border', value: 'var(--skyra-border)' },
              { name: 'Background', variable: '--skyra-radio-bg', value: 'transparent' },
              { name: 'Checked Background', variable: '--skyra-radio-checked-bg', value: 'var(--skyra-primary)' },
              { name: 'Dot Color', variable: '--skyra-radio-dot-color', value: 'white' },
            ]
          }
        ]}
      />

      <HeadingAnchor id="responsive">Responsive Behavior</HeadingAnchor>
      <ResponsiveDemo 
        description="The Radio component is designed to wrap long text elegantly on small viewports while maintaining perfect alignment with the radio control itself. It uses Flexbox to ensure the control remains at the top rather than centering vertically. The touch target is a minimum of 44x44px for accessibility on mobile devices."
        desktop={<skyra-tech-radio label="Standard desktop layout with a concise label." />}
        mobile={<skyra-tech-radio label="Short label" />}
        fullWidth={<skyra-tech-radio label="A very long label demonstrating how the text will wrap beautifully to multiple lines on constrained devices without breaking the alignment of the radio." helper="The helper text also wraps to match the label." />}
      />

      <HeadingAnchor id="related">Related Components</HeadingAnchor>
      <RelatedComponents 
        components={[
          { title: 'Checkbox', href: '/components/basic-controls/checkbox', description: 'For multiple-choice selections.', category: 'Basic Controls' },
          { title: 'Switch', href: '/components/basic-controls/switch', description: 'For immediate, boolean state toggles.', category: 'Basic Controls' },
          { title: 'Dynamic Form', href: '/dynamic-form', description: 'Compose radios into structured forms.', category: 'Complex Forms' }
        ]}
      />

      <HeadingAnchor id="technical">Technical Reference</HeadingAnchor>
      <Callout type="info" title="Form Association & Grouping">
        Radio implements <code>ElementInternals</code> to automatically participate in standard HTML forms (<code>&lt;form&gt;</code>). Note that grouping behavior is strictly scoped to the radio's current DOM or Shadow DOM boundary, respecting web component encapsulation principles.
      </Callout>
      <Callout type="warning" title="Keyboard Navigation">
        The web component automatically handles standard keyboard navigation (up/down/left/right arrows) across the radio group when focused, skipping disabled elements in the group.
      </Callout>

    </DocsLayout>
  );
}
