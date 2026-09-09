import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Popover } from './Popover';
import { Button } from './Button';

describe('Popover Component', () => {
  it('renders trigger and is closed initially by default', () => {
    render(
      <Popover
        trigger={<Button>Open Popover</Button>}
        content={<div>Popover Content</div>}
      />
    );

    expect(screen.getByRole('button', { name: /open popover/i })).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens on click in uncontrolled mode', () => {
    render(
      <Popover
        trigger={<Button>Open Popover</Button>}
        content={<div>Popover Content</div>}
      />
    );

    const trigger = screen.getByRole('button', { name: /open popover/i });
    act(() => {
      fireEvent.click(trigger);
    });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Popover Content')).toBeInTheDocument();
  });

  it('toggles open/close on repeated click', () => {
    render(
      <Popover
        trigger={<Button>Toggle Popover</Button>}
        content={<div>Toggled Content</div>}
      />
    );

    const trigger = screen.getByRole('button', { name: /toggle popover/i });
    
    // Open
    act(() => {
      fireEvent.click(trigger);
    });
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Close
    act(() => {
      fireEvent.click(trigger);
    });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('respects controlled open state and fires onOpenChange', () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Popover
        open={false}
        onOpenChange={onOpenChange}
        trigger={<Button>Controlled</Button>}
        content={<div>Controlled Content</div>}
      />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    const trigger = screen.getByRole('button', { name: /controlled/i });
    act(() => {
      fireEvent.click(trigger);
    });
    expect(onOpenChange).toHaveBeenCalledWith(true);

    // Re-render with open=true
    rerender(
      <Popover
        open={true}
        onOpenChange={onOpenChange}
        trigger={<Button>Controlled</Button>}
        content={<div>Controlled Content</div>}
      />
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes on Escape key press and invokes onOpenChange', () => {
    const onOpenChange = vi.fn();
    render(
      <Popover
        defaultOpen={true}
        onOpenChange={onOpenChange}
        trigger={<Button>Esc Test</Button>}
        content={<div>Esc Content</div>}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    act(() => {
      fireEvent.keyDown(document, { key: 'Escape' });
    });

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('closes on outside click', () => {
    const onOpenChange = vi.fn();
    render(
      <div>
        <div data-testid="outside">Outside area</div>
        <Popover
          defaultOpen={true}
          onOpenChange={onOpenChange}
          trigger={<Button>Outside Test</Button>}
          content={<div>Outside Content</div>}
        />
      </div>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    act(() => {
      fireEvent.mouseDown(screen.getByTestId('outside'));
    });

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('does NOT open when disabled', () => {
    const onOpenChange = vi.fn();
    render(
      <Popover
        disabled={true}
        onOpenChange={onOpenChange}
        trigger={<Button disabled>Disabled Popover</Button>}
        content={<div>Should Not Open</div>}
      />
    );

    const trigger = screen.getByRole('button', { name: /disabled popover/i });
    act(() => {
      fireEvent.click(trigger);
    });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('renders rich ReactNode content inside the popover', () => {
    render(
      <Popover
        defaultOpen={true}
        trigger={<Button>Rich Content</Button>}
        content={
          <div>
            <h3>Filter Options</h3>
            <label htmlFor="filter-input">Search term</label>
            <input id="filter-input" placeholder="Type here..." />
            <button type="button">Apply Filter</button>
          </div>
        }
      />
    );

    expect(screen.getByRole('heading', { name: /filter options/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type here...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /apply filter/i })).toBeInTheDocument();
  });
});
