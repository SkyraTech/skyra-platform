'use client';

import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent, Badge } from '@/components/ui';
import '@skyra-tech-platform/button';
import '@skyra-tech-platform/input';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { DocsHeader } from '@/components/docs/DocsHeader';
import { PackageMeta } from '@/components/docs/PackageMeta';
import { InstallCommand } from '@/components/docs/InstallCommand';
import { LiveExample } from '@/components/docs/LiveExample';
import { HeadingAnchor } from '@/components/docs/HeadingAnchor';
import { CodeTabs } from '@/components/docs/CodeTabs';
import { ApiTable } from '@/components/docs/ApiTable';
import { FrameworkSupport } from '@/components/docs/FrameworkSupport';
import { AccessibilityPanel } from '@/components/docs/AccessibilityPanel';
import { UsageGuidance } from '@/components/docs/UsageGuidance';
import { User, Shield, CreditCard, Bell, Settings, Activity, Layers } from 'lucide-react';

export default function TabsDocsPage() {
  const [controlledTab, setControlledTab] = useState('billing');

  const toc = [
    { id: 'quick-start', label: 'Quick Start' },
    { id: 'examples', label: 'Examples' },
    { id: 'usage', label: 'Usage Guidance' },
    { id: 'api', label: 'API Reference' },
    { id: 'frameworks', label: 'Framework Usage' },
    { id: 'accessibility', label: 'Accessibility' }
  ];

  return (
    <DocsLayout toc={toc}>
      <DocsHeader 
        title="Tabs"
        description="Production-grade WAI-ARIA tabbed interface supporting horizontal/vertical orientations, automatic and manual activation, line and pill variants."
        breadcrumbs={[
          { label: 'Components', href: '/components' },
          { label: 'Navigation' },
          { label: 'Tabs' }
        ]}
        badges={[
          { label: 'Stable', variant: 'stable' },
          { label: 'Web Component', variant: 'tech' }
        ]}
      />

      <PackageMeta 
        packageName="@skyra-tech-platform/tabs"
        version="0.1.0"
        type="TypeScript / Web Component"
      />

      <section id="quick-start" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="quick-start" level={2}>Quick Start</HeadingAnchor>
        <InstallCommand packageName="@skyra-tech-platform/tabs" />
      </section>

      <HeadingAnchor id="examples">Examples</HeadingAnchor>
      
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--skyra-text)', marginBottom: '1rem', marginTop: '2rem' }}>
        Default &amp; Line Variants
      </h3>
      <CodeTabs tabs={[
        {
          label: 'React',
          language: 'tsx',
          code: `import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';

<Tabs defaultValue="overview">
  <TabsList ariaLabel="Account Settings">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="security">Security</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Overview content</TabsContent>
  <TabsContent value="security">Security content</TabsContent>
</Tabs>`
        }
      ]} />
      <div style={{ marginTop: '1rem' }}>
        <LiveExample>
          <Tabs defaultValue="overview">
            <TabsList ariaLabel="Account Settings">
              <TabsTrigger value="overview">
                <User size={15} style={{ marginRight: '8px' }} />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield size={15} style={{ marginRight: '8px' }} />
                <span>Security</span>
                <Badge variant="primary" size="sm" style={{ marginLeft: '8px' }}>2FA</Badge>
              </TabsTrigger>
              <TabsTrigger value="billing">
                <CreditCard size={15} style={{ marginRight: '8px' }} />
                <span>Billing</span>
              </TabsTrigger>
              <TabsTrigger value="disabled-tab" disabled>
                <span>Archived</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <div style={{ padding: '0.5rem 0' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--skyra-text)' }}>Account Overview</h4>
                <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.875rem' }}>
                  Manage your profile information, email preferences, and personal workspace settings.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                  <skyra-tech-input defaultValue="Alex Rivers" placeholder="Full name" />
                  <skyra-tech-button variant="primary">Save Changes</skyra-tech-button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="security">
              <div style={{ padding: '0.5rem 0' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--skyra-text)' }}>Security &amp; Credentials</h4>
                <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.875rem' }}>
                  Two-factor authentication is currently active on this account.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="billing">
              <div style={{ padding: '0.5rem 0' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--skyra-text)' }}>Billing &amp; Subscription</h4>
                <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.875rem' }}>
                  Current Plan: <strong>Enterprise Tier ($499/mo)</strong>
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </LiveExample>
      </div>

      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--skyra-text)', marginBottom: '1rem', marginTop: '3rem' }}>
        Pill Variant &amp; Vertical Orientation
      </h3>
      <div style={{ marginTop: '1rem' }}>
        <LiveExample>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <h4 style={{ margin: '0 0 1rem 0' }}>Pill Variant</h4>
              <Tabs defaultValue="day" variant="pill">
                <TabsList ariaLabel="Analytics Timeframe">
                  <TabsTrigger value="day">Day</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                </TabsList>
                <TabsContent value="day"><div style={{ padding: '0.5rem 0', fontSize: '0.875rem', color: 'var(--skyra-text-muted)' }}>24-hour telemetry metrics.</div></TabsContent>
                <TabsContent value="week"><div style={{ padding: '0.5rem 0', fontSize: '0.875rem', color: 'var(--skyra-text-muted)' }}>7-day rolling performance aggregations.</div></TabsContent>
                <TabsContent value="month"><div style={{ padding: '0.5rem 0', fontSize: '0.875rem', color: 'var(--skyra-text-muted)' }}>Monthly invoice settlement summary.</div></TabsContent>
              </Tabs>
            </div>
            <div>
              <h4 style={{ margin: '0 0 1rem 0' }}>Vertical Orientation</h4>
              <Tabs defaultValue="general" orientation="vertical">
                <TabsList ariaLabel="Platform Settings">
                  <TabsTrigger value="general"><Settings size={15} style={{ marginRight: '8px' }} />General</TabsTrigger>
                  <TabsTrigger value="notifications"><Bell size={15} style={{ marginRight: '8px' }} />Notifications</TabsTrigger>
                </TabsList>
                <div style={{ flex: 1 }}>
                  <TabsContent value="general"><div style={{ paddingLeft: '1rem' }}>General Configuration</div></TabsContent>
                  <TabsContent value="notifications"><div style={{ paddingLeft: '1rem' }}>Notification Preferences</div></TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </LiveExample>
      </div>

      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--skyra-text)', marginBottom: '1rem', marginTop: '3rem' }}>
        Controlled State
      </h3>
      <div style={{ marginTop: '1rem' }}>
        <LiveExample>
          <div style={{ padding: '1rem 0' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <skyra-tech-button size="sm" variant={controlledTab === 'general' ? 'primary' : 'outline'} onClick={() => setControlledTab('general')}>Select General</skyra-tech-button>
              <skyra-tech-button size="sm" variant={controlledTab === 'billing' ? 'primary' : 'outline'} onClick={() => setControlledTab('billing')}>Select Billing</skyra-tech-button>
            </div>

            <Tabs value={controlledTab} onValueChange={setControlledTab}>
              <TabsList>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
              </TabsList>
              <TabsContent value="general">Active: General tab content</TabsContent>
              <TabsContent value="billing">Active: Billing tab content</TabsContent>
            </Tabs>
          </div>
        </LiveExample>
      </div>

      <HeadingAnchor id="usage">Usage Guidance</HeadingAnchor>
      <UsageGuidance
        doItems={[
          'Use Tabs to organize related content at the same level of hierarchy.',
          'Keep tab labels short (1-2 words).',
          'Use horizontal tabs when there are 2-5 items. Use vertical tabs for more complex side-navigation scenarios.'
        ]}
        dontItems={[
          'Do not use Tabs for a sequential step-by-step wizard process.',
          'Do not use Tabs if the content panels are entirely unrelated features.',
          'Do not nest Tabs inside other Tabs as it creates confusing navigation hierarchies.'
        ]}
      />

      <HeadingAnchor id="api">API Reference</HeadingAnchor>
      <ApiTable 
        title="<skyra-tabs> Element Attributes"
        headers={['Property', 'Type', 'Description']}
        rows={[
          { name: 'value', type: 'string', description: 'Controlled value of the selected tab.' },
          { name: 'default-value', type: 'string', description: 'Uncontrolled initial value.' },
          { name: 'orientation', type: "'horizontal' | 'vertical'", description: 'The visual layout orientation. Default is horizontal.' },
          { name: 'activation-mode', type: "'automatic' | 'manual'", description: 'Whether tabs activate immediately on focus. Default is automatic.' },
          { name: 'variant', type: "'line' | 'pill'", description: 'Visual style variant. Default is line.' },
        ]}
      />
      <ApiTable 
        title="Events"
        headers={['Event', 'Payload', 'Description']}
        rows={[
          { name: 'skyra-tabs-change', type: '{ value: string }', description: 'Fired when the selected tab changes.' },
        ]}
      />

      <HeadingAnchor id="frameworks">Framework Usage</HeadingAnchor>
      <FrameworkSupport
        frameworks={[
          {
            name: 'React / Next.js',
            support: 'e2e',
            integration: 'Since React does not natively listen to Web Component custom events like `skyra-tabs-change`, the dashboard includes a thin `<Tabs>` wrapper in `components/ui/Tabs.tsx` to handle the `onValueChange` event mapping. The elements can also be used directly as intrinsic elements.'
          },
          {
            name: 'Vanilla JS',
            support: 'e2e',
            integration: 'Use `<skyra-tabs>`, `<skyra-tab>`, and `<skyra-tab-panel>` natively.'
          }
        ]}
      />

      <HeadingAnchor id="accessibility">Accessibility</HeadingAnchor>
      <AccessibilityPanel
        features={[
          'Implements the complete W3C WAI-ARIA Tabs design pattern.',
          'Automatically assigns `role="tablist"`, `role="tab"`, and `role="tabpanel"`.',
          'Links tabs and panels correctly via `aria-controls` and `aria-labelledby`.',
          'Supports full keyboard navigation (`ArrowRight`, `ArrowLeft`, `Home`, `End`) in horizontal mode, and `ArrowUp`/`ArrowDown` in vertical mode.',
          'Maintains focus trapping and visual focus rings.'
        ]}
      />
    </DocsLayout>
  );
}
