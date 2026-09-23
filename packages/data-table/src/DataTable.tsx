'use client';

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  Search, X, SlidersHorizontal,
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Inbox, FilterX
} from 'lucide-react';
import { 
  DataTableProps, 
  ColumnDef, 
  SortingState, 
  PaginationState,
  VisibilityState,
  RowSelectionState,
  ColumnSizingState
} from './types';
import { useDataTableState } from './useDataTableState';
import { processTableData } from './processTableData';

/* ─── Skeleton Loading ─── */
function SkeletonRows({ cols }: { cols: number }) {
  const widths = ['65%', '80%', '75%', '70%', '85%', '60%', '90%', '78%'];
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={`skeleton-${i}`}>
          {Array.from({ length: cols }).map((__, j) => {
            const w = widths[(i * cols + j) % widths.length] ?? '70%';
            return (
              <td key={`cell-${j}`} style={{ padding: '0.9rem 1.25rem' }}>
                <div 
                  className="skyra-skeleton-bar"
                  style={{
                    height: '14px',
                    width: w,
                    borderRadius: 'var(--skyra-radius-sm, 4px)',
                    background: 'linear-gradient(90deg, var(--skyra-border) 25%, var(--skyra-bg) 50%, var(--skyra-border) 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'skyra-shimmer 1.5s infinite',
                  }} 
                />
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
}

const DEFAULT_FEATURES = {
  sorting: true,
  filtering: true,
  globalSearch: true,
  pagination: true,
  rowSelection: false,
  columnVisibility: true,
  columnResizing: false,
  stickyHeader: false,
  rowActions: true,
  bulkActions: false,
};

export function DataTable<TData extends { id: string | number }>(props: DataTableProps<TData>) {
  const {
    columns,
    data,
    features = DEFAULT_FEATURES,
    isLoading = false,
    emptyMessage = 'No records found.',
    emptyIcon,
    noResultsMessage = 'No matching records found. Try adjusting your search or filters.',
    error,
    onErrorRetry,
    className = '',
    manualPagination = false,
    pageSizeOptions = [10, 20, 50, 100],
    isRowDisabled,
    onProcessedDataChange,
  } = props;

  const mergedFeatures = useMemo(() => ({ ...DEFAULT_FEATURES, ...features }), [features]);

  // Uncontrolled state fallback
  const uncontrolledState = useDataTableState({
    initialPagination: { pageIndex: 0, pageSize: 10 }
  });

  // State bindings (controlled with uncontrolled fallback)
  const sorting = props.sorting ?? uncontrolledState.sorting;
  const onSortingChange = props.onSortingChange ?? uncontrolledState.onSortingChange;

  const pagination = props.pagination ?? uncontrolledState.pagination;
  const onPaginationChange = props.onPaginationChange ?? uncontrolledState.onPaginationChange;

  const globalFilter = props.globalFilter ?? uncontrolledState.globalFilter;
  const onGlobalFilterChange = props.onGlobalFilterChange ?? uncontrolledState.onGlobalFilterChange;

  const columnFilters = props.columnFilters ?? uncontrolledState.columnFilters;
  const onColumnFiltersChange = props.onColumnFiltersChange ?? uncontrolledState.onColumnFiltersChange;

  const columnVisibility = props.columnVisibility ?? uncontrolledState.visibility;
  const onColumnVisibilityChange = props.onColumnVisibilityChange ?? uncontrolledState.onVisibilityChange;

  const rowSelection = props.rowSelection ?? uncontrolledState.selection;
  const onRowSelectionChange = props.onRowSelectionChange ?? uncontrolledState.onRowSelectionChange;

  const columnSizing = props.columnSizing ?? uncontrolledState.columnSizing;
  const onColumnSizingChange = props.onColumnSizingChange ?? uncontrolledState.onColumnSizingChange;

  // Resizing state
  const [resizingColId, setResizingColId] = useState<string | null>(null);
  const resizeInfoRef = useRef<{
    colId: string;
    startX: number;
    startWidth: number;
    minWidth: number;
    maxWidth: number;
  } | null>(null);

  // Column visibility dropdown
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

  // Filter out hidden columns
  const visibleCols = useMemo(() => {
    return columns.filter((c) => {
      const colId = c.id || (c.accessor as string);
      return !columnVisibility[colId];
    });
  }, [columns, columnVisibility]);

  // Client-side data processing via pure utility
  const processedData = useMemo(() => {
    if (manualPagination) {
      // In server-side pagination, the consumer provides the already-paged/filtered data
      return data;
    }

    return processTableData(data, {
      columns,
      globalFilter: mergedFeatures.globalSearch ? globalFilter : undefined,
      columnFilters: mergedFeatures.filtering ? columnFilters : undefined,
      sorting: mergedFeatures.sorting ? sorting : undefined,
    });
  }, [data, columns, globalFilter, columnFilters, sorting, mergedFeatures, manualPagination]);

  // Optional observation callback for consumers
  useEffect(() => {
    onProcessedDataChange?.(processedData);
  }, [processedData, onProcessedDataChange]);

  // Pagination calculation
  const totalItems = manualPagination
    ? (props.totalRows !== undefined ? props.totalRows : data.length)
    : processedData.length;

  const totalPages = manualPagination && props.pageCount !== undefined
    ? props.pageCount
    : Math.max(1, Math.ceil(totalItems / pagination.pageSize));

  const safePage = Math.min(pagination.pageIndex, Math.max(0, totalPages - 1));
  const pageStart = safePage * pagination.pageSize;

  const pageRows = (mergedFeatures.pagination && !manualPagination)
    ? processedData.slice(pageStart, pageStart + pagination.pageSize)
    : (manualPagination ? data : processedData);

  // Sorting handler
  const handleSort = (colId: string, colSortable?: boolean) => {
    if (!mergedFeatures.sorting || colSortable === false) return;

    const existing = sorting.find((s) => s.id === colId);
    let newSorting: SortingState[];
    if (existing) {
      if (existing.desc) {
        newSorting = sorting.filter((s) => s.id !== colId); // unsort
      } else {
        newSorting = sorting.map((s) => (s.id === colId ? { ...s, desc: true } : s));
      }
    } else {
      newSorting = [{ id: colId, desc: false }];
    }

    onSortingChange(newSorting);

    if (mergedFeatures.pagination && !manualPagination) {
      onPaginationChange({ ...pagination, pageIndex: 0 });
    }
  };

  // Column visibility toggle
  const toggleCol = (colId: string) => {
    onColumnVisibilityChange({
      ...columnVisibility,
      [colId]: !columnVisibility[colId],
    });
  };

  // Row selection helpers
  const enabledPageRows = useMemo(() => {
    return pageRows.filter((row) => !(isRowDisabled?.(row) ?? false));
  }, [pageRows, isRowDisabled]);

  const selectedCount = Object.values(rowSelection).filter(Boolean).length;
  const isAllSelected = enabledPageRows.length > 0 && enabledPageRows.every((r) => rowSelection[r.id]);
  const isIndeterminate = enabledPageRows.some((r) => rowSelection[r.id]) && !isAllSelected;

  const handleSelectAll = (checked: boolean) => {
    const newSelection = { ...rowSelection };
    if (checked) {
      enabledPageRows.forEach((row) => {
        newSelection[row.id] = true;
      });
    } else {
      enabledPageRows.forEach((row) => {
        delete newSelection[row.id];
      });
    }
    onRowSelectionChange(newSelection);
  };

  const handleSelectRow = (rowId: string, checked: boolean) => {
    const newSelection = { ...rowSelection };
    if (checked) {
      newSelection[rowId] = true;
    } else {
      delete newSelection[rowId];
    }
    onRowSelectionChange(newSelection);
  };

  // Column Resizing Handlers
  const handleResizeStart = (colId: string, e: React.PointerEvent<HTMLDivElement>, minW?: number, maxW?: number) => {
    e.preventDefault();
    e.stopPropagation();

    const thElement = e.currentTarget.parentElement as HTMLElement;
    const currentWidth = columnSizing[colId] || (thElement ? thElement.getBoundingClientRect().width : 120);

    const minWidth = minW ?? 60;
    const maxWidth = maxW ?? 1000;

    resizeInfoRef.current = {
      colId,
      startX: e.clientX,
      startWidth: currentWidth,
      minWidth,
      maxWidth,
    };

    setResizingColId(colId);

    const onPointerMove = (moveEvent: PointerEvent) => {
      if (!resizeInfoRef.current) return;
      const { colId: activeColId, startX, startWidth, minWidth: min, maxWidth: max } = resizeInfoRef.current;
      const diff = moveEvent.clientX - startX;
      const newWidth = Math.min(Math.max(startWidth + diff, min), max);

      onColumnSizingChange({
        ...columnSizing,
        [activeColId]: Math.round(newWidth),
      });
    };

    const onPointerUp = () => {
      resizeInfoRef.current = null;
      setResizingColId(null);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  const handleResizeKeyDown = (colId: string, e: React.KeyboardEvent<HTMLDivElement>, minW?: number, maxW?: number) => {
    const minWidth = minW ?? 60;
    const maxWidth = maxW ?? 1000;
    const currentWidth = columnSizing[colId] || 120;

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const newWidth = Math.max(currentWidth - 10, minWidth);
      onColumnSizingChange({ ...columnSizing, [colId]: newWidth });
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const newWidth = Math.min(currentWidth + 10, maxWidth);
      onColumnSizingChange({ ...columnSizing, [colId]: newWidth });
    }
  };

  // Pagination page numbers generator
  const pageNumbers = (): (number | '...')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i);
    if (safePage <= 3) return [0, 1, 2, 3, 4, '...', totalPages - 1];
    if (safePage >= totalPages - 4) return [0, '...', totalPages - 5, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1];
    return [0, '...', safePage - 1, safePage, safePage + 1, '...', totalPages - 1];
  };

  // Reset filters helper
  const handleClearFilters = () => {
    onGlobalFilterChange('');
    onColumnFiltersChange([]);
    if (mergedFeatures.pagination && !manualPagination) {
      onPaginationChange({ ...pagination, pageIndex: 0 });
    }
  };

  // Check whether toolbar is needed
  const hasActiveFiltersOrSearch = Boolean(globalFilter.trim() || columnFilters.length > 0);
  const showBulkActions = mergedFeatures.bulkActions && selectedCount > 0;
  const showToolbar = mergedFeatures.globalSearch || mergedFeatures.columnVisibility || showBulkActions;

  // Selected items array for bulk actions
  const selectedRowsArray = useMemo(() => {
    return data.filter((d) => Boolean(rowSelection[d.id]));
  }, [data, rowSelection]);

  const s = {
    card: {
      background: 'var(--skyra-surface)',
      borderRadius: 'var(--skyra-radius-xl)',
      boxShadow: 'var(--skyra-shadow-sm)',
      border: '1px solid var(--skyra-border)',
      overflow: 'hidden',
    } as React.CSSProperties,
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.875rem 1.25rem',
      borderBottom: '1px solid var(--skyra-border)',
      gap: '0.75rem',
      flexWrap: 'wrap' as const,
    },
    searchWrap: {
      position: 'relative' as const,
      display: 'flex',
      alignItems: 'center',
      flex: '1 1 240px',
      maxWidth: '360px',
    },
    searchInput: {
      paddingLeft: '2.25rem',
      paddingRight: '2rem',
      height: '38px',
      width: '100%',
      border: '1px solid var(--skyra-border)',
      borderRadius: 'var(--skyra-radius-md)',
      background: 'var(--skyra-bg)',
      fontSize: '0.875rem',
      color: 'var(--skyra-text)',
      outline: 'none',
      fontFamily: 'inherit',
    },
    th: {
      padding: '0.75rem 1.25rem',
      textAlign: 'left' as const,
      fontSize: '0.75rem',
      fontWeight: 600,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em',
      color: 'var(--skyra-text-muted)',
      background: 'var(--skyra-bg)',
      whiteSpace: 'nowrap' as const,
      position: mergedFeatures.stickyHeader ? ('sticky' as const) : ('relative' as const),
      top: 0,
      zIndex: mergedFeatures.stickyHeader ? 10 : 1,
      userSelect: resizingColId ? ('none' as const) : ('auto' as const),
    },
    td: {
      padding: '0.85rem 1.25rem',
      fontSize: '0.875rem',
      color: 'var(--skyra-text)',
      borderTop: '1px solid var(--skyra-border)',
    },
    iconBtn: {
      background: 'none',
      border: '1px solid var(--skyra-border)',
      borderRadius: 'var(--skyra-radius-sm)',
      minWidth: '36px',
      minHeight: '36px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: 'var(--skyra-text-muted)',
      transition: 'background 0.15s, color 0.15s',
    },
    pageBtn: {
      minWidth: '36px',
      minHeight: '36px',
      padding: '0 0.65rem',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'var(--skyra-border)',
      borderRadius: 'var(--skyra-radius-sm)',
      background: 'var(--skyra-surface)',
      fontSize: '0.8125rem',
      color: 'var(--skyra-text)',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    pageBtnActive: {
      background: 'var(--skyra-primary)',
      color: 'var(--skyra-primary-foreground, #ffffff)',
      borderColor: 'var(--skyra-primary)',
      fontWeight: 600,
    },
  };

  return (
    <div style={s.card} className={`skyra-data-table ${className}`.trim()}>
      <style>{`
        @keyframes skyra-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .skyra-skeleton-bar {
            animation: none !important;
            background: var(--skyra-border) !important;
          }
          .skyra-data-table tr {
            transition: none !important;
          }
        }
        .skyra-resizer:hover .skyra-resizer-line,
        .skyra-resizer:focus-visible .skyra-resizer-line {
          background-color: var(--skyra-primary);
          opacity: 1;
        }
        .skyra-th-sortable:focus-visible {
          outline: 2px solid var(--skyra-primary);
          outline-offset: -2px;
        }
        .skyra-resizer:focus-visible {
          outline: 2px solid var(--skyra-primary);
          outline-offset: 1px;
        }
      `}</style>

      {/* ── Toolbar ── */}
      {showToolbar && (
        <div style={s.header}>
          {showBulkActions ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--skyra-primary)' }}>
                {selectedCount} row{selectedCount !== 1 ? 's' : ''} selected
              </span>
              <button 
                style={s.iconBtn} 
                onClick={() => onRowSelectionChange({})} 
                aria-label="Clear selection"
              >
                <X size={14} />
              </button>
              <div style={{ flex: 1 }} />
              {props.bulkActions?.(selectedRowsArray)}
            </div>
          ) : (
            <>
              {mergedFeatures.globalSearch && (
                <div style={s.searchWrap}>
                  <Search 
                    size={15} 
                    aria-hidden="true" 
                    style={{ position: 'absolute', left: '0.75rem', color: 'var(--skyra-text-muted)' }} 
                  />
                  <input
                    type="text"
                    style={s.searchInput}
                    placeholder="Search table..."
                    value={globalFilter}
                    onChange={(e) => {
                      onGlobalFilterChange(e.target.value);
                      if (mergedFeatures.pagination && !manualPagination) {
                        onPaginationChange({ ...pagination, pageIndex: 0 });
                      }
                    }}
                    aria-label="Search table"
                  />
                  {globalFilter && (
                    <button 
                      onClick={() => {
                        onGlobalFilterChange('');
                        if (mergedFeatures.pagination && !manualPagination) {
                          onPaginationChange({ ...pagination, pageIndex: 0 });
                        }
                      }} 
                      aria-label="Clear search"
                      style={{ 
                        position: 'absolute', 
                        right: '0.65rem', 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer', 
                        color: 'var(--skyra-text-muted)', 
                        display: 'flex',
                        padding: '4px'
                      }}
                    >
                      <X size={14} aria-hidden="true" />
                    </button>
                  )}
                </div>
              )}

              {mergedFeatures.columnVisibility && (
                <div style={{ marginLeft: mergedFeatures.globalSearch ? 'auto' : 0 }}>
                  <div ref={colVisRef} style={{ position: 'relative' }}>
                    <button
                      style={{ 
                        ...s.iconBtn, 
                        padding: '0 0.85rem', 
                        width: 'auto', 
                        gap: '0.45rem', 
                        fontSize: '0.8125rem', 
                        fontWeight: 500,
                        color: 'var(--skyra-text)'
                      }}
                      onClick={() => setColVisOpen((o) => !o)}
                      aria-label="Toggle column visibility"
                      aria-expanded={colVisOpen}
                    >
                      <SlidersHorizontal size={14} aria-hidden="true" />
                      Columns
                    </button>
                    {colVisOpen && (
                      <div 
                        role="menu" 
                        aria-label="Columns visibility"
                        style={{
                          position: 'absolute', 
                          top: 'calc(100% + 6px)', 
                          right: 0,
                          background: 'var(--skyra-surface)', 
                          border: '1px solid var(--skyra-border)',
                          borderRadius: 'var(--skyra-radius-md)', 
                          boxShadow: 'var(--skyra-shadow-lg)',
                          zIndex: 100, 
                          minWidth: '180px', 
                          padding: '6px',
                        }}
                      >
                        {columns.filter((c) => c.hideable !== false).map((col) => {
                          const colId = col.id || (col.accessor as string);
                          return (
                            <label 
                              key={colId} 
                              role="menuitemcheckbox"
                              aria-checked={!columnVisibility[colId]}
                              style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.6rem', 
                                padding: '0.5rem 0.75rem', 
                                cursor: 'pointer', 
                                fontSize: '0.8125rem', 
                                borderRadius: 'var(--skyra-radius-sm)',
                                color: 'var(--skyra-text)',
                              }}
                            >
                              <input 
                                type="checkbox" 
                                checked={!columnVisibility[colId]}
                                onChange={() => toggleCol(colId)} 
                                aria-label={`Toggle ${col.header} column`} 
                                style={{ cursor: 'pointer' }}
                              />
                              {col.header}
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── Table Container ── */}
      <div 
        style={{ 
          overflowX: 'auto', 
          WebkitOverflowScrolling: 'touch', 
          maxHeight: mergedFeatures.stickyHeader ? '600px' : 'none' 
        }}
      >
        <table 
          style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            minWidth: '500px',
            tableLayout: (mergedFeatures.columnResizing || Object.keys(columnSizing).length > 0) ? 'fixed' : 'auto' 
          }}
        >
          <thead>
            <tr>
              {mergedFeatures.rowSelection && (
                <th 
                  scope="col" 
                  style={{ ...s.th, width: '48px', minWidth: '48px', maxWidth: '48px', textAlign: 'center' }}
                >
                  <input 
                    type="checkbox" 
                    aria-label="Select all rows"
                    checked={isAllSelected}
                    ref={(input) => {
                      if (input) {
                        input.indeterminate = isIndeterminate;
                      }
                    }}
                    aria-checked={isIndeterminate ? 'mixed' : isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    disabled={enabledPageRows.length === 0}
                    style={{ width: '16px', height: '16px', cursor: enabledPageRows.length === 0 ? 'not-allowed' : 'pointer' }}
                  />
                </th>
              )}

              {visibleCols.map((col) => {
                const colId = col.id || (col.accessor as string);
                const isSortable = mergedFeatures.sorting && col.sortable !== false;
                const isResizable = mergedFeatures.columnResizing && col.resizable !== false;
                const sortState = sorting.find((s) => s.id === colId);
                const customWidth = columnSizing[colId] || col.width;
                const numericWidth = typeof customWidth === 'number' ? customWidth : (col.minWidth ?? 120);

                return (
                  <th
                    key={colId}
                    scope="col"
                    className={isSortable ? 'skyra-th-sortable' : ''}
                    tabIndex={isSortable ? 0 : undefined}
                    onKeyDown={(e) => {
                      if (isSortable && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        handleSort(colId, col.sortable);
                      }
                    }}
                    style={{ 
                      ...s.th, 
                      width: customWidth, 
                      minWidth: col.minWidth ?? 60,
                      maxWidth: col.maxWidth,
                      textAlign: col.align || 'left',
                      cursor: isSortable ? 'pointer' : 'default',
                      position: 'relative',
                    }}
                    onClick={() => handleSort(colId, col.sortable)}
                    aria-sort={sortState ? (sortState.desc ? 'descending' : 'ascending') : (isSortable ? 'none' : undefined)}
                  >
                    <div 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.35rem', 
                        justifyContent: col.align === 'right' ? 'flex-end' : (col.align === 'center' ? 'center' : 'flex-start'),
                        paddingRight: isResizable ? '10px' : 0,
                      }}
                    >
                      {col.header}
                      {isSortable && (
                        <span 
                          style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            color: sortState ? 'var(--skyra-primary)' : 'var(--skyra-text-subtle)' 
                          }}
                        >
                          {sortState ? (
                            sortState.desc ? <ChevronDown size={13} aria-hidden="true" /> : <ChevronUp size={13} aria-hidden="true" />
                          ) : (
                            <div style={{ width: 13, height: 13 }} />
                          )}
                        </span>
                      )}
                    </div>

                    {/* ── Native Column Resizer Handle ── */}
                    {isResizable && (
                      <div
                        role="separator"
                        aria-orientation="vertical"
                        aria-label={`Resize column ${col.header}`}
                        aria-valuenow={numericWidth}
                        aria-valuemin={col.minWidth ?? 60}
                        aria-valuemax={col.maxWidth ?? 1000}
                        tabIndex={0}
                        className="skyra-resizer"
                        onClick={(e) => e.stopPropagation()}
                        onPointerDown={(e) => handleResizeStart(colId, e, col.minWidth, col.maxWidth)}
                        onKeyDown={(e) => handleResizeKeyDown(colId, e, col.minWidth, col.maxWidth)}
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          bottom: 0,
                          width: '12px',
                          cursor: 'col-resize',
                          touchAction: 'none',
                          userSelect: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 2,
                        }}
                      >
                        <div 
                          className="skyra-resizer-line"
                          style={{
                            width: '2px',
                            height: '60%',
                            backgroundColor: resizingColId === colId ? 'var(--skyra-primary)' : 'var(--skyra-border)',
                            opacity: resizingColId === colId ? 1 : 0.6,
                            borderRadius: '1px',
                            transition: 'background-color 0.15s, opacity 0.15s',
                          }} 
                        />
                      </div>
                    )}
                  </th>
                );
              })}

              {mergedFeatures.rowActions && props.rowActions && (
                <th scope="col" style={{ ...s.th, width: '90px', minWidth: '90px', textAlign: 'right' }}>
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <SkeletonRows 
                cols={visibleCols.length + (mergedFeatures.rowActions && props.rowActions ? 1 : 0) + (mergedFeatures.rowSelection ? 1 : 0)} 
              />
            ) : error ? (
              <tr>
                <td 
                  colSpan={visibleCols.length + (mergedFeatures.rowActions && props.rowActions ? 1 : 0) + (mergedFeatures.rowSelection ? 1 : 0)}
                >
                  <div 
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      padding: '3.5rem 1rem', 
                      gap: '0.85rem', 
                      color: 'var(--skyra-danger)' 
                    }}
                  >
                    <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                      {error.message || 'An error occurred while loading data.'}
                    </span>
                    {onErrorRetry && (
                      <button 
                        onClick={onErrorRetry} 
                        style={{ 
                          ...s.iconBtn, 
                          width: 'auto', 
                          padding: '0.5rem 1.25rem', 
                          color: 'var(--skyra-text)',
                          fontWeight: 500,
                          fontSize: '0.85rem',
                        }}
                      >
                        Retry
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : pageRows.length === 0 ? (
              <tr>
                <td 
                  colSpan={visibleCols.length + (mergedFeatures.rowActions && props.rowActions ? 1 : 0) + (mergedFeatures.rowSelection ? 1 : 0)}
                >
                  <div 
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      padding: '3.5rem 1rem', 
                      gap: '0.85rem', 
                      color: 'var(--skyra-text-muted)' 
                    }}
                  >
                    <div style={{ opacity: 0.5 }}>
                      {data.length > 0 && hasActiveFiltersOrSearch ? (
                        <FilterX size={26} aria-hidden="true" />
                      ) : (
                        emptyIcon ?? <Inbox size={26} aria-hidden="true" />
                      )}
                    </div>
                    <span style={{ fontSize: '0.9rem', maxWidth: '400px', textAlign: 'center' }}>
                      {data.length > 0 && hasActiveFiltersOrSearch
                        ? noResultsMessage
                        : emptyMessage}
                    </span>
                    {data.length > 0 && hasActiveFiltersOrSearch && (
                      <button
                        onClick={handleClearFilters}
                        style={{
                          ...s.iconBtn,
                          width: 'auto',
                          padding: '0.45rem 1rem',
                          color: 'var(--skyra-primary)',
                          borderColor: 'var(--skyra-border)',
                          fontSize: '0.8125rem',
                          fontWeight: 500,
                          marginTop: '0.25rem',
                        }}
                      >
                        Clear filters and search
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              pageRows.map((row) => {
                const isSelected = Boolean(rowSelection[row.id]);
                const disabled = Boolean(isRowDisabled?.(row));

                return (
                  <tr 
                    key={row.id}
                    style={{ 
                      transition: 'background-color 0.15s ease', 
                      backgroundColor: isSelected 
                        ? 'var(--skyra-primary-light, rgba(59, 130, 246, 0.08))' 
                        : 'transparent',
                      opacity: disabled ? 0.6 : 1,
                      cursor: disabled ? 'not-allowed' : (props.onRowClick ? 'pointer' : 'default'),
                    }}
                    onMouseEnter={(e) => { 
                      if (!isSelected && !disabled) {
                        e.currentTarget.style.backgroundColor = 'var(--skyra-bg)';
                      }
                    }}
                    onMouseLeave={(e) => { 
                      if (!isSelected && !disabled) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                    onClick={() => {
                      if (!disabled) {
                        props.onRowClick?.(row);
                      }
                    }}
                  >
                    {mergedFeatures.rowSelection && (
                      <td 
                        style={{ ...s.td, textAlign: 'center', width: '48px', minWidth: '48px', maxWidth: '48px' }} 
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input 
                          type="checkbox" 
                          aria-label={`Select row ${row.id}`}
                          checked={isSelected}
                          disabled={disabled}
                          onChange={(e) => handleSelectRow(String(row.id), e.target.checked)}
                          style={{ 
                            width: '16px', 
                            height: '16px', 
                            cursor: disabled ? 'not-allowed' : 'pointer' 
                          }}
                        />
                      </td>
                    )}

                    {visibleCols.map((col) => {
                      const colId = col.id || (col.accessor as string);
                      const rawValue = typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor as keyof TData];
                      const customWidth = columnSizing[colId] || col.width;

                      return (
                        <td 
                          key={colId} 
                          style={{ 
                            ...s.td, 
                            textAlign: col.align || 'left',
                            width: customWidth,
                            minWidth: col.minWidth ?? 60,
                            maxWidth: col.maxWidth,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }} 
                          className={col.className}
                        >
                          {col.cell 
                            ? col.cell({ row, value: rawValue })
                            : (rawValue !== undefined && rawValue !== null ? String(rawValue) : '—')}
                        </td>
                      );
                    })}

                    {mergedFeatures.rowActions && props.rowActions && (
                      <td 
                        style={{ ...s.td, padding: '0.6rem 1.25rem', textAlign: 'right', width: '90px' }} 
                        onClick={(e) => e.stopPropagation()}
                      >
                        {props.rowActions(row)}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination Bar ── */}
      {mergedFeatures.pagination && !isLoading && !error && (manualPagination ? totalItems > 0 : processedData.length > 0) && (
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '0.875rem 1.25rem', 
            borderTop: '1px solid var(--skyra-border)', 
            flexWrap: 'wrap', 
            gap: '0.85rem' 
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--skyra-text-muted)' }}>
              Showing {totalItems > 0 ? pageStart + 1 : 0}–{Math.min(pageStart + pagination.pageSize, totalItems)} of {totalItems}
            </span>

            {/* Page Size Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <label 
                htmlFor="skyra-table-pagesize"
                style={{ fontSize: '0.8125rem', color: 'var(--skyra-text-muted)' }}
              >
                Rows:
              </label>
              <select
                id="skyra-table-pagesize"
                aria-label="Rows per page"
                value={pagination.pageSize}
                onChange={(e) => {
                  const newSize = Number(e.target.value);
                  onPaginationChange({ pageIndex: 0, pageSize: newSize });
                }}
                style={{
                  background: 'var(--skyra-bg)',
                  border: '1px solid var(--skyra-border)',
                  borderRadius: 'var(--skyra-radius-sm)',
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.8125rem',
                  color: 'var(--skyra-text)',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                {pageSizeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <nav style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }} aria-label="Pagination Navigation">
            <button 
              style={{ ...s.pageBtn, ...(safePage === 0 ? { opacity: 0.4, cursor: 'not-allowed' } : {}) }}
              onClick={() => onPaginationChange({ ...pagination, pageIndex: Math.max(0, pagination.pageIndex - 1) })} 
              disabled={safePage === 0} 
              aria-label="Previous page"
            >
              <ChevronLeft size={14} aria-hidden="true" />
            </button>

            {pageNumbers().map((n, i) =>
              n === '...' ? (
                <span key={`ellipsis-${i}`} style={{ padding: '0 6px', color: 'var(--skyra-text-subtle)', fontSize: '0.8125rem' }}>
                  …
                </span>
              ) : (
                <button 
                  key={n}
                  style={{ ...s.pageBtn, ...(safePage === n ? s.pageBtnActive : {}) }}
                  onClick={() => onPaginationChange({ ...pagination, pageIndex: n as number })}
                  aria-label={`Page ${(n as number) + 1}`}
                  aria-current={safePage === n ? 'page' : undefined}
                >
                  {(n as number) + 1}
                </button>
              )
            )}

            <button 
              style={{ ...s.pageBtn, ...(safePage === totalPages - 1 ? { opacity: 0.4, cursor: 'not-allowed' } : {}) }}
              onClick={() => onPaginationChange({ ...pagination, pageIndex: Math.min(totalPages - 1, pagination.pageIndex + 1) })} 
              disabled={safePage === totalPages - 1} 
              aria-label="Next page"
            >
              <ChevronRight size={14} aria-hidden="true" />
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
