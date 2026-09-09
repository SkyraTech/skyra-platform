'use client';
import React, { useState } from 'react';
import { NativeSelect, CustomSelect } from '@skyra/ui';
import { DemoSection, DemoBlock } from './DemoSection';

const OPTIONS = [
  { value: 'active', label: 'Active Status' },
  { value: 'pending', label: 'Pending Review' },
  { value: 'archived', label: 'Archived' },
  { value: 'deleted', label: 'Deleted (Disabled)', disabled: true },
];

const MANY_OPTIONS = Array.from({ length: 15 }, (_, i) => ({
  value: `opt-${i}`, label: `Option ${i + 1}`
}));

export function SelectDemo() {
  const [val1, setVal1] = useState('');
  const [val2, setVal2] = useState('');

  return (
    <DemoSection 
      title="Selects" 
      desc="Both native and custom accessible select components."
      erpSource="[B] PLATFORM EXTRACTION (CustomSelect.tsx, ui.css .form-select)"
    >
      <DemoBlock title="Native Select">
        <div style={{ width: '100%', maxWidth: '300px' }}>
          <NativeSelect 
            label="Status (Native)" 
            options={OPTIONS}
            placeholder="Select a status..."
          />
        </div>
      </DemoBlock>

      <DemoBlock title="Custom Select">
        <div style={{ width: '100%', maxWidth: '300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <CustomSelect 
            label="Status (Custom)" 
            options={OPTIONS}
            value={val1}
            onChange={setVal1}
            helper="Supports keyboard navigation."
          />
          <CustomSelect 
            label="Searchable Select" 
            options={MANY_OPTIONS}
            value={val2}
            onChange={setVal2}
            searchThreshold={5}
            helper="Automatically adds search input for >5 options."
          />
          <CustomSelect 
            label="Error State" 
            options={OPTIONS}
            value=""
            onChange={() => {}}
            error="Please select an option."
          />
        </div>
      </DemoBlock>
    </DemoSection>
  );
}
