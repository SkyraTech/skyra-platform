import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Alert } from './Alert';

describe('Alert', () => {
  it('renders children', () => {
    render(<Alert>Something happened</Alert>);
    expect(screen.getByText('Something happened')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<Alert title="Warning">Please review.</Alert>);
    expect(screen.getByText('Warning')).toBeInTheDocument();
  });

  it('has role="alert" for screen reader announcements', () => {
    render(<Alert>Alert content</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('applies variant class', () => {
    const { container } = render(<Alert variant="danger">Error!</Alert>);
    expect(container.firstChild).toHaveClass('skyra-alert--danger');
  });

  it('renders all variants without error', () => {
    const variants = ['info', 'success', 'warning', 'danger'] as const;
    for (const v of variants) {
      const { unmount } = render(<Alert variant={v}>{v}</Alert>);
      expect(screen.getByRole('alert')).toBeInTheDocument();
      unmount();
    }
  });

  it('renders dismiss button when onDismiss is provided', () => {
    const handler = vi.fn();
    render(<Alert onDismiss={handler}>Dismissable</Alert>);
    expect(screen.getByRole('button', { name: /dismiss/i })).toBeInTheDocument();
  });

  it('calls onDismiss when dismiss button is clicked', () => {
    const handler = vi.fn();
    render(<Alert onDismiss={handler}>Click to dismiss</Alert>);
    fireEvent.click(screen.getByRole('button', { name: /dismiss/i }));
    expect(handler).toHaveBeenCalledOnce();
  });

  it('does not render dismiss button when onDismiss is not provided', () => {
    render(<Alert>Not dismissable</Alert>);
    expect(screen.queryByRole('button', { name: /dismiss/i })).not.toBeInTheDocument();
  });
});
