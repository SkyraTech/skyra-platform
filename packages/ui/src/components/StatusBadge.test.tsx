import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from './StatusBadge';

const STATUS_MAP = {
  active:   { label: 'Active',   bg: 'green',  color: '#fff' as string },
  inactive: { label: 'Inactive', bg: 'grey',   color: '#333' as string },
  pending:  { label: 'Pending',  bg: 'yellow', color: '#333' as string, border: 'orange' },
  error:    { label: 'Error',    bg: 'red',    color: '#fff' as string },
};

describe('StatusBadge', () => {
  it('renders the label for a known status', () => {
    render(<StatusBadge statusMap={STATUS_MAP} status="active" />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('applies the skyra-status-badge base class', () => {
    const { container } = render(<StatusBadge statusMap={STATUS_MAP} status="active" />);
    expect(container.firstChild).toHaveClass('skyra-status-badge');
  });

  it('applies md size class by default', () => {
    const { container } = render(<StatusBadge statusMap={STATUS_MAP} status="active" />);
    expect(container.firstChild).toHaveClass('skyra-status-badge--md');
  });

  it('applies sm size class', () => {
    const { container } = render(<StatusBadge statusMap={STATUS_MAP} status="active" size="sm" />);
    expect(container.firstChild).toHaveClass('skyra-status-badge--sm');
  });

  it('applies lg size class', () => {
    const { container } = render(<StatusBadge statusMap={STATUS_MAP} status="active" size="lg" />);
    expect(container.firstChild).toHaveClass('skyra-status-badge--lg');
  });

  it('renders the fallback label for unknown status', () => {
    render(<StatusBadge statusMap={STATUS_MAP} status="unknown" />);
    expect(screen.getByText('unknown')).toBeInTheDocument();
  });

  it('uses custom fallback config when provided', () => {
    render(
      <StatusBadge
        statusMap={STATUS_MAP}
        status="unknown"
        fallback={{ label: 'N/A', bg: 'gray', color: '#000' }}
      />
    );
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('renders inline bg color from statusMap', () => {
    const { container } = render(<StatusBadge statusMap={STATUS_MAP} status="active" />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.background).toBe('green');
  });

  it('renders all statuses without error', () => {
    for (const [status, config] of Object.entries(STATUS_MAP)) {
      const { unmount } = render(<StatusBadge statusMap={STATUS_MAP} status={status} />);
      expect(screen.getByText(config.label)).toBeInTheDocument();
      unmount();
    }
  });
});

