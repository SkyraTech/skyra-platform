'use client';

import React, { useState } from 'react';
import { ExportButton, ExportMenu, Button, Input, Checkbox, DynamicSelect } from '@skyra/ui';
import { ExportFormat, ExportScope, ExportColumn } from '@skyra/data-export';

const ALL_DATA = [
  { id: 'TX-1001', customer: 'Acme Global Corp', amount: 14250.00, status: 'Paid', date: '2026-09-01' },
  { id: 'TX-1002', customer: 'Wayne Enterprises, Ltd.', amount: 38900.50, status: 'Pending', date: '2026-09-03' },
  { id: 'TX-1003', customer: 'Stark Industries "Defense"', amount: 95000.00, status: 'Paid', date: '2026-09-05' },
  { id: 'TX-1004', customer: 'Cyberdyne Systems\nRobotics', amount: 12400.00, status: 'Overdue', date: '2026-09-07' },
  { id: 'TX-1005', customer: 'Massive Dynamic Inc', amount: 4500.00, status: 'Paid', date: '2026-09-08' },
];

const ALL_COLUMNS: ExportColumn[] = [
  { key: 'id', header: 'Transaction ID' },
  { key: 'customer', header: 'Customer Organization' },
  { key: 'amount', header: 'Total Value (USD)' },
  { key: 'status', header: 'Payment Status' },
  { key: 'date', header: 'Invoice Date' },
];

export function ExportWorkbench() {
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [scope, setScope] = useState<ExportScope>('all');
  const [filename, setFilename] = useState('enterprise-export');
  
  // Columns
  const [selectedColumns, setSelectedColumns] = useState<string[]>(ALL_COLUMNS.map(c => c.key));
  
  // Options
  const [headers, setHeaders] = useState(true);
  const [nullValue, setNullValue] = useState('');
  const [delimiter, setDelimiter] = useState(',');
  const [includeBom, setIncludeBom] = useState(true);
  const [protectFormulas, setProtectFormulas] = useState(true);

  // Derived columns
  const activeColumns = ALL_COLUMNS.filter(c => selectedColumns.includes(c.key));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', padding: '1.5rem', background: 'var(--skyra-surface)', border: '1px solid var(--skyra-border)', borderRadius: 'var(--skyra-radius-md)' }}>
        
        {/* FORMAT & SCOPE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0, color: 'var(--skyra-text)' }}>Format & Scope</h3>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', color: 'var(--skyra-text-muted)' }}>Export Format</label>
            <DynamicSelect 
              value={{ value: format, label: format.toUpperCase() }} 
              onChange={(val: any) => setFormat(val?.value as ExportFormat)} 
              options={[
                { value: 'csv', label: 'CSV (RFC-4180)' },
                { value: 'xlsx', label: 'Excel (.xlsx)' },
                { value: 'json', label: 'JSON' },
                { value: 'tsv', label: 'TSV' }
              ]} 
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', color: 'var(--skyra-text-muted)' }}>Dataset Scope</label>
            <DynamicSelect 
              value={{ value: scope, label: scope === 'all' ? 'All Records' : scope === 'page' ? 'Current Page Only' : scope === 'filtered' ? 'Filtered Records' : 'Selected Records Only' }} 
              onChange={(val: any) => setScope(val?.value as ExportScope)} 
              options={[
                { value: 'all', label: 'All Records' },
                { value: 'page', label: 'Current Page Only' },
                { value: 'filtered', label: 'Filtered Records' },
                { value: 'selected', label: 'Selected Records Only' }
              ]} 
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', color: 'var(--skyra-text-muted)' }}>Filename</label>
            <Input value={filename} onChange={(e) => setFilename(e.target.value)} placeholder="export" />
          </div>
        </div>

        {/* COLUMNS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0, color: 'var(--skyra-text)' }}>Columns</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {ALL_COLUMNS.map((col) => (
              <Checkbox
                key={col.key}
                checked={selectedColumns.includes(col.key)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedColumns([...selectedColumns, col.key]);
                  } else {
                    setSelectedColumns(selectedColumns.filter((k) => k !== col.key));
                  }
                }}
                label={col.header}
              />
            ))}
          </div>
        </div>

        {/* OPTIONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0, color: 'var(--skyra-text)' }}>Export Options</h3>
          <Checkbox checked={headers} onChange={(e) => setHeaders(e.target.checked)} label="Include Column Headers" />
          
          {format === 'csv' && (
            <>
              <Checkbox checked={includeBom} onChange={(e) => setIncludeBom(e.target.checked)} label="Include UTF-8 BOM" />
              <Checkbox checked={protectFormulas} onChange={(e) => setProtectFormulas(e.target.checked)} label="CSV Formula Protection" />
              
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', color: 'var(--skyra-text-muted)' }}>CSV Delimiter</label>
                <NativeSelect 
                  value={delimiter} 
                  onChange={(e) => setDelimiter(e.target.value)} 
                  style={{ width: '100%' }}
                  options={[
                    { value: ',', label: 'Comma (,)' },
                    { value: ';', label: 'Semicolon (;)' },
                    { value: '|', label: 'Pipe (|)' }
                  ]} 
                />
              </div>
            </>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', color: 'var(--skyra-text-muted)' }}>Null/Empty Representation</label>
            <Input value={nullValue} onChange={(e) => setNullValue(e.target.value)} placeholder="Leave blank for standard" />
          </div>
        </div>
      </div>

      <div style={{ padding: '1.5rem', background: 'var(--skyra-surface)', border: '1px solid var(--skyra-border)', borderRadius: 'var(--skyra-radius-md)' }}>
         <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0, marginBottom: '1rem', color: 'var(--skyra-text)' }}>Export Preview & Action</h3>
         
         <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--skyra-bg)', borderRadius: 'var(--skyra-radius-sm)', fontSize: '0.85rem', fontFamily: 'monospace' }}>
            <div><strong>Target File:</strong> {filename}.{format}</div>
            <div><strong>Columns:</strong> {activeColumns.length} included</div>
            <div><strong>Scope:</strong> {scope} ({ALL_DATA.length} rows mock)</div>
         </div>

         <div style={{ display: 'flex', gap: '1rem' }}>
            <ExportButton
              format={format}
              data={ALL_DATA}
              columns={activeColumns}
              filename={filename}
              variant="primary"
            >
              Generate {format.toUpperCase()}
            </ExportButton>
            
            <ExportMenu
              data={ALL_DATA}
              columns={activeColumns}
              filename={filename}
              onExportPdf={() => alert('PDF export callback triggered!')}
              onPrint={() => window.print()}
            />
         </div>
      </div>
    </div>
  );
}
