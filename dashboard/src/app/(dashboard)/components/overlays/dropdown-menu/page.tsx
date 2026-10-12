'use client';

import React, { useState, useRef, useEffect } from 'react';
import '@skyra-tech-platform/button';
import '@skyra-tech-platform/dropdown-menu';
import type { SkyraDropdownMenuElement } from '@skyra-tech-platform/dropdown-menu';
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
  ChevronDown,
  User,
  Settings,
  CreditCard,
  LogOut,
  FolderPlus,
  Trash2,
  Share2,
  Copy,
  Sliders,
  Check,
  Info,
} from 'lucide-react';

export default function DropdownMenuDocsPage() {
  const [controlledOpen, setControlledOpen] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(true);
  const [showFullUrls, setShowFullUrls] = useState(false);
  const [themeMode, setThemeMode] = useState<'system' | 'light' | 'dark'>('system');
  const [lastSelectedAction, setLastSelectedAction] = useState<string>('None');

  const controlledRef = useRef<SkyraDropdownMenuElement>(null);

  useEffect(() => {
    const el = controlledRef.current;
    if (!el) return;

    const handleOpen = () => setControlledOpen(true);
    const handleClose = () => setControlledOpen(false);

    el.addEventListener('skyra-dropdown-open', handleOpen);
    el.addEventListener('skyra-dropdown-close', handleClose);

    return () => {
      el.removeEventListener('skyra-dropdown-open', handleOpen);
      el.removeEventListener('skyra-dropdown-close', handleClose);
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
        title="Dropdown Menu"
        description="Framework-agnostic action menu overlay Web Component with roving keyboard navigation (ArrowUp/Down, Home/End, Enter, Space), collision detection, focus restoration, groups, icons, destructive states, and checkable items."
        breadcrumbs={[
          { label: 'Components', href: '/components' },
          { label: 'Overlays' },
          { label: 'Dropdown Menu' },
        ]}
        badges={[
          { label: 'Stable', variant: 'stable' },
          { label: 'Web Component', variant: 'tech' },
        ]}
      />

      <PackageMeta
        packageName="@skyra-tech-platform/dropdown-menu"
        version="0.1.0"
        type="Web Component"
      />

      {/* 1. Quick Start */}
      <section id="quick-start" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="quick-start" level={2}>Quick Start</HeadingAnchor>
        <InstallCommand packageName="@skyra-tech-platform/dropdown-menu" />

        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--skyra-text)', marginBottom: '1rem', marginTop: '2.5rem', letterSpacing: '-0.01em' }}>
          Basic Usage
        </h3>
        <CodeTabs
          tabs={[
            {
              label: 'Web Component',
              language: 'html',
              code: `<!-- Import the component globally -->
<script type="module" src="node_modules/@skyra-tech-platform/dropdown-menu/dist/index.js"></script>

<skyra-dropdown-menu placement="bottom" align="start">
  <button slot="trigger">Actions Menu</button>
  <skyra-dropdown-item value="profile">Profile</skyra-dropdown-item>
  <skyra-dropdown-item value="billing" shortcut="⌘B">Billing</skyra-dropdown-item>
  <skyra-dropdown-separator></skyra-dropdown-separator>
  <skyra-dropdown-item value="logout" destructive>Log Out</skyra-dropdown-item>
</skyra-dropdown-menu>`,
            },
            {
              label: 'React',
              language: 'tsx',
              code: `import '@skyra-tech-platform/dropdown-menu';
import { DropdownMenu, MenuItem, MenuSeparator } from '@/components/ui';

export function DropdownDemo() {
  return (
    <DropdownMenu
      trigger={<button>Actions Menu</button>}
      placement="bottom"
      align="start"
    >
      <MenuItem onClick={() => console.log('Profile')}>Profile</MenuItem>
      <MenuItem shortcut="⌘B" onClick={() => console.log('Billing')}>Billing</MenuItem>
      <MenuSeparator />
      <MenuItem destructive onClick={() => console.log('Logout')}>Log Out</MenuItem>
    </DropdownMenu>
  );
}`,
            },
          ]}
        />
        <div style={{ marginTop: '1rem' }}>
          <LiveExample>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <skyra-dropdown-menu
                placement="bottom"
                align="start"
                onSkyraDropdownSelect={(e: any) => setLastSelectedAction(e.detail?.value || 'Selected item')}
              >
                <skyra-tech-button slot="trigger" variant="primary">
                  <span>Open Actions Menu</span>
                  <ChevronDown size={14} style={{ marginLeft: '6px' }} />
                </skyra-tech-button>
                <skyra-dropdown-item
                  value="profile"
                  onClick={() => setLastSelectedAction('Profile')}
                >
                  <User size={14} slot="icon" />
                  <span>Profile Overview</span>
                </skyra-dropdown-item>
                <skyra-dropdown-item
                  value="billing"
                  shortcut="⌘B"
                  onClick={() => setLastSelectedAction('Billing')}
                >
                  <CreditCard size={14} slot="icon" />
                  <span>Billing &amp; Plans</span>
                </skyra-dropdown-item>
                <skyra-dropdown-item
                  value="settings"
                  shortcut="⌘,"
                  onClick={() => setLastSelectedAction('Settings')}
                >
                  <Settings size={14} slot="icon" />
                  <span>Preferences</span>
                </skyra-dropdown-item>
                <skyra-dropdown-separator />
                <skyra-dropdown-item
                  value="logout"
                  destructive
                  shortcut="⇧⌘Q"
                  onClick={() => setLastSelectedAction('Log Out')}
                >
                  <LogOut size={14} slot="icon" />
                  <span>Log Out</span>
                </skyra-dropdown-item>
              </skyra-dropdown-menu>
              <div style={{ fontSize: '0.825rem', color: 'var(--skyra-text-muted)' }}>
                Last selected action: <strong style={{ color: 'var(--skyra-primary)' }}>{lastSelectedAction}</strong>
              </div>
            </div>
          </LiveExample>
        </div>
      </section>

      {/* 2. Examples */}
      <section id="examples" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="examples" level={2}>Examples</HeadingAnchor>

        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem' }}>
          Directional Placements &amp; Cross-Axis Alignments
        </h3>
        <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '1rem', lineHeight: 1.6 }}>
          Supports <code>top</code>, <code>bottom</code>, <code>left</code>, and <code>right</code> directional placements with <code>start</code>, <code>center</code>, and <code>end</code> cross-axis alignments. Pure collision detection handles boundary flipping automatically.
        </p>
        <div style={{ marginTop: '1rem' }}>
          <LiveExample>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', padding: '1.5rem 0' }}>
              <skyra-dropdown-menu placement="top" align="center">
                <skyra-tech-button slot="trigger" variant="outline">
                  Top Menu
                </skyra-tech-button>
                <skyra-dropdown-item value="item-1">Top Item 1</skyra-dropdown-item>
                <skyra-dropdown-item value="item-2">Top Item 2</skyra-dropdown-item>
              </skyra-dropdown-menu>

              <skyra-dropdown-menu placement="bottom" align="center">
                <skyra-tech-button slot="trigger" variant="outline">
                  Bottom Menu
                </skyra-tech-button>
                <skyra-dropdown-item value="item-1">Bottom Item 1</skyra-dropdown-item>
                <skyra-dropdown-item value="item-2">Bottom Item 2</skyra-dropdown-item>
              </skyra-dropdown-menu>

              <skyra-dropdown-menu placement="left" align="center">
                <skyra-tech-button slot="trigger" variant="outline">
                  Left Menu
                </skyra-tech-button>
                <skyra-dropdown-item value="item-1">Left Item 1</skyra-dropdown-item>
                <skyra-dropdown-item value="item-2">Left Item 2</skyra-dropdown-item>
              </skyra-dropdown-menu>

              <skyra-dropdown-menu placement="right" align="center">
                <skyra-tech-button slot="trigger" variant="outline">
                  Right Menu
                </skyra-tech-button>
                <skyra-dropdown-item value="item-1">Right Item 1</skyra-dropdown-item>
                <skyra-dropdown-item value="item-2">Right Item 2</skyra-dropdown-item>
              </skyra-dropdown-menu>
            </div>
          </LiveExample>
        </div>

        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem', marginTop: '2.5rem' }}>
          Groups, Separators &amp; Shortcuts
        </h3>
        <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '1rem', lineHeight: 1.6 }}>
          Organize complex command sets using <code>&lt;skyra-dropdown-group&gt;</code> labels, horizontal dividers with <code>&lt;skyra-dropdown-separator&gt;</code>, and keyboard accelerator labels.
        </p>
        <div style={{ marginTop: '1rem' }}>
          <LiveExample>
            <skyra-dropdown-menu placement="bottom" align="start" menu-min-width="220">
              <skyra-tech-button slot="trigger" variant="outline">
                <span>Manage Workspace</span>
                <ChevronDown size={14} style={{ marginLeft: '6px' }} />
              </skyra-tech-button>
              <skyra-dropdown-group label="Workspace">
                <skyra-dropdown-item value="new-folder" shortcut="⌘N">
                  <FolderPlus size={14} slot="icon" />
                  <span>New Folder</span>
                </skyra-dropdown-item>
                <skyra-dropdown-item value="copy-link" shortcut="⌘C">
                  <Copy size={14} slot="icon" />
                  <span>Copy Link</span>
                </skyra-dropdown-item>
                <skyra-dropdown-item value="share" shortcut="⌘S">
                  <Share2 size={14} slot="icon" />
                  <span>Share Space</span>
                </skyra-dropdown-item>
              </skyra-dropdown-group>
              <skyra-dropdown-separator />
              <skyra-dropdown-group label="Danger Zone">
                <skyra-dropdown-item value="delete" destructive shortcut="⌫">
                  <Trash2 size={14} slot="icon" />
                  <span>Delete Space</span>
                </skyra-dropdown-item>
              </skyra-dropdown-group>
            </skyra-dropdown-menu>
          </LiveExample>
        </div>

        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem', marginTop: '2.5rem' }}>
          Checkbox &amp; Radio Menu Items
        </h3>
        <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '1rem', lineHeight: 1.6 }}>
          Support toggling boolean settings with <code>type="checkbox"</code> and selecting mutually exclusive options with <code>type="radio"</code>. Full WAI-ARIA role mapping (<code>menuitemcheckbox</code>, <code>menuitemradio</code>) is maintained.
        </p>
        <div style={{ marginTop: '1rem' }}>
          <LiveExample>
            <skyra-dropdown-menu placement="bottom" align="start" menu-min-width="240">
              <skyra-tech-button slot="trigger" variant="outline">
                <Sliders size={14} style={{ marginRight: '6px' }} />
                <span>View Options</span>
                <ChevronDown size={14} style={{ marginLeft: '6px' }} />
              </skyra-tech-button>
              <skyra-dropdown-group label="Display Flags">
                <skyra-dropdown-item
                  type="checkbox"
                  checked={showBookmarks}
                  shortcut="⌘⇧B"
                  onClick={() => setShowBookmarks(!showBookmarks)}
                >
                  <span>Show Bookmarks</span>
                </skyra-dropdown-item>
                <skyra-dropdown-item
                  type="checkbox"
                  checked={showFullUrls}
                  onClick={() => setShowFullUrls(!showFullUrls)}
                >
                  <span>Show Full URLs</span>
                </skyra-dropdown-item>
              </skyra-dropdown-group>
              <skyra-dropdown-separator />
              <skyra-dropdown-group label="Color Mode">
                <skyra-dropdown-item
                  type="radio"
                  checked={themeMode === 'system'}
                  onClick={() => setThemeMode('system')}
                >
                  <span>System Default</span>
                </skyra-dropdown-item>
                <skyra-dropdown-item
                  type="radio"
                  checked={themeMode === 'light'}
                  onClick={() => setThemeMode('light')}
                >
                  <span>Light Theme</span>
                </skyra-dropdown-item>
                <skyra-dropdown-item
                  type="radio"
                  checked={themeMode === 'dark'}
                  onClick={() => setThemeMode('dark')}
                >
                  <span>Dark Theme</span>
                </skyra-dropdown-item>
              </skyra-dropdown-group>
            </skyra-dropdown-menu>
          </LiveExample>
        </div>

        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem', marginTop: '2.5rem' }}>
          Programmatic Open/Close Lifecycle
        </h3>
        <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '1rem', lineHeight: 1.6 }}>
          Control menu visibility via standard DOM methods (<code>show()</code>, <code>hide()</code>, <code>toggle()</code>) or by setting the <code>open</code> attribute/property directly.
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

              <skyra-dropdown-menu ref={controlledRef} placement="bottom" align="start">
                <skyra-tech-button slot="trigger" variant="primary">
                  Controlled Trigger
                </skyra-tech-button>
                <skyra-dropdown-item value="controlled-1">Synced Item A</skyra-dropdown-item>
                <skyra-dropdown-item value="controlled-2">Synced Item B</skyra-dropdown-item>
                <skyra-dropdown-separator />
                <skyra-dropdown-item value="controlled-3">Synced Item C</skyra-dropdown-item>
              </skyra-dropdown-menu>
            </div>
          </LiveExample>
        </div>
      </section>

      {/* 3. Usage Guidance */}
      <section id="usage" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="usage" level={2}>Usage Guidance</HeadingAnchor>
        <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
          Use the Dropdown Menu component when a user needs to choose from a list of contextual actions, commands, or toggles presented from a single trigger button.
        </p>
        <ul style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.6, paddingLeft: '1.25rem', marginBottom: '1.5rem' }}>
          <li><strong>Dropdown Menu vs. Select:</strong> Use <em>Select</em> when picking a form value to submit. Use <em>Dropdown Menu</em> when triggering immediate actions or workflows (e.g. Export, Delete, Share).</li>
          <li><strong>Dropdown Menu vs. Popover:</strong> Use <em>Popover</em> when rendering arbitrary rich subtrees (such as complex forms, date pickers, or custom filters). Use <em>Dropdown Menu</em> for structured action items requiring roving arrow-key navigation.</li>
          <li><strong>Dropdown Menu vs. Context Menu:</strong> Use <em>Dropdown Menu</em> for button-triggered actions. Use <em>Context Menu</em> for pointer secondary-click (right-click) interactions anchored to cursor coordinates.</li>
        </ul>
      </section>

      {/* 4. API Reference */}
      <section id="api" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="api" level={2}>API Reference</HeadingAnchor>

        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem' }}>
          &lt;skyra-dropdown-menu&gt; Properties &amp; Attributes
        </h3>
        <ApiTable
          rows={[
            { name: 'open', type: 'boolean', defaultVal: 'false', description: 'Whether the menu is visible.' },
            { name: 'placement', type: '"top" | "bottom" | "left" | "right"', defaultVal: '"bottom"', description: 'Preferred direction of overlay relative to anchor.' },
            { name: 'align', type: '"start" | "center" | "end"', defaultVal: '"start"', description: 'Cross-axis alignment relative to anchor.' },
            { name: 'offset', type: 'number', defaultVal: '6', description: 'Distance in pixels between trigger and menu panel.' },
            { name: 'viewport-padding', type: 'number', defaultVal: '8', description: 'Minimum distance in pixels from viewport edges.' },
            { name: 'close-on-select', type: 'boolean', defaultVal: 'true', description: 'Whether selecting a menu item dismisses the menu.' },
            { name: 'close-on-outside-click', type: 'boolean', defaultVal: 'true', description: 'Whether clicking outside dismisses the menu.' },
            { name: 'close-on-escape', type: 'boolean', defaultVal: 'true', description: 'Whether pressing Escape dismisses the menu.' },
            { name: 'disabled', type: 'boolean', defaultVal: 'false', description: 'Disables trigger interaction and prevents opening.' },
            { name: 'restore-focus', type: 'boolean', defaultVal: 'true', description: 'Restores focus to trigger button upon menu dismissal.' },
            { name: 'menu-width', type: 'string | number', defaultVal: 'undefined', description: 'Explicit width applied to floating menu container.' },
            { name: 'menu-min-width', type: 'string | number', defaultVal: '180', description: 'Minimum width bounding the menu panel.' },
            { name: 'menu-max-width', type: 'string | number', defaultVal: '"min(90vw, 320px)"', description: 'Maximum width bounding the menu panel.' },
            { name: 'aria-label', type: 'string', defaultVal: '"Actions menu"', description: 'Accessible label for the menu panel.' },
          ]}
        />

        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem', marginTop: '2rem' }}>
          &lt;skyra-dropdown-item&gt; Properties &amp; Attributes
        </h3>
        <ApiTable
          rows={[
            { name: 'value', type: 'string', defaultVal: '""', description: 'Optional machine-readable value dispatched on selection.' },
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
            { name: 'skyra-dropdown-open', type: 'CustomEvent<{ placement, align }>', defaultVal: '—', description: 'Fired when the menu opens and positioning is computed.' },
            { name: 'skyra-dropdown-close', type: 'CustomEvent<{ reason: string }>', defaultVal: '—', description: 'Fired when the menu closes with reason ("item-select", "outside-click", "escape", "toggle", "programmatic").' },
            { name: 'skyra-dropdown-change', type: 'CustomEvent<{ open: boolean }>', defaultVal: '—', description: 'Fired whenever the open state transitions.' },
            { name: 'skyra-dropdown-select', type: 'CustomEvent<{ item, value, checked, type }>', defaultVal: '—', description: 'Fired on the menu container when any child item is activated.' },
            { name: 'skyra-dropdown-item-select', type: 'CustomEvent<{ item, value, checked, type }>', defaultVal: '—', description: 'Fired directly by the child item upon user activation.' },
          ]}
        />

        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem', marginTop: '2rem' }}>
          Slots
        </h3>
        <ApiTable
          rows={[
            { name: 'trigger', type: 'slot[name="trigger"]', defaultVal: '—', description: 'The trigger element that toggles the dropdown menu.' },
            { name: '(default)', type: 'slot', defaultVal: '—', description: 'Default container slot for menu items, groups, and separators.' },
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
                  Use the canonical <code>&lt;skyra-dropdown-menu&gt;</code> component directly or through the provided thin <code>DropdownMenu</code> adapter with declarative <code>items</code> configuration or compositional child primitives (<code>MenuItem</code>, <code>MenuGroup</code>, <code>MenuSeparator</code>).
                </p>
              ),
            },
            {
              name: 'Vanilla HTML / JS',
              support: 'e2e',
              integration: (
                <p>
                  Zero runtime dependencies. Import the script and use <code>&lt;skyra-dropdown-menu&gt;</code> and <code>&lt;skyra-dropdown-item&gt;</code> with standard attributes and DOM events.
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
            <div key="aria"><strong style={{ color: 'var(--skyra-text)' }}>WAI-ARIA Menu Pattern:</strong> Trigger exposes <code>role="button"</code>, <code>aria-haspopup="menu"</code>, and synchronized <code>aria-expanded</code>. Panel exposes <code>role="menu"</code> with <code>aria-label</code>. Items expose <code>role="menuitem"</code>, <code>role="menuitemcheckbox"</code>, or <code>role="menuitemradio"</code> with appropriate <code>aria-checked</code> states.</div>,
            <div key="roving"><strong style={{ color: 'var(--skyra-text)' }}>Roving Keyboard Navigation:</strong> Pressing <code>ArrowDown</code> and <code>ArrowUp</code> cycles focus between enabled items with wrap-around. Pressing <code>Home</code> and <code>End</code> immediately jumps to the first and last enabled items.</div>,
            <div key="activation"><strong style={{ color: 'var(--skyra-text)' }}>Keyboard Activation:</strong> Pressing <code>Enter</code> or <code>Space</code> activates the currently focused item and closes the menu (or toggles check state).</div>,
            <div key="esc"><strong style={{ color: 'var(--skyra-text)' }}>Keyboard Dismissal:</strong> Pressing <code>Escape</code> dismisses the menu and restores focus directly to the trigger element.</div>,
            <div key="motion"><strong style={{ color: 'var(--skyra-text)' }}>Reduced Motion:</strong> Respects <code>prefers-reduced-motion</code> media query by eliminating scale and fade transitions.</div>,
          ]}
        />
      </section>

      {/* 7. Related Components */}
      <section id="related" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="related" level={2}>Related Components</HeadingAnchor>
        <RelatedComponents
          components={[
            { title: 'Popover', description: 'Anchored rich content overlay for complex arbitrary subtrees.', category: 'Overlays', href: '/components/overlays/popover' },
            { title: 'Button', description: 'Interactive trigger button component for launching menus.', category: 'Basic Controls', href: '/components/basic-controls/button' },
            { title: 'Context Menu', description: 'Pointer right-click contextual action menu.', category: 'Overlays', href: '/components/overlays/context-menu' },
          ]}
        />
      </section>

      {/* 8. Technical Reference */}
      <section id="technical" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="technical" level={2}>Technical Reference</HeadingAnchor>
        <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.6 }}>
          The canonical implementation is a native Web Component (<code>&lt;skyra-dropdown-menu&gt;</code>) with 0 runtime framework dependencies.
          It reuses the pure viewport positioning engine from <code>@skyra-tech-platform/popover</code> (<code>computePopoverPosition</code>) ensuring 100% mathematical consistency without duplicate coordinate calculation logic.
          Shadow DOM encapsulation protects menu item styles against global stylesheet collision.
        </p>
      </section>
    </DocsLayout>
  );
}
