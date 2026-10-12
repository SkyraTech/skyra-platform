'use client';

import React, { useState, useRef, useEffect } from 'react';
import '@skyra-tech-platform/button';
import '@skyra-tech-platform/input';
import '@skyra-tech-platform/switch';
import '@skyra-tech-platform/popover';
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
import { RelatedComponents } from '@/components/docs/RelatedComponents';
import { Filter, Settings, Info, Sliders, ChevronDown } from 'lucide-react';
import type { SkyraPopoverElement } from '@skyra-tech-platform/popover';

export default function PopoverDocsPage() {
  const [controlledOpen, setControlledOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const controlledRef = useRef<SkyraPopoverElement>(null);

  useEffect(() => {
    const el = controlledRef.current;
    if (!el) return;

    const handleOpen = () => setControlledOpen(true);
    const handleClose = () => setControlledOpen(false);

    el.addEventListener('skyra-popover-open', handleOpen);
    el.addEventListener('skyra-popover-close', handleClose);

    return () => {
      el.removeEventListener('skyra-popover-open', handleOpen);
      el.removeEventListener('skyra-popover-close', handleClose);
    };
  }, []);

  const toc = [
    { id: 'quick-start', label: 'Quick Start' },
    { id: 'examples', label: 'Examples' },
    { id: 'usage', label: 'Usage Guidance' },
    { id: 'api', label: 'API Reference' },
    { id: 'frameworks', label: 'Framework Usage' },
    { id: 'accessibility', label: 'Accessibility' },
    { id: 'related', label: 'Related Components' },
    { id: 'technical', label: 'Technical Reference' },
  ];

  return (
    <DocsLayout toc={toc}>
      <DocsHeader
        title="Popover"
        description="Framework-agnostic anchored rich content overlay Web Component with dynamic collision detection, boundary protection, focus restoration, and keyboard dismissal."
        breadcrumbs={[
          { label: 'Components', href: '/components' },
          { label: 'Overlays' },
          { label: 'Popover' },
        ]}
        badges={[
          { label: 'Stable', variant: 'stable' },
          { label: 'Web Component', variant: 'tech' },
        ]}
      />

      <PackageMeta
        packageName="@skyra-tech-platform/popover"
        version="0.1.0"
        type="Web Component"
      />

      {/* 1. Quick Start */}
      <section id="quick-start" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="quick-start" level={2}>Quick Start</HeadingAnchor>
        <InstallCommand packageName="@skyra-tech-platform/popover" />

        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--skyra-text)', marginBottom: '1rem', marginTop: '2.5rem', letterSpacing: '-0.01em' }}>
          Basic Usage
        </h3>
        <CodeTabs
          tabs={[
            {
              label: 'Web Component',
              language: 'html',
              code: `<!-- Import the component globally -->
<script type="module" src="node_modules/@skyra-tech-platform/popover/dist/index.js"></script>

<skyra-popover placement="bottom" align="start">
  <button slot="trigger">Toggle Popover</button>
  <div>
    <h4>Popover Title</h4>
    <p>Anchored rich content renders here.</p>
  </div>
</skyra-popover>`,
            },
            {
              label: 'React',
              language: 'tsx',
              code: `import '@skyra-tech-platform/popover';
import { Popover } from '@/components/ui';

export function PopoverDemo() {
  return (
    <Popover
      placement="bottom"
      trigger={<button>Toggle Popover</button>}
      content={
        <div>
          <h4>Popover Title</h4>
          <p>Anchored rich content renders here.</p>
        </div>
      }
    />
  );
}`,
            },
          ]}
        />
        <div style={{ marginTop: '1rem' }}>
          <LiveExample>
            <skyra-popover placement="bottom" align="start">
              <skyra-tech-button slot="trigger" variant="primary">
                Open Basic Popover
              </skyra-tech-button>
              <div style={{ padding: '0.25rem', width: '220px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--skyra-text)', marginBottom: '0.25rem' }}>
                  Platform Popover
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--skyra-text-muted)', lineHeight: 1.5 }}>
                  Anchored floating content rendered using canonical framework-agnostic Web Component positioning.
                </div>
              </div>
            </skyra-popover>
          </LiveExample>
        </div>
      </section>

      {/* 2. Examples */}
      <section id="examples" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="examples" level={2}>Examples</HeadingAnchor>

        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem' }}>
          Directional Placements &amp; Viewport Flipping
        </h3>
        <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '1rem', lineHeight: 1.6 }}>
          Supports <code>top</code>, <code>bottom</code>, <code>left</code>, and <code>right</code> directional placements.
          When the overlay collides with a viewport boundary, the pure positioning engine automatically flips to the opposite side.
        </p>
        <CodeTabs
          tabs={[
            {
              label: 'HTML',
              language: 'html',
              code: `<skyra-popover placement="top"><button slot="trigger">Top</button><div>Top Content</div></skyra-popover>
<skyra-popover placement="bottom"><button slot="trigger">Bottom</button><div>Bottom Content</div></skyra-popover>
<skyra-popover placement="left"><button slot="trigger">Left</button><div>Left Content</div></skyra-popover>
<skyra-popover placement="right"><button slot="trigger">Right</button><div>Right Content</div></skyra-popover>`,
            },
          ]}
        />
        <div style={{ marginTop: '1rem' }}>
          <LiveExample>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', padding: '1.5rem 0' }}>
              <skyra-popover placement="top" align="center">
                <skyra-tech-button slot="trigger" variant="outline">Top Placement</skyra-tech-button>
                <div style={{ padding: '0.25rem', width: '200px' }}>
                  <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Top Popover</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--skyra-text-muted)' }}>
                    Positioned above anchor with collision detection.
                  </div>
                </div>
              </skyra-popover>

              <skyra-popover placement="bottom" align="center">
                <skyra-tech-button slot="trigger" variant="outline">Bottom Placement</skyra-tech-button>
                <div style={{ padding: '0.25rem', width: '200px' }}>
                  <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Bottom Popover</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--skyra-text-muted)' }}>
                    Positioned below anchor by default.
                  </div>
                </div>
              </skyra-popover>

              <skyra-popover placement="left" align="center">
                <skyra-tech-button slot="trigger" variant="outline">Left Placement</skyra-tech-button>
                <div style={{ padding: '0.25rem', width: '200px' }}>
                  <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Left Popover</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--skyra-text-muted)' }}>
                    Positioned to the left side of anchor.
                  </div>
                </div>
              </skyra-popover>

              <skyra-popover placement="right" align="center">
                <skyra-tech-button slot="trigger" variant="outline">Right Placement</skyra-tech-button>
                <div style={{ padding: '0.25rem', width: '200px' }}>
                  <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Right Popover</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--skyra-text-muted)' }}>
                    Positioned to the right side of anchor.
                  </div>
                </div>
              </skyra-popover>
            </div>
          </LiveExample>
        </div>

        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem', marginTop: '2.5rem' }}>
          Interactive Forms &amp; Filter Panels
        </h3>
        <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '1rem', lineHeight: 1.6 }}>
          Unlike transient tooltips, popovers retain interactive forms, inputs, buttons, and switches without premature dismissal.
        </p>
        <div style={{ marginTop: '1rem' }}>
          <LiveExample>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <skyra-popover placement="bottom" align="start" panel-min-width="280">
                <skyra-tech-button slot="trigger" variant="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Filter size={16} />
                  <span>Filter Records</span>
                  <ChevronDown size={14} />
                </skyra-tech-button>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '280px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', borderBottom: '1px solid var(--skyra-border)', paddingBottom: '0.5rem' }}>
                    Filter Criteria
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--skyra-text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                      Search Keyword
                    </label>
                    <skyra-tech-input
                      value={filterQuery}
                      onChange={(e: any) => setFilterQuery(e.target.value)}
                      placeholder="Search items..."
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.85rem' }}>Only Overdue</span>
                    <skyra-tech-switch defaultChecked variant="compact" />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.25rem', paddingTop: '0.5rem', borderTop: '1px solid var(--skyra-border)' }}>
                    <skyra-tech-button variant="ghost" size="sm" onClick={() => setFilterQuery('')}>Reset</skyra-tech-button>
                    <skyra-tech-button variant="primary" size="sm">Apply</skyra-tech-button>
                  </div>
                </div>
              </skyra-popover>

              <skyra-popover placement="bottom" align="end" panel-min-width="300">
                <skyra-tech-button slot="trigger" variant="outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Settings size={16} />
                  <span>Preferences</span>
                </skyra-tech-button>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--skyra-border)', paddingBottom: '0.5rem' }}>
                    <Sliders size={16} color="var(--skyra-primary)" />
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Application Settings</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Real-time Alerts</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--skyra-text-muted)' }}>Audit feed notifications</div>
                    </div>
                    <skyra-tech-switch
                      checked={notificationsEnabled}
                      onChange={setNotificationsEnabled}
                      variant="default"
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Hardware Key</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--skyra-text-muted)' }}>Require 2FA device</div>
                    </div>
                    <skyra-tech-switch defaultChecked variant="default" />
                  </div>
                </div>
              </skyra-popover>
            </div>
          </LiveExample>
        </div>

        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem', marginTop: '2.5rem' }}>
          Programmatic Open/Close Lifecycle
        </h3>
        <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '1rem', lineHeight: 1.6 }}>
          Control the popover via properties or methods (<code>show()</code>, <code>hide()</code>, <code>toggle()</code>) while retaining synchronization with user dismissal events.
        </p>
        <div style={{ marginTop: '1rem' }}>
          <LiveExample>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <skyra-tech-button
                variant="outline"
                onClick={() => {
                  if (controlledRef.current) {
                    controlledRef.current.toggle();
                  }
                }}
              >
                {controlledOpen ? 'Close Programmatically' : 'Open Programmatically'}
              </skyra-tech-button>

              <skyra-popover ref={controlledRef} placement="bottom" align="start">
                <skyra-tech-button slot="trigger" variant="primary">
                  Controlled Anchor
                </skyra-tech-button>
                <div style={{ padding: '0.5rem', width: '260px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <Info size={16} color="var(--skyra-primary)" />
                    <span style={{ fontWeight: 700 }}>Synchronized State</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--skyra-text-muted)', margin: 0, lineHeight: 1.5 }}>
                    This popover is synchronized with external application state. Dismissing via outside click or Escape updates the status correctly.
                  </p>
                </div>
              </skyra-popover>
            </div>
          </LiveExample>
        </div>
      </section>

      {/* 3. Usage Guidance */}
      <section id="usage" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="usage" level={2}>Usage Guidance</HeadingAnchor>
        <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
          Use the Popover component for anchored, non-modal contextual overlays that contain rich interactive content, such as filter panels, quick settings, or auxiliary information.
        </p>
        <ul style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.6, paddingLeft: '1.25rem', marginBottom: '1.5rem' }}>
          <li><strong>Popovers vs. Modals:</strong> Popovers are non-modal and anchored to a specific trigger element, allowing the user to view surrounding page context. Use Dialog when a blocking, modal workflow is required.</li>
          <li><strong>Popovers vs. Tooltips:</strong> Tooltips are non-interactive and informational only. If the overlay contains buttons, links, or form inputs, always use Popover.</li>
          <li><strong>Popovers vs. Dropdowns:</strong> Dropdowns represent menus of choices or commands. Popovers present arbitrary complex subtrees.</li>
        </ul>
      </section>

      {/* 4. API Reference */}
      <section id="api" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="api" level={2}>API Reference</HeadingAnchor>

        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem' }}>
          Properties &amp; Attributes
        </h3>
        <ApiTable
          rows={[
            { name: 'open', type: 'boolean', defaultVal: 'false', description: 'Whether the popover content is visible.' },
            { name: 'placement', type: '"top" | "bottom" | "left" | "right" | "auto"', defaultVal: '"bottom"', description: 'Preferred direction of overlay relative to anchor.' },
            { name: 'align', type: '"start" | "center" | "end"', defaultVal: '"start"', description: 'Cross-axis alignment relative to anchor.' },
            { name: 'offset', type: 'number', defaultVal: '6', description: 'Distance in pixels between anchor and panel.' },
            { name: 'viewport-padding', type: 'number', defaultVal: '8', description: 'Minimum distance in pixels from viewport edges.' },
            { name: 'close-on-outside-click', type: 'boolean', defaultVal: 'true', description: 'Whether clicks outside dismiss the popover.' },
            { name: 'close-on-escape', type: 'boolean', defaultVal: 'true', description: 'Whether pressing Escape dismisses the popover.' },
            { name: 'disabled', type: 'boolean', defaultVal: 'false', description: 'Disables trigger interaction and prevents opening.' },
            { name: 'restore-focus', type: 'boolean', defaultVal: 'true', description: 'Restores focus to trigger upon dismissal.' },
            { name: 'panel-width', type: 'string | number', defaultVal: 'undefined', description: 'Explicit width applied to floating panel.' },
            { name: 'panel-max-width', type: 'string | number', defaultVal: '"min(90vw, 360px)"', description: 'Maximum width bounding the floating panel.' },
            { name: 'panel-min-width', type: 'string | number', defaultVal: '200', description: 'Minimum width bounding the floating panel.' },
            { name: 'aria-label', type: 'string', defaultVal: 'undefined', description: 'Accessible label for the dialog panel.' },
          ]}
        />

        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem', marginTop: '2rem' }}>
          Custom Events
        </h3>
        <ApiTable
          rows={[
            { name: 'skyra-popover-open', type: 'CustomEvent<{ placement, align }>', defaultVal: '—', description: 'Fired when the popover opens and positioning is computed.' },
            { name: 'skyra-popover-close', type: 'CustomEvent<{ reason: string }>', defaultVal: '—', description: 'Fired when the popover closes with dismissal reason ("outside-click", "escape", "toggle", "programmatic").' },
            { name: 'skyra-popover-change', type: 'CustomEvent<{ open: boolean }>', defaultVal: '—', description: 'Fired whenever the open state transitions.' },
          ]}
        />

        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem', marginTop: '2rem' }}>
          Slots
        </h3>
        <ApiTable
          rows={[
            { name: 'trigger', type: 'slot[name="trigger"]', defaultVal: '—', description: 'The trigger element that toggles the popover.' },
            { name: '(default)', type: 'slot', defaultVal: '—', description: 'The rich interactive content rendered inside the floating panel.' },
          ]}
        />
      </section>

      {/* 5. Framework Usage */}
      <section id="frameworks" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="frameworks" level={2}>Framework Usage</HeadingAnchor>
        <FrameworkSupport
          frameworks={[
            {
              name: 'React 19 & Next.js',
              support: 'e2e',
              integration: (
                <p>
                  Use the canonical <code>&lt;skyra-popover&gt;</code> component directly or through the provided thin <code>Popover</code> adapter with direct property binding and event synchronization.
                </p>
              ),
            },
            {
              name: 'Vanilla HTML / JS',
              support: 'e2e',
              integration: (
                <p>
                  Zero runtime dependencies. Import the script and use <code>&lt;skyra-popover&gt;</code> with standard slots and attributes.
                </p>
              ),
            },
          ]}
        />
      </section>

      {/* 6. Accessibility */}
      <section id="accessibility" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="accessibility" level={2}>Accessibility</HeadingAnchor>
        <AccessibilityPanel
          features={[
            <div key="aria"><strong style={{ color: 'var(--skyra-text)' }}>WAI-ARIA Attributes:</strong> Trigger exposes <code>role="button"</code>, <code>aria-haspopup="dialog"</code>, and synchronized <code>aria-expanded</code>. Panel exposes <code>role="dialog"</code> and <code>aria-modal="false"</code>.</div>,
            <div key="esc"><strong style={{ color: 'var(--skyra-text)' }}>Keyboard Dismissal:</strong> Pressing <code>Escape</code> anywhere within the document while the popover is active dismisses the overlay and returns focus to the trigger.</div>,
            <div key="trigger-kb"><strong style={{ color: 'var(--skyra-text)' }}>Keyboard Activation:</strong> Pressing <code>Enter</code> or <code>Space</code> while focused on the trigger toggles the popover.</div>,
            <div key="focus"><strong style={{ color: 'var(--skyra-text)' }}>Non-Modal Focus Flow:</strong> Popovers do not trap tab order, enabling users to tab seamlessly through internal controls and surrounding document elements.</div>,
            <div key="motion"><strong style={{ color: 'var(--skyra-text)' }}>Reduced Motion:</strong> Respects <code>prefers-reduced-motion</code> media query by disabling scale and fade transitions.</div>,
          ]}
        />
      </section>

      {/* 7. Related Components */}
      <section id="related" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="related" level={2}>Related Components</HeadingAnchor>
        <RelatedComponents
          components={[
            { title: 'Dialog', description: 'Accessible modal dialog wrapper for blocking workflows.', category: 'Overlays', href: '/components/overlays/dialog' },
            { title: 'Button', description: 'Interactive trigger control for opening popovers.', category: 'Basic Controls', href: '/components/basic-controls/button' },
            { title: 'Date & Time', description: 'Enterprise date and time pickers featuring calendar popovers.', category: 'Forms', href: '/components/forms/date-time' },
          ]}
        />
      </section>

      {/* 8. Technical Reference */}
      <section id="technical" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="technical" level={2}>Technical Reference</HeadingAnchor>
        <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.6 }}>
          The canonical implementation is a native Web Component (<code>&lt;skyra-popover&gt;</code>) with 0 external positioning dependencies.
          Fixed viewport coordinates prevent ancestor scroll drift and CSS transform clipping.
          Window resize, container scrolling, and DOM mutations are captured and throttled for high-performance layout recalculations.
        </p>
      </section>
    </DocsLayout>
  );
}
