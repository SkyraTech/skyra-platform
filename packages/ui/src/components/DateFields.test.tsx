import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DateField } from './DateField';
import { DateRangeField } from './DateRangeField';
import { TimeField } from './TimeField';
import { DateTimeField } from './DateTimeField';
import { Calendar } from './Calendar';
import { TimeRangeField } from './TimeRangeField';
import { DateTimeRangeField } from './DateTimeRangeField';
import { MonthField } from './MonthField';
import { YearField } from './YearField';
import { WeekField } from './WeekField';

describe('Date & Time Fields', () => {
  describe('DateField', () => {
    it('renders with placeholder and opens popover calendar', () => {
      const onChange = vi.fn();
      render(<DateField label="Birth Date" value="2026-09-09" onChange={onChange} />);

      expect(screen.getByDisplayValue('2026-09-09')).toBeInTheDocument();

      const openBtn = screen.getByRole('button', { name: /open calendar/i });
      fireEvent.click(openBtn);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText(/september 2026/i)).toBeInTheDocument();
    });

    it('clears date with clear button', () => {
      const onChange = vi.fn();
      render(<DateField label="Date" value="2026-09-09" onChange={onChange} />);

      const clearBtn = screen.getByRole('button', { name: /clear date/i });
      fireEvent.click(clearBtn);

      expect(onChange).toHaveBeenCalledWith(null);
    });
  });

  describe('DateRangeField', () => {
    it('renders start and end date trigger', () => {
      render(
        <DateRangeField
          label="Billing Period"
          value={{ startDate: '2026-09-01', endDate: '2026-09-15' }}
          onChange={() => {}}
        />
      );

      expect(screen.getByText('2026-09-01')).toBeInTheDocument();
      expect(screen.getByText('2026-09-15')).toBeInTheDocument();
    });
  });

  describe('TimeField', () => {
    it('handles hour and minute selections in 12h mode', () => {
      const onChange = vi.fn();
      render(<TimeField label="Appointment Time" value="10:30 AM" onChange={onChange} />);

      const hourSelect = screen.getByLabelText(/hour/i);
      fireEvent.change(hourSelect, { target: { value: '11' } });

      expect(onChange).toHaveBeenCalledWith('11:30 AM');
    });
  });

  describe('DateTimeField', () => {
    it('renders combined date and time fields', () => {
      const onChange = vi.fn();
      render(
        <DateTimeField
          label="Event Schedule"
          value={{ date: '2026-09-09', time: '04:00 PM' }}
          onChange={onChange}
        />
      );

      expect(screen.getByDisplayValue('2026-09-09')).toBeInTheDocument();
      expect(screen.getByLabelText(/hour/i)).toBeInTheDocument();
    });
  });

  describe('Calendar Core', () => {
    it('supports single date selection and navigation', () => {
      const onChange = vi.fn();
      render(<Calendar mode="single" value="2026-09-09" onChange={onChange} />);

      expect(screen.getByText(/september 2026/i)).toBeInTheDocument();
      const day15 = screen.getByRole('button', { name: '15' });
      fireEvent.click(day15);

      expect(onChange).toHaveBeenCalledWith('2026-09-15');
    });

    it('supports range selection', () => {
      const onRangeChange = vi.fn();
      render(<Calendar mode="range" rangeValue={['2026-09-01', '2026-09-10']} onRangeChange={onRangeChange} />);

      const day20 = screen.getByRole('button', { name: '20' });
      fireEvent.click(day20);
      expect(screen.getByText('Today')).toBeInTheDocument();
    });
  });

  describe('TimeRangeField', () => {
    it('renders time range trigger and supports quick selection', () => {
      const onChange = vi.fn();
      render(<TimeRangeField label="Shift Window" value={['09:00', '17:00']} onChange={onChange} />);

      expect(screen.getByText('09:00 → 17:00')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: /shift window/i }));
      expect(screen.getByText(/quick range presets/i)).toBeInTheDocument();

      fireEvent.click(screen.getByText(/morning/i));
      expect(onChange).toHaveBeenCalledWith(['09:00', '12:00']);
    });
  });

  describe('DateTimeRangeField', () => {
    it('renders datetime range trigger', () => {
      render(
        <DateTimeRangeField
          label="Sprint Period"
          value={['2026-09-01 09:00 AM', '2026-09-15 06:00 PM']}
          onChange={() => {}}
        />
      );

      expect(screen.getByText('2026-09-01 09:00 AM → 2026-09-15 06:00 PM')).toBeInTheDocument();
    });
  });

  describe('MonthField, YearField & WeekField', () => {
    it('renders month field and allows selection', () => {
      const onChange = vi.fn();
      render(<MonthField label="Fiscal Month" value="2026-09" onChange={onChange} />);

      expect(screen.getByText(/sep 2026/i)).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: /fiscal month/i }));
      fireEvent.click(screen.getByText('Oct'));

      expect(onChange).toHaveBeenCalledWith('2026-10');
    });

    it('renders year field with decade selector', () => {
      const onChange = vi.fn();
      render(<YearField label="Report Year" value={2026} onChange={onChange} />);

      expect(screen.getByText('2026')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: /report year/i }));
      expect(screen.getByText('2020 - 2029')).toBeInTheDocument();
    });

    it('renders week field trigger', () => {
      render(<WeekField label="Work Week" value={['2026-09-07', '2026-09-13']} onChange={() => {}} />);
      expect(screen.getByText('2026-09-07 → 2026-09-13')).toBeInTheDocument();
    });
  });
});
