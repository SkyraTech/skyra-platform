'use client';

import { Radio } from '@skyra/ui';
import { useState } from 'react';

export default function RadioDocsPage() {
  const [selected, setSelected] = useState('free');

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-2">Radio</h1>
        <p className="text-[var(--skyra-text-subtle)]">Framework-independent radio component for single-choice selections.</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--skyra-border)] pb-2">Overview</h2>
        <p className="text-[var(--skyra-text-subtle)] max-w-3xl mb-4">
          The Skyra Tech Radio is a framework-independent component authored as a native Web Component (`&lt;skyra-tech-radio&gt;`). It natively handles checked states, form association, cross-shadow-boundary grouping, and validation errors without relying on React internals.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--skyra-border)] pb-2">Installation</h2>
        <div className="bg-[var(--skyra-bg-subtle)] p-4 rounded-md border border-[var(--skyra-border)] font-mono text-sm mb-4">
          pnpm add @skyra-tech-platform/radio
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--skyra-border)] pb-2">Framework Usage</h2>
        <h3 className="text-lg font-semibold mb-2">Vanilla HTML</h3>
        <pre className="bg-[var(--skyra-bg-subtle)] p-4 rounded-md border border-[var(--skyra-border)] overflow-x-auto text-sm mb-6">
          <code>{`<script type="module">
  import '@skyra-tech-platform/radio';
</script>

<skyra-tech-radio name="plan" value="basic" label="Basic Plan"></skyra-tech-radio>
<skyra-tech-radio name="plan" value="pro" label="Pro Plan" checked></skyra-tech-radio>`}</code>
        </pre>

        <h3 className="text-lg font-semibold mb-2">React / Next.js</h3>
        <p className="text-[var(--skyra-text-subtle)] mb-4">
          The platform exposes a lightweight wrapper inside `@skyra/ui` that passes refs and handles React synthetic events cleanly.
        </p>
        <pre className="bg-[var(--skyra-bg-subtle)] p-4 rounded-md border border-[var(--skyra-border)] overflow-x-auto text-sm mb-6">
          <code>{`import { Radio } from '@skyra/ui';

<Radio name="theme" value="light" label="Light theme" helper="Default appearance" />`}</code>
        </pre>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--skyra-border)] pb-2">Basic Examples</h2>
        <div className="p-8 border border-[var(--skyra-border)] rounded-md flex flex-col gap-6 max-w-sm">
          <Radio name="ex1" value="1" label="Standard Radio 1" />
          <Radio name="ex1" value="2" label="Standard Radio 2" defaultChecked />
          <Radio name="ex2" value="3" label="Required Field" required helper="You must pick this to proceed." />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--skyra-border)] pb-2">Radio Grouping</h2>
        <p className="text-[var(--skyra-text-subtle)] mb-4">
          The custom element automatically clears other radios in the same document with the same `name` attribute when checked.
        </p>
        <div className="p-8 border border-[var(--skyra-border)] rounded-md flex flex-col gap-4 max-w-sm">
          <Radio 
            name="planGroup" 
            value="free" 
            label="Free Plan" 
            checked={selected === 'free'}
            onChange={() => setSelected('free')}
          />
          <Radio 
            name="planGroup" 
            value="pro" 
            label="Pro Plan" 
            checked={selected === 'pro'}
            onChange={() => setSelected('pro')}
          />
          <Radio 
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
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--skyra-border)] pb-2">States & Validation</h2>
        <div className="p-8 border border-[var(--skyra-border)] rounded-md flex flex-col gap-6 max-w-sm">
          <Radio name="ex3" value="1" label="Error State" error="This selection is invalid." />
          <Radio name="ex4" value="1" label="Disabled Unchecked" disabled />
          <Radio name="ex4" value="2" label="Disabled Checked" disabled checked />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--skyra-border)] pb-2">Accessibility</h2>
        <ul className="list-disc list-inside text-[var(--skyra-text-subtle)] space-y-2">
          <li>Implements native form association (`ElementInternals`).</li>
          <li>Labels are programmatically linked to the internal hidden radio using generated unique IDs.</li>
          <li>Automatically sets `aria-invalid` and `aria-describedby` when errors or helpers are present.</li>
          <li>Fully compliant with keyboard navigation (Arrow keys between native inputs, Spacebar activation).</li>
          <li>Touch targets are intentionally preserved above 44x44px.</li>
        </ul>
      </section>
    </div>
  );
}
