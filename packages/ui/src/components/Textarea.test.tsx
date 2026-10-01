import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Textarea } from './Textarea';

expect.extend(toHaveNoViolations);

describe('Textarea', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(
      <main>
        <Textarea label="Notes" placeholder="Type notes here" />
        <Textarea label="Description" required error="Field is required" />
        <Textarea disabled />
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders a custom element wrapper', () => {
    const { container } = render(<Textarea placeholder="Type here" />);
    const textarea = container.querySelector('skyra-tech-textarea') as HTMLElement;
    expect(textarea).toBeInTheDocument();
    expect(textarea.getAttribute('placeholder')).toBe('Type here');
  });

  it('renders with label when provided', () => {
    const { container } = render(<Textarea label="Notes" />);
    const textarea = container.querySelector('skyra-tech-textarea') as HTMLElement;
    expect(textarea.getAttribute('label')).toBe('Notes');
  });

  it('renders error message', () => {
    const { container } = render(<Textarea error="This field is required" />);
    const textarea = container.querySelector('skyra-tech-textarea') as HTMLElement;
    expect(textarea.getAttribute('error')).toBe('This field is required');
  });

  it('renders helper text when no error', () => {
    const { container } = render(<Textarea helper="Enter your full name" />);
    const textarea = container.querySelector('skyra-tech-textarea') as HTMLElement;
    expect(textarea.getAttribute('helper-text')).toBe('Enter your full name');
  });

  it('fires onChange when user types', () => {
    const handler = vi.fn();
    const { container } = render(<Textarea onChange={handler} />);
    const textarea = container.querySelector('skyra-tech-textarea') as any;
    
    // Simulate internal textarea dispatching event
    fireEvent.change(textarea);
    expect(handler).toHaveBeenCalled();
  });

  it('is disabled when disabled=true', () => {
    const { container } = render(<Textarea disabled />);
    const textarea = container.querySelector('skyra-tech-textarea') as HTMLElement;
    expect(textarea.hasAttribute('disabled')).toBe(true);
  });
  
  it('renders with auto-resize attribute', () => {
    const { container } = render(<Textarea autoResize minRows={5} />);
    const textarea = container.querySelector('skyra-tech-textarea') as HTMLElement;
    expect(textarea.hasAttribute('auto-resize')).toBe(true);
    expect(textarea.getAttribute('min-rows')).toBe('5');
  });
});
