import { tokens } from '@skyra/design-tokens';
import { docsRegistry } from './registry';
import type { TokenCategory, TokenMetadata, DesignFoundationMetadata } from './metadata';

const TokenCategoriesMap: Record<string, { category: TokenCategory, desc?: string, title?: string, darkTokens?: Record<string, string> }> = {
  // Brand
  primary: { category: 'color' },
  primaryHover: { category: 'color' },
  primaryLight: { category: 'color', darkTokens: { primaryLight: 'rgba(10, 88, 202, 0.15)' } },
  orange: { category: 'color' },
  orangeHover: { category: 'color' },
  orangeLight: { category: 'color', darkTokens: { orangeLight: 'rgba(255, 107, 0, 0.15)' } },
  cyan: { category: 'color' },
  cyanLight: { category: 'color', darkTokens: { cyanLight: 'rgba(0, 163, 224, 0.15)' } },
  navy: { category: 'color' },

  // Surfaces
  bg: { category: 'color', darkTokens: { bg: '#0B111E' } },
  surface: { category: 'color', darkTokens: { surface: '#151D30' } },
  sidebarBg: { category: 'color', darkTokens: { sidebarBg: '#0B111E' } },
  bgDark: { category: 'color' },
  surfaceDark: { category: 'color' },

  // Text
  text: { category: 'color', darkTokens: { text: '#f1f5f9' } },
  textMuted: { category: 'color', darkTokens: { textMuted: '#94a3b8' } },
  textSubtle: { category: 'color', darkTokens: { textSubtle: '#64748b' } },
  textDark: { category: 'color' },
  textMutedDark: { category: 'color' },

  // Borders
  border: { category: 'color', darkTokens: { border: 'rgba(255, 255, 255, 0.08)' } },
  borderDark: { category: 'color' },
  borderFocus: { category: 'color' },

  // Semantic
  danger: { category: 'color' },
  dangerLight: { category: 'color', darkTokens: { dangerLight: 'rgba(239, 68, 68, 0.15)' } },
  success: { category: 'color' },
  successLight: { category: 'color', darkTokens: { successLight: 'rgba(16, 185, 129, 0.15)' } },
  warning: { category: 'color' },
  warningLight: { category: 'color', darkTokens: { warningLight: 'rgba(245, 158, 11, 0.15)' } },
  info: { category: 'color' },
  infoLight: { category: 'color', darkTokens: { infoLight: 'rgba(59, 130, 246, 0.15)' } },

  // Radius
  radiusSm: { category: 'radius' },
  radiusMd: { category: 'radius' },
  radiusLg: { category: 'radius' },
  radiusXl: { category: 'radius' },
  radiusFull: { category: 'radius' },

  // Fonts
  fontBody: { category: 'typography' },
  fontDisplay: { category: 'typography' },
  fontMono: { category: 'typography' },

  // Sidebar (other layout sizes)
  sidebarWidth: { category: 'other' },
  sidebarCollapsed: { category: 'other' },
  headerHeight: { category: 'other' },

  // Breakpoints
  bpXs: { category: 'breakpoint' },
  bpSm: { category: 'breakpoint' },
  bpMd: { category: 'breakpoint' },
  bpLg: { category: 'breakpoint' },
  bpXl: { category: 'breakpoint' },
  bp2xl: { category: 'breakpoint' },
  bp3xl: { category: 'breakpoint' }
};

const foundations: DesignFoundationMetadata[] = [
  {
    category: 'color',
    title: 'Colors',
    description: 'Semantic and brand colors defining the Skyra Platform visual identity. Supports both light and dark modes natively.',
    tokens: []
  },
  {
    category: 'radius',
    title: 'Border Radius',
    description: 'Corner rounding values used across all surface primitives and interactive elements.',
    tokens: []
  },
  {
    category: 'typography',
    title: 'Typography',
    description: 'Font families for standard text, display headings, and monospace code.',
    tokens: []
  },
  {
    category: 'breakpoint',
    title: 'Breakpoints',
    description: 'Responsive viewport targets used to adapt layouts.',
    tokens: []
  },
  {
    category: 'other',
    title: 'Dimensions',
    description: 'Core layout dimension variables.',
    tokens: []
  }
];

export function bootstrapDesignTokens() {
  const tokenKeys = Object.keys(tokens) as Array<keyof typeof tokens>;

  tokenKeys.forEach((key) => {
    const value = tokens[key];
    const mapping = TokenCategoriesMap[key] || { category: 'other' };
    
    // Auto-generate a CSS variable name style id, e.g. primaryHover -> --skyra-primary-hover
    const cssName = '--skyra-' + key.replace(/([A-Z])/g, '-$1').toLowerCase();

    const tokenMeta: TokenMetadata = {
      id: cssName,
      name: key,
      value: value,
      darkValue: mapping.darkTokens ? mapping.darkTokens[key] : undefined,
      category: mapping.category,
      source: '@skyra/design-tokens'
    };

    docsRegistry.registerToken(tokenMeta);

    // Add to foundation group
    const foundation = foundations.find(f => f.category === mapping.category);
    if (foundation) {
      foundation.tokens.push(tokenMeta.id);
    }
  });

  foundations.forEach(f => docsRegistry.registerFoundation(f));
}
