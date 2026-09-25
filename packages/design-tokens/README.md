# @skyra/design-tokens

## Overview
Skyra Platform design tokens — CSS custom properties, dark mode support, and base CSS resets.

## Runtime Support
Runtime-neutral (Browser CSS)

## Installation
```bash
pnpm add @skyra/design-tokens
```

## Public API
- `./reset.css` (Intentional global CSS reset — explicit opt-in required)
- `./tokens.css` (CSS variables for `--skyra-*`)
- `.` (TypeScript tokens object and `TokenKey` types)

## Basic Usage
```tsx
import '@skyra/design-tokens/tokens.css';
import '@skyra/design-tokens/reset.css'; // Optional but recommended

import { tokens } from '@skyra/design-tokens';
console.log(tokens.primary);
```

## Dependencies / Peer Dependencies
- **Dependencies:** None
- **Peer Dependencies:** None

## Theming
Requires importing `./tokens.css` at the root of the host application. Provides `--skyra-*` variables.

## Version & Lifecycle
Current Version: `0.1.0` (Pre-1.0 Minor bumps signify breaking changes).
Lifecycle: `@stable`
