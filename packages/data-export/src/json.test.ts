import { describe, it, expect, vi } from 'vitest';
import { exportToJson, downloadJson } from './json';

describe('JSON Export Engine', () => {
  const sampleData = [
    { id: 1, name: 'Alice', active: true },
    { id: 2, name: 'Bob', active: false },
  ];

  it('exports pure dataset to JSON array', () => {
    const jsonStr = exportToJson(sampleData);
    const parsed = JSON.parse(jsonStr);
    expect(parsed).toHaveLength(2);
    expect(parsed[0].name).toBe('Alice');
  });

  it('supports custom columns and omits non-exportable', () => {
    const jsonStr = exportToJson(sampleData, {
      columns: [
        { key: 'name', header: 'FullName' },
        { key: 'id', header: 'ID', exportable: false }
      ]
    });
    const parsed = JSON.parse(jsonStr);
    expect(parsed[0]).toHaveProperty('FullName', 'Alice');
    expect(parsed[0]).not.toHaveProperty('ID');
    expect(parsed[0]).not.toHaveProperty('id');
  });

  it('supports pretty printing toggle', () => {
    const compactJson = exportToJson(sampleData, { pretty: false });
    const prettyJson = exportToJson(sampleData, { pretty: true });
    
    expect(compactJson).not.toContain('\n');
    expect(prettyJson).toContain('\n');
  });
});
