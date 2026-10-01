'use client';

import { Textarea } from '@skyra/ui';

export default function TextareaDocsPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-2">Textarea</h1>
        <p className="text-[var(--skyra-text-subtle)]">Framework-independent, auto-resizing textarea component for multi-line data entry.</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--skyra-border)] pb-2">Overview</h2>
        <p className="text-[var(--skyra-text-subtle)] max-w-3xl mb-4">
          The Skyra Tech Textarea is a framework-independent component authored as a native Web Component (`&lt;skyra-tech-textarea&gt;`). It seamlessly supports forms, auto-resizing, validation, and character counting without relying on React internals.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--skyra-border)] pb-2">Installation</h2>
        <div className="bg-[var(--skyra-bg-subtle)] p-4 rounded-md border border-[var(--skyra-border)] font-mono text-sm mb-4">
          pnpm add @skyra-tech-platform/textarea
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--skyra-border)] pb-2">Framework Usage</h2>
        <h3 className="text-lg font-semibold mb-2">Vanilla HTML</h3>
        <pre className="bg-[var(--skyra-bg-subtle)] p-4 rounded-md border border-[var(--skyra-border)] overflow-x-auto text-sm mb-6">
          <code>{`<script type="module">
  import '@skyra-tech-platform/textarea';
</script>

<skyra-tech-textarea placeholder="Enter description..." label="Description" auto-resize min-rows="3"></skyra-tech-textarea>`}</code>
        </pre>

        <h3 className="text-lg font-semibold mb-2">React / Next.js</h3>
        <p className="text-[var(--skyra-text-subtle)] mb-4">
          The platform exposes a lightweight wrapper inside `@skyra/ui` that passes refs and handles React synthetic events cleanly.
        </p>
        <pre className="bg-[var(--skyra-bg-subtle)] p-4 rounded-md border border-[var(--skyra-border)] overflow-x-auto text-sm mb-6">
          <code>{`import { Textarea } from '@skyra/ui';

<Textarea label="Notes" autoResize minRows={4} />`}</code>
        </pre>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--skyra-border)] pb-2">Basic Examples</h2>
        <div className="p-8 border border-[var(--skyra-border)] rounded-md flex flex-col gap-6 max-w-sm">
          <Textarea label="Standard Textarea" placeholder="Type here..." />
          <Textarea label="Required Field" required placeholder="Cannot be empty" />
          <Textarea label="With Helper Text" helperText="Provide any additional details here." />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--skyra-border)] pb-2">Auto Resizing</h2>
        <div className="p-8 border border-[var(--skyra-border)] rounded-md flex flex-col gap-6 max-w-sm">
          <Textarea label="Auto Resizing (Min 2 rows)" autoResize minRows={2} placeholder="Type multiple lines to see it grow..." />
          <Textarea label="Auto Resizing (Max 5 rows)" autoResize minRows={2} maxRows={5} placeholder="Will scroll after 5 lines..." />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--skyra-border)] pb-2">Validation & States</h2>
        <div className="p-8 border border-[var(--skyra-border)] rounded-md flex flex-col gap-6 max-w-sm">
          <Textarea label="Error State" error="This field is required." defaultValue="Some invalid text" />
          <Textarea label="Success State" status="success" defaultValue="Looks good!" />
          <Textarea label="Character Count" showCount maxLength={100} defaultValue="A brief note." />
          <Textarea label="Disabled" disabled defaultValue="You cannot edit this." />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--skyra-border)] pb-2">Accessibility</h2>
        <ul className="list-disc list-inside text-[var(--skyra-text-subtle)] space-y-2">
          <li>Implements native form association (`ElementInternals`).</li>
          <li>Properly maps labels to textareas using generated unique IDs.</li>
          <li>Automatically sets `aria-invalid` and `aria-describedby` when errors or helpers are present.</li>
          <li>Fully compliant with keyboard navigation, focus visible rings, and contrast guidelines.</li>
        </ul>
      </section>
    </div>
  );
}
