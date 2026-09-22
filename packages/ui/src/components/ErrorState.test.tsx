import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  ErrorState,
  ErrorStateIcon,
  ErrorStateTitle,
  ErrorStateDescription,
  ErrorStateActions,
  ErrorStateDetails,
} from './ErrorState';

describe('ErrorState Component', () => {
  it('renders correctly with composed primitives', () => {
    const handleRetry = vi.fn();

    render(
      <ErrorState>
        <ErrorStateIcon data-testid="error-icon">
          <svg aria-hidden="true" />
        </ErrorStateIcon>
        <ErrorStateTitle>Failed to load customer records</ErrorStateTitle>
        <ErrorStateDescription>
          A network timeout occurred while fetching the requested records.
        </ErrorStateDescription>
        <ErrorStateActions>
          <button type="button" onClick={handleRetry}>
            Try Again
          </button>
        </ErrorStateActions>
      </ErrorState>
    );

    expect(
      screen.getByRole('heading', { level: 3, name: 'Failed to load customer records' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('A network timeout occurred while fetching the requested records.')
    ).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: 'Try Again' });
    fireEvent.click(retryBtn);
    expect(handleRetry).toHaveBeenCalledTimes(1);

    expect(screen.getByTestId('error-icon')).toHaveAttribute('aria-hidden', 'true');
  });

  it('supports custom heading levels and variants', () => {
    const { container } = render(
      <ErrorState variant="banner">
        <ErrorStateTitle as="h2">System Error</ErrorStateTitle>
      </ErrorState>
    );

    expect(screen.getByRole('heading', { level: 2, name: 'System Error' })).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('skyra-error-state--banner');
  });

  it('renders technical details disclosure and handles copy to clipboard', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(
      <ErrorState>
        <ErrorStateTitle>Server Connection Error</ErrorStateTitle>
        <ErrorStateDetails
          errorCode="ERR_GATEWAY_TIMEOUT"
          requestId="req-987654321"
          technicalMessage="Gateway timed out after 30000ms"
        />
      </ErrorState>
    );

    // Expand details
    const toggleBtn = screen.getByRole('button', { name: /Show technical details/i });
    expect(toggleBtn).toBeInTheDocument();
    await userEvent.click(toggleBtn);

    expect(screen.getByText('ERR_GATEWAY_TIMEOUT')).toBeInTheDocument();
    expect(screen.getByText('req-987654321')).toBeInTheDocument();
    expect(screen.getByText('Gateway timed out after 30000ms')).toBeInTheDocument();

    const copyBtn = screen.getByRole('button', { name: 'Copy error details' });
    await userEvent.click(copyBtn);
    expect(writeTextMock).toHaveBeenCalledWith(
      expect.stringContaining('ERR_GATEWAY_TIMEOUT')
    );
  });
});
