'use client';

import React, { useState } from 'react';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { DocsHeader } from '@/components/docs/DocsHeader';
import { PackageMeta } from '@/components/docs/PackageMeta';
import { ApiTable } from '@/components/docs/ApiTable';
import { ApiTabs } from '@/components/docs/ApiTabs';
import { FrameworkSupport } from '@/components/docs/FrameworkSupport';
import { InstallCommand } from '@/components/docs/InstallCommand';
import { LiveExample } from '@/components/docs/LiveExample';
import { AccessibilityPanel } from '@/components/docs/AccessibilityPanel';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent, Badge } from '@/components/ui';
import { FileText, CreditCard, Lock } from 'lucide-react';
import '@skyra-tech-platform/button';
import '@skyra-tech-platform/input';

export default function AccordionDocsPage() {
  const codeSingle = `
<Accordion type="single" defaultValue="faq-1" collapsible>
  <AccordionItem value="faq-1">
    <AccordionTrigger>How does invoice reconciliation work?</AccordionTrigger>
    <AccordionContent>
      Invoices are automatically matched against banking feed transaction records using ISO 20022 camt.053 standard statement parsers.
    </AccordionContent>
  </AccordionItem>
</Accordion>
`.trim();

  const codeMultiple = `
<Accordion type="multiple" defaultValue={['sec-1', 'sec-2']}>
  <AccordionItem value="sec-1">
    <AccordionTrigger>Telemetry Cluster #01</AccordionTrigger>
    <AccordionContent>
      Cluster Health: Healthy | CPU: 24% | Memory: 4.2GB
    </AccordionContent>
  </AccordionItem>
</Accordion>
`.trim();

  return (
    <DocsLayout
      toc={[
        { id: 'overview', label: 'Overview' },
        { id: 'installation', label: 'Installation' },
        { id: 'usage', label: 'Usage Examples' },
        { id: 'api', label: 'API Reference' },
        { id: 'accessibility', label: 'Accessibility' }
      ]}
    >
      <DocsHeader
        title="Accordion"
        description="Expandable multi-section container supporting single and multiple open modes, collapsible toggles, and keyboard navigation."
        breadcrumbs={[
          { label: 'Components', href: '/components' },
          { label: 'Disclosure' },
          { label: 'Accordion' }
        ]}
        badges={[
          { label: 'Stable', variant: 'stable' },
          { label: 'Web Component', variant: 'tech' }
        ]}
      />

      <section id="overview">
        <PackageMeta 
          packageName="@skyra-tech-platform/accordion"
          version="0.1.0"
          type="TypeScript / Web Component"
        />
      </section>

      <section id="installation" style={{ marginTop: '3rem' }}>
        <h2 className="docs-heading" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--skyra-text)' }}>Installation</h2>
        <InstallCommand packageName="@skyra-tech-platform/accordion" />
      </section>

      <section id="usage" style={{ marginTop: '3rem' }}>
        <h2 className="docs-heading" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--skyra-text)' }}>Usage Examples</h2>
        
        <LiveExample
          title="Single Mode with Collapsible"
          description="Only one section can be active at a time; collapsible allows closing the active item."
          code={codeSingle}
        >
          <div style={{ width: '100%' }}>
            <Accordion type="single" defaultValue="faq-1" collapsible>
              <AccordionItem value="faq-1">
                <AccordionTrigger>How does invoice reconciliation work?</AccordionTrigger>
                <AccordionContent>
                  Invoices are automatically matched against banking feed transaction records using ISO 20022 camt.053 standard statement parsers.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-2">
                <AccordionTrigger>Can I export audit logs to external SIEM?</AccordionTrigger>
                <AccordionContent>
                  Yes, Skyra Platform supports real-time audit event streaming over encrypted TLS syslog or webhook endpoints.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-disabled" disabled>
                <AccordionTrigger>Legacy Data Migration (Archived)</AccordionTrigger>
                <AccordionContent>This section is disabled.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </LiveExample>

        <LiveExample
          title="Multiple Mode"
          description="Multiple sections can be open simultaneously."
          code={codeMultiple}
        >
          <div style={{ width: '100%' }}>
            <Accordion type="multiple" defaultValue={['sec-1', 'sec-2']}>
              <AccordionItem value="sec-1">
                <AccordionTrigger>Telemetry Cluster #01</AccordionTrigger>
                <AccordionContent>
                  Cluster Health: <Badge variant="success" size="sm">Healthy</Badge> | CPU: 24% | Memory: 4.2GB
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="sec-2">
                <AccordionTrigger>Telemetry Cluster #02</AccordionTrigger>
                <AccordionContent>
                  Cluster Health: <Badge variant="primary" size="sm">Optimal</Badge> | CPU: 18% | Memory: 3.8GB
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="sec-3">
                <AccordionTrigger>Telemetry Cluster #03</AccordionTrigger>
                <AccordionContent>
                  Cluster Health: <Badge variant="warning" size="sm">High Load</Badge> | CPU: 82% | Memory: 14.1GB
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </LiveExample>
      </section>

      <section id="api" style={{ marginTop: '3rem' }}>
        <h2 className="docs-heading" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--skyra-text)' }}>API Reference</h2>
        
        <ApiTabs
          tabs={[
            {
              id: 'accordion',
              label: '<skyra-accordion>',
              content: (
                <>
                  <ApiTable
                    title="Properties & Attributes"
                    headers={['Property', 'Type', 'Description']}
                    rows={[
                      { name: 'type', type: '"single" | "multiple"', description: 'Determines whether one or multiple items can be open at the same time. Default: "single"' },
                      { name: 'value', type: 'string', description: 'The controlled value of the open item(s). Comma-separated for multiple mode.' },
                      { name: 'default-value', type: 'string', description: 'The initial uncontrolled value of the open item(s).' },
                      { name: 'collapsible', type: 'boolean', description: 'Allows a single active item to be closed when clicked again. Default: false' },
                    ]}
                  />
                  <ApiTable
                    title="Events"
                    headers={['Event', 'Payload', 'Description']}
                    rows={[
                      { name: 'skyra-accordion-change', type: '{ value: string }', description: 'Fired when the expanded state changes. Value is comma-separated for multiple mode.' }
                    ]}
                  />
                </>
              )
            },
            {
              id: 'accordion-item',
              label: '<skyra-accordion-item>',
              content: (
                <ApiTable
                  title="Properties & Attributes"
                  headers={['Property', 'Type', 'Description']}
                  rows={[
                    { name: 'value', type: 'string', description: 'A unique identifier for the item. Required.' },
                    { name: 'disabled', type: 'boolean', description: 'Prevents the user from interacting with the item. Default: false' }
                  ]}
                />
              )
            }
          ]}
        />
      </section>

      <section id="accessibility" style={{ marginTop: '3rem' }}>
        <AccessibilityPanel
          features={[
            'Utilizes native `<button>` elements for disclosure triggers.',
            '`aria-expanded` is automatically managed on the triggers.',
            '`aria-controls` links triggers to their respective panels.',
            'ArrowUp, ArrowDown, Home, and End keys navigate between accordion headers.',
            'Enter and Space toggle the expanded state of the focused item.',
            'Supports prefers-reduced-motion to disable animations automatically.'
          ]}
        />
      </section>
    </DocsLayout>
  );
}
