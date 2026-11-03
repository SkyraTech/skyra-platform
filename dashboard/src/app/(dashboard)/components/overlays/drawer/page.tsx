'use client';

import React, { useState } from 'react';
import '@skyra-tech-platform/drawer';
import '@skyra-tech-platform/button';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { DocsHeader } from '@/components/docs/DocsHeader';
import { PackageMeta } from '@/components/docs/PackageMeta';
import { InstallCommand } from '@/components/docs/InstallCommand';
import { LiveExample } from '@/components/docs/LiveExample';
import { ApiTable } from '@/components/docs/ApiTable';
import { ApiTabs } from '@/components/docs/ApiTabs';
import { FrameworkSupport } from '@/components/docs/FrameworkSupport';
import { UsageGuidance } from '@/components/docs/UsageGuidance';
import { AccessibilityPanel } from '@/components/docs/AccessibilityPanel';
import { TokenGrid } from '@/components/docs/TokenGrid';
import { ResponsiveDemo } from '@/components/docs/ResponsiveDemo';
import { RelatedComponents } from '@/components/docs/RelatedComponents';
import { HeadingAnchor } from '@/components/docs/HeadingAnchor';
import { ComponentPlayground, PlaygroundControlDef } from '@/components/docs/ComponentPlayground';


const drawerPlaygroundControls: PlaygroundControlDef[] = [
  {
    name: 'position',
    label: 'Position',
    type: 'select',
    defaultValue: 'right',
    options: [
      { label: 'Right', value: 'right' },
      { label: 'Left', value: 'left' },
      { label: 'Bottom', value: 'bottom' },
    ],
  },
  {
    name: 'size',
    label: 'Size',
    type: 'select',
    defaultValue: 'md',
    options: [
      { label: 'Small (sm)', value: 'sm' },
      { label: 'Medium (md)', value: 'md' },
      { label: 'Large (lg)', value: 'lg' },
      { label: 'Extra Large (xl)', value: 'xl' },
      { label: 'Full', value: 'full' },
    ],
  },
  {
    name: 'title',
    label: 'Drawer Title',
    type: 'text',
    defaultValue: 'Environment Configuration',
  },
  {
    name: 'backdrop',
    label: 'Backdrop',
    type: 'boolean',
    defaultValue: true,
  },
];

export default function DrawerDocsPage() {
  const [rightOpen, setRightOpen] = useState(false);
  const [leftOpen, setLeftOpen] = useState(false);
  const [bottomOpen, setBottomOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [currentSize, setCurrentSize] = useState<'sm' | 'md' | 'lg' | 'xl' | 'full'>('md');

  const toc = [
    { id: 'quick-start', label: 'Quick Start' },
    { id: 'playground', label: 'Interactive Playground' },
    { id: 'examples', label: 'Examples' },
    { id: 'usage', label: 'Usage Guidance' },
    { id: 'api', label: 'API Reference' },
    { id: 'frameworks', label: 'Framework Usage' },
    { id: 'accessibility', label: 'Accessibility' },
    { id: 'styling', label: 'Styling' },
    { id: 'responsive', label: 'Responsive Behavior' },
    { id: 'related', label: 'Related Components' },
    { id: 'technical', label: 'Technical Reference' },
  ];

  return (
    <DocsLayout toc={toc}>
      <DocsHeader 
        title="Drawer"
        description="Accessible sliding overlay panel for contextual workflows, configuration sheets, and detailed data inspection."
        breadcrumbs={[
          { label: 'Components', href: '/components' },
          { label: 'Overlays' },
          { label: 'Drawer' }
        ]}
        badges={[
          { label: 'Stable', variant: 'stable' },
          { label: 'Web Component', variant: 'tech' }
        ]}
      />

      <PackageMeta 
        packageName="@skyra-tech-platform/drawer"
        elementName="<skyra-tech-drawer>"
        version="0.1.0"
        type="Web Component"
      />

      <HeadingAnchor id="quick-start">Quick Start</HeadingAnchor>
      <InstallCommand packageName="@skyra-tech-platform/drawer" />
      
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--skyra-text)', marginBottom: '1rem', marginTop: '3rem', letterSpacing: '-0.01em' }}>
        Basic Usage
      </h3>
      <LiveExample 
        language="html"
        code={`<script type="module">
  import '@skyra-tech-platform/drawer';
</script>

<skyra-tech-drawer title="Edit Profile" position="right" open>
  <p>Update your user information below.</p>
  <div slot="footer">
    <button type="button">Save</button>
  </div>
</skyra-tech-drawer>`}
      >
        <div>
          <skyra-tech-button variant="primary" onClick={() => setRightOpen(true)}>
            Open Standard Drawer
          </skyra-tech-button>

          <skyra-tech-drawer 
            title="Edit User Profile" 
            position="right" 
            open={rightOpen ? true : undefined}
            onclose={() => setRightOpen(false)}
          >
            <div style={{ padding: '0.5rem 0', color: 'var(--skyra-text)' }}>
              <p style={{ margin: '0 0 1rem 0', color: 'var(--skyra-text-muted)', lineHeight: 1.6 }}>
                Adjust application preferences and manage notification channels for this user profile.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label htmlFor="drawer-input-name" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--skyra-text)' }}>Full Name</label>
                  <input id="drawer-input-name" type="text" defaultValue="Alex Morgan" style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--skyra-border)', background: 'var(--skyra-bg)', color: 'var(--skyra-text)' }} />
                </div>
                <div>
                  <label htmlFor="drawer-input-email" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--skyra-text)' }}>Email Address</label>
                  <input id="drawer-input-email" type="email" defaultValue="alex.morgan@skyra.tech" style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--skyra-border)', background: 'var(--skyra-bg)', color: 'var(--skyra-text)' }} />
                </div>
              </div>
            </div>
            <div slot="footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <skyra-tech-button variant="ghost" onClick={() => setRightOpen(false)}>Cancel</skyra-tech-button>
              <skyra-tech-button variant="primary" onClick={() => setRightOpen(false)}>Save Changes</skyra-tech-button>
            </div>
          </skyra-tech-drawer>
        </div>
      </LiveExample>

      
      <HeadingAnchor id="playground">Interactive Playground</HeadingAnchor>
      <ComponentPlayground
        title="Drawer Playground"
        description="Trigger the drawer from different edges, test size variations, and monitor open/close events."
        controls={drawerPlaygroundControls}
        render={(values, logEvent) => {
          const [isOpen, setIsOpen] = React.useState(false);
          return (
            <div>
              <skyra-tech-button
                variant="primary"
                onClick={() => {
                  setIsOpen(true);
                  logEvent('open-drawer', { position: values.position, size: values.size });
                }}
              >
                Open ${values.position.toUpperCase()} Drawer (${values.size})
              </skyra-tech-button>

              <skyra-tech-drawer
                open={isOpen ? true : undefined}
                position={values.position}
                size={values.size}
                drawer-title={values.title}
                backdrop={values.backdrop ? undefined : 'false'}
                onSkyra-drawer-close={() => {
                  setIsOpen(false);
                  logEvent('skyra-drawer-close', { reason: 'user_dismiss' });
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.5rem 0' }}>
                  <p style={{ margin: 0, fontSize: '0.925rem', color: 'var(--skyra-text-muted)' }}>
                    This is live drawer content loaded via standard web component slot.
                  </p>
                  <div style={{ padding: '1rem', background: 'var(--skyra-bg-muted)', borderRadius: '6px' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Active Settings</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--skyra-text-muted)', marginTop: '0.25rem' }}>
                      Position: <strong>{values.position}</strong> | Size: <strong>{values.size}</strong>
                    </div>
                  </div>
                </div>
                <div slot="footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <skyra-tech-button variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </skyra-tech-button>
                  <skyra-tech-button variant="primary" onClick={() => {
                    logEvent('confirm-drawer', { timestamp: Date.now() });
                    setIsOpen(false);
                  }}>
                    Save Changes
                  </skyra-tech-button>
                </div>
              </skyra-tech-drawer>
            </div>
          );
        }}
        generateCode={(values) => {
          return `<skyra-tech-drawer position="${values.position}" size="${values.size}" drawer-title="${values.title}">
  <p>Drawer body content...</p>
  <div slot="footer">
    <skyra-tech-button variant="primary">Confirm</skyra-tech-button>
  </div>
</skyra-tech-drawer>`;
        }}
      />

      <HeadingAnchor id="examples">Examples</HeadingAnchor>
      
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem' }}>Placements</h3>
      <LiveExample 
        language="tsx"
        title="Placements"
        description="Drawers can emerge from the right (default), left, or bottom of the viewport."
        code={`<skyra-tech-drawer position="left" title="Navigation Menu" ...>...</skyra-tech-drawer>
<skyra-tech-drawer position="bottom" title="Action Sheet" ...>...</skyra-tech-drawer>`}
      >
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <skyra-tech-button variant="outline" onClick={() => setLeftOpen(true)}>
            Open Left Drawer
          </skyra-tech-button>
          <skyra-tech-button variant="outline" onClick={() => setBottomOpen(true)}>
            Open Bottom Drawer
          </skyra-tech-button>

          <skyra-tech-drawer 
            title="Navigation Drawer" 
            position="left" 
            open={leftOpen ? true : undefined}
            onclose={() => setLeftOpen(false)}
          >
            <p style={{ color: 'var(--skyra-text-muted)' }}>Left navigation and filter drawer content.</p>
            <div slot="footer" style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <skyra-tech-button variant="ghost" onClick={() => setLeftOpen(false)}>Close</skyra-tech-button>
            </div>
          </skyra-tech-drawer>

          <skyra-tech-drawer 
            title="Quick Action Sheet" 
            position="bottom" 
            open={bottomOpen ? true : undefined}
            onclose={() => setBottomOpen(false)}
          >
            <p style={{ color: 'var(--skyra-text-muted)' }}>Bottom sheet drawer suited for mobile or compact viewports.</p>
            <div slot="footer" style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <skyra-tech-button variant="ghost" onClick={() => setBottomOpen(false)}>Dismiss</skyra-tech-button>
            </div>
          </skyra-tech-drawer>
        </div>
      </LiveExample>

      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem', marginTop: '2rem' }}>Sizes</h3>
      <LiveExample 
        language="tsx"
        title="Sizes"
        description="Available in sm (360px), md (480px), lg (640px), xl (800px), and full (100vw)."
        code={`<skyra-tech-drawer size="sm" title="Small Drawer" ... />
<skyra-tech-drawer size="lg" title="Large Drawer" ... />
<skyra-tech-drawer size="full" title="Full Screen Drawer" ... />`}
      >
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {(['sm', 'md', 'lg', 'xl'] as const).map((sz) => (
            <skyra-tech-button 
              key={sz} 
              variant="outline" 
              onClick={() => {
                setCurrentSize(sz);
                setSizeOpen(true);
              }}
            >
              Size: {sz.toUpperCase()}
            </skyra-tech-button>
          ))}

          <skyra-tech-drawer 
            title={`Drawer Size (${currentSize.toUpperCase()})`}
            position="right" 
            size={currentSize}
            open={sizeOpen ? true : undefined}
            onclose={() => setSizeOpen(false)}
          >
            <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.6 }}>
              This drawer is rendered with <code style={{ color: 'var(--skyra-primary)' }}>size=&quot;{currentSize}&quot;</code>.
            </p>
            <div slot="footer" style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <skyra-tech-button variant="primary" onClick={() => setSizeOpen(false)}>Done</skyra-tech-button>
            </div>
          </skyra-tech-drawer>
        </div>
      </LiveExample>

      <HeadingAnchor id="usage">Usage Guidance</HeadingAnchor>
      <UsageGuidance 
        doItems={[
          'Use drawers for contextual deep-dives that keep the underlying page in view.',
          'Provide a clear title and an explicit close button or footer cancel action.',
          'Use left placement for hierarchical navigation and right placement for editing or detail panels.'
        ]}
        dontItems={[
          'Do not use drawers for critical blocking system alerts; prefer Dialog for destructive confirms.',
          'Avoid nesting multiple drawers simultaneously.',
          'Do not omit the ESC key listener or trap focus inappropriately.'
        ]}
      />

      <HeadingAnchor id="api">API Reference</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
        The drawer component exposes attributes, DOM properties, lifecycle methods, and CustomEvent notifications.
      </p>

      <ApiTabs tabs={[
        { id: 'attributes', label: 'Attributes & Properties', content: <ApiTable rows={[
          { name: 'open', type: 'boolean', defaultVal: 'false', description: 'Controls open/close visibility of drawer.' },
          { name: 'position', type: "'right' | 'left' | 'bottom'", defaultVal: "'right'", description: 'Viewport edge from which the drawer slides.' },
          { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl' | 'full'", defaultVal: "'md'", description: 'Width of the sliding panel.' },
          { name: 'title', type: 'string', defaultVal: "''", description: 'Accessible heading title rendered in header.' },
          { name: 'backdrop', type: "string ('static' | undefined)", defaultVal: '-', description: "Set to 'static' to disable closing on backdrop click." }
        ]} /> },
        { id: 'methods', label: 'Methods', content: <ApiTable rows={[
          { name: 'show()', type: '() => void', defaultVal: '-', description: 'Imperatively opens the drawer.' },
          { name: 'close()', type: '() => void', defaultVal: '-', description: 'Imperatively closes the drawer and dispatches close event.' }
        ]} /> },
        { id: 'events', label: 'Events', content: <ApiTable rows={[
          { name: 'open', type: 'CustomEvent', defaultVal: '-', description: 'Dispatched when the drawer transition begins opening.' },
          { name: 'close', type: 'CustomEvent', defaultVal: '-', description: 'Dispatched when the drawer is dismissed.' }
        ]} /> },
        { id: 'slots', label: 'Slots', content: <ApiTable rows={[
          { name: 'default', type: 'HTML', defaultVal: '-', description: 'Main scrollable body content.' },
          { name: 'header', type: 'HTML', defaultVal: '-', description: 'Custom header content replacing default title and close button.' },
          { name: 'footer', type: 'HTML', defaultVal: '-', description: 'Action buttons container pinned at the bottom.' }
        ]} /> }
      ]} />

      <HeadingAnchor id="frameworks">Framework Usage</HeadingAnchor>
      <FrameworkSupport 
        frameworks={[
          { 
            name: 'Vanilla HTML / JS', 
            support: 'e2e', 
            integration: <p>Import <code style={{fontFamily: 'var(--skyra-font-mono)'}}>@skyra-tech-platform/drawer</code> and toggle the <code style={{fontFamily: 'var(--skyra-font-mono)'}}>open</code> attribute or call <code style={{fontFamily: 'var(--skyra-font-mono)'}}>drawer.show()</code>.</p> 
          },
          { 
            name: 'React / Next.js', 
            support: 'e2e', 
            integration: <p>Import in component, pass <code style={{fontFamily: 'var(--skyra-font-mono)'}}>open={'{isOpen ? true : undefined}'}</code>, and listen for <code style={{fontFamily: 'var(--skyra-font-mono)'}}>onclose</code>.</p> 
          },
          { 
            name: 'Angular', 
            support: 'architecture', 
            integration: <p>Enable <code style={{fontFamily: 'var(--skyra-font-mono)'}}>CUSTOM_ELEMENTS_SCHEMA</code>, bind <code style={{fontFamily: 'var(--skyra-font-mono)'}}>[open]="isDrawerOpen"</code>, and listen to <code style={{fontFamily: 'var(--skyra-font-mono)'}}>(close)="onDrawerClose()"</code>.</p> 
          },
          { 
            name: 'Vue 3', 
            support: 'architecture', 
            integration: <p>Use <code style={{fontFamily: 'var(--skyra-font-mono)'}}>&lt;skyra-tech-drawer :open=&quot;isOpen&quot; @close=&quot;isOpen = false&quot;&gt;</code> natively.</p> 
          },
          { 
            name: 'Svelte', 
            support: 'architecture', 
            integration: <p>Bind open boolean property and listen for <code style={{fontFamily: 'var(--skyra-font-mono)'}}>on:close</code>.</p> 
          }
        ]}
      />

      <HeadingAnchor id="accessibility">Accessibility</HeadingAnchor>
      <AccessibilityPanel 
        features={[
          "The panel element has role='dialog' and aria-modal='true'.",
          "aria-labelledby links the panel to the drawer title element.",
          "Automatic focus restoration returns focus to the triggering element upon close.",
          "Keyboard dismiss: Pressing ESC automatically closes the drawer and fires the close event.",
          "Backdrop click dismissal can be enabled or configured static for critical forms."
        ]}
      />

      <HeadingAnchor id="styling">Styling</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '1.5rem' }}>
        Drawers utilize design tokens for panel width, backdrop blurring, surface backgrounds, and z-index elevation.
      </p>
      <TokenGrid 
        groups={[
          {
            category: 'Drawer Tokens',
            tokens: [
              { name: 'Backdrop Z-Index', variable: '--skyra-z-modal', value: '200' },
              { name: 'Surface Background', variable: '--skyra-surface', value: '#ffffff' },
              { name: 'Border Color', variable: '--skyra-border', value: '#e2e8f0' },
              { name: 'Elevation Shadow', variable: '--skyra-shadow-lg', value: '0 10px 30px rgba(0, 0, 0, 0.15)' },
            ]
          }
        ]}
      />

      <HeadingAnchor id="responsive">Responsive Behavior</HeadingAnchor>
      <ResponsiveDemo 
        description="On small screens (viewports < 640px), drawers clamp to 100vw width to provide maximum comfortable editing space, preventing horizontal overflow."
        desktop={<div style={{ padding: '1rem', border: '1px solid var(--skyra-border)', borderRadius: '8px' }}>Desktop: 480px sliding drawer panel</div>}
        mobile={<div style={{ padding: '1rem', border: '1px solid var(--skyra-border)', borderRadius: '8px' }}>Mobile: Full viewport width clamped panel</div>}
        fullWidth={<div style={{ padding: '1rem', border: '1px solid var(--skyra-border)', borderRadius: '8px', width: '100%' }}>Fluid responsiveness with smooth hardware-accelerated transforms</div>}
      />

      <HeadingAnchor id="related">Related Components</HeadingAnchor>
      <RelatedComponents 
        components={[
          { title: 'Dialog', href: '/components/overlays/dialog', description: 'For centered modal dialogs and alerts.', category: 'Overlays' },
          { title: 'Popover', href: '/components/overlays/popover', description: 'For anchored lightweight context overlays.', category: 'Overlays' },
          { title: 'Dynamic Form', href: '/components/forms/dynamic-form', description: 'For rendering rich schemas inside drawers.', category: 'Forms' }
        ]}
      />

      <HeadingAnchor id="technical">Technical Reference</HeadingAnchor>
      <div style={{ background: 'var(--skyra-surface)', border: '1px solid var(--skyra-border)', borderRadius: '8px', padding: '1.5rem', marginTop: '1.5rem' }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--skyra-text)', fontWeight: 600 }}>Element Specification</h4>
        <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--skyra-text-muted)', lineHeight: 1.8 }}>
          <li>Custom Element Tag: <code style={{ color: 'var(--skyra-primary)' }}>&lt;skyra-tech-drawer&gt;</code></li>
          <li>Class Name: <code style={{ color: 'var(--skyra-primary)' }}>SkyraTechDrawer</code></li>
          <li>Package: <code style={{ color: 'var(--skyra-primary)' }}>@skyra-tech-platform/drawer</code></li>
          <li>Focus Management: Automatic previous activeElement restoration</li>
          <li>SSR Safe: Native <code style={{ color: 'var(--skyra-primary)' }}>typeof HTMLElement</code> guard</li>
        </ul>
      </div>
    </DocsLayout>
  );
}

