'use client';

import React, { useState } from 'react';
import { Input } from '@skyra/ui';
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
import { Mail, Search } from 'lucide-react';

export default function InputDocsPage() {
  const [loading1, setLoading1] = useState(false);

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
        title="Input"
        description="Framework-independent, native input component for text entry."
        breadcrumbs={[
          { label: 'Components', href: '/components' },
          { label: 'Basic Controls' },
          { label: 'Input' }
        ]}
        badges={[
          { label: 'Stable', variant: 'stable' },
          { label: 'Web Component', variant: 'tech' }
        ]}
      />

      <PackageMeta 
        packageName="@skyra-tech-platform/input"
        elementName="<skyra-tech-input>"
        version="0.1.0"
        type="Web Component"
      />

      <HeadingAnchor id="quick-start">Quick Start</HeadingAnchor>
      <InstallCommand packageName="@skyra-tech-platform/input" />
      
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--skyra-text)', marginBottom: '1rem', marginTop: '3rem', letterSpacing: '-0.01em' }}>
        Basic Usage
      </h3>
      <LiveExample 
        language="html"
        code={`<script type="module">
  import '@skyra-tech-platform/input';
</script>

<skyra-tech-input placeholder="Enter text" label="Full Name"></skyra-tech-input>`}
      >
        <Input label="Full Name" placeholder="Enter text" />
      </LiveExample>

      <HeadingAnchor id="examples">Examples</HeadingAnchor>
      
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem' }}>Variants / Types</h3>
      <LiveExample 
        language="tsx"
        title="Input Types"
        description="Native text types are supported, like email or password."
        code={`<Input type="text" label="Text" />
<Input type="email" label="Email" />
<Input type="password" label="Password" />`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '400px' }}>
          <Input type="text" label="Text" />
          <Input type="email" label="Email" />
          <Input type="password" label="Password" />
        </div>
      </LiveExample>

      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem' }}>States</h3>
      <LiveExample 
        language="tsx"
        title="States"
        description="Disabled, readonly, and loading states."
        code={`<Input disabled label="Disabled" value="Can't edit me" />
<Input readOnly label="Readonly" value="Fixed value" />
<Input loading label="Loading" placeholder="Please wait..." />
<Input error="Invalid field" label="Error" />`}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', width: '100%', maxWidth: '800px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--skyra-text-muted)', textTransform: 'uppercase' }}>Disabled</span>
            <Input disabled value="Can't edit me" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--skyra-text-muted)', textTransform: 'uppercase' }}>Readonly</span>
            <Input readOnly value="Fixed value" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--skyra-text-muted)', textTransform: 'uppercase' }}>Loading</span>
            <Input loading placeholder="Please wait..." />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--skyra-text-muted)', textTransform: 'uppercase' }}>Error</span>
            <Input error="Invalid field" defaultValue="Bad input" />
          </div>
        </div>
      </LiveExample>

      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem' }}>Labels & Helpers</h3>
      <LiveExample 
        language="tsx"
        title="Labels & Helpers"
        description="Labels, helper text, and required indicators."
        code={`<Input label="Username" helperText="Must be unique" />
<Input label="Email" required helperText="We will not spam you" />`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '400px' }}>
          <Input label="Username" helperText="Must be unique" />
          <Input label="Email" required helperText="We will not spam you" />
        </div>
      </LiveExample>

      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem' }}>Adornments</h3>
      <LiveExample 
        language="tsx"
        title="Prefix / Suffix & Clearable"
        description="Leading/trailing content or a clear button."
        code={`<Input label="Email" leftAdornment={<Mail size={16} />} />
<Input label="Search" rightAdornment={<Search size={16} />} />
<Input label="Clearable" clearable defaultValue="Clear me" />`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '400px' }}>
          <Input label="Email" leftAdornment={<Mail size={16} />} />
          <Input label="Search" rightAdornment={<Search size={16} />} />
          <Input label="Clearable" clearable defaultValue="Clear me" />
        </div>
      </LiveExample>
      
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem' }}>Character Count</h3>
      <LiveExample 
        language="tsx"
        title="Character Count"
        description="Display character count limit."
        code={`<Input label="Handle" showCount maxLength={15} defaultValue="skyra" />`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '400px' }}>
          <Input label="Handle" showCount maxLength={15} defaultValue="skyra" />
        </div>
      </LiveExample>

      <HeadingAnchor id="usage">Usage Guidance</HeadingAnchor>
      <UsageGuidance 
        doItems={[
          'Use for short, single-line text data.',
          'Provide a clear label and helper text for ambiguous fields.',
          'Use type="email" or type="tel" to trigger correct mobile keyboards.'
        ]}
        dontItems={[
          'Do not use for multiline text (use Textarea instead).',
          'Do not rely solely on placeholder text for labels as they disappear.'
        ]}
      />

      <HeadingAnchor id="api">API Reference</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
        Skyra Platform uses Web Components. This means properties can be accessed via DOM properties (<code style={{ fontFamily: 'var(--skyra-font-mono)', fontSize: '0.85em', color: 'var(--skyra-primary)' }}>input.value = 'hello'</code>) and attributes via HTML (<code style={{ fontFamily: 'var(--skyra-font-mono)', fontSize: '0.85em', color: 'var(--skyra-primary)' }}>value="hello"</code>).
      </p>

      <ApiTabs 
        tabs={[
          {
            id: 'props',
            label: 'Properties & Attributes',
            content: (
              <ApiTable 
                rows={[
                  { name: 'type', type: 'string', defaultVal: "'text'", description: 'Native input type (text, email, password, etc).' },
                  { name: 'value', type: 'string', defaultVal: "''", description: 'Value of the input.' },
                  { name: 'disabled', type: 'boolean', defaultVal: 'false', description: 'Visually and functionally disables the input.' },
                  { name: 'readonly', type: 'boolean', defaultVal: 'false', description: 'Makes the input read-only.' },
                  { name: 'required', type: 'boolean', defaultVal: 'false', description: 'Makes the input required for form submission.' },
                  { name: 'label', type: 'string', defaultVal: 'undefined', description: 'Label text for the input.' },
                  { name: 'helper-text', type: 'string', defaultVal: 'undefined', description: 'Helper text displayed below the input.' },
                  { name: 'error', type: 'string', defaultVal: 'undefined', description: 'Error message. Setting this turns the input invalid.' },
                  { name: 'loading', type: 'boolean', defaultVal: 'false', description: 'Shows a spinner inside the input.' },
                  { name: 'clearable', type: 'boolean', defaultVal: 'false', description: 'Shows a clear button when value is not empty.' },
                  { name: 'show-count', type: 'boolean', defaultVal: 'false', description: 'Shows a character count. Requires maxlength to be set.' },
                ]}
              />
            )
          },
          {
            id: 'methods',
            label: 'Methods',
            content: (
              <ApiTable 
                headers={['Method', 'Returns', 'Description']}
                rows={[
                  { name: 'checkValidity()', type: 'boolean', description: 'Returns whether the input fulfills its validation constraints.' },
                  { name: 'reportValidity()', type: 'boolean', description: 'Returns validity and reports validity state to the user.' },
                  { name: 'select()', type: 'void', description: 'Selects all text within the input.' },
                  { name: 'setSelectionRange(start, end, dir?)', type: 'void', description: 'Sets the start and end positions of the current text selection.' },
                ]}
              />
            )
          },
          {
            id: 'events',
            label: 'Events',
            content: (
              <ApiTable 
                headers={['Event Name', 'Description']}
                rows={[
                  { name: 'input', description: 'Fires when the value changes natively.' },
                  { name: 'change', description: 'Fires when the value commits natively.' },
                  { name: 'clear', description: 'Fires when the clear button is clicked.' },
                ]}
              />
            )
          },
          {
            id: 'slots',
            label: 'Slots',
            content: (
              <ApiTable 
                headers={['Slot Name', 'Description']}
                rows={[
                  { name: 'label', description: 'Custom label content.' },
                  { name: 'helper', description: 'Custom helper content.' },
                  { name: 'left-icon', description: 'Left adornment content.' },
                  { name: 'right-icon', description: 'Right adornment content.' },
                ]}
              />
            )
          }
        ]}
      />

      <HeadingAnchor id="frameworks">Framework Usage</HeadingAnchor>
      <FrameworkSupport 
        frameworks={[
          { 
            name: 'Vanilla HTML / JS', 
            support: 'e2e', 
            integration: <p>Native custom element <code style={{fontFamily: 'var(--skyra-font-mono)'}}>&lt;skyra-tech-input&gt;</code> works everywhere.</p> 
          },
          { 
            name: 'React / Next.js', 
            support: 'e2e', 
            integration: <p>Supported via <code style={{fontFamily: 'var(--skyra-font-mono)'}}>@skyra/ui</code> thin adapter <code style={{fontFamily: 'var(--skyra-font-mono)'}}>Input</code>.</p> 
          },
          { name: 'Angular', support: 'architecture', integration: <p>Native attributes via standard bindings.</p> },
          { name: 'Vue 3', support: 'architecture', integration: <p>Native attributes via standard bindings.</p> },
          { name: 'Svelte', support: 'architecture', integration: <p>Native attributes via standard bindings.</p> }
        ]}
      />

      <HeadingAnchor id="accessibility">Accessibility</HeadingAnchor>
      <AccessibilityPanel 
        features={[
          <div key="kb"><strong style={{ color: 'var(--skyra-text)' }}>ElementInternals:</strong> Native form submission, validity reporting, FormData participation.</div>,
          <div key="lbl"><strong style={{ color: 'var(--skyra-text)' }}>Label:</strong> Accessible programmatic association with internal input.</div>,
          <div key="err"><strong style={{ color: 'var(--skyra-text)' }}>Errors:</strong> Automatically manages <code style={{ fontFamily: 'var(--skyra-font-mono)' }}>aria-invalid</code> and <code style={{ fontFamily: 'var(--skyra-font-mono)' }}>aria-describedby</code> for errors/helpers.</div>
        ]}
        codeExample={{
          language: 'html',
          code: `<skyra-tech-input 
  label="Name" 
  error="Required"
>
</skyra-tech-input>`
        }}
      />

      <HeadingAnchor id="styling">Styling & Theming</HeadingAnchor>
      <TokenGrid 
        groups={[
          {
            category: 'Colors',
            tokens: [
              { name: 'Primary', variable: '--skyra-primary', value: 'true' },
              { name: 'Danger', variable: '--skyra-danger', value: 'true' },
              { name: 'Text', variable: '--skyra-text', value: 'true' },
              { name: 'Border', variable: '--skyra-border', value: 'true' },
              { name: 'Background', variable: '--skyra-bg', value: 'true' }
            ]
          }
        ]}
      />

      <HeadingAnchor id="responsive">Responsive Behavior</HeadingAnchor>
      <ResponsiveDemo 
        description="Input expands to 100% of container. Text truncates properly inside the input."
        desktop={<Input label="Handle" defaultValue="@skyra" />}
        mobile={<Input label="Handle" defaultValue="@skyra" />}
        fullWidth={<Input label="Handle" defaultValue="@skyra" />}
      />

      <HeadingAnchor id="related">Related Components</HeadingAnchor>
      <RelatedComponents 
        components={[
          { title: 'Textarea', description: 'Multiline text entry', category: 'Basic Controls', href: '/components/basic-controls/textarea' },
          { title: 'Button', description: 'Trigger actions', category: 'Basic Controls', href: '/components/basic-controls/button' },
          { title: 'Checkbox', description: 'Boolean selection', category: 'Basic Controls', href: '/components/basic-controls/checkbox' },
          { title: 'Dynamic Form', description: 'Schema forms', category: 'Data Entry', href: '/components/data-entry/dynamic-form' }
        ]}
      />

      <HeadingAnchor id="technical">Technical Reference</HeadingAnchor>
      <Callout type="tech" title="SSR / Next.js">
        Safe for Node.js / SSR import.
      </Callout>
      <Callout type="success" title="Testing">
        Axe: 0 violations. Vitest/jsdom verified.
      </Callout>
    </DocsLayout>
  );
}
