import { describe, it, expect, vi } from 'vitest';
import { exportToCsv, escapeCsvCell, downloadCsv } from './csv';

describe('CSV Export Engine', () => {
  const sampleData = [
    { id: '1', name: 'John Doe', role: 'Developer', salary: 120000 },
    { id: '2', name: 'Jane "Ace" Smith', role: 'Designer, Lead', salary: 110000 },
    { id: '3', name: 'Bob\nBuilder', role: null, salary: undefined },
  ];

  it('escapes quotes, commas, and newlines properly', () => {
    expect(escapeCsvCell('Simple')).toBe('Simple');
    expect(escapeCsvCell('Hello, World')).toBe('"Hello, World"');
    expect(escapeCsvCell('He said "Hi"')).toBe('"He said ""Hi"""');
    expect(escapeCsvCell('Line1\nLine2')).toBe('"Line1\nLine2"');
    expect(escapeCsvCell(null)).toBe('');
    expect(escapeCsvCell(undefined)).toBe('');
    expect(escapeCsvCell(12345)).toBe('12345');
  });

  it('exports dataset to CSV with inferred columns', () => {
    const csv = exportToCsv(sampleData, { includeBom: false });
    expect(csv).toContain('Id,Name,Role,Salary');
    expect(csv).toContain('1,John Doe,Developer,120000');
    expect(csv).toContain('"Jane ""Ace"" Smith"');
    expect(csv).toContain('"Designer, Lead"');
    expect(csv).toContain('"Bob\nBuilder"');
  });

  it('supports custom columns and formatters', () => {
    const csv = exportToCsv(sampleData, {
      includeBom: false,
      columns: [
        { key: 'name', header: 'Full Name' },
        { key: 'salary', header: 'Annual Salary', formatter: (val) => val ? `$${val}` : 'N/A' },
      ],
    });

    expect(csv).toContain('Full Name,Annual Salary');
    expect(csv).toContain('John Doe,$120000');
    expect(csv).toContain('"Bob\nBuilder",N/A');
  });

  it('escapes complex object values as JSON strings', () => {
    expect(escapeCsvCell({ a: 1 })).toBe('"{""a"":1}"');
  });

  it('handles empty dataset with BOM and custom headers with/without BOM', () => {
    const csvBom = exportToCsv([], { includeBom: true });
    expect(csvBom).toBe('\uFEFF');

    const csvHeadersBom = exportToCsv([], {
      includeBom: true,
      columns: [{ key: 'id', header: 'ID' }],
    });
    expect(csvHeadersBom).toBe('\uFEFFID');
  });

  it('appends .csv if filename has no extension in downloadCsv', () => {
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
      downloadCsv(sampleData, { filename: 'raw_export' });
      expect(clickMock).toHaveBeenCalled();
    } finally {
      URL.createObjectURL = origCreateObjectURL;
      URL.revokeObjectURL = origRevokeObjectURL;
      vi.restoreAllMocks();
    }
  });

  it('triggers downloadCsv browser interaction', () => {
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
      downloadCsv(sampleData, { filename: 'test.csv' });
      expect(clickMock).toHaveBeenCalled();
    } finally {
      URL.createObjectURL = origCreateObjectURL;
      URL.revokeObjectURL = origRevokeObjectURL;
      vi.restoreAllMocks();
    }
  });
});

