'use client';

import React, { useState } from 'react';
import {
  CommandPalette,
  CommandPaletteTrigger,
  Command,
  Button,
  Card,
  Badge,
  Kbd,
} from '@skyra/ui';
import { DemoSection, DemoBlock } from '@/components/demos/DemoSection';
import {
  Search,
  Settings,
  Download,
  Moon,
  Sun,
  Copy,
  Trash2,
  RefreshCw,
  FolderOpen,
  CheckCircle,
  Command as CommandIcon,
} from 'lucide-react';

export default function CommandPaletteShowcase() {
  const [openGrouped, setOpenGrouped] = useState(false);
  const [lastExecuted, setLastExecuted] = useState<string | null>(null);
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>('light');

  const demoCommands: Command[] = [
    {
      id: 'export-csv',
      label: 'Export to CSV',
      description: 'Download the current table data as a comma-separated values file',
      keywords: ['download', 'csv', 'spreadsheet', 'excel'],
      group: 'Actions',
      shortcut: 'mod+e',
      icon: <Download size={16} />,
      onExecute: () => setLastExecuted('Export to CSV executed'),
    },
    {
      id: 'refresh-data',
      label: 'Refresh Dataset',
      description: 'Reload data records from the mock store',
      keywords: ['reload', 'fetch', 'sync', 'update'],
      group: 'Actions',
      shortcut: 'mod+r',
      icon: <RefreshCw size={16} />,
      onExecute: () => setLastExecuted('Dataset Refreshed'),
    },
    {
      id: 'copy-link',
      label: 'Copy Deep Link',
      description: 'Copy permanent URL reference to clipboard',
      keywords: ['share', 'clipboard', 'url'],
      group: 'Actions',
      shortcut: 'mod+shift+c',
      icon: <Copy size={16} />,
      onExecute: () => setLastExecuted('Deep Link copied to clipboard'),
    },
    {
      id: 'open-files',
      label: 'Browse Workspace Files',
      description: 'Open file explorer overlay for documents',
      keywords: ['files', 'documents', 'browse', 'media'],
      group: 'Navigation',
      shortcut: 'mod+o',
      icon: <FolderOpen size={16} />,
      onExecute: () => setLastExecuted('Navigated to Workspace Files'),
    },
    {
      id: 'app-settings',
      label: 'Application Settings',
      description: 'Configure workspace preferences and integrations',
      keywords: ['preferences', 'config', 'options'],
      group: 'Navigation',
      shortcut: 'mod+,',
      icon: <Settings size={16} />,
      onExecute: () => setLastExecuted('Opened Application Settings'),
    },
    {
      id: 'toggle-theme',
      label: 'Toggle Color Theme',
      description: 'Switch between light and dark workstation modes',
      keywords: ['theme', 'dark', 'light', 'mode'],
      group: 'Preferences',
      shortcut: 'mod+d',
      icon: activeTheme === 'light' ? <Moon size={16} /> : <Sun size={16} />,
      onExecute: () => {
        const next = activeTheme === 'light' ? 'dark' : 'light';
        setActiveTheme(next);
        setLastExecuted(`Theme switched to ${next}`);
      },
    },
    {
      id: 'archive-records',
      label: 'Archive Selected Records',
      description: 'Move selected rows to cold storage (requires Admin role)',
      keywords: ['archive', 'delete', 'cold'],
      group: 'Danger Zone',
      icon: <Trash2 size={16} />,
      disabled: true,
      onExecute: () => setLastExecuted('Archive triggered (Disabled)'),
    },
  ];

  return (
    <div className="dash-page" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <CommandIcon size={28} style={{ color: 'var(--skyra-primary)' }} />
          <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--skyra-text)', margin: 0 }}>
            Command Palette
          </h1>
        </div>
        <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.95rem', margin: 0 }}>
          Enterprise quick-command overlay with fuzzy-tolerant keyword search, grouped categories, keyboard shortcuts, strict focus trap/restoration, and ARIA combobox/listbox accessibility.
        </p>
      </div>

      {lastExecuted && (
        <div
          style={{
            marginBottom: '1.5rem',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--skyra-radius-md)',
            backgroundColor: 'rgba(10, 88, 202, 0.08)',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'var(--skyra-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={16} style={{ color: 'var(--skyra-primary)' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--skyra-text)' }}>
              Last Command: {lastExecuted}
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setLastExecuted(null)}>
            Clear
          </Button>
        </div>
      )}

      <DemoSection
        title="1. Interactive Triggers & Controlled State"
        desc="Launch the Command Palette using keyboard shortcut (Mod+K) or trigger buttons."
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="Trigger Button & Keyboard Shortcut">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--skyra-text-muted)', margin: 0 }}>
                Press <Kbd shortcut="mod+k" /> anywhere on the page or click below to open.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                <CommandPaletteTrigger onClick={() => setOpenGrouped(true)} shortcut="mod+k">
                  <Search size={14} />
                  <span>Search commands & actions...</span>
                </CommandPaletteTrigger>

                <Button variant="primary" onClick={() => setOpenGrouped(true)}>
                  <CommandIcon size={16} />
                  <span>Open Full Palette</span>
                </Button>
              </div>
            </div>
          </DemoBlock>

          <DemoBlock title="Palette Capabilities">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--skyra-text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Badge variant="success">Search</Badge>
                <span>Matches label, description, and keywords (e.g. "csv" finds "Export to CSV")</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Badge variant="primary">Navigation</Badge>
                <span>ArrowUp, ArrowDown, Home, End, Enter to execute, Escape to close</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Badge variant="neutral">Disabled</Badge>
                <span>Disabled commands are skipped by keyboard navigation and cannot execute</span>
              </div>
            </div>
          </DemoBlock>
        </div>
      </DemoSection>

      <DemoSection
        title="2. Registered Command Manifest"
        desc="Strongly-typed command definitions supplied by the application layer."
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {demoCommands.map((cmd) => (
            <Card key={cmd.id} style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {cmd.icon}
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--skyra-text)' }}>
                    {cmd.label}
                  </span>
                </div>
                {cmd.disabled ? (
                  <Badge variant="neutral">Disabled</Badge>
                ) : (
                  <Badge variant="primary">{cmd.group || 'General'}</Badge>
                )}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--skyra-text-muted)', margin: '0 0 0.75rem 0' }}>
                {cmd.description}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--skyra-text-muted)' }}>
                  Keywords: {cmd.keywords?.join(', ') || 'none'}
                </span>
                {cmd.shortcut && <Kbd shortcut={cmd.shortcut} size="xs" />}
              </div>
            </Card>
          ))}
        </div>
      </DemoSection>

      <CommandPalette
        open={openGrouped}
        onOpenChange={setOpenGrouped}
        commands={demoCommands}
        placeholder="Type a command or search keyword (e.g. 'csv', 'theme', 'settings')..."
      />
    </div>
  );
}
