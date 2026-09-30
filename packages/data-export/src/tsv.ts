import { exportToCsv, downloadCsv } from './csv';
import { TsvExportOptions, TsvDownloadOptions } from './types';

/**
 * Pure TSV string generator.
 * Simply calls exportToCsv with tab delimiter.
 */
export function exportToTsv<T = any>(
  data: T[],
  options: TsvExportOptions<T> = {}
): string {
  return exportToCsv(data, { ...options, delimiter: '\t' });
}

/**
 * Triggers browser download of TSV data.
 */
export function downloadTsv<T = any>(
  data: T[],
  options: TsvDownloadOptions<T> = {}
): void {
  const { filename = 'export.tsv', ...exportOptions } = options;
  const tsvString = exportToTsv(data, exportOptions);

  if (typeof window === 'undefined') return;

  const blob = new Blob([tsvString], { type: 'text/tab-separated-values;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.tsv') ? filename : `${filename}.tsv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
