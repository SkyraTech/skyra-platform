import { describe, it, expect } from 'vitest';
import { filterCommands, CommandLike } from './command';

describe('filterCommands', () => {
  const sampleCommands: CommandLike[] = [
    { id: '1', label: 'Export Data', description: 'Export records to file', keywords: ['download', 'csv', 'excel'] },
    { id: '2', label: 'Toggle Dark Mode', description: 'Switch between light and dark theme', keywords: ['theme', 'night'] },
    { id: '3', label: 'Create User', description: 'Add new team member', keywords: ['new', 'account'] },
    { id: '4', label: 'Hidden Feature', description: 'Internal debug', hidden: true },
    { id: '5', label: 'Disabled Action', description: 'Cannot be used', disabled: true },
  ];

  it('returns all visible non-hidden commands when query is empty', () => {
    const results = filterCommands(sampleCommands, '');
    expect(results).toHaveLength(4);
    expect(results.some((c) => c.id === '4')).toBe(false);
  });

  it('filters by label prefix and exact match', () => {
    const results = filterCommands(sampleCommands, 'Export');
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('1');
  });

  it('filters by keyword match (e.g. searching  csv finds Export Data)', () => {
    const results = filterCommands(sampleCommands, 'csv');
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('1');
  });

  it('filters by description match', () => {
    const results = filterCommands(sampleCommands, 'team member');
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('3');
  });

  it('handles multi-term queries case-insensitively', () => {
    const results = filterCommands(sampleCommands, 'DARK theme');
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('2');
  });

  it('returns empty array when no match is found', () => {
    const results = filterCommands(sampleCommands, 'nonexistent');
    expect(results).toHaveLength(0);
  });
});
