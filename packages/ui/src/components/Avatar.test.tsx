import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  // ── Default Rendering ────────────────────────────────────────────────────

  it('renders with role="img" and default alt', () => {
    render(<Avatar />);
    const avatar = screen.getByRole('img', { name: 'Avatar' });
    expect(avatar).toBeInTheDocument();
  });

  it('exposes aria-label from alt prop', () => {
    render(<Avatar alt="Jane Doe" />);
    expect(screen.getByRole('img', { name: 'Jane Doe' })).toBeInTheDocument();
  });

  it('renders with the skyra-avatar CSS class', () => {
    // No src → only one role="img" (the div wrapper)
    render(<Avatar alt="User" />);
    expect(screen.getByRole('img')).toHaveClass('skyra-avatar');
  });

  // ── Initials Fallback ────────────────────────────────────────────────────

  it('shows the first character of alt as initials when no src and no fallback', () => {
    render(<Avatar alt="Alex" />);
    // First char of "Alex" is "A"
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('shows the first char uppercased regardless of alt casing', () => {
    render(<Avatar alt="mike" />);
    expect(screen.getByText('M')).toBeInTheDocument();
  });

  // ── Custom Fallback ──────────────────────────────────────────────────────

  it('renders custom fallback content when no src is provided', () => {
    render(<Avatar fallback="JD" alt="Jane Doe" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders ReactNode fallback (icon element)', () => {
    render(<Avatar fallback={<span data-testid="icon">★</span>} alt="Star" />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  // ── Image Rendering ──────────────────────────────────────────────────────

  it('renders an img element when src is provided', () => {
    render(<Avatar src="https://example.com/avatar.jpg" alt="Profile Photo" />);
    const img = screen.getByAltText('Profile Photo') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toBe('https://example.com/avatar.jpg');
  });

  it('does not show fallback text when image is loaded successfully', () => {
    render(<Avatar src="https://example.com/avatar.jpg" alt="Jane" fallback="JD" />);
    // Fallback 'JD' must not appear when img is rendered
    expect(screen.queryByText('JD')).not.toBeInTheDocument();
  });

  // ── Image Error / Fallback Activation ───────────────────────────────────

  it('switches to fallback when image fails to load', () => {
    render(
      <Avatar src="https://example.com/broken.jpg" alt="Broken" fallback="BR" />,
    );
    const img = screen.getByAltText('Broken');
    expect(img).toBeInTheDocument();

    // Trigger the img error event
    fireEvent.error(img);

    // Image must disappear, custom fallback must appear
    expect(screen.queryByAltText('Broken')).not.toBeInTheDocument();
    expect(screen.getByText('BR')).toBeInTheDocument();
  });

  it('switches to initials fallback when image errors and no custom fallback', () => {
    render(<Avatar src="https://example.com/broken.jpg" alt="Zara" />);
    fireEvent.error(screen.getByAltText('Zara'));
    expect(screen.queryByAltText('Zara')).not.toBeInTheDocument();
    expect(screen.getByText('Z')).toBeInTheDocument();
  });

  it('treats src=null the same as no src (shows fallback immediately)', () => {
    render(<Avatar src={null} alt="Null Src" fallback="NS" />);
    expect(screen.getByText('NS')).toBeInTheDocument();
    expect(screen.queryByAltText('Null Src')).not.toBeInTheDocument();
  });

  // ── Size Variants ────────────────────────────────────────────────────────

  it.each([
    ['xs', '24px', '24px'],
    ['sm', '32px', '32px'],
    ['md', '40px', '40px'],
    ['lg', '48px', '48px'],
    ['xl', '64px', '64px'],
  ] as const)('size="%s" applies correct width and height', (size, w, h) => {
    // No src → unambiguous single role="img"
    render(<Avatar alt="S" size={size} />);
    const el = screen.getByRole('img');
    expect(el).toHaveStyle({ width: w, height: h });
  });

  it('defaults to md size (40px × 40px)', () => {
    render(<Avatar alt="Default Size" />);
    expect(screen.getByRole('img')).toHaveStyle({ width: '40px', height: '40px' });
  });

  // ── Shape Variants ───────────────────────────────────────────────────────

  it('circle shape applies 50% border radius', () => {
    render(<Avatar alt="Circle" shape="circle" />);
    expect(screen.getByRole('img')).toHaveStyle({ borderRadius: '50%' });
  });

  it('square shape applies skyra-radius-md token', () => {
    render(<Avatar alt="Square" shape="square" />);
    expect(screen.getByRole('img')).toHaveStyle({
      borderRadius: 'var(--skyra-radius-md)',
    });
  });

  it('defaults to circle shape', () => {
    render(<Avatar alt="Default Shape" />);
    expect(screen.getByRole('img')).toHaveStyle({ borderRadius: '50%' });
  });

  // ── Design Token Usage ───────────────────────────────────────────────────

  it('uses skyra token for background in fallback state', () => {
    // No src → fallback state → background should be primary-light token
    render(<Avatar alt="Token" />);
    const el = screen.getByRole('img');
    // jsdom renders CSS variable literals unchanged, so check the inline style attribute
    expect(el.getAttribute('style')).toContain('var(--skyra-primary-light)');
  });

  it('uses skyra color token for foreground text', () => {
    render(<Avatar alt="FG" />);
    const el = screen.getByRole('img');
    expect(el.getAttribute('style')).toContain('var(--skyra-primary)');
  });

  it('uses skyra border token', () => {
    render(<Avatar alt="Border" />);
    const el = screen.getByRole('img');
    expect(el.getAttribute('style')).toContain('var(--skyra-border)');
  });

  it('has transparent background when image is shown', () => {
    render(<Avatar src="https://example.com/img.jpg" alt="ImgBg" />);
    // Use the wrapper div directly (it is the first child of the rendered container)
    const { container } = render(
      <Avatar src="https://example.com/img.jpg" alt="ImgBg2" />,
    );
    // The root div is the Avatar wrapper — target it directly
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.getAttribute('style')).toContain('background: transparent');
  });

  // ── Custom className and style ───────────────────────────────────────────

  it('merges extra className with skyra-avatar', () => {
    render(<Avatar alt="Custom" className="my-custom-class" />);
    const el = screen.getByRole('img');
    expect(el).toHaveClass('skyra-avatar');
    expect(el).toHaveClass('my-custom-class');
  });

  it('merges inline style override', () => {
    render(<Avatar alt="Style" style={{ opacity: 0.5 }} />);
    expect(screen.getByRole('img')).toHaveStyle({ opacity: '0.5' });
  });

  // ── HTML Attribute Pass-through ──────────────────────────────────────────

  it('forwards arbitrary HTML attributes to the root div', () => {
    render(<Avatar alt="Attrs" data-testid="av" aria-describedby="help-text" />);
    const el = screen.getByTestId('av');
    expect(el).toHaveAttribute('aria-describedby', 'help-text');
  });

  // ── Accessibility ────────────────────────────────────────────────────────

  it('fallback <span> has aria-hidden=true so screen reader relies on outer aria-label', () => {
    render(<Avatar alt="Hidden Fallback" />);
    // In fallback state there is exactly one role="img" (the div)
    const span = screen.getByRole('img').querySelector('span');
    expect(span).toHaveAttribute('aria-hidden', 'true');
  });

  it('img child is inside the avatar wrapper div', () => {
    const { container } = render(
      <Avatar src="https://example.com/img.jpg" alt="Contained" />,
    );
    const wrapper = container.querySelector('.skyra-avatar') as HTMLElement;
    const img = wrapper.querySelector('img') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.alt).toBe('Contained');
    expect(wrapper).toContainElement(img);
  });

  // ── Click / Interaction Pass-through ─────────────────────────────────────

  it('fires onClick when container is clicked', () => {
    const handleClick = vi.fn();
    render(<Avatar alt="Clickable" onClick={handleClick} />);
    fireEvent.click(screen.getByRole('img'));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
