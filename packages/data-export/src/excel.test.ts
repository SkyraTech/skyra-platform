import { describe, it, expect } from 'vitest';
import { exportToExcelXml } from './excel';

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
});
