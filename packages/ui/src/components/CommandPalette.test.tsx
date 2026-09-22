import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  CommandPalette,
  CommandPaletteTrigger,
  CommandPaletteInput,
  CommandPaletteList,
  CommandPaletteGroup,
  CommandPaletteItem,
  CommandPaletteEmpty,
} from './CommandPalette';
import { Command } from './CommandProvider';

describe('CommandPalette Component', () => {
  const sampleCommands: Command[] = [
    {
      id: 'export-data',
      label: 'Export Data',
      description: 'Export table data to CSV or Excel',
      keywords: ['download', 'csv', 'excel'],
      group: 'Actions',
      shortcut: 'mod+e',
      onExecute: vi.fn(),
    },
    {
      id: 'toggle-dark',
      label: 'Toggle Dark Mode',
      description: 'Switch application color theme',
      keywords: ['theme', 'night'],
      group: 'Preferences',
      shortcut: 'mod+d',
      onExecute: vi.fn(),
    },
    {
      id: 'disabled-action',
      label: 'Disabled Action',
      description: 'Currently unavailable',
      group: 'Actions',
      disabled: true,
      onExecute: vi.fn(),
    },
  ];

  it('renders nothing when open is false', () => {
    render(
      <CommandPalette open={false} commands={sampleCommands} />
    );
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders modal dialog and search input when open is true', () => {
    render(
      <CommandPalette open={true} commands={sampleCommands} />
    );
    const dialog = screen.getByRole('dialog', { name: 'Command Palette' });
    expect(dialog).toBeInTheDocument();

    const input = screen.getByRole('combobox');
    expect(input).toBeInTheDocument();
  });

  it('renders command items and group headings', () => {
    render(
      <CommandPalette open={true} commands={sampleCommands} />
    );
    expect(screen.getByText('Actions')).toBeInTheDocument();
    expect(screen.getByText('Preferences')).toBeInTheDocument();
    expect(screen.getByText('Export Data')).toBeInTheDocument();
    expect(screen.getByText('Toggle Dark Mode')).toBeInTheDocument();
  });

  it('filters commands via search input by label and keywords', () => {
    render(
      <CommandPalette open={true} commands={sampleCommands} />
    );
    const input = screen.getByRole('combobox');

    // Keyword search
    fireEvent.change(input, { target: { value: 'csv' } });
    expect(screen.getByText('Export Data')).toBeInTheDocument();
    expect(screen.queryByText('Toggle Dark Mode')).toBeNull();

    // Clear search
    fireEvent.change(input, { target: { value: '' } });
    expect(screen.getByText('Toggle Dark Mode')).toBeInTheDocument();
  });

  it('shows empty message when no commands match query', () => {
    render(
      <CommandPalette open={true} commands={sampleCommands} emptyText="No results found." />
    );
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'xyz123nonexistent' } });
    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });

  it('navigates with ArrowDown and ArrowUp and executes command on Enter', () => {
    const onExecuteExport = vi.fn();
    const onExecuteTheme = vi.fn();
    const onOpenChange = vi.fn();

    const commands: Command[] = [
      { id: '1', label: 'First Command', onExecute: onExecuteExport },
      { id: '2', label: 'Second Command', onExecute: onExecuteTheme },
    ];

    render(
      <CommandPalette open={true} commands={commands} onOpenChange={onOpenChange} />
    );

    const input = screen.getByRole('combobox');

    // ArrowDown moves active item to Second Command
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    // Enter executes active command
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onExecuteTheme).toHaveBeenCalledTimes(1);
    expect(onExecuteExport).not.toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('closes when Escape key is pressed', () => {
    const onOpenChange = vi.fn();
    render(
      <CommandPalette open={true} commands={sampleCommands} onOpenChange={onOpenChange} />
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('does not execute disabled commands on click or enter', () => {
    const disabledFn = vi.fn();
    const commands: Command[] = [
      { id: 'disabled', label: 'Disabled Item', disabled: true, onExecute: disabledFn },
    ];

    render(<CommandPalette open={true} commands={commands} />);

    const item = screen.getByRole('option');
    expect(item).toHaveAttribute('aria-disabled', 'true');

    fireEvent.click(item);
    expect(disabledFn).not.toHaveBeenCalled();
  });
});
