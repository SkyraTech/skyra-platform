/**
 * @skyra-tech-platform/design-tokens
 *
 * CSS Custom Properties for the Skyra Platform design system.
 * Import the CSS files directly; this module exports TypeScript
 * token constants for use in JS/TS contexts (e.g. inline styles,
 * React Native in the future, test assertions).
 *
 * Usage in CSS:
 *   import '@skyra-tech-platform/design-tokens/tokens.css';
 *   import '@skyra-tech-platform/design-tokens/reset.css';
 *
 * Usage in TypeScript:
 *   import { tokens, severityTokens, getSeverityColor } from '@skyra-tech-platform/design-tokens';
 *   tokens.primary // '#0A58CA'
 */

// ── Brand Colors [CONFIRMED: globals.css]
export const tokens = {
  // Brand
  primary:          '#0A58CA',
  primaryHover:     '#0847a8',
  primaryLight:     'rgba(10, 88, 202, 0.1)',
  orange:           '#FF6B00',
  orangeHover:      '#e05e00',
  orangeLight:      'rgba(255, 107, 0, 0.1)',
  cyan:             '#00A3E0',
  cyanLight:        'rgba(0, 163, 224, 0.1)',
  navy:             '#002B66',

  // Light Mode Surfaces
  bg:               '#F4F7FC',
  surface:          '#FFFFFF',
  sidebarBg:        '#002B66',

  // Dark Mode Surfaces
  bgDark:           '#0B111E',
  surfaceDark:      '#151D30',

  // Text
  text:             '#0f172a',
  textMuted:        '#64748b',
  textSubtle:       '#94a3b8',
  textDark:         '#f1f5f9',
  textMutedDark:    '#94a3b8',

  // Borders
  border:           '#e2e8f0',
  borderDark:       'rgba(255, 255, 255, 0.08)',
  borderFocus:      '#0A58CA',

  // Semantic
  danger:           '#ef4444',
  dangerLight:      'rgba(239, 68, 68, 0.1)',
  success:          '#10b981',
  successLight:     'rgba(16, 185, 129, 0.1)',
  warning:          '#f59e0b',
  warningLight:     'rgba(245, 158, 11, 0.1)',
  info:             '#3b82f6',
  infoLight:        'rgba(59, 130, 246, 0.1)',

  // Radius
  radiusSm:         '6px',
  radiusMd:         '10px',
  radiusLg:         '14px',
  radiusXl:         '20px',
  radiusFull:       '9999px',

  // Fonts
  fontBody:         "'Inter', system-ui, sans-serif",
  fontDisplay:      "'Outfit', sans-serif",
  fontMono:         "'JetBrains Mono', monospace",

  // Sidebar
  sidebarWidth:     '280px',
  sidebarCollapsed: '72px',
  headerHeight:     '64px',

  // Breakpoints
  bpXs:   '320px',
  bpSm:   '375px',
  bpMd:   '640px',
  bpLg:   '768px',
  bpXl:   '1024px',
  bp2xl:  '1280px',
  bp3xl:  '1536px',
} as const;

export type TokenKey = keyof typeof tokens;
export type TokenValue = typeof tokens[TokenKey];

// CSS variable name helpers
export const cssVar = (name: string) => `var(--skyra-${name})`;

/**
 * Canonical ECS log severity semantic tokens.
 * Maps documented Elastic Common Schema log severity levels to official Skyra branding tokens.
 */
export const severityTokens = {
  fatal: '#991B1B', // Dark red
  error: '#DC2626', // Red
  warn:  '#D97706', // Amber
  info:  tokens.primary, // Authoritative Skyra Brand Blue (#0A58CA)
  debug: '#475569', // Slate
  trace: '#94A3B8', // Light slate
} as const;

export type SeverityLevel = keyof typeof severityTokens;

/**
 * Normalizes an arbitrary severity or ECS level string and returns the canonical hex color.
 * Safe for SSR, unit tests, and runtime chart renderers.
 */
export function getSeverityColor(severity: string | undefined | null): string {
  const norm = (severity ?? 'info').toLowerCase().trim();
  if (norm === 'emerg' || norm === 'fatal') return severityTokens.fatal;
  if (norm === 'err' || norm === 'error') return severityTokens.error;
  if (norm === 'warning' || norm === 'warn') return severityTokens.warn;
  if (norm === 'info') return severityTokens.info;
  if (norm === 'debug') return severityTokens.debug;
  if (norm === 'trace') return severityTokens.trace;
  return tokens.textMuted; // '#64748b' fallback
}
