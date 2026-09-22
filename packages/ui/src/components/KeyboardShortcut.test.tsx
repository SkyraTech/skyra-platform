import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  KeyboardShortcutProvider,
  useKeyboardShortcut,
} from './KeyboardShortcutProvider';
import { Kbd } from './Kbd';

function TestConsumer({
  shortcut,
  onTrigger,
  allowInInput = false,
}: {
  shortcut: string;
  onTrigger: () => void;
  allowInInput?: boolean;
}) {
  useKeyboardShortcut(shortcut, onTrigger, { allowInInput });
  return <div>Shortcut registered: {shortcut}</div>;
}

describe('KeyboardShortcut System', () => {
  it('triggers registered callback on matching keydown event', () => {
    const handler = vi.fn();
    render(
      <KeyboardShortcutProvider platform="windows">
        <TestConsumer shortcut="ctrl+s" onTrigger={handler} />
      </KeyboardShortcutProvider>
    );

    fireEvent.keyDown(window, { key: 's', ctrlKey: true });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('matches mod+k abstraction on windows with ctrlKey', () => {
    const handler = vi.fn();
    render(
      <KeyboardShortcutProvider platform="windows">
        <TestConsumer shortcut="mod+k" onTrigger={handler} />
      </KeyboardShortcutProvider>
    );

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('matches mod+k abstraction on macOS with metaKey', () => {
    const handler = vi.fn();
    render(
      <KeyboardShortcutProvider platform="mac">
        <TestConsumer shortcut="mod+k" onTrigger={handler} />
      </KeyboardShortcutProvider>
    );

    fireEvent.keyDown(window, { key: 'k', metaKey: true });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does NOT trigger global shortcut while typing in an input element by default', () => {
    const handler = vi.fn();
    render(
      <KeyboardShortcutProvider platform="windows">
        <TestConsumer shortcut="ctrl+k" onTrigger={handler} />
        <input data-testid="test-input" type="text" />
      </KeyboardShortcutProvider>
    );

    const input = screen.getByTestId('test-input');
    fireEvent.keyDown(input, { key: 'k', ctrlKey: true });
    expect(handler).not.toHaveBeenCalled();
  });

  it('triggers in input element when allowInInput: true is configured', () => {
    const handler = vi.fn();
    render(
      <KeyboardShortcutProvider platform="windows">
        <TestConsumer shortcut="ctrl+k" onTrigger={handler} allowInInput={true} />
        <input data-testid="test-input" type="text" />
      </KeyboardShortcutProvider>
    );

    const input = screen.getByTestId('test-input');
    fireEvent.keyDown(input, { key: 'k', ctrlKey: true });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('cleans up event listener registration when component unmounts', () => {
    const handler = vi.fn();
    const { unmount } = render(
      <KeyboardShortcutProvider platform="windows">
        <TestConsumer shortcut="ctrl+j" onTrigger={handler} />
      </KeyboardShortcutProvider>
    );

    unmount();
    fireEvent.keyDown(window, { key: 'j', ctrlKey: true });
    expect(handler).not.toHaveBeenCalled();
  });
});

describe('Kbd Component', () => {
  it('renders formatted shortcut keys for windows', () => {
    render(<Kbd shortcut="mod+k" platform="windows" />);
    expect(screen.getByText('Ctrl')).toBeInTheDocument();
    expect(screen.getByText('K')).toBeInTheDocument();
  });

  it('renders formatted shortcut keys for macOS', () => {
    render(<Kbd shortcut="mod+k" platform="mac" />);
    expect(screen.getByText('⌘')).toBeInTheDocument();
    expect(screen.getByText('K')).toBeInTheDocument();
  });

  it('renders children directly when shortcut prop is not provided', () => {
    render(<Kbd>Enter</Kbd>);
    expect(screen.getByText('Enter')).toBeInTheDocument();
  });
});
