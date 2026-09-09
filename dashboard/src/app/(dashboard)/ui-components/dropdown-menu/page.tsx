'use client';

import React, { useState } from 'react';
import {
  DropdownMenu,
  MenuItem,
  MenuGroup,
  MenuSeparator,
  CheckboxMenuItem,
  RadioMenuItem,
  Button,
} from '@skyra/ui';
import { DemoSection, DemoBlock } from '@/components/demos/DemoSection';
import {
  MoreVertical,
  Edit3,
  Copy,
  Share2,
  Trash2,
  Download,
  Printer,
  Settings,
  User,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

export default function DropdownMenuShowcasePage() {
  const [showArchived, setShowArchived] = useState(false);
  const [showDrafts, setShowDrafts] = useState(true);
  const [selectedDensity, setSelectedDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [lastAction, setLastAction] = useState<string>('None');

  return (
    <div className="dash-page" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--skyra-text)', margin: 0 }}>
          Dropdown Menu Component
        </h1>
        <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
          Action-oriented menu triggered by a button with full keyboard navigation (ArrowUp/Down, Home/End, Enter, Escape), groups, separators, checkable items, and destructive actions.
        </p>
      </div>

      {/* Status feedback bar */}
      <div style={{ background: 'var(--skyra-bg-surface)', border: '1px solid var(--skyra-border)', padding: '0.75rem 1.25rem', borderRadius: 'var(--skyra-radius-md)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <CheckCircle2 size={16} color="var(--skyra-primary)" />
        <span style={{ fontSize: '0.875rem' }}>Last Selected Action: <strong style={{ color: 'var(--skyra-primary)' }}>{lastAction}</strong></span>
      </div>

      {/* 1. Declarative & Basic Menus */}
      <DemoSection title="1. Action Menus with Icons &amp; Shortcuts" desc="Standard action triggers with leading icons, keyboard shortcut indicators, and destructive styling." erpSource="Platform Foundation">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="Declarative Action Menu">
            <div style={{ padding: '1rem 0' }}>
              <DropdownMenu
                trigger={<Button variant="primary">Actions Menu</Button>}
                items={[
                  { label: 'Edit Record', icon: <Edit3 size={15} />, shortcut: '⌘E', onClick: () => setLastAction('Edit Record') },
                  { label: 'Duplicate Entry', icon: <Copy size={15} />, shortcut: '⌘D', onClick: () => setLastAction('Duplicate Entry') },
                  { label: 'Share Link', icon: <Share2 size={15} />, onClick: () => setLastAction('Share Link') },
                  { type: 'separator' },
                  { label: 'Export PDF', icon: <Download size={15} />, onClick: () => setLastAction('Export PDF') },
                  { label: 'Print Summary', icon: <Printer size={15} />, disabled: true, shortcut: '⌘P' },
                  { type: 'separator' },
                  { label: 'Delete Record', icon: <Trash2 size={15} />, destructive: true, onClick: () => setLastAction('Delete Record') },
                ]}
              />
            </div>
          </DemoBlock>

          <DemoBlock title="Icon-Only Trigger (Table Row Actions)">
            <div style={{ padding: '1rem 0' }}>
              <DropdownMenu
                trigger={
                  <Button variant="ghost" size="sm" style={{ padding: '0.4rem', borderRadius: '50%' }}>
                    <MoreVertical size={18} />
                  </Button>
                }
                items={[
                  { label: 'View Details', onClick: () => setLastAction('View Details') },
                  { label: 'Edit Permissions', onClick: () => setLastAction('Edit Permissions') },
                  { type: 'separator' },
                  { label: 'Archive Record', destructive: true, onClick: () => setLastAction('Archive Record') },
                ]}
              />
            </div>
          </DemoBlock>
        </div>
      </DemoSection>

      {/* 2. Compositional Menus with Groups & Checkable Items */}
      <DemoSection title="2. Grouped Items &amp; Checkable States" desc="Compositional menus supporting groups, section labels, and toggling checkbox/radio states." erpSource="Platform Foundation">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="Account &amp; Navigation Menu">
            <div style={{ padding: '1rem 0' }}>
              <DropdownMenu trigger={<Button variant="outline">My Account</Button>}>
                <MenuGroup label="Personal">
                  <MenuItem icon={<User size={15} />} onClick={() => setLastAction('Profile Settings')}>
                    Profile &amp; Account
                  </MenuItem>
                  <MenuItem icon={<Settings size={15} />} onClick={() => setLastAction('Preferences')}>
                    Preferences
                  </MenuItem>
                </MenuGroup>
                <MenuSeparator />
                <MenuGroup label="Organization">
                  <MenuItem icon={<Sliders size={15} />} onClick={() => setLastAction('Billing Management')}>
                    Billing &amp; Plans
                  </MenuItem>
                </MenuGroup>
                <MenuSeparator />
                <MenuItem destructive onClick={() => setLastAction('Sign Out')}>
                  Sign Out
                </MenuItem>
              </DropdownMenu>
            </div>
          </DemoBlock>

          <DemoBlock title="View Options (Checkbox &amp; Radio Items)">
            <div style={{ padding: '1rem 0' }}>
              <DropdownMenu trigger={<Button variant="outline">View Settings</Button>}>
                <MenuGroup label="Display Filters">
                  <CheckboxMenuItem
                    checked={showDrafts}
                    onCheckedChange={(checked) => {
                      setShowDrafts(checked);
                      setLastAction(`Show Drafts: ${checked}`);
                    }}
                  >
                    Show Draft Invoices
                  </CheckboxMenuItem>
                  <CheckboxMenuItem
                    checked={showArchived}
                    onCheckedChange={(checked) => {
                      setShowArchived(checked);
                      setLastAction(`Show Archived: ${checked}`);
                    }}
                  >
                    Show Archived
                  </CheckboxMenuItem>
                </MenuGroup>
                <MenuSeparator />
                <MenuGroup label="Table Density">
                  <RadioMenuItem
                    checked={selectedDensity === 'comfortable'}
                    onSelect={() => {
                      setSelectedDensity('comfortable');
                      setLastAction('Density: Comfortable');
                    }}
                  >
                    Comfortable Spacing
                  </RadioMenuItem>
                  <RadioMenuItem
                    checked={selectedDensity === 'compact'}
                    onSelect={() => {
                      setSelectedDensity('compact');
                      setLastAction('Density: Compact');
                    }}
                  >
                    Compact Spacing
                  </RadioMenuItem>
                </MenuGroup>
              </DropdownMenu>
            </div>
          </DemoBlock>
        </div>
      </DemoSection>
    </div>
  );
}
