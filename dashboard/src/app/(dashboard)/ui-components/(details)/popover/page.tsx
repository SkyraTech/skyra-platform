'use client';

import React, { useState } from 'react';
import { Popover, Button, Input, Switch, Badge } from '@skyra/ui';
import { DemoSection, DemoBlock } from '@/components/demos/DemoSection';
import { Settings, Filter, Sliders, Info, Bell, Shield } from 'lucide-react';

export default function PopoverShowcasePage() {
  const [controlledOpen, setControlledOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [filterQuery, setFilterQuery] = useState('');

  return (
    <div className="dash-page" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--skyra-text)', margin: 0 }}>
          Popover Component
        </h1>
        <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
          Generic anchored rich content overlay with collision detection, boundary protection, focus restoration, and keyboard dismissal.
        </p>
      </div>

      {/* 1. Placement Variants */}
      <DemoSection title="1. Directional Placements &amp; Alignment" desc="Anchored positioning with top, bottom, left, and right placement options and start/end alignment." erpSource="Platform Foundation">
        <DemoBlock title="Positioning Variants">
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
            <Popover
              placement="top"
              trigger={<Button variant="outline">Top Placement</Button>}
              content={
                <div style={{ padding: '0.25rem' }}>
                  <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Top Popover</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--skyra-text-muted)' }}>
                    Positioned directly above the anchor with automatic viewport collision detection.
                  </div>
                </div>
              }
            />

            <Popover
              placement="bottom"
              trigger={<Button variant="outline">Bottom Placement</Button>}
              content={
                <div style={{ padding: '0.25rem' }}>
                  <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Bottom Popover</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--skyra-text-muted)' }}>
                    Default placement below the trigger button.
                  </div>
                </div>
              }
            />

            <Popover
              placement="left"
              trigger={<Button variant="outline">Left Placement</Button>}
              content={
                <div style={{ padding: '0.25rem' }}>
                  <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Left Popover</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--skyra-text-muted)' }}>
                    Positioned to the left side of the anchor.
                  </div>
                </div>
              }
            />

            <Popover
              placement="right"
              trigger={<Button variant="outline">Right Placement</Button>}
              content={
                <div style={{ padding: '0.25rem' }}>
                  <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Right Popover</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--skyra-text-muted)' }}>
                    Positioned to the right side of the anchor.
                  </div>
                </div>
              }
            />
          </div>
        </DemoBlock>
      </DemoSection>

      {/* 2. Interactive Rich Content Popovers */}
      <DemoSection title="2. Interactive Forms &amp; Filter Panels" desc="Popovers containing complex form inputs, toggles, and action controls." erpSource="Platform Foundation">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="Data Table Filter Panel">
            <div style={{ padding: '1rem 0' }}>
              <Popover
                placement="bottom"
                align="start"
                minWidth={280}
                trigger={
                  <Button variant="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Filter size={16} />
                    <span>Filter Records</span>
                    <Badge variant="primary" size="sm">2 Active</Badge>
                  </Button>
                }
                content={
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', borderBottom: '1px solid var(--skyra-border)', paddingBottom: '0.5rem' }}>
                      Filter Criteria
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--skyra-text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                        Search Keyword
                      </label>
                      <Input
                        value={filterQuery}
                        onChange={(e) => setFilterQuery(e.target.value)}
                        placeholder="Search invoices..."
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                      <span style={{ fontSize: '0.85rem' }}>Only Overdue</span>
                      <Switch defaultChecked variant="compact" />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--skyra-border)' }}>
                      <Button variant="ghost" size="sm" onClick={() => setFilterQuery('')}>Reset</Button>
                      <Button variant="primary" size="sm">Apply</Button>
                    </div>
                  </div>
                }
              />
            </div>
          </DemoBlock>

          <DemoBlock title="Quick Settings Overlay">
            <div style={{ padding: '1rem 0' }}>
              <Popover
                placement="bottom"
                align="end"
                minWidth={300}
                trigger={
                  <Button variant="outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Settings size={16} />
                    <span>User Preferences</span>
                  </Button>
                }
                content={
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--skyra-border)', paddingBottom: '0.5rem' }}>
                      <Sliders size={16} color="var(--skyra-primary)" />
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Application Settings</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Real-time Notifications</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--skyra-text-muted)' }}>Receive audit alerts</div>
                      </div>
                      <Switch
                        checked={notificationsEnabled}
                        onChange={setNotificationsEnabled}
                        variant="default"
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Two-Factor Auth</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--skyra-text-muted)' }}>Require hardware key</div>
                      </div>
                      <Switch defaultChecked variant="default" />
                    </div>
                  </div>
                }
              />
            </div>
          </DemoBlock>
        </div>
      </DemoSection>

      {/* 3. Controlled State */}
      <DemoSection title="3. Controlled Lifecycle Management" desc="Full programmatic control over open/close state." erpSource="Platform Foundation">
        <DemoBlock title="Programmatic Popover Triggering">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0' }}>
            <Button
              variant="outline"
              onClick={() => setControlledOpen(!controlledOpen)}
            >
              {controlledOpen ? 'Close Programmatically' : 'Open Programmatically'}
            </Button>

            <Popover
              open={controlledOpen}
              onOpenChange={setControlledOpen}
              trigger={<Button variant="primary">Controlled Popover Anchor</Button>}
              content={
                <div style={{ padding: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <Info size={16} color="var(--skyra-primary)" />
                    <span style={{ fontWeight: 700 }}>Synchronized State</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--skyra-text-muted)', margin: 0 }}>
                    This popover is synchronized with parent component state. Dismissing via Escape, outside click, or toggle updates both.
                  </p>
                </div>
              }
            />
          </div>
        </DemoBlock>
      </DemoSection>
    </div>
  );
}
