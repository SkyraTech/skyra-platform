'use client';

import { Input } from '@skyra/ui';
import { Mail, Search } from 'lucide-react';

export default function InputDocsPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-2">Input</h1>
        <p className="text-[var(--skyra-text-subtle)]">Framework-independent, natively accessible input component for data entry.</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--skyra-border)] pb-2">Overview</h2>
        <p className="text-[var(--skyra-text-subtle)] max-w-3xl mb-4">
          The Skyra Tech Input is a robust framework-independent component authored as a native Web Component (`&lt;skyra-tech-input&gt;`). It seamlessly supports forms, validation, and advanced features like clearable buttons and dynamic adornments without relying on React internals.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--skyra-border)] pb-2">Installation</h2>
        <div className="bg-[var(--skyra-bg-subtle)] p-4 rounded-md border border-[var(--skyra-border)] font-mono text-sm mb-4">
          pnpm add @skyra-tech-platform/input
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--skyra-border)] pb-2">Framework Usage</h2>
        <h3 className="text-lg font-semibold mb-2">Vanilla HTML</h3>
        <pre className="bg-[var(--skyra-bg-subtle)] p-4 rounded-md border border-[var(--skyra-border)] overflow-x-auto text-sm mb-6">
          <code>{`<script type="module">
  import '@skyra-tech-platform/input';
</script>

<skyra-tech-input type="text" placeholder="Enter name" label="Full Name"></skyra-tech-input>`}</code>
        </pre>

        <h3 className="text-lg font-semibold mb-2">React / Next.js</h3>
        <p className="text-[var(--skyra-text-subtle)] mb-4">
          The platform exposes a lightweight wrapper inside `@skyra/ui` that passes refs and handles React synthetic events cleanly.
        </p>
        <pre className="bg-[var(--skyra-bg-subtle)] p-4 rounded-md border border-[var(--skyra-border)] overflow-x-auto text-sm mb-6">
          <code>{`import { Input } from '@skyra/ui';
import { Mail } from 'lucide-react';

<Input label="Email" type="email" leftAdornment={<Mail size={16} />} />`}</code>
        </pre>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--skyra-border)] pb-2">Basic Examples</h2>
        <div className="p-8 border border-[var(--skyra-border)] rounded-md flex flex-col gap-6 max-w-sm">
          <Input label="Standard Input" placeholder="Type here..." />
          <Input label="Required Field" required placeholder="Cannot be empty" />
          <Input label="With Helper Text" helperText="This is a helpful description" />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--skyra-border)] pb-2">Validation States</h2>
        <div className="p-8 border border-[var(--skyra-border)] rounded-md flex flex-col gap-6 max-w-sm">
          <Input label="Error State" error="This field must contain a valid email." defaultValue="invalid-email" />
          <Input label="Success State" status="success" defaultValue="Looks good!" />
          <Input label="Warning State" status="warning" defaultValue="Password is weak" />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--skyra-border)] pb-2">Adornments</h2>
        <div className="p-8 border border-[var(--skyra-border)] rounded-md flex flex-col gap-6 max-w-sm">
          <Input label="Left Adornment" leftAdornment={<Mail size={16} />} placeholder="Email address" />
          <Input label="Right Adornment" rightAdornment={<span className="text-sm font-medium">@skyra.com</span>} placeholder="username" />
          <Input label="Clearable" clearable defaultValue="Clear me" />
          <Input label="Loading" loading placeholder="Searching..." leftAdornment={<Search size={16} />} />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--skyra-border)] pb-2">Accessibility</h2>
        <ul className="list-disc list-inside text-[var(--skyra-text-subtle)] space-y-2">
          <li>Implements native form association (`ElementInternals`).</li>
          <li>Properly maps labels to inputs using generated unique IDs.</li>
          <li>Automatically sets `aria-invalid` and `aria-describedby` when errors or helpers are present.</li>
          <li>Fully compliant with keyboard navigation, focus visible rings, and contrast guidelines.</li>
        </ul>
      </section>
    </div>
  );
}
