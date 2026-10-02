'use client';

import React from 'react';
import { Textarea } from '@skyra/ui';
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

export default function TextareaDocsPage() {
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
        title="Textarea"
        description="Framework-independent, auto-resizing textarea component for multi-line data entry."
        breadcrumbs={[
          { label: 'Components', href: '/components' },
          { label: 'Basic Controls' },
          { label: 'Textarea' }
        ]}
        badges={[
          { label: 'Stable', variant: 'stable' },
          { label: 'Web Component', variant: 'tech' }
        ]}
      />

      <PackageMeta 
        packageName="@skyra-tech-platform/textarea"
        elementName="<skyra-tech-textarea>"
        version="0.1.0"
        type="Web Component"
      />

      <HeadingAnchor id="quick-start">Quick Start</HeadingAnchor>
      <InstallCommand packageName="@skyra-tech-platform/textarea" />
      
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--skyra-text)', marginBottom: '1rem', marginTop: '3rem', letterSpacing: '-0.01em' }}>
        Basic Usage
      </h3>
      <LiveExample 
        language="html"
        code={`<script type="module">
  import '@skyra-tech-platform/textarea';
</script>

<skyra-tech-textarea placeholder="Enter your notes..." label="Notes"></skyra-tech-textarea>`}
      >
        <Textarea label="Notes" placeholder="Enter your notes..." />
      </LiveExample>

      <HeadingAnchor id="examples">Examples</HeadingAnchor>
      
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem' }}>Auto Resizing</h3>
      <LiveExample 
        language="tsx"
        title="Auto Resizing"
        description="Automatically adjusts height based on content."
        code={`<Textarea label="Auto Resizing" autoResize minRows={2} maxRows={5} placeholder="Type multiple lines..." />`}
      >
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <Textarea label="Auto Resizing" autoResize minRows={2} maxRows={5} placeholder="Type multiple lines..." />
        </div>
      </LiveExample>

      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem' }}>Fixed / Controlled Rows</h3>
      <LiveExample 
        language="tsx"
        title="Fixed Rows"
        description="Textarea with a fixed number of rows."
        code={`<Textarea label="Fixed Rows" rows={4} placeholder="Always 4 rows tall..." />`}
      >
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <Textarea label="Fixed Rows" rows={4} placeholder="Always 4 rows tall..." />
        </div>
      </LiveExample>

      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem' }}>Validation States</h3>
      <LiveExample 
        language="tsx"
        title="Validation"
        description="Required fields and error states."
        code={`<Textarea label="Required" required placeholder="Cannot be empty" />
<Textarea label="Error State" error="This field is required." defaultValue="Invalid text" />`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '400px' }}>
          <Textarea label="Required" required placeholder="Cannot be empty" />
          <Textarea label="Error State" error="This field is required." defaultValue="Invalid text" />
        </div>
      </LiveExample>

      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem' }}>Character Count</h3>
      <LiveExample 
        language="tsx"
        title="Character Count"
        description="Display character count limit."
        code={`<Textarea label="Biography" showCount maxLength={100} defaultValue="A brief note." />`}
      >
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <Textarea label="Biography" showCount maxLength={100} defaultValue="A brief note." />
        </div>
      </LiveExample>

      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem' }}>Disabled and Readonly</h3>
      <LiveExample 
        language="tsx"
        title="Disabled and Readonly"
        description="Textareas that cannot be edited."
        code={`<Textarea label="Disabled" disabled defaultValue="You cannot edit this." />
<Textarea label="Readonly" readOnly defaultValue="Fixed text." />`}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', width: '100%', maxWidth: '800px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--skyra-text-muted)', textTransform: 'uppercase' }}>Disabled</span>
            <Textarea disabled defaultValue="You cannot edit this." />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--skyra-text-muted)', textTransform: 'uppercase' }}>Readonly</span>
            <Textarea readOnly defaultValue="Fixed text." />
          </div>
        </div>
      </LiveExample>

      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem' }}>With Helper Text</h3>
      <LiveExample 
        language="tsx"
        title="Helper Text"
        description="Helpful description displayed below the textarea."
        code={`<Textarea label="Helper Text" helperText="Helpful description goes here." />`}
      >
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <Textarea label="Helper Text" helperText="Helpful description goes here." />
        </div>
      </LiveExample>

      <HeadingAnchor id="usage">Usage Guidance</HeadingAnchor>
      <UsageGuidance 
        doItems={[
          'Use for multiline text data like comments, notes, or messages.',
          'Provide a clear label and helper text for ambiguous fields.',
          'Use autoResize to prevent uncomfortable internal scrolling for long text.'
        ]}
        dontItems={[
          'Do not use for short, single-line text (use Input instead).',
          'Do not rely solely on placeholder text for labels as they disappear.'
        ]}
      />

      <HeadingAnchor id="api">API Reference</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
        Skyra Platform uses Web Components. This means properties can be accessed via DOM properties (<code style={{ fontFamily: 'var(--skyra-font-mono)', fontSize: '0.85em', color: 'var(--skyra-primary)' }}>textarea.autoResize = true</code>) and attributes via HTML (<code style={{ fontFamily: 'var(--skyra-font-mono)', fontSize: '0.85em', color: 'var(--skyra-primary)' }}>auto-resize</code>).
      </p>

      <ApiTabs 
        tabs={[
          {
            id: 'props',
            label: 'Properties & Attributes',
            content: (
              <ApiTable 
                rows={[
                  { name: 'value', type: 'string', defaultVal: "''", description: 'Value of the textarea.' },
                  { name: 'disabled', type: 'boolean', defaultVal: 'false', description: 'Visually and functionally disables the textarea.' },
                  { name: 'readonly', type: 'boolean', defaultVal: 'false', description: 'Makes the textarea read-only.' },
                  { name: 'required', type: 'boolean', defaultVal: 'false', description: 'Makes the textarea required for form submission.' },
                  { name: 'label', type: 'string', defaultVal: 'undefined', description: 'Label text for the textarea.' },
                  { name: 'helper-text', type: 'string', defaultVal: 'undefined', description: 'Helper text displayed below the textarea.' },
                  { name: 'error', type: 'string', defaultVal: 'undefined', description: 'Error message. Setting this turns the textarea invalid.' },
                  { name: 'auto-resize', type: 'boolean', defaultVal: 'false', description: 'Automatically resize height based on content.' },
                  { name: 'min-rows', type: 'number', defaultVal: '3', description: 'Minimum number of rows for auto-resizing.' },
                  { name: 'max-rows', type: 'number', defaultVal: 'undefined', description: 'Maximum number of rows for auto-resizing. Will scroll if exceeded.' },
                  { name: 'show-count', type: 'boolean', defaultVal: 'false', description: 'Displays character count. Requires maxlength.' },
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
                  { name: 'checkValidity()', type: 'boolean', description: 'Returns whether the textarea fulfills its validation constraints.' },
                  { name: 'reportValidity()', type: 'boolean', description: 'Returns validity and reports validity state to the user.' },
                  { name: 'select()', type: 'void', description: 'Selects all text within the textarea.' },
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
            integration: <p>No wrapper needed. Import <code style={{fontFamily: 'var(--skyra-font-mono)'}}>@skyra-tech-platform/textarea</code> and use <code style={{fontFamily: 'var(--skyra-font-mono)'}}>&lt;skyra-tech-textarea&gt;</code> natively.</p> 
          },
          { 
            name: 'React / Next.js', 
            support: 'e2e', 
            integration: <p>Full support via the thin wrapper in <code style={{fontFamily: 'var(--skyra-font-mono)'}}>@skyra/ui</code>. Strongly typed with React event delegation.</p> 
          },
          { 
            name: 'Angular', 
            support: 'architecture', 
            integration: <p>Native attributes via standard bindings.</p> 
          },
          { 
            name: 'Vue 3', 
            support: 'architecture', 
            integration: <p>Native attributes via standard bindings.</p> 
          },
          { 
            name: 'Svelte', 
            support: 'architecture', 
            integration: <p>Native attributes via standard bindings.</p> 
          }
        ]}
      />

      <HeadingAnchor id="accessibility">Accessibility</HeadingAnchor>
      <AccessibilityPanel 
        features={[
          <div key="kb"><strong style={{ color: 'var(--skyra-text)' }}>ElementInternals:</strong> Native form submission, validity reporting, FormData participation.</div>,
          <div key="lbl"><strong style={{ color: 'var(--skyra-text)' }}>Label:</strong> Accessible programmatic association with internal textarea.</div>,
          <div key="err"><strong style={{ color: 'var(--skyra-text)' }}>Errors:</strong> Automatically manages <code style={{ fontFamily: 'var(--skyra-font-mono)' }}>aria-invalid</code> and <code style={{ fontFamily: 'var(--skyra-font-mono)' }}>aria-describedby</code> for errors/helpers.</div>
        ]}
        codeExample={{
          language: 'html',
          code: `<skyra-tech-textarea 
  label="Notes" 
  error="Required"
>
</skyra-tech-textarea>`
        }}
      />

      <HeadingAnchor id="styling">Styling & Theming</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.6, marginBottom: '2.5rem' }}>
        The component reads its colors from the <code style={{fontFamily: 'var(--skyra-font-mono)'}}>@skyra/design-tokens</code> layer.
        Dark mode and light mode are handled completely natively via the token variables without JavaScript.
      </p>
      
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
          },
          {
            category: 'Focus',
            tokens: [
              { name: 'Focus Ring', variable: '--skyra-focus-ring' }
            ]
          },
          {
            category: 'Layout',
            tokens: [
              { name: 'Radius', variable: '--skyra-radius-md' }
            ]
          }
        ]}
      />

      <HeadingAnchor id="responsive">Responsive Behavior</HeadingAnchor>
      <ResponsiveDemo 
        description="Textarea expands to 100% of container width. When autoResize is true, it adjusts its height based on the text wrapping across different viewports."
        desktop={<Textarea label="Notes" defaultValue="Some long text..." />}
        mobile={<Textarea label="Notes" defaultValue="Some long text..." />}
        fullWidth={<Textarea label="Notes" defaultValue="Some long text..." />}
      />

      <HeadingAnchor id="related">Related Components</HeadingAnchor>
      <RelatedComponents 
        components={[
          { title: 'Input', description: 'Single-line text entry', category: 'Basic Controls', href: '/components/basic-controls/input' },
          { title: 'Button', description: 'Trigger actions', category: 'Basic Controls', href: '/components/basic-controls/button' },
          { title: 'Checkbox', description: 'Boolean selection', category: 'Basic Controls', href: '/components/basic-controls/checkbox' },
          { title: 'Dynamic Form', description: 'Schema forms', category: 'Data Entry', href: '/components/data-entry/dynamic-form' }
        ]}
      />

      <HeadingAnchor id="technical">Technical Reference</HeadingAnchor>
      <Callout type="tech" title="SSR / Next.js">
        Safe for Node.js / SSR import. The custom element definition is guarded by <code style={{fontFamily: 'var(--skyra-font-mono)'}}>typeof window !== 'undefined'</code>.
      </Callout>
      <Callout type="tech" title="React Adapter">
        Use the React adapter correctly inside client components where required via <code style={{fontFamily: 'var(--skyra-font-mono)'}}>'use client'</code>.
      </Callout>
      <Callout type="tech" title="ResizeObserver">
        Uses <code style={{fontFamily: 'var(--skyra-font-mono)'}}>ResizeObserver</code> for high-performance auto-resizing without layout thrashing.
      </Callout>
      <Callout type="success" title="Testing">
        Axe: 0 violations. Vitest/jsdom verified.
      </Callout>
    </DocsLayout>
  );
}
