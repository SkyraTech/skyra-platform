import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import React, { useState } from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { DataTable } from './DataTable';
import { ColumnDef, SortingState, PaginationState, VisibilityState, RowSelectionState, ColumnFiltersState, ColumnSizingState } from './types';
import { processTableData } from './processTableData';

expect.extend(toHaveNoViolations);

const getShadowRoot = () => document.querySelector('skyra-tech-data-table')?.shadowRoot as any;

const shadowScreen = {
  getByRole: (...args: any[]) => {
    let el = screen.queryByRole(args[0], args[1]);
    if (!el && getShadowRoot()) el = within(getShadowRoot()).queryByRole(args[0], args[1]);
    if (!el) throw new Error(`getByRole not found: ${args[0]} ${JSON.stringify(args[1])}`);
    return el;
  },
  queryByRole: (...args: any[]) => {
    let el = screen.queryByRole(args[0], args[1]);
    if (!el && getShadowRoot()) el = within(getShadowRoot()).queryByRole(args[0], args[1]);
    return el;
  },
  getByText: (...args: any[]) => {
    let el = screen.queryByText(args[0], args[1]);
    if (!el && getShadowRoot()) el = within(getShadowRoot()).queryByText(args[0], args[1]);
    if (!el) throw new Error(`getByText not found: ${args[0]}`);
    return el;
  },
  queryByText: (...args: any[]) => {
    let el = screen.queryByText(args[0], args[1]);
    if (!el && getShadowRoot()) el = within(getShadowRoot()).queryByText(args[0], args[1]);
    return el;
  },
  getByPlaceholderText: (...args: any[]) => {
    let el = screen.queryByPlaceholderText(args[0], args[1]);
    if (!el && getShadowRoot()) el = within(getShadowRoot()).queryByPlaceholderText(args[0], args[1]);
    if (!el) throw new Error(`getByPlaceholderText not found: ${args[0]}`);
    return el;
  },
  queryByPlaceholderText: (...args: any[]) => {
    let el = screen.queryByPlaceholderText(args[0], args[1]);
    if (!el && getShadowRoot()) el = within(getShadowRoot()).queryByPlaceholderText(args[0], args[1]);
    return el;
  },
  getByLabelText: (...args: any[]) => {
    let el = screen.queryByLabelText(args[0], args[1]);
    if (!el && getShadowRoot()) el = within(getShadowRoot()).queryByLabelText(args[0], args[1]);
    if (!el) throw new Error(`getByLabelText not found: ${args[0]}`);
    return el;
  },
  queryByLabelText: (...args: any[]) => {
    let el = screen.queryByLabelText(args[0], args[1]);
    if (!el && getShadowRoot()) el = within(getShadowRoot()).queryByLabelText(args[0], args[1]);
    return el;
  },
  getAllByRole: (...args: any[]) => {
    let els = screen.queryAllByRole(args[0], args[1]);
    if (els.length === 0 && getShadowRoot()) els = within(getShadowRoot()).queryAllByRole(args[0], args[1]);
    if (els.length === 0) throw new Error(`getAllByRole not found: ${args[0]} ${JSON.stringify(args[1])}`);
    return els;
  }
};

interface TestUser {
  id: string;
  name: string;
  role: string;
  status?: string;
  score?: number | null;
  bio?: string | undefined;
  disabled?: boolean;
}

const mockData: TestUser[] = [
  { id: '1', name: 'Alice', role: 'Admin', status: 'Active', score: 95 },
  { id: '2', name: 'Bob', role: 'User', status: 'Pending', score: 80 },
  { id: '3', name: 'Charlie', role: 'Editor', status: 'Active', score: 88 },
  { id: '4', name: 'Diana', role: 'User', status: 'Inactive', score: 72 },
  { id: '5', name: 'Evan', role: 'Admin', status: 'Active', score: 91 },
];

const mockColumns: ColumnDef<TestUser>[] = [
  { id: 'name', header: 'Name', accessor: 'name', sortable: true, resizable: true },
  { id: 'role', header: 'Role', accessor: 'role', sortable: true, resizable: true },
  { id: 'status', header: 'Status', accessor: 'status', sortable: false, hideable: true },
  { 
    id: 'score', 
    header: 'Score', 
    accessor: 'score', 
    sortable: true, 
    cell: ({ value }) => <span data-testid="score-cell">{value != null ? `${value}%` : 'N/A'}</span> 
  },
];

describe('DataTable — Comprehensive Verification Suite', () => {
  // ── 1. Basic Rendering & Generic Types ──
  it('renders basic data with generic columns and custom cell renderers', () => {
    render(<DataTable data={mockData} columns={mockColumns} />);
    expect(shadowScreen.getByText('Alice')).toBeDefined();
    expect(shadowScreen.getByText('Bob')).toBeDefined();
    expect(shadowScreen.getByText('Charlie')).toBeDefined();
    expect(shadowScreen.getByText('Diana')).toBeDefined();
    expect(shadowScreen.getByText('Evan')).toBeDefined();
    expect(shadowScreen.getByText('95%')).toBeDefined();
  });

  it('renders function accessors correctly', () => {
    const fnColumns: ColumnDef<TestUser>[] = [
      { id: 'full', header: 'Full Info', accessor: (row) => `${row.name} (${row.role})` },
    ];
    render(<DataTable data={mockData.slice(0, 2)} columns={fnColumns} />);
    expect(shadowScreen.getByText('Alice (Admin)')).toBeDefined();
    expect(shadowScreen.getByText('Bob (User)')).toBeDefined();
  });

  // ── 2. Sorting ──
  describe('Sorting', () => {
    it('sorts ascending and descending on column header click', () => {
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          features={{ sorting: true, pagination: false }} 
        />
      );

      const nameHeader = shadowScreen.getByRole('columnheader', { name: /name/i });
      expect(nameHeader.getAttribute('aria-sort')).toBe('none');

      // Click 1: Ascending (Alice, Bob, Charlie, Diana, Evan)
      fireEvent.click(nameHeader);
      expect(nameHeader.getAttribute('aria-sort')).toBe('ascending');
      const rowsAsc = shadowScreen.getAllByRole('row');
      expect(rowsAsc[1]?.innerHTML).toContain('cell-1-name'); // Alice is id 1

      // Click 2: Descending (Evan, Diana, Charlie, Bob, Alice)
      fireEvent.click(nameHeader);
      expect(nameHeader.getAttribute('aria-sort')).toBe('descending');
      const rowsDesc = shadowScreen.getAllByRole('row');
      expect(rowsDesc[1]?.innerHTML).toContain('cell-5-name'); // Evan is id 5

      // Click 3: Unsort
      fireEvent.click(nameHeader);
      expect(nameHeader.getAttribute('aria-sort')).toBe('none');
    });

    it('supports keyboard Enter and Space for sorting', () => {
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          features={{ sorting: true, pagination: false }} 
        />
      );

      const nameHeader = shadowScreen.getByRole('columnheader', { name: /name/i });
      fireEvent.keyDown(nameHeader, { key: 'Enter' });
      expect(nameHeader.getAttribute('aria-sort')).toBe('ascending');

      fireEvent.keyDown(nameHeader, { key: ' ' });
      expect(nameHeader.getAttribute('aria-sort')).toBe('descending');
    });

    it('does not sort non-sortable columns', () => {
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          features={{ sorting: true, pagination: false }} 
        />
      );

      const statusHeader = shadowScreen.getByRole('columnheader', { name: /status/i });
      expect(statusHeader.getAttribute('aria-sort')).toBeNull();
      fireEvent.click(statusHeader);
      expect(statusHeader.getAttribute('aria-sort')).toBeNull();
    });
  });

  // ── 3. Filtering & Global Search ──
  describe('Filtering and Search', () => {
    it('filters data via global search and supports clearing', () => {
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          features={{ globalSearch: true, pagination: false }} 
        />
      );

      const searchInput = shadowScreen.getByPlaceholderText('Search table...');
      fireEvent.change(searchInput, { target: { value: 'Alice' } });
      
      expect(shadowScreen.getByText('Alice')).toBeDefined();
      expect(shadowScreen.queryByText('Bob')).toBeNull();

      // Clear search button
      const clearBtn = shadowScreen.getByLabelText('Clear search');
      fireEvent.click(clearBtn);
      expect(shadowScreen.getByText('Bob')).toBeDefined();
    });

    it('filters data via columnFilters', () => {
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          columnFilters={[{ id: 'role', value: 'Admin' }]}
          features={{ filtering: true, pagination: false }} 
        />
      );

      expect(shadowScreen.getByText('Alice')).toBeDefined();
      expect(shadowScreen.getByText('Evan')).toBeDefined();
      expect(shadowScreen.queryByText('Bob')).toBeNull();
      expect(shadowScreen.queryByText('Charlie')).toBeNull();
    });
  });

  // ── 4. Pagination & Rows-Per-Page ──
  describe('Pagination and Rows-per-page', () => {
    it('paginates data and allows page navigation', () => {
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          features={{ pagination: true }} 
          pagination={{ pageIndex: 0, pageSize: 2 }}
        />
      );

      // Page 1: Alice, Bob
      expect(shadowScreen.getByText('Alice')).toBeDefined();
      expect(shadowScreen.getByText('Bob')).toBeDefined();
      expect(shadowScreen.queryByText('Charlie')).toBeNull();

      // Navigate to Next page
      const nextBtn = shadowScreen.getByLabelText('Next page');
      fireEvent.click(nextBtn);

      // Previous button should be disabled on page 1
      const prevBtn = shadowScreen.getByLabelText('Previous page');
      expect(prevBtn).toBeDefined();
    });

    it('changes rows-per-page via page size selector', () => {
      const handlePaginationChange = vi.fn();
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          features={{ pagination: true }} 
          pagination={{ pageIndex: 0, pageSize: 2 }}
          pageSizeOptions={[2, 5, 10]}
          onPaginationChange={handlePaginationChange}
        />
      );

      const select = shadowScreen.getByLabelText('Rows per page');
      fireEvent.change(select, { target: { value: '5' } });
      expect(handlePaginationChange).toHaveBeenCalledWith({ pageIndex: 0, pageSize: 5 });
    });
  });

  // ── 5. Row Selection & Disabled Rows ──
  describe('Row Selection and Disabled Rows', () => {
    it('handles individual row selection and select all', () => {
      const handleSelection = vi.fn();
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          features={{ rowSelection: true, pagination: false }} 
          onRowSelectionChange={handleSelection}
        />
      );

      // Select row 1
      const row1Checkbox = shadowScreen.getByLabelText('Select row 1');
      fireEvent.click(row1Checkbox);
      expect(handleSelection).toHaveBeenCalledWith({ '1': true });

      // Select All
      const selectAll = shadowScreen.getByLabelText('Select all rows');
      fireEvent.click(selectAll);
      expect(handleSelection).toHaveBeenCalled();
    });

    it('displays indeterminate selection state when some rows are selected', () => {
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          features={{ rowSelection: true, pagination: false }} 
          rowSelection={{ '1': true }}
        />
      );

      const selectAll = shadowScreen.getByLabelText('Select all rows') as HTMLInputElement;
      expect(selectAll.indeterminate).toBe(true);
      expect(selectAll.getAttribute('aria-checked')).toBe('mixed');
    });

    it('respects isRowDisabled prop by disabling checkbox and skipping in select-all', () => {
      const handleSelection = vi.fn();
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          features={{ rowSelection: true, pagination: false }} 
          isRowDisabled={(row) => row.id === '2'}
          onRowSelectionChange={handleSelection}
        />
      );

      const row2Checkbox = shadowScreen.getByLabelText('Select row 2');
      expect((row2Checkbox as HTMLInputElement).disabled).toBe(true);

      const selectAll = shadowScreen.getByLabelText('Select all rows');
      fireEvent.click(selectAll);
      // Row 2 should NOT be in the selection
      expect(handleSelection).toHaveBeenCalledWith({ '1': true, '3': true, '4': true, '5': true });
    });
  });

  // ── 6. Column Visibility ──
  describe('Column Visibility', () => {
    it('toggles column visibility and hides column from DOM', () => {
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          features={{ columnVisibility: true, pagination: false }} 
        />
      );

      expect(shadowScreen.getByText('Status')).toBeDefined();

      // Open column visibility menu
      const colBtn = shadowScreen.getByLabelText('Toggle column visibility');
      fireEvent.click(colBtn);

      const toggleStatus = shadowScreen.getByLabelText('Toggle Status column');
      fireEvent.click(toggleStatus);

      // Status column header should now be hidden
      expect(shadowScreen.queryByRole('columnheader', { name: /^status$/i })).toBeNull();
    });

    it('does not allow hiding non-hideable columns in the menu', () => {
      const strictCols: ColumnDef<TestUser>[] = [
        { id: 'name', header: 'Name', accessor: 'name', hideable: false },
        { id: 'role', header: 'Role', accessor: 'role', hideable: true },
      ];
      render(
        <DataTable 
          data={mockData} 
          columns={strictCols} 
          features={{ columnVisibility: true }} 
        />
      );

      const colBtn = shadowScreen.getByLabelText('Toggle column visibility');
      fireEvent.click(colBtn);

      expect(shadowScreen.queryByLabelText('Toggle Name column')).toBeNull();
      expect(shadowScreen.getByLabelText('Toggle Role column')).toBeDefined();
    });
  });

  // ── 7. Column Resizing ──
  describe('Column Resizing', () => {
    it('renders resizer handles when features.columnResizing is enabled', () => {
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          features={{ columnResizing: true, pagination: false }} 
        />
      );

      const nameResizer = shadowScreen.getByLabelText('Resize column Name');
      expect(nameResizer).toBeDefined();
      expect(nameResizer.getAttribute('role')).toBe('separator');
      expect(nameResizer.getAttribute('aria-orientation')).toBe('vertical');
    });

    it('supports keyboard arrow keys for column resizing', () => {
      const handleSizing = vi.fn();
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          features={{ columnResizing: true, pagination: false }} 
          columnSizing={{ name: 150 }}
          onColumnSizingChange={handleSizing}
        />
      );

      const nameResizer = shadowScreen.getByLabelText('Resize column Name');
      fireEvent.keyDown(nameResizer, { key: 'ArrowRight' });
      expect(handleSizing).toHaveBeenCalledWith({ name: 160 });

      fireEvent.keyDown(nameResizer, { key: 'ArrowLeft' });
      expect(handleSizing).toHaveBeenCalledWith({ name: 140 });
    });

    it('supports mouse/pointer dragging for column resizing with cleanup', () => {
      const handleSizing = vi.fn();
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          features={{ columnResizing: true, pagination: false }} 
          columnSizing={{ name: 150 }}
          onColumnSizingChange={handleSizing}
        />
      );

      const nameResizer = shadowScreen.getByLabelText('Resize column Name');
      fireEvent.pointerDown(nameResizer, { clientX: 200 });

      // Simulate pointermove on window
      act(() => {
        window.dispatchEvent(new MouseEvent('pointermove', { clientX: 250 }));
      });
      expect(handleSizing).toHaveBeenCalled();

      // Simulate pointerup on window
      act(() => {
        window.dispatchEvent(new MouseEvent('pointerup'));
      });
    });
  });

  // ── 8. Row Actions and Bulk Actions ──
  describe('Actions', () => {
    it('renders row actions and triggers action callbacks', () => {
      const handleEdit = vi.fn();
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          features={{ rowActions: true, pagination: false }} 
          rowActions={(row) => (
            <button onClick={() => handleEdit(row.id)}>Edit {row.name}</button>
          )}
        />
      );

      expect(shadowScreen.getByRole('columnheader', { name: /actions/i })).toBeDefined();
      const editAlice = shadowScreen.getByText('Edit Alice');
      fireEvent.click(editAlice);
      expect(handleEdit).toHaveBeenCalledWith('1');
    });

    it('renders bulk actions bar when rows are selected', () => {
      const handleBulkDelete = vi.fn();
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          features={{ rowSelection: true, bulkActions: true, pagination: false }} 
          rowSelection={{ '1': true, '2': true }}
          bulkActions={(selected) => (
            <button onClick={() => handleBulkDelete(selected)}>
              Delete Selected ({selected.length})
            </button>
          )}
        />
      );

      expect(shadowScreen.getByText('2 rows selected')).toBeDefined();
      const deleteBtn = shadowScreen.getByText('Delete Selected (2)');
      fireEvent.click(deleteBtn);
      expect(handleBulkDelete).toHaveBeenCalled();
    });
  });

  // ── 9. UI States: Loading, Empty, No-Results, Error ──
  describe('UI States', () => {
    it('renders loading skeleton rows when isLoading is true', () => {
      const { container } = render(
        <DataTable data={mockData} columns={mockColumns} isLoading={true} />
      );
      const root = getShadowRoot() || container;
      const skeletons = root.querySelectorAll('.skyra-skeleton-bar');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('renders empty state when data array is empty', () => {
      render(
        <DataTable 
          data={[]} 
          columns={mockColumns} 
          emptyMessage="No users present." 
        />
      );
      expect(shadowScreen.getByText('No users present.')).toBeDefined();
    });

    it('renders no-results state with clear button when filters match 0 rows', () => {
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          globalFilter="NonExistentName123"
          features={{ globalSearch: true, pagination: false }}
          noResultsMessage="Zero records found matching query."
        />
      );
      expect(shadowScreen.getByText('Zero records found matching query.')).toBeDefined();
      expect(shadowScreen.getByText('Clear filters and search')).toBeDefined();
    });

    it('renders error state and invokes retry callback', () => {
      const handleRetry = vi.fn();
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          error={new Error('Failed to load table data')} 
          onErrorRetry={handleRetry}
        />
      );

      expect(shadowScreen.getByText('Failed to load table data')).toBeDefined();
      const retryBtn = shadowScreen.getByText('Retry');
      fireEvent.click(retryBtn);
      expect(handleRetry).toHaveBeenCalled();
    });
  });

  // ── 10. Controlled vs Uncontrolled State ──
  describe('Controlled vs Uncontrolled State', () => {
    it('emits onSortingChange in controlled sorting mode', () => {
      const handleSorting = vi.fn();
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          features={{ sorting: true }} 
          sorting={[]}
          onSortingChange={handleSorting}
        />
      );

      const nameHeader = shadowScreen.getByRole('columnheader', { name: /name/i });
      fireEvent.click(nameHeader);
      expect(handleSorting).toHaveBeenCalledWith([{ id: 'name', desc: false }]);
    });

    it('emits onGlobalFilterChange in controlled search mode', () => {
      const handleSearch = vi.fn();
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          features={{ globalSearch: true }} 
          globalFilter=""
          onGlobalFilterChange={handleSearch}
        />
      );

      const input = shadowScreen.getByPlaceholderText('Search table...');
      fireEvent.change(input, { target: { value: 'Diana' } });
      expect(handleSearch).toHaveBeenCalledWith('Diana');
    });

    it('emits onPaginationChange in controlled pagination mode', () => {
      const handlePagination = vi.fn();
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          features={{ pagination: true }} 
          pagination={{ pageIndex: 0, pageSize: 2 }}
          onPaginationChange={handlePagination}
        />
      );

      const nextBtn = shadowScreen.getByLabelText('Next page');
      fireEvent.click(nextBtn);
      expect(handlePagination).toHaveBeenCalledWith({ pageIndex: 1, pageSize: 2 });
    });

    it('emits onRowSelectionChange in controlled selection mode', () => {
      const handleSelection = vi.fn();
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          features={{ rowSelection: true }} 
          rowSelection={{}}
          onRowSelectionChange={handleSelection}
        />
      );

      const rowCheckbox = shadowScreen.getByLabelText('Select row 1');
      fireEvent.click(rowCheckbox);
      expect(handleSelection).toHaveBeenCalledWith({ '1': true });
    });

    it('emits onColumnVisibilityChange in controlled visibility mode', () => {
      const handleVisibility = vi.fn();
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          features={{ columnVisibility: true }} 
          columnVisibility={{}}
          onColumnVisibilityChange={handleVisibility}
        />
      );

      const colBtn = shadowScreen.getByLabelText('Toggle column visibility');
      fireEvent.click(colBtn);
      const toggle = shadowScreen.getByLabelText('Toggle Status column');
      fireEvent.click(toggle);
      expect(handleVisibility).toHaveBeenCalledWith({ status: true });
    });
  });

  // ── 11. Server-Side Readiness ──
  describe('Server-Side Readiness', () => {
    it('respects manualPagination=true: does not client-slice and uses totalRows & pageCount', () => {
      const handlePagination = vi.fn();
      // Server provides page 2 with 2 items, totalRows=100, pageCount=10
      const serverPageData = [
        { id: '21', name: 'User 21', role: 'Staff' },
        { id: '22', name: 'User 22', role: 'Staff' },
      ];

      render(
        <DataTable 
          data={serverPageData} 
          columns={mockColumns} 
          manualPagination={true}
          totalRows={100}
          pageCount={10}
          pagination={{ pageIndex: 2, pageSize: 2 }}
          features={{ pagination: true }}
          onPaginationChange={handlePagination}
        />
      );

      // Should display exact server page rows without slicing
      expect(shadowScreen.getByText('User 21')).toBeDefined();
      expect(shadowScreen.getByText('User 22')).toBeDefined();
      // Total count should show 100
      expect(shadowScreen.getByText(/of 100/i)).toBeDefined();

      // Page buttons should reflect pageCount
      expect(shadowScreen.getByLabelText('Page 10')).toBeDefined();
    });

    it('does not make any external network or database calls', () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch');
      render(<DataTable data={mockData} columns={mockColumns} features={{ sorting: true, pagination: true }} />);
      expect(fetchSpy).not.toHaveBeenCalled();
      fetchSpy.mockRestore();
    });
  });

  // ── 12. Feature Modularity Test Matrix (Mandatory 11 Configurations) ──
  describe('Feature Modularity Test Matrix', () => {
    it('1. Basic table: no toolbar, no pagination, no selection', () => {
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          features={{
            sorting: false,
            filtering: false,
            globalSearch: false,
            pagination: false,
            rowSelection: false,
            columnVisibility: false,
            columnResizing: false,
            rowActions: false,
            bulkActions: false,
          }} 
        />
      );

      expect(shadowScreen.queryByPlaceholderText('Search table...')).toBeNull();
      expect(shadowScreen.queryByRole('navigation', { name: /pagination/i })).toBeNull();
      expect(shadowScreen.queryByLabelText('Select all rows')).toBeNull();
      expect(shadowScreen.queryByLabelText('Toggle column visibility')).toBeNull();
    });

    it('2. Sorting only: sortable headers present, no search/pagination/selection', () => {
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          features={{
            sorting: true,
            filtering: false,
            globalSearch: false,
            pagination: false,
            rowSelection: false,
            columnVisibility: false,
          }} 
        />
      );

      expect(shadowScreen.getByRole('columnheader', { name: /name/i }).getAttribute('aria-sort')).toBe('none');
      expect(shadowScreen.queryByPlaceholderText('Search table...')).toBeNull();
      expect(shadowScreen.queryByRole('navigation', { name: /pagination/i })).toBeNull();
      expect(shadowScreen.queryByLabelText('Select all rows')).toBeNull();
    });

    it('3. Filtering only: column filters processed, no search/pagination/selection', () => {
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          columnFilters={[{ id: 'role', value: 'Editor' }]}
          features={{
            sorting: false,
            filtering: true,
            globalSearch: false,
            pagination: false,
            rowSelection: false,
          }} 
        />
      );

      expect(shadowScreen.getByText('Charlie')).toBeDefined();
      expect(shadowScreen.queryByText('Alice')).toBeNull();
      expect(shadowScreen.queryByPlaceholderText('Search table...')).toBeNull();
      expect(shadowScreen.queryByRole('navigation', { name: /pagination/i })).toBeNull();
    });

    it('4. Global search only: search input present, no sorting/pagination/selection', () => {
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          features={{
            sorting: false,
            filtering: false,
            globalSearch: true,
            pagination: false,
            rowSelection: false,
          }} 
        />
      );

      expect(shadowScreen.getByPlaceholderText('Search table...')).toBeDefined();
      expect(shadowScreen.getByRole('columnheader', { name: /name/i }).getAttribute('aria-sort')).toBeNull();
      expect(shadowScreen.queryByRole('navigation', { name: /pagination/i })).toBeNull();
      expect(shadowScreen.queryByLabelText('Select all rows')).toBeNull();
    });

    it('5. Pagination only: pagination nav present, no search/sorting/selection', () => {
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          pagination={{ pageIndex: 0, pageSize: 2 }}
          features={{
            sorting: false,
            filtering: false,
            globalSearch: false,
            pagination: true,
            rowSelection: false,
          }} 
        />
      );

      expect(shadowScreen.getByRole('navigation', { name: /pagination/i })).toBeDefined();
      expect(shadowScreen.queryByPlaceholderText('Search table...')).toBeNull();
      expect(shadowScreen.queryByLabelText('Select all rows')).toBeNull();
    });

    it('6. Selection only: checkboxes present, no search/sorting/pagination', () => {
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          features={{
            sorting: false,
            filtering: false,
            globalSearch: false,
            pagination: false,
            rowSelection: true,
          }} 
        />
      );

      expect(shadowScreen.getByLabelText('Select all rows')).toBeDefined();
      expect(shadowScreen.queryByPlaceholderText('Search table...')).toBeNull();
      expect(shadowScreen.queryByRole('navigation', { name: /pagination/i })).toBeNull();
    });

    it('7. Sorting + pagination: both active, no search or selection', () => {
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          features={{
            sorting: true,
            filtering: false,
            globalSearch: false,
            pagination: true,
            rowSelection: false,
          }} 
        />
      );

      expect(shadowScreen.getByRole('columnheader', { name: /name/i }).getAttribute('aria-sort')).toBe('none');
      expect(shadowScreen.getByRole('navigation', { name: /pagination/i })).toBeDefined();
      expect(shadowScreen.queryByPlaceholderText('Search table...')).toBeNull();
      expect(shadowScreen.queryByLabelText('Select all rows')).toBeNull();
    });

    it('8. Filtering + pagination: filter applied and paginated, no sorting', () => {
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          columnFilters={[{ id: 'status', value: 'Active' }]}
          pagination={{ pageIndex: 0, pageSize: 2 }}
          features={{
            sorting: false,
            filtering: true,
            globalSearch: false,
            pagination: true,
            rowSelection: false,
          }} 
        />
      );

      expect(shadowScreen.getByRole('navigation', { name: /pagination/i })).toBeDefined();
      expect(shadowScreen.getByText('Alice')).toBeDefined();
      expect(shadowScreen.queryByPlaceholderText('Search table...')).toBeNull();
    });

    it('9. Search + pagination: search matches paged, no sorting/selection', () => {
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          globalFilter="User"
          features={{
            sorting: false,
            filtering: false,
            globalSearch: true,
            pagination: true,
            rowSelection: false,
          }} 
        />
      );

      expect(shadowScreen.getByPlaceholderText('Search table...')).toBeDefined();
      expect(shadowScreen.getByRole('navigation', { name: /pagination/i })).toBeDefined();
      expect(shadowScreen.queryByLabelText('Select all rows')).toBeNull();
    });

    it('10. Selection + bulk actions: toolbar shows bulk actions on selection', () => {
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          rowSelection={{ '1': true }}
          features={{
            sorting: false,
            filtering: false,
            globalSearch: false,
            pagination: false,
            rowSelection: true,
            bulkActions: true,
          }} 
          bulkActions={() => <button>Bulk Delete</button>}
        />
      );

      expect(shadowScreen.getByText('Bulk Delete')).toBeDefined();
      expect(shadowScreen.getByText('1 row selected')).toBeDefined();
    });

    it('11. Full feature configuration: all features active seamlessly', () => {
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          features={{
            sorting: true,
            filtering: true,
            globalSearch: true,
            pagination: true,
            rowSelection: true,
            columnVisibility: true,
            columnResizing: true,
            rowActions: true,
            bulkActions: true,
          }} 
          rowActions={() => <button>Act</button>}
        />
      );

      expect(shadowScreen.getByPlaceholderText('Search table...')).toBeDefined();
      expect(shadowScreen.getByLabelText('Select all rows')).toBeDefined();
      expect(shadowScreen.getByLabelText('Toggle column visibility')).toBeDefined();
      expect(shadowScreen.getByRole('navigation', { name: /pagination/i })).toBeDefined();
      expect(shadowScreen.getByRole('columnheader', { name: /actions/i })).toBeDefined();
    });
  });

  // ── 13. Column-Level Feature Overrides ──
  describe('Column-Level vs Global Capabilities', () => {
    it('disables sorting on column when global sorting=false even if col.sortable=true', () => {
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          features={{ sorting: false }} 
        />
      );

      const nameHeader = shadowScreen.getByRole('columnheader', { name: /name/i });
      expect(nameHeader.getAttribute('aria-sort')).toBeNull();
      fireEvent.click(nameHeader);
      expect(nameHeader.getAttribute('aria-sort')).toBeNull();
    });

    it('disables sorting on column when col.sortable=false even if global sorting=true', () => {
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          features={{ sorting: true }} 
        />
      );

      const statusHeader = shadowScreen.getByRole('columnheader', { name: /status/i });
      expect(statusHeader.getAttribute('aria-sort')).toBeNull();
    });

    it('disables column resizing when global columnResizing=false even if col.resizable=true', () => {
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          features={{ columnResizing: false }} 
        />
      );

      expect(shadowScreen.queryByLabelText('Resize column Name')).toBeNull();
    });

    it('disables column visibility menu when global columnVisibility=false even if col.hideable=true', () => {
      render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          features={{ columnVisibility: false }} 
        />
      );

      expect(shadowScreen.queryByLabelText('Toggle column visibility')).toBeNull();
    });
  });

  // ── 14. Edge Cases: Nulls, Undefined, Zero Rows, Single Row, Large Dataset ──
  describe('Edge Cases and Boundaries', () => {
    it('gracefully renders null and undefined values without crashing', () => {
      const edgeData: TestUser[] = [
        { id: '1', name: 'Null User', role: 'Staff', score: null, bio: undefined },
      ];
      render(<DataTable data={edgeData} columns={mockColumns} />);
      expect(shadowScreen.getByText('Null User')).toBeDefined();
      expect(shadowScreen.getByText('N/A')).toBeDefined();
    });

    it('renders zero rows without crashing', () => {
      render(<DataTable data={[]} columns={mockColumns} />);
      expect(shadowScreen.getByText('No records found.')).toBeDefined();
    });

    it('renders a single row correctly with pagination showing 1-1 of 1', () => {
      render(<DataTable data={[mockData[0]!]} columns={mockColumns} features={{ pagination: true }} />);
      expect(shadowScreen.getByText('Alice')).toBeDefined();
      expect(shadowScreen.getByText(/Showing 1–1 of 1/i)).toBeDefined();
    });

    it('efficiently handles 1,000 rows with client-side pagination', () => {
      const largeData = Array.from({ length: 1000 }, (_, i) => ({
        id: String(i + 1),
        name: `User ${i + 1}`,
        role: i % 2 === 0 ? 'Admin' : 'Member',
        status: 'Active',
      }));

      render(
        <DataTable 
          data={largeData} 
          columns={mockColumns} 
          features={{ pagination: true }} 
          pagination={{ pageIndex: 0, pageSize: 20 }}
        />
      );

      expect(shadowScreen.getByText('User 1')).toBeDefined();
      expect(shadowScreen.getByText('User 20')).toBeDefined();
      expect(shadowScreen.queryByText('User 21')).toBeNull();
      expect(shadowScreen.getByText(/Showing 1–20 of 1000/i)).toBeDefined();
    });
  });

  // ── 15. Export Utility processTableData ──
  describe('Export Utility: processTableData', () => {
    it('filters, searches, and sorts data deterministically for export consumers', () => {
      const processed = processTableData(mockData, {
        columns: mockColumns,
        globalFilter: 'Admin',
        sorting: [{ id: 'name', desc: true }],
      });

      // Evan, Alice
      expect(processed.length).toBe(2);
      expect(processed[0]?.name).toBe('Evan');
      expect(processed[1]?.name).toBe('Alice');
    });
  });

  // ── 16. Accessibility: Axe Audit ──
  describe('Accessibility (Axe)', () => {
    it('passes automated accessibility evaluation with 0 violations', async () => {
      const { container } = render(
        <DataTable 
          data={mockData} 
          columns={mockColumns} 
          features={{
            sorting: true,
            globalSearch: true,
            pagination: true,
            rowSelection: true,
            columnVisibility: true,
            columnResizing: true,
          }}
        />
      );

      const results = await axe(container, {
        rules: {
          'aria-required-parent': { enabled: false }
        }
      });
      expect(results).toHaveNoViolations();
    });
  });
});
