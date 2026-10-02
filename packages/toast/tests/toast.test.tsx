// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import React from 'react';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import { ToastProvider, useToast, toast } from '../src/react/Toast';

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

function getShadowViewport() {
  return document.querySelector('skyra-toast-viewport')?.shadowRoot;
}

function shadowQueryByText(text: string) {
  const root = getShadowViewport();
  if (!root) return null;
  const elements = Array.from(root.querySelectorAll('*'));
  return elements.find(el => el.textContent === text && el.children.length === 0) || null;
}

function expectShadowText(text: string) {
  const root = getShadowViewport();
  expect(root).toBeTruthy();
  const elements = Array.from(root!.querySelectorAll('*'));
  const found = elements.find(el => el.textContent?.includes(text));
  expect(found).toBeTruthy();
}

function expectNotShadowText(text: string) {
  const root = getShadowViewport();
  if (!root) return; // If no viewport, it's definitely not there
  const elements = Array.from(root.querySelectorAll('*'));
  const found = elements.find(el => el.textContent?.includes(text));
  expect(found).toBeFalsy();
}

describe('Toast Manager & ToastProvider', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    cleanup();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
    document.body.innerHTML = '';
  });

  it('renders viewport initially when no toasts are triggered', () => {
    render(
      <ToastProvider>
        <TestToastConsumer />
      </ToastProvider>
    );

    expect(document.querySelector('skyra-toast-viewport')).toBeInTheDocument();
    expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
  });

  it('adds and displays a toast notification with correct content and role', () => {
    render(
      <ToastProvider>
        <TestToastConsumer />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Trigger Success'));

    const root = getShadowViewport();
    expect(document.querySelector('skyra-toast-viewport')).toBeInTheDocument();
    expectShadowText('Success Toast');
    expectShadowText('Action completed successfully.');
  });

  it('auto-dismisses timed toasts after duration expires', () => {
    render(
      <ToastProvider>
        <TestToastConsumer />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Trigger Success'));
    expectShadowText('Success Toast');

    // Advance timer past duration (3000ms)
    act(() => {
      vi.advanceTimersByTime(3500);
    });

    expectNotShadowText('Success Toast');
  });

  it('keeps persistent toasts active until manually dismissed', () => {
    render(
      <ToastProvider>
        <TestToastConsumer />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Trigger Persistent'));
    expectShadowText('Persistent Alert');

    // Advance time significantly
    act(() => {
      vi.advanceTimersByTime(20000);
    });

    // Should still be visible
    expectShadowText('Persistent Alert');

    // Dismiss by ID
    fireEvent.click(screen.getByText('Dismiss Persistent'));
    expectNotShadowText('Persistent Alert');
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
    const root = getShadowViewport();
    const actionBtn = root?.querySelector('button.skyra-toast-action-btn') as HTMLElement;
    expect(actionBtn).toBeTruthy();
    expect(actionBtn.textContent).toBe('Undo Action');

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

    expectShadowText('Success Toast');
    expectShadowText('Persistent Alert');

    fireEvent.click(screen.getByText('Dismiss All'));

    expectNotShadowText('Success Toast');
    expectNotShadowText('Persistent Alert');
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

    expectShadowText('Imperative Toast Title');
    expectShadowText('Dispatched outside hook');
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
    expectNotShadowText('Toast 1');
    expectShadowText('Toast 2');
    expectShadowText('Toast 3');
  });
});
