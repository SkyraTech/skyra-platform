'use client';

import React, { useState } from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';
import { downloadCsv, downloadExcel, ExportColumn } from '@skyra/data-export';
import { Button, ButtonProps } from './Button';

export interface ExportButtonProps<T extends Record<string, unknown> = Record<string, unknown>> extends Omit<ButtonProps, 'onClick'> {
  /** Target export format */
  format: 'csv' | 'xlsx' | 'xls';
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
 * One-click data export button delegating directly to @skyra/data-export engines.
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
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const defaultIcon =
    format === 'csv' ? <Download size={16} /> : <FileSpreadsheet size={16} />;
  const defaultLabel =
    children ?? (format === 'csv' ? 'Export CSV' : 'Export Excel');

  const handleExport = async () => {
    setIsExporting(true);
    try {
      if (onExport) {
        await onExport();
      } else if (format === 'csv') {
        downloadCsv(data, { columns, filename });
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
    <Button
      type="button"
      variant={variant}
      leftIcon={leftIcon ?? defaultIcon}
      isLoading={isExporting}
      onClick={handleExport}
      {...rest}
    >
      {defaultLabel}
    </Button>
  );
}
