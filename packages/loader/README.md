# @skyra-tech-platform/loader

Frozen Version: **2.2 (System Component)**

The **Loader System** provides a canonical, framework-agnostic set of loading indicators for the Skyra Tech Platform. Built on native Web Components, it guarantees uniform visual indicators, semantic accessibility, and zero-dependency integration across any frontend architecture.

## Architecture Guidelines

- **Native Web Components**: Implemented as standard Custom Elements (`<skyra-spinner>`, `<skyra-progress>`, `<skyra-circular-progress>`, `<skyra-skeleton>`).
- **Framework Agnostic**: Integrates seamlessly with React, Vue, Angular, or Vanilla JS.
- **SSR Compatible**: Gracefully degrades in server-side rendered environments (Next.js) preventing `HTMLElement` reference errors.
- **Accessible by Default**: Implements standard ARIA attributes (`role="status"`, `aria-label`, `aria-busy`) and supports `prefers-reduced-motion`.

## Installation

```bash
pnpm add @skyra-tech-platform/loader
```

## Import & Usage

Import the package once at your application root (e.g., `app/layout.tsx` or `index.js`) to register the Web Components:

```typescript
import '@skyra-tech-platform/loader';
```

Then use the custom elements directly in your HTML or JSX:

### Spinner

The primary indeterminate loading indicator.

```html
<skyra-spinner size="md" color="var(--skyra-primary)" label="Loading data..."></skyra-spinner>
```

**Attributes:**
- `size` (String): `'xs' | 'sm' | 'md' | 'lg' | 'xl'` (Default: `'md'`)
- `color` (String): CSS color value (Default: `var(--skyra-primary)`)
- `label` (String): Accessible label for screen readers (Default: `'Loading...'`)
- `show-label` (Boolean attribute): Renders the label text visually next to the spinner.
- `inline` (Boolean attribute): Uses inline-flex display.

### Progress (Linear)

A determinate or indeterminate linear progress bar.

```html
<!-- Determinate -->
<skyra-progress value="45" size="md"></skyra-progress>

<!-- Indeterminate -->
<skyra-progress label="Connecting..."></skyra-progress>
```

**Attributes:**
- `value` (Number/String): Progress value (0-100). If omitted, displays indeterminate animation.
- `size` (String): `'sm' | 'md'` (Default: `'md'`)
- `color` (String): Base color (Default: `var(--skyra-primary)`)
- `label` (String): Screen reader text.
- `show-label` (Boolean attribute): Visually displays the label text.

### Circular Progress

A determinate or indeterminate SVG-based circular progress indicator.

```html
<!-- Determinate -->
<skyra-circular-progress value="75" size="48" show-value></skyra-circular-progress>

<!-- Indeterminate -->
<skyra-circular-progress size="48"></skyra-circular-progress>
```

**Attributes:**
- `value` (Number/String): Progress percentage (0-100). If omitted, rotates indeterminately.
- `size` (Number/String): Size in pixels (Default: `40`).
- `color` (String): Base color.
- `show-value` (Boolean attribute): Displays the percentage text centered inside the circle.

### Skeletons

Layout placeholders for asynchronous content loading.

```html
<!-- Basic shape -->
<skyra-skeleton width="100%" height="2rem" radius="md"></skyra-skeleton>

<!-- Multiline text block -->
<skyra-skeleton-text lines="3"></skyra-skeleton-text>

<!-- Avatar/Icon placeholder -->
<skyra-skeleton-avatar size="48"></skyra-skeleton-avatar>

<!-- Table structure -->
<skyra-skeleton-table rows="5" columns="4"></skyra-skeleton-table>

<!-- Card layout -->
<skyra-skeleton-card></skyra-skeleton-card>
```

## React Integration (Next.js)

When using TypeScript in a React environment, you must augment the `JSX.IntrinsicElements` namespace so React understands the custom elements:

```typescript
// custom-elements.d.ts
import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'skyra-spinner': any;
      'skyra-progress': any;
      'skyra-circular-progress': any;
      'skyra-skeleton': any;
      'skyra-skeleton-avatar': any;
      'skyra-skeleton-text': any;
      'skyra-skeleton-table': any;
      'skyra-skeleton-card': any;
    }
  }
}
```

## Theming

The Loader components utilize standard Skyra Tech Platform CSS variables:

- `--skyra-primary`: Default tint for active loading tracks/spinners.
- `--skyra-border`: Border and track background colors.
- `--skyra-bg` / `--skyra-surface`: Base layer colors for skeletons.
- `--skyra-text-muted`: Label text colors.

## Verification & Auditing

- Run `vitest` in the package directory to execute the headless browser testing suite.
- Skeletons generate semantic markup using `aria-hidden="true"` avoiding interference with actual content structure.
- Animations automatically slow down for users who prefer reduced motion (`@media (prefers-reduced-motion: reduce)`).
