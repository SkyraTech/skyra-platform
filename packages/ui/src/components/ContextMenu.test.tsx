import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ContextMenu } from './ContextMenu';
import { MenuItem, MenuSeparator } from './MenuPrimitives';

describe('ContextMenu Component', () => {
  it('renders target child and menu is initially closed', () => {
    render(
      <ContextMenu
        items={[
          { label: 'Edit' },
          { label: 'Delete', destructive: true },
        ]}
      >
        <div data-testid="target-row">Table Row Item</div>
      </ContextMenu>
    );

    expect(screen.getByTestId('target-row')).toBeInTheDocument();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('opens context menu on right-click (contextmenu event)', () => {
    render(
      <ContextMenu
        items={[
          { label: 'Edit Item' },
          { label: 'Delete Item', destructive: true },
        ]}
      >
        <div data-testid="target-row">Right Click Me</div>
      </ContextMenu>
    );

    const target = screen.getByTestId('target-row');
    act(() => {
      fireEvent.contextMenu(target, { clientX: 150, clientY: 200 });
    });

    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /edit item/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /delete item/i })).toBeInTheDocument();
  });

  it('executes item action and closes context menu on click', () => {
    const onEdit = vi.fn();
    render(
      <ContextMenu
        items={[
          { label: 'Edit', onClick: onEdit },
          { label: 'Copy' },
        ]}
      >
        <div data-testid="target-row">Table Item</div>
      </ContextMenu>
    );

    act(() => {
      fireEvent.contextMenu(screen.getByTestId('target-row'), { clientX: 100, clientY: 100 });
    });

    const editItem = screen.getByRole('menuitem', { name: /edit/i });
    act(() => {
      fireEvent.click(editItem);
    });

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('closes on Escape key press', () => {
    render(
      <ContextMenu
        items={[
          { label: 'Action 1' },
          { label: 'Action 2' },
        ]}
      >
        <div data-testid="target-row">Escape Test</div>
      </ContextMenu>
    );

    act(() => {
      fireEvent.contextMenu(screen.getByTestId('target-row'), { clientX: 100, clientY: 100 });
    });

    const menu = screen.getByRole('menu');
    expect(menu).toBeInTheDocument();

    act(() => {
      fireEvent.keyDown(menu, { key: 'Escape' });
    });

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('closes on outside click', () => {
    render(
      <div>
        <div data-testid="outside-box">Outside Canvas</div>
        <ContextMenu
          items={[
            { label: 'Option 1' },
          ]}
        >
          <div data-testid="target-row">Target Area</div>
        </ContextMenu>
      </div>
    );

    act(() => {
      fireEvent.contextMenu(screen.getByTestId('target-row'), { clientX: 100, clientY: 100 });
    });

    expect(screen.getByRole('menu')).toBeInTheDocument();

    act(() => {
      fireEvent.mouseDown(screen.getByTestId('outside-box'));
    });

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('does NOT open when disabled', () => {
    render(
      <ContextMenu
        disabled={true}
        items={[
          { label: 'Disabled Action' },
        ]}
      >
        <div data-testid="target-row">Disabled Target</div>
      </ContextMenu>
    );

    act(() => {
      fireEvent.contextMenu(screen.getByTestId('target-row'), { clientX: 100, clientY: 100 });
    });

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
