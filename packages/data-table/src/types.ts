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

export type FilterType = 'text' | 'select' | 'multiSelect' | 'number' | 'date' | 'dateRange' | 'boolean' | 'custom';

export type FilterOperator = 
  | 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'doesNotContain' | 'isEmpty' | 'isNotEmpty'
  | 'greaterThan' | 'greaterThanOrEqual' | 'lessThan' | 'lessThanOrEqual' | 'between' | 'notEquals'
  | 'before' | 'after' | 'onOrBefore' | 'onOrAfter';

export interface ColumnFilterConfig {
  type?: FilterType;
  options?: { value: string | number | boolean; label: string }[];
  customComponent?: unknown; // Framework agnostic
}

export interface ColumnVisualConfig {
  variant?: 'accent' | 'subtle';
  tone?: 'primary' | 'danger' | 'warning' | 'success' | 'info';
}

/**
 * Base Column definition (Framework Agnostic)
 */
export interface BaseColumnDef<TData, TValue = unknown> {
  id?: string;
  accessor: keyof TData | ((row: TData) => TValue);
  header?: string;
  headerSlot?: string;
  cellSlot?: (row: TData) => string;
  sortable?: boolean;
  filterable?: boolean;
  filterConfig?: ColumnFilterConfig;
  hideable?: boolean;
  resizable?: boolean;
  width?: string | number;
  minWidth?: number;
  maxWidth?: number;
  align?: 'left' | 'center' | 'right';
  className?: string;
  visual?: ColumnVisualConfig;
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
  operator?: FilterOperator;
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
