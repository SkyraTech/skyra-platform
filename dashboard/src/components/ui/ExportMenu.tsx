'use client';

import React from 'react';
import {
  ChevronDown,
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
} from 'lucide-react';
import { downloadCsv, downloadExcel, ExportColumn } from '@skyra-tech-platform/data-export';
import '@skyra-tech-platform/button';
import { DropdownMenu } from './DropdownMenu';

export interface ExportMenuProps<T extends Record<string, unknown> = Record<string, unknown>> {
  /** Dataset to export */
  data: T[];
  /** Column definitions */
  columns?: ExportColumn[];
  /** Base filename */
  filename?: string;
  /** Sheet name for Excel */
  sheetName?: string;
  /** Custom callback for PDF export */
  onExportPdf?: () => void | Promise<void>;
  /** Custom callback for printing */
  onPrint?: () => void | Promise<void>;
  /** Custom trigger label */
  label?: React.ReactNode;
  /** Disabled state */
  disabled?: boolean;
  /** Additional CSS class */
  className?: string;
}

/**
 * @skyra-tech-platform/button ExportMenu
 *
 * Compact action dropdown menu offering CSV, Excel, PDF export, and Print.
 * Uses DropdownMenu for floating positioning and theme compliance.
 */
export function ExportMenu<T extends Record<string, unknown> = Record<string, unknown>>({
  data = [] as unknown as T[],
  columns,
  filename = 'export',
  sheetName = 'Sheet1',
  onExportPdf,
  onPrint,
  label = 'Export',
  disabled = false,
  className = '',
}: ExportMenuProps) {

  const handleExportCsv = () => {
    downloadCsv(data, { columns, filename });
  };

  const handleExportExcel = () => {
    downloadExcel(data, { columns, filename, sheetName });
  };

  const items = [
    { type: 'item' as const, label: 'Export CSV', icon: <Download size={14} />, onClick: handleExportCsv },
    { type: 'item' as const, label: 'Export Excel', icon: <FileSpreadsheet size={14} />, onClick: handleExportExcel },
    ...(onExportPdf ? [{ type: 'item' as const, label: 'Export PDF', icon: <FileText size={14} />, onClick: () => onExportPdf() }] : []),
    ...(onPrint ? [{ type: 'item' as const, label: 'Print Document', icon: <Printer size={14} />, onClick: () => onPrint() }] : []),
  ];

  return (
    <div className={`skyra-export-menu-container ${className}`} style={{ display: 'inline-block' }}>
      <DropdownMenu
        trigger={
          <skyra-tech-button
            type="button"
            variant="outline"
            disabled={disabled}
          >
            {label}
            <ChevronDown slot="right-icon" size={14} />
          </skyra-tech-button>
        }
        items={items}
        align="end"
      />
    </div>
  );
}
