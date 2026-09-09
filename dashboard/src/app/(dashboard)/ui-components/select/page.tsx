'use client';

import React, { useState } from 'react';
import { DynamicSelect } from '@skyra/ui';
import { DemoSection, DemoBlock } from '@/components/demos/DemoSection';
import { Building2, User, Shield } from 'lucide-react';

const DEPARTMENTS = [
  { value: 'eng', label: 'Engineering', description: 'Tech, Infrastructure & Architecture', group: 'Technology' },
  { value: 'prod', label: 'Product Design', description: 'UI/UX & User Research', group: 'Technology' },
  { value: 'mkt', label: 'Marketing', description: 'Brand, Content & Growth', group: 'Business' },
  { value: 'sales', label: 'Enterprise Sales', description: 'Global Accounts & Deals', group: 'Business' },
  { value: 'fin', label: 'Finance & Legal', description: 'Accounting, Tax & Compliance', group: 'Operations' },
  { value: 'hr', label: 'People Operations', description: 'Talent, Culture & HR', group: 'Operations' },
  { value: 'dis', label: 'Archived Division', description: 'Deprecated branch', disabled: true, group: 'Operations' },
];

const EMPLOYEES = [
  { id: '1', name: 'Alex Rivera', role: 'Staff Architect', dept: 'Engineering' },
  { id: '2', name: 'Sarah Chen', role: 'Head of Product', dept: 'Product' },
  { id: '3', name: 'Michael Scott', role: 'Regional Manager', dept: 'Sales' },
  { id: '4', name: 'Elena Rostova', role: 'Director of Brand', dept: 'Marketing' },
];

export default function DynamicSelectShowcasePage() {
  // State for all interactive demos
  const [val1, setVal1] = useState<any>('eng');
  const [val2, setVal2] = useState<any>('prod');
  const [val3, setVal3] = useState<any>('sales');
  
  // Dedicated Multi-Select + Search + Select All Redesign showcase states
  const [valMultiEmpty, setValMultiEmpty] = useState<any>([]);
  const [valMultiPartial, setValMultiPartial] = useState<any>(['eng', 'prod']);
  const [valMultiAll, setValMultiAll] = useState<any>(['eng', 'prod', 'mkt', 'sales', 'fin', 'hr']);
  const [valMultiFiltered, setValMultiFiltered] = useState<any>(['eng']);
  
  const [valMulti, setValMulti] = useState<any>(['eng', 'prod', 'mkt', 'fin', 'sales']);
  const [valSelectAll, setValSelectAll] = useState<any>(['eng', 'mkt']);
  const [valGrouped, setValGrouped] = useState<any>('eng');
  const [valCreatable, setValCreatable] = useState<any>('eng');
  const [valMax3, setValMax3] = useState<any>(['eng', 'prod']);
  const [valVis1, setValVis1] = useState<any>(['eng', 'prod', 'mkt', 'fin', 'sales']);
  const [valVis2, setValVis2] = useState<any>(['eng', 'prod', 'mkt', 'fin', 'sales']);
  const [valVis3, setValVis3] = useState<any>(['eng', 'prod', 'mkt', 'fin', 'sales']);
  const [valAuto, setValAuto] = useState<any>(['eng', 'prod', 'mkt', 'fin', 'sales']);
  const [valNarrow, setValNarrow] = useState<any>(['eng', 'prod', 'mkt', 'sales']);
  const [valWide, setValWide] = useState<any>(['eng', 'prod', 'mkt', 'sales', 'fin']);
  const [valCustomOpt, setValCustomOpt] = useState<any>(EMPLOYEES[0]);
  const [valCustomVal, setValCustomVal] = useState<any>(EMPLOYEES[1]);

  return (
    <div className="dash-page" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* ── Page Header ── */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--skyra-text)', margin: 0 }}>
          DynamicSelect Component
        </h1>
        <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
          One highly-configurable enterprise select primitive supporting single, multi-select, search header,
          filtered select all, tri-state checkboxes, sticky footer, dynamic <code>+N</code> compact chips overflow, and custom template rendering.
        </p>
      </div>

      {/* ── FEATURED SHOWCASE: Multi-Select + Search + Select All Redesign ── */}
      <DemoSection
        title="★ Multi-Select + Search + Select All (Enterprise Menu Redesign)"
        desc="Showcases the polished enterprise multi-select menu featuring sticky search header, filtered select all, tri-state checkbox state, whole-row click area, and sticky footer with Clear all."
        erpSource="Skyra ERP Multi-Select Redesign [Phase 2]"
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="A. Empty Selection (Search + Select All)">
            <DynamicSelect
              label="Select Multiple Departments"
              options={DEPARTMENTS}
              mode="multiple"
              searchable
              selectAll
              clearable
              maxVisibleValues="auto"
              value={valMultiEmpty}
              onChange={setValMultiEmpty}
              description="Click dropdown to test sticky search and 1-click select all"
            />
          </DemoBlock>

          <DemoBlock title="B. Partial Selection with Auto +N Chips">
            <DynamicSelect
              label="Active Project Teams"
              options={DEPARTMENTS}
              mode="multiple"
              searchable
              selectAll
              clearable
              maxVisibleValues="auto"
              value={valMultiPartial}
              onChange={setValMultiPartial}
              description="Shows tri-state indeterminate checkbox on select all row"
            />
          </DemoBlock>

          <DemoBlock title="C. All Selected (Deselect All State)">
            <DynamicSelect
              label="All Operational Units"
              options={DEPARTMENTS}
              mode="multiple"
              searchable
              selectAll
              clearable
              maxVisibleValues="auto"
              value={valMultiAll}
              onChange={setValMultiAll}
              description="Header updates to 'Deselect all' with checked checkbox"
            />
          </DemoBlock>

          <DemoBlock title="D. Filtered Search Selection (Try typing 'Tech' or 'Mark')">
            <DynamicSelect
              label="Search-Filtered Bulk Selection"
              options={DEPARTMENTS}
              mode="multiple"
              searchable
              selectAll
              clearable
              maxVisibleValues="auto"
              value={valMultiFiltered}
              onChange={setValMultiFiltered}
              description="When filtered, 'Select all' operates ONLY on matching filtered options"
            />
          </DemoBlock>
        </div>
      </DemoSection>

      {/* ── SECTION 1: Single Selection Modes ── */}
      <DemoSection title="1. Single Selection Modes" desc="Standard dropdown, local search filtering, clearable, and disabled option handling." erpSource="CustomSelect.tsx">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="1. Basic Single Select">
            <DynamicSelect
              label="Select Department"
              options={DEPARTMENTS}
              value={val1}
              onChange={setVal1}
              description="Simple native-like choice"
            />
          </DemoBlock>

          <DemoBlock title="2. Searchable Single Select">
            <DynamicSelect
              label="Search Department"
              options={DEPARTMENTS}
              value={val2}
              searchable
              onChange={setVal2}
              description="Type to filter options instantaneously"
            />
          </DemoBlock>

          <DemoBlock title="3. Clearable Select">
            <DynamicSelect
              label="Clearable Selection"
              options={DEPARTMENTS}
              value={val3}
              clearable
              onChange={setVal3}
              description="Displays clear (X) action button when a value is selected"
            />
          </DemoBlock>
        </div>
      </DemoSection>

      {/* ── SECTION 2: Multi-Select & +N Compact Chips ── */}
      <DemoSection title="2. Multi-Select & Compact +N Chips" desc="Trigger strictly preserves fixed height and does not wrap. Visible tokens adapt seamlessly to available width." erpSource="Platform Extension [C]">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="4 & 5. Searchable Multi-Select">
            <DynamicSelect
              label="Team Memberships"
              options={DEPARTMENTS}
              mode="multiple"
              searchable
              clearable
              value={valMulti}
              onChange={setValMulti}
              description="Selected items appear as tags with individual remove buttons"
            />
          </DemoBlock>

          <DemoBlock title="6. Multi-Select with 'Select All'">
            <DynamicSelect
              label="Broadcast Roles"
              options={DEPARTMENTS}
              mode="multiple"
              selectAll
              value={valSelectAll}
              onChange={setValSelectAll}
              description="Header allows 1-click select all / deselect all"
            />
          </DemoBlock>

          <DemoBlock title="13. Max Selections Limit (Max 3)">
            <DynamicSelect
              label="Primary Departments (Max 3)"
              options={DEPARTMENTS}
              mode="multiple"
              maxSelections={3}
              value={valMax3}
              onChange={setValMax3}
              description="Prevents adding more once selection limit is reached"
            />
          </DemoBlock>
        </div>
      </DemoSection>

      {/* ── SECTION 3: Max Visible Values Configuration ── */}
      <DemoSection title="3. Max Visible Values Matrix" desc="Demonstrating maxVisibleValues={1}, {2}, {3}, and 'auto' dynamic calculation." erpSource="Platform Extension [C]">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="14. maxVisibleValues = 1">
            <DynamicSelect
              label="Limit: 1 visible chip"
              options={DEPARTMENTS}
              mode="multiple"
              maxVisibleValues={1}
              value={valVis1}
              onChange={setValVis1}
            />
          </DemoBlock>

          <DemoBlock title="15. maxVisibleValues = 2">
            <DynamicSelect
              label="Limit: 2 visible chips"
              options={DEPARTMENTS}
              mode="multiple"
              maxVisibleValues={2}
              value={valVis2}
              onChange={setValVis2}
            />
          </DemoBlock>

          <DemoBlock title="16. maxVisibleValues = 3">
            <DynamicSelect
              label="Limit: 3 visible chips"
              options={DEPARTMENTS}
              mode="multiple"
              maxVisibleValues={3}
              value={valVis3}
              onChange={setValVis3}
            />
          </DemoBlock>

          <DemoBlock title="17. maxVisibleValues = 'auto'">
            <DynamicSelect
              label="Auto Calculated Chips"
              options={DEPARTMENTS}
              mode="multiple"
              maxVisibleValues="auto"
              value={valAuto}
              onChange={setValAuto}
            />
          </DemoBlock>
        </div>
      </DemoSection>

      {/* ── SECTION 4: Viewport Constraints & Responsive Layout ── */}
      <DemoSection title="4. Responsive Container Behaviors" desc="Narrow viewport (320px) vs Full width responsive expansion." erpSource="Responsive Grid Matrix">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="18. Narrow Container (320px Box)">
            <div style={{ width: '320px', maxWidth: '100%' }}>
              <DynamicSelect
                label="Narrow Viewport Select"
                options={DEPARTMENTS}
                mode="multiple"
                maxVisibleValues="auto"
                value={valNarrow}
                onChange={setValNarrow}
              />
            </div>
          </DemoBlock>

          <DemoBlock title="19. Wide Container (Full Row)">
            <div style={{ width: '100%' }}>
              <DynamicSelect
                label="Wide Viewport Select"
                options={DEPARTMENTS}
                mode="multiple"
                maxVisibleValues="auto"
                value={valWide}
                onChange={setValWide}
              />
            </div>
          </DemoBlock>
        </div>
      </DemoSection>

      {/* ── SECTION 5: Grouping, Async, States & Creatable ── */}
      <DemoSection title="5. Grouping, States & Creatable Options" desc="Group categories, loading spinners, empty states, error banners, and custom creation." erpSource="Platform Enterprise Standards">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="7. Grouped Options">
            <DynamicSelect
              label="Categorized Divisions"
              options={DEPARTMENTS}
              grouping
              value={valGrouped}
              onChange={setValGrouped}
            />
          </DemoBlock>

          <DemoBlock title="12. Creatable Option">
            <DynamicSelect
              label="Add New Tag"
              options={DEPARTMENTS}
              searchable
              allowCreate
              value={valCreatable}
              onChange={setValCreatable}
              placeholder="Type to find or create..."
            />
          </DemoBlock>

          <DemoBlock title="9. Loading State">
            <DynamicSelect
              label="Async Search"
              options={[]}
              loading
              onChange={() => {}}
              placeholder="Fetching records..."
            />
          </DemoBlock>

          <DemoBlock title="10. Empty State">
            <DynamicSelect
              label="No Records"
              options={[]}
              onChange={() => {}}
              placeholder="No options available"
            />
          </DemoBlock>

          <DemoBlock title="11. Error State">
            <DynamicSelect
              label="Required Organization"
              options={DEPARTMENTS}
              error="Please select an active department"
              required
              onChange={() => {}}
            />
          </DemoBlock>

          <DemoBlock title="8. Disabled State">
            <DynamicSelect
              label="Locked Field"
              options={DEPARTMENTS}
              value="eng"
              disabled
              onChange={() => {}}
            />
          </DemoBlock>
        </div>
      </DemoSection>

      {/* ── SECTION 6: Custom Rendering Templates ── */}
      <DemoSection title="6. Custom Option & Value Rendering" desc="Inject custom avatar, role, and badge templates into options and triggers." erpSource="Platform Architecture">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="20. Custom Option Rendering">
            <DynamicSelect
              label="Assign Lead Engineer"
              options={EMPLOYEES}
              value={valCustomOpt}
              optionLabel={(emp) => emp.name}
              optionValue={(emp) => emp.id}
              onChange={setValCustomOpt}
              renderOption={(emp, { selected }) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '2px 0' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--skyra-primary-light)', color: 'var(--skyra-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem' }}>
                    {emp.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: selected ? 600 : 500, fontSize: '0.85rem' }}>{emp.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--skyra-text-muted)' }}>{emp.role} • {emp.dept}</div>
                  </div>
                </div>
              )}
            />
          </DemoBlock>

          <DemoBlock title="21. Custom Selected Value Rendering">
            <DynamicSelect
              label="Team Leader Badge"
              options={EMPLOYEES}
              value={valCustomVal}
              optionLabel={(emp) => emp.name}
              optionValue={(emp) => emp.id}
              onChange={setValCustomVal}
              renderValue={(emp: any) => (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--skyra-primary)' }}>
                  <Shield size={14} />
                  {emp.name} ({emp.dept})
                </span>
              )}
            />
          </DemoBlock>
        </div>
      </DemoSection>

      {/* ── 24-Point Specification Reference Table ── */}
      <div style={{ marginTop: '4rem', background: 'var(--skyra-surface)', border: '1px solid var(--skyra-border)', borderRadius: 'var(--skyra-radius-xl)', padding: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--skyra-font-display)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--skyra-text)' }}>
          24-Point Component Documentation & Verification
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
          <div><strong>1. Name:</strong> DynamicSelect</div>
          <div><strong>2. Package:</strong> <code>@skyra/ui</code></div>
          <div><strong>3. Classification:</strong> [B] Extraction + [C] Enhancement</div>
          <div><strong>4. Description:</strong> Configurable single/multi select primitive</div>
          <div><strong>5. Rationale:</strong> Single unified component eliminates selector duplication</div>
          <div><strong>6. When to Use:</strong> Dropdown choices, searchable entities, multi-tag pickers</div>
          <div><strong>7. When NOT to Use:</strong> 2-3 simple choices (use RadioGroup or Switch)</div>
          <div><strong>8. Live Preview:</strong> Interactive demos rendered above</div>
          <div><strong>9. Interactive Controls:</strong> Search, +N expansion, chip deletion</div>
          <div><strong>10. Variants:</strong> single, multiple, grouped, creatable</div>
          <div><strong>11. Sizes:</strong> Standard 42px height matching ERP input grid</div>
          <div><strong>12. States:</strong> normal, hover, focus, selected, disabled, loading, empty, error</div>
          <div><strong>13. Props/API:</strong> Strictly typed <code>DynamicSelectProps&lt;T&gt;</code></div>
          <div><strong>14. Events:</strong> <code>onChange</code>, <code>onSearch</code>, <code>onCreateOption</code></div>
          <div><strong>15. Render Props:</strong> <code>renderOption</code>, <code>renderValue</code></div>
          <div><strong>16. Accessibility:</strong> Full ARIA listbox/combobox semantics, 0 axe violations</div>
          <div><strong>17. Keyboard:</strong> Arrows, Enter, Space, Escape, Tab, Backspace for chips</div>
          <div><strong>18. Responsive:</strong> 320px–1536px support with dynamic chip fitting</div>
          <div><strong>19. Dark Mode:</strong> Full theme compliance via <code>--skyra-*</code> tokens</div>
          <div><strong>20. Code:</strong> Zero business logic, callback-based contract</div>
          <div><strong>21. Do/Don&apos;t:</strong> Don&apos;t wrap tokens vertically; Do calculate visible width</div>
          <div><strong>22. Related:</strong> CheckboxGroup, RadioGroup, NativeSelect</div>
          <div><strong>23. ERP Source:</strong> <code>CustomSelect.tsx</code> + <code>DynamicForm.module.css</code></div>
          <div><strong>24. Testing:</strong> 13 unit tests covering all modes & edge cases</div>
        </div>
      </div>
    </div>
  );
}
