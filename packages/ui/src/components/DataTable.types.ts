import React from 'react';
import { 
  DataTableFeatures, 
  SortingState, 
  PaginationState, 
  RowSelectionState, 
  ColumnFiltersState, 
  VisibilityState, 
  ColumnSizingState,
  BaseColumnDef 
} from '@skyra-tech-platform/data-table';

export interface ColumnDef<TData, TValue = unknown> extends Omit<BaseColumnDef<TData, TValue>, 'header'> {
  header: React.ReactNode;
  cell?: (props: { row: TData; value: TValue }) => React.ReactNode;
}

export interface DataTableProps<TData extends { id: string | number }> {
  columns: ColumnDef<TData, unknown>[];
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
  onAdd?: () => void;

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
