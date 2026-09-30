import { formatDate } from './formatUtils';
import { JsonExportOptions, JsonDownloadOptions, ExportColumn } from './types';

/**
 * Pure JSON string generator.
 */
export function exportToJson<T = any>(
  data: T[],
  options: JsonExportOptions<T> = {}
): string {
  const { columns: userColumns, pretty = true, dateFormat } = options;

  let exportData: any[] = data;

  if (userColumns && userColumns.length > 0) {
    exportData = data.map((row) => {
      const obj: any = {};
      for (const col of userColumns) {
        const rawValue = (row as any)[col.key];
        const formatted = col.formatter ? col.formatter(rawValue, row) : formatDate(rawValue, dateFormat);
        // If exportable is false, we skip it
        if (col.exportable !== false) {
          obj[col.header] = formatted;
        }
      }
      return obj;
    });
  }

  return JSON.stringify(exportData, null, pretty ? 2 : undefined);
}

/**
 * Triggers browser download of JSON data.
 */
export function downloadJson<T = any>(
  data: T[],
  options: JsonDownloadOptions<T> = {}
): void {
  const { filename = 'export.json', ...exportOptions } = options;
  const jsonString = exportToJson(data, exportOptions);

  if (typeof window === 'undefined') return;

  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.json') ? filename : `${filename}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
