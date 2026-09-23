'use client';

import React, { useState } from 'react';
import { DataTable, ColumnDef, processTableData, useDataTableState } from '@skyra/data-table';
import { StatusBadge, StatusConfig, Button } from '@skyra/ui';
import { downloadCsv } from '@skyra/data-export';
import { MOCK_TRANSACTIONS, MockTransaction } from '@/components/demos/MockData';
import { Eye, Edit, Trash2, Download, RefreshCw, AlertCircle } from 'lucide-react';

const STATUS_MAP: Record<string, StatusConfig> = {
  PAID: { label: 'Paid', bg: 'var(--skyra-success-light)', color: 'var(--skyra-success)' },
  PENDING: { label: 'Pending', bg: 'var(--skyra-warning-light)', color: 'var(--skyra-warning-dark)' },
  OVERDUE: { label: 'Overdue', bg: 'var(--skyra-danger-light)', color: 'var(--skyra-danger)', border: 'var(--skyra-danger)' },
  DRAFT: { label: 'Draft', bg: 'var(--skyra-border)', color: 'var(--skyra-text-muted)' },
};

const columns: ColumnDef<MockTransaction>[] = [
  { id: 'reference', header: 'Reference', accessor: 'reference', sortable: true, resizable: true, minWidth: 120 },
  { id: 'client', header: 'Client Name', accessor: 'client', sortable: true, resizable: true, minWidth: 160 },
  { 
    id: 'amount', 
    header: 'Amount', 
    accessor: 'amount',
    cell: ({ value }) => <span style={{ fontWeight: 600 }}>${Number(value).toLocaleString()}</span>,
    sortable: true,
    resizable: true,
    minWidth: 110,
  },
  { id: 'date', header: 'Date', accessor: 'date', sortable: true, resizable: true, minWidth: 110 },
  { 
    id: 'status', 
    header: 'Status', 
    accessor: 'status',
    cell: ({ value }) => <StatusBadge statusMap={STATUS_MAP} status={String(value)} size="sm" />,
    sortable: true,
    hideable: true,
    resizable: true,
    minWidth: 110,
  }
];

export default function DataTablePage() {
  const [loading, setLoading] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const [showError, setShowError] = useState(false);
  const [featureConfig, setFeatureConfig] = useState({
    sorting: true,
    filtering: true,
    globalSearch: true,
    pagination: true,
    rowSelection: true,
    columnVisibility: true,
    columnResizing: true,
    stickyHeader: false,
    rowActions: true,
    bulkActions: true,
  });

  const tableState = useDataTableState({
    initialPagination: { pageIndex: 0, pageSize: 10 }
  });

  const activeData = showError 
    ? MOCK_TRANSACTIONS 
    : (showEmpty ? [] : MOCK_TRANSACTIONS);

  const errorObj = showError ? new Error('Database query timed out while loading transactions.') : null;

  // Export handler using pure processTableData + downloadCsv
  const handleExportProcessed = () => {
    const processed = processTableData(MOCK_TRANSACTIONS, {
      columns,
      globalFilter: featureConfig.globalSearch ? tableState.globalFilter : undefined,
      columnFilters: featureConfig.filtering ? tableState.columnFilters : undefined,
      sorting: featureConfig.sorting ? tableState.sorting : undefined,
    });

    const visibleCols = columns
      .filter((c) => !tableState.visibility[c.id || (c.accessor as string)])
      .map((c) => ({
        key: String(c.id || c.accessor),
        header: String(c.header),
      }));

    downloadCsv(processed, {
      columns: visibleCols,
      filename: 'transactions-export.csv',
    });
  };

  const handleExportSelected = (selected: MockTransaction[]) => {
    const visibleCols = columns
      .filter((c) => !tableState.visibility[c.id || (c.accessor as string)])
      .map((c) => ({
        key: String(c.id || c.accessor),
        header: String(c.header),
      }));

    downloadCsv(selected, {
      columns: visibleCols,
      filename: `selected-transactions-${selected.length}.csv`,
    });
  };

  const toggleFeature = (key: keyof typeof featureConfig) => {
    setFeatureConfig((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="dash-page" style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '3rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.85rem', color: 'var(--skyra-text)', marginBottom: '0.4rem' }}>
          Enterprise Data Table Showcase
        </h1>
        <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.95rem', maxWidth: '750px' }}>
          Production-grade <code>DataTable&lt;T&gt;</code> component featuring zero-dependency native column resizing, controlled & uncontrolled states, modular feature flags, accessible semantics (WCAG AAA / Axe 0), and seamless export integration.
        </p>
      </header>

      {/* ── Feature Configuration Controls ── */}
      <section 
        aria-label="Table Configuration Panel"
        style={{ 
          background: 'var(--skyra-surface)', 
          border: '1px solid var(--skyra-border)', 
          borderRadius: 'var(--skyra-radius-lg)', 
          padding: '1.25rem', 
          marginBottom: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--skyra-text)', margin: 0 }}>
            Interactive Feature Flags & Modularity
          </h2>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button 
              type="button"
              onClick={() => {
                setLoading(true);
                setTimeout(() => setLoading(false), 1500);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--skyra-radius-md)',
                border: '1px solid var(--skyra-border)',
                background: 'var(--skyra-bg)',
                color: 'var(--skyra-text)',
                fontSize: '0.8rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={13} />
              {loading ? 'Simulating...' : 'Simulate Loading'}
            </button>
            <button 
              type="button"
              onClick={() => {
                setShowEmpty((prev) => !prev);
                setShowError(false);
              }}
              style={{
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--skyra-radius-md)',
                border: '1px solid var(--skyra-border)',
                background: showEmpty ? 'var(--skyra-primary)' : 'var(--skyra-bg)',
                color: showEmpty ? 'var(--skyra-primary-foreground, #fff)' : 'var(--skyra-text)',
                fontSize: '0.8rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {showEmpty ? 'Show Data' : 'Toggle Empty State'}
            </button>
            <button 
              type="button"
              onClick={() => {
                setShowError((prev) => !prev);
                setShowEmpty(false);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--skyra-radius-md)',
                border: '1px solid var(--skyra-danger)',
                background: showError ? 'var(--skyra-danger)' : 'transparent',
                color: showError ? '#fff' : 'var(--skyra-danger)',
                fontSize: '0.8rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              <AlertCircle size={13} />
              {showError ? 'Clear Error' : 'Simulate Error'}
            </button>
            <button 
              type="button"
              onClick={handleExportProcessed}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--skyra-radius-md)',
                border: '1px solid var(--skyra-primary)',
                background: 'var(--skyra-primary)',
                color: 'var(--skyra-primary-foreground, #fff)',
                fontSize: '0.8rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              <Download size={13} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Feature Switches */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {(Object.keys(featureConfig) as (keyof typeof featureConfig)[]).map((key) => {
            const isEnabled = featureConfig[key];
            return (
              <label 
                key={key}
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.35rem', 
                  padding: '0.35rem 0.6rem', 
                  borderRadius: 'var(--skyra-radius-sm)',
                  background: isEnabled ? 'var(--skyra-primary-light, rgba(59, 130, 246, 0.08))' : 'var(--skyra-bg)',
                  border: `1px solid ${isEnabled ? 'var(--skyra-primary)' : 'var(--skyra-border)'}`,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  color: isEnabled ? 'var(--skyra-primary)' : 'var(--skyra-text-muted)',
                  fontWeight: isEnabled ? 600 : 400,
                }}
              >
                <input 
                  type="checkbox" 
                  checked={isEnabled} 
                  onChange={() => toggleFeature(key)} 
                  style={{ display: 'none' }}
                />
                {key}
              </label>
            );
          })}
        </div>
      </section>

      {/* ── Main DataTable Component ── */}
      <DataTable<MockTransaction>
        data={activeData}
        columns={columns}
        features={featureConfig}
        isLoading={loading}
        error={errorObj}
        onErrorRetry={() => setShowError(false)}
        emptyMessage="No transactions found in this view. Try adjusting your query or filters."
        noResultsMessage="No transactions match your search filter criteria. Click below to clear."
        rowSelection={tableState.selection}
        onRowSelectionChange={tableState.onRowSelectionChange}
        sorting={tableState.sorting}
        onSortingChange={tableState.onSortingChange}
        pagination={tableState.pagination}
        onPaginationChange={tableState.onPaginationChange}
        globalFilter={tableState.globalFilter}
        onGlobalFilterChange={tableState.onGlobalFilterChange}
        columnVisibility={tableState.visibility}
        onColumnVisibilityChange={tableState.onVisibilityChange}
        columnSizing={tableState.columnSizing}
        onColumnSizingChange={tableState.onColumnSizingChange}
        pageSizeOptions={[5, 10, 20]}
        rowActions={(item) => (
          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
            <button 
              type="button"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--skyra-text-muted)', padding: '4px' }} 
              onClick={() => alert(`View Reference: ${item.reference}`)}
              aria-label={`View ${item.reference}`}
            >
              <Eye size={15} />
            </button>
            <button 
              type="button"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--skyra-text-muted)', padding: '4px' }} 
              onClick={() => alert(`Edit Reference: ${item.reference}`)}
              aria-label={`Edit ${item.reference}`}
            >
              <Edit size={15} />
            </button>
            <button 
              type="button"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--skyra-danger)', padding: '4px' }} 
              onClick={() => alert(`Delete Reference: ${item.reference}`)}
              aria-label={`Delete ${item.reference}`}
            >
              <Trash2 size={15} />
            </button>
          </div>
        )}
        bulkActions={(selected) => (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleExportSelected(selected)}
            >
              <Download size={13} style={{ marginRight: '4px' }} />
              Export Selected ({selected.length})
            </Button>
            <Button 
              variant="danger" 
              size="sm" 
              onClick={() => alert(`Simulating deletion of ${selected.length} records.`)}
            >
              Delete Selected
            </Button>
          </div>
        )}
      />
    </div>
  );
}
