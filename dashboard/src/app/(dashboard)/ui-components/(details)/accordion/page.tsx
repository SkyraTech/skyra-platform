'use client';

import React, { useState } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Button,
  Badge,
  Input,
} from '@skyra/ui';
import { DemoSection, DemoBlock } from '@/components/demos/DemoSection';
import {
  FileText,
  CreditCard,
  Lock,
  HelpCircle,
  CheckCircle,
} from 'lucide-react';

export default function AccordionShowcasePage() {
  const [controlledSingle, setControlledSingle] = useState('faq-1');
  const [controlledMultiple, setControlledMultiple] = useState<string[]>(['sec-1', 'sec-2']);

  return (
    <div className="dash-page" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--skyra-text)', margin: 0 }}>
          Accordion Component
        </h1>
        <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
          Expandable multi-section container supporting single and multiple open modes, collapsible single toggle, keyboard navigation (ArrowUp/Down, Home/End), smooth animation, and dark mode.
        </p>
      </div>

      {/* 1. Single Mode with Collapsible */}
      <DemoSection title="1. Single Mode with Collapsible" desc="Only one section can be active at a time; collapsible allows closing the active item." erpSource="Platform Foundation">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="Frequently Asked Questions (Single Collapsible)">
            <div style={{ padding: '1rem 0' }}>
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
                    Yes, Skyra Platform supports real-time audit event streaming over encrypted TLS syslog or webhook endpoints with HMAC-SHA256 signature verification.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-3">
                  <AccordionTrigger>What are the rate limits for the API?</AccordionTrigger>
                  <AccordionContent>
                    Enterprise accounts receive a baseline quota of 10,000 requests per minute with burst allowance up to 25,000 req/min.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-disabled" disabled>
                  <AccordionTrigger>Legacy Data Migration (Archived)</AccordionTrigger>
                  <AccordionContent>This section is disabled.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </DemoBlock>

          <DemoBlock title="Rich Form Content in Accordion">
            <div style={{ padding: '1rem 0' }}>
              <Accordion type="single" defaultValue="step-1" collapsible>
                <AccordionItem value="step-1">
                  <AccordionTrigger>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FileText size={16} color="var(--skyra-primary)" />
                      <span>1. Organization Information</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <Input defaultValue="Skyra Systems Ltd" placeholder="Legal business name" />
                      <Input defaultValue="GB 992 481 023" placeholder="Tax registration number" />
                      <Button variant="primary" size="sm">Save &amp; Continue</Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="step-2">
                  <AccordionTrigger>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CreditCard size={16} color="var(--skyra-primary)" />
                      <span>2. Payment Methods</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem' }}>Direct Debit (BACS / SEPA) active.</p>
                    <Button variant="outline" size="sm">Add Credit Card</Button>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="step-3">
                  <AccordionTrigger>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Lock size={16} color="var(--skyra-primary)" />
                      <span>3. Access Control Policies</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem' }}>Role-based access control (RBAC) enforced.</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </DemoBlock>
        </div>
      </DemoSection>

      {/* 2. Multiple Mode */}
      <DemoSection title="2. Multiple Mode &amp; Controlled State" desc="Multiple sections can be open simultaneously; programmatic state management." erpSource="Platform Foundation">
        <DemoBlock title="Multiple Expand Mode">
          <div style={{ padding: '1rem 0' }}>
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
        </DemoBlock>
      </DemoSection>
    </div>
  );
}
