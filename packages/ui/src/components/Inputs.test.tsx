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
      const { container } = render(
        <Input
          label="Username"
          value="john_doe"
          prefix="@"
          clearable
          onClear={onClear}
          onChange={() => {}}
        />
      );

      const span = container.querySelector('span[slot="left-icon"]');
      expect(span?.textContent).toBe('@');
      
      const input = container.querySelector('skyra-tech-input') as any;
      input.dispatchEvent(new CustomEvent('clear', { bubbles: true }));
      expect(onClear).toHaveBeenCalled();
    });

    it('renders character counter when showCount is enabled', () => {
      const { container } = render(<Input label="Bio" value="Hello" maxLength={10} showCount onChange={() => {}} />);
      const input = container.querySelector('skyra-tech-input') as HTMLElement;
      expect(input.getAttribute('show-count')).toBe('true');
      expect(input.getAttribute('maxlength')).toBe('10');
    });
  });

  describe('SearchInput', () => {
    it('renders search input with clear button', () => {
      const { container } = render(<SearchInput placeholder="Search records..." value="keyword" onChange={() => {}} />);
      const input = container.querySelector('skyra-tech-input') as HTMLElement;
      expect(input.getAttribute('placeholder')).toBe('Search records...');
      expect(input.getAttribute('type')).toBe('search');
    });
  });

  describe('PasswordInput', () => {
    it('toggles password visibility', () => {
      const { container } = render(<PasswordInput label="Account Password" defaultValue="secret123" />);
      const input = container.querySelector('skyra-tech-input') as HTMLElement;
      expect(input.getAttribute('type')).toBe('password');

      const toggleBtn = container.querySelector('button[aria-label="Show password"]');
      fireEvent.click(toggleBtn!);
      expect(input.getAttribute('type')).toBe('text');

      const hideBtn = container.querySelector('button[aria-label="Hide password"]');
      fireEvent.click(hideBtn!);
      expect(input.getAttribute('type')).toBe('password');
    });
  });

  describe('NumberInput', () => {
    it('handles stepper clicks and bounds', () => {
      const onChange = vi.fn();
      const { container } = render(<NumberInput label="Quantity" value={5} min={0} max={10} step={2} onChange={onChange} />);

      const increaseBtn = container.querySelector('button[aria-label="Increase value"]');
      fireEvent.click(increaseBtn!);
      expect(onChange).toHaveBeenCalledWith(7);

      const decreaseBtn = container.querySelector('button[aria-label="Decrease value"]');
      fireEvent.click(decreaseBtn!);
      expect(onChange).toHaveBeenCalledWith(3);
    });
  });

  describe('Textarea', () => {
    it('renders textarea with character count', () => {
      const { container } = render(
        <Textarea
          label="Description"
          value="Test text"
          maxLength={100}
          showCount
          onChange={() => {}}
        />
      );
      const textarea = container.querySelector('skyra-tech-textarea') as HTMLElement;
      expect(textarea).not.toBeNull();
      expect(textarea.getAttribute('show-count')).toBe('true');
    });
  });
});
