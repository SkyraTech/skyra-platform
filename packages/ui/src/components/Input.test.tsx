import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input placeholder="Type here" />);
    expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument();
  });

  it('renders with label when provided', () => {
    render(<Input label="Email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders required indicator when required=true', () => {
    render(<Input label="Name" required />);
    // The asterisk is part of the label area
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('renders error message', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('renders helper text when no error', () => {
    render(<Input helper="Enter your full name" />);
    expect(screen.getByText('Enter your full name')).toBeInTheDocument();
  });

  it('does not show helper text when error is present', () => {
    render(<Input helper="Helper" error="Error msg" />);
    expect(screen.queryByText('Helper')).not.toBeInTheDocument();
    expect(screen.getByText('Error msg')).toBeInTheDocument();
  });

  it('fires onChange when user types', () => {
    const handler = vi.fn();
    render(<Input onChange={handler} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hello' } });
    expect(handler).toHaveBeenCalled();
  });

  it('is disabled when disabled=true', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('renders prefix (leftAdornment) when provided', () => {
    render(<Input leftAdornment={<span>$</span>} />);
    expect(screen.getByText('$')).toBeInTheDocument();
  });

  it('renders suffix (rightAdornment) when provided', () => {
    render(<Input rightAdornment={<span>.00</span>} />);
    expect(screen.getByText('.00')).toBeInTheDocument();
  });

  it('associates label with input via htmlFor/id', () => {
    render(<Input label="Phone" id="phone-field" />);
    const label = screen.getByText('Phone');
    expect(label).toHaveAttribute('for', 'phone-field');
  });
});
