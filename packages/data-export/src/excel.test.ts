import { describe, it, expect, vi } from 'vitest';
import { exportToExcelXml, downloadExcel } from './excel';

describe('Excel XML Export Engine', () => {
  const sampleData = [
    { id: '1', name: 'Acme Corp & Co', amount: 5000 },
    { id: '2', name: 'Beta <Tech>', amount: 7500 },
  ];

  it('generates valid XML Spreadsheet document with escaped characters', () => {
    const xml = exportToExcelXml(sampleData, { sheetName: 'Invoices' });

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<Worksheet ss:Name="Invoices">');
    expect(xml).toContain('<Data ss:Type="String">Acme Corp &amp; Co</Data>');
    expect(xml).toContain('<Data ss:Type="String">Beta &lt;Tech&gt;</Data>');
    expect(xml).toContain('<Data ss:Type="Number">5000</Data>');
    expect(xml).toContain('<Data ss:Type="Number">7500</Data>');
  });

  it('supports custom columns and sheet naming', () => {
    const xml = exportToExcelXml(sampleData, {
      sheetName: 'Custom Report',
      columns: [
        { key: 'name', header: 'Client' },
        { key: 'amount', header: 'Total (USD)', formatter: (val) => Number(val) * 1.1 },
      ],
    });

    expect(xml).toContain('<Data ss:Type="String">Client</Data>');
    expect(xml).toContain('<Data ss:Type="String">Total (USD)</Data>');
    expect(xml).toContain('<Data ss:Type="Number">5500</Data>');
  });

  it('handles null, undefined, and empty data', () => {
    const xml = exportToExcelXml([{ id: null, name: undefined }]);
    expect(xml).toContain('<Data ss:Type="String"></Data>');
  });

  it('handles .xlsx and raw filenames in downloadExcel', () => {
    const clickMock = vi.fn();
    const origCreateElement = document.createElement.bind(document);
    const origCreateObjectURL = URL.createObjectURL;
    const origRevokeObjectURL = URL.revokeObjectURL;

    URL.createObjectURL = vi.fn(() => 'blob:mock');
    URL.revokeObjectURL = vi.fn();

    vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      const el = origCreateElement(tag);
      if (tag === 'a') {
        el.click = clickMock;
      }
      return el;
    });

    try {
      downloadExcel(sampleData, { filename: 'test.xlsx' });
      downloadExcel(sampleData, { filename: 'test_no_ext' });
      expect(clickMock).toHaveBeenCalledTimes(2);
    } finally {
      URL.createObjectURL = origCreateObjectURL;
      URL.revokeObjectURL = origRevokeObjectURL;
      vi.restoreAllMocks();
    }
  });

  it('triggers downloadExcel browser interaction', () => {
    const clickMock = vi.fn();
    const origCreateElement = document.createElement.bind(document);
    const origCreateObjectURL = URL.createObjectURL;
    const origRevokeObjectURL = URL.revokeObjectURL;

    URL.createObjectURL = vi.fn(() => 'blob:mock');
    URL.revokeObjectURL = vi.fn();

    vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      const el = origCreateElement(tag);
      if (tag === 'a') {
        el.click = clickMock;
      }
      return el;
    });

    try {
      downloadExcel(sampleData, { filename: 'test.xls' });
      expect(clickMock).toHaveBeenCalled();
    } finally {
      URL.createObjectURL = origCreateObjectURL;
      URL.revokeObjectURL = origRevokeObjectURL;
      vi.restoreAllMocks();
    }
  });

  it('exports from index.ts barrel', async () => {
    const barrel = await import('./index');
    expect(barrel.exportToCsv).toBeDefined();
    expect(barrel.exportToExcelXml).toBeDefined();
  });
});

