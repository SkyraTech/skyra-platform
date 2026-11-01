import { describe, it, expect } from 'vitest';
import { tokens, cssVar, severityTokens, getSeverityColor } from './index';

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

  it('should provide canonical ECS severity tokens bound to Skyra brand tokens', () => {
    expect(severityTokens.info).toBe('#0A58CA');
    expect(severityTokens.fatal).toBe('#991B1B');
    expect(severityTokens.error).toBe('#DC2626');
    expect(severityTokens.warn).toBe('#D97706');
    expect(severityTokens.debug).toBe('#475569');
    expect(severityTokens.trace).toBe('#94A3B8');
  });

  it('should normalize severity strings and resolve correct token colors', () => {
    expect(getSeverityColor('info')).toBe('#0A58CA');
    expect(getSeverityColor('INFO')).toBe('#0A58CA');
    expect(getSeverityColor('error')).toBe('#DC2626');
    expect(getSeverityColor('err')).toBe('#DC2626');
    expect(getSeverityColor('fatal')).toBe('#991B1B');
    expect(getSeverityColor('emerg')).toBe('#991B1B');
    expect(getSeverityColor('warn')).toBe('#D97706');
    expect(getSeverityColor('warning')).toBe('#D97706');
    expect(getSeverityColor('debug')).toBe('#475569');
    expect(getSeverityColor('trace')).toBe('#94A3B8');
    expect(getSeverityColor(undefined)).toBe('#0A58CA');
    expect(getSeverityColor('unknown')).toBe('#64748b');
  });
});
