'use client';

import React, { useState } from 'react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Button,
  Input,
  Badge,
  Card,
} from '@skyra/ui';
import { DemoSection, DemoBlock } from '@/components/demos/DemoSection';
import {
  User,
  Shield,
  CreditCard,
  Bell,
  Settings,
  Activity,
  Layers,
} from 'lucide-react';

export default function TabsShowcasePage() {
  const [controlledTab, setControlledTab] = useState('billing');

  return (
    <div className="dash-page" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--skyra-text)', margin: 0 }}>
          Tabs Component
        </h1>
        <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
          Production-grade WAI-ARIA tabbed interface supporting horizontal/vertical orientations, automatic and manual activation, line and pill variants, icons, badges, and responsive horizontal scrolling.
        </p>
      </div>

      {/* 1. Default Horizontal Tabs */}
      <DemoSection title="1. Default &amp; Line Variants" desc="Standard horizontal tabs with automatic keyboard navigation, icon composition, and active badges." erpSource="Platform Foundation">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="Default Underline Tabs">
            <div style={{ padding: '1rem 0' }}>
              <Tabs defaultValue="overview">
                <TabsList ariaLabel="Account Settings">
                  <TabsTrigger value="overview">
                    <User size={15} />
                    <span>Overview</span>
                  </TabsTrigger>
                  <TabsTrigger value="security">
                    <Shield size={15} />
                    <span>Security</span>
                    <Badge variant="primary" size="sm">2FA</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="billing">
                    <CreditCard size={15} />
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
                      <Input defaultValue="Alex Rivers" placeholder="Full name" />
                      <Button variant="primary">Save Changes</Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="security">
                  <div style={{ padding: '0.5rem 0' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--skyra-text)' }}>Security &amp; Credentials</h4>
                    <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.875rem' }}>
                      Two-factor authentication is currently active on this account.
                    </p>
                    <Button variant="outline">Manage 2FA Hardware Keys</Button>
                  </div>
                </TabsContent>

                <TabsContent value="billing">
                  <div style={{ padding: '0.5rem 0' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--skyra-text)' }}>Billing &amp; Subscription</h4>
                    <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.875rem' }}>
                      Current Plan: <strong>Enterprise Tier ($499/mo)</strong>
                    </p>
                    <Button variant="primary">Update Payment Method</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </DemoBlock>

          <DemoBlock title="Pill Variant (Segmented Style)">
            <div style={{ padding: '1rem 0' }}>
              <Tabs defaultValue="day" variant="pill">
                <TabsList ariaLabel="Analytics Timeframe">
                  <TabsTrigger value="day">Day</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="year">Year</TabsTrigger>
                </TabsList>

                <TabsContent value="day">
                  <div style={{ padding: '0.5rem 0', fontSize: '0.875rem', color: 'var(--skyra-text-muted)' }}>
                    Displaying 24-hour telemetry metrics. Real-time stream active.
                  </div>
                </TabsContent>
                <TabsContent value="week">
                  <div style={{ padding: '0.5rem 0', fontSize: '0.875rem', color: 'var(--skyra-text-muted)' }}>
                    Displaying 7-day rolling performance aggregations.
                  </div>
                </TabsContent>
                <TabsContent value="month">
                  <div style={{ padding: '0.5rem 0', fontSize: '0.875rem', color: 'var(--skyra-text-muted)' }}>
                    Displaying monthly invoice settlement summary.
                  </div>
                </TabsContent>
                <TabsContent value="year">
                  <div style={{ padding: '0.5rem 0', fontSize: '0.875rem', color: 'var(--skyra-text-muted)' }}>
                    Displaying annual fiscal year financial summaries.
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </DemoBlock>
        </div>
      </DemoSection>

      {/* 2. Vertical Orientation & Controlled State */}
      <DemoSection title="2. Vertical Orientation &amp; Controlled State" desc="Side-nav tabs layout and synchronized controlled value." erpSource="Platform Foundation">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="Vertical Tabs Orientation">
            <div style={{ padding: '1rem 0' }}>
              <Tabs defaultValue="general" orientation="vertical">
                <TabsList ariaLabel="Platform Settings">
                  <TabsTrigger value="general">
                    <Settings size={15} />
                    <span>General</span>
                  </TabsTrigger>
                  <TabsTrigger value="notifications">
                    <Bell size={15} />
                    <span>Notifications</span>
                  </TabsTrigger>
                  <TabsTrigger value="integrations">
                    <Layers size={15} />
                    <span>Integrations</span>
                  </TabsTrigger>
                  <TabsTrigger value="telemetry">
                    <Activity size={15} />
                    <span>Telemetry</span>
                  </TabsTrigger>
                </TabsList>

                <div style={{ flex: 1 }}>
                  <TabsContent value="general">
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>General Configuration</div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--skyra-text-muted)' }}>
                      Set default organization locale, timezone, and currency formats.
                    </p>
                  </TabsContent>
                  <TabsContent value="notifications">
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Notification Preferences</div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--skyra-text-muted)' }}>
                      Configure alert thresholds, webhook dispatchers, and digest frequencies.
                    </p>
                  </TabsContent>
                  <TabsContent value="integrations">
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Connected Integrations</div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--skyra-text-muted)' }}>
                      Manage active API tokens, webhooks, and third-party sync connectors.
                    </p>
                  </TabsContent>
                  <TabsContent value="telemetry">
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Diagnostics &amp; Telemetry</div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--skyra-text-muted)' }}>
                      Live cluster CPU, memory, and database connection pool logs.
                    </p>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </DemoBlock>

          <DemoBlock title="Controlled Tabs State">
            <div style={{ padding: '1rem 0' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <Button size="sm" variant={controlledTab === 'general' ? 'primary' : 'outline'} onClick={() => setControlledTab('general')}>Select General</Button>
                <Button size="sm" variant={controlledTab === 'billing' ? 'primary' : 'outline'} onClick={() => setControlledTab('billing')}>Select Billing</Button>
                <Button size="sm" variant={controlledTab === 'advanced' ? 'primary' : 'outline'} onClick={() => setControlledTab('advanced')}>Select Advanced</Button>
              </div>

              <Tabs value={controlledTab} onValueChange={setControlledTab}>
                <TabsList>
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="billing">Billing</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>
                <TabsContent value="general">Active: General tab content</TabsContent>
                <TabsContent value="billing">Active: Billing tab content</TabsContent>
                <TabsContent value="advanced">Active: Advanced tab content</TabsContent>
              </Tabs>
            </div>
          </DemoBlock>
        </div>
      </DemoSection>
    </div>
  );
}
