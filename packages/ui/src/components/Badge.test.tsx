import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('applies variant class', () => {
    const { container } = render(<Badge variant="success">OK</Badge>);
    expect(container.firstChild).toHaveClass('skyra-badge--success');
  });

  it('applies size class', () => {
    const { container } = render(<Badge size="lg">Big</Badge>);
    expect(container.firstChild).toHaveClass('skyra-badge--lg');
  });

  it('applies default variant (neutral)', () => {
    const { container } = render(<Badge>Default</Badge>);
    expect(container.firstChild).toHaveClass('skyra-badge');
  });

  it('renders all variants without error', () => {
    const variants = ['neutral', 'primary', 'success', 'warning', 'danger', 'orange', 'info'] as const;
    for (const v of variants) {
      const { unmount } = render(<Badge variant={v}>{v}</Badge>);
      expect(screen.getByText(v)).toBeInTheDocument();
      unmount();
    }
  });
});
