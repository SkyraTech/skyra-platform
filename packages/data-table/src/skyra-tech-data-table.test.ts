import { describe, it, expect, beforeEach, afterEach } from 'vitest';
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
    // It should render skeleton rows
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
    
    // Sort asc
    header.click();
    expect(element.sorting).toEqual([{ id: 'value', desc: false }]);
    let cells = shadow.querySelectorAll('tbody td');
    expect(cells[0].textContent).toBe('1');
    
    // Sort desc
    header.click();
    expect(element.sorting).toEqual([{ id: 'value', desc: true }]);
    cells = shadow.querySelectorAll('tbody td');
    expect(cells[0].textContent).toBe('3');
  });

  it('emits selection events', () => {
    let selected: any = null;
    element.addEventListener('skyra-selection-change', (e: any) => {
      selected = e.detail;
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
    expect(rows[0].querySelector('td')!.textContent).toBe('0');

    // Go to next page
    element.pagination = { pageIndex: 1, pageSize: 10 };
    rows = shadow.querySelectorAll('tbody tr');
    expect(rows.length).toBe(10);
    expect(rows[0].querySelector('td')!.textContent).toBe('10');
  });
});
