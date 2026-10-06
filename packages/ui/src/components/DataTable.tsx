'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { DataTableProps } from './DataTable.types';
import '@skyra-tech-platform/data-table';
import { useDataTableState } from '../hooks/useDataTableState';

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'skyra-tech-data-table': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { class?: string };
      }
    }
  }
}

export function DataTable<TData extends { id: string | number }>(
  props: DataTableProps<TData>
) {
  const wcRef = useRef<any>(null);
  const { columns, data, className = '', features, manualPagination, totalRows, pageSizeOptions, isRowDisabled, rowActions } = props;
  
  const uncontrolledState = useDataTableState({
    initialPagination: props.pagination,
    initialSorting: props.sorting,
    initialVisibility: props.columnVisibility,
  });

  const sorting = props.sorting ?? uncontrolledState.sorting;
  const pagination = props.pagination ?? uncontrolledState.pagination;
  const visibility = props.columnVisibility ?? uncontrolledState.visibility;
  const selection = props.rowSelection ?? uncontrolledState.selection;
  const globalFilter = props.globalFilter ?? uncontrolledState.globalFilter;
  const columnFilters = props.columnFilters ?? ((uncontrolledState as any).columnFilters || []);
  const columnSizing = props.columnSizing ?? uncontrolledState.columnSizing;

  const [visibleRows, setVisibleRows] = useState<TData[]>([]);

  const webColumns = useMemo(() => {
    return columns.map(col => {
      const colId = col.id || String(col.accessor);
      return {
        ...col,
        headerSlot: `header-${colId}`,
        cellSlot: (row: any) => `cell-${row.id}-${colId}`,
      };
    });
  }, [columns]);

  useEffect(() => {
    if (!wcRef.current) return;
    const el = wcRef.current;
    
    el.features = features || {};
    el.columns = webColumns;
    el.data = data;
    el.sorting = sorting;
    el.pagination = pagination;
    el.visibility = visibility;
    el.selection = selection;
    el.globalFilter = globalFilter;
    el.columnFilters = columnFilters;
    el.columnSizing = columnSizing;
    el.manualPagination = manualPagination || false;
    el.totalRows = totalRows || 0;
    el.pageCount = props.pageCount || 0;
    el.pageSizeOptions = pageSizeOptions || [10, 20, 50, 100];
    el.isRowDisabled = isRowDisabled;
    el.isLoading = props.isLoading || false;
    el.error = !!props.error;
    el.columnSizing = columnSizing || {};
  }, [
    features, webColumns, data, sorting, pagination, visibility, selection, globalFilter,
    columnFilters, columnSizing, manualPagination, totalRows, props.pageCount, pageSizeOptions, isRowDisabled, props.isLoading, props.error
  ]);

  useEffect(() => {
    if (!wcRef.current) return;
    const el = wcRef.current;

    const onDataChange = (e: any) => setVisibleRows(e.detail.rows);
    const onSortChange = (e: any) => {
      if (props.onSortingChange) props.onSortingChange(e.detail);
      else uncontrolledState.onSortingChange(e.detail);
    };
    const onPagChange = (e: any) => {
      if (props.onPaginationChange) props.onPaginationChange(e.detail);
      else uncontrolledState.onPaginationChange(e.detail);
    };
    const onVisChange = (e: any) => {
      if (props.onColumnVisibilityChange) props.onColumnVisibilityChange(e.detail);
      else uncontrolledState.onVisibilityChange(e.detail);
    };
    const onSelChange = (e: any) => {
      if (props.onRowSelectionChange) props.onRowSelectionChange(e.detail);
      else uncontrolledState.onRowSelectionChange(e.detail);
    };
    const onGlobalFilterChange = (e: any) => {
      if (props.onGlobalFilterChange) props.onGlobalFilterChange(e.detail);
      else uncontrolledState.onGlobalFilterChange(e.detail);
    };
    const onRowClick = (e: any) => {
      if (props.onRowClick) props.onRowClick(e.detail);
    };
    const onColSizingChange = (e: any) => {
      if (props.onColumnSizingChange) props.onColumnSizingChange(e.detail);
      else if (uncontrolledState.onColumnSizingChange) uncontrolledState.onColumnSizingChange(e.detail);
    };

    el.addEventListener('skyra-page-data-change', onDataChange);
    el.addEventListener('skyra-sorting-change', onSortChange);
    el.addEventListener('skyra-pagination-change', onPagChange);
    el.addEventListener('skyra-visibility-change', onVisChange);
    el.addEventListener('skyra-selection-change', onSelChange);
    el.addEventListener('skyra-global-filter-change', onGlobalFilterChange);
    el.addEventListener('skyra-row-click', onRowClick);
    el.addEventListener('skyra-column-sizing-change', onColSizingChange);

    // Initial hydration
    if (el.getCurrentPageRows) {
      setVisibleRows(el.getCurrentPageRows());
    }

    return () => {
      el.removeEventListener('skyra-page-data-change', onDataChange);
      el.removeEventListener('skyra-sorting-change', onSortChange);
      el.removeEventListener('skyra-pagination-change', onPagChange);
      el.removeEventListener('skyra-visibility-change', onVisChange);
      el.removeEventListener('skyra-selection-change', onSelChange);
      el.removeEventListener('skyra-global-filter-change', onGlobalFilterChange);
      el.removeEventListener('skyra-row-click', onRowClick);
      el.removeEventListener('skyra-column-sizing-change', onColSizingChange);
    };
  }, [props, uncontrolledState]);

  return (
    <skyra-tech-data-table ref={wcRef} class={className}>
      {/* State Slots */}
      {props.error && (
        <div slot="empty-state" style={{ display: 'contents' }}>
          <div>Failed to load table data</div>
          {props.onErrorRetry && <button onClick={props.onErrorRetry}>Retry</button>}
        </div>
      )}
      {!props.error && visibleRows.length === 0 && !props.isLoading && (
        <div slot="empty-state" style={{ display: 'contents' }}>
          {globalFilter || (columnFilters && columnFilters.length > 0)
            ? (
                <div>
                  <p>{props.noResultsMessage || 'Zero records found matching query.'}</p>
                  <button onClick={() => {
                    if (props.onGlobalFilterChange) props.onGlobalFilterChange('');
                    else uncontrolledState.onGlobalFilterChange('');
                    if (props.onColumnFiltersChange) props.onColumnFiltersChange([]);
                    else if (uncontrolledState.onColumnFiltersChange) uncontrolledState.onColumnFiltersChange([]);
                  }}>Clear filters and search</button>
                </div>
              )
            : (props.emptyMessage || 'No records found.')}
        </div>
      )}

      {/* Bulk Actions Slot */}
      {props.bulkActions && Object.keys(selection || {}).length > 0 && (
        <div slot="bulk-actions" style={{ display: 'contents' }}>
          {props.bulkActions(
            Object.keys(selection || {}).map(id => visibleRows.find(r => String(r.id) === id) || data.find(r => String(r.id) === id)).filter(Boolean) as TData[]
          )}
        </div>
      )}

      {/* Header Slots */}
      {columns.map(col => {
        const colId = col.id || String(col.accessor);
        if (visibility?.[colId] === true) return null;
        const sortState = sorting?.find(s => s.id === colId);
        const isSortable = !!features?.sorting && col.sortable !== false;
        const ariaSort = isSortable ? (sortState ? (sortState.desc ? 'descending' : 'ascending') : 'none') : undefined;
        return (
          <div 
            key={`header-${colId}`} 
            slot={`header-${colId}`} 
            role="columnheader" 
            aria-sort={ariaSort}
            style={{ display: 'contents' }}
          >
            {col.header}
          </div>
        );
      })}
      
      {/* Cell Slots for visible rows */}
      {visibleRows.map(row => 
        webColumns.map(col => {
          const colId = col.id || String(col.accessor);
          if (visibility?.[colId] === true) return null;
          const rawValue = typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor as keyof TData];
          return (
            <div key={`cell-${row.id}-${colId}`} slot={col.cellSlot(row)} role="cell" style={{ display: 'contents' }}>
              {col.cell ? col.cell({ row, value: rawValue }) : String(rawValue ?? '-')}
            </div>
          );
        })
      )}

      {/* Row Action Slots */}
      {rowActions && visibleRows.map(row => (
        <div key={`row-action-${row.id}`} slot={`row-actions-${row.id}`} style={{ display: 'contents' }}>
          {rowActions(row)}
        </div>
      ))}
    </skyra-tech-data-table>
  );
}
