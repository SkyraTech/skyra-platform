'use client';

import React, { useState } from 'react';
import { DynamicSelect } from '@skyra/ui';
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

const frameworks = [
  { value: 'react', label: 'React', description: 'Meta', group: 'Frontend' },
  { value: 'vue', label: 'Vue', description: 'Evan You', group: 'Frontend' },
  { value: 'angular', label: 'Angular', description: 'Google', group: 'Frontend' },
  { value: 'svelte', label: 'Svelte', description: 'Rich Harris', group: 'Frontend' },
  { value: 'solid', label: 'Solid', description: 'Ryan Carniato', group: 'Frontend' },
  { value: 'nestjs', label: 'NestJS', description: 'Kamil Mysliwiec', group: 'Backend' },
  { value: 'express', label: 'Express', description: 'TJ Holowaychuk', group: 'Backend' },
  { value: 'fastify', label: 'Fastify', description: 'Matteo Collina', group: 'Backend' },
];

const countries = [
  { value: 'in', label: 'India' },
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'au', label: 'Australia' },
  { value: 'ca', label: 'Canada' },
];

const withDisabled = [
  { value: 'free', label: 'Free Tier', description: 'Up to 5 projects' },
  { value: 'pro', label: 'Pro', description: '$19/month' },
  { value: 'enterprise', label: 'Enterprise', description: 'Contact sales', disabled: true },
  { value: 'legacy', label: 'Legacy (Deprecated)', description: 'No longer available', disabled: true },
];

export default function DynamicSelectDocsPage() {
  const [singleVal, setSingleVal] = useState<any>(null);
  const [searchVal, setSearchVal] = useState<any>(null);
  const [multiVal, setMultiVal] = useState<any[]>([]);
  const [groupedVal, setGroupedVal] = useState<any>(null);
  const [creatableVal, setCreatableVal] = useState<any[]>([]);
  const [loadingVal, setLoadingVal] = useState<any>(null);

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
        title="Dynamic Select"
        description="A framework-independent, feature-rich select component with single/multi-select, search, grouping, creatable options, and full keyboard navigation."
        breadcrumbs={[
          { label: 'Components', href: '/components' },
          { label: 'Selection' },
          { label: 'Dynamic Select' },
        ]}
        badges={[
          { label: 'Stable', variant: 'stable' },
          { label: 'Web Component', variant: 'tech' },
        ]}
      />

      <PackageMeta
        packageName="@skyra-tech-platform/dynamic-select"
        elementName="<skyra-tech-dynamic-select>"
        version="0.1.0"
        type="Web Component"
      />

      <HeadingAnchor id="quick-start">Quick Start</HeadingAnchor>
      <InstallCommand packageName="@skyra-tech-platform/dynamic-select" />

      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--skyra-text)', marginBottom: '1rem', marginTop: '3rem', letterSpacing: '-0.01em' }}>
        Basic Usage
      </h3>
      <LiveExample
        language="html"
        code={`<script type="module">
  import '@skyra-tech-platform/dynamic-select';
</script>

<skyra-tech-dynamic-select
  label="Favorite Framework"
  placeholder="Choose one..."
  id="my-select"
></skyra-tech-dynamic-select>

<script>
  const el = document.getElementById('my-select');
  el.options = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
  ];
  el.addEventListener('skyra-change', e => console.log(e.detail.value));
</script>`}
      >
        <div style={{ width: '100%', maxWidth: '380px', minHeight: '340px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
          <DynamicSelect
            options={frameworks}
            label="Favorite Framework"
            placeholder="Choose one..."
            value={singleVal}
            onChange={setSingleVal}
          />
        </div>
      </LiveExample>

      <HeadingAnchor id="examples">Examples</HeadingAnchor>

      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem' }}>Single Select with Search</h3>
      <LiveExample
        language="tsx"
        title="Searchable & Clearable"
        description="Filter options with full-text search across label, value, and description."
        code={`<DynamicSelect
  options={options}
  label="Search Frameworks"
  searchable
  clearable
  onChange={setValue}
/>`}
      >
        <div style={{ width: '100%', maxWidth: '380px', minHeight: '340px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
          <DynamicSelect
            options={countries}
            label="Country"
            placeholder="Search a country..."
            searchable
            clearable
            value={searchVal}
            onChange={setSearchVal}
          />
        </div>
      </LiveExample>

      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem', marginTop: '2rem' }}>Multi-Select</h3>
      <LiveExample
        language="tsx"
        title="Multiple Selection with Chips"
        description="Select multiple options displayed as removable chip tokens."
        code={`<DynamicSelect
  options={options}
  mode="multiple"
  label="Tech Stack"
  searchable
  clearable
  selectAll
  onChange={setValues}
/>`}
      >
        <div style={{ width: '100%', maxWidth: '480px', minHeight: '340px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
          <DynamicSelect
            options={frameworks}
            mode="multiple"
            label="Tech Stack"
            placeholder="Select frameworks..."
            searchable
            clearable
            selectAll
            value={multiVal}
            onChange={(v) => setMultiVal(v as any[])}
          />
        </div>
      </LiveExample>

      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem', marginTop: '2rem' }}>Grouped Options</h3>
      <LiveExample
        language="tsx"
        title="Option Groups"
        description="Organize options into labeled groups using the group field."
        code={`const options = [
  { value: 'react', label: 'React', group: 'Frontend' },
  { value: 'nestjs', label: 'NestJS', group: 'Backend' },
];

<DynamicSelect
  options={options}
  grouping
  searchable
  onChange={setValue}
/>`}
      >
        <div style={{ width: '100%', maxWidth: '380px', minHeight: '340px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
          <DynamicSelect
            options={frameworks}
            label="Choose by Category"
            placeholder="Select a framework..."
            grouping
            searchable
            value={groupedVal}
            onChange={setGroupedVal}
          />
        </div>
      </LiveExample>

      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem', marginTop: '2rem' }}>Disabled Options</h3>
      <LiveExample
        language="tsx"
        title="Disabled Options"
        description="Individual options can be disabled while others remain selectable."
        code={`const plans = [
  { value: 'free', label: 'Free' },
  { value: 'enterprise', label: 'Enterprise', disabled: true },
];

<DynamicSelect options={plans} onChange={setValue} />`}
      >
        <div style={{ width: '100%', maxWidth: '380px', minHeight: '340px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
          <DynamicSelect
            options={withDisabled}
            label="Subscription Plan"
            placeholder="Choose a plan..."
            onChange={() => {}}
          />
        </div>
      </LiveExample>

      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem', marginTop: '2rem' }}>Creatable Options</h3>
      <LiveExample
        language="tsx"
        title="Allow Create"
        description="When no match is found, allow users to create new options on the fly."
        code={`<DynamicSelect
  options={options}
  mode="multiple"
  searchable
  allowCreate
  onCreateOption={(query) => console.log('Create:', query)}
  onChange={setValues}
/>`}
      >
        <div style={{ width: '100%', maxWidth: '480px', minHeight: '340px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
          <DynamicSelect
            options={frameworks.slice(0, 4)}
            mode="multiple"
            label="Tags (type to create)"
            placeholder="Select or type a new tag..."
            searchable
            clearable
            allowCreate
            value={creatableVal}
            onChange={(v) => setCreatableVal(v as any[])}
            onCreateOption={(q) => console.log('Create:', q)}
          />
        </div>
      </LiveExample>

      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem', marginTop: '2rem' }}>States</h3>
      <LiveExample
        language="tsx"
        title="Loading, Disabled & Error"
        description="Component states for async loading, form disabling, and validation errors."
        code={`<DynamicSelect options={[]} loading label="Loading" onChange={() => {}} />
<DynamicSelect options={options} disabled label="Disabled" onChange={() => {}} />
<DynamicSelect options={options} error="Selection required" label="Error State" onChange={() => {}} />`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '380px', minHeight: '340px', justifyContent: 'flex-start' }}>
          <DynamicSelect
            options={[]}
            loading
            label="Loading options..."
            placeholder="Please wait..."
            value={loadingVal}
            onChange={setLoadingVal}
          />
          <DynamicSelect
            options={frameworks}
            disabled
            label="Disabled Select"
            placeholder="Not editable"
            onChange={() => {}}
          />
          <DynamicSelect
            options={frameworks}
            error="A framework selection is required."
            label="Error State"
            placeholder="Select framework..."
            onChange={() => {}}
          />
        </div>
      </LiveExample>

      <HeadingAnchor id="usage">Usage Guidance</HeadingAnchor>
      <UsageGuidance
        doItems={[
          'Use for selecting from a dynamic or long list of options.',
          'Enable searchable when the options list exceeds 10 items.',
          'Use mode="multiple" with selectAll for bulk selection workflows.',
          'Use grouping to organize large option sets into logical categories.',
          'Provide a descriptive label for every select instance.',
        ]}
        dontItems={[
          'Do not use for 2-5 fixed options — use Radio or native <select> instead.',
          'Do not use for simple binary choices — use Switch or Checkbox.',
          'Do not create new options client-side without syncing to the server.',
        ]}
      />

      <HeadingAnchor id="api">API Reference</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
        The Dynamic Select is a native Web Component. Complex properties like <code style={{ fontFamily: 'var(--skyra-font-mono)', fontSize: '0.85em', color: 'var(--skyra-primary)' }}>options</code> and <code style={{ fontFamily: 'var(--skyra-font-mono)', fontSize: '0.85em', color: 'var(--skyra-primary)' }}>value</code> must be set via DOM property assignment (e.g. <code style={{ fontFamily: 'var(--skyra-font-mono)', fontSize: '0.85em', color: 'var(--skyra-primary)' }}>el.options = [...]</code>), not HTML attributes.
      </p>

      <ApiTabs
        tabs={[
          {
            id: 'props',
            label: 'Properties & Attributes',
            content: (
              <ApiTable
                rows={[
                  { name: 'options', type: 'object[]', defaultVal: '[]', description: 'Array of option objects. Set via DOM property. Supports label, value, group, description, disabled fields.' },
                  { name: 'value', type: 'object | object[]', defaultVal: 'null', description: 'Current selected value(s). Set via DOM property.' },
                  { name: 'mode', type: "'single' | 'multiple'", defaultVal: "'single'", description: 'Selection mode. Use "multiple" for multi-select with chip tokens.' },
                  { name: 'placeholder', type: 'string', defaultVal: "'Select option...'", description: 'Placeholder text shown when nothing is selected.' },
                  { name: 'searchable', type: 'boolean', defaultVal: 'false', description: 'Enables a search input inside the dropdown.' },
                  { name: 'clearable', type: 'boolean', defaultVal: 'false', description: 'Adds a clear button to reset selection.' },
                  { name: 'select-all', type: 'boolean', defaultVal: 'false', description: 'Shows a "Select all" toggle in multi-select mode.' },
                  { name: 'grouping', type: 'boolean', defaultVal: 'false', description: 'Groups options by their group field with section headers.' },
                  { name: 'allow-create', type: 'boolean', defaultVal: 'false', description: 'Allows creating new options when no match is found during search.' },
                  { name: 'loading', type: 'boolean', defaultVal: 'false', description: 'Shows a loading spinner inside the dropdown instead of options.' },
                  { name: 'disabled', type: 'boolean', defaultVal: 'false', description: 'Disables the entire component.' },
                  { name: 'required', type: 'boolean', defaultVal: 'false', description: 'Marks the field as required for form validation.' },
                  { name: 'label', type: 'string', defaultVal: 'undefined', description: 'Field label rendered above the trigger.' },
                  { name: 'description', type: 'string', defaultVal: 'undefined', description: 'Helper text shown below the trigger.' },
                  { name: 'error', type: 'string', defaultVal: 'undefined', description: 'Validation error message. Also sets the trigger to error state.' },
                  { name: 'name', type: 'string', defaultVal: 'undefined', description: 'Form field name for native FormData submission.' },
                  { name: 'max-visible-values', type: "number | 'auto'", defaultVal: "'auto'", description: 'Maximum chip tokens to show before +N overflow badge.' },
                  { name: 'max-selections', type: 'number', defaultVal: 'undefined', description: 'Limits how many options can be selected in multi mode.' },
                  { name: 'max-menu-height', type: 'number', defaultVal: '280', description: 'Maximum height (px) of the dropdown listbox.' },
                  { name: 'dropdown-width', type: "'match' | 'auto' | number", defaultVal: "'match'", description: 'Dropdown width. "match" = trigger width, "auto" = content width, number = px.' },
                ]}
              />
            ),
          },
          {
            id: 'functions',
            label: 'Extractor Functions',
            content: (
              <ApiTable
                headers={['Property', 'Type', 'Description']}
                rows={[
                  { name: 'optionLabel', type: '(opt: T) => string', description: 'Custom label extractor. Defaults to opt.label.' },
                  { name: 'optionValue', type: '(opt: T) => string', description: 'Custom value extractor. Defaults to opt.value.' },
                  { name: 'optionGroup', type: '(opt: T) => string', description: 'Custom group extractor. Defaults to opt.group.' },
                  { name: 'optionDescription', type: '(opt: T) => string', description: 'Custom description extractor. Defaults to opt.description.' },
                  { name: 'optionDisabled', type: '(opt: T) => boolean', description: 'Custom disabled extractor. Defaults to opt.disabled.' },
                ]}
              />
            ),
          },
          {
            id: 'events',
            label: 'Events',
            content: (
              <ApiTable
                headers={['Event Name', 'Detail', 'Description']}
                rows={[
                  { name: 'skyra-change', type: '{ value }', description: 'Fires when selection changes. detail.value is the selected object(s) or null.' },
                  { name: 'skyra-search', type: '{ query }', description: 'Fires when search query changes. detail.query is the current search string.' },
                  { name: 'skyra-create', type: '{ query }', description: 'Fires when user creates a new option. detail.query is the typed value.' },
                  { name: 'skyra-open', type: '{}', description: 'Fires when the dropdown opens.' },
                  { name: 'skyra-close', type: '{}', description: 'Fires when the dropdown closes.' },
                ]}
              />
            ),
          },
          {
            id: 'keyboard',
            label: 'Keyboard',
            content: (
              <ApiTable
                headers={['Key', 'Context', 'Action']}
                rows={[
                  { name: 'Enter / Space / ArrowDown / ArrowUp', type: 'Trigger focused', description: 'Opens the dropdown.' },
                  { name: 'ArrowDown', type: 'Dropdown open', description: 'Moves focus to the next option.' },
                  { name: 'ArrowUp', type: 'Dropdown open', description: 'Moves focus to the previous option.' },
                  { name: 'Home', type: 'Dropdown open', description: 'Moves focus to the first option.' },
                  { name: 'End', type: 'Dropdown open', description: 'Moves focus to the last option.' },
                  { name: 'Enter', type: 'Option focused', description: 'Selects the focused option.' },
                  { name: 'Escape', type: 'Dropdown open', description: 'Closes the dropdown and returns focus to trigger.' },
                  { name: 'Tab', type: 'Dropdown open', description: 'Closes the dropdown.' },
                  { name: 'Backspace', type: 'Multi, trigger focused', description: 'Removes the last selected chip token.' },
                ]}
              />
            ),
          },
        ]}
      />

      <HeadingAnchor id="frameworks">Framework Usage</HeadingAnchor>
      <FrameworkSupport
        frameworks={[
          {
            name: 'Vanilla HTML / JS',
            support: 'e2e',
            integration: <p>Use <code style={{ fontFamily: 'var(--skyra-font-mono)' }}>&lt;skyra-tech-dynamic-select&gt;</code> directly. Set <code style={{ fontFamily: 'var(--skyra-font-mono)' }}>el.options = [...]</code> and listen for <code style={{ fontFamily: 'var(--skyra-font-mono)' }}>skyra-change</code>.</p>,
          },
          {
            name: 'React / Next.js',
            support: 'e2e',
            integration: <p>Supported via <code style={{ fontFamily: 'var(--skyra-font-mono)' }}>@skyra/ui</code> thin adapter <code style={{ fontFamily: 'var(--skyra-font-mono)' }}>DynamicSelect</code>. All complex props are bridged via DOM property assignment.</p>,
          },
          { name: 'Angular', support: 'architecture', integration: <p>Use native custom element. Bind <code style={{ fontFamily: 'var(--skyra-font-mono)' }}>[options]</code> and listen with <code style={{ fontFamily: 'var(--skyra-font-mono)' }}>(skyra-change)</code>.</p> },
          { name: 'Vue 3', support: 'architecture', integration: <p>Bind via <code style={{ fontFamily: 'var(--skyra-font-mono)' }}>:options</code> (DOM property) and <code style={{ fontFamily: 'var(--skyra-font-mono)' }}>@skyra-change</code>.</p> },
          { name: 'Svelte', support: 'architecture', integration: <p>Bind via <code style={{ fontFamily: 'var(--skyra-font-mono)' }}>bind:this</code>, set <code style={{ fontFamily: 'var(--skyra-font-mono)' }}>el.options</code> in <code style={{ fontFamily: 'var(--skyra-font-mono)' }}>onMount</code>.</p> },
        ]}
      />

      <HeadingAnchor id="accessibility">Accessibility</HeadingAnchor>
      <AccessibilityPanel
        features={[
          <div key="combobox"><strong style={{ color: 'var(--skyra-text)' }}>Combobox role:</strong> Trigger uses <code style={{ fontFamily: 'var(--skyra-font-mono)' }}>aria-expanded</code> and <code style={{ fontFamily: 'var(--skyra-font-mono)' }}>aria-controls</code> to link to the listbox.</div>,
          <div key="listbox"><strong style={{ color: 'var(--skyra-text)' }}>Listbox role:</strong> Dropdown uses <code style={{ fontFamily: 'var(--skyra-font-mono)' }}>role="listbox"</code> with <code style={{ fontFamily: 'var(--skyra-font-mono)' }}>aria-selected</code> and <code style={{ fontFamily: 'var(--skyra-font-mono)' }}>aria-disabled</code> on each option.</div>,
          <div key="keyboard"><strong style={{ color: 'var(--skyra-text)' }}>Full keyboard navigation:</strong> Arrow keys, Home/End, Enter, Escape, Tab, Backspace all handled per WAI-ARIA Combobox pattern.</div>,
          <div key="form"><strong style={{ color: 'var(--skyra-text)' }}>ElementInternals:</strong> Participates in native form submission via <code style={{ fontFamily: 'var(--skyra-font-mono)' }}>FormData</code>. Multi-select uses multiple <code style={{ fontFamily: 'var(--skyra-font-mono)' }}>fd.append()</code> entries.</div>,
        ]}
        codeExample={{
          language: 'html',
          code: `<skyra-tech-dynamic-select
  label="Frameworks"
  required
  name="stack"
  id="framework-select"
></skyra-tech-dynamic-select>`,
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
              { name: 'Muted Text', variable: '--skyra-text-muted', value: 'true' },
              { name: 'Border', variable: '--skyra-border', value: 'true' },
              { name: 'Background', variable: '--skyra-bg', value: 'true' },
              { name: 'Surface', variable: '--skyra-surface', value: 'true' },
            ],
          },
        ]}
      />

      <HeadingAnchor id="responsive">Responsive Behavior</HeadingAnchor>
      <ResponsiveDemo
        description="The Dynamic Select expands to 100% of its container. Chip tokens overflow into a +N badge when the trigger becomes too narrow. Dropdown opens relative to the trigger and remains within viewport bounds."
        desktop={
          <DynamicSelect
            options={frameworks}
            label="Framework"
            placeholder="Select..."
            onChange={() => {}}
          />
        }
        mobile={
          <DynamicSelect
            options={frameworks}
            label="Framework"
            placeholder="Select..."
            onChange={() => {}}
          />
        }
        fullWidth={
          <DynamicSelect
            options={frameworks}
            label="Framework"
            placeholder="Select..."
            onChange={() => {}}
          />
        }
      />

      <HeadingAnchor id="related">Related Components</HeadingAnchor>
      <RelatedComponents
        components={[
          { title: 'Input', description: 'Single-line text entry', category: 'Basic Controls', href: '/components/basic-controls/input' },
          { title: 'Checkbox', description: 'Boolean multi-selection', category: 'Basic Controls', href: '/components/basic-controls/checkbox' },
          { title: 'Radio', description: 'Single selection from a set', category: 'Basic Controls', href: '/components/basic-controls/radio' },
          { title: 'Switch', description: 'Binary on/off toggle', category: 'Basic Controls', href: '/components/basic-controls/switch' },
        ]}
      />

      <HeadingAnchor id="technical">Technical Reference</HeadingAnchor>
      <Callout type="tech" title="SSR / Next.js">
        Safe for Node.js / SSR import. Custom element registration is guarded with <code>typeof customElements !== &apos;undefined&apos;</code> and only runs in the browser.
      </Callout>
      <Callout type="tech" title="Complex Properties">
        The <code>options</code> and <code>value</code> properties are JavaScript objects — they must be set via DOM property assignment, not HTML attributes. The React adapter bridges this automatically via <code>useEffect</code>.
      </Callout>
      <Callout type="success" title="Form Support">
        Uses ElementInternals for native form participation. Multi-select uses <code>FormData.append()</code> to submit multiple values under the same name field.
      </Callout>
    </DocsLayout>
  );
}
