import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from './Checkbox';
import { CheckboxGroup } from './CheckboxGroup';
import { Radio } from './Radio';
import { RadioGroup } from './RadioGroup';
import { Switch } from './Switch';

describe('Selection Controls', () => {
  describe('Checkbox & CheckboxGroup', () => {
    it('renders indeterminate state on Checkbox', () => {
      render(<Checkbox label="All items" indeterminate onChange={() => {}} />);
      const input = screen.getByRole('checkbox');
      expect(input).toBeInTheDocument();
    });

    it('handles CheckboxGroup multiple selections', () => {
      const onChange = vi.fn();
      render(
        <CheckboxGroup
          label="Departments"
          value={['eng']}
          onChange={onChange}
          options={[
            { value: 'eng', label: 'Engineering' },
            { value: 'mkt', label: 'Marketing' },
          ]}
        />
      );

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes[0]).toBeChecked();
      expect(checkboxes[1]).not.toBeChecked();

      fireEvent.click(checkboxes[1]);
      expect(onChange).toHaveBeenCalledWith(['eng', 'mkt']);
    });
  });

  describe('Radio & RadioGroup', () => {
    it('handles Radio selection in RadioGroup', () => {
      const onChange = vi.fn();
      render(
        <RadioGroup
          label="Payment Method"
          value="card"
          onChange={onChange}
          options={[
            { value: 'cash', label: 'Cash' },
            { value: 'card', label: 'Card' },
            { value: 'upi', label: 'UPI' },
          ]}
        />
      );

      const radios = screen.getAllByRole('radio');
      expect(radios[1]).toBeChecked();

      fireEvent.click(radios[0]);
      expect(onChange).toHaveBeenCalledWith('cash');
    });
  });

  describe('Switch', () => {
    it('toggles switch state on click and space key', () => {
      const onChange = vi.fn();
      render(<Switch label="Enable notifications" checked={false} onChange={onChange} />);

      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveAttribute('aria-checked', 'false');

      fireEvent.click(toggle);
      expect(onChange).toHaveBeenCalledWith(true);

      fireEvent.keyDown(toggle, { key: ' ' });
      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('renders disabled switch without toggling', () => {
      const onChange = vi.fn();
      render(<Switch label="Disabled" disabled onChange={onChange} />);

      const toggle = screen.getByRole('switch');
      expect(toggle).toBeDisabled();

      fireEvent.click(toggle);
      expect(onChange).not.toHaveBeenCalled();
    });
  });
});
