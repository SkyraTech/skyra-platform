import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './Accordion';

describe('Accordion Component', () => {
  it('renders accordion in single mode with defaultValue', () => {
    render(
      <Accordion type="single" defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Section 1 Content</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Section 2</AccordionTrigger>
          <AccordionContent>Section 2 Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger1 = screen.getByRole('button', { name: /section 1/i });
    const trigger2 = screen.getByRole('button', { name: /section 2/i });

    expect(trigger1).toHaveAttribute('aria-expanded', 'true');
    expect(trigger2).toHaveAttribute('aria-expanded', 'false');

    expect(screen.getByText('Section 1 Content')).toBeVisible();
    expect(screen.getByText('Section 2 Content')).not.toBeVisible();
  });

  it('switches expanded item in single mode on click', () => {
    render(
      <Accordion type="single" defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Section 1 Content</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Section 2</AccordionTrigger>
          <AccordionContent>Section 2 Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger2 = screen.getByRole('button', { name: /section 2/i });
    act(() => {
      fireEvent.click(trigger2);
    });

    const trigger1 = screen.getByRole('button', { name: /section 1/i });
    expect(trigger1).toHaveAttribute('aria-expanded', 'false');
    expect(trigger2).toHaveAttribute('aria-expanded', 'true');

    expect(screen.getByText('Section 2 Content')).toBeVisible();
    expect(screen.getByText('Section 1 Content')).not.toBeVisible();
  });

  it('allows collapsing active item in single mode when collapsible={true}', () => {
    render(
      <Accordion type="single" defaultValue="item-1" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Section 1 Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger1 = screen.getByRole('button', { name: /section 1/i });
    expect(trigger1).toHaveAttribute('aria-expanded', 'true');

    act(() => {
      fireEvent.click(trigger1);
    });

    expect(trigger1).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('Section 1 Content')).not.toBeVisible();
  });

  it('supports multiple mode with multiple expanded items simultaneously', () => {
    render(
      <Accordion type="multiple" defaultValue={['item-1', 'item-2']}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Section 1 Content</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Section 2</AccordionTrigger>
          <AccordionContent>Section 2 Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger1 = screen.getByRole('button', { name: /section 1/i });
    const trigger2 = screen.getByRole('button', { name: /section 2/i });

    expect(trigger1).toHaveAttribute('aria-expanded', 'true');
    expect(trigger2).toHaveAttribute('aria-expanded', 'true');

    expect(screen.getByText('Section 1 Content')).toBeVisible();
    expect(screen.getByText('Section 2 Content')).toBeVisible();

    // Collapse Section 1
    act(() => {
      fireEvent.click(trigger1);
    });
    expect(trigger1).toHaveAttribute('aria-expanded', 'false');
    expect(trigger2).toHaveAttribute('aria-expanded', 'true');
  });

  it('respects controlled value and fires onValueChange in multiple mode', () => {
    const onValueChange = vi.fn();
    render(
      <Accordion type="multiple" value={['item-1']} onValueChange={onValueChange}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Section 1 Content</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Section 2</AccordionTrigger>
          <AccordionContent>Section 2 Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger2 = screen.getByRole('button', { name: /section 2/i });
    act(() => {
      fireEvent.click(trigger2);
    });

    expect(onValueChange).toHaveBeenCalledWith(['item-1', 'item-2']);
  });

  it('does NOT toggle when item is disabled', () => {
    const onValueChange = vi.fn();
    render(
      <Accordion type="single" onValueChange={onValueChange}>
        <AccordionItem value="item-1" disabled>
          <AccordionTrigger>Disabled Section</AccordionTrigger>
          <AccordionContent>Disabled Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByRole('button', { name: /disabled section/i });
    expect(trigger).toBeDisabled();

    act(() => {
      fireEvent.click(trigger);
    });

    expect(onValueChange).not.toHaveBeenCalled();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('supports keyboard navigation (ArrowDown, ArrowUp, Home, End) between triggers', () => {
    render(
      <Accordion type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Section 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Section 3</AccordionTrigger>
          <AccordionContent>Content 3</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger1 = screen.getByRole('button', { name: /section 1/i });
    const trigger2 = screen.getByRole('button', { name: /section 2/i });
    const trigger3 = screen.getByRole('button', { name: /section 3/i });

    trigger1.focus();
    expect(document.activeElement).toBe(trigger1);

    // ArrowDown -> Trigger 2
    act(() => {
      fireEvent.keyDown(trigger1, { key: 'ArrowDown' });
    });
    expect(document.activeElement).toBe(trigger2);

    // End -> Trigger 3
    act(() => {
      fireEvent.keyDown(trigger2, { key: 'End' });
    });
    expect(document.activeElement).toBe(trigger3);

    // Home -> Trigger 1
    act(() => {
      fireEvent.keyDown(trigger3, { key: 'Home' });
    });
    expect(document.activeElement).toBe(trigger1);
  });
});
