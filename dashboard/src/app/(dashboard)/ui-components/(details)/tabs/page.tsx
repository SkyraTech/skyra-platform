'use client';

import React, { useState } from 'react';
import '@skyra-tech-platform/tabs';
import { DemoSection, DemoBlock } from '@/components/demos/DemoSection';

export default function TabsShowcasePage() {
  const [lineVariantTab, setLineVariantTab] = useState('overview');
  const [pillVariantTab, setPillVariantTab] = useState('metrics');
  const [verticalTab, setVerticalTab] = useState('general');

  return (
    <div className="dash-page" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--skyra-text)', margin: 0 }}>
          Tabs Component Showcase
        </h1>
        <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
          Accessible WAI-ARIA tabbed navigation container supporting automatic/manual activation, horizontal and vertical orientations, and line/pill styling variants.
        </p>
      </div>

      {/* 1. LINE VARIANT */}
      <DemoSection
        title="1. Line Variant (Default)"
        desc="Underline indicator with animated active indicator line, optimal for primary section navigation."
        erpSource="@skyra-tech-platform/tabs"
      >
        <DemoBlock title="Standard Line Tabs">
          <div style={{ width: '100%' }}>
            <skyra-tabs
              variant="line"
              default-value="overview"
              suppressHydrationWarning
            >
              <skyra-tab slot="tab" value="overview" suppressHydrationWarning>Cluster Overview</skyra-tab>
              <skyra-tab slot="tab" value="analytics" suppressHydrationWarning>Live Telemetry</skyra-tab>
              <skyra-tab slot="tab" value="security" suppressHydrationWarning>Security Posture</skyra-tab>
              <skyra-tab slot="tab" value="audit" disabled suppressHydrationWarning>Audit Logs (Locked)</skyra-tab>

              <skyra-tab-panel slot="panel" value="overview" suppressHydrationWarning>
                <div style={{ padding: '1.5rem', background: 'var(--skyra-surface)', border: '1px solid var(--skyra-border)', borderRadius: 'var(--skyra-radius-md)', marginTop: '1rem' }}>
                  <h4 style={{ margin: '0 0 0.5rem', color: 'var(--skyra-text)' }}>All 14 Clusters Operational</h4>
                  <p style={{ margin: 0, color: 'var(--skyra-text-muted)', fontSize: '0.9rem' }}>
                    Zero outages detected in the last 30 rolling days. Regional replicas are in sync across US-East, EU-Central, and AP-South.
                  </p>
                </div>
              </skyra-tab-panel>

              <skyra-tab-panel slot="panel" value="analytics" suppressHydrationWarning>
                <div style={{ padding: '1.5rem', background: 'var(--skyra-surface)', border: '1px solid var(--skyra-border)', borderRadius: 'var(--skyra-radius-md)', marginTop: '1rem' }}>
                  <h4 style={{ margin: '0 0 0.5rem', color: 'var(--skyra-text)' }}>Telemetry Ingestion Rate</h4>
                  <p style={{ margin: 0, color: 'var(--skyra-text-muted)', fontSize: '0.9rem' }}>
                    Peak ingestion rate: 28,400 events/sec. Average end-to-end processing latency: 14.2ms.
                  </p>
                </div>
              </skyra-tab-panel>

              <skyra-tab-panel slot="panel" value="security" suppressHydrationWarning>
                <div style={{ padding: '1.5rem', background: 'var(--skyra-surface)', border: '1px solid var(--skyra-border)', borderRadius: 'var(--skyra-radius-md)', marginTop: '1rem' }}>
                  <h4 style={{ margin: '0 0 0.5rem', color: 'var(--skyra-text)' }}>TLS 1.3 & mTLS Enforced</h4>
                  <p style={{ margin: 0, color: 'var(--skyra-text-muted)', fontSize: '0.9rem' }}>
                    Strict zero-trust policies active. Certificate expiration countdown: 68 days remaining.
                  </p>
                </div>
              </skyra-tab-panel>
            </skyra-tabs>
          </div>
        </DemoBlock>
      </DemoSection>

      {/* 2. PILL VARIANT */}
      <DemoSection
        title="2. Pill Variant"
        desc="Filled capsule styling with high-contrast active states, ideal for data filtering and sub-view switching."
      >
        <DemoBlock title="Pill Filter Tabs">
          <div style={{ width: '100%' }}>
            <skyra-tabs
              variant="pill"
              default-value="metrics"
              suppressHydrationWarning
            >
              <skyra-tab slot="tab" value="metrics" suppressHydrationWarning>Real-Time Metrics</skyra-tab>
              <skyra-tab slot="tab" value="logs" suppressHydrationWarning>Application Logs</skyra-tab>
              <skyra-tab slot="tab" value="traces" suppressHydrationWarning>Distributed Traces</skyra-tab>

              <skyra-tab-panel slot="panel" value="metrics" suppressHydrationWarning>
                <div style={{ padding: '1.25rem', background: 'var(--skyra-surface)', border: '1px solid var(--skyra-border)', borderRadius: 'var(--skyra-radius-md)', marginTop: '1rem' }}>
                  <p style={{ margin: 0, color: 'var(--skyra-text)', fontSize: '0.9rem' }}>
                    <strong>Metrics View:</strong> CPU utilization average: 24.8%, Memory load: 41.2%, IOPS: 1,820/s.
                  </p>
                </div>
              </skyra-tab-panel>

              <skyra-tab-panel slot="panel" value="logs" suppressHydrationWarning>
                <div style={{ padding: '1.25rem', background: 'var(--skyra-surface)', border: '1px solid var(--skyra-border)', borderRadius: 'var(--skyra-radius-md)', marginTop: '1rem' }}>
                  <p style={{ margin: 0, color: 'var(--skyra-text)', fontSize: '0.9rem' }}>
                    <strong>Logs Stream:</strong> Ingestion active. Filter by severity level [INFO, WARN, ERROR, FATAL].
                  </p>
                </div>
              </skyra-tab-panel>

              <skyra-tab-panel slot="panel" value="traces" suppressHydrationWarning>
                <div style={{ padding: '1.25rem', background: 'var(--skyra-surface)', border: '1px solid var(--skyra-border)', borderRadius: 'var(--skyra-radius-md)', marginTop: '1rem' }}>
                  <p style={{ margin: 0, color: 'var(--skyra-text)', fontSize: '0.9rem' }}>
                    <strong>Trace Graph:</strong> 100% of sample spans resolved with 0 unhandled promise rejections.
                  </p>
                </div>
              </skyra-tab-panel>
            </skyra-tabs>
          </div>
        </DemoBlock>
      </DemoSection>

      {/* 3. VERTICAL ORIENTATION */}
      <DemoSection
        title="3. Vertical Orientation"
        desc="Side-by-side vertical navigation with keyboard arrow up/down focus management."
      >
        <DemoBlock title="Vertical Settings Layout">
          <div style={{ width: '100%' }}>
            <skyra-tabs
              orientation="vertical"
              variant="line"
              default-value="general"
              suppressHydrationWarning
            >
              <skyra-tab slot="tab" value="general" suppressHydrationWarning>General Settings</skyra-tab>
              <skyra-tab slot="tab" value="billing" suppressHydrationWarning>Billing & Plans</skyra-tab>
              <skyra-tab slot="tab" value="api" suppressHydrationWarning>API Credentials</skyra-tab>

              <skyra-tab-panel slot="panel" value="general" suppressHydrationWarning>
                <div style={{ padding: '1.5rem', background: 'var(--skyra-surface)', border: '1px solid var(--skyra-border)', borderRadius: 'var(--skyra-radius-md)' }}>
                  <h4 style={{ margin: '0 0 0.5rem', color: 'var(--skyra-text)' }}>Organization Profile</h4>
                  <p style={{ margin: 0, color: 'var(--skyra-text-muted)', fontSize: '0.9rem' }}>
                    Configure display name, canonical timezone (UTC), and default locale for export spreadsheets.
                  </p>
                </div>
              </skyra-tab-panel>

              <skyra-tab-panel slot="panel" value="billing" suppressHydrationWarning>
                <div style={{ padding: '1.5rem', background: 'var(--skyra-surface)', border: '1px solid var(--skyra-border)', borderRadius: 'var(--skyra-radius-md)' }}>
                  <h4 style={{ margin: '0 0 0.5rem', color: 'var(--skyra-text)' }}>Enterprise License</h4>
                  <p style={{ margin: 0, color: 'var(--skyra-text-muted)', fontSize: '0.9rem' }}>
                    Tier: Platinum Enterprise. Next automated invoicing date: November 1st, 2026.
                  </p>
                </div>
              </skyra-tab-panel>

              <skyra-tab-panel slot="panel" value="api" suppressHydrationWarning>
                <div style={{ padding: '1.5rem', background: 'var(--skyra-surface)', border: '1px solid var(--skyra-border)', borderRadius: 'var(--skyra-radius-md)' }}>
                  <h4 style={{ margin: '0 0 0.5rem', color: 'var(--skyra-text)' }}>Active API Keys</h4>
                  <p style={{ margin: 0, color: 'var(--skyra-text-muted)', fontSize: '0.9rem' }}>
                    2 production keys active. Key rotation policy: Every 90 days.
                  </p>
                </div>
              </skyra-tab-panel>
            </skyra-tabs>
          </div>
        </DemoBlock>
      </DemoSection>
    </div>
  );
}
