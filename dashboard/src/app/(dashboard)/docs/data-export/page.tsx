'use client';

import React from 'react';
import { DocsLayout } from '../../../../components/docs/DocsLayout';
import { PackageMeta } from '../../../../components/docs/PackageMeta';
import { DocsHeader } from '../../../../components/docs/DocsHeader';
import { CodeBlock } from '../../../../components/docs/CodeBlock';
import { Callout } from '../../../../components/docs/Callout';
import { HeadingAnchor } from '../../../../components/docs/HeadingAnchor';
import Link from 'next/link';

const TOC = [
  { id: 'overview',       label: 'Overview' },
  { id: 'installation',   label: 'Installation' },
  { id: 'types',          label: 'Types & Interfaces' },
  { id: 'csv',            label: 'CSV Export' },
  { id: 'excel',          label: 'Excel Export' },
  { id: 'json',           label: 'JSON Export' },
  { id: 'tsv',            label: 'TSV Export' },
  { id: 'columns',        label: 'Column Configuration' },
];

const TD: React.CSSProperties = {
  padding: '0.625rem 1rem',
  borderBottom: '1px solid var(--skyra-border)',
  color: 'var(--skyra-text-muted)',
  verticalAlign: 'top',
};
const TH: React.CSSProperties = {
  textAlign: 'left',
  padding: '0.625rem 1rem',
  background: 'var(--skyra-bg-muted)',
  borderBottom: '1px solid var(--skyra-border)',
  color: 'var(--skyra-text-muted)',
  fontFamily: 'var(--skyra-font-body)',
  fontWeight: 600,
  fontSize: '0.75rem',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
};
const MONO: React.CSSProperties = {
  fontFamily: 'var(--skyra-font-mono)',
  fontSize: '0.8125rem',
  color: 'var(--skyra-text)',
};

function ApiTable({ rows }: { rows: { fn: string; signature: string; desc: string }[] }) {
  return (
    <div style={{ overflowX: 'auto', borderRadius: 'var(--skyra-radius-md)', border: '1px solid var(--skyra-border)', marginTop: '1rem' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
        <thead>
          <tr>
            <th style={TH}>Function</th>
            <th style={TH}>Signature</th>
            <th style={TH}>Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.fn} style={{ background: i % 2 === 0 ? 'var(--skyra-surface)' : 'var(--skyra-bg-muted)' }}>
              <td style={TD}><code style={MONO}>{r.fn}</code></td>
              <td style={TD}><code style={{ ...MONO, fontSize: '0.75rem', color: 'var(--skyra-text-muted)' }}>{r.signature}</code></td>
              <td style={{ ...TD, fontFamily: 'var(--skyra-font-body)' }}>{r.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DataExportDocsPage() {
  return (
    <DocsLayout toc={TOC}>
      <DocsHeader
        title="Data Export"
        description="Export tabular data to CSV, Excel (XML Spreadsheet 2003), JSON, and TSV formats. Pure string generators for server-side use plus browser-download helpers."
        breadcrumbs={[
          { label: 'Packages', href: '/packages' },
          { label: 'data-export', href: '/packages/data-export' },
          { label: 'Documentation' },
        ]}
        badges={[
          { label: 'stable', variant: 'stable' },
          { label: 'mixed', variant: 'tech' },
        ]}
      />

      <PackageMeta
        packageName="@skyra-tech-platform/data-export"
        type="TypeScript Library"
        version="0.1.0"
      />

      {/* Overview */}
      <section id="overview" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="overview" level={2}>Overview</HeadingAnchor>
        <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
          <code>@skyra-tech-platform/data-export</code> provides four export formats, each exposing two function pairs:
        </p>
        <div style={{ overflowX: 'auto', borderRadius: 'var(--skyra-radius-md)', border: '1px solid var(--skyra-border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
            <thead>
              <tr>
                <th style={TH}>Format</th>
                <th style={TH}>Generator (Node + Browser)</th>
                <th style={TH}>Browser Download Helper</th>
                <th style={TH}>MIME Type</th>
              </tr>
            </thead>
            <tbody>
              {[
                { fmt: 'CSV', gen: 'exportToCsv()', dl: 'downloadCsv()', mime: 'text/csv' },
                { fmt: 'Excel', gen: 'exportToExcelXml()', dl: 'downloadExcel()', mime: 'application/vnd.ms-excel' },
                { fmt: 'JSON', gen: 'exportToJson()', dl: 'downloadJson()', mime: 'application/json' },
                { fmt: 'TSV', gen: 'exportToTsv()', dl: 'downloadTsv()', mime: 'text/tab-separated-values' },
              ].map((r, i) => (
                <tr key={r.fmt} style={{ background: i % 2 === 0 ? 'var(--skyra-surface)' : 'var(--skyra-bg-muted)' }}>
                  <td style={TD}><strong style={{ color: 'var(--skyra-text)' }}>{r.fmt}</strong></td>
                  <td style={TD}><code style={MONO}>{r.gen}</code></td>
                  <td style={TD}><code style={MONO}>{r.dl}</code></td>
                  <td style={TD}><code style={{ ...MONO, fontSize: '0.75rem' }}>{r.mime}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout type="info" title="Runtime safety">
          The <strong>generator</strong> functions are safe for Node.js and edge runtimes — they return plain strings.
          The <strong>download helpers</strong> use <code>Blob</code> and <code>document</code> APIs and silently no-op on the server.
        </Callout>
      </section>

      {/* Installation */}
      <section id="installation" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="installation" level={2}>Installation</HeadingAnchor>
        <CodeBlock language="bash" code={`pnpm add @skyra-tech-platform/data-export`} />
      </section>

      {/* Types */}
      <section id="types" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="types" level={2}>Types & Interfaces</HeadingAnchor>
        <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
          Core types exported from <code>@skyra-tech-platform/data-export</code>:
        </p>
        <CodeBlock
          language="typescript"
          code={`import type {
  ExportColumn,       // Column definition with optional formatter
  ExportScope,        // 'all' | 'page' | 'filtered' | 'selected'
  ExportFormat,       // 'csv' | 'xlsx' | 'json' | 'tsv'
  BaseExportOptions,  // columns?, headers?, dateFormat?
  CsvExportOptions,   // extends Base + delimiter?, includeBom?, protectFormulas?, nullValue?
  CsvDownloadOptions, // extends Csv + filename?
  ExcelExportOptions, // extends Base + sheetName?, sheets?
  ExcelDownloadOptions,
  JsonExportOptions,  // extends Base + pretty?
  JsonDownloadOptions,
  TsvExportOptions,
  TsvDownloadOptions,
  ExcelSheetConfig,   // { name, data, columns? } — for multi-sheet Excel
} from '@skyra-tech-platform/data-export';`}
        />
      </section>

      {/* CSV */}
      <section id="csv" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="csv" level={2}>CSV Export</HeadingAnchor>
        <CodeBlock
          language="typescript"
          code={`import { exportToCsv, downloadCsv } from '@skyra-tech-platform/data-export';

const data = [
  { id: 1, name: 'Alice', amount: 1234.50 },
  { id: 2, name: 'Bob',   amount: 9999.00 },
];

// Generate raw CSV string (server-safe)
const csv = exportToCsv(data);
// \\uFEFF (BOM) + "Id,Name,Amount\\r\\n1,Alice,1234.5\\r\\n2,Bob,9999"

// Custom columns + options
const csv2 = exportToCsv(data, {
  columns: [
    { key: 'name',   header: 'Customer Name' },
    { key: 'amount', header: 'Total',
      formatter: (v) => \`₹\${Number(v).toFixed(2)}\` },
  ],
  delimiter: ';',     // default ','
  includeBom: true,   // default true (aids Excel on Windows)
  protectFormulas: true, // prefix =,+,-,@ cells with ' to prevent injection
  nullValue: 'N/A',   // representation for null/undefined
});

// Browser download
downloadCsv(data, { filename: 'report', delimiter: ',' });`}
        />
        <ApiTable rows={[
          { fn: 'exportToCsv', signature: '<T>(data: T[], options?: CsvExportOptions<T>) => string', desc: 'Generates a UTF-8 CSV string. Includes BOM by default. Infers columns from first row when options.columns is omitted.' },
          { fn: 'downloadCsv', signature: '<T>(data: T[], options?: CsvDownloadOptions<T>) => void', desc: 'Triggers browser download. No-ops in Node.js (no window). filename defaults to export.csv.' },
          { fn: 'escapeCsvCell', signature: '(val, delimiter?, protectFormulas?, nullValue?) => string', desc: 'Escapes a single cell value. Wraps in quotes when needed. Prefixes formula injection characters with a single quote.' },
        ]} />
      </section>

      {/* Excel */}
      <section id="excel" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="excel" level={2}>Excel Export</HeadingAnchor>
        <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
          Generates XML Spreadsheet 2003 format (<code>.xls</code>) which is natively opened by Excel and LibreOffice. Supports multi-sheet exports and styled headers.
        </p>
        <CodeBlock
          language="typescript"
          code={`import { exportToExcelXml, downloadExcel } from '@skyra-tech-platform/data-export';

// Single sheet
const xml = exportToExcelXml(data, {
  sheetName: 'Invoices',
  columns: [
    { key: 'id',     header: 'Invoice #' },
    { key: 'name',   header: 'Client' },
    { key: 'amount', header: 'Amount',
      formatter: (v) => Number(v).toFixed(2) },
  ],
});

// Multi-sheet (uses sheets option; overrides data)
const multiXml = exportToExcelXml([], {
  sheets: [
    { name: 'Invoices', data: invoiceRows },
    { name: 'Expenses', data: expenseRows },
  ],
});

// Browser download
downloadExcel(data, { filename: 'report', sheetName: 'Data' });`}
        />
        <ApiTable rows={[
          { fn: 'exportToExcelXml', signature: '<T>(data: T[], options?: ExcelExportOptions<T>) => string', desc: 'Produces XML Spreadsheet 2003 string with styled headers, auto column widths, and typed cells. Multi-sheet via options.sheets.' },
          { fn: 'downloadExcel', signature: '<T>(data: T[], options?: ExcelDownloadOptions<T>) => void', desc: 'Triggers browser download as .xls. filename defaults to export.xls.' },
        ]} />
      </section>

      {/* JSON */}
      <section id="json" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="json" level={2}>JSON Export</HeadingAnchor>
        <CodeBlock
          language="typescript"
          code={`import { exportToJson, downloadJson } from '@skyra-tech-platform/data-export';

// Pretty-printed JSON string (default)
const json = exportToJson(data);
// '[\\n  { "id": 1, ... }\\n]'

// Compact
const compact = exportToJson(data, { pretty: false });

// With column mapping (renames keys to header labels)
const mapped = exportToJson(data, {
  columns: [
    { key: 'id',   header: 'Invoice Number' },
    { key: 'name', header: 'Client Name' },
    { key: 'amount', header: 'Total', exportable: false }, // skipped
  ],
});

// Browser download
downloadJson(data, { filename: 'export' });`}
        />
        <ApiTable rows={[
          { fn: 'exportToJson', signature: '<T>(data: T[], options?: JsonExportOptions<T>) => string', desc: 'Generates JSON string. When columns are provided, maps data to header-keyed objects and skips non-exportable columns.' },
          { fn: 'downloadJson', signature: '<T>(data: T[], options?: JsonDownloadOptions<T>) => void', desc: 'Triggers browser download as .json. filename defaults to export.json.' },
        ]} />
      </section>

      {/* TSV */}
      <section id="tsv" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="tsv" level={2}>TSV Export</HeadingAnchor>
        <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
          TSV (Tab-Separated Values) is a variant of CSV that uses tab characters as delimiters. Shares the same options as CSV (minus the <code>delimiter</code> override — it is always <code>\t</code>).
        </p>
        <CodeBlock
          language="typescript"
          code={`import { exportToTsv, downloadTsv } from '@skyra-tech-platform/data-export';

const tsv = exportToTsv(data);
downloadTsv(data, { filename: 'export' });`}
        />
        <ApiTable rows={[
          { fn: 'exportToTsv', signature: '<T>(data: T[], options?: TsvExportOptions<T>) => string', desc: 'Generates a tab-delimited string. Inherits all CSV options (protectFormulas, nullValue, etc.).' },
          { fn: 'downloadTsv', signature: '<T>(data: T[], options?: TsvDownloadOptions<T>) => void', desc: 'Triggers browser download as .tsv. filename defaults to export.tsv.' },
        ]} />
      </section>

      {/* Column Configuration */}
      <section id="columns" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="columns" level={2}>Column Configuration</HeadingAnchor>
        <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
          The <code>ExportColumn</code> interface controls how each data field is labelled, formatted, and whether it is included in the export:
        </p>
        <CodeBlock
          language="typescript"
          code={`interface ExportColumn<T = any> {
  key: string;           // Property key on each data row
  header: string;        // Column header label in the output
  exportable?: boolean;  // If false, column is excluded (JSON only). Default: true.
  formatter?: (          // Custom cell value transformation
    value: any,
    row: T
  ) => string | number | boolean | null | undefined;
}

// Example: format dates and currencies
const columns: ExportColumn<Invoice>[] = [
  { key: 'date',   header: 'Date',
    formatter: (v) => new Date(v).toLocaleDateString('en-IN') },
  { key: 'amount', header: 'Amount (INR)',
    formatter: (v) => Number(v).toFixed(2) },
  { key: 'secret', header: 'Internal', exportable: false },
];`}
        />
        <Callout type="info" title="Auto-inferred columns">
          When <code>columns</code> is omitted, the package auto-infers columns from the keys of the first data row — useful for quick one-off exports.
        </Callout>
      </section>

      <div style={{ borderTop: '1px solid var(--skyra-border)', paddingTop: '2rem', marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/packages/data-export" style={{ fontSize: '0.875rem', color: 'var(--skyra-text-muted)', textDecoration: 'none' }}>
          ← Package overview
        </Link>
        <Link href="/packages" style={{ fontSize: '0.875rem', color: 'var(--skyra-primary)', textDecoration: 'none' }}>
          All Packages →
        </Link>
      </div>
    </DocsLayout>
  );
}
