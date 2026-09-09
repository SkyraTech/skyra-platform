'use client';
import React, { useState } from 'react';
import { DynamicDataTable } from '@skyra/data-table';
import { StatusBadge, StatusConfig } from '@skyra/ui';
import { MOCK_TRANSACTIONS, MockTransaction } from '@/components/demos/MockData';

const STATUS_MAP: Record<string, StatusConfig> = {
  PAID: { label: 'Paid', bg: 'var(--skyra-success-light)', color: 'var(--skyra-success)' },
  PENDING: { label: 'Pending', bg: 'var(--skyra-warning-light)', color: 'var(--skyra-warning-dark)' },
  OVERDUE: { label: 'Overdue', bg: 'var(--skyra-danger-light)', color: 'var(--skyra-danger)', border: 'var(--skyra-danger)' },
  DRAFT: { label: 'Draft', bg: 'var(--skyra-border)', color: 'var(--skyra-text-muted)' },
};

export default function DataTablePage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(MOCK_TRANSACTIONS);

  return (
    <div className="dash-page" style={{ maxWidth: '1000px' }}>
      <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--skyra-text)', marginBottom: '0.5rem' }}>
        Data Table Showcase
      </h1>
      <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '3rem' }}>
        Interactive demonstration of <code>DynamicDataTable&lt;T&gt;</code>. Features client-side search, sorting, pagination, and row actions.
      </p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          className="btn-outline" 
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 2000);
          }}
          style={{ padding: '0.5rem 1rem', borderRadius: 'var(--skyra-radius-md)', border: '1px solid var(--skyra-primary)', background: 'transparent', color: 'var(--skyra-primary)', cursor: 'pointer' }}
        >
          Toggle Loading State
        </button>
        <button 
          className="btn-outline" 
          onClick={() => setData(data.length === 0 ? MOCK_TRANSACTIONS : [])}
          style={{ padding: '0.5rem 1rem', borderRadius: 'var(--skyra-radius-md)', border: '1px solid var(--skyra-primary)', background: 'transparent', color: 'var(--skyra-primary)', cursor: 'pointer' }}
        >
          Toggle Empty State
        </button>
      </div>

      <div style={{ background: 'var(--skyra-surface)', border: '1px solid var(--skyra-border)', borderRadius: 'var(--skyra-radius-xl)', overflow: 'hidden' }}>
        <DynamicDataTable<MockTransaction>
          data={data}
          columns={[
            { key: 'reference', header: 'Reference', accessor: 'reference', sortable: true },
            { key: 'client', header: 'Client Name', accessor: 'client', sortable: true },
            { 
              key: 'amount', 
              header: 'Amount', 
              accessor: (item: any) => <span style={{ fontWeight: 500 }}>${item.amount.toLocaleString()}</span>,
              sortable: true
            },
            { key: 'date', header: 'Date', accessor: 'date', sortable: true },
            { 
              key: 'status', 
              header: 'Status', 
              accessor: (item: any) => <StatusBadge statusMap={STATUS_MAP} status={item.status} size="sm" />,
              sortable: true
            }
          ]}
          searchPlaceholder="Search clients..."
          isLoading={loading}
          pageSize={10}
          onEdit={(item) => alert(`Edit: ${item.reference}`)}
          onDelete={(item) => alert(`Delete: ${item.reference}`)}
          onView={(item) => alert(`View: ${item.reference}`)}
          emptyMessage="No transactions found. Try adjusting your search query or clear filters."
        />
      </div>
    </div>
  );
}
