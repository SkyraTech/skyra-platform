'use client';

import React, { useState } from 'react';
import {
  DateField,
  DateRangeField,
  TimeField,
  TimeRangeField,
  DateTimeField,
  DateTimeRangeField,
  Calendar,
} from '@skyra/ui';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { DocsHeader } from '@/components/docs/DocsHeader';
import { PackageMeta } from '@/components/docs/PackageMeta';
import { InstallCommand } from '@/components/docs/InstallCommand';
import { LiveExample } from '@/components/docs/LiveExample';
import { ApiTable } from '@/components/docs/ApiTable';
import { ApiTabs } from '@/components/docs/ApiTabs';
import { FrameworkSupport } from '@/components/docs/FrameworkSupport';
import { UsageGuidance } from '@/components/docs/UsageGuidance';
import { AccessibilityPanel } from '@/components/docs/AccessibilityPanel';
import { TokenGrid } from '@/components/docs/TokenGrid';
import { ResponsiveDemo } from '@/components/docs/ResponsiveDemo';
import { RelatedComponents } from '@/components/docs/RelatedComponents';
import { Callout } from '@/components/docs/Callout';
import { HeadingAnchor } from '@/components/docs/HeadingAnchor';

export default function DateTimeDocsPage() {
  const [singleDate, setSingleDate] = useState<string | null>('2026-09-09');
  const [dateRange, setDateRange] = useState<{ startDate: string | null; endDate: string | null }>({
    startDate: '2026-09-01',
    endDate: '2026-09-15',
  });
  
  const [timeVal24, setTimeVal24] = useState<string>('14:30');
  const [timeVal12, setTimeVal12] = useState<string>('14:30');
  const [timeRangeVal, setTimeRangeVal] = useState<{start: string; end: string;} | undefined>({start: '09:00', end: '17:30'});
  
  const [dateTimeVal, setDateTimeVal] = useState<{ date: string | null; time: string }>({
    date: '2026-09-09',
    time: '14:30',
  });
  
  const [calendarVal, setCalendarVal] = useState<string | null>('2026-09-09');

  const toc = [
    { id: 'quick-start', label: 'Quick Start' },
    { id: 'date-field', label: 'Date Selection' },
    { id: 'date-range', label: 'Date Range' },
    { id: 'time-field', label: 'Time' },
    { id: 'time-range', label: 'Time Range' },
    { id: 'date-time', label: 'Date & Time' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'api', label: 'API Reference' },
    { id: 'accessibility', label: 'Accessibility' },
    { id: 'responsive', label: 'Responsive Behavior' },
  ];

  return (
    <DocsLayout toc={toc}>
      <DocsHeader 
        title="Date & Time"
        description="Enterprise date and time components with calendar popovers, range highlight, min/max bounds, and 12h/24h modes."
        breadcrumbs={[
          { label: 'Components', href: '/components' },
          { label: 'Forms' },
          { label: 'Date & Time' }
        ]}
        badges={[
          { label: 'Stable', variant: 'stable' },
          { label: 'Web Component', variant: 'tech' }
        ]}
      />

      <PackageMeta 
        packageName="@skyra-tech-platform/date-time"
        elementName="<skyra-tech-date-field>"
        version="0.1.0"
        type="Web Component"
      />

      <HeadingAnchor id="quick-start">Quick Start</HeadingAnchor>
      <InstallCommand packageName="@skyra-tech-platform/date-time" />
      
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--skyra-text)', marginBottom: '1rem', marginTop: '3rem', letterSpacing: '-0.01em' }}>
        Basic Usage
      </h3>
      <LiveExample 
        language="tsx"
        code={`import { DateField } from '@skyra/ui';

export function Example() {
  const [date, setDate] = useState('2026-09-09');
  
  return (
    <DateField
      label="Invoice Issue Date"
      value={date}
      onChange={setDate}
      description="Pick via calendar popup or enter manually (YYYY-MM-DD)"
    />
  );
}`}
      >
        <div style={{ maxWidth: '300px' }}>
          <DateField
            label="Invoice Issue Date"
            value={singleDate}
            onChange={setSingleDate}
            description="Pick via calendar popup or enter manually (YYYY-MM-DD)"
          />
        </div>
      </LiveExample>

      <HeadingAnchor id="date-field">Date Selection</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '1.5rem', fontSize: '1.05rem', lineHeight: 1.6 }}>
        Use the <code>DateField</code> component to capture single date values with a popover calendar.
      </p>
      
      <LiveExample 
        language="tsx"
        title="Date Field"
        description="Date field with optional format string."
        code={`<DateField
  label="Contract Expiration"
  value={singleDate}
  onChange={setSingleDate}
  format="DD MMM YYYY"
/>`}
      >
        <div style={{ maxWidth: '300px' }}>
          <DateField
            label="Contract Expiration"
            value={singleDate}
            onChange={setSingleDate}
            format="DD MMM YYYY"
          />
        </div>
      </LiveExample>

      <HeadingAnchor id="date-range">Date Range</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '1.5rem', fontSize: '1.05rem', lineHeight: 1.6 }}>
        Use the <code>DateRangeField</code> component to capture a start and end date with bounds validation and range highlighting.
      </p>

      <LiveExample 
        language="tsx"
        title="Date Range Field"
        description="Select start and end dates within the same popover."
        code={`<DateRangeField
  label="Fiscal Reporting Period"
  value={dateRange}
  onChange={setDateRange}
  description="Select start and end dates with automatic bounds validation"
/>`}
      >
        <div style={{ maxWidth: '500px' }}>
          <DateRangeField
            label="Fiscal Reporting Period"
            value={dateRange}
            onChange={setDateRange}
            description="Select start and end dates with automatic bounds validation"
          />
        </div>
      </LiveExample>

      <HeadingAnchor id="time-field">Time</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '1.5rem', fontSize: '1.05rem', lineHeight: 1.6 }}>
        Use the <code>TimeField</code> component to capture time values. Supports both 12-hour and 24-hour formats.
      </p>

      <LiveExample 
        language="tsx"
        title="Time Field Modes"
        description="Supports 24h and 12h formatting alongside custom minute step intervals."
        code={`<TimeField
  label="24-Hour Time"
  value={timeVal24}
  onChange={setTimeVal24}
  format="24h"
  minuteStep={5}
/>

<TimeField
  label="12-Hour Time"
  value={timeVal12}
  onChange={setTimeVal12}
  format="12h"
  minuteStep={15}
/>`}
      >
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ maxWidth: '200px', flex: 1 }}>
            <TimeField
              label="24-Hour Time"
              value={timeVal24}
              onChange={setTimeVal24}
              format="24h"
              minuteStep={5}
            />
          </div>
          <div style={{ maxWidth: '200px', flex: 1 }}>
            <TimeField
              label="12-Hour Time"
              value={timeVal12}
              onChange={setTimeVal12}
              format="12h"
              minuteStep={15}
            />
          </div>
        </div>
      </LiveExample>

      <HeadingAnchor id="time-range">Time Range</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '1.5rem', fontSize: '1.05rem', lineHeight: 1.6 }}>
        Use the <code>TimeRangeField</code> component for selecting start and end time boundaries.
      </p>

      <LiveExample 
        language="tsx"
        title="Time Range Field"
        description="Select start and end times together."
        code={`<TimeRangeField
  label="Business Operating Hours"
  value={timeRangeVal}
  onChange={setTimeRangeVal}
  format="12h"
/>`}
      >
        <div style={{ maxWidth: '400px' }}>
          <TimeRangeField
            label="Business Operating Hours"
            value={timeRangeVal}
            onChange={setTimeRangeVal}
            format="12h"
          />
        </div>
      </LiveExample>

      <HeadingAnchor id="date-time">Date & Time</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '1.5rem', fontSize: '1.05rem', lineHeight: 1.6 }}>
        Use the <code>DateTimeField</code> component for selecting a specific date and time simultaneously.
      </p>

      <LiveExample 
        language="tsx"
        title="Date Time Field"
        description="Combined date selection with time controls."
        code={`<DateTimeField
  label="Scheduled Deployment"
  value={dateTimeVal}
  onChange={setDateTimeVal}
  timeFormat="24h"
/>`}
      >
        <div style={{ maxWidth: '400px' }}>
          <DateTimeField
            label="Scheduled Deployment"
            value={dateTimeVal}
            onChange={setDateTimeVal}
            timeFormat="24h"
          />
        </div>
      </LiveExample>

      <HeadingAnchor id="calendar">Calendar</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '1.5rem', fontSize: '1.05rem', lineHeight: 1.6 }}>
        The underlying <code>Calendar</code> component can be used standalone for inline display.
      </p>

      <LiveExample 
        language="tsx"
        title="Standalone Calendar"
        description="Inline calendar rendering."
        code={`<Calendar
  value={calendarVal}
  onChange={setCalendarVal}
/>`}
      >
        <div style={{ width: 'fit-content' }}>
          <Calendar
            value={calendarVal}
            // @ts-ignore
            onChange={(val: any) => setCalendarVal(val)}
          />
        </div>
      </LiveExample>

      <HeadingAnchor id="api">API Reference</HeadingAnchor>
      <ApiTabs tabs={[
        {
          id: 'date-field',
          label: 'DateField',
          content: (
            <ApiTable 
              rows={[
                { name: 'value', type: 'string | null', defaultVal: 'null', description: 'The selected date in YYYY-MM-DD format.' },
                { name: 'onChange', type: '(value: string | null) => void', description: 'Called when the date changes.' },
                { name: 'minDate', type: 'string | Date', description: 'The earliest selectable date.' },
                { name: 'maxDate', type: 'string | Date', description: 'The latest selectable date.' },
                { name: 'format', type: 'string', defaultVal: '"YYYY-MM-DD"', description: 'The display format for the date string.' },
                { name: 'label', type: 'ReactNode', description: 'The field label.' },
                { name: 'description', type: 'ReactNode', description: 'Helper text below the field.' },
                { name: 'error', type: 'string', description: 'Error message.' },
                { name: 'disabled', type: 'boolean', defaultVal: 'false', description: 'Disables the field.' },
                { name: 'required', type: 'boolean', defaultVal: 'false', description: 'Marks the field as required.' },
              ]}
            />
          )
        },
        {
          id: 'date-range-field',
          label: 'DateRangeField',
          content: (
            <ApiTable 
              rows={[
                { name: 'value', type: '{ startDate: string | null, endDate: string | null }', description: 'The selected start and end dates.' },
                { name: 'onChange', type: '(value: { startDate: string | null, endDate: string | null }) => void', description: 'Called when the range changes.' },
                { name: 'minDate', type: 'string | Date', description: 'The earliest selectable date.' },
                { name: 'maxDate', type: 'string | Date', description: 'The latest selectable date.' },
                { name: 'label', type: 'ReactNode', description: 'The field label.' },
                { name: 'description', type: 'ReactNode', description: 'Helper text below the field.' },
                { name: 'error', type: 'string', description: 'Error message.' },
                { name: 'disabled', type: 'boolean', defaultVal: 'false', description: 'Disables the field.' },
              ]}
            />
          )
        },
        {
          id: 'time-field',
          label: 'TimeField',
          content: (
            <ApiTable 
              rows={[
                { name: 'value', type: 'string', defaultVal: '""', description: 'The selected time in HH:MM format.' },
                { name: 'onChange', type: '(value: string) => void', description: 'Called when the time changes.' },
                { name: 'format', type: '"12h" | "24h"', defaultVal: '"12h"', description: 'The time display and selection mode.' },
                { name: 'minuteStep', type: 'number', defaultVal: '1', description: 'Minute increment intervals.' },
                { name: 'label', type: 'ReactNode', description: 'The field label.' },
                { name: 'description', type: 'ReactNode', description: 'Helper text below the field.' },
                { name: 'disabled', type: 'boolean', defaultVal: 'false', description: 'Disables the field.' },
              ]}
            />
          )
        }
      ]} />

      <HeadingAnchor id="accessibility">Accessibility</HeadingAnchor>
      <AccessibilityPanel
        features={[
          'Keyboard Navigation: Calendars support full keyboard navigation (Arrow keys, Home, End, Enter, Space).',
          'Focus Management: Focus is trapped within popovers and returned properly on closure.',
          'Form Validation: Integrates with ElementInternals for native HTML validation.',
          'ARIA Attributes: Accurate ARIA roles for dialogs, grids, buttons, and combo boxes.'
        ]}
      />

      <HeadingAnchor id="responsive">Responsive Behavior</HeadingAnchor>
      <ResponsiveDemo
        description="Date and Time pickers adapt to narrow viewports by collapsing into stacked layouts when necessary."
        desktop={
          <div style={{ width: '400px' }}>
            <DateRangeField
              label="Responsive Range Picker"
              value={dateRange}
              onChange={setDateRange}
            />
          </div>
        }
        mobile={
          <div style={{ width: '100%' }}>
            <DateRangeField
              label="Responsive Range Picker"
              value={dateRange}
              onChange={setDateRange}
            />
          </div>
        }
        fullWidth={
          <TimeRangeField
            label="Responsive Time Picker"
            value={timeRangeVal}
            onChange={setTimeRangeVal}
            format="12h"
          />
        }
      />

    </DocsLayout>
  );
}
