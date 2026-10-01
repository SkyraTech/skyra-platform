'use client';

import { Switch } from '@skyra/ui';
import { useState } from 'react';

export default function SwitchDocsPage() {
  const [airplaneMode, setAirplaneMode] = useState(false);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-2">Switch</h1>
        <p className="text-[var(--skyra-text-subtle)]">Framework-independent toggle switch component.</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--skyra-border)] pb-2">Overview</h2>
        <p className="text-[var(--skyra-text-subtle)] max-w-3xl mb-4">
          The Skyra Tech Switch is a native Web Component (`&lt;skyra-tech-switch&gt;`) supporting various visual variants (default, compact, labeled, icon, outline) and sizes. It safely isolates its visual states inside a Shadow DOM and correctly reports state to standard web forms and accessibility tools.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--skyra-border)] pb-2">Installation</h2>
        <div className="bg-[var(--skyra-bg-subtle)] p-4 rounded-md border border-[var(--skyra-border)] font-mono text-sm mb-4">
          pnpm add @skyra-tech-platform/switch
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--skyra-border)] pb-2">Framework Usage</h2>
        <h3 className="text-lg font-semibold mb-2">React / Next.js Wrapper</h3>
        <p className="text-[var(--skyra-text-subtle)] mb-4">
          Use the `Switch` component exported from `@skyra/ui` for seamless React JSX mapping.
        </p>
        <pre className="bg-[var(--skyra-bg-subtle)] p-4 rounded-md border border-[var(--skyra-border)] overflow-x-auto text-sm mb-6">
          <code>{`import { Switch } from '@skyra/ui';

<Switch label="Airplane Mode" variant="icon" />`}</code>
        </pre>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--skyra-border)] pb-2">Interactive Example</h2>
        <div className="p-8 border border-[var(--skyra-border)] rounded-md flex flex-col gap-4 max-w-sm">
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
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--skyra-border)] pb-2">Variants & Sizes</h2>
        <div className="p-8 border border-[var(--skyra-border)] rounded-md flex flex-col gap-6 max-w-sm">
          <Switch label="Default" />
          <Switch label="Compact" variant="compact" />
          <Switch label="Labeled" variant="labeled" checked={true} />
          <Switch label="Icon" variant="icon" checked={true} />
          <Switch label="Outline" variant="outline" checked={true} />
          
          <div className="border-t border-[var(--skyra-border)] pt-4 mt-2">
            <Switch label="Small Size" size="sm" />
            <Switch label="Medium Size" size="md" className="mt-2" />
            <Switch label="Large Size" size="lg" className="mt-2" />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--skyra-border)] pb-2">States & Validation</h2>
        <div className="p-8 border border-[var(--skyra-border)] rounded-md flex flex-col gap-6 max-w-sm">
          <Switch label="Error State" error="Feature unavailable in current plan." />
          <Switch label="Disabled Unchecked" disabled />
          <Switch label="Disabled Checked" disabled checked={true} />
          <Switch label="Loading State" loading checked={true} />
          <Switch label="Readonly State" readOnly checked={true} />
        </div>
      </section>
      
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--skyra-border)] pb-2">Accessibility</h2>
        <ul className="list-disc list-inside text-[var(--skyra-text-subtle)] space-y-2">
          <li>Implements native form association (`ElementInternals`).</li>
          <li>Labels and helpers are programmatically linked to the inner native button using dynamically generated unique IDs across the Shadow Boundary.</li>
          <li>Properly exposes `role="switch"` and updates `aria-checked`.</li>
          <li>Supports native `Spacebar` and `Enter` key interactions natively because it utilizes a real `&lt;button&gt;` internally.</li>
        </ul>
      </section>
    </div>
  );
}
