// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import React from 'react';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import { NotificationBar } from '../src/react/NotificationBar';

describe('NotificationBar', () => {
  beforeEach(() => cleanup());
  afterEach(() => cleanup());
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

    const alertEl = screen.getByRole('alert');
    expect(alertEl).toBeInTheDocument();
    expect(alertEl).toHaveAttribute('code', 'SUCCESS_200');
    expect(screen.getByText('Saved successfully')).toBeInTheDocument();
    expect(screen.getByText('Invoice #1092 has been generated.')).toBeInTheDocument();
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

    const alertEl = screen.getByRole('alert');
    const closeBtn = alertEl.shadowRoot?.querySelector('.close-btn') as HTMLElement;
    fireEvent.click(closeBtn);

    expect(onClose).toHaveBeenCalled();
    expect(alertEl.style.display).toBe('none');
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
    const alertEl = document.querySelector('skyra-notification-bar') as HTMLElement;
    expect(alertEl.style.display).toBe('none');

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
