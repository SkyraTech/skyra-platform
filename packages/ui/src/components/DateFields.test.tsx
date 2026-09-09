import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DateField } from './DateField';
import { DateRangeField } from './DateRangeField';
import { TimeField } from './TimeField';
import { DateTimeField } from './DateTimeField';

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
});
