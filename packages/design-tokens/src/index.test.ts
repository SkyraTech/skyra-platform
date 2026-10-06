import { describe, it, expect } from 'vitest';
import { tokens, cssVar } from './index';

describe('@skyra-tech-platform/design-tokens', () => {
  it('should export tokens object', () => {
    expect(tokens).toBeDefined();
    expect(typeof tokens).toBe('object');
  });

  it('should have expected token names and values', () => {
    expect(tokens.primary).toBe('#0A58CA');
    expect(tokens.bg).toBe('#F4F7FC');
    expect(tokens.danger).toBe('#ef4444');
    expect(tokens.radiusSm).toBe('6px');
    expect(tokens.fontBody).toBe("'Inter', system-ui, sans-serif");
  });

  it('should correctly format CSS variables', () => {
    expect(cssVar('primary')).toBe('var(--skyra-primary)');
    expect(cssVar('bg')).toBe('var(--skyra-bg)');
  });
});
