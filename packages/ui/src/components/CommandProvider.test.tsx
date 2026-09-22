import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { CommandProvider, useCommandRegistry, Command } from './CommandProvider';

function TestRegistryConsumer({ onRegister }: { onRegister?: (actions: any) => void }) {
  const { commands, registerCommand, unregisterCommand, executeCommand } = useCommandRegistry();

  React.useEffect(() => {
    onRegister?.({ registerCommand, unregisterCommand, executeCommand });
  }, [registerCommand, unregisterCommand, executeCommand, onRegister]);

  return (
    <div>
      <div data-testid="command-count">{commands.length}</div>
      <ul>
        {commands.map((c) => (
          <li key={c.id}>
            <span>{c.label}</span>
            <button onClick={() => executeCommand(c.id)}>Run {c.id}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

describe('CommandProvider & useCommandRegistry', () => {
  it('provides initial commands and executes registered commands', () => {
    const onExec = vi.fn();
    const initialCommands: Command[] = [
      { id: 'cmd-1', label: 'Initial Command', onExecute: onExec },
    ];

    render(
      <CommandProvider initialCommands={initialCommands}>
        <TestRegistryConsumer />
      </CommandProvider>
    );

    expect(screen.getByTestId('command-count')).toHaveTextContent('1');
    expect(screen.getByText('Initial Command')).toBeInTheDocument();

    const runBtn = screen.getByRole('button', { name: 'Run cmd-1' });
    fireEvent.click(runBtn);
    expect(onExec).toHaveBeenCalledTimes(1);
  });

  it('allows dynamic registration and unregistration of commands', () => {
    let registryMethods: any;
    const initialCommands: Command[] = [
      { id: 'base', label: 'Base Command', onExecute: vi.fn() },
    ];

    render(
      <CommandProvider initialCommands={initialCommands}>
        <TestRegistryConsumer onRegister={(m) => { registryMethods = m; }} />
      </CommandProvider>
    );

    expect(screen.getByTestId('command-count')).toHaveTextContent('1');

    let unregister: any;
    act(() => {
      unregister = registryMethods.registerCommand({
        id: 'dynamic-cmd',
        label: 'Dynamic Command',
        onExecute: vi.fn(),
      });
    });

    expect(screen.getByTestId('command-count')).toHaveTextContent('2');
    expect(screen.getByText('Dynamic Command')).toBeInTheDocument();


    act(() => {
      unregister();
    });

    expect(screen.getByTestId('command-count')).toHaveTextContent('1');
    expect(screen.queryByText('Dynamic Command')).toBeNull();
  });
});
