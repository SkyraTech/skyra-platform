import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Input } from './Input';

expect.extend(toHaveNoViolations);

describe('Input', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(
      <main>
        <Input label="Name" placeholder="Enter name" />
        <Input label="Email" required error="Invalid email" />
        <Input disabled />
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders a custom element wrapper', () => {
    const { container } = render(<Input placeholder="Type here" />);
    const input = container.querySelector('skyra-tech-input') as HTMLElement;
    expect(input).toBeInTheDocument();
    expect(input.getAttribute('placeholder')).toBe('Type here');
  });

  it('renders with label when provided', () => {
    const { container } = render(<Input label="Email" />);
    const input = container.querySelector('skyra-tech-input') as HTMLElement;
    expect(input.getAttribute('label')).toBe('Email');
  });

  it('renders error message', () => {
    const { container } = render(<Input error="This field is required" />);
    const input = container.querySelector('skyra-tech-input') as HTMLElement;
    expect(input.getAttribute('error')).toBe('This field is required');
  });

  it('renders helper text when no error', () => {
    const { container } = render(<Input helper="Enter your full name" />);
    const input = container.querySelector('skyra-tech-input') as HTMLElement;
    expect(input.getAttribute('helper-text')).toBe('Enter your full name');
  });

  it('fires onChange when user types', () => {
    const handler = vi.fn();
    const { container } = render(<Input onChange={handler} />);
    const input = container.querySelector('skyra-tech-input') as any;
    
    // Simulate internal input dispatching event
    fireEvent.change(input);
    expect(handler).toHaveBeenCalled();
  });

  it('is disabled when disabled=true', () => {
    const { container } = render(<Input disabled />);
    const input = container.querySelector('skyra-tech-input') as HTMLElement;
    expect(input.hasAttribute('disabled')).toBe(true);
  });

  it('renders prefix (leftAdornment) in slot', () => {
    const { container } = render(<Input leftAdornment={<span>$</span>} />);
    const span = container.querySelector('span[slot="left-icon"]');
    expect(span).toBeInTheDocument();
    expect(span?.textContent).toBe('$');
  });

  it('renders suffix (rightAdornment) in slot', () => {
    const { container } = render(<Input rightAdornment={<span>.00</span>} />);
    const span = container.querySelector('span[slot="right-icon"]');
    expect(span).toBeInTheDocument();
    expect(span?.textContent).toBe('.00');
  });
});
