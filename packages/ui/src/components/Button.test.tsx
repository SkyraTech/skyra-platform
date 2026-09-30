import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from './Button';

expect.extend(toHaveNoViolations);

describe('Button', () => {
  // Rendering
  it('has no accessibility violations', async () => {
    const { container } = render(
      <main>
        <Button>Standard</Button>
        <Button variant="orange">Orange</Button>
        <Button disabled>Disabled</Button>
        <Button isLoading loadingText="Saving">Saving</Button>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders children', () => {
    const { container } = render(<Button>Click me</Button>);
    const btn = container.querySelector('skyra-tech-button');
    expect(btn).toBeInTheDocument();
    expect(btn?.textContent).toBe('Click me');
  });

  it('renders with default variant and size attributes', () => {
    const { container } = render(<Button>Test</Button>);
    const btn = container.querySelector('skyra-tech-button');
    expect(btn).toHaveAttribute('variant', 'primary');
    expect(btn).toHaveAttribute('size', 'md');
  });

  // Variants
  it('applies variant attribute for each variant', () => {
    const variants = ['primary', 'orange', 'outline', 'ghost', 'danger'] as const;
    for (const variant of variants) {
      const { container, unmount } = render(<Button variant={variant}>V</Button>);
      expect(container.querySelector('skyra-tech-button')).toHaveAttribute('variant', variant);
      unmount();
    }
  });

  // Sizes
  it('applies size attribute', () => {
    const { container, rerender } = render(<Button size="sm">S</Button>);
    expect(container.querySelector('skyra-tech-button')).toHaveAttribute('size', 'sm');
    rerender(<Button size="lg">L</Button>);
    expect(container.querySelector('skyra-tech-button')).toHaveAttribute('size', 'lg');
  });

  // Loading
  it('shows loading spinner and disables button when isLoading=true', () => {
    const { container } = render(<Button isLoading>Save</Button>);
    const btn = container.querySelector('skyra-tech-button');
    expect(btn).toHaveAttribute('loading');
    expect(btn).toHaveAttribute('disabled');
  });

  it('is not disabled by default', () => {
    const { container } = render(<Button>Normal</Button>);
    const btn = container.querySelector('skyra-tech-button');
    expect(btn).not.toHaveAttribute('disabled');
  });

  // Disabled state
  it('is disabled when disabled=true', () => {
    const { container } = render(<Button disabled>Disabled</Button>);
    const btn = container.querySelector('skyra-tech-button');
    expect(btn).toHaveAttribute('disabled');
  });

  // Callbacks
  it('calls onClick when clicked', () => {
    const handler = vi.fn();
    const { container } = render(<Button onClick={handler}>Click</Button>);
    const btn = container.querySelector('skyra-tech-button');
    fireEvent.click(btn!);
    expect(handler).toHaveBeenCalledOnce();
  });

  it('does not call onClick when disabled', () => {
    const handler = vi.fn();
    const { container } = render(<Button disabled onClick={handler}>No click</Button>);
    const btn = container.querySelector('skyra-tech-button');
    fireEvent.click(btn!);
    expect(handler).not.toHaveBeenCalled();
  });

  // fullWidth
  it('applies full width attribute', () => {
    const { container } = render(<Button fullWidth>Wide</Button>);
    expect(container.querySelector('skyra-tech-button')).toHaveAttribute('full-width');
  });

  // iconOnly
  it('applies icon-only attribute', () => {
    const { container } = render(<Button iconOnly>•</Button>);
    expect(container.querySelector('skyra-tech-button')).toHaveAttribute('icon-only');
  });

  // type attribute
  it('defaults to type="button"', () => {
    const { container } = render(<Button>Btn</Button>);
    expect(container.querySelector('skyra-tech-button')).toHaveAttribute('type', 'button');
  });

  it('accepts type="submit"', () => {
    const { container } = render(<Button type="submit">Submit</Button>);
    expect(container.querySelector('skyra-tech-button')).toHaveAttribute('type', 'submit');
  });

  // displayName
  it('has displayName "Button"', () => {
    expect(Button.displayName).toBe('Button');
  });
});
