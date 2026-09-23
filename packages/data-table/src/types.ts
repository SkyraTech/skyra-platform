import React from 'react';

/**
 * Global feature configuration.
 * Controls which table capabilities are enabled.
 */
export interface DataTableFeatures {
  sorting?: boolean;
  filtering?: boolean;
  globalSearch?: boolean;
  pagination?: boolean;
  rowSelection?: boolean;
  columnVisibility?: boolean;
  columnResizing?: boolean;
  stickyHeader?: boolean;
  rowActions?: boolean;
  bulkActions?: boolean;
}

/**
 * Column definition.
 */
export interface ColumnDef<TData, TValue = unknown> {
  id?: string;
  header: React.ReactNode;
  accessor: keyof TData | ((row: TData) => TValue);
  cell?: (props: { row: TData; value: TValue }) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  hideable?: boolean;
  resizable?: boolean;
  width?: string | number;
  minWidth?: number;
  maxWidth?: number;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

/**
 * Sorting State
 */
export type SortDirection = 'asc' | 'desc';
export interface SortingState {
  id: string;
  desc: boolean;
}

/**
 * Pagination State
 */
export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

/**
 * Visibility State (Key = Column ID, Value = isHidden)
 */
export type VisibilityState = Record<string, boolean>;

/**
 * Filter State
 */
export interface ColumnFilter {
  id: string;
  value: unknown;
}
export type ColumnFiltersState = ColumnFilter[];

/**
 * Selection State (Key = Row ID, Value = isSelected)
 */
export type RowSelectionState = Record<string, boolean>;

/**
 * Column Sizing State (Key = Column ID, Value = width in px)
 */
export type ColumnSizingState = Record<string, number>;

/**
 * Core DataTable Props
 */
export interface DataTableProps<TData extends { id: string | number }> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  features?: DataTableFeatures;

  // -- States (Controlled) --
  sorting?: SortingState[];
  onSortingChange?: (sorting: SortingState[]) => void;
  
  pagination?: PaginationState;
  onPaginationChange?: (pagination: PaginationState) => void;
  pageCount?: number;
  totalRows?: number;
  manualPagination?: boolean;
  pageSizeOptions?: number[];

  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  isRowDisabled?: (row: TData) => boolean;

  globalFilter?: string;
  onGlobalFilterChange?: (filter: string) => void;

  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void;

  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: (visibility: VisibilityState) => void;

  columnSizing?: ColumnSizingState;
  onColumnSizingChange?: (sizing: ColumnSizingState) => void;

  // -- Actions --
  onRowClick?: (row: TData) => void;
  rowActions?: (row: TData) => React.ReactNode;
  bulkActions?: (selectedRows: TData[]) => React.ReactNode;

  // -- Observers --
  onProcessedDataChange?: (data: TData[]) => void;

  // -- UI States --
  isLoading?: boolean;
  emptyMessage?: React.ReactNode;
  emptyIcon?: React.ReactNode;
  noResultsMessage?: React.ReactNode;
  error?: Error | null;
  onErrorRetry?: () => void;

  className?: string;
}
