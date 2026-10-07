const fs = require('fs');
const path = 'c:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/data-table/src/skyra-tech-data-table.test.ts';

const content = `import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './skyra-tech-data-table';
import { SkyraTechDataTable } from './skyra-tech-data-table';

describe('SkyraTechDataTable', () => {
  let element: SkyraTechDataTable;

  beforeEach(() => {
    element = document.createElement('skyra-tech-data-table') as SkyraTechDataTable;
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('registers the custom element', () => {
    expect(customElements.get('skyra-tech-data-table')).toBeDefined();
    expect(element instanceof SkyraTechDataTable).toBe(true);
  });

  it('renders columns and data correctly', () => {
    element.columns = [
      { id: 'id', accessor: 'id', header: 'ID' },
      { id: 'name', accessor: 'name', header: 'Name' }
    ];
    element.data = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ];

    const shadow = element.shadowRoot!;
    const headers = shadow.querySelectorAll('th');
    expect(headers.length).toBe(2);
    expect(headers[0].textContent).toContain('ID');
    expect(headers[1].textContent).toContain('Name');

    const rows = shadow.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
    expect(rows[0].querySelectorAll('td')[0].textContent).toBe('1');
    expect(rows[0].querySelectorAll('td')[1].textContent).toBe('Alice');
  });

  it('renders loading state', () => {
    element.columns = [{ id: 'id', accessor: 'id', header: 'ID' }];
    element.isLoading = true;

    const shadow = element.shadowRoot!;
    const rows = shadow.querySelectorAll('tbody tr');
    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0].querySelector('.skyra-skeleton-bar')).not.toBeNull();
  });

  it('renders empty state', () => {
    element.columns = [{ id: 'id', accessor: 'id', header: 'ID' }];
    element.data = [];

    const shadow = element.shadowRoot!;
    const emptyState = shadow.querySelector('.empty-state');
    expect(emptyState).not.toBeNull();
  });

  it('handles sorting correctly', () => {
    element.features = { sorting: true };
    element.columns = [
      { id: 'value', accessor: 'value', header: 'Value', sortable: true }
    ];
    element.data = [
      { value: 3 },
      { value: 1 },
      { value: 2 }
    ];

    const shadow = element.shadowRoot!;
    const header = shadow.querySelector('th.skyra-th-sortable') as HTMLElement;
    
    header.click();
    expect(element.sorting).toEqual([{ id: 'value', desc: false }]);
    let cells = shadow.querySelectorAll('tbody td');
    expect(cells[0].textContent).toBe('1');
    
    header.click();
    expect(element.sorting).toEqual([{ id: 'value', desc: true }]);
    cells = shadow.querySelectorAll('tbody td');
    expect(cells[0].textContent).toBe('3');
  });

  it('emits selection events', () => {
    let selected: Record<string, boolean> | null = null;
    element.addEventListener('skyra-selection-change', (e: Event) => {
      selected = (e as CustomEvent).detail;
    });

    element.features = { rowSelection: true };
    element.columns = [{ id: 'id', accessor: 'id', header: 'ID' }];
    element.data = [{ id: 'row1' }, { id: 'row2' }];

    const shadow = element.shadowRoot!;
    const rowCheckboxes = shadow.querySelectorAll('tbody input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
    
    expect(rowCheckboxes.length).toBe(2);
    
    rowCheckboxes[0].checked = true;
    rowCheckboxes[0].dispatchEvent(new Event('change'));

    expect(selected).toEqual({ row1: true });
  });

  it('handles pagination', () => {
    element.features = { pagination: true };
    element.columns = [{ id: 'id', accessor: 'id', header: 'ID' }];
    element.data = Array.from({ length: 25 }, (_, i) => ({ id: i }));
    element.pagination = { pageIndex: 0, pageSize: 10 };

    const shadow = element.shadowRoot!;
    let rows = shadow.querySelectorAll('tbody tr');
    expect(rows.length).toBe(10);
    expect(rows[0].querySelector('td').textContent).toBe('0');

    element.pagination = { pageIndex: 1, pageSize: 10 };
    rows = shadow.querySelectorAll('tbody tr');
    expect(rows.length).toBe(10);
    expect(rows[0].querySelector('td').textContent).toBe('10');
  });

  it('handles filtering correctly', () => {
    element.features = { filtering: true };
    element.columns = [
      { id: 'name', accessor: 'name', header: 'Name', filterable: true }
    ];
    element.data = [
      { name: 'Alice' },
      { name: 'Bob' },
      { name: 'Charlie' }
    ];

    element.columnFilters = [{ id: 'name', value: 'al' }];
    
    const shadow = element.shadowRoot!;
    const rows = shadow.querySelectorAll('tbody tr');
    expect(rows.length).toBe(1);
    expect(rows[0].querySelector('td').textContent).toBe('Alice');
  });

  it('handles global filtering', () => {
    element.features = { globalSearch: true };
    element.columns = [
      { id: 'name', accessor: 'name', header: 'Name' }
    ];
    element.data = [
      { name: 'Alice' },
      { name: 'Bob' },
      { name: 'Charlie' }
    ];

    element.globalFilter = 'ob';
    
    const shadow = element.shadowRoot!;
    const rows = shadow.querySelectorAll('tbody tr');
    expect(rows.length).toBe(1);
    expect(rows[0].querySelector('td').textContent).toBe('Bob');
  });

  it('renders cell slots correctly', () => {
    element.columns = [
      { id: 'name', accessor: 'name', header: 'Name', cellSlot: (row) => \`slot-name-\${row.id}\` }
    ];
    element.data = [
      { id: 1, name: 'Alice' }
    ];

    const shadow = element.shadowRoot!;
    const slot = shadow.querySelector('tbody td slot');
    expect(slot).not.toBeNull();
    expect(slot?.getAttribute('name')).toBe('slot-name-1');
  });

  it('handles error state', () => {
    element.columns = [{ id: 'id', accessor: 'id', header: 'ID' }];
    element.error = 'Failed to load';

    const shadow = element.shadowRoot!;
    const errorState = shadow.querySelector('.error-state');
    expect(errorState).not.toBeNull();
    expect(errorState?.textContent).toContain('Failed to load');
  });
});
`;

fs.writeFileSync(path, content);
console.log("Done");
