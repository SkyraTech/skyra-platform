import { formatDate } from './formatUtils';
import { CsvExportOptions, CsvDownloadOptions, ExportColumn } from './types';

/**
 * Escapes a single cell value for CSV formatting.
 * Quotes containing strings, strings with delimiter, or newlines are wrapped in quotes.
 * Optional protection against CSV formula injection.
 */
export function escapeCsvCell(val: any, delimiter = ',', protectFormulas = true, nullValue = ''): string {
  if (val === null || val === undefined) {
    return nullValue;
  }

  if (val instanceof Date) {
    return val.toISOString();
  }

  let str = typeof val === 'object' ? JSON.stringify(val) : String(val);

  // Check if string contains quotes, delimiter, or newlines
  const needsQuotes =
    str.includes(delimiter) ||
    str.includes('"') ||
    str.includes('\n') ||
    str.includes('\r');

  if (needsQuotes) {
    // Escape double quotes by doubling them
    str = `"${str.replace(/"/g, '""')}"`;
  }

  // Formula injection protection
  if (protectFormulas) {
    if (str.startsWith('=') || str.startsWith('+') || str.startsWith('-') || str.startsWith('@')) {
      str = `'${str}`;
    }
  }

  return str;
}

/**
 * Pure CSV string generator.
 */
export function exportToCsv<T = any>(
  data: T[],
  options: CsvExportOptions<T> = {}
): string {
  const {
    columns: userColumns,
    delimiter = ',',
    includeBom = true,
    headers = true,
    protectFormulas = true,
    nullValue = '',
    dateFormat,
  } = options;

  if (!Array.isArray(data) || data.length === 0) {
    if (userColumns && userColumns.length > 0 && headers) {
      const headerRow = userColumns.map((c) => escapeCsvCell(c.header, delimiter, protectFormulas, nullValue)).join(delimiter);
      return (includeBom ? '\uFEFF' : '') + headerRow;
    }
    return includeBom ? '\uFEFF' : '';
  }

  // Determine effective columns
  let effectiveColumns: ExportColumn<T>[] = [];
  if (userColumns && userColumns.length > 0) {
    effectiveColumns = userColumns;
  } else {
    // Infer columns from first data item
    const first = data[0];
    if (typeof first === 'object' && first !== null) {
      effectiveColumns = Object.keys(first).map((key) => ({
        key,
        header: key.charAt(0).toUpperCase() + key.slice(1),
      }));
    }
  }

  const lines: string[] = [];

  // Add header row
  if (headers && effectiveColumns.length > 0) {
    const headerRow = effectiveColumns
      .map((c) => escapeCsvCell(c.header, delimiter, protectFormulas, nullValue))
      .join(delimiter);
    lines.push(headerRow);
  }

  // Add data rows
  for (const row of data) {
    const rowValues = effectiveColumns.map((col) => {
      const rawValue = (row as any)[col.key];
      const formatted = col.formatter ? col.formatter(rawValue, row) : formatDate(rawValue, dateFormat);
      return escapeCsvCell(formatted, delimiter, protectFormulas, nullValue);
    });
    lines.push(rowValues.join(delimiter));
  }

  const csvContent = lines.join('\r\n');
  return (includeBom ? '\uFEFF' : '') + csvContent;
}

/**
 * Triggers browser download of CSV data.
 */
export function downloadCsv<T = any>(
  data: T[],
  options: CsvDownloadOptions<T> = {}
): void {
  const { filename = 'export.csv', ...exportOptions } = options;
  const csvString = exportToCsv(data, exportOptions);

  if (typeof window === 'undefined') return;

  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
