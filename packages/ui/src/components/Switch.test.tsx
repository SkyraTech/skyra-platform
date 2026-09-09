import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Switch } from './Switch';

describe('Switch', () => {
  it('renders switch with role and toggles on click', () => {
    const onChange = vi.fn();
    render(<Switch label="Enable notifications" checked={false} onChange={onChange} />);

    const toggle = screen.getByRole('switch', { name: /enable notifications/i });
    expect(toggle).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(toggle);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('supports keyboard Space and Enter toggling', () => {
    const onChange = vi.fn();
    render(<Switch label="Dark Mode" checked={false} onChange={onChange} />);

    const toggle = screen.getByRole('switch', { name: /dark mode/i });
    fireEvent.keyDown(toggle, { key: ' ' });
    expect(onChange).toHaveBeenCalledWith(true);

    fireEvent.keyDown(toggle, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('handles disabled state and prevents onChange', () => {
    const onChange = vi.fn();
    render(<Switch label="Disabled Option" disabled checked={false} onChange={onChange} />);

    const toggle = screen.getByRole('switch', { name: /disabled option/i });
    expect(toggle).toBeDisabled();

    fireEvent.click(toggle);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders different visual variants (labeled, icon, compact, outline)', () => {
    const { container } = render(
      <div>
        <Switch label="Labeled" variant="labeled" checked={true} />
        <Switch label="Icon" variant="icon" checked={true} />
        <Switch label="Compact" variant="compact" checked={false} />
        <Switch label="Outline" variant="outline" checked={true} />
      </div>
    );
    expect(screen.getByText('ON')).toBeInTheDocument();
    expect(screen.getByText('Labeled')).toBeInTheDocument();
    expect(screen.getByText('Icon')).toBeInTheDocument();
  });

  it('displays error message when provided', () => {
    render(<Switch label="Terms" error="You must accept the terms" />);
    expect(screen.getByRole('alert')).toHaveTextContent(/you must accept the terms/i);
  });
});
