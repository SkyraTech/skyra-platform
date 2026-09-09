export interface ExportColumn<T = any> {
  key: string;
  header: string;
  formatter?: (value: any, row: T) => string | number | boolean | null | undefined;
}

export interface CsvExportOptions<T = any> {
  columns?: ExportColumn<T>[];
  delimiter?: string;
  includeBom?: boolean;
  headers?: boolean;
}

export interface CsvDownloadOptions<T = any> extends CsvExportOptions<T> {
  filename?: string;
}

export interface ExcelExportOptions<T = any> {
  columns?: ExportColumn<T>[];
  sheetName?: string;
  headers?: boolean;
}

export interface ExcelDownloadOptions<T = any> extends ExcelExportOptions<T> {
  filename?: string;
}
