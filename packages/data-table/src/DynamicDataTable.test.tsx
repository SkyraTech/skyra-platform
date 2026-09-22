import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DynamicDataTable, Column } from './DynamicDataTable';

interface TestItem {
  id: string;
  name: string;
}

describe('DynamicDataTable — Pagination and Style Conflict Regression', () => {
  const columns: Column<TestItem>[] = [
    { key: 'id', header: 'ID', accessor: 'id' },
    { key: 'name', header: 'Name', accessor: 'name' },
  ];

  const data: TestItem[] = Array.from({ length: 30 }, (_, i) => ({
    id: 'id-' + (i + 1),
    name: 'Item ' + (i + 1),
  }));

  it('renders pagination without React shorthand/longhand border conflicts during page transitions', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error');

    const { rerender } = render(
      <DynamicDataTable
        columns={columns}
        data={data}
        pageSize={10}
      />
    );

    // Initial page: page 1 is active
    const page1Btn = screen.getByRole('button', { name: 'Page 1' });
    const page2Btn = screen.getByRole('button', { name: 'Page 2' });
    const page3Btn = screen.getByRole('button', { name: 'Page 3' });

    expect(page1Btn).toBeDefined();
    expect(page2Btn).toBeDefined();

    // Transition to page 2 (causes active -> inactive transition on Page 1, and inactive -> active on Page 2)
    fireEvent.click(page2Btn);
    expect(screen.getByText('Item 11')).toBeDefined();

    // Transition to page 3
    fireEvent.click(page3Btn);
    expect(screen.getByText('Item 21')).toBeDefined();

    // Transition back to page 1
    fireEvent.click(page1Btn);
    expect(screen.getByText('Item 1')).toBeDefined();

    // Rerender with new data prop
    rerender(
      <DynamicDataTable
        columns={columns}
        data={[...data, { id: 'id-31', name: 'Item 31' }]}
        pageSize={10}
      />
    );

    // Verify no React style removal warnings were emitted
    const conflictingStyleErrors = consoleErrorSpy.mock.calls.filter(args =>
      args.some(arg => typeof arg === 'string' && (
        arg.includes('Removing a style property during rerender') ||
        arg.includes('borderColor') ||
        arg.includes('conflicting property is set (border)')
      ))
    );

    expect(conflictingStyleErrors).toHaveLength(0);
    consoleErrorSpy.mockRestore();
  });
});
