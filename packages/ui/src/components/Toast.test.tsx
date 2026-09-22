import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ToastProvider, useToast, toast } from './Toast';

// Test consumer component
function TestToastConsumer() {
  const { toast: addToast, dismiss, dismissAll, toasts } = useToast();

  return (
    <div>
      <span data-testid="toast-count">{toasts.length}</span>
      <button
        onClick={() =>
          addToast({
            title: 'Success Toast',
            message: 'Action completed successfully.',
            type: 'success',
            duration: 3000,
          })
        }
      >
        Trigger Success
      </button>

      <button
        onClick={() =>
          addToast({
            id: 'persistent-1',
            title: 'Persistent Alert',
            persistent: true,
          })
        }
      >
        Trigger Persistent
      </button>

      <button
        onClick={() =>
          addToast({
            id: 'action-toast',
            title: 'Error with Action',
            type: 'error',
            action: {
              label: 'Retry Now',
              onClick: vi.fn(),
            },
          })
        }
      >
        Trigger Action Toast
      </button>

      <button onClick={() => dismiss('persistent-1')}>Dismiss Persistent</button>
      <button onClick={() => dismissAll()}>Dismiss All</button>
    </div>
  );
}

describe('Toast Manager & ToastProvider', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders nothing initially when no toasts are triggered', () => {
    render(
      <ToastProvider>
        <TestToastConsumer />
      </ToastProvider>
    );

    expect(screen.queryByRole('region', { name: 'Notifications' })).not.toBeInTheDocument();
    expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
  });

  it('adds and displays a toast notification with correct content and role', () => {
    render(
      <ToastProvider>
        <TestToastConsumer />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Trigger Success'));

    expect(screen.getByRole('region', { name: 'Notifications' })).toBeInTheDocument();
    expect(screen.getByText('Success Toast')).toBeInTheDocument();
    expect(screen.getByText('Action completed successfully.')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('auto-dismisses timed toasts after duration expires', () => {
    render(
      <ToastProvider>
        <TestToastConsumer />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Trigger Success'));
    expect(screen.getByText('Success Toast')).toBeInTheDocument();

    // Advance timer past duration (3000ms)
    act(() => {
      vi.advanceTimersByTime(3500);
    });

    expect(screen.queryByText('Success Toast')).not.toBeInTheDocument();
  });

  it('keeps persistent toasts active until manually dismissed', () => {
    render(
      <ToastProvider>
        <TestToastConsumer />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Trigger Persistent'));
    expect(screen.getByText('Persistent Alert')).toBeInTheDocument();

    // Advance time significantly
    act(() => {
      vi.advanceTimersByTime(20000);
    });

    // Should still be visible
    expect(screen.getByText('Persistent Alert')).toBeInTheDocument();

    // Dismiss by ID
    fireEvent.click(screen.getByText('Dismiss Persistent'));
    expect(screen.queryByText('Persistent Alert')).not.toBeInTheDocument();
  });

  it('renders interactive action button and fires onClick callback', () => {
    const actionMock = vi.fn();
    function ActionConsumer() {
      const { toast: addToast } = useToast();
      return (
        <button
          onClick={() =>
            addToast({
              title: 'Action Item',
              action: { label: 'Undo Action', onClick: actionMock },
            })
          }
        >
          Add Action
        </button>
      );
    }

    render(
      <ToastProvider>
        <ActionConsumer />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Add Action'));
    const actionBtn = screen.getByRole('button', { name: 'Undo Action' });
    expect(actionBtn).toBeInTheDocument();

    fireEvent.click(actionBtn);
    expect(actionMock).toHaveBeenCalledTimes(1);
  });

  it('dismisses all toasts when dismissAll is invoked', () => {
    render(
      <ToastProvider>
        <TestToastConsumer />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Trigger Success'));
    fireEvent.click(screen.getByText('Trigger Persistent'));

    expect(screen.getByText('Success Toast')).toBeInTheDocument();
    expect(screen.getByText('Persistent Alert')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Dismiss All'));

    expect(screen.queryByText('Success Toast')).not.toBeInTheDocument();
    expect(screen.queryByText('Persistent Alert')).not.toBeInTheDocument();
  });

  it('supports the global imperative toast() function', () => {
    render(
      <ToastProvider>
        <div>App Content</div>
      </ToastProvider>
    );

    act(() => {
      toast({
        title: 'Imperative Toast Title',
        message: 'Dispatched outside hook',
        type: 'info',
      });
    });

    expect(screen.getByText('Imperative Toast Title')).toBeInTheDocument();
    expect(screen.getByText('Dispatched outside hook')).toBeInTheDocument();
  });

  it('enforces maxVisible constraint on active toast stack', () => {
    render(
      <ToastProvider maxVisible={2}>
        <TestToastConsumer />
      </ToastProvider>
    );

    act(() => {
      toast({ id: 't1', title: 'Toast 1', persistent: true });
      toast({ id: 't2', title: 'Toast 2', persistent: true });
      toast({ id: 't3', title: 'Toast 3', persistent: true });
    });

    // Oldest toast 't1' should be trimmed
    expect(screen.queryByText('Toast 1')).not.toBeInTheDocument();
    expect(screen.getByText('Toast 2')).toBeInTheDocument();
    expect(screen.getByText('Toast 3')).toBeInTheDocument();
  });
});
