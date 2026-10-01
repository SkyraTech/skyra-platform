import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Switch } from './Switch';

expect.extend(toHaveNoViolations);

describe('Switch', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(
      <main>
        <Switch label="Settings" description="Toggle app settings" />
        <Switch label="Disabled Option" disabled />
        <Switch label="Terms" required error="Must accept" />
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders a custom element wrapper', () => {
    const { container } = render(<Switch label="Test Label" />);
    const wc = container.querySelector('skyra-tech-switch') as HTMLElement;
    expect(wc).toBeInTheDocument();
    expect(wc.getAttribute('label')).toBe('Test Label');
  });

  it('renders with label and helper slots when react nodes are provided', () => {
    const { container } = render(<Switch label={<span>JSX Label</span>} description={<span>JSX Desc</span>} />);
    const wc = container.querySelector('skyra-tech-switch') as HTMLElement;
    const labelSpan = container.querySelector('span[slot="label"]');
    const descSpan = container.querySelector('span[slot="helper"]');
    
    expect(labelSpan).toBeInTheDocument();
    expect(labelSpan?.textContent).toBe('JSX Label');
    expect(descSpan).toBeInTheDocument();
    expect(descSpan?.textContent).toBe('JSX Desc');
  });

  it('passes disabled, readonly, loading, and checked properties correctly', () => {
    const { container } = render(<Switch disabled readOnly loading checked={true} />);
    const wc = container.querySelector('skyra-tech-switch') as HTMLElement;
    expect(wc.hasAttribute('disabled')).toBe(true);
    expect(wc.hasAttribute('readonly')).toBe(true);
    expect(wc.hasAttribute('loading')).toBe(true);
    expect(wc.hasAttribute('checked')).toBe(true);
  });

  it('fires onChange when the internal element dispatches a change event', () => {
    const onChange = vi.fn();
    const { container } = render(<Switch label="Enable notifications" checked={false} onChange={onChange} />);
    const wc = container.querySelector('skyra-tech-switch') as any;

    // Simulate internal element state update & event firing
    wc.checked = true;
    fireEvent.change(wc);

    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('passes variants and sizes correctly', () => {
    const { container } = render(<Switch variant="outline" size="lg" />);
    const wc = container.querySelector('skyra-tech-switch') as HTMLElement;
    expect(wc.getAttribute('variant')).toBe('outline');
    expect(wc.getAttribute('size')).toBe('lg');
  });
});
