export interface ExportColumn<T = any> {
  key: string;
  header: string;
  exportable?: boolean;
  formatter?: (value: any, row: T) => string | number | boolean | null | undefined;
}

export type ExportScope = 'all' | 'page' | 'filtered' | 'selected';
export type ExportFormat = 'csv' | 'xlsx' | 'json' | 'tsv';

export interface BaseExportOptions<T = any> {
  columns?: ExportColumn<T>[];
  headers?: boolean;
  /** Global date format string (e.g. 'YYYY-MM-DD' or 'DD/MM/YYYY') */
  dateFormat?: string;
}

export interface CsvExportOptions<T = any> extends BaseExportOptions<T> {
  delimiter?: string;
  includeBom?: boolean;
  protectFormulas?: boolean; // True to prefix dangerous cells with "'"
  nullValue?: string;
}

export interface CsvDownloadOptions<T = any> extends CsvExportOptions<T> {
  filename?: string;
}

export interface ExcelSheetConfig<T = any> {
  name: string;
  data: T[];
  columns?: ExportColumn<T>[];
}

export interface ExcelExportOptions<T = any> extends BaseExportOptions<T> {
  sheetName?: string;
  sheets?: ExcelSheetConfig<any>[]; // Overrides data for multi-sheet
}

export interface ExcelDownloadOptions<T = any> extends ExcelExportOptions<T> {
  filename?: string;
}

export interface JsonExportOptions<T = any> extends BaseExportOptions<T> {
  pretty?: boolean;
}

export interface JsonDownloadOptions<T = any> extends JsonExportOptions<T> {
  filename?: string;
}

export interface TsvExportOptions<T = any> extends CsvExportOptions<T> {}

export interface TsvDownloadOptions<T = any> extends TsvExportOptions<T> {
  filename?: string;
}

