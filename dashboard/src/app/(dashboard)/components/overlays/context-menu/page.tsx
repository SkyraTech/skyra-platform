'use client';

import React, { useState, useRef, useEffect } from 'react';
import '@skyra-tech-platform/button';
import '@skyra-tech-platform/context-menu';
import type { SkyraContextMenuElement } from '@skyra-tech-platform/context-menu';
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
import {
  FileText,
  Eye,
  Edit2,
  Copy,
  Trash2,
  Download,
  Share2,
  Send,
  MoreVertical,
  CheckCircle,
  FolderPlus,
  MousePointer,
  Check,
  Archive,
} from 'lucide-react';

export default function ContextMenuDocsPage() {
  const [controlledOpen, setControlledOpen] = useState(false);
  const [lastAction, setLastAction] = useState<string>('None');

  const controlledRef = useRef<SkyraContextMenuElement>(null);

  useEffect(() => {
    const el = controlledRef.current;
    if (!el) return;

    const handleOpen = () => setControlledOpen(true);
    const handleClose = () => setControlledOpen(false);

    el.addEventListener('skyra-context-menu-open', handleOpen);
    el.addEventListener('skyra-context-menu-close', handleClose);

    return () => {
      el.removeEventListener('skyra-context-menu-open', handleOpen);
      el.removeEventListener('skyra-context-menu-close', handleClose);
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
        title="Context Menu"
        description="Framework-agnostic contextual action menu Web Component anchored to pointer click coordinates or keyboard invocation (ContextMenu, Shift+F10) with automatic viewport boundary protection, collision detection, and roving focus management."
        breadcrumbs={[
          { label: 'Components', href: '/components' },
          { label: 'Overlays' },
          { label: 'Context Menu' },
        ]}
        badges={[
          { label: 'Stable', variant: 'stable' },
          { label: 'Web Component', variant: 'tech' },
        ]}
      />

      <PackageMeta
        packageName="@skyra-tech-platform/context-menu"
        version="0.1.0"
        type="Web Component"
      />

      {/* 1. Quick Start */}
      <section id="quick-start" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="quick-start" level={2}>Quick Start</HeadingAnchor>
        <InstallCommand packageName="@skyra-tech-platform/context-menu" />

        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--skyra-text)', marginBottom: '1rem', marginTop: '2.5rem', letterSpacing: '-0.01em' }}>
          Basic Usage
        </h3>
        <CodeTabs
          tabs={[
            {
              label: 'Web Component',
              language: 'html',
              code: `<!-- Import the component globally -->
<script type="module" src="node_modules/@skyra-tech-platform/context-menu/dist/index.js"></script>

<skyra-context-menu>
  <div slot="target" style="padding: 2rem; border: 1px dashed #ccc;">
    Right-click inside this target container
  </div>
  <skyra-context-menu-item value="view">View Details</skyra-context-menu-item>
  <skyra-context-menu-item value="copy" shortcut="⌘C">Copy Asset Link</skyra-context-menu-item>
  <skyra-context-menu-separator></skyra-context-menu-separator>
  <skyra-context-menu-item value="delete" destructive>Delete Asset</skyra-context-menu-item>
</skyra-context-menu>`,
            },
            {
              label: 'React',
              language: 'tsx',
              code: `import '@skyra-tech-platform/context-menu';
import { ContextMenu, MenuItem, MenuSeparator } from '@/components/ui';

export function ContextDemo() {
  return (
    <ContextMenu
      items={[
        { label: 'View Details', onClick: () => console.log('View') },
        { label: 'Copy Link', shortcut: '⌘C', onClick: () => console.log('Copy') },
        { type: 'separator' },
        { label: 'Delete Asset', destructive: true, onClick: () => console.log('Delete') },
      ]}
    >
      <div style={{ padding: '2rem', border: '1px dashed #ccc' }}>
        Right-click inside this target container
      </div>
    </ContextMenu>
  );
}`,
            },
          ]}
        />
        <div style={{ marginTop: '1rem' }}>
          <LiveExample>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <skyra-context-menu
                id="interactive-context-menu"
                onSkyraContextMenuSelect={(e: any) => setLastAction(e.detail?.value || 'Selected item')}
              >
                <div
                  id="context-area-demo"
                  slot="target"
                  tabIndex={0}
                  style={{
                    border: '2px dashed var(--skyra-border)',
                    borderRadius: 'var(--skyra-radius-lg)',
                    padding: '2.5rem 1.5rem',
                    textAlign: 'center',
                    background: 'var(--skyra-bg)',
                    cursor: 'context-menu',
                    userSelect: 'none',
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  <FileText size={36} color="var(--skyra-primary)" style={{ margin: '0 auto 0.75rem' }} />
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--skyra-text)' }}>
                    Enterprise_Q3_Financial_Audit.pdf
                  </div>
                  <p style={{ fontSize: '0.825rem', color: 'var(--skyra-text-muted)', margin: '0.5rem 0 0' }}>
                    Right-click this target card or press <kbd style={{ padding: '2px 4px', background: 'var(--skyra-surface)', border: '1px solid var(--skyra-border)', borderRadius: '3px' }}>Shift+F10</kbd>
                  </p>
                </div>
                <skyra-context-menu-item
                  value="view-doc"
                  onClick={() => setLastAction('View Document')}
                >
                  <Eye size={14} slot="icon" />
                  <span>View Document</span>
                </skyra-context-menu-item>
                <skyra-context-menu-item
                  value="edit-meta"
                  shortcut="⌘E"
                  onClick={() => setLastAction('Edit Metadata')}
                >
                  <Edit2 size={14} slot="icon" />
                  <span>Edit Metadata</span>
                </skyra-context-menu-item>
                <skyra-context-menu-item
                  value="duplicate"
                  shortcut="⌘D"
                  onClick={() => setLastAction('Duplicate Record')}
                >
                  <Copy size={14} slot="icon" />
                  <span>Duplicate Record</span>
                </skyra-context-menu-item>
                <skyra-context-menu-separator />
                <skyra-context-menu-item
                  value="download"
                  shortcut="⌘S"
                  onClick={() => setLastAction('Download Asset')}
                >
                  <Download size={14} slot="icon" />
                  <span>Download File</span>
                </skyra-context-menu-item>
                <skyra-context-menu-item
                  value="share"
                  onClick={() => setLastAction('Share Link')}
                >
                  <Share2 size={14} slot="icon" />
                  <span>Share Access Link</span>
                </skyra-context-menu-item>
                <skyra-context-menu-item
                  value="archive"
                  disabled
                >
                  <Archive size={14} slot="icon" />
                  <span>Archive Asset (Disabled)</span>
                </skyra-context-menu-item>
                <skyra-context-menu-separator />
                <skyra-context-menu-item
                  value="delete"
                  destructive
                  shortcut="⌫"
                  onClick={() => setLastAction('Delete Document')}
                >
                  <Trash2 size={14} slot="icon" />
                  <span>Delete Document</span>
                </skyra-context-menu-item>
              </skyra-context-menu>

              <div id="action-log" style={{ fontSize: '0.85rem', color: 'var(--skyra-text-muted)' }}>
                Last executed context action: <strong style={{ color: 'var(--skyra-primary)' }}>{lastAction}</strong>
              </div>
            </div>
          </LiveExample>
        </div>
      </section>

      {/* 2. Examples */}
      <section id="examples" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="examples" level={2}>Examples</HeadingAnchor>

        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem' }}>
          Data Grid &amp; Table Row Context Menus
        </h3>
        <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '1rem', lineHeight: 1.6 }}>
          Attach contextual menus to individual records in tabular datasets. Right-clicking any row anchors the menu accurately to pointer click coordinates with row-level data binding.
        </p>
        <div style={{ marginTop: '1rem' }}>
          <LiveExample>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { id: 'INV-2026-001', client: 'Acme Global Corp', amount: '$14,250.00', status: 'Paid' },
                { id: 'INV-2026-002', client: 'Starlight Dynamics', amount: '$8,900.00', status: 'Pending' },
                { id: 'INV-2026-003', client: 'Nexus Technologies', amount: '$22,400.00', status: 'Overdue' },
              ].map((row) => (
                <skyra-context-menu
                  key={row.id}
                  id={`row-context-menu-${row.id}`}
                  onSkyraContextMenuSelect={(e: any) => setLastAction(`${e.detail?.value} on ${row.id}`)}
                >
                  <div
                    id={`row-${row.id}`}
                    slot="target"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      background: 'var(--skyra-surface)',
                      border: '1px solid var(--skyra-border)',
                      borderRadius: 'var(--skyra-radius-md)',
                      cursor: 'context-menu',
                      userSelect: 'none',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--skyra-text)' }}>{row.id}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--skyra-text-muted)' }}>{row.client}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--skyra-text)' }}>{row.amount}</div>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          padding: '0.15rem 0.5rem',
                          borderRadius: '999px',
                          background: row.status === 'Paid' ? '#dcfce7' : row.status === 'Overdue' ? '#fee2e2' : '#e0e7ff',
                          color: row.status === 'Paid' ? '#15803d' : row.status === 'Overdue' ? '#b91c1c' : '#4338ca',
                        }}
                      >
                        {row.status}
                      </span>
                    </div>
                  </div>
                  <skyra-context-menu-item value={`view-${row.id}`} onClick={() => setLastAction(`View ${row.id}`)}>
                    <Eye size={14} slot="icon" />
                    <span>View Invoice Details</span>
                  </skyra-context-menu-item>
                  <skyra-context-menu-item value={`edit-${row.id}`} onClick={() => setLastAction(`Edit ${row.id}`)}>
                    <Edit2 size={14} slot="icon" />
                    <span>Edit Invoice</span>
                  </skyra-context-menu-item>
                  <skyra-context-menu-separator />
                  <skyra-context-menu-item
                    value={`remind-${row.id}`}
                    disabled={row.status === 'Paid'}
                    onClick={() => setLastAction(`Send reminder for ${row.id}`)}
                  >
                    <Send size={14} slot="icon" />
                    <span>Send Payment Reminder</span>
                  </skyra-context-menu-item>
                  <skyra-context-menu-separator />
                  <skyra-context-menu-item
                    value={`void-${row.id}`}
                    destructive
                    onClick={() => setLastAction(`Void invoice ${row.id}`)}
                  >
                    <Trash2 size={14} slot="icon" />
                    <span>Void Invoice</span>
                  </skyra-context-menu-item>
                </skyra-context-menu>
              ))}
            </div>
          </LiveExample>
        </div>

        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem', marginTop: '2.5rem' }}>
          Programmatic Open/Close Lifecycle
        </h3>
        <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '1rem', lineHeight: 1.6 }}>
          Control context menu visibility via standard DOM methods (<code>openAt(x, y)</code>, <code>show()</code>, <code>hide()</code>, <code>toggle()</code>) or by setting the <code>open</code> attribute/property directly.
        </p>
        <div style={{ marginTop: '1rem' }}>
          <LiveExample>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <skyra-tech-button
                variant="outline"
                onClick={(e: any) => {
                  if (controlledRef.current) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    controlledRef.current.toggle({ x: rect.left, y: rect.bottom + 4 });
                  }
                }}
              >
                {controlledOpen ? 'Close Programmatically' : 'Open at Button Position'}
              </skyra-tech-button>

              <skyra-context-menu ref={controlledRef}>
                <div slot="target" style={{ padding: '0.5rem 1rem', background: 'var(--skyra-surface)', border: '1px solid var(--skyra-border)', borderRadius: 'var(--skyra-radius-md)' }}>
                  Controlled Target Surface
                </div>
                <skyra-context-menu-item value="p-action-1">Programmatic Item 1</skyra-context-menu-item>
                <skyra-context-menu-item value="p-action-2">Programmatic Item 2</skyra-context-menu-item>
                <skyra-context-menu-separator />
                <skyra-context-menu-item value="p-action-3" destructive>Programmatic Item 3</skyra-context-menu-item>
              </skyra-context-menu>
            </div>
          </LiveExample>
        </div>
      </section>

      {/* 3. Usage Guidance */}
      <section id="usage" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="usage" level={2}>Usage Guidance</HeadingAnchor>
        <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
          Use the Context Menu component for secondary-click interactions anchored directly to pointer click coordinates or designated target regions.
        </p>
        <ul style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.6, paddingLeft: '1.25rem', marginBottom: '1.5rem' }}>
          <li><strong>Context Menu vs. Dropdown Menu:</strong> Use <em>Dropdown Menu</em> when an explicit button trigger toggles the menu. Use <em>Context Menu</em> when secondary-click (right-click) or keyboard context invocation launches actions from arbitrary container surfaces.</li>
          <li><strong>Context Menu vs. Popover:</strong> Use <em>Popover</em> for arbitrary non-modal subtrees (forms, filters). Use <em>Context Menu</em> for fast, actionable commands requiring roving arrow-key navigation.</li>
          <li><strong>Scroll Dismissal:</strong> By default, context menus dismiss when the page scrolls (<code>close-on-scroll="true"</code>), following standard desktop operating system ergonomics.</li>
        </ul>
      </section>

      {/* 4. API Reference */}
      <section id="api" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="api" level={2}>API Reference</HeadingAnchor>

        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem' }}>
          &lt;skyra-context-menu&gt; Properties &amp; Attributes
        </h3>
        <ApiTable
          rows={[
            { name: 'open', type: 'boolean', defaultVal: 'false', description: 'Whether the context menu is visible.' },
            { name: 'placement', type: '"top" | "bottom" | "left" | "right"', defaultVal: '"bottom"', description: 'Preferred direction of overlay relative to virtual anchor.' },
            { name: 'align', type: '"start" | "center" | "end"', defaultVal: '"start"', description: 'Cross-axis alignment relative to virtual anchor.' },
            { name: 'offset', type: 'number', defaultVal: '2', description: 'Distance in pixels between pointer coordinates and menu panel.' },
            { name: 'viewport-padding', type: 'number', defaultVal: '8', description: 'Minimum distance in pixels from viewport edges.' },
            { name: 'close-on-select', type: 'boolean', defaultVal: 'true', description: 'Whether selecting a menu item dismisses the menu.' },
            { name: 'close-on-outside-click', type: 'boolean', defaultVal: 'true', description: 'Whether clicking outside dismisses the menu.' },
            { name: 'close-on-escape', type: 'boolean', defaultVal: 'true', description: 'Whether pressing Escape dismisses the menu.' },
            { name: 'close-on-scroll', type: 'boolean', defaultVal: 'true', description: 'Whether scrolling any window container dismisses the menu.' },
            { name: 'disabled', type: 'boolean', defaultVal: 'false', description: 'Disables right-click and keyboard invocation.' },
            { name: 'restore-focus', type: 'boolean', defaultVal: 'true', description: 'Restores focus to target container upon dismissal.' },
            { name: 'menu-width', type: 'string | number', defaultVal: 'undefined', description: 'Explicit width applied to floating menu container.' },
            { name: 'menu-min-width', type: 'string | number', defaultVal: '180', description: 'Minimum width bounding the menu panel.' },
            { name: 'menu-max-width', type: 'string | number', defaultVal: '"min(90vw, 300px)"', description: 'Maximum width bounding the menu panel.' },
            { name: 'aria-label', type: 'string', defaultVal: '"Context actions menu"', description: 'Accessible label for the menu panel.' },
          ]}
        />

        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem', marginTop: '2rem' }}>
          &lt;skyra-context-menu-item&gt; Properties &amp; Attributes
        </h3>
        <ApiTable
          rows={[
            { name: 'value', type: 'string', defaultVal: '""', description: 'Machine-readable value dispatched on item selection.' },
            { name: 'type', type: '"item" | "checkbox" | "radio"', defaultVal: '"item"', description: 'Semantic item type determining role and check indicator.' },
            { name: 'checked', type: 'boolean', defaultVal: 'false', description: 'Checked state for checkbox and radio item types.' },
            { name: 'disabled', type: 'boolean', defaultVal: 'false', description: 'Disables the item and skips keyboard focus.' },
            { name: 'destructive', type: 'boolean', defaultVal: 'false', description: 'Renders item in semantic destructive danger styling.' },
            { name: 'shortcut', type: 'string', defaultVal: '""', description: 'Keyboard shortcut hint displayed aligned right.' },
          ]}
        />

        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem', marginTop: '2rem' }}>
          Custom Events
        </h3>
        <ApiTable
          rows={[
            { name: 'skyra-context-menu-open', type: 'CustomEvent<{ placement, align, x, y }>', defaultVal: '—', description: 'Fired when the menu opens and positioning is computed.' },
            { name: 'skyra-context-menu-close', type: 'CustomEvent<{ reason: string }>', defaultVal: '—', description: 'Fired when the menu closes with reason ("item-select", "outside-click", "escape", "scroll", "programmatic").' },
            { name: 'skyra-context-menu-change', type: 'CustomEvent<{ open: boolean }>', defaultVal: '—', description: 'Fired whenever the open state transitions.' },
            { name: 'skyra-context-menu-select', type: 'CustomEvent<{ item, value, checked, type }>', defaultVal: '—', description: 'Fired on the menu container when any child item is activated.' },
            { name: 'skyra-context-menu-item-select', type: 'CustomEvent<{ item, value, checked, type }>', defaultVal: '—', description: 'Fired directly by the child item upon user activation.' },
          ]}
        />

        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem', marginTop: '2rem' }}>
          Slots
        </h3>
        <ApiTable
          rows={[
            { name: 'target (or trigger)', type: 'slot[name="target"]', defaultVal: '—', description: 'The interactive surface that listens for contextmenu and keyboard invocation.' },
            { name: 'menu (or default)', type: 'slot', defaultVal: '—', description: 'Container slot for menu items, groups, and separators.' },
            { name: 'icon', type: 'slot[name="icon"] (on item)', defaultVal: '—', description: 'Optional leading icon container on menu items.' },
            { name: 'trailing', type: 'slot[name="trailing"] (on item)', defaultVal: '—', description: 'Optional trailing content container on menu items.' },
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
                  Use the canonical <code>&lt;skyra-context-menu&gt;</code> component directly or through the provided thin <code>ContextMenu</code> adapter with declarative <code>items</code> configuration or compositional child primitives (<code>MenuItem</code>, <code>MenuGroup</code>, <code>MenuSeparator</code>).
                </p>
              ),
            },
            {
              name: 'Vanilla HTML / JS',
              support: 'e2e',
              integration: (
                <p>
                  Zero runtime dependencies. Import the script and use <code>&lt;skyra-context-menu&gt;</code> and <code>&lt;skyra-context-menu-item&gt;</code> with standard attributes and DOM events.
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
            <div key="aria"><strong style={{ color: 'var(--skyra-text)' }}>WAI-ARIA Menu Pattern:</strong> Target container exposes <code>aria-haspopup="menu"</code> and synchronized <code>aria-expanded</code>. Panel exposes <code>role="menu"</code> with <code>aria-label</code>. Items expose <code>role="menuitem"</code>, <code>role="menuitemcheckbox"</code>, or <code>role="menuitemradio"</code>.</div>,
            <div key="kb-inv"><strong style={{ color: 'var(--skyra-text)' }}>Keyboard Invocation:</strong> Focused target triggers context menu via <code>ContextMenu</code> key or <code>Shift+F10</code> with sensible fallback coordinates.</div>,
            <div key="roving"><strong style={{ color: 'var(--skyra-text)' }}>Roving Focus Navigation:</strong> Pressing <code>ArrowDown</code> and <code>ArrowUp</code> cycles focus between enabled items. Pressing <code>Home</code> and <code>End</code> immediately jumps to the first and last enabled items.</div>,
            <div key="activation"><strong style={{ color: 'var(--skyra-text)' }}>Keyboard Activation:</strong> Pressing <code>Enter</code> or <code>Space</code> activates the currently focused item and closes the menu.</div>,
            <div key="esc"><strong style={{ color: 'var(--skyra-text)' }}>Keyboard Dismissal:</strong> Pressing <code>Escape</code> dismisses the menu and restores focus directly to the target element.</div>,
            <div key="motion"><strong style={{ color: 'var(--skyra-text)' }}>Reduced Motion:</strong> Respects <code>prefers-reduced-motion</code> media query by eliminating scale and fade transitions.</div>,
          ]}
        />
      </section>

      {/* 7. Related Components */}
      <section id="related" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="related" level={2}>Related Components</HeadingAnchor>
        <RelatedComponents
          components={[
            { title: 'Dropdown Menu', description: 'Button-triggered action menu overlay with keyboard navigation.', category: 'Overlays', href: '/components/overlays/dropdown-menu' },
            { title: 'Popover', description: 'Anchored rich content overlay for complex arbitrary subtrees.', category: 'Overlays', href: '/components/overlays/popover' },
            { title: 'Button', description: 'Interactive trigger button component for launching menus.', category: 'Basic Controls', href: '/components/basic-controls/button' },
          ]}
        />
      </section>

      {/* 8. Technical Reference */}
      <section id="technical" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="technical" level={2}>Technical Reference</HeadingAnchor>
        <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.6 }}>
          The canonical implementation is a native Web Component (<code>&lt;skyra-context-menu&gt;</code>) with 0 runtime framework dependencies.
          It reuses the pure viewport positioning engine from <code>@skyra-tech-platform/popover</code> (<code>computePopoverPosition</code>) by creating a zero-dimension virtual bounding box at pointer event coordinates.
          Automatic collision detection and cross-axis clamping ensure the menu is never clipped offscreen on any viewport edge or corner.
        </p>
      </section>
    </DocsLayout>
  );
}
