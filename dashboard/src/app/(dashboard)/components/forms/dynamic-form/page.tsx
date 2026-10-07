'use client';

import React, { useState } from 'react';
import '@skyra-tech-platform/dynamic-form';
import '@skyra-tech-platform/button';;
import { DocsLayout } from '@/components/docs/DocsLayout';
import { DocsHeader } from '@/components/docs/DocsHeader';
import { PackageMeta } from '@/components/docs/PackageMeta';
import { InstallCommand } from '@/components/docs/InstallCommand';
import { LiveExample } from '@/components/docs/LiveExample';
import { HeadingAnchor } from '@/components/docs/HeadingAnchor';

import { CodeTabs } from '@/components/docs/CodeTabs';
import { ApiTable } from '@/components/docs/ApiTable';
import { Callout } from '@/components/docs/Callout';

export default function DynamicFormDocsPage() {
  const [basicResult, setBasicResult] = useState(null);

  const toc = [
    { id: 'quick-start', label: 'Quick Start' },
    { id: 'installation', label: 'Installation' },
    { id: 'basic', label: 'Basic Schema' },
    { id: 'conditional', label: 'Conditional Fields' },
    { id: 'api', label: 'API Reference' },
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

      <section id="quick-start" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="quick-start" level={2}>Quick Start</HeadingAnchor>
        <p style={{ color: 'var(--skyra-text-muted)' }}>
          The Dynamic Form component enables you to rapidly construct robust, accessible forms from a structured JSON schema. It natively manages layout, validation, conditional logic, and submission states.
        </p>
      </section>

      <section id="installation" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="installation" level={2}>Installation</HeadingAnchor>
        <InstallCommand packageName="@skyra-tech-platform/dynamic-form" />
      </section>
      
      <section id="basic" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="basic" level={2}>Basic Schema</HeadingAnchor>
        <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '1rem' }}>
          Render forms dynamically by defining an array of field objects. The underlying Web Component handles state bindings internally.
        </p>
        
        <CodeTabs tabs={[
          {
            label: 'Web Component',
            language: 'html',
            code: `<!-- Ensure you import the package script: -->
<!-- import '@skyra-tech-platform/dynamic-form'; -->

<skyra-tech-dynamic-form id="my-form"></skyra-tech-dynamic-form>

<script>
  const form = document.getElementById('my-form');
  form.fields = [
    { name: 'firstName', label: 'First Name', type: 'text', required: true },
    { name: 'lastName', label: 'Last Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true }
  ];
  
  form.addEventListener('skyra-submit', (e) => {
    console.log(e.detail.values);
  });
</script>`
          }
        ]} />

        <div style={{ marginTop: '2rem' }}>
          <LiveExample>
            <div style={{ maxWidth: 400, width: '100%' }}>
              <skyra-tech-dynamic-form 
                ref={(el: any) => {
                  if (el) {
                    el.fields = [
                      { name: 'firstName', label: 'First Name', type: 'text', required: true },
                      { name: 'lastName', label: 'Last Name', type: 'text', required: true },
                      { name: 'email', label: 'Email', type: 'email', required: true }
                    ];
                    el.addEventListener('skyra-submit', (e: any) => setBasicResult(e.detail.values));
                  }
                }}
              />
              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                <skyra-tech-button onClick={() => (document.querySelector('skyra-tech-dynamic-form') as any)?.submit()}>Submit Form</skyra-tech-button>
              </div>
              {basicResult && (
                <pre style={{ marginTop: '1rem', padding: '1rem', background: 'var(--skyra-surface)', border: '1px solid var(--skyra-border)', borderRadius: 'var(--skyra-radius-md)' }}>
                  {JSON.stringify(basicResult, null, 2)}
                </pre>
              )}
            </div>
          </LiveExample>
        </div>
      </section>

      <section id="conditional" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="conditional" level={2}>Conditional Fields</HeadingAnchor>
        <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '1rem' }}>
          Dynamically show or hide fields based on values of other fields using the <code>visibleWhen</code> configuration.
        </p>
        
        <CodeTabs tabs={[
          {
            label: 'JSON Schema',
            language: 'json',
            code: `[
  { 
    "name": "role", 
    "label": "Role", 
    "type": "select", 
    "options": [
      { "value": "admin", "label": "Admin" }, 
      { "value": "user", "label": "User" }
    ]
  },
  { 
    "name": "adminCode", 
    "label": "Admin Access Code", 
    "type": "text", 
    "visibleWhen": { "field": "role", "operator": "equals", "value": "admin" }
  }
]`
          }
        ]} />

        <div style={{ marginTop: '2rem' }}>
          <LiveExample>
            <div style={{ maxWidth: 400, width: '100%' }}>
              <skyra-tech-dynamic-form 
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
        </div>
      </section>

      <section id="api" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="api" level={2}>API Reference</HeadingAnchor>
        
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '1rem', marginTop: '1.5rem' }}>Properties</h3>
        <ApiTable 
          headers={['Property', 'Type', 'Description']} 
          rows={[
            { name: 'fields', type: 'FieldDef[]', description: 'Array of field configuration objects. Defines the form schema.' },
            { name: 'fieldsets', type: 'FieldsetDef[]', description: 'Optional grouping of fields into visual cards.' },
            { name: 'initialValues', type: 'FormValues', description: 'Initial key-value pairs populating the form data.' },
            { name: 'features', type: 'DynamicFormFeatures', description: 'Configuration object to toggle internal features (e.g. dirtyTracking).' }
          ]} 
        />
        
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '1rem', marginTop: '2rem' }}>Events</h3>
        <ApiTable 
          headers={['Event Name', 'Detail', 'Description']} 
          rows={[
            { name: 'skyra-submit', type: '{ values: FormValues }', description: 'Fired upon successful validation and submission.' },
            { name: 'skyra-change', type: '{ name: string, value: any, values: FormValues }', description: 'Fired whenever any field value changes.' }
          ]} 
        />
      </section>

      <section id="technical" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="technical" level={2}>Technical Reference</HeadingAnchor>
        <p style={{ color: 'var(--skyra-text-muted)' }}>
          The canonical implementation is a native Web Component (<code>&lt;skyra-tech-dynamic-form&gt;</code>). The React wrapper (in legacy spaces) merely proxies props and fields to the custom element properties. Validation, condition evaluation, repeatable arrays, and dirty tracking are entirely resolved inside the encapsulated Shadow DOM.
        </p>
      </section>

    </DocsLayout>
  );
}
