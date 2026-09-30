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

      const operator = filter.operator || 'contains';
      const fVal = filter.value;

      rows = rows.filter((row) => {
        const rawVal = typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor as keyof TData];

        // isEmpty / isNotEmpty
        if (operator === 'isEmpty') return rawVal === undefined || rawVal === null || rawVal === '';
        if (operator === 'isNotEmpty') return rawVal !== undefined && rawVal !== null && rawVal !== '';

        if (rawVal === undefined || rawVal === null) return false;

        // Boolean
        if (typeof fVal === 'boolean') {
          return rawVal === fVal;
        }

        // Arrays (multiSelect)
        if (Array.isArray(fVal)) {
          return fVal.includes(rawVal);
        }

        // Numeric
        if (typeof rawVal === 'number' && typeof fVal === 'number') {
          switch (operator) {
            case 'equals': return rawVal === fVal;
            case 'notEquals': return rawVal !== fVal;
            case 'greaterThan': return rawVal > fVal;
            case 'greaterThanOrEqual': return rawVal >= fVal;
            case 'lessThan': return rawVal < fVal;
            case 'lessThanOrEqual': return rawVal <= fVal;
            default: return rawVal === fVal;
          }
        }

        // Date
        if (rawVal instanceof Date) {
          const rTime = rawVal.getTime();
          let fTime = 0;
          if (fVal instanceof Date) fTime = fVal.getTime();
          else if (typeof fVal === 'string' || typeof fVal === 'number') fTime = new Date(fVal).getTime();
          
          if (!isNaN(fTime)) {
            switch (operator) {
              case 'equals': return rTime === fTime;
              case 'before': return rTime < fTime;
              case 'after': return rTime > fTime;
              case 'onOrBefore': return rTime <= fTime;
              case 'onOrAfter': return rTime >= fTime;
            }
          }
        }

        // String (Text) fallback
        const strVal = String(rawVal).toLowerCase();
        const fStrVal = String(fVal).toLowerCase();
        
        switch (operator) {
          case 'equals': return strVal === fStrVal;
          case 'notEquals': return strVal !== fStrVal;
          case 'startsWith': return strVal.startsWith(fStrVal);
          case 'endsWith': return strVal.endsWith(fStrVal);
          case 'doesNotContain': return !strVal.includes(fStrVal);
          case 'contains':
          default:
            return strVal.includes(fStrVal);
        }
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
