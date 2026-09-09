import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { NotificationBar } from './NotificationBar';

describe('NotificationBar', () => {
  it('renders notification title, message, code and accessible alert role', () => {
    render(
      <NotificationBar
        type="success"
        title="Saved successfully"
        message="Invoice #1092 has been generated."
        code="SUCCESS_200"
        duration={0}
      />
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Saved successfully')).toBeInTheDocument();
    expect(screen.getByText('Invoice #1092 has been generated.')).toBeInTheDocument();
    expect(screen.getByText('SUCCESS_200')).toBeInTheDocument();
  });

  it('manually dismisses when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <NotificationBar
        type="error"
        title="Payment Failed"
        duration={0}
        onClose={onClose}
      />
    );

    const closeBtn = screen.getByRole('button', { name: /close notification/i });
    fireEvent.click(closeBtn);

    expect(onClose).toHaveBeenCalled();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('auto-dismisses after duration elapsed', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();

    render(
      <NotificationBar
        type="info"
        title="Export in progress"
        duration={2000}
        onClose={onClose}
      />
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();

    // Advance 2100ms
    act(() => {
      vi.advanceTimersByTime(2100);
    });

    expect(onClose).toHaveBeenCalled();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    vi.useRealTimers();
  });

  it('pauses timer on hover and resumes on mouse leave', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();

    render(
      <NotificationBar
        type="warning"
        title="Session expiring"
        duration={2000}
        onClose={onClose}
      />
    );

    const alert = screen.getByRole('alert');

    // Advance 1000ms
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Hover to pause
    act(() => {
      fireEvent.mouseEnter(alert);
    });

    // Advance another 2000ms while paused
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // Still in the document because timer was paused!
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();

    // Resume on mouse leave
    act(() => {
      fireEvent.mouseLeave(alert);
    });

    // Advance remaining 1100ms
    act(() => {
      vi.advanceTimersByTime(1100);
    });

    expect(onClose).toHaveBeenCalled();

    vi.useRealTimers();
  });
});
