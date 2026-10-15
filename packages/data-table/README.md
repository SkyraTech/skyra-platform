# @skyra-tech-platform/data-table

Framework-agnostic data table Web Component with sorting, filtering and pagination. Importing the package registers `skyra-tech-data-table`.

## Installation

```sh
pnpm add @skyra-tech-platform/data-table
```

## Usage

```js
import '@skyra-tech-platform/data-table';

const table = document.createElement('skyra-tech-data-table');
table.columns = [{ accessor: 'name', header: 'Name' }];
table.data = [{ name: 'Skyra' }];
document.body.append(table);
```

The main entry exports `SkyraTechDataTable`, `processTableData` and table types such as `BaseColumnDef`. It does not export a React `DataTable` or `Pagination` component. Use element properties for array/object data; attributes cannot represent these objects.
