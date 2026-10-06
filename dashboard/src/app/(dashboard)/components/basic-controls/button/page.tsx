'use client';

import React, { useState } from 'react';
import { Button } from '@skyra/ui';
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
import { ArrowRight, Trash2, Mail } from 'lucide-react';

export default function ButtonDocsPage() {
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
        title="Button"
        description="Framework-independent, accessible button component built with native Web Components."
        breadcrumbs={[
          { label: 'Components', href: '/components' },
          { label: 'Basic Controls' },
          { label: 'Button' }
        ]}
        badges={[
          { label: 'Stable', variant: 'stable' },
          { label: 'Web Component', variant: 'tech' }
        ]}
      />

      <PackageMeta 
        packageName="@skyra-tech-platform/button"
        elementName="<skyra-tech-button>"
        version="0.1.0"
        type="Web Component"
      />

      <HeadingAnchor id="quick-start">Quick Start</HeadingAnchor>
      <InstallCommand packageName="@skyra-tech-platform/button" />
      
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--skyra-text)', marginBottom: '1rem', marginTop: '3rem', letterSpacing: '-0.01em' }}>
        Basic Usage
      </h3>
      <LiveExample 
        language="html"
        code={`<script type="module">
  import '@skyra-tech-platform/button';
</script>

<skyra-tech-button variant="primary">
  Save changes
</skyra-tech-button>`}
      >
        <Button variant="primary">Save changes</Button>
      </LiveExample>

      <HeadingAnchor id="examples">Examples</HeadingAnchor>
      
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem' }}>Variants</h3>
      <LiveExample 
        language="tsx"
        title="Variants"
        description="Compare the available visual variants."
        code={`<Button variant="primary">Primary</Button>
<Button variant="orange">Orange</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
<Button variant="link">Link</Button>`}
      >
        <Button variant="primary">Primary</Button>
        <Button variant="orange">Orange</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="link">Link</Button>
      </LiveExample>

      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem' }}>Sizes</h3>
      <LiveExample 
        language="tsx"
        title="Sizes"
        description="Choose the appropriate button size for your layout."
        code={`<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`}
      >
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </LiveExample>

      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem' }}>States</h3>
      <LiveExample 
        language="tsx"
        title="States"
        description="See disabled, loading, and full-width states."
        code={`<Button disabled>Disabled</Button>
<Button isLoading loadingText="Saving...">Loading</Button>
<Button fullWidth>Full Width Button</Button>`}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', width: '100%', maxWidth: '800px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--skyra-text-muted)', textTransform: 'uppercase' }}>Disabled</span>
            <div><Button disabled>Disabled</Button></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--skyra-text-muted)', textTransform: 'uppercase' }}>Loading</span>
            <div>
              <Button 
                isLoading={loading1} 
                loadingText="Saving..." 
                onClick={() => {
                  setLoading1(true);
                  setTimeout(() => setLoading1(false), 2000);
                }}
              >
                Click to load
              </Button>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--skyra-text-muted)', textTransform: 'uppercase' }}>Full Width</span>
            <div style={{ width: '100%' }}>
              <Button fullWidth>Full Width Button</Button>
            </div>
          </div>
        </div>
      </LiveExample>

      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem' }}>Icons</h3>
      <LiveExample 
        language="tsx"
        title="Icons"
        description="Buttons can include leading and trailing icons, or be icon-only."
        code={`<Button leftIcon={<Mail size={16} />}>Email</Button>
<Button rightIcon={<ArrowRight size={16} />}>Continue</Button>
<Button iconOnly aria-label="Delete" variant="danger">
  <Trash2 size={18} />
</Button>`}
      >
        <Button leftIcon={<Mail size={16} />}>Email</Button>
        <Button rightIcon={<ArrowRight size={16} />}>Continue</Button>
        <Button iconOnly aria-label="Delete" variant="danger">
          <Trash2 size={18} />
        </Button>
      </LiveExample>

      <HeadingAnchor id="usage">Usage Guidance</HeadingAnchor>
      <UsageGuidance 
        doItems={[
          'Submitting or resetting a form.',
          'Triggering an action like opening a dialog or saving data.',
          'Advancing a wizard or multi-step flow.'
        ]}
        dontItems={[
          'Navigating to a different URL or page (use an anchor link instead).',
          'Toggling complex states where a Checkbox or Switch is more semantically appropriate.'
        ]}
      />

      <HeadingAnchor id="api">API Reference</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
        Skyra Platform uses Web Components. This means properties can be accessed via DOM properties (<code style={{ fontFamily: 'var(--skyra-font-mono)', fontSize: '0.85em', color: 'var(--skyra-primary)' }}>button.variant = 'orange'</code>) and attributes via HTML (<code style={{ fontFamily: 'var(--skyra-font-mono)', fontSize: '0.85em', color: 'var(--skyra-primary)' }}>variant="orange"</code>).
      </p>

      <ApiTabs 
        tabs={[
          {
            id: 'props',
            label: 'Properties & Attributes',
            content: (
              <ApiTable 
                rows={[
                  { name: 'variant', type: "'primary' | 'orange' | 'outline' | 'ghost' | 'danger' | 'link'", defaultVal: "'primary'", description: 'The visual style of the button.' },
                  { name: 'size', type: "'sm' | 'md' | 'lg'", defaultVal: "'md'", description: 'The size of the button.' },
                  { name: 'type', type: "'button' | 'submit' | 'reset'", defaultVal: "'button'", description: 'Native button type. If submit, it will submit the associated parent form.' },
                  { name: 'disabled', type: 'boolean', defaultVal: 'false', description: 'If true, the button is non-interactive and visually disabled.' },
                  { name: 'loading', type: 'boolean', defaultVal: 'false', description: 'Shows a spinner and prevents interaction.' },
                  { name: 'loadingText', type: 'string', defaultVal: "''", description: 'Visually hidden text announced by screen readers when loading.' },
                  { name: 'fullWidth', type: 'boolean', defaultVal: 'false', description: 'Sets the button to stretch to 100% of its container.' },
                  { name: 'iconOnly', type: 'boolean', defaultVal: 'false', description: 'Adjusts padding for icon-only buttons. Must be used with aria-label.' },
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
                  { name: 'checkValidity()', type: 'boolean', description: 'Returns whether the button fulfills its validation constraints.' },
                  { name: 'reportValidity()', type: 'boolean', description: 'Returns validity and reports validity state to the user.' },
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
                  { name: '(default)', description: 'The main text/content of the button.' },
                  { name: 'left-icon', description: 'Icon rendered before the main text. Hidden while loading.' },
                  { name: 'right-icon', description: 'Icon rendered after the main text. Hidden while loading.' },
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
            integration: <p>No wrapper needed. Import <code style={{fontFamily: 'var(--skyra-font-mono)'}}>@skyra-tech-platform/button</code> and use <code style={{fontFamily: 'var(--skyra-font-mono)'}}>&lt;skyra-tech-button&gt;</code> natively.</p> 
          },
          { 
            name: 'React / Next.js', 
            support: 'e2e', 
            integration: <p>Full support via the thin wrapper in <code style={{fontFamily: 'var(--skyra-font-mono)'}}>@skyra/ui</code>. Strongly typed with React event delegation.</p> 
          },
          { 
            name: 'Angular', 
            support: 'architecture', 
            integration: <p>Bind attributes via <code style={{fontFamily: 'var(--skyra-font-mono)'}}>[attr.variant]="..."</code> and properties via <code style={{fontFamily: 'var(--skyra-font-mono)'}}>[disabled]="..."</code>.</p> 
          },
          { 
            name: 'Vue 3', 
            support: 'architecture', 
            integration: <p>Use <code style={{fontFamily: 'var(--skyra-font-mono)'}}>.prop</code> modifiers for complex properties, otherwise standard bindings.</p> 
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
          <div key="kb"><strong style={{ color: 'var(--skyra-text)' }}>Keyboard:</strong> Tab → focus, Enter / Space → activate</div>,
          <div key="fc"><strong style={{ color: 'var(--skyra-text)' }}>Focus:</strong> <code style={{ fontFamily: 'var(--skyra-font-mono)' }}>:focus-visible</code>, <code style={{ fontFamily: 'var(--skyra-font-mono)' }}>--skyra-focus-ring</code></div>,
          <div key="ds"><strong style={{ color: 'var(--skyra-text)' }}>Disabled:</strong> <code style={{ fontFamily: 'var(--skyra-font-mono)' }}>aria-disabled="true"</code></div>,
          <div key="ld"><strong style={{ color: 'var(--skyra-text)' }}>Loading:</strong> <code style={{ fontFamily: 'var(--skyra-font-mono)' }}>aria-busy="true"</code></div>,
          <div key="ic"><strong style={{ color: 'var(--skyra-text)' }}>Icon Only:</strong> <code style={{ fontFamily: 'var(--skyra-font-mono)' }}>aria-label</code> required</div>
        ]}
        codeExample={{
          language: 'html',
          code: `<skyra-tech-button 
  icon-only 
  aria-label="Delete"
>
  <svg>...</svg>
</skyra-tech-button>`
        }}
      />

      <HeadingAnchor id="styling">Styling & Theming</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.6, marginBottom: '2.5rem' }}>
        The component reads its colors from the <code style={{fontFamily: 'var(--skyra-font-mono)'}}>@skyra-tech-platform/design-tokens</code> layer.
        Dark mode and light mode are handled completely natively via the token variables without JavaScript.
      </p>
      
      <TokenGrid 
        groups={[
          {
            category: 'Colors',
            tokens: [
              { name: 'Primary', variable: '--skyra-primary', value: 'true' },
              { name: 'Primary Hover', variable: '--skyra-primary-hover', value: 'true' },
              { name: 'Orange', variable: '--skyra-orange', value: 'true' },
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
          },
          {
            category: 'Typography',
            tokens: [
              { name: 'Body Font', variable: '--skyra-font-body' }
            ]
          },
          {
            category: 'Motion',
            tokens: [
              { name: 'Duration', variable: '--skyra-duration-fast' }
            ]
          }
        ]}
      />

      <HeadingAnchor id="responsive">Responsive Behavior</HeadingAnchor>
      <ResponsiveDemo 
        description="The button natively handles text truncation if constrained. When fullWidth is true, it expands to 100% of its containing block, making it ideal for mobile bottom sheets or narrow forms. Touch targets are maintained at a minimum of 44x44px across all viewports to comply with WCAG 2.1 mobile requirements."
        desktop={<Button variant="primary">Submit Data</Button>}
        mobile={<Button variant="primary">Submit</Button>}
        fullWidth={<Button variant="primary" fullWidth>Submit Form</Button>}
      />

      <HeadingAnchor id="related">Related Components</HeadingAnchor>
      <RelatedComponents 
        components={[
          { title: 'Input', description: 'Form text entry', category: 'Basic Controls', href: '/components/basic-controls/input' },
          { title: 'Textarea', description: 'Multiline text entry', category: 'Basic Controls', href: '/components/basic-controls/textarea' },
          { title: 'Checkbox', description: 'Boolean selection', category: 'Basic Controls', href: '/components/basic-controls/checkbox' },
          { title: 'Switch', description: 'Toggling state', category: 'Basic Controls', href: '/components/basic-controls/switch' }
        ]}
      />

      <HeadingAnchor id="technical">Technical Reference</HeadingAnchor>
      <Callout type="tech" title="SSR / Next.js">
        Safe for Node.js / SSR import. The custom element definition is guarded by <code style={{fontFamily: 'var(--skyra-font-mono)'}}>typeof window !== 'undefined'</code>.
      </Callout>
      <Callout type="tech" title="React Adapter">
        Use the React adapter correctly inside client components where required via <code style={{fontFamily: 'var(--skyra-font-mono)'}}>'use client'</code>.
      </Callout>
      <Callout type="success" title="Testing">
        Axe: 0 violations. Vitest/jsdom verified.
      </Callout>
    </DocsLayout>
  );
}
