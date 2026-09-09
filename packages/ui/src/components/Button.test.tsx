import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  // Rendering
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('renders with default variant and size classes', () => {
    render(<Button>Test</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('skyra-btn--primary');
    expect(btn.className).toContain('skyra-btn--md');
  });

  // Variants
  it('applies variant class for each variant', () => {
    const variants = ['primary', 'orange', 'outline', 'ghost', 'danger'] as const;
    for (const variant of variants) {
      const { unmount } = render(<Button variant={variant}>V</Button>);
      expect(screen.getByRole('button').className).toContain(`skyra-btn--${variant}`);
      unmount();
    }
  });

  // Sizes
  it('applies size class', () => {
    const { rerender } = render(<Button size="sm">S</Button>);
    expect(screen.getByRole('button').className).toContain('skyra-btn--sm');
    rerender(<Button size="lg">L</Button>);
    expect(screen.getByRole('button').className).toContain('skyra-btn--lg');
  });

  // Loading
  it('shows loading spinner and disables button when isLoading=true', () => {
    render(<Button isLoading>Save</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(btn).toHaveAttribute('aria-disabled', 'true');
  });

  it('is not disabled by default', () => {
    render(<Button>Normal</Button>);
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  // Disabled state
  it('is disabled when disabled=true', () => {
    render(<Button disabled>Disabled</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-disabled', 'true');
  });

  // Callbacks
  it('calls onClick when clicked', () => {
    const handler = vi.fn();
    render(<Button onClick={handler}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handler).toHaveBeenCalledOnce();
  });

  it('does not call onClick when disabled', () => {
    const handler = vi.fn();
    render(<Button disabled onClick={handler}>No click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handler).not.toHaveBeenCalled();
  });

  // fullWidth
  it('applies full width class', () => {
    render(<Button fullWidth>Wide</Button>);
    expect(screen.getByRole('button').className).toContain('skyra-btn--full');
  });

  // iconOnly
  it('applies icon-only class', () => {
    render(<Button iconOnly>•</Button>);
    expect(screen.getByRole('button').className).toContain('skyra-btn--icon');
  });

  // type attribute
  it('defaults to type="button"', () => {
    render(<Button>Btn</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('accepts type="submit"', () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  // displayName
  it('has displayName "Button"', () => {
    expect(Button.displayName).toBe('Button');
  });
});
