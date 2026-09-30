'use client';

import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Section } from '@/components/layout/Section';
import { ComponentShowcase } from '@/components/layout/ComponentShowcase';
import { Button } from '@skyra/ui';

export default function ButtonDocsPage() {
  return (
    <PageContainer
      title="Button"
      description="Framework-independent, natively accessible button component for triggering actions."
    >
      <Section title="Overview">
        <p className="text-[var(--skyra-text-subtle)] max-w-3xl mb-4">
          The Skyra Tech Button is the first fully framework-independent component in our platform, authored as a native Web Component (`&lt;skyra-tech-button&gt;`). It provides standard interactive variants and sizes while completely isolating its styling.
        </p>
      </Section>

      <Section title="Installation">
        <div className="bg-[var(--skyra-bg-subtle)] p-4 rounded-md border border-[var(--skyra-border)] font-mono text-sm mb-4">
          pnpm add @skyra-tech-platform/button
        </div>
      </Section>

      <Section title="Framework Usage">
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
      </Section>

      <Section title="Variants">
        <ComponentShowcase>
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="primary">Primary</Button>
            <Button variant="orange">Orange</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="link">Link</Button>
          </div>
        </ComponentShowcase>
      </Section>

      <Section title="Sizes">
        <ComponentShowcase>
          <div className="flex flex-wrap gap-4 items-end">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </ComponentShowcase>
      </Section>

      <Section title="States">
        <h3 className="text-sm font-semibold mb-2 mt-4 text-[var(--skyra-text-subtle)] uppercase">Disabled</h3>
        <ComponentShowcase>
          <div className="flex flex-wrap gap-4">
            <Button disabled>Disabled Primary</Button>
            <Button variant="outline" disabled>Disabled Outline</Button>
          </div>
        </ComponentShowcase>
        
        <h3 className="text-sm font-semibold mb-2 mt-4 text-[var(--skyra-text-subtle)] uppercase">Loading</h3>
        <ComponentShowcase>
          <div className="flex flex-wrap gap-4">
            <Button isLoading loadingText="Saving...">Save</Button>
            <Button variant="orange" isLoading>Submit</Button>
          </div>
        </ComponentShowcase>
      </Section>

      <Section title="Accessibility">
        <ul className="list-disc list-inside text-[var(--skyra-text-subtle)] space-y-2">
          <li>Implements native form association (`ElementInternals`).</li>
          <li>Properly exposes `aria-disabled` and `aria-busy` for assistive tech.</li>
          <li>Provides `loading-text` visually-hidden spans to ensure screen readers announce loading states.</li>
          <li>Full keyboard navigation (Tab targeting and Enter/Space activation) inherited from native `&lt;button&gt;`.</li>
        </ul>
      </Section>
    </PageContainer>
  );
}
