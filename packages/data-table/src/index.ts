/**
 * @skyra/data-table
 * 
 * Reusable enterprise DataTable primitives for the Skyra Platform.
 */

export * from './types';
export * from './useDataTableState';
export * from './processTableData';
export * from './DataTable';
export * from './skyra-tech-data-table';
export * from './ColumnFilterUI';

// Deprecated: Forward export for backward compatibility
export { DynamicDataTable } from './DynamicDataTable';
export type { DynamicDataTableProps, Column } from './DynamicDataTable';
