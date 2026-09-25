# @skyra/ui

## Overview
Skyra Platform reusable UI primitives — ERP visual fidelity, highly accessible, and mobile-first. Provides foundational components like Buttons, Inputs, Selects, Cards, and more.

## Runtime Support
React + Browser

## Installation
```bash
pnpm add @skyra/ui
```

## Public API
- `.` (All UI components: `Button`, `Input`, `DynamicSelect`, `Avatar`, etc.)
- `./styles.css` (Component styles and reduced-motion reset)

## Basic Usage
```tsx
import { Button, Input } from '@skyra/ui';
import '@skyra/ui/styles.css';

export function Form() {
  return (
    <div>
      <Input placeholder="Enter text..." />
      <Button variant="primary">Submit</Button>
    </div>
  );
}
```

## Dependencies / Peer Dependencies
- **Dependencies:** `@skyra/design-tokens`, `@skyra/data-export`, `@skyra/utils`
- **Peer Dependencies:** `react`, `react-dom`, `lucide-react`

## Theming & Styling
Requires importing both `@skyra/design-tokens` (for CSS variables) and `@skyra/ui/styles.css` (for component scoping).

*Constraint Notice:* Currently, `styles.css` injects a global `prefers-reduced-motion` reset onto `*`. Consuming this stylesheet will mutate host application motion behavior.

## Accessibility
Components utilize extensive ARIA landmarks, roles, and focus-management utilities.

## Version & Lifecycle
Current Version: `0.1.0` (Pre-1.0 Minor bumps signify breaking changes).
Lifecycle: `@stable`
