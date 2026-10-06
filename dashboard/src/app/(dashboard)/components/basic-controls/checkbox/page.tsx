'use client';

import React, { useState } from 'react';
import '@skyra-tech-platform/checkbox';;
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

export default function CheckboxDocsPage() {
  const [checked, setChecked] = useState(false);

  const toc = [
    { id: 'quick-start', label: 'Quick Start' },
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
        title="Checkbox"
        description="Framework-independent checkbox component for multiple-choice selections."
        breadcrumbs={[
          { label: 'Components', href: '/components' },
          { label: 'Basic Controls' },
          { label: 'Checkbox' }
        ]}
        badges={[
          { label: 'Stable', variant: 'stable' },
          { label: 'Web Component', variant: 'tech' }
        ]}
      />

      <PackageMeta 
        packageName="@skyra-tech-platform/checkbox"
        elementName="<skyra-tech-checkbox>"
        version="0.1.0"
        type="Web Component"
      />

      <HeadingAnchor id="quick-start">Quick Start</HeadingAnchor>
      <InstallCommand packageName="@skyra-tech-platform/checkbox" />
      
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--skyra-text)', marginBottom: '1rem', marginTop: '3rem', letterSpacing: '-0.01em' }}>
        Basic Usage
      </h3>
      <LiveExample 
        language="html"
        code={`<script type="module">
  import '@skyra-tech-platform/checkbox';
</script>

<skyra-tech-checkbox label="Accept terms and conditions"></skyra-tech-checkbox>`}
      >
        <skyra-tech-checkbox label="Accept terms and conditions" />
      </LiveExample>

      <HeadingAnchor id="examples">Examples</HeadingAnchor>
      
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem' }}>States</h3>
      <LiveExample 
        language="tsx"
        title="States"
        description="Checkboxes can be checked, unchecked, or indeterminate."
        code={`<skyra-tech-checkbox label="Checked" defaultChecked />
<skyra-tech-checkbox label="Unchecked" />
<skyra-tech-checkbox label="Indeterminate" indeterminate />`}
      >
        <div className="flex flex-col gap-4">
          <skyra-tech-checkbox label="Checked" defaultChecked />
          <skyra-tech-checkbox label="Unchecked" />
          <skyra-tech-checkbox label="Indeterminate" indeterminate />
        </div>
      </LiveExample>

      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem', marginTop: '2rem' }}>Disabled</h3>
      <LiveExample 
        language="tsx"
        title="Disabled"
        description="Prevent user interaction."
        code={`<skyra-tech-checkbox label="Disabled Unchecked" disabled />
<skyra-tech-checkbox label="Disabled Checked" defaultChecked disabled />
<skyra-tech-checkbox label="Disabled Indeterminate" indeterminate disabled />`}
      >
        <div className="flex flex-col gap-4">
          <skyra-tech-checkbox label="Disabled Unchecked" disabled />
          <skyra-tech-checkbox label="Disabled Checked" defaultChecked disabled />
          <skyra-tech-checkbox label="Disabled Indeterminate" indeterminate disabled />
        </div>
      </LiveExample>

      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem', marginTop: '2rem' }}>Helper & Error Text</h3>
      <LiveExample 
        language="tsx"
        title="Helper & Error"
        description="Provide additional guidance or validation feedback."
        code={`<skyra-tech-checkbox label="Subscribe" helper="We will never spam you." />
<skyra-tech-checkbox label="Accept Terms" required error="You must accept the terms to proceed." />`}
      >
        <div className="flex flex-col gap-4">
          <skyra-tech-checkbox label="Subscribe" helper="We will never spam you." />
          <skyra-tech-checkbox label="Accept Terms" required error="You must accept the terms to proceed." />
        </div>
      </LiveExample>

      <HeadingAnchor id="usage">Usage Guidance</HeadingAnchor>
      <UsageGuidance 
        doItems={[
          "Use checkboxes for independent, multiple-choice selections.",
          "Provide a clear, concise label for each checkbox.",
          "Use the indeterminate state for 'select all' parent checkboxes."
        ]}
        dontItems={[
          "Don't use checkboxes for mutually exclusive choices (use Radio instead).",
          "Don't trigger immediate state changes (like navigating) on checkbox toggle.",
          "Don't hide the label visually without providing an aria-label."
        ]}
      />

      <ApiTabs tabs={[
        { id: 'props', label: 'Properties & Attributes', content: <ApiTable rows={[
          { name: 'checked', type: 'boolean', defaultVal: 'false', description: 'Whether the checkbox is checked.' },
          { name: 'indeterminate', type: 'boolean', defaultVal: 'false', description: 'Whether the checkbox is in an indeterminate state.' },
          { name: 'disabled', type: 'boolean', defaultVal: 'false', description: 'Whether the checkbox is disabled.' },
          { name: 'required', type: 'boolean', defaultVal: 'false', description: 'Whether the checkbox is required for form submission.' },
          { name: 'name', type: 'string', defaultVal: '-', description: 'The name of the checkbox, submitted with form data.' },
          { name: 'value', type: 'string', defaultVal: 'on', description: 'The value to submit if the checkbox is checked.' },
          { name: 'label', type: 'string', defaultVal: '-', description: 'The text label for the checkbox.' },
          { name: 'helper-text', type: 'string', defaultVal: '-', description: 'Additional context or description.' },
          { name: 'error', type: 'string', defaultVal: '-', description: 'Error message. If provided, sets invalid state.' },
          { name: 'invalid', type: 'boolean', defaultVal: 'false', description: 'Forces the invalid error state visually.' }
        ]} /> },
        { id: 'events', label: 'Events', content: <ApiTable rows={[
          { name: 'change', type: 'Event', defaultVal: '-', description: 'Fired when the checked state changes.' }
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
            integration: <p>No wrapper needed. Import <code style={{fontFamily: 'var(--skyra-font-mono)'}}>@skyra-tech-platform/checkbox</code> and use <code style={{fontFamily: 'var(--skyra-font-mono)'}}>&lt;skyra-tech-checkbox&gt;</code> natively.</p> 
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
          "Exposes standard checkbox semantics to screen readers via ElementInternals.",
          "Labels are automatically linked to the internal native checkbox.",
          "Keyboard operable (Spacebar toggles state, Tab for focus).",
          "aria-invalid and aria-describedby automatically map to error/helper text.",
          "Preserves a minimum 44x44px touch target on mobile."
        ]}
      />

      <HeadingAnchor id="styling">Styling</HeadingAnchor>
      <p className="text-[var(--skyra-text-subtle)] mb-6">
        The Checkbox uses a minimal set of CSS custom properties for high-level customization.
      </p>
      <TokenGrid 
        groups={[
          {
            category: 'Checkbox',
            tokens: [
              { name: 'Size', variable: '--skyra-checkbox-size', value: '1.25rem' },
              { name: 'Border', variable: '--skyra-checkbox-border', value: 'var(--skyra-border)' },
              { name: 'Background', variable: '--skyra-checkbox-bg', value: 'transparent' },
              { name: 'Checked Background', variable: '--skyra-checkbox-checked-bg', value: 'var(--skyra-primary)' },
              { name: 'Check Color', variable: '--skyra-checkbox-check-color', value: 'white' },
              { name: 'Border Radius', variable: '--skyra-checkbox-radius', value: 'var(--skyra-radius-sm)' },
            ]
          }
        ]}
      />

      <HeadingAnchor id="responsive">Responsive Behavior</HeadingAnchor>
      <ResponsiveDemo 
        description="The Checkbox component is designed to wrap long text elegantly on small viewports while maintaining perfect alignment with the checkbox control itself. It uses Flexbox to ensure the control remains at the top rather than centering vertically. The touch target is a minimum of 44x44px for accessibility on mobile devices."
        desktop={<skyra-tech-checkbox label="Standard desktop layout with a concise label." />}
        mobile={<skyra-tech-checkbox label="Short label" />}
        fullWidth={<skyra-tech-checkbox label="A very long label demonstrating how the text will wrap beautifully to multiple lines on constrained devices without breaking the alignment of the checkbox." helper="The helper text also wraps to match the label." />}
      />

      <HeadingAnchor id="related">Related Components</HeadingAnchor>
      <RelatedComponents 
        components={[
          { title: 'Radio', href: '/components/basic-controls/radio', description: 'For mutually exclusive selections.', category: 'Basic Controls' },
          { title: 'Switch', href: '/components/basic-controls/switch', description: 'For immediate, boolean state toggles.', category: 'Basic Controls' },
          { title: 'Dynamic Form', href: '/dynamic-form', description: 'Compose checkboxes into structured forms.', category: 'Complex Forms' }
        ]}
      />

      <HeadingAnchor id="technical">Technical Reference</HeadingAnchor>
      <Callout type="info" title="Form Association">
        Checkbox implements <code>ElementInternals</code> to automatically participate in standard HTML forms (<code>&lt;form&gt;</code>). It intercepts the <code>value</code> and <code>checked</code> states and reports validity exactly like a native <code>&lt;input type="checkbox"&gt;</code>.
      </Callout>
      <Callout type="warning" title="Indeterminate State">
        The indeterminate state is purely visual. An indeterminate checkbox is considered unchecked during form submission unless explicitly checked. User interaction (clicking) clears the indeterminate state.
      </Callout>

    </DocsLayout>
  );
}
