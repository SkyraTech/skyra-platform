'use client';

import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileJson, FileText } from 'lucide-react';
import { downloadCsv, downloadExcel, downloadJson, downloadTsv, ExportColumn } from '@skyra-tech-platform/data-export';
import '@skyra-tech-platform/button';

export interface ExportReact.ComponentProps<'skyra-tech-button'><T extends Record<string, unknown> = Record<string, unknown>> extends Omit<React.ComponentProps<'skyra-tech-button'>, 'onClick'> {
  /** Target export format */
  format: 'csv' | 'xlsx' | 'xls' | 'json' | 'tsv';
  /** Array of data objects to export */
  data: T[];
  /** Optional custom column definitions */
  columns?: ExportColumn[];
  /** Destination filename */
  filename?: string;
  /** Custom export handler */
  onExport?: () => void | Promise<void>;
  /** Sheet name for Excel format */
  sheetName?: string;
}

/**
 * @skyra/ui ExportButton
 *
 * One-click data export button delegating directly to @skyra-tech-platform/data-export engines.
 */
export function ExportButton<T extends Record<string, unknown> = Record<string, unknown>>({
  format = 'csv',
  data = [] as unknown as T[],
  columns,
  filename = 'export',
  sheetName = 'Data',
  onExport,
  children,
  variant = 'outline',
  leftIcon,
  ...rest
}: ExportReact.ComponentProps<'skyra-tech-button'>) {
  const [isExporting, setIsExporting] = useState(false);

  const defaultIcon =
    format === 'csv' ? <Download size={16} /> : 
    format === 'json' ? <FileJson size={16} /> :
    format === 'tsv' ? <FileText size={16} /> :
    <FileSpreadsheet size={16} />;
  const defaultLabel =
    children ?? (
      format === 'csv' ? 'Export CSV' : 
      format === 'json' ? 'Export JSON' :
      format === 'tsv' ? 'Export TSV' :
      'Export Excel'
    );

  const handleExport = async () => {
    setIsExporting(true);
    try {
      if (onExport) {
        await onExport();
      } else if (format === 'csv') {
        downloadCsv(data, { columns, filename });
      } else if (format === 'json') {
        downloadJson(data, { columns, filename });
      } else if (format === 'tsv') {
        downloadTsv(data, { columns, filename });
      } else {
        downloadExcel(data, { columns, filename, sheetName });
      }
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <skyra-tech-button
      type="button"
      variant={variant}
      leftIcon={leftIcon ?? defaultIcon}
      loading={isExporting}
      onClick={handleExport}
      {...rest}
    >
      {defaultLabel}
    </skyra-tech-button>
  );
}
