'use client';

import React, { useState, useRef, useEffect } from 'react';
import '@skyra-tech-platform/button';
import '@skyra-tech-platform/command-palette';
import type { SkyraCommandPaletteElement, CommandItem } from '@skyra-tech-platform/command-palette';
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
  Command as CommandIcon,
  Search,
  Download,
  Settings,
  RefreshCw,
  Copy,
  FolderOpen,
  Trash2,
  CheckCircle,
  FileText,
  Keyboard,
  Layers,
} from 'lucide-react';

export default function CommandPaletteDocsPage() {
  const [lastExecuted, setLastExecuted] = useState<string>('None');
  const [openCount, setOpenCount] = useState<number>(0);

  const paletteRef = useRef<SkyraCommandPaletteElement>(null);

  const sampleCommands: CommandItem[] = [
    {
      id: 'export-csv',
      label: 'Export to CSV',
      description: 'Download the current table data as a comma-separated values file',
      keywords: ['download', 'csv', 'spreadsheet', 'excel'],
      group: 'Actions',
      shortcut: 'mod+e',
      onExecute: () => setLastExecuted('Export to CSV executed'),
    },
    {
      id: 'refresh-data',
      label: 'Refresh Dataset',
      description: 'Reload data records from the mock store',
      keywords: ['reload', 'fetch', 'sync', 'update'],
      group: 'Actions',
      shortcut: 'mod+r',
      onExecute: () => setLastExecuted('Dataset Refreshed'),
    },
    {
      id: 'copy-link',
      label: 'Copy Deep Link',
      description: 'Copy permanent URL reference to clipboard',
      keywords: ['share', 'clipboard', 'url'],
      group: 'Actions',
      shortcut: 'mod+shift+c',
      onExecute: () => setLastExecuted('Deep Link copied to clipboard'),
    },
    {
      id: 'open-files',
      label: 'Browse Workspace Files',
      description: 'Open file explorer overlay for documents',
      keywords: ['files', 'documents', 'browse', 'media'],
      group: 'Navigation',
      shortcut: 'mod+o',
      onExecute: () => setLastExecuted('Navigated to Workspace Files'),
    },
    {
      id: 'app-settings',
      label: 'Application Settings',
      description: 'Configure workspace preferences and integrations',
      keywords: ['preferences', 'config', 'options'],
      group: 'Navigation',
      shortcut: 'mod+,',
      onExecute: () => setLastExecuted('Opened Application Settings'),
    },
    {
      id: 'archive-records',
      label: 'Archive Selected Records',
      description: 'Move selected rows to cold storage (requires Admin role)',
      keywords: ['archive', 'delete', 'cold'],
      group: 'Danger Zone',
      disabled: true,
      onExecute: () => setLastExecuted('Archive triggered (Disabled)'),
    },
  ];

  useEffect(() => {
    const el = paletteRef.current;
    if (!el) return;

    el.commands = sampleCommands;

    const handleSelect = (e: Event) => {
      const customEvent = e as CustomEvent<{ command: CommandItem; label: string }>;
      setLastExecuted(customEvent.detail?.label || 'Command activated');
    };

    const handleOpen = () => {
      setOpenCount((prev) => prev + 1);
    };

    el.addEventListener('skyra-command-select', handleSelect);
    el.addEventListener('skyra-command-palette-open', handleOpen);

    return () => {
      el.removeEventListener('skyra-command-select', handleSelect);
      el.removeEventListener('skyra-command-palette-open', handleOpen);
    };
  }, []);

  const openPalette = () => {
    if (paletteRef.current) {
      paletteRef.current.show();
    }
  };

  const toc = [
    { id: 'quick-start', label: 'Quick Start' },
    { id: 'examples', label: 'Interactive Examples' },
    { id: 'usage', label: 'Usage Guidance' },
    { id: 'api', label: 'API Reference' },
    { id: 'frameworks', label: 'Framework Usage' },
    { id: 'accessibility', label: 'Accessibility & Keyboard' },
    { id: 'related', label: 'Related Components' },
    { id: 'technical', label: 'Technical Reference' },
  ];

  return (
    <DocsLayout toc={toc}>
      <DocsHeader
        title="Command Palette"
        description="Framework-agnostic enterprise quick-command overlay Web Component featuring multi-term scoring search, category grouping, keyboard shortcuts (Mod+K), roving focus management, and accessible ARIA combobox semantics."
        breadcrumbs={[
          { label: 'Components', href: '/components' },
          { label: 'Overlays' },
          { label: 'Command Palette' },
        ]}
        badges={[
          { label: 'Stable', variant: 'stable' },
          { label: 'Web Component', variant: 'tech' },
        ]}
      />

      <PackageMeta
        packageName="@skyra-tech-platform/command-palette"
        version="0.1.0"
        type="Web Component"
      />

      {/* 1. Quick Start */}
      <section id="quick-start" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="quick-start" level={2}>Quick Start</HeadingAnchor>
        <InstallCommand packageName="@skyra-tech-platform/command-palette" />

        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--skyra-text)', marginBottom: '1rem', marginTop: '2.5rem', letterSpacing: '-0.01em' }}>
          Basic Usage
        </h3>
        <CodeTabs
          tabs={[
            {
              label: 'Web Component',
              language: 'html',
              code: `<!-- Import Custom Element -->
<script type="module" src="@skyra-tech-platform/command-palette"></script>

<!-- Add element anywhere in document -->
<skyra-command-palette id="palette" shortcut="mod+k" placeholder="Type a command or search..."></skyra-command-palette>

<script>
  const palette = document.getElementById('palette');
  palette.commands = [
    { id: 'home', label: 'Go to Home', group: 'Navigation', shortcut: 'G H', onExecute: () => location.href = '/' },
    { id: 'export', label: 'Export Report', group: 'Actions', shortcut: '⌘E', onExecute: () => exportData() },
    { id: 'archive', label: 'Archive Record', group: 'Actions', disabled: true }
  ];

  palette.addEventListener('skyra-command-select', (e) => {
    console.log('Selected command:', e.detail);
  });
</script>`,
            },
            {
              label: 'React / Next.js',
              language: 'tsx',
              code: `import '@skyra-tech-platform/command-palette';
import { CommandPalette, CommandPaletteTrigger } from '@/components/ui';

export function NavigationBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <CommandPaletteTrigger onClick={() => setOpen(true)} shortcut="mod+k">
        Search commands...
      </CommandPaletteTrigger>

      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        commands={[
          { id: 'docs', label: 'Documentation', group: 'Help', onExecute: () => {} },
          { id: 'settings', label: 'Settings', group: 'Account', shortcut: '⌘,' }
        ]}
        onSelect={(cmd) => console.log('Executed:', cmd)}
      />
    </>
  );
}`,
            },
          ]}
        />

        <div style={{ marginTop: '1.5rem' }}>
          <LiveExample>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                <skyra-tech-button
                  id="btn-open-palette"
                  variant="primary"
                  onClick={openPalette}
                >
                  <CommandIcon size={16} />
                  <span>Open Command Palette (Mod+K)</span>
                </skyra-tech-button>

                <button
                  id="palette-search-trigger"
                  type="button"
                  onClick={openPalette}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--skyra-radius-md, 8px)',
                    border: '1px solid var(--skyra-border, #e2e8f0)',
                    background: 'var(--skyra-surface, #ffffff)',
                    color: 'var(--skyra-text-muted, #64748b)',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                  aria-label="Search commands"
                >
                  <Search size={14} />
                  <span>Quick search actions...</span>
                  <kbd style={{
                    padding: '0.15rem 0.4rem',
                    fontSize: '0.75rem',
                    borderRadius: '4px',
                    background: 'var(--skyra-bg-muted, #f1f5f9)',
                    border: '1px solid var(--skyra-border, #e2e8f0)',
                    color: 'var(--skyra-text, #0f172a)',
                    fontFamily: 'monospace',
                  }}>
                    ⌘K
                  </kbd>
                </button>
              </div>

              <div
                id="palette-status-banner"
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--skyra-radius-md, 8px)',
                  background: 'rgba(14, 165, 233, 0.08)',
                  border: '1px solid rgba(14, 165, 233, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.875rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={16} style={{ color: 'var(--skyra-primary, #0ea5e9)' }} />
                  <span style={{ fontWeight: 600, color: 'var(--skyra-text, #0f172a)' }}>
                    Last Executed Command:
                  </span>
                  <span id="last-executed-label" style={{ color: 'var(--skyra-primary, #0ea5e9)', fontWeight: 600 }}>
                    {lastExecuted}
                  </span>
                </div>
                <span style={{ color: 'var(--skyra-text-muted, #64748b)', fontSize: '0.8rem' }}>
                  Times Opened: {openCount}
                </span>
              </div>

              {/* The Canonical Custom Element */}
              <skyra-command-palette
                ref={paletteRef}
                id="palette-native-element"
                shortcut="mod+k"
                placeholder="Type a command or keyword (e.g. 'csv', 'files', 'settings')..."
                empty-text="No matching commands found."
              ></skyra-command-palette>
            </div>
          </LiveExample>
        </div>
      </section>

      {/* 2. Examples */}
      <section id="examples" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="examples" level={2}>Interactive Capabilities</HeadingAnchor>
        <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          Explore key capabilities provided by the canonical implementation.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          <div style={{
            padding: '1.25rem',
            borderRadius: 'var(--skyra-radius-lg, 12px)',
            border: '1px solid var(--skyra-border, #e2e8f0)',
            background: 'var(--skyra-surface, #ffffff)',
          }}>
            <h4 style={{ fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--skyra-text)' }}>
              Deterministic Scoring Engine
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--skyra-text-muted)', margin: 0, lineHeight: 1.5 }}>
              Integrates the pure scoring search engine from <code>@skyra-tech-platform/utils</code> (<code>filterCommands</code>), prioritizing exact matches, word starts, acronyms, keyword synonyms, and descriptions without arbitrary third-party bundle weight.
            </p>
          </div>

          <div style={{
            padding: '1.25rem',
            borderRadius: 'var(--skyra-radius-lg, 12px)',
            border: '1px solid var(--skyra-border, #e2e8f0)',
            background: 'var(--skyra-surface, #ffffff)',
          }}>
            <h4 style={{ fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--skyra-text)' }}>
              Keyboard Roving & Accessibility
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--skyra-text-muted)', margin: 0, lineHeight: 1.5 }}>
              Combobox and listbox ARIA semantics with <code>aria-activedescendant</code>. Fully navigatable with <code>ArrowUp</code>, <code>ArrowDown</code>, <code>Home</code>, <code>End</code>, <code>Enter</code>, and <code>Escape</code>. Disabled items are skipped.
            </p>
          </div>

          <div style={{
            padding: '1.25rem',
            borderRadius: 'var(--skyra-radius-lg, 12px)',
            border: '1px solid var(--skyra-border, #e2e8f0)',
            background: 'var(--skyra-surface, #ffffff)',
          }}>
            <h4 style={{ fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--skyra-text)' }}>
              Input Field Typing Protection
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--skyra-text-muted)', margin: 0, lineHeight: 1.5 }}>
              Global shortcut listeners inspect active event targets with <code>isInputElement</code>, preventing inadvertent triggers while typing within textareas, inputs, or contenteditable regions.
            </p>
          </div>

          <div style={{
            padding: '1.25rem',
            borderRadius: 'var(--skyra-radius-lg, 12px)',
            border: '1px solid var(--skyra-border, #e2e8f0)',
            background: 'var(--skyra-surface, #ffffff)',
          }}>
            <h4 style={{ fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--skyra-text)' }}>
              Focus Restoration & Body Scroll Lock
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--skyra-text-muted)', margin: 0, lineHeight: 1.5 }}>
              Automatically captures <code>document.activeElement</code> on invocation and locks viewport scrolling. On dismissal via backdrop, Escape, or selection, previous focus and scrolling state are cleanly restored.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Usage Guidance */}
      <section id="usage" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="usage" level={2}>Usage Guidance</HeadingAnchor>
        <div style={{
          padding: '1.25rem',
          borderRadius: 'var(--skyra-radius-md, 8px)',
          background: 'var(--skyra-bg-muted, #f8fafc)',
          border: '1px solid var(--skyra-border, #e2e8f0)',
          lineHeight: 1.6,
          fontSize: '0.9rem',
          color: 'var(--skyra-text)',
        }}>
          <p style={{ margin: '0 0 0.75rem 0' }}>
            <strong>When to use:</strong> Use Command Palette as the primary global quick-access hub for keyboard power users to trigger deep routing actions, search system resources, toggle workstation settings, or execute batch operations.
          </p>
          <p style={{ margin: 0 }}>
            <strong>When not to use:</strong> Do not use Command Palette as a replacement for standard form input selects or simple drop-down menus. For simple context menus anchored to mouse clicks, use <code>@skyra-tech-platform/context-menu</code>.
          </p>
        </div>
      </section>

      {/* 4. API Reference */}
      <section id="api" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="api" level={2}>API Reference</HeadingAnchor>

        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '1.5rem 0 0.75rem 0', color: 'var(--skyra-text)' }}>
          Properties & Attributes
        </h3>
        <ApiTable
          rows={[
            { name: 'open', type: 'boolean', defaultVal: 'false', description: 'Controls visibility of the command palette overlay.' },
            { name: 'shortcut', type: 'string', defaultVal: "'mod+k'", description: 'Global keyboard shortcut combination to toggle the palette.' },
            { name: 'placeholder', type: 'string', defaultVal: "'Type a command or search...'", description: 'Placeholder label rendered inside the search input.' },
            { name: 'empty-text', type: 'string', defaultVal: "'No matching commands found.'", description: 'Message displayed when zero search matches are found.' },
            { name: 'close-on-select', type: 'boolean', defaultVal: 'true', description: 'Whether activating a command dismisses the palette overlay.' },
            { name: 'close-on-escape', type: 'boolean', defaultVal: 'true', description: 'Whether pressing the Escape key dismisses the palette overlay.' },
            { name: 'close-on-backdrop', type: 'boolean', defaultVal: 'true', description: 'Whether clicking the darkened backdrop dismisses the palette overlay.' },
            { name: 'commands', type: 'CommandItem[]', defaultVal: '[]', description: 'Array of command objects defining id, label, keywords, group, and onExecute.' },
          ]}
        />

        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '2rem 0 0.75rem 0', color: 'var(--skyra-text)' }}>
          Public Methods
        </h3>
        <ApiTable
          rows={[
            { name: 'show()', type: '() => void', defaultVal: '—', description: 'Programmatically opens the palette and sets focus on the search input.' },
            { name: 'hide(reason?: string)', type: '(reason?: string) => void', defaultVal: '—', description: 'Programmatically dismisses the palette overlay with an optional reason.' },
            { name: 'toggle()', type: '() => void', defaultVal: '—', description: 'Toggles open state.' },
            { name: 'selectCommand(id: string)', type: '(id: string) => boolean', defaultVal: '—', description: 'Programmatically selects and executes an enabled command by id.' },
          ]}
        />

        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '2rem 0 0.75rem 0', color: 'var(--skyra-text)' }}>
          Custom Events
        </h3>
        <ApiTable
          rows={[
            { name: 'skyra-command-select', type: 'CustomEvent<CommandSelectDetail>', defaultVal: '—', description: 'Fired when a command is executed. Detail contains command item, id, and label.' },
            { name: 'skyra-command-palette-open', type: 'CustomEvent<CommandPaletteOpenDetail>', defaultVal: '—', description: 'Fired when the palette opens. Detail contains trigger shortcut.' },
            { name: 'skyra-command-palette-close', type: 'CustomEvent<CommandPaletteCloseDetail>', defaultVal: '—', description: 'Fired when the palette closes. Detail contains dismissal reason.' },
            { name: 'skyra-command-palette-change', type: 'CustomEvent<CommandPaletteChangeDetail>', defaultVal: '—', description: 'Fired on any open state change. Detail contains open boolean.' },
            { name: 'skyra-command-palette-query', type: 'CustomEvent<CommandPaletteQueryDetail>', defaultVal: '—', description: 'Fired as the user types into the search field. Detail contains query string and match count.' },
          ]}
        />
      </section>

      {/* 5. Framework Support */}
      <section id="frameworks" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="frameworks" level={2}>Framework Usage</HeadingAnchor>
        <FrameworkSupport
          frameworks={[
            {
              name: 'React 19 & Next.js',
              support: 'e2e',
              integration: (
                <p>
                  Use the canonical <code>&lt;skyra-command-palette&gt;</code> element directly or through the provided thin <code>CommandPalette</code> and <code>CommandPaletteTrigger</code> React adapters with controlled or uncontrolled state.
                </p>
              ),
            },
            {
              name: 'Vanilla HTML / JS',
              support: 'e2e',
              integration: (
                <p>
                  Zero runtime dependencies. Import the script and use <code>&lt;skyra-command-palette&gt;</code> with standard properties, attributes, and DOM events.
                </p>
              ),
            },
          ]}
        />
      </section>

      {/* 6. Accessibility & Keyboard */}
      <section id="accessibility" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="accessibility" level={2}>Accessibility & Keyboard</HeadingAnchor>
        <AccessibilityPanel
          features={[
            <div key="aria"><strong style={{ color: 'var(--skyra-text)' }}>ARIA Combobox Semantics:</strong> Search input implements <code>role="combobox"</code> with <code>aria-autocomplete="list"</code> and synchronized <code>aria-activedescendant</code>. Options list implements <code>role="listbox"</code> with <code>role="option"</code> items.</div>,
            <div key="modal"><strong style={{ color: 'var(--skyra-text)' }}>Modal Dialog Role:</strong> Overlay panel marked with <code>role="dialog"</code>, <code>aria-modal="true"</code>, and accessible name.</div>,
            <div key="kb"><strong style={{ color: 'var(--skyra-text)' }}>Keyboard Navigation:</strong> <code>ArrowDown</code> and <code>ArrowUp</code> cycle through enabled commands. <code>Home</code> and <code>End</code> jump to boundary items. <code>Enter</code> activates the selection. <code>Escape</code> dismisses the palette.</div>,
            <div key="input-safe"><strong style={{ color: 'var(--skyra-text)' }}>Typing Protection:</strong> Global <code>Mod+K</code> shortcut listener uses <code>isInputElement</code> check to prevent unwanted triggers while typing in text inputs or textareas.</div>,
            <div key="focus-rest"><strong style={{ color: 'var(--skyra-text)' }}>Focus Restoration:</strong> Captures <code>document.activeElement</code> on open and restores focus cleanly upon dismissal.</div>,
            <div key="motion"><strong style={{ color: 'var(--skyra-text)' }}>Reduced Motion:</strong> Eliminates modal scale and fade animations when <code>prefers-reduced-motion: reduce</code> is detected.</div>,
          ]}
        />
      </section>

      {/* 7. Related Components */}
      <section id="related" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="related" level={2}>Related Components</HeadingAnchor>
        <RelatedComponents
          components={[
            { title: 'Dialog', description: 'Accessible modal dialog wrapper with focus trapping and backdrop dimming.', category: 'Overlays', href: '/components/overlays/dialog' },
            { title: 'Dropdown Menu', description: 'Framework-independent action menu overlay with roving keyboard navigation.', category: 'Overlays', href: '/components/overlays/dropdown-menu' },
            { title: 'Context Menu', description: 'Framework-independent pointer and keyboard context action menu.', category: 'Overlays', href: '/components/overlays/context-menu' },
            { title: 'Popover', description: 'Framework-independent anchored rich content overlay with collision detection.', category: 'Overlays', href: '/components/overlays/popover' },
          ]}
        />
      </section>

      {/* 8. Technical Reference */}
      <section id="technical" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="technical" level={2}>Technical Reference</HeadingAnchor>
        <div style={{
          padding: '1.25rem',
          borderRadius: 'var(--skyra-radius-md, 8px)',
          background: 'var(--skyra-surface, #ffffff)',
          border: '1px solid var(--skyra-border, #e2e8f0)',
          fontSize: '0.875rem',
          color: 'var(--skyra-text-muted)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
        }}>
          <div>
            <strong style={{ color: 'var(--skyra-text)' }}>Runtime:</strong> Runtime-neutral Web Component
          </div>
          <div>
            <strong style={{ color: 'var(--skyra-text)' }}>Shadow DOM:</strong> Open mode with isolated styles
          </div>
          <div>
            <strong style={{ color: 'var(--skyra-text)' }}>Dependencies:</strong> @skyra-tech-platform/utils
          </div>
          <div>
            <strong style={{ color: 'var(--skyra-text)' }}>Bundle Output:</strong> ESM, CJS, and DTS
          </div>
          <div>
            <strong style={{ color: 'var(--skyra-text)' }}>SSR Safe:</strong> Yes (Node.js import without globals)
          </div>
          <div>
            <strong style={{ color: 'var(--skyra-text)' }}>Zero React Dependency:</strong> Pure Custom Element package
          </div>
        </div>
      </section>
    </DocsLayout>
  );
}
