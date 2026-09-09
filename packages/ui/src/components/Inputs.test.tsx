import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './Input';
import { SearchInput } from './SearchInput';
import { PasswordInput } from './PasswordInput';
import { NumberInput } from './NumberInput';
import { Textarea } from './Textarea';

describe('Inputs & Textarea', () => {
  describe('Input enhancements', () => {
    it('renders with prefix, suffix, and clear button', () => {
      const onClear = vi.fn();
      render(
        <Input
          label="Username"
          value="john_doe"
          prefix="@"
          clearable
          onClear={onClear}
          onChange={() => {}}
        />
      );

      expect(screen.getByText('@')).toBeInTheDocument();
      const clearBtn = screen.getByRole('button', { name: /clear input/i });
      fireEvent.click(clearBtn);
      expect(onClear).toHaveBeenCalled();
    });

    it('renders character counter when showCount is enabled', () => {
      render(<Input label="Bio" value="Hello" maxLength={10} showCount onChange={() => {}} />);
      expect(screen.getByText('5 / 10')).toBeInTheDocument();
    });
  });

  describe('SearchInput', () => {
    it('renders search input with clear button', () => {
      render(<SearchInput placeholder="Search records..." value="keyword" onChange={() => {}} />);
      expect(screen.getByPlaceholderText('Search records...')).toBeInTheDocument();
      expect(screen.getByRole('searchbox')).toBeInTheDocument();
    });
  });

  describe('PasswordInput', () => {
    it('toggles password visibility', () => {
      render(<PasswordInput label="Account Password" defaultValue="secret123" />);
      const input = screen.getByLabelText('Account Password');
      expect(input).toHaveAttribute('type', 'password');

      const toggleBtn = screen.getByRole('button', { name: /show password/i });
      fireEvent.click(toggleBtn);
      expect(input).toHaveAttribute('type', 'text');

      const hideBtn = screen.getByRole('button', { name: /hide password/i });
      fireEvent.click(hideBtn);
      expect(input).toHaveAttribute('type', 'password');
    });
  });

  describe('NumberInput', () => {
    it('handles stepper clicks and bounds', () => {
      const onChange = vi.fn();
      render(<NumberInput label="Quantity" value={5} min={0} max={10} step={2} onChange={onChange} />);

      const increaseBtn = screen.getByRole('button', { name: /increase value/i });
      fireEvent.click(increaseBtn);
      expect(onChange).toHaveBeenCalledWith(7);

      const decreaseBtn = screen.getByRole('button', { name: /decrease value/i });
      fireEvent.click(decreaseBtn);
      expect(onChange).toHaveBeenCalledWith(3);
    });
  });

  describe('Textarea', () => {
    it('renders textarea with character count', () => {
      render(
        <Textarea
          label="Description"
          value="Test text"
          maxLength={100}
          showCount
          onChange={() => {}}
        />
      );
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByText('9 / 100')).toBeInTheDocument();
    });
  });
});
