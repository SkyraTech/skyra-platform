'use client';

import React, { useState } from 'react';
import { Switch } from '@skyra/ui';
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

export default function SwitchDocsPage() {
  const [airplaneMode, setAirplaneMode] = useState(false);

  const toc = [
    { id: 'quick-start', label: 'Quick Start' },
    { id: 'basic-usage', label: 'Basic Usage' },
    { id: 'variants', label: 'Variants' },
    { id: 'sizes', label: 'Sizes' },
    { id: 'states', label: 'States' },
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
        title="Switch"
        description="A framework-independent toggle control for switching between two boolean states."
        breadcrumbs={[
          { label: 'Components', href: '/components' },
          { label: 'Basic Controls' },
          { label: 'Switch' }
        ]}
        badges={[
          { label: 'Stable', variant: 'stable' },
          { label: 'Web Component', variant: 'tech' }
        ]}
      />

      <PackageMeta 
        packageName="@skyra-tech-platform/switch"
        elementName="<skyra-tech-switch>"
        version="0.1.0"
        type="Web Component"
      />

      <HeadingAnchor id="quick-start">Quick Start</HeadingAnchor>
      <InstallCommand packageName="@skyra-tech-platform/switch" />
      
      <HeadingAnchor id="basic-usage">Basic Usage</HeadingAnchor>
      <LiveExample 
        language="html"
        code={`<script type="module">
  import '@skyra-tech-platform/switch';
</script>

<skyra-tech-switch label="Airplane Mode"></skyra-tech-switch>`}
      >
        <div className="flex flex-col gap-4">
          <Switch 
            label="Airplane Mode"
            description="Disable all wireless connections."
            checked={airplaneMode}
            onChange={(c) => setAirplaneMode(c)}
          />
          <div className="mt-4 p-2 bg-[var(--skyra-bg-subtle)] border border-[var(--skyra-border)] rounded text-sm text-[var(--skyra-text-subtle)]">
            Airplane Mode: <strong>{airplaneMode ? 'ON' : 'OFF'}</strong>
          </div>
        </div>
      </LiveExample>

      <HeadingAnchor id="variants">Variants</HeadingAnchor>
      <LiveExample 
        language="tsx"
        title="Visual Variants"
        description="The switch supports several visual variants including compact, labeled, icon, and outline modes."
        code={`<Switch label="Default" />
<Switch label="Compact" variant="compact" />
<Switch label="Labeled" variant="labeled" defaultChecked />
<Switch label="Icon" variant="icon" defaultChecked />
<Switch label="Outline" variant="outline" defaultChecked />`}
      >
        <div className="flex flex-col gap-4">
          <Switch label="Default" />
          <Switch label="Compact" variant="compact" />
          <Switch label="Labeled" variant="labeled" defaultChecked />
          <Switch label="Icon" variant="icon" defaultChecked />
          <Switch label="Outline" variant="outline" defaultChecked />
        </div>
      </LiveExample>

      <HeadingAnchor id="sizes">Sizes</HeadingAnchor>
      <LiveExample 
        language="tsx"
        title="Sizes"
        description="Available in small, medium (default), and large sizes."
        code={`<Switch label="Small Size" size="sm" />
<Switch label="Medium Size" size="md" />
<Switch label="Large Size" size="lg" />`}
      >
        <div className="flex flex-col gap-4">
          <Switch label="Small Size" size="sm" />
          <Switch label="Medium Size" size="md" />
          <Switch label="Large Size" size="lg" />
        </div>
      </LiveExample>

      <HeadingAnchor id="states">States</HeadingAnchor>
      <LiveExample 
        language="tsx"
        title="States"
        description="Demonstrating disabled, readonly, loading, and error states."
        code={`<Switch label="Disabled" disabled />
<Switch label="Disabled Checked" disabled defaultChecked />
<Switch label="Read-only" readOnly defaultChecked />
<Switch label="Loading" loading defaultChecked />
<Switch label="Error State" error="Network connectivity required." />`}
      >
        <div className="flex flex-col gap-4">
          <Switch label="Disabled" disabled />
          <Switch label="Disabled Checked" disabled defaultChecked />
          <Switch label="Read-only" readOnly defaultChecked />
          <Switch label="Loading" loading defaultChecked />
          <Switch label="Error State" error="Network connectivity required." />
        </div>
      </LiveExample>

      <HeadingAnchor id="usage">Usage Guidance</HeadingAnchor>
      <UsageGuidance 
        doItems={[
          "Use switches for immediate, boolean state changes (e.g., turning a setting on or off).",
          "Provide a clear, descriptive label for the switch.",
          "Use the Loading state when a switch toggle requires an asynchronous network request."
        ]}
        dontItems={[
          "Don't use a switch when the user must click a separate 'Save' or 'Submit' button to apply changes (use Checkbox instead).",
          "Don't use a switch for multiple-choice selections.",
          "Don't use vague labels like 'Enable' without clarifying what is being enabled."
        ]}
      />

      <HeadingAnchor id="api">API Reference</HeadingAnchor>
      <ApiTabs tabs={[
        { id: 'props', label: 'Properties & Attributes', content: <ApiTable rows={[
          { name: 'checked', type: 'boolean', defaultVal: 'false', description: 'Whether the switch is turned on.' },
          { name: 'disabled', type: 'boolean', defaultVal: 'false', description: 'Whether the switch is disabled.' },
          { name: 'readonly', type: 'boolean', defaultVal: 'false', description: 'Whether the switch is read-only (cannot be toggled).' },
          { name: 'loading', type: 'boolean', defaultVal: 'false', description: 'Shows a loading spinner in the thumb and prevents toggling.' },
          { name: 'required', type: 'boolean', defaultVal: 'false', description: 'Whether the switch is required.' },
          { name: 'variant', type: "'default' | 'compact' | 'labeled' | 'icon' | 'outline'", defaultVal: "'default'", description: 'The visual variant of the switch.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", defaultVal: "'md'", description: 'The size of the switch.' },
          { name: 'name', type: 'string', defaultVal: '-', description: 'The name submitted with form data.' },
          { name: 'value', type: 'string', defaultVal: 'on', description: 'The value to submit if the switch is checked.' },
          { name: 'label', type: 'string', defaultVal: '-', description: 'The text label for the switch.' },
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
            integration: <p>No wrapper needed. Import <code style={{fontFamily: 'var(--skyra-font-mono)'}}>@skyra-tech-platform/switch</code> and use <code style={{fontFamily: 'var(--skyra-font-mono)'}}>&lt;skyra-tech-switch&gt;</code> natively.</p> 
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
          "Utilizes a native <button role=\"switch\"> element inside the Shadow DOM.",
          "Properly updates the aria-checked state corresponding to the value.",
          "Labels and helpers are programmatically linked across the Shadow DOM boundary without duplicate IDs.",
          "aria-invalid and aria-describedby automatically map to error/helper text.",
          "Native keyboard operable (Spacebar and Enter trigger toggle natively)."
        ]}
      />

      <HeadingAnchor id="styling">Styling</HeadingAnchor>
      <p className="text-[var(--skyra-text-subtle)] mb-6">
        The Switch uses a minimal set of CSS custom properties for high-level customization.
      </p>
      <TokenGrid 
        groups={[
          {
            category: 'Switch',
            tokens: [
              { name: 'Primary Color', variable: '--skyra-switch-primary', value: 'var(--skyra-primary)' },
              { name: 'Border Color', variable: '--skyra-switch-border', value: 'var(--skyra-border)' },
              { name: 'Background', variable: '--skyra-switch-bg', value: 'var(--skyra-bg)' },
              { name: 'Thumb Shadow', variable: '--skyra-switch-shadow-sm', value: 'var(--skyra-shadow-sm)' },
              { name: 'Radius', variable: '--skyra-switch-radius-full', value: 'var(--skyra-radius-full)' },
              { name: 'Animation Duration', variable: '--skyra-switch-duration', value: 'var(--skyra-duration-fast)' },
            ]
          }
        ]}
      />

      <HeadingAnchor id="responsive">Responsive Behavior</HeadingAnchor>
      <ResponsiveDemo 
        description="The Switch component handles varying label lengths effectively while preserving alignment. Using CSS flexbox inside the Shadow DOM, the switch track remains vertically aligned to the top of multi-line text, ensuring predictable behavior on mobile devices."
        desktop={<Switch label="Standard desktop layout with a concise label." />}
        mobile={<Switch label="Short label" />}
        fullWidth={<Switch label="A very long label demonstrating how the text will wrap beautifully to multiple lines on constrained devices without breaking the alignment of the switch control." description="The helper text also wraps to match the label." />}
      />

      <HeadingAnchor id="related">Related Components</HeadingAnchor>
      <RelatedComponents 
        components={[
          { title: 'Checkbox', href: '/components/basic-controls/checkbox', description: 'For multiple-choice selections or form submission agreements.', category: 'Basic Controls' },
          { title: 'Radio', href: '/components/basic-controls/radio', description: 'For mutually exclusive selections.', category: 'Basic Controls' }
        ]}
      />

      <HeadingAnchor id="technical">Technical Reference</HeadingAnchor>
      <Callout type="info" title="Form Association">
        Switch implements <code>ElementInternals</code> to automatically participate in standard HTML forms (<code>&lt;form&gt;</code>). It manages its own internal state properly and syncs it with the form data.
      </Callout>

    </DocsLayout>
  );
}
