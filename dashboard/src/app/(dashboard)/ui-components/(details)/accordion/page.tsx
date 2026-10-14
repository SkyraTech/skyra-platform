'use client';

import React, { useState } from 'react';
import '@skyra-tech-platform/accordion';
import { DemoSection, DemoBlock } from '@/components/demos/DemoSection';

export default function AccordionShowcasePage() {
  const [mode, setMode] = useState<'single' | 'multiple'>('single');

  return (
    <div className="dash-page" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--skyra-text)', margin: 0 }}>
          Accordion Component Showcase
        </h1>
        <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
          Accessible multi-section disclosure container supporting single-expand and multiple-expand orchestration, smooth transitions, and keyboard roving navigation.
        </p>
      </div>

      {/* 1. SINGLE EXPAND */}
      <DemoSection
        title="1. Single-Expand Accordion"
        desc="Only one section is expanded at any given time; opening a section collapses the previously expanded section."
        erpSource="@skyra-tech-platform/accordion"
      >
        <DemoBlock title="Enterprise Security Policies">
          <div style={{ width: '100%' }}>
            <skyra-accordion mode="single" suppressHydrationWarning>
              <skyra-accordion-item value="tls" open suppressHydrationWarning>
                <span slot="trigger">TLS 1.3 & Cipher Suite Enforcement</span>
                <div slot="content" style={{ padding: '1rem', color: 'var(--skyra-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  All platform ingress gateways terminate TLS 1.3 exclusively with forward secrecy (ECDHE-ECDSA-AES256-GCM-SHA384). Legacy TLS 1.0/1.1/1.2 connections are rejected at the edge.
                </div>
              </skyra-accordion-item>

              <skyra-accordion-item value="kms" suppressHydrationWarning>
                <span slot="trigger">Automated KMS Key Rotation</span>
                <div slot="content" style={{ padding: '1rem', color: 'var(--skyra-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Symmetric customer master keys (CMK) rotate every 90 days with zero database downtime. All previous ciphertext versions remain decryptable via backward key tracking.
                </div>
              </skyra-accordion-item>

              <skyra-accordion-item value="audit" suppressHydrationWarning>
                <span slot="trigger">Immutable Write-Once Audit Trails</span>
                <div slot="content" style={{ padding: '1rem', color: 'var(--skyra-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Every administrative action is cryptographically signed and stored in append-only cloud storage with multi-region object locking enabled for 7 years.
                </div>
              </skyra-accordion-item>
            </skyra-accordion>
          </div>
        </DemoBlock>
      </DemoSection>

      {/* 2. MULTIPLE EXPAND */}
      <DemoSection
        title="2. Multiple-Expand Mode"
        desc="Allows users to keep several panels open simultaneously for comparing related information."
      >
        <DemoBlock title="Regional Disaster Recovery Details">
          <div style={{ width: '100%' }}>
            <skyra-accordion mode="multiple" suppressHydrationWarning>
              <skyra-accordion-item value="region-us" open suppressHydrationWarning>
                <span slot="trigger">Primary Region: US-East (Northern Virginia)</span>
                <div slot="content" style={{ padding: '1rem', color: 'var(--skyra-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Status: <strong>HEALTHY</strong>. 4 Availability Zones online. RPO: &lt; 1 second, RTO: 0 seconds (hot standby).
                </div>
              </skyra-accordion-item>

              <skyra-accordion-item value="region-eu" open suppressHydrationWarning>
                <span slot="trigger">Secondary Region: EU-Central (Frankfurt)</span>
                <div slot="content" style={{ padding: '1rem', color: 'var(--skyra-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Status: <strong>HEALTHY</strong>. Active replica cluster synchronized. Cross-region replication latency: 72ms.
                </div>
              </skyra-accordion-item>

              <skyra-accordion-item value="region-ap" suppressHydrationWarning>
                <span slot="trigger">Failover Region: AP-South (Mumbai)</span>
                <div slot="content" style={{ padding: '1rem', color: 'var(--skyra-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Status: <strong>STANDBY</strong>. Automated failover drills executed quarterly.
                </div>
              </skyra-accordion-item>
            </skyra-accordion>
          </div>
        </DemoBlock>
      </DemoSection>
    </div>
  );
}
