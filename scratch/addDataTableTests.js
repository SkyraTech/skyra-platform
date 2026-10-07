const fs = require('fs');
const path = 'c:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/data-table/src/skyra-tech-data-table.test.ts';
let content = fs.readFileSync(path, 'utf8');

const newTests = `
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
    expect(rows[0].querySelector('td')!.textContent).toBe('Alice');
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
    expect(rows[0].querySelector('td')!.textContent).toBe('Bob');
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
`;

content = content.replace('});\n', newTests + '});\n');
fs.writeFileSync(path, content);
console.log("Done");
