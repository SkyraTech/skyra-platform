'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import {
  ChevronDown,
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
} from 'lucide-react';
import { downloadCsv, downloadExcel, ExportColumn } from '@skyra/data-export';
import { Button } from './Button';

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
 * @skyra/ui ExportMenu
 *
 * Compact action dropdown menu offering CSV, Excel, PDF export, and Print.
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
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const uid = useId();
  const menuId = `skyra-export-menu-${uid}`;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExportCsv = () => {
    downloadCsv(data, { columns, filename });
    setIsOpen(false);
  };

  const handleExportExcel = () => {
    downloadExcel(data, { columns, filename, sheetName });
    setIsOpen(false);
  };

  const handleExportPdf = () => {
    onExportPdf?.();
    setIsOpen(false);
  };

  const handlePrint = () => {
    onPrint?.();
    setIsOpen(false);
  };

  const items = [
    { label: 'Export CSV', icon: <Download size={14} />, onClick: handleExportCsv },
    { label: 'Export Excel', icon: <FileSpreadsheet size={14} />, onClick: handleExportExcel },
    ...(onExportPdf ? [{ label: 'Export PDF', icon: <FileText size={14} />, onClick: handleExportPdf }] : []),
    ...(onPrint ? [{ label: 'Print Document', icon: <Printer size={14} />, onClick: handlePrint }] : []),
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
        setFocusedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % items.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + items.length) % items.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < items.length) {
          items[focusedIndex]?.onClick();
        }
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className={`skyra-export-menu-container ${className}`}
      style={{
        position: 'relative',
        display: 'inline-block',
        fontFamily: 'var(--skyra-font-body)' }}
    >
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        rightIcon={
          <ChevronDown className="skyra-motion-transition-transform"
            size={14}
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}
          />
        }
      >
        {label}
      </Button>

      {isOpen && (
        <div className="skyra-motion-fade-in-up-fast"
          id={menuId}
          ref={menuRef}
          role="menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            right: 0,
            zIndex: 200,
            minWidth: '160px',
            background: 'var(--skyra-surface)',
            border: '1px solid var(--skyra-border)',
            borderRadius: 'var(--skyra-radius-md)',
            boxShadow: 'var(--skyra-shadow-md)',
            padding: '4px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px' }}
        >
          {items.map((item, idx) => {
            const isFocused = idx === focusedIndex;
            return (
              <button className="skyra-motion-transition-bg"
                key={item.label}
                type="button"
                role="menuitem"
                onClick={item.onClick}
                onMouseEnter={() => setFocusedIndex(idx)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.45rem 0.65rem',
                  background: isFocused ? 'var(--skyra-bg)' : 'transparent',
                  color: 'var(--skyra-text)',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  border: 'none',
                  borderRadius: 'var(--skyra-radius-sm)',
                  cursor: 'pointer',
                  textAlign: 'left' }}
              >
                <span style={{ color: 'var(--skyra-primary)', display: 'flex' }}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
