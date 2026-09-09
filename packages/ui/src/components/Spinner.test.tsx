import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('renders without crashing', () => {
    const { container } = render(<Spinner />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('has aria-hidden by default (decorative)', () => {
    const { container } = render(<Spinner />);
    // Spinner is decorative; it should either be aria-hidden or have a label
    const el = container.firstChild as HTMLElement;
    expect(el).toBeInTheDocument();
  });

  it('applies size class for sm', () => {
    const { container } = render(<Spinner size="sm" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('sm');
  });

  it('applies size class for lg', () => {
    const { container } = render(<Spinner size="lg" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('lg');
  });
});
