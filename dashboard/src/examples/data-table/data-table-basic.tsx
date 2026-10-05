/**
 * @id data-table-basic
 * @title Basic Data Table
 * @apiId @skyra/data-table::DynamicDataTable
 * @packageId @skyra/data-table
 */
import React from 'react';
import { DynamicDataTable } from '@skyra-tech-platform/data-table';

export default function DataTableBasicExample() {
  const data = [
    { id: '1', name: 'Alice Smith', role: 'Admin', status: 'Active' },
    { id: '2', name: 'Bob Jones', role: 'Editor', status: 'Inactive' },
    { id: '3', name: 'Charlie Brown', role: 'Viewer', status: 'Active' },
  ];

  const columns: any[] = [
    { key: 'name', accessor: 'name', header: 'Name' },
    { key: 'role', accessor: 'role', header: 'Role' },
    { key: 'status', accessor: 'status', header: 'Status' },
  ];

  return (
    <div style={{ border: '1px solid var(--skyra-border)', borderRadius: 'var(--skyra-radius-md)', overflow: 'hidden' }}>
      <DynamicDataTable 
        data={data} 
        columns={columns} 
      />
    </div>
  );
}
