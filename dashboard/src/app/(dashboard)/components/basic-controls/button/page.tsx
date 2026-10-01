'use client';

import { Button } from '@skyra/ui';

export default function ButtonDocsPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-2">Button</h1>
        <p className="text-[var(--skyra-text-subtle)]">Framework-independent, natively accessible button component for triggering actions.</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--skyra-border)] pb-2">Overview</h2>
        <p className="text-[var(--skyra-text-subtle)] max-w-3xl mb-4">
          The Skyra Tech Button is the first fully framework-independent component in our platform, authored as a native Web Component (`&lt;skyra-tech-button&gt;`). It provides standard interactive variants and sizes while completely isolating its styling.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--skyra-border)] pb-2">Installation</h2>
        <div className="bg-[var(--skyra-bg-subtle)] p-4 rounded-md border border-[var(--skyra-border)] font-mono text-sm mb-4">
          pnpm add @skyra-tech-platform/button
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--skyra-border)] pb-2">Framework Usage</h2>
        <h3 className="text-lg font-semibold mb-2">Vanilla HTML</h3>
        <pre className="bg-[var(--skyra-bg-subtle)] p-4 rounded-md border border-[var(--skyra-border)] overflow-x-auto text-sm mb-6">
          <code>{`<script type="module">
  import '@skyra-tech-platform/button';
</script>

<skyra-tech-button variant="primary">Submit</skyra-tech-button>`}</code>
        </pre>

        <h3 className="text-lg font-semibold mb-2">React / Next.js</h3>
        <p className="text-[var(--skyra-text-subtle)] mb-4">
          The platform exposes a lightweight wrapper inside `@skyra/ui` that passes refs and handles React synthetic events cleanly.
        </p>
        <pre className="bg-[var(--skyra-bg-subtle)] p-4 rounded-md border border-[var(--skyra-border)] overflow-x-auto text-sm mb-6">
          <code>{`import { Button } from '@skyra/ui';

<Button variant="orange" onClick={console.log}>Click Me</Button>`}</code>
        </pre>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--skyra-border)] pb-2">Variants</h2>
        <div className="p-8 border border-[var(--skyra-border)] rounded-md flex flex-wrap gap-4 items-center">
          <Button variant="primary">Primary</Button>
          <Button variant="orange">Orange</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--skyra-border)] pb-2">Sizes</h2>
        <div className="p-8 border border-[var(--skyra-border)] rounded-md flex flex-wrap gap-4 items-end">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--skyra-border)] pb-2">States</h2>
        <h3 className="text-sm font-semibold mb-2 mt-4 text-[var(--skyra-text-subtle)] uppercase">Disabled</h3>
        <div className="p-8 border border-[var(--skyra-border)] rounded-md flex flex-wrap gap-4">
          <Button disabled>Disabled Primary</Button>
          <Button variant="outline" disabled>Disabled Outline</Button>
        </div>
        
        <h3 className="text-sm font-semibold mb-2 mt-4 text-[var(--skyra-text-subtle)] uppercase">Loading</h3>
        <div className="p-8 border border-[var(--skyra-border)] rounded-md flex flex-wrap gap-4">
          <Button isLoading loadingText="Saving...">Save</Button>
          <Button variant="orange" isLoading>Submit</Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-[var(--skyra-border)] pb-2">Accessibility</h2>
        <ul className="list-disc list-inside text-[var(--skyra-text-subtle)] space-y-2">
          <li>Implements native form association (`ElementInternals`).</li>
          <li>Properly exposes `aria-disabled` and `aria-busy` for assistive tech.</li>
          <li>Provides `loading-text` visually-hidden spans to ensure screen readers announce loading states.</li>
          <li>Full keyboard navigation (Tab targeting and Enter/Space activation) inherited from native `&lt;button&gt;`.</li>
        </ul>
      </section>
    </div>
  );
}
