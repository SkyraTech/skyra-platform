import { describe, it, expect } from 'vitest';
import { exportToCsv, escapeCsvCell } from './csv';

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

  it('handles empty dataset gracefully', () => {
    const csv = exportToCsv([], { includeBom: false });
    expect(csv).toBe('');
  });
});
