import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('renders child element and shows tooltip on focus / hover', async () => {
    vi.useFakeTimers();

    render(
      <Tooltip content="Helper tooltip information" showDelay={50}>
        <button type="button">Hover Me</button>
      </Tooltip>
    );

    const trigger = screen.getByRole('button', { name: /hover me/i });
    expect(trigger).toBeInTheDocument();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    // Focus shows tooltip immediately
    act(() => {
      fireEvent.focus(trigger);
    });
    expect(screen.getByRole('tooltip')).toHaveTextContent('Helper tooltip information');

    // Blur hides tooltip
    act(() => {
      fireEvent.blur(trigger);
    });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    vi.useRealTimers();
  });

  it('supports rich ReactNode content inside tooltip', () => {
    render(
      <Tooltip
        content={
          <div>
            <div data-testid="tooltip-title">Status: Active</div>
            <div data-testid="tooltip-meta">ID: 9942</div>
          </div>
        }
      >
        <button type="button">Active Node</button>
      </Tooltip>
    );

    const trigger = screen.getByRole('button', { name: /active node/i });
    act(() => {
      fireEvent.focus(trigger);
    });

    expect(screen.getByTestId('tooltip-title')).toHaveTextContent('Status: Active');
    expect(screen.getByTestId('tooltip-meta')).toHaveTextContent('ID: 9942');
  });

  it('dismisses tooltip on Escape key', () => {
    render(
      <Tooltip content="Press escape to close">
        <button type="button">Escape Trigger</button>
      </Tooltip>
    );

    const trigger = screen.getByRole('button', { name: /escape trigger/i });
    act(() => {
      fireEvent.focus(trigger);
    });
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    act(() => {
      fireEvent.keyDown(trigger, { key: 'Escape' });
    });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
