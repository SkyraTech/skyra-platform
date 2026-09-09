import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders with label', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByText('Accept terms')).toBeInTheDocument();
  });

  it('renders a checkbox input', () => {
    render(<Checkbox label="Check me" />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('is checked when checked=true', () => {
    render(<Checkbox label="Checked" checked onChange={() => {}} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('is unchecked when checked=false', () => {
    render(<Checkbox label="Unchecked" checked={false} onChange={() => {}} />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('is disabled when disabled=true', () => {
    render(<Checkbox label="Disabled" disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('fires onChange when clicked', () => {
    const handler = vi.fn();
    render(<Checkbox label="Toggle" onChange={handler} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(handler).toHaveBeenCalled();
  });

  it('renders error message', () => {
    render(<Checkbox label="Accept" error="Required" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
  });
});
