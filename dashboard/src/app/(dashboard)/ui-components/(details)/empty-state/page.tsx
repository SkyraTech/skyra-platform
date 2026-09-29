'use client';

import React, { useState } from 'react';
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateActions,
  Button,
  SearchInput,
  Card,
  Badge,
} from '@skyra/ui';
import { DemoSection, DemoBlock } from '@/components/demos/DemoSection';

export default function EmptyStateShowcasePage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="dash-page" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--skyra-text)', margin: 0 }}>
          Empty State Component
        </h1>
        <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
          Semantic, accessible state container used when no data or items are available. Distinct from error states, providing clear guidance and call-to-actions to get users started.
        </p>
      </div>

      {/* 1. Basic & Actionable Empty States */}
      <DemoSection title="1. Standard Empty States" desc="Full-height semantic empty states with decorative icons, descriptive titles, body copy, and action buttons." erpSource="Platform Foundation">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="No Documents (First-time user onboarding)">
            <EmptyState variant="dashed">
              <EmptyStateIcon>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
              </EmptyStateIcon>
              <EmptyStateTitle>No Documents Found</EmptyStateTitle>
              <EmptyStateDescription>
                You haven&apos;t uploaded any financial or tax documents to this workspace yet.
              </EmptyStateDescription>
              <EmptyStateActions>
                <Button variant="primary">Upload Document</Button>
                <Button variant="outline">Learn More</Button>
              </EmptyStateActions>
            </EmptyState>
          </DemoBlock>

          <DemoBlock title="No Invoices (Card Container)">
            <EmptyState variant="outline">
              <EmptyStateIcon>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </EmptyStateIcon>
              <EmptyStateTitle>No Invoices Generated</EmptyStateTitle>
              <EmptyStateDescription>
                Create your first sales invoice to begin tracking payments and receivables.
              </EmptyStateDescription>
              <EmptyStateActions>
                <Button variant="primary">Create Invoice</Button>
              </EmptyStateActions>
            </EmptyState>
          </DemoBlock>
        </div>
      </DemoSection>

      {/* 2. Compact & Table-Embedded States */}
      <DemoSection title="2. Compact & Table-Embedded States" desc="Compact variations designed for data tables, search filter misses, sidebars, and smaller widgets." erpSource="Platform Foundation">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="Search Result Filter Miss">
            <div style={{ marginBottom: '1rem' }}>
              <SearchInput
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <EmptyState compact variant="default">
              <EmptyStateIcon>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </EmptyStateIcon>
              <EmptyStateTitle as="h4">No matching results</EmptyStateTitle>
              <EmptyStateDescription>
                We couldn&apos;t find any records matching &quot;{searchTerm || 'query'}&quot;. Try adjusting your search keywords.
              </EmptyStateDescription>
              <EmptyStateActions>
                <Button variant="ghost" size="sm" onClick={() => setSearchTerm('')}>
                  Clear Search
                </Button>
              </EmptyStateActions>
            </EmptyState>
          </DemoBlock>

          <DemoBlock title="Embedded DataTable Container">
            <Card style={{ overflow: 'hidden' }}>
              <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--skyra-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--skyra-text)' }}>Audit Log</span>
                <Badge variant="neutral">0 Records</Badge>
              </div>
              <EmptyState compact style={{ padding: '2.5rem 1rem' }}>
                <EmptyStateTitle as="h4">No Audit Logs Recorded</EmptyStateTitle>
                <EmptyStateDescription>
                  System activity and user operations will appear here as they occur.
                </EmptyStateDescription>
              </EmptyState>
            </Card>
          </DemoBlock>
        </div>
      </DemoSection>
    </div>
  );
}
