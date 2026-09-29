'use client';

import React, { useState } from 'react';
import {
  ContextMenu,
  MenuItem,
  MenuGroup,
  MenuSeparator,
  Badge,
  Button,
} from '@skyra/ui';
import { DemoSection, DemoBlock } from '@/components/demos/DemoSection';
import {
  MousePointer,
  Eye,
  Edit2,
  Copy,
  Trash2,
  Download,
  Share2,
  FileText,
  CheckCircle,
} from 'lucide-react';

export default function ContextMenuShowcasePage() {
  const [lastAction, setLastAction] = useState<string>('None');

  return (
    <div className="dash-page" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--skyra-text)', margin: 0 }}>
          Context Menu Component
        </h1>
        <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
          Right-click contextual action menu anchored to pointer click coordinates with viewport collision protection, keyboard navigation, and dark mode support.
        </p>
      </div>

      {/* Status feedback bar */}
      <div style={{ background: 'var(--skyra-bg-surface)', border: '1px solid var(--skyra-border)', padding: '0.75rem 1.25rem', borderRadius: 'var(--skyra-radius-md)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <CheckCircle size={16} color="var(--skyra-primary)" />
        <span style={{ fontSize: '0.875rem' }}>Last Executed Context Action: <strong style={{ color: 'var(--skyra-primary)' }}>{lastAction}</strong></span>
      </div>

      {/* 1. Context Menu Target Cards */}
      <DemoSection title="1. Right-Click Target Surfaces" desc="Right-click anywhere inside the designated target zones to trigger the contextual action menu." erpSource="Platform Foundation">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="Document Item Context Target">
            <div style={{ padding: '1rem 0' }}>
              <ContextMenu
                items={[
                  { label: 'View Document', icon: <Eye size={15} />, onClick: () => setLastAction('View Document') },
                  { label: 'Edit Metadata', icon: <Edit2 size={15} />, onClick: () => setLastAction('Edit Metadata') },
                  { label: 'Duplicate Item', icon: <Copy size={15} />, onClick: () => setLastAction('Duplicate Item') },
                  { type: 'separator' },
                  { label: 'Download Asset', icon: <Download size={15} />, onClick: () => setLastAction('Download Asset') },
                  { label: 'Share Link', icon: <Share2 size={15} />, onClick: () => setLastAction('Share Link') },
                  { type: 'separator' },
                  { label: 'Delete Document', icon: <Trash2 size={15} />, destructive: true, onClick: () => setLastAction('Delete Document') },
                ]}
              >
                <div
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
                    Financial_Report_Q3_2026.pdf
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--skyra-text-muted)', margin: '0.5rem 0 0' }}>
                    Right-click this container to open the contextual action menu
                  </p>
                </div>
              </ContextMenu>
            </div>
          </DemoBlock>

          <DemoBlock title="Table Row Simulation Context Menu">
            <div style={{ padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { id: 'INV-2026-001', client: 'Acme Global Corp', amount: '$14,250.00', status: 'Paid' },
                { id: 'INV-2026-002', client: 'Starlight Dynamics', amount: '$8,900.00', status: 'Pending' },
                { id: 'INV-2026-003', client: 'Nexus Technologies', amount: '$22,400.00', status: 'Overdue' },
              ].map((row) => (
                <ContextMenu
                  key={row.id}
                  items={[
                    { label: `View Invoice ${row.id}`, icon: <Eye size={15} />, onClick: () => setLastAction(`View ${row.id}`) },
                    { label: 'Edit Invoice', icon: <Edit2 size={15} />, onClick: () => setLastAction(`Edit ${row.id}`) },
                    { type: 'separator' },
                    { label: 'Send Payment Reminder', icon: <Share2 size={15} />, disabled: row.status === 'Paid', onClick: () => setLastAction(`Reminder ${row.id}`) },
                    { type: 'separator' },
                    { label: 'Void Invoice', icon: <Trash2 size={15} />, destructive: true, onClick: () => setLastAction(`Void ${row.id}`) },
                  ]}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      background: 'var(--skyra-card-bg)',
                      border: '1px solid var(--skyra-border)',
                      borderRadius: 'var(--skyra-radius-md)',
                      cursor: 'context-menu',
                      userSelect: 'none',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{row.id}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--skyra-text-muted)' }}>{row.client}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{row.amount}</div>
                      <Badge variant={row.status === 'Paid' ? 'success' : row.status === 'Overdue' ? 'danger' : 'primary'} size="sm">
                        {row.status}
                      </Badge>
                    </div>
                  </div>
                </ContextMenu>
              ))}
            </div>
          </DemoBlock>
        </div>
      </DemoSection>
    </div>
  );
}
