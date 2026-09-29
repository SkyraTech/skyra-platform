'use client';

import React from 'react';
import { Tooltip, Button, StatusBadge } from '@skyra/ui';
import { DemoSection, DemoBlock } from '@/components/demos/DemoSection';
import { HelpCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

const STATUS_MAP = {
  healthy: { label: 'Healthy', bg: 'var(--skyra-success-light)', color: 'var(--skyra-success)' },
  warning: { label: 'Warning', bg: 'var(--skyra-warning-light)', color: 'var(--skyra-warning)' },
  error: { label: 'Error', bg: 'var(--skyra-danger-light)', color: 'var(--skyra-danger)' },
};

export default function TooltipShowcasePage() {
  const RichStatusContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '220px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--skyra-border)', paddingBottom: '0.375rem' }}>
        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--skyra-text)' }}>Node Cluster #04</span>
        <StatusBadge status="healthy" statusMap={STATUS_MAP} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--skyra-text-muted)' }}>
        <span>CPU Utilization:</span>
        <span style={{ fontWeight: 600, color: 'var(--skyra-text)' }}>24.8%</span>
        <span>Memory Allocation:</span>
        <span style={{ fontWeight: 600, color: 'var(--skyra-text)' }}>4.2 GB / 16 GB</span>
        <span>Active Connections:</span>
        <span style={{ fontWeight: 600, color: 'var(--skyra-text)' }}>1,420</span>
      </div>
    </div>
  );

  return (
    <div className="dash-page" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--skyra-text)', margin: 0 }}>
          Rich Tooltip System
        </h1>
        <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
          Accessible, viewport-collision aware tooltips supporting plain strings, rich ReactNode structures, status indicators, and keyboard focus triggers.
        </p>
      </div>

      {/* 1. Placement Variants */}
      <DemoSection title="1. Directional Placements" desc="Automatic collision handling and directional placements." erpSource="Platform Foundation">
        <DemoBlock title="Top, Bottom, Left, Right Placements">
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
            <Tooltip content="Tooltip positioned on top" placement="top">
              <Button variant="outline">Top Tooltip</Button>
            </Tooltip>
            <Tooltip content="Tooltip positioned on bottom" placement="bottom">
              <Button variant="outline">Bottom Tooltip</Button>
            </Tooltip>
            <Tooltip content="Tooltip positioned on left" placement="left">
              <Button variant="outline">Left Tooltip</Button>
            </Tooltip>
            <Tooltip content="Tooltip positioned on right" placement="right">
              <Button variant="outline">Right Tooltip</Button>
            </Tooltip>
            <Tooltip content="Auto-positioned based on collision detection" placement="auto">
              <Button variant="primary">Auto Collision</Button>
            </Tooltip>
          </div>
        </DemoBlock>
      </DemoSection>

      {/* 2. Rich Content Tooltips */}
      <DemoSection title="2. Rich ReactNode &amp; Component Content" desc="Tooltips rendering interactive React subtrees, status indicators, and tables safely." erpSource="Platform Foundation">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="Cluster Health Telemetry Popover">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0' }}>
              <Tooltip content={RichStatusContent} placement="top">
                <Button variant="outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={16} color="var(--skyra-success)" />
                  <span>Inspect Cluster Telemetry</span>
                </Button>
              </Tooltip>
            </div>
          </DemoBlock>

          <DemoBlock title="Inline Icon Helpers &amp; Micro-Indicators">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--skyra-text)' }}>Tax Calculation Method:</span>
                <Tooltip content="Calculated using standardized ISO 3166-2 regional jurisdiction rules." placement="right">
                  <span tabIndex={0} style={{ display: 'inline-flex', cursor: 'help', color: 'var(--skyra-primary)' }}>
                    <HelpCircle size={16} />
                  </span>
                </Tooltip>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--skyra-text)' }}>Database Replica Lag:</span>
                <Tooltip
                  content={
                    <div style={{ padding: '0.25rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--skyra-warning)' }}>Notice: Replication Lag Detected</div>
                      <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Secondary shard #2 is lagging by 142ms. Write transactions remain unaffected.</div>
                    </div>
                  }
                  placement="top"
                >
                  <span tabIndex={0} style={{ display: 'inline-flex', cursor: 'pointer', color: 'var(--skyra-warning)' }}>
                    <AlertTriangle size={16} />
                  </span>
                </Tooltip>
              </div>
            </div>
          </DemoBlock>
        </div>
      </DemoSection>

      {/* 24-Point Specification */}
      <div style={{ marginTop: '4rem', background: 'var(--skyra-surface)', border: '1px solid var(--skyra-border)', borderRadius: 'var(--skyra-radius-xl)', padding: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--skyra-font-display)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--skyra-text)' }}>
          24-Point Component Documentation & Verification
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
          <div><strong>1. Name:</strong> Tooltip</div>
          <div><strong>2. Package:</strong> <code>@skyra/ui</code></div>
          <div><strong>3. Classification:</strong> [C] Platform UI Primitive</div>
          <div><strong>4. Description:</strong> Viewport-aware accessible popover tooltip supporting text and React nodes</div>
          <div><strong>5. Rationale:</strong> Contextual hints without cluttering primary page real estate</div>
          <div><strong>6. When to Use:</strong> Icon button labels, telemetry summaries, form field guidance</div>
          <div><strong>7. When NOT to Use:</strong> Critical actions requiring permanent visibility</div>
          <div><strong>8. Live Preview:</strong> Interactive demos rendered above</div>
          <div><strong>9. Interactive Controls:</strong> Hover, focus, Escape key to dismiss</div>
          <div><strong>10. Variants:</strong> top, bottom, left, right, auto</div>
          <div><strong>11. Sizes:</strong> Dynamic content sizing with max-width bounding</div>
          <div><strong>12. States:</strong> hidden, visible, hovered, focused</div>
          <div><strong>13. Props/API:</strong> <code>TooltipProps</code></div>
          <div><strong>14. Events:</strong> focus/blur, mouseenter/mouseleave</div>
          <div><strong>15. Slots/Children:</strong> Trigger child, content <code>ReactNode</code></div>
          <div><strong>16. Accessibility:</strong> <code>role=&quot;tooltip&quot;</code>, <code>aria-describedby</code></div>
          <div><strong>17. Keyboard:</strong> Tab into trigger shows tooltip; Escape closes</div>
          <div><strong>18. Responsive:</strong> Viewport bounds clamp prevents offscreen clipping</div>
          <div><strong>19. Dark Mode:</strong> High contrast surface token with subtle elevation shadow</div>
          <div><strong>20. Code:</strong> Zero external bloat; pure CSS &amp; DOM positioning</div>
          <div><strong>21. Do/Don&apos;t:</strong> Don&apos;t put crucial action buttons inside non-interactive tooltips</div>
          <div><strong>22. Related:</strong> Button, StatusBadge, Popover</div>
          <div><strong>23. ERP Source:</strong> ERP icon helper hints &amp; status popovers</div>
          <div><strong>24. Testing:</strong> Unit tests covering focus, hover, and rich ReactNode rendering</div>
        </div>
      </div>
    </div>
  );
}
