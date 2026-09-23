import { useState, useCallback } from 'react';
import { 
  SortingState, 
  PaginationState, 
  VisibilityState, 
  RowSelectionState,
  ColumnFiltersState,
  ColumnSizingState
} from './types';

export interface UseDataTableStateProps {
  initialSorting?: SortingState[];
  initialPagination?: PaginationState;
  initialVisibility?: VisibilityState;
  initialSelection?: RowSelectionState;
  initialGlobalFilter?: string;
  initialColumnFilters?: ColumnFiltersState;
  initialColumnSizing?: ColumnSizingState;
}

export function useDataTableState(props: UseDataTableStateProps = {}) {
  const [sorting, setSorting] = useState<SortingState[]>(props.initialSorting || []);
  const [pagination, setPagination] = useState<PaginationState>(props.initialPagination || { pageIndex: 0, pageSize: 10 });
  const [visibility, setVisibility] = useState<VisibilityState>(props.initialVisibility || {});
  const [selection, setSelection] = useState<RowSelectionState>(props.initialSelection || {});
  const [globalFilter, setGlobalFilter] = useState<string>(props.initialGlobalFilter || '');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(props.initialColumnFilters || []);
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(props.initialColumnSizing || {});

  const handleSortingChange = useCallback((newSorting: SortingState[]) => {
    setSorting(newSorting);
  }, []);

  const handlePaginationChange = useCallback((newPagination: PaginationState) => {
    setPagination(newPagination);
  }, []);

  const handleVisibilityChange = useCallback((newVisibility: VisibilityState) => {
    setVisibility(newVisibility);
  }, []);

  const handleSelectionChange = useCallback((newSelection: RowSelectionState) => {
    setSelection(newSelection);
  }, []);

  const handleGlobalFilterChange = useCallback((filter: string) => {
    setGlobalFilter(filter);
  }, []);

  const handleColumnFiltersChange = useCallback((filters: ColumnFiltersState) => {
    setColumnFilters(filters);
  }, []);

  const handleColumnSizingChange = useCallback((sizing: ColumnSizingState) => {
    setColumnSizing(sizing);
  }, []);

  const resetFilters = useCallback(() => {
    setGlobalFilter('');
    setColumnFilters([]);
  }, []);

  const resetSorting = useCallback(() => {
    setSorting([]);
  }, []);

  return {
    sorting,
    onSortingChange: handleSortingChange,
    pagination,
    onPaginationChange: handlePaginationChange,
    visibility,
    onVisibilityChange: handleVisibilityChange,
    selection,
    onRowSelectionChange: handleSelectionChange,
    globalFilter,
    onGlobalFilterChange: handleGlobalFilterChange,
    columnFilters,
    onColumnFiltersChange: handleColumnFiltersChange,
    columnSizing,
    onColumnSizingChange: handleColumnSizingChange,
    resetFilters,
    resetSorting,
  };
}
