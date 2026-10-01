'use client';

import { Checkbox } from '@skyra/ui';

export default function CheckboxDocsPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-2">Checkbox</h1>
        <p className="text-[var(--skyra-text-subtle)]">Framework-independent checkbox component for multiple-choice selections.</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--skyra-border)] pb-2">Overview</h2>
        <p className="text-[var(--skyra-text-subtle)] max-w-3xl mb-4">
          The Skyra Tech Checkbox is a framework-independent component authored as a native Web Component (`&lt;skyra-tech-checkbox&gt;`). It natively handles checked and indeterminate states, form association, and validation errors without relying on React internals.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--skyra-border)] pb-2">Installation</h2>
        <div className="bg-[var(--skyra-bg-subtle)] p-4 rounded-md border border-[var(--skyra-border)] font-mono text-sm mb-4">
          pnpm add @skyra-tech-platform/checkbox
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--skyra-border)] pb-2">Framework Usage</h2>
        <h3 className="text-lg font-semibold mb-2">Vanilla HTML</h3>
        <pre className="bg-[var(--skyra-bg-subtle)] p-4 rounded-md border border-[var(--skyra-border)] overflow-x-auto text-sm mb-6">
          <code>{`<script type="module">
  import '@skyra-tech-platform/checkbox';
</script>

<skyra-tech-checkbox label="Accept terms and conditions"></skyra-tech-checkbox>`}</code>
        </pre>

        <h3 className="text-lg font-semibold mb-2">React / Next.js</h3>
        <p className="text-[var(--skyra-text-subtle)] mb-4">
          The platform exposes a lightweight wrapper inside `@skyra/ui` that passes refs and handles React synthetic events cleanly.
        </p>
        <pre className="bg-[var(--skyra-bg-subtle)] p-4 rounded-md border border-[var(--skyra-border)] overflow-x-auto text-sm mb-6">
          <code>{`import { Checkbox } from '@skyra/ui';

<Checkbox label="Subscribe to newsletter" helper="We will never spam you." />`}</code>
        </pre>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--skyra-border)] pb-2">Basic Examples</h2>
        <div className="p-8 border border-[var(--skyra-border)] rounded-md flex flex-col gap-6 max-w-sm">
          <Checkbox label="Standard Checkbox" />
          <Checkbox label="Checked by default" defaultChecked />
          <Checkbox label="Required Field" required helper="You must check this to proceed." />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--skyra-border)] pb-2">States & Validation</h2>
        <div className="p-8 border border-[var(--skyra-border)] rounded-md flex flex-col gap-6 max-w-sm">
          <Checkbox label="Indeterminate State" indeterminate />
          <Checkbox label="Error State" error="This selection is invalid." />
          <Checkbox label="Disabled Unchecked" disabled />
          <Checkbox label="Disabled Checked" disabled checked />
          <Checkbox label="Disabled Indeterminate" disabled indeterminate />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--skyra-border)] pb-2">Accessibility</h2>
        <ul className="list-disc list-inside text-[var(--skyra-text-subtle)] space-y-2">
          <li>Implements native form association (`ElementInternals`).</li>
          <li>Labels are programmatically linked to the internal hidden checkbox using generated unique IDs.</li>
          <li>Automatically sets `aria-invalid` and `aria-describedby` when errors or helpers are present.</li>
          <li>Fully compliant with keyboard navigation (Spacebar activation) and focus visible rings.</li>
          <li>Touch targets are intentionally preserved above 44x44px.</li>
        </ul>
      </section>
    </div>
  );
}
