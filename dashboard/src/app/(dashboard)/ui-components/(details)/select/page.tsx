'use client';

import React, { useState } from 'react';
import '@skyra-tech-platform/dynamic-select';
import { DemoSection, DemoBlock } from '@/components/demos/DemoSection';
import { Card, Badge } from '@/components/ui';

const COUNTRY_OPTIONS = [
  { value: 'in', label: 'India', description: 'Asia-Pacific Regional Hub' },
  { value: 'us', label: 'United States', description: 'North America Enterprise Center' },
  { value: 'gb', label: 'United Kingdom', description: 'Europe & Western Hub' },
  { value: 'de', label: 'Germany', description: 'Central European Operations' },
  { value: 'sg', label: 'Singapore', description: 'ASEAN Financial Gateway' },
  { value: 'jp', label: 'Japan', description: 'East Asia Tech Hub' },
  { value: 'au', label: 'Australia', description: 'Oceania Regional Center' },
];

const MODULE_OPTIONS = [
  { value: 'billing', label: 'Billing & Invoicing', group: 'Finance' },
  { value: 'ledger', label: 'General Ledger', group: 'Finance' },
  { value: 'taxation', label: 'GST & Corporate Tax', group: 'Finance' },
  { value: 'inventory', label: 'Stock & Warehouse', group: 'Supply Chain' },
  { value: 'procurement', label: 'PO & Vendor Sourcing', group: 'Supply Chain' },
  { value: 'payroll', label: 'HR & Employee Payroll', group: 'Operations' },
];

export default function DynamicSelectShowcasePage() {
  const [singleValue, setSingleValue] = useState<any>('in');
  const [multiValue, setMultiValue] = useState<any>(['billing', 'taxation']);
  const [creatableValue, setCreatableValue] = useState<any>(null);

  return (
    <div className="dash-page" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--skyra-text)', margin: 0 }}>
          DynamicSelect Component
        </h1>
        <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
          Unified framework-agnostic dropdown and combobox Web Component supporting single and multi-selection, fuzzy search filtering, option grouping, select-all, and dynamic +N chips.
        </p>
      </div>

      {/* 1. Single Selection */}
      <DemoSection title="1. Single Selection with Search" desc="Standard dropdown selection with client-side fuzzy search filtering and item descriptions.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="Single Select (Country)">
            <div style={{ width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <skyra-tech-dynamic-select
                label="Primary Operating Country"
                placeholder="Select a country..."
                searchable
                clearable
                options={COUNTRY_OPTIONS}
                value={singleValue}
                onChange={(val) => {
                  if (val && !Array.isArray(val) && 'value' in val) {
                    setSingleValue(val.value);
                  } else {
                    setSingleValue(val);
                  }
                }}
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--skyra-text-muted)' }}>
                Active Selection: <strong>{typeof singleValue === 'string' ? singleValue : JSON.stringify(singleValue)}</strong>
              </span>
            </div>
          </DemoBlock>

          <DemoBlock title="Disabled State">
            <div style={{ width: '100%', maxWidth: '380px' }}>
              <skyra-tech-dynamic-select
                label="Locked Jurisdiction"
                placeholder="Cannot modify"
                disabled
                options={COUNTRY_OPTIONS}
                value="us"
              />
            </div>
          </DemoBlock>
        </div>
      </DemoSection>

      {/* 2. Multi-Select & Chips */}
      <DemoSection title="2. Multi-Select with Grouping" desc="Select multiple modules with category grouping, clear all, and compact chip representation.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="Multi-Select (ERP Modules)">
            <div style={{ width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <skyra-tech-dynamic-select
                label="Active Workspace Modules"
                mode="multiple"
                searchable
                clearable
                select-all
                grouping
                options={MODULE_OPTIONS}
                value={multiValue}
                onChange={(val) => {
                  if (Array.isArray(val)) {
                    setMultiValue(val.map(v => typeof v === 'object' && v !== null && 'value' in v ? v.value : v));
                  } else {
                    setMultiValue(val ? [val] : []);
                  }
                }}
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--skyra-text-muted)' }}>Selected ({Array.isArray(multiValue) ? multiValue.length : 0}):</span>
                {Array.isArray(multiValue) && multiValue.map((v: string) => (
                  <Badge key={v} variant="primary" size="sm">{v}</Badge>
                ))}
              </div>
            </div>
          </DemoBlock>

          <DemoBlock title="Validation & Required">
            <div style={{ width: '100%', maxWidth: '440px' }}>
              <skyra-tech-dynamic-select
                label="Mandatory Department"
                placeholder="Choose a department..."
                required
                error="Department selection is required for access provisioning"
                options={MODULE_OPTIONS}
              />
            </div>
          </DemoBlock>
        </div>
      </DemoSection>
    </div>
  );
}
