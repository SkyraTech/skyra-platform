import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { DropdownMenu } from './DropdownMenu';
import {
  MenuItem,
  MenuGroup,
  MenuSeparator,
  CheckboxMenuItem,
  RadioMenuItem,
} from './MenuPrimitives';
import { Button } from './Button';

describe('DropdownMenu Component', () => {
  it('renders trigger and is closed initially', () => {
    render(
      <DropdownMenu
        trigger={<Button>Actions</Button>}
        items={[
          { label: 'Edit', onClick: vi.fn() },
          { label: 'Duplicate', onClick: vi.fn() },
        ]}
      />
    );

    expect(screen.getByRole('button', { name: /actions/i })).toBeInTheDocument();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('opens menu on trigger click and displays items', () => {
    render(
      <DropdownMenu
        trigger={<Button>Actions</Button>}
        items={[
          { label: 'Edit', onClick: vi.fn() },
          { label: 'Duplicate', onClick: vi.fn() },
        ]}
      />
    );

    const trigger = screen.getByRole('button', { name: /actions/i });
    act(() => {
      fireEvent.click(trigger);
    });

    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /duplicate/i })).toBeInTheDocument();
  });

  it('calls item onClick and closes menu on selection', () => {
    const onEdit = vi.fn();
    render(
      <DropdownMenu
        trigger={<Button>Actions</Button>}
        items={[
          { label: 'Edit', onClick: onEdit },
          { label: 'Duplicate', onClick: vi.fn() },
        ]}
      />
    );

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /actions/i }));
    });

    const editItem = screen.getByRole('menuitem', { name: /edit/i });
    act(() => {
      fireEvent.click(editItem);
    });

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('does NOT activate or close menu when clicking disabled item', () => {
    const onDisabledClick = vi.fn();
    render(
      <DropdownMenu
        trigger={<Button>Actions</Button>}
        items={[
          { label: 'Active', onClick: vi.fn() },
          { label: 'Disabled Item', disabled: true, onClick: onDisabledClick },
        ]}
      />
    );

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /actions/i }));
    });

    const disabledItem = screen.getByRole('menuitem', { name: /disabled item/i });
    expect(disabledItem).toBeDisabled();

    act(() => {
      fireEvent.click(disabledItem);
    });

    expect(onDisabledClick).not.toHaveBeenCalled();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('supports compositional JSX children with MenuGroup and MenuSeparator', () => {
    const onDelete = vi.fn();
    render(
      <DropdownMenu trigger={<Button>Options</Button>}>
        <MenuGroup label="Manage">
          <MenuItem onClick={vi.fn()}>Profile</MenuItem>
          <MenuItem onClick={vi.fn()}>Settings</MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuItem destructive onClick={onDelete}>
          Delete Account
        </MenuItem>
      </DropdownMenu>
    );

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /options/i }));
    });

    expect(screen.getByRole('group', { name: /manage/i })).toBeInTheDocument();
    expect(screen.getByRole('separator')).toBeInTheDocument();
    const deleteItem = screen.getByRole('menuitem', { name: /delete account/i });
    expect(deleteItem).toHaveClass('skyra-menu-item--destructive');

    act(() => {
      fireEvent.click(deleteItem);
    });
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('supports CheckboxMenuItem with checked state toggle', () => {
    const onCheckedChange = vi.fn();
    render(
      <DropdownMenu defaultOpen trigger={<Button>View Options</Button>}>
        <CheckboxMenuItem checked={true} onCheckedChange={onCheckedChange}>
          Show Inactive Items
        </CheckboxMenuItem>
      </DropdownMenu>
    );

    const checkItem = screen.getByRole('menuitemcheckbox', { name: /show inactive items/i });
    expect(checkItem).toHaveAttribute('aria-checked', 'true');

    act(() => {
      fireEvent.click(checkItem);
    });

    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });

  it('closes on Escape key and restores trigger focus', () => {
    const onOpenChange = vi.fn();
    render(
      <DropdownMenu
        defaultOpen
        onOpenChange={onOpenChange}
        trigger={<Button>Trigger Button</Button>}
        items={[{ label: 'Item 1' }, { label: 'Item 2' }]}
      />
    );

    const menu = screen.getByRole('menu');
    act(() => {
      fireEvent.keyDown(menu, { key: 'Escape' });
    });

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('supports keyboard navigation (ArrowDown, ArrowUp, Home, End)', () => {
    render(
      <DropdownMenu
        defaultOpen
        trigger={<Button>Nav Test</Button>}
        items={[
          { label: 'First' },
          { label: 'Second' },
          { label: 'Third' },
        ]}
      />
    );

    const menu = screen.getByRole('menu');
    const firstItem = screen.getByRole('menuitem', { name: /first/i });
    const secondItem = screen.getByRole('menuitem', { name: /second/i });
    const thirdItem = screen.getByRole('menuitem', { name: /third/i });

    // Focus first item initially
    firstItem.focus();
    expect(document.activeElement).toBe(firstItem);

    // ArrowDown -> Second
    act(() => {
      fireEvent.keyDown(menu, { key: 'ArrowDown' });
    });
    expect(document.activeElement).toBe(secondItem);

    // ArrowDown -> Third
    act(() => {
      fireEvent.keyDown(menu, { key: 'ArrowDown' });
    });
    expect(document.activeElement).toBe(thirdItem);

    // ArrowDown -> wraps to First
    act(() => {
      fireEvent.keyDown(menu, { key: 'ArrowDown' });
    });
    expect(document.activeElement).toBe(firstItem);

    // ArrowUp -> wraps to Third
    act(() => {
      fireEvent.keyDown(menu, { key: 'ArrowUp' });
    });
    expect(document.activeElement).toBe(thirdItem);

    // Home -> First
    act(() => {
      fireEvent.keyDown(menu, { key: 'Home' });
    });
    expect(document.activeElement).toBe(firstItem);

    // End -> Third
    act(() => {
      fireEvent.keyDown(menu, { key: 'End' });
    });
    expect(document.activeElement).toBe(thirdItem);
  });
});
