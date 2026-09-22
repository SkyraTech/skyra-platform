'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search, X, SlidersHorizontal,
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Inbox,
} from 'lucide-react';

/* ─── Column Definition ─── */

export interface Column<T> {
  key: string;
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
  hideable?: boolean;
  width?: string;
}

/* ─── Props ─── */

export interface DynamicDataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  pageSize?: number;
  searchPlaceholder?: string;
  /** Label for the primary action button (top-right) */
  actionLabel?: string;
  onAction?: () => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  /** Render additional per-row action buttons */
  rowActions?: (row: T) => React.ReactNode;
  className?: string;
}

/* ─── Skeleton ─── */

function SkeletonRows({ cols }: { cols: number }) {
  const widths = ['65%', '80%', '75%', '70%', '85%', '60%', '90%', '78%'];
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i}>
          {Array.from({ length: cols }).map((__, j) => {
            const w = widths[(i * cols + j) % widths.length] ?? '70%';
            return (
              <td key={j} style={{ padding: '0.9rem 1.25rem' }}>
                <div style={{
                  height: '14px',
                  width: w,
                  borderRadius: 'var(--skyra-radius-sm)',
                  background: 'linear-gradient(90deg, var(--skyra-border) 25%, var(--skyra-bg) 50%, var(--skyra-border) 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'skyra-shimmer 1.5s infinite',
                }} />
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
}

/* ─── Main Component ─── */

/**
 * @skyra/data-table DynamicDataTable
 *
 * [B] PLATFORM EXTRACTION from skyra-erp/src/components/ui/table/DynamicDataTable.tsx
 *
 * Confirmed ERP visual behavior (Table.module.css):
 *   - Table card: border-radius var(--radius-xl) = 20px
 *   - Header: font-size 0.72rem, uppercase, letter-spacing 0.06em
 *   - Action btn: linear-gradient(135deg, var(--primary) 0%, #0847a8 100%)
 *   - Table scroll: overflow-x: auto, -webkit-overflow-scrolling: touch
 *   - Row hover: background var(--bg-color)
 *   - Shimmer animation: shimmer 1.5s infinite on skeleton rows
 *   - Col-vis panel: border radius-md, shadow-lg, z-index 100
 *
 * [C] PLATFORM ENHANCEMENTS vs ERP:
 *   - emptyIcon prop (ERP hardcodes Inbox icon)
 *   - className prop for wrapper customization
 */
export function DynamicDataTable<T extends { id: string }>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No records found.',
  emptyIcon,
  pageSize = 10,
  searchPlaceholder = 'Search...',
  actionLabel,
  onAction,
  onEdit,
  onDelete,
  onView,
  rowActions,
  className = '',
}: DynamicDataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const [hiddenCols, setHiddenCols] = useState<Set<string>>(new Set());
  const [colVisOpen, setColVisOpen] = useState(false);
  const colVisRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (colVisRef.current && !colVisRef.current.contains(e.target as Node)) {
        setColVisOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const processed = useMemo(() => {
    let rows = [...data];
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter((row) =>
        Object.values(row as Record<string, unknown>).some(
          (v) => typeof v === 'string' && v.toLowerCase().includes(q)
        )
      );
    }
    if (sortKey) {
      rows.sort((a, b) => {
        const aVal = String((a as Record<string, unknown>)[sortKey] ?? '').toLowerCase();
        const bVal = String((b as Record<string, unknown>)[sortKey] ?? '').toLowerCase();
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });
    }
    return rows;
  }, [data, search, sortKey, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(processed.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * pageSize;
  const pageRows = processed.slice(pageStart, pageStart + pageSize);
  const visibleCols = columns.filter((c) => !hiddenCols.has(c.key));
  const hasActions = !!(onEdit || onDelete || onView || rowActions);

  const handleSort = (col: Column<T>) => {
    if (!col.sortable) return;
    if (sortKey === col.key) setSortAsc((a) => !a);
    else { setSortKey(col.key); setSortAsc(true); }
    setPage(1);
  };

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };

  const toggleCol = (key: string) => {
    setHiddenCols((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const pageNumbers = (): (number | '...')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (safePage <= 4) return [1, 2, 3, 4, 5, '...', totalPages];
    if (safePage >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', safePage - 1, safePage, safePage + 1, '...', totalPages];
  };

  const s = {
    card: {
      background: 'var(--skyra-surface)',
      borderRadius: 'var(--skyra-radius-xl)',       // [CONFIRMED: Table.module.css tableCard]
      boxShadow: 'var(--skyra-shadow-sm)',
      border: '1px solid var(--skyra-border)',
      overflow: 'hidden',
    } as React.CSSProperties,
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 1.25rem',
      borderBottom: '1px solid var(--skyra-border)',
      gap: '0.75rem',
      flexWrap: 'wrap' as const,
    },
    searchWrap: {
      position: 'relative' as const,
      display: 'flex',
      alignItems: 'center',
    },
    searchInput: {
      paddingLeft: '2rem',
      paddingRight: '2rem',
      height: '36px',
      border: '1px solid var(--skyra-border)',
      borderRadius: 'var(--skyra-radius-md)',
      background: 'var(--skyra-bg)',
      fontSize: '0.8rem',
      color: 'var(--skyra-text)',
      outline: 'none',
      fontFamily: 'inherit',
      minWidth: '200px',
    },
    th: {
      padding: '0.75rem 1.25rem',
      textAlign: 'left' as const,
      fontSize: '0.72rem',                          // [CONFIRMED: Table.module.css th]
      fontWeight: 600,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.06em',                      // [CONFIRMED: Table.module.css th]
      color: 'var(--skyra-text-muted)',
      background: 'var(--skyra-bg)',
      whiteSpace: 'nowrap' as const,
    },
    td: {
      padding: '0.85rem 1.25rem',
      fontSize: '0.875rem',
      color: 'var(--skyra-text)',
      borderTop: '1px solid var(--skyra-border)',
    },
    actionBtn: {
      background: 'linear-gradient(135deg, var(--skyra-primary) 0%, #0847a8 100%)',  // [CONFIRMED]
      color: '#fff',
      border: 'none',
      borderRadius: 'var(--skyra-radius-md)',
      padding: '0.5rem 1rem',
      fontSize: '0.8125rem',
      fontWeight: 600,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.35rem',
      whiteSpace: 'nowrap' as const,
      minHeight: '36px',
    },
    iconBtn: {
      background: 'none',
      border: '1px solid var(--skyra-border)',
      borderRadius: 'var(--skyra-radius-sm)',
      width: '30px',
      height: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: 'var(--skyra-text-muted)',
      transition: 'background 0.15s, color 0.15s',
    },
    pageBtn: {
      minWidth: '32px',
      height: '32px',
      padding: '0 0.5rem',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'var(--skyra-border)',
      borderRadius: 'var(--skyra-radius-sm)',
      background: 'var(--skyra-surface)',
      fontSize: '0.8rem',
      color: 'var(--skyra-text)',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    pageBtnActive: {
      background: 'var(--skyra-primary)',
      color: '#fff',
      borderColor: 'var(--skyra-primary)',
      fontWeight: 600,
    },
  };

  return (
    <div style={{ ...s.card }} className={className}>
      <style>{`
        @keyframes skyra-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {/* ── Header ── */}
      <div style={s.header}>
        <div style={s.searchWrap}>
          <Search size={14} aria-hidden="true" style={{ position: 'absolute', left: '0.65rem', color: 'var(--skyra-text-muted)' }} />
          <input
            type="text"
            style={s.searchInput}
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            aria-label="Search table"
          />
          {search && (
            <button onClick={() => handleSearch('')} aria-label="Clear search"
              style={{ position: 'absolute', right: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--skyra-text-muted)', display: 'flex' }}>
              <X size={13} aria-hidden="true" />
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {/* Column Visibility */}
          <div ref={colVisRef} style={{ position: 'relative' }}>
            <button
              style={{ ...s.iconBtn, padding: '0 0.75rem', width: 'auto', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 500 }}
              onClick={() => setColVisOpen((o) => !o)}
              aria-label="Toggle column visibility"
              aria-expanded={colVisOpen}
            >
              <SlidersHorizontal size={13} aria-hidden="true" />
              Columns
            </button>
            {colVisOpen && (
              <div role="menu" style={{
                position: 'absolute', top: 'calc(100% + 4px)', right: 0,
                background: 'var(--skyra-surface)', border: '1px solid var(--skyra-border)',
                borderRadius: 'var(--skyra-radius-md)', boxShadow: 'var(--skyra-shadow-lg)',
                zIndex: 100, minWidth: '160px', padding: '4px',
              }}>
                {columns.filter((c) => c.hideable !== false).map((col) => (
                  <label key={col.key} role="menuitemcheckbox"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.45rem 0.75rem', cursor: 'pointer', fontSize: '0.8375rem', borderRadius: 'var(--skyra-radius-sm)' }}>
                    <input type="checkbox" checked={!hiddenCols.has(col.key)}
                      onChange={() => toggleCol(col.key)} aria-label={`Toggle ${col.header} column`} />
                    {col.header}
                  </label>
                ))}
              </div>
            )}
          </div>
          {actionLabel && onAction && (
            <button style={s.actionBtn} onClick={onAction}>
              + {actionLabel}
            </button>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '480px' }}>
          <thead>
            <tr>
              {visibleCols.map((col) => (
                <th
                  key={col.key}
                  style={{ ...s.th, width: col.width, cursor: col.sortable ? 'pointer' : 'default' }}
                  onClick={() => handleSort(col)}
                  aria-sort={sortKey === col.key ? (sortAsc ? 'ascending' : 'descending') : undefined}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    {col.header}
                    {col.sortable && sortKey === col.key && (
                      sortAsc ? <ChevronUp size={12} aria-hidden="true" /> : <ChevronDown size={12} aria-hidden="true" />
                    )}
                  </div>
                </th>
              ))}
              {hasActions && <th style={{ ...s.th, width: '100px' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <SkeletonRows cols={visibleCols.length + (hasActions ? 1 : 0)} />
            ) : pageRows.length === 0 ? (
              <tr>
                <td colSpan={visibleCols.length + (hasActions ? 1 : 0)}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 1rem', gap: '0.75rem', color: 'var(--skyra-text-muted)' }}>
                    <div style={{ opacity: 0.4 }}>{emptyIcon ?? <Inbox size={22} aria-hidden="true" />}</div>
                    <span style={{ fontSize: '0.9rem' }}>{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            ) : (
              pageRows.map((row) => (
                <tr key={row.id}
                  style={{ transition: 'background 0.15s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--skyra-bg)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '')}
                >
                  {visibleCols.map((col) => (
                    <td key={col.key} style={s.td}>
                      {typeof col.accessor === 'function'
                        ? col.accessor(row)
                        : (row[col.accessor] as React.ReactNode)}
                    </td>
                  ))}
                  {hasActions && (
                    <td style={{ ...s.td, padding: '0.6rem 1.25rem' }}>
                      <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                        {onView && (
                          <button style={s.iconBtn} onClick={() => onView(row)} aria-label="View" title="View">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          </button>
                        )}
                        {onEdit && (
                          <button style={s.iconBtn} onClick={() => onEdit(row)} aria-label="Edit" title="Edit">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </button>
                        )}
                        {onDelete && (
                          <button style={{ ...s.iconBtn, color: 'var(--skyra-danger)' }} onClick={() => onDelete(row)} aria-label="Delete" title="Delete">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                          </button>
                        )}
                        {rowActions?.(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {!isLoading && processed.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1.25rem', borderTop: '1px solid var(--skyra-border)', flexWrap: 'wrap', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--skyra-text-muted)' }}>
            Showing {pageStart + 1}–{Math.min(pageStart + pageSize, processed.length)} of {processed.length}
          </span>
          <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }} role="navigation" aria-label="Pagination">
            <button style={{ ...s.pageBtn, ...(safePage === 1 ? { opacity: 0.4, cursor: 'not-allowed' } : {}) }}
              onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1} aria-label="Previous page">
              <ChevronLeft size={13} aria-hidden="true" />
            </button>
            {pageNumbers().map((n, i) =>
              n === '...' ? (
                <span key={`e-${i}`} style={{ padding: '0 4px', color: 'var(--skyra-text-subtle)', fontSize: '0.8rem' }}>…</span>
              ) : (
                <button key={n}
                  style={{ ...s.pageBtn, ...(safePage === n ? s.pageBtnActive : {}) }}
                  onClick={() => setPage(n as number)}
                  aria-label={`Page ${n}`}
                  aria-current={safePage === n ? 'page' : undefined}
                >
                  {n}
                </button>
              )
            )}
            <button style={{ ...s.pageBtn, ...(safePage === totalPages ? { opacity: 0.4, cursor: 'not-allowed' } : {}) }}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} aria-label="Next page">
              <ChevronRight size={13} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
