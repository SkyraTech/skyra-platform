import { describe, it, expect } from 'vitest';
import { exportToTsv } from './tsv';

describe('TSV Export Engine', () => {
  const sampleData = [
    { id: 1, name: 'Alice', role: 'Dev' },
    { id: 2, name: 'Bob\tBuilder', role: 'Manager' },
  ];

  it('exports dataset to TSV with tab delimiters', () => {
    const tsv = exportToTsv(sampleData, { includeBom: false });
    expect(tsv).toContain('Id\tName\tRole');
    expect(tsv).toContain('1\tAlice\tDev');
    
    // Quotes should be used since tab is inside value
    expect(tsv).toContain('"Bob\tBuilder"\tManager');
  });
});
