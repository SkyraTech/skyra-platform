import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateActions,
} from './EmptyState';

describe('EmptyState Component', () => {
  it('renders correctly with composed primitives', () => {
    render(
      <EmptyState>
        <EmptyStateIcon data-testid="empty-icon">
          <svg aria-hidden="true" />
        </EmptyStateIcon>
        <EmptyStateTitle>No Invoices Found</EmptyStateTitle>
        <EmptyStateDescription>
          Get started by creating your first invoice.
        </EmptyStateDescription>
        <EmptyStateActions>
          <button type="button">Create Invoice</button>
        </EmptyStateActions>
      </EmptyState>
    );

    expect(screen.getByRole('heading', { level: 3, name: 'No Invoices Found' })).toBeInTheDocument();
    expect(screen.getByText('Get started by creating your first invoice.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Invoice' })).toBeInTheDocument();
    expect(screen.getByTestId('empty-icon')).toHaveAttribute('aria-hidden', 'true');
  });

  it('supports custom heading levels', () => {
    render(
      <EmptyState>
        <EmptyStateTitle as="h2">Empty Vault</EmptyStateTitle>
      </EmptyState>
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Empty Vault' })).toBeInTheDocument();
  });

  it('supports compact mode and border variants', () => {
    const { container } = render(
      <EmptyState variant="dashed" compact>
        <EmptyStateTitle>No items</EmptyStateTitle>
      </EmptyState>
    );

    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass('skyra-empty-state--compact');
    expect(root).toHaveClass('skyra-empty-state--dashed');
  });
});
