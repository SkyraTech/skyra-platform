import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { DateField } from './DateField';
import { DateRangeField } from './DateRangeField';
import { TimeField } from './TimeField';
import { DateTimeField } from './DateTimeField';
import { Calendar } from './Calendar';

expect.extend(toHaveNoViolations);

describe('Date & Time Fields', () => {
  describe('DateField', () => {
    it('renders and binds values correctly', () => {
      const { container } = render(<DateField label="Birth Date" value="2026-09-09" />);
      const el = container.querySelector('skyra-tech-date-field') as HTMLElement;
      expect(el).toBeInTheDocument();
      expect(el.getAttribute('value')).toBe('2026-09-09');
    });

    it('has no accessibility violations', async () => {
      const { container } = render(<DateField label="Birth Date" value="2026-09-09" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('DateRangeField', () => {
    it('renders start and end date attributes', () => {
      const { container } = render(
        <DateRangeField
          label="Billing Period"
          value={{ startDate: '2026-09-01', endDate: '2026-09-15' }}
        />
      );
      const el = container.querySelector('skyra-tech-date-range-field') as HTMLElement;
      expect(el.getAttribute('start-value')).toBe('2026-09-01');
      expect(el.getAttribute('end-value')).toBe('2026-09-15');
    });
    
    it('has no accessibility violations', async () => {
      const { container } = render(<DateRangeField label="Billing Period" value={{ startDate: '2026-09-01', endDate: '2026-09-15' }} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('TimeField', () => {
    it('renders with format and minute step', () => {
      const { container } = render(<TimeField label="Appointment Time" value="10:30 AM" format="12h" minuteStep={15} />);
      const el = container.querySelector('skyra-tech-time-field') as HTMLElement;
      expect(el.getAttribute('value')).toBe('10:30 AM');
      expect(el.getAttribute('format')).toBe('12h');
      expect(el.getAttribute('minute-step')).toBe('15');
    });

    it('has no accessibility violations', async () => {
      const { container } = render(<TimeField label="Appointment Time" value="10:30 AM" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('DateTimeField', () => {
    it('renders combined date and time fields', () => {
      const { container } = render(
        <DateTimeField
          label="Event Schedule"
          value={{ date: '2026-09-09', time: '04:00 PM' }}
        />
      );
      const el = container.querySelector('skyra-tech-date-time-field') as HTMLElement;
      expect(el.getAttribute('date-value')).toBe('2026-09-09');
      expect(el.getAttribute('time-value')).toBe('04:00 PM');
    });
  });

  describe('Calendar Core', () => {
    it('supports single date selection mode', () => {
      const { container } = render(<Calendar mode="single" value="2026-09-09" />);
      const el = container.querySelector('skyra-tech-calendar') as HTMLElement;
      expect(el.getAttribute('mode')).toBe('single');
      expect(el.getAttribute('value')).toBe('2026-09-09');
    });
  });
});
