import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from './Collapsible';

describe('Collapsible Component', () => {
  it('renders closed by default', () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Toggle Details</CollapsibleTrigger>
        <CollapsibleContent>Hidden Detailed Info</CollapsibleContent>
      </Collapsible>
    );

    const trigger = screen.getByRole('button', { name: /toggle details/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('Hidden Detailed Info')).not.toBeVisible();
  });

  it('renders open when defaultOpen={true}', () => {
    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Toggle Details</CollapsibleTrigger>
        <CollapsibleContent>Visible Detailed Info</CollapsibleContent>
      </Collapsible>
    );

    const trigger = screen.getByRole('button', { name: /toggle details/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Visible Detailed Info')).toBeVisible();
  });

  it('toggles open and closed on click in uncontrolled mode', () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Toggle Details</CollapsibleTrigger>
        <CollapsibleContent>Toggleable Content</CollapsibleContent>
      </Collapsible>
    );

    const trigger = screen.getByRole('button', { name: /toggle details/i });

    // Open
    act(() => {
      fireEvent.click(trigger);
    });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Toggleable Content')).toBeVisible();

    // Close
    act(() => {
      fireEvent.click(trigger);
    });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('Toggleable Content')).not.toBeVisible();
  });

  it('respects controlled open state and fires onOpenChange', () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Collapsible open={false} onOpenChange={onOpenChange}>
        <CollapsibleTrigger>Controlled Trigger</CollapsibleTrigger>
        <CollapsibleContent>Controlled Content</CollapsibleContent>
      </Collapsible>
    );

    const trigger = screen.getByRole('button', { name: /controlled trigger/i });
    act(() => {
      fireEvent.click(trigger);
    });

    expect(onOpenChange).toHaveBeenCalledWith(true);

    rerender(
      <Collapsible open={true} onOpenChange={onOpenChange}>
        <CollapsibleTrigger>Controlled Trigger</CollapsibleTrigger>
        <CollapsibleContent>Controlled Content</CollapsibleContent>
      </Collapsible>
    );

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Controlled Content')).toBeVisible();
  });

  it('toggles on Enter and Space key press', () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Keyboard Trigger</CollapsibleTrigger>
        <CollapsibleContent>Keyboard Content</CollapsibleContent>
      </Collapsible>
    );

    const trigger = screen.getByRole('button', { name: /keyboard trigger/i });

    // Press Enter to open
    act(() => {
      fireEvent.keyDown(trigger, { key: 'Enter' });
    });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    // Press Space to close
    act(() => {
      fireEvent.keyDown(trigger, { key: ' ' });
    });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('does NOT toggle when disabled', () => {
    const onOpenChange = vi.fn();
    render(
      <Collapsible disabled onOpenChange={onOpenChange}>
        <CollapsibleTrigger>Disabled Trigger</CollapsibleTrigger>
        <CollapsibleContent>Disabled Content</CollapsibleContent>
      </Collapsible>
    );

    const trigger = screen.getByRole('button', { name: /disabled trigger/i });
    expect(trigger).toBeDisabled();

    act(() => {
      fireEvent.click(trigger);
    });

    expect(onOpenChange).not.toHaveBeenCalled();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});
