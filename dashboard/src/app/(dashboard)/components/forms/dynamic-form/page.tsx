'use client';

import React, { useState } from 'react';
import { DynamicForm, Button } from '@skyra/ui';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { DocsHeader } from '@/components/docs/DocsHeader';
import { PackageMeta } from '@/components/docs/PackageMeta';
import { InstallCommand } from '@/components/docs/InstallCommand';
import { LiveExample } from '@/components/docs/LiveExample';
import { HeadingAnchor } from '@/components/docs/HeadingAnchor';

export default function DynamicFormDocsPage() {
  const [basicResult, setBasicResult] = useState(null);

  const toc = [
    { id: 'quick-start', label: 'Quick Start' },
    { id: 'basic', label: 'Basic Schema' },
    { id: 'conditional', label: 'Conditional Fields' },
    { id: 'technical', label: 'Technical Reference' },
  ];

  return (
    <DocsLayout toc={toc}>
      <DocsHeader 
        title="Dynamic Form"
        description="Schema-driven form engine with validation, conditional fields, multi-step support, and full accessibility."
        breadcrumbs={[
          { label: 'Components', href: '/components' },
          { label: 'Forms' },
          { label: 'Dynamic Form' }
        ]}
        badges={[
          { label: 'Stable', variant: 'stable' },
          { label: 'Web Component', variant: 'tech' }
        ]}
      />

      <PackageMeta 
        packageName="@skyra-tech-platform/dynamic-form"
        elementName="<skyra-tech-dynamic-form>"
        version="0.1.0"
        type="Web Component"
      />

      <HeadingAnchor id="quick-start">Quick Start</HeadingAnchor>
      <InstallCommand packageName="@skyra-tech-platform/dynamic-form" />
      <InstallCommand packageName="@skyra/ui" />
      
      <HeadingAnchor id="basic">Basic Schema</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)' }}>
        Render forms dynamically from a JSON schema array.
      </p>
      
      <LiveExample 
        language="tsx"
        code={`import { DynamicForm } from '@skyra/ui';

export function Example() {
  return (
    <DynamicForm 
      fields={[
        { name: 'firstName', label: 'First Name', type: 'text', required: true },
        { name: 'lastName', label: 'Last Name', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'text', required: true }
      ]}
      onSubmit={(data) => console.log(data)}
    />
  );
}`}
      >
        <div style={{ maxWidth: 400 }}>
          <DynamicForm 
            fields={[
              { name: 'firstName', label: 'First Name', type: 'text', required: true },
              { name: 'lastName', label: 'Last Name', type: 'text', required: true },
              { name: 'email', label: 'Email', type: 'text', required: true }
            ]}
            onSubmit={(data: any) => setBasicResult(data)}
          />
          {basicResult && (
            <pre style={{ marginTop: '1rem', padding: '1rem', background: 'var(--skyra-surface-hover)', borderRadius: 4 }}>
              {JSON.stringify(basicResult, null, 2)}
            </pre>
          )}
        </div>
      </LiveExample>

      <HeadingAnchor id="conditional">Conditional Fields</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)' }}>
        Dynamically show or hide fields based on other field values.
      </p>
      
      <LiveExample 
        language="tsx"
        code={`import { DynamicForm } from '@skyra/ui';

export function Example() {
  return (
    <DynamicForm 
      fields={[
        { 
          name: 'role', 
          label: 'Role', 
          type: 'select', 
          options: [{ value: 'admin', label: 'Admin' }, { value: 'user', label: 'User' }]
        },
        { 
          name: 'adminCode', 
          label: 'Admin Access Code', 
          type: 'text', 
          visibleWhen: { field: 'role', operator: 'equals', value: 'admin' }
        }
      ]}
      onSubmit={(data) => console.log(data)}
    />
  );
}`}
      >
        <div style={{ maxWidth: 400 }}>
          <DynamicForm 
            fields={[
              { 
                name: 'role', 
                label: 'Role', 
                type: 'select', 
                options: [{ value: 'admin', label: 'Admin' }, { value: 'user', label: 'User' }]
              },
              { 
                name: 'adminCode', 
                label: 'Admin Access Code', 
                type: 'text', 
                visibleWhen: { field: 'role', operator: 'equals', value: 'admin' }
              }
            ]}
            onSubmit={(data: any) => alert(JSON.stringify(data))}
          />
        </div>
      </LiveExample>

      <HeadingAnchor id="technical">Technical Reference</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)' }}>
        The canonical implementation is a native Web Component (<code>&lt;skyra-tech-dynamic-form&gt;</code>). The React wrapper maps props and fields to the custom element properties. Validation, condition evaluation, and dirty tracking are all handled efficiently inside the Web Component.
      </p>

    </DocsLayout>
  );
}
