import { ColumnDef, ColumnFiltersState, SortingState } from './types';

export interface ProcessTableDataOptions<TData> {
  columns: ColumnDef<TData, any>[];
  globalFilter?: string;
  columnFilters?: ColumnFiltersState;
  sorting?: SortingState[];
}

/**
 * Pure deterministic processing utility.
 * Applies global search, column filters, and sorting to dataset without side effects.
 * Suitable for both DataTable internal processing and consumer export preparation.
 */
export function processTableData<TData>(
  data: TData[],
  options: ProcessTableDataOptions<TData>
): TData[] {
  const { columns, globalFilter, columnFilters, sorting } = options;
  let rows = [...data];

  // 1. Column-specific filtering
  if (columnFilters && columnFilters.length > 0) {
    for (const filter of columnFilters) {
      if (filter.value === undefined || filter.value === null || filter.value === '') continue;
      
      const col = columns.find((c) => (c.id || c.accessor) === filter.id);
      if (!col) continue;

      const filterValStr = String(filter.value).toLowerCase();

      rows = rows.filter((row) => {
        const rawVal = typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor as keyof TData];
        if (rawVal === undefined || rawVal === null) return false;
        
        if (typeof filter.value === 'boolean') {
          return rawVal === filter.value;
        }
        if (Array.isArray(filter.value)) {
          return filter.value.includes(rawVal);
        }
        return String(rawVal).toLowerCase().includes(filterValStr);
      });
    }
  }

  // 2. Global search
  if (globalFilter && globalFilter.trim()) {
    const q = globalFilter.trim().toLowerCase();
    rows = rows.filter((row) => {
      return columns.some((col) => {
        const val = typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor as keyof TData];
        if (val === undefined || val === null) return false;
        return String(val).toLowerCase().includes(q);
      });
    });
  }

  // 3. Sorting
  if (sorting && sorting.length > 0) {
    const sort = sorting[0]; // Primary sort
    if (sort) {
      const col = columns.find((c) => (c.id || c.accessor) === sort.id);
      if (col) {
        rows.sort((a, b) => {
          const valA = typeof col.accessor === 'function' ? col.accessor(a) : a[col.accessor as keyof TData];
          const valB = typeof col.accessor === 'function' ? col.accessor(b) : b[col.accessor as keyof TData];

          // Handle nulls/undefined: push to end
          if (valA == null && valB == null) return 0;
          if (valA == null) return 1;
          if (valB == null) return -1;

          // Numeric comparison
          if (typeof valA === 'number' && typeof valB === 'number') {
            return sort.desc ? valB - valA : valA - valB;
          }

          // Date comparison
          if (valA instanceof Date && valB instanceof Date) {
            return sort.desc ? valB.getTime() - valA.getTime() : valA.getTime() - valB.getTime();
          }

          // String comparison
          const strA = String(valA).toLowerCase();
          const strB = String(valB).toLowerCase();
          return sort.desc ? strB.localeCompare(strA) : strA.localeCompare(strB);
        });
      }
    }
  }

  return rows;
}
