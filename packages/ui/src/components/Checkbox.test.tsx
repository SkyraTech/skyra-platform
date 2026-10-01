import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Checkbox } from './Checkbox';

expect.extend(toHaveNoViolations);

describe('Checkbox', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(
      <main>
        <Checkbox label="Accept terms" />
        <Checkbox label="Agree" required error="Must accept" />
        <Checkbox disabled label="Cannot click" />
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders a custom element wrapper', () => {
    const { container } = render(<Checkbox label="Test Label" />);
    const checkbox = container.querySelector('skyra-tech-checkbox') as HTMLElement;
    expect(checkbox).toBeInTheDocument();
    expect(checkbox.getAttribute('label')).toBe('Test Label');
  });

  it('renders with label slot when react node provided', () => {
    const { container } = render(<Checkbox label={<span>JSX Label</span>} />);
    const checkbox = container.querySelector('skyra-tech-checkbox') as HTMLElement;
    const span = container.querySelector('span[slot="label"]');
    expect(span).toBeInTheDocument();
    expect(span?.textContent).toBe('JSX Label');
  });

  it('renders error message', () => {
    const { container } = render(<Checkbox error="This field is required" />);
    const checkbox = container.querySelector('skyra-tech-checkbox') as HTMLElement;
    expect(checkbox.getAttribute('error')).toBe('This field is required');
  });

  it('renders helper text when no error', () => {
    const { container } = render(<Checkbox helper="Enter your full name" />);
    const checkbox = container.querySelector('skyra-tech-checkbox') as HTMLElement;
    expect(checkbox.getAttribute('helper-text')).toBe('Enter your full name');
  });

  it('fires onChange when user clicks', () => {
    const handler = vi.fn();
    const { container } = render(<Checkbox onChange={handler} />);
    const checkbox = container.querySelector('skyra-tech-checkbox') as any;
    
    // Simulate internal checkbox dispatching event
    checkbox.checked = true;
    fireEvent.change(checkbox);
    
    expect(handler).toHaveBeenCalled();
  });

  it('is disabled when disabled=true', () => {
    const { container } = render(<Checkbox disabled />);
    const checkbox = container.querySelector('skyra-tech-checkbox') as HTMLElement;
    expect(checkbox.hasAttribute('disabled')).toBe(true);
  });
});
