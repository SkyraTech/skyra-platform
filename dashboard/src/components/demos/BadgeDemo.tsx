'use client';
import React from 'react';
import { Badge, StatusBadge, StatusConfig } from '@skyra/ui';
import { DemoSection, DemoBlock } from './DemoSection';

const MOCK_STATUS_MAP: Record<string, StatusConfig> = {
  PAID: { label: 'Paid', bg: 'var(--skyra-success-light)', color: 'var(--skyra-success)' },
  DRAFT: { label: 'Draft', bg: 'var(--skyra-border)', color: 'var(--skyra-text-muted)' },
  OVERDUE: { label: 'Overdue', bg: 'var(--skyra-danger-light)', color: 'var(--skyra-danger)', border: 'var(--skyra-danger)' },
};

export function BadgeDemo() {
  return (
    <DemoSection 
      title="Badges" 
      desc="Standard badges and the generalized StatusBadge."
      erpSource="[B] PLATFORM EXTRACTION (ui.css .badge-*, StatusBadge.tsx)"
    >
      <DemoBlock title="Standard Badges">
        <Badge variant="primary">Primary</Badge>
        <Badge variant="orange">Orange</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="danger">Danger</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="info">Info</Badge>
        <Badge variant="neutral">Neutral</Badge>
      </DemoBlock>

      <DemoBlock title="Generic Status Badge">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--skyra-text-muted)' }}>
            StatusBadge takes a generic `statusMap`. Example map: PAID, DRAFT, OVERDUE.
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <StatusBadge statusMap={MOCK_STATUS_MAP} status="PAID" size="sm" />
            <StatusBadge statusMap={MOCK_STATUS_MAP} status="DRAFT" size="md" />
            <StatusBadge statusMap={MOCK_STATUS_MAP} status="OVERDUE" size="lg" />
            <StatusBadge statusMap={MOCK_STATUS_MAP} status="UNKNOWN" size="md" />
          </div>
        </div>
      </DemoBlock>
    </DemoSection>
  );
}
