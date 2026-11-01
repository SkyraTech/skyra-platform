import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SkyraTechBadge, defineSkyraTechBadge } from '../src/skyra-tech-badge';

defineSkyraTechBadge();

function createBadge(attrs: Record<string, string> = {}): SkyraTechBadge {
  const el = document.createElement('skyra-tech-badge') as SkyraTechBadge;
  for (const [k, v] of Object.entries(attrs)) {
    el.setAttribute(k, v);
  }
  document.body.appendChild(el);
  return el;
}

function cleanup(el: Element) {
  if (el.parentNode) el.parentNode.removeChild(el);
}

describe('SkyraTechBadge Web Component', () => {
  let badge: SkyraTechBadge;

  beforeEach(() => {
    badge = createBadge({ variant: 'primary', size: 'sm' });
  });

  afterEach(() => {
    cleanup(badge);
  });

  it('registers custom element', () => {
    expect(customElements.get('skyra-tech-badge')).toBe(SkyraTechBadge);
  });

  it('defaults variant to neutral and size to sm', () => {
    const defaultBadge = createBadge();
    expect(defaultBadge.variant).toBe('neutral');
    expect(defaultBadge.size).toBe('sm');
    cleanup(defaultBadge);
  });

  it('supports variants: primary, success, warning, danger, info, orange, cyan, purple', () => {
    const variants = ['primary', 'success', 'warning', 'danger', 'info', 'orange', 'cyan', 'purple'];
    for (const v of variants) {
      badge.variant = v;
      expect(badge.getAttribute('variant')).toBe(v);
      const inner = badge.shadowRoot!.querySelector('.skyra-badge');
      expect(inner?.classList.contains(`skyra-badge--${v}`)).toBe(true);
    }
  });

  it('supports dot indicator', () => {
    expect(badge.dot).toBe(false);
    badge.dot = true;
    expect(badge.hasAttribute('dot')).toBe(true);
    const inner = badge.shadowRoot!.querySelector('.skyra-badge');
    expect(inner?.classList.contains('skyra-badge--has-dot')).toBe(true);
  });
});

