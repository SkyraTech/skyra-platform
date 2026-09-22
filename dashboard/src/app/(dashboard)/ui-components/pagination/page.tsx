'use client';

import React, { useState } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationFirst,
  PaginationLast,
  PaginationEllipsis,
  DynamicSelect,
  Card,
  Badge,
} from '@skyra/ui';
import { DemoSection, DemoBlock } from '@/components/demos/DemoSection';

// Mock invoice dataset for realistic table integration
const MOCK_INVOICES = Array.from({ length: 65 }, (_, i) => ({
  id: `INV-${String(1001 + i).padStart(4, '0')}`,
  customer: ['Acme Corp', 'Global Logistics', 'Apex Systems', 'Zenith Retail', 'Nova Tech'][i % 5],
  date: `2026-09-${String((i % 28) + 1).padStart(2, '0')}`,
  amount: `₹${((i + 1) * 3450).toLocaleString('en-IN')}`,
  status: ['PAID', 'PENDING', 'OVERDUE', 'DRAFT'][i % 4],
}));

export default function PaginationShowcasePage() {
  const [basicPage, setBasicPage] = useState(1);
  const [middlePage, setMiddlePage] = useState(10);
  const [outlinePage, setOutlinePage] = useState(5);
  const [compactPage, setCompactPage] = useState(3);

  // Table pagination state
  const [tablePage, setTablePage] = useState(1);
  const [pageSize, setPageSize] = useState('10');

  const pageSizeNum = parseInt(pageSize, 10);
  const totalTablePages = Math.ceil(MOCK_INVOICES.length / pageSizeNum);
  const paginatedInvoices = MOCK_INVOICES.slice(
    (tablePage - 1) * pageSizeNum,
    tablePage * pageSizeNum
  );

  return (
    <div className="dash-page" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--skyra-text)', margin: 0 }}>
          Pagination Component
        </h1>
        <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
          Accessible navigation landmark with pure page calculation engine, controlled state, intelligent ellipsis placement, keyboard navigation, and responsive overflow management.
        </p>
      </div>

      {/* 1. Basic & Managed Pagination */}
      <DemoSection title="1. Managed Controlled Pagination" desc="All-in-one pagination component with boundary counts, sibling counts, and intelligent ellipsis placement." erpSource="Platform Foundation">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="Standard Pagination (5 Pages)">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '1rem 0' }}>
              <Pagination
                page={basicPage}
                pageCount={5}
                onPageChange={setBasicPage}
              />
              <span style={{ fontSize: '0.82rem', color: 'var(--skyra-text-muted)' }}>
                Active Page: <strong>{basicPage}</strong> of 5
              </span>
            </div>
          </DemoBlock>

          <DemoBlock title="Large Range with Middle Ellipsis (25 Pages)">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '1rem 0' }}>
              <Pagination
                page={middlePage}
                pageCount={25}
                showFirstLast
                onPageChange={setMiddlePage}
              />
              <span style={{ fontSize: '0.82rem', color: 'var(--skyra-text-muted)' }}>
                Active Page: <strong>{middlePage}</strong> of 25 (with First/Last jumps)
              </span>
            </div>
          </DemoBlock>
        </div>
      </DemoSection>

      {/* 2. Visual Variants & Sizes */}
      <DemoSection title="2. Sizes &amp; Variants" desc="Support for sm, md, lg sizes and outline and compact variants for space-constrained viewports." erpSource="Platform Foundation">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="Outline Variant (Size: SM)">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '1rem 0' }}>
              <Pagination
                variant="outline"
                size="sm"
                page={outlinePage}
                pageCount={8}
                onPageChange={setOutlinePage}
              />
            </div>
          </DemoBlock>

          <DemoBlock title="Compact Variant (Mobile Friendly)">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '1rem 0' }}>
              <Pagination
                variant="compact"
                size="sm"
                page={compactPage}
                pageCount={12}
                onPageChange={setCompactPage}
              />
            </div>
          </DemoBlock>

          <DemoBlock title="Disabled State">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '1rem 0' }}>
              <Pagination
                page={2}
                pageCount={6}
                disabled
                onPageChange={() => {}}
              />
            </div>
          </DemoBlock>

          <DemoBlock title="Composable Primitives Architecture">
            <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem 0' }}>
              <Pagination aria-label="Custom Composable Pagination">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={() => {}} />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink>2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink>99</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext onClick={() => {}} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </DemoBlock>
        </div>
      </DemoSection>

      {/* 3. Realistic DataTable Integration */}
      <DemoSection title="3. Table Dataset &amp; Page Size Integration" desc="Demonstrating realistic dataset pagination slicing with dynamic page size selection and record counters." erpSource="skyra-erp/src/components/ui/table">
        <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Header & Page Size Selector */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--skyra-text)' }}>
                Invoices Ledger
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--skyra-text-muted)' }}>
                Showing {(tablePage - 1) * pageSizeNum + 1}–{Math.min(tablePage * pageSizeNum, MOCK_INVOICES.length)} of {MOCK_INVOICES.length} records
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--skyra-text-muted)' }}>Rows per page:</span>
              <div style={{ width: '90px' }}>
                <DynamicSelect
                  value={pageSize}
                  onChange={(val) => {
                    setPageSize(val as string);
                    setTablePage(1);
                  }}
                  options={[
                    { value: '5', label: '5' },
                    { value: '10', label: '10' },
                    { value: '25', label: '25' },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto', border: '1px solid var(--skyra-border)', borderRadius: 'var(--skyra-radius-md)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: 'var(--skyra-surface)', borderBottom: '1px solid var(--skyra-border)', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--skyra-text)' }}>Invoice ID</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--skyra-text)' }}>Customer</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--skyra-text)' }}>Date</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--skyra-text)' }}>Amount</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--skyra-text)' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedInvoices.map((inv) => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid var(--skyra-border)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--skyra-font-mono, monospace)', fontWeight: 600 }}>{inv.id}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{inv.customer}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--skyra-text-muted)' }}>{inv.date}</td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{inv.amount}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <Badge
                        variant={
                          inv.status === 'PAID'
                            ? 'success'
                            : inv.status === 'PENDING'
                            ? 'warning'
                            : inv.status === 'OVERDUE'
                            ? 'danger'
                            : 'neutral'
                        }
                        size="sm"
                      >
                        {inv.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer Pagination */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--skyra-text-muted)' }}>
              Page {tablePage} of {totalTablePages}
            </span>
            <Pagination
              page={tablePage}
              pageCount={totalTablePages}
              showFirstLast
              onPageChange={setTablePage}
            />
          </div>
        </Card>
      </DemoSection>
    </div>
  );
}
