'use client';

import React, { useState } from 'react';
import {
  DateField,
  DateRangeField,
  TimeField,
  TimeRangeField,
  DateTimeField,
  DateTimeRangeField,
  MonthField,
  YearField,
  WeekField,
  Calendar
} from '@skyra/ui';
import { DemoSection, DemoBlock } from '@/components/demos/DemoSection';

export default function DateFieldsShowcasePage() {
  const [singleDate, setSingleDate] = useState<string | null>('2026-09-09');
  const [dateRange, setDateRange] = useState<{ startDate: string | null; endDate: string | null }>({
    startDate: '2026-09-01',
    endDate: '2026-09-15',
  });
  const [timeVal, setTimeVal] = useState<string>('14:30');
  const [timeRangeVal, setTimeRangeVal] = useState<[string, string] | null>(['09:00 AM', '05:30 PM']);
  const [dateTimeVal, setDateTimeVal] = useState<{ date: string | null; time: string }>({
    date: '2026-09-09',
    time: '14:30',
  });
  const [dateTimeRangeVal, setDateTimeRangeVal] = useState<[string, string] | null>([
    '2026-09-01 09:00',
    '2026-09-05 18:00',
  ]);
  const [monthVal, setMonthVal] = useState<string | null>('2026-09');
  const [yearVal, setYearVal] = useState<number | null>(2026);
  const [weekVal, setWeekVal] = useState<[string, string] | null>(['2026-09-07', '2026-09-13']);
  const [inlineCalendarDate, setInlineCalendarDate] = useState<string | null>('2026-09-09');

  return (
    <div className="dash-page" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--skyra-text)', margin: 0 }}>
          Date &amp; Time Suite (10 Reusable Controls)
        </h1>
        <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
          Enterprise date and time components with calendar popovers, range highlight, min/max bounds, 12h/24h modes, and responsive mobile behavior.
        </p>
      </div>

      {/* 1. Date & Date Range Fields */}
      <DemoSection title="1. Date &amp; Date Range Selection" desc="DateField and DateRangeField with calendar popovers and range highlights." erpSource="ERP Invoicing & Date Controls">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="DateField (Single Selection)">
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <DateField
                label="Invoice Issue Date"
                value={singleDate}
                onChange={setSingleDate}
                description="Pick via calendar popup or enter manually (YYYY-MM-DD)"
              />
              <DateField
                label="Contract Expiration (format prop)"
                value={singleDate}
                onChange={setSingleDate}
                format="DD MMM YYYY"
              />
            </div>
          </DemoBlock>

          <DemoBlock title="DateRangeField (Period Selection)">
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <DateRangeField
                label="Fiscal Reporting Period"
                value={dateRange}
                onChange={setDateRange}
                description="Select start and end dates with automatic bounds validation"
              />
            </div>
          </DemoBlock>
        </div>
      </DemoSection>

      {/* 2. Time & Time Range Fields */}
      <DemoSection title="2. Time &amp; Time Range Controls" desc="TimeField and TimeRangeField supporting 12h/24h modes and minute steps." erpSource="Platform Foundation">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="TimeField (12h / 24h)">
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <TimeField
                label="24-Hour Time (HH:MM, step 5min)"
                value={timeVal}
                onChange={setTimeVal}
                format="24h"
                minuteStep={5}
              />
              <TimeField
                label="12-Hour Time (hh:mm A, step 15min)"
                value={timeVal}
                onChange={setTimeVal}
                format="12h"
                minuteStep={15}
              />
            </div>
          </DemoBlock>

          <DemoBlock title="TimeRangeField (Shift Hours)">
            <div style={{ width: '100%' }}>
              <TimeRangeField
                label="Business Operating Hours"
                value={timeRangeVal}
                onChange={setTimeRangeVal}
                format="12h"
                description="Start and end time range with automatic validation"
              />
            </div>
          </DemoBlock>
        </div>
      </DemoSection>

      {/* 3. DateTime & DateTime Range Fields */}
      <DemoSection title="3. DateTime &amp; DateTime Range Controls" desc="Composed unified date + time controls for exact timestamp scheduling." erpSource="Platform Foundation">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="DateTimeField">
            <div style={{ width: '100%' }}>
              <DateTimeField
                label="Audit Timestamp"
                value={dateTimeVal}
                onChange={setDateTimeVal}
                description="Unified date and time selector"
              />
            </div>
          </DemoBlock>

          <DemoBlock title="DateTimeRangeField">
            <div style={{ width: '100%' }}>
              <DateTimeRangeField
                label="Deployment Maintenance Window"
                value={dateTimeRangeVal}
                onChange={setDateTimeRangeVal}
                description="Complete start datetime to end datetime range"
              />
            </div>
          </DemoBlock>
        </div>
      </DemoSection>

      {/* 4. Month, Year, Week Fields & Inline Calendar */}
      <DemoSection title="4. Month, Year, Week &amp; Standalone Calendar" desc="Specialized period selectors and standalone Skyra calendar primitive." erpSource="Platform Foundation">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="Period Fields (Month, Year, Week)">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <MonthField
                label="Fiscal Billing Month"
                value={monthVal}
                onChange={setMonthVal}
              />
              <YearField
                label="Tax Accounting Year"
                value={yearVal ?? undefined}
                onChange={setYearVal}
                minYear={2020}
                maxYear={2030}
              />
              <WeekField
                label="Sprint Scheduling Week"
                value={weekVal}
                onChange={setWeekVal}
              />
            </div>
          </DemoBlock>

          <DemoBlock title="Standalone Calendar Primitive">
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Calendar
                value={inlineCalendarDate}
                onChange={setInlineCalendarDate}
              />
            </div>
          </DemoBlock>
        </div>
      </DemoSection>

      {/* 24-Point Specification */}
      <div style={{ marginTop: '4rem', background: 'var(--skyra-surface)', border: '1px solid var(--skyra-border)', borderRadius: 'var(--skyra-radius-xl)', padding: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--skyra-font-display)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--skyra-text)' }}>
          24-Point Component Documentation & Verification
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
          <div><strong>1. Name:</strong> Calendar, DateField, DateRangeField, TimeField, TimeRangeField, DateTimeField, DateTimeRangeField, MonthField, YearField, WeekField</div>
          <div><strong>2. Package:</strong> <code>@skyra/ui</code></div>
          <div><strong>3. Classification:</strong> [C] Platform UI Primitive</div>
          <div><strong>4. Description:</strong> Complete ISO-compliant date &amp; time suite with keyboard navigation and calendar popovers</div>
          <div><strong>5. Rationale:</strong> Standardized multi-format date selection without heavy external bloat</div>
          <div><strong>6. When to Use:</strong> Invoices, transactions, audit logs, date filters, maintenance windows</div>
          <div><strong>7. When NOT to Use:</strong> Plain unrestricted text input</div>
          <div><strong>8. Live Preview:</strong> Interactive demos rendered above</div>
          <div><strong>9. Interactive Controls:</strong> Calendar grid, month/year navigators, today action, clear action</div>
          <div><strong>10. Variants:</strong> single, range, time 12h/24h, datetime, month, year, week</div>
          <div><strong>11. Sizes:</strong> Standard 42px height matching enterprise form grid</div>
          <div><strong>12. States:</strong> normal, active, open popover, disabled, readonly, error</div>
          <div><strong>13. Props/API:</strong> Strictly typed props across all 10 components</div>
          <div><strong>14. Events:</strong> <code>onChange</code> with ISO formatted values</div>
          <div><strong>15. Slots/Children:</strong> Label, description, error, calendar popover</div>
          <div><strong>16. Accessibility:</strong> ARIA dialog popover, grid cell semantics, aria-labelledby links</div>
          <div><strong>17. Keyboard:</strong> Arrow keys to navigate calendar days, Enter/Space to select, Escape to close</div>
          <div><strong>18. Responsive:</strong> Fluid popovers with 320px viewport safety</div>
          <div><strong>19. Dark Mode:</strong> Theme-calibrated surface tokens and range highlight colors</div>
          <div><strong>20. Code:</strong> Zero external date libraries; lightweight pure TS architecture</div>
          <div><strong>21. Do/Don&apos;t:</strong> Do use ISO YYYY-MM-DD strings for consistent serialization</div>
          <div><strong>22. Related:</strong> Input, DynamicForm, DataTable filters</div>
          <div><strong>23. ERP Source:</strong> ERP Invoicing &amp; Transaction Date pickers</div>
          <div><strong>24. Testing:</strong> 12 unit tests in DateFields.test.tsx with 100% pass rate</div>
        </div>
      </div>
    </div>
  );
}
