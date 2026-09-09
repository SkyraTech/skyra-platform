/**
 * @skyra/design-tokens
 *
 * CSS Custom Properties for the Skyra Platform design system.
 * Import the CSS files directly; this module exports TypeScript
 * token constants for use in JS/TS contexts (e.g. inline styles,
 * React Native in the future, test assertions).
 *
 * Usage in CSS:
 *   import '@skyra/design-tokens/tokens.css';
 *   import '@skyra/design-tokens/reset.css';
 *
 * Usage in TypeScript:
 *   import { tokens } from '@skyra/design-tokens';
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
