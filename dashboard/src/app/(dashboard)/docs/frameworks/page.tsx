'use client';

import React from 'react';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { DocsHeader } from '@/components/docs/DocsHeader';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { Callout } from '@/components/docs/Callout';
import { HeadingAnchor } from '@/components/docs/HeadingAnchor';

export default function FrameworksPage() {
  const toc = [
    { id: 'react-nextjs', label: 'React & Next.js' },
    { id: 'angular', label: 'Angular' },
    { id: 'vue', label: 'Vue 3' },
    { id: 'vanilla', label: 'Vanilla JS & HTML' },
    { id: 'typescript', label: 'TypeScript Setup' },
  ];

  return (
    <DocsLayout toc={toc}>
      <DocsHeader
        title="Framework Integration Guides"
        description="Comprehensive configuration instructions and recipes for using Skyra Platform native Web Components in React, Next.js, Angular, Vue 3, and Vanilla JavaScript."
        breadcrumbs={[
          { label: 'Developer Documentation', href: '/docs' },
          { label: 'Framework Guides' }
        ]}
        badges={[
          { label: 'All Frameworks', variant: 'tech' },
          { label: 'TypeScript', variant: 'stable' }
        ]}
      />

      <HeadingAnchor id="react-nextjs">React &amp; Next.js (App Router)</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7 }}>
        React 19 natively supports Custom Elements properties and attributes directly. For Next.js App Router applications, follow these recommendations:
      </p>

      <h4 style={{ color: 'var(--skyra-text)', margin: '1rem 0 0.5rem 0' }}>1. Client Component Boundary</h4>
      <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7, fontSize: '0.9rem' }}>
        Always declare <code style={{ color: 'var(--skyra-primary)' }}>&apos;use client&apos;;</code> at the top of components utilizing interactive custom elements:
      </p>

      <CodeBlock
        language="tsx"
        code={`'use client';

import React, { useState } from 'react';
import '@skyra-tech-platform/dialog';
import '@skyra-tech-platform/button';

export function DeleteConfirmation() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <skyra-tech-button variant="danger" onClick={() => setOpen(true)}>
        Delete Record
      </skyra-tech-button>

      <skyra-tech-dialog 
        open={open ? true : undefined} 
        headline="Confirm Deletion"
        onclose={() => setOpen(false)}
      >
        <p>This operation is irreversible.</p>
        <div slot="actions">
          <skyra-tech-button variant="ghost" onClick={() => setOpen(false)}>Cancel</skyra-tech-button>
          <skyra-tech-button variant="danger" onClick={() => { setOpen(false); /* delete */ }}>Confirm</skyra-tech-button>
        </div>
      </skyra-tech-dialog>
    </>
  );
}`}
      />

      <HeadingAnchor id="angular">Angular (v15+)</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7 }}>
        To use Skyra Platform Custom Elements in Angular, add <code style={{ color: 'var(--skyra-primary)' }}>CUSTOM_ELEMENTS_SCHEMA</code> to your standalone component or NgModule. This instructs the Angular compiler to permit non-Angular custom element tags without syntax warnings:
      </p>

      <CodeBlock
        language="typescript"
        code={`// app.component.ts or feature.component.ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import '@skyra-tech-platform/button';
import '@skyra-tech-platform/badge';

@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <div class="user-row">
      <span>{{ username }}</span>
      <skyra-tech-badge [variant]="statusVariant" dot>{{ statusText }}</skyra-tech-badge>
      <skyra-tech-button variant="primary" (click)="onSave()">Save</skyra-tech-button>
    </div>
  \`
})
export class AppComponent {
  username = 'Sarah Connor';
  statusVariant = 'success';
  statusText = 'Verified';

  onSave() {
    console.log('Saved');
  }
}`}
      />

      <Callout type="tech" title="Angular Property vs Attribute Binding">
        Use bracket notation <code style={{ color: 'var(--skyra-primary)' }}>[variant]=&quot;var&quot;</code> to bind JavaScript DOM properties, and attribute notation <code style={{ color: 'var(--skyra-primary)' }}>[attr.aria-label]=&quot;label&quot;</code> when binding raw HTML attributes.
      </Callout>

      <HeadingAnchor id="vue">Vue 3</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7 }}>
        Vue 3 has excellent first-class Custom Elements support. Tell Vite or vue-loader to recognize Skyra tags:
      </p>

      <CodeBlock
        language="typescript"
        code={`// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('skyra-tech-')
        }
      }
    })
  ]
});`}
      />

      <CodeBlock
        language="html"
        code={`<!-- MyComponent.vue -->
<script setup>
import { ref } from 'vue';
import '@skyra-tech-platform/switch';

const isEnabled = ref(true);
</script>

<template>
  <skyra-tech-switch 
    :checked="isEnabled" 
    label="Enable Real-Time Telemetry" 
    @change="isEnabled = $event.target.checked" 
  />
</template>`}
      />

      <HeadingAnchor id="vanilla">Vanilla JavaScript &amp; HTML</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7 }}>
        Because Skyra Platform is built entirely on native Web Standards, you do not need any framework at all:
      </p>

      <CodeBlock
        language="html"
        code={`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="node_modules/@skyra-tech-platform/design-tokens/dist/tokens.css">
  <script type="module">
    import '@skyra-tech-platform/button';
    import '@skyra-tech-platform/badge';

    const btn = document.querySelector('skyra-tech-button');
    btn.addEventListener('click', () => {
      const badge = document.querySelector('skyra-tech-badge');
      badge.variant = 'success';
      badge.textContent = 'Completed';
    });
  </script>
</head>
<body style="padding: 2rem; background: var(--skyra-bg);">
  <skyra-tech-badge variant="neutral" dot>Pending</skyra-tech-badge>
  <skyra-tech-button variant="primary">Mark Complete</skyra-tech-button>
</body>
</html>`}
      />

      <HeadingAnchor id="typescript">TypeScript Global Declarations</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7 }}>
        To enable autocomplete and type safety for custom elements in React JSX templates, create a <code style={{ color: 'var(--skyra-primary)' }}>custom-elements.d.ts</code> in your project <code style={{ color: 'var(--skyra-primary)' }}>src/</code> folder:
      </p>

      <CodeBlock
        language="typescript"
        code={`// src/custom-elements.d.ts
import React from 'react';

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'skyra-tech-button': any;
        'skyra-tech-badge': any;
        'skyra-tech-drawer': any;
        'skyra-tech-empty-state': any;
        'skyra-tech-dialog': any;
        'skyra-tech-input': any;
      }
    }
  }
}`}
      />
    </DocsLayout>
  );
}

