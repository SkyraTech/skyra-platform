# @skyra/app-shell

## Overview
Skyra Platform reusable application shell and layout system. It provides the core responsive layout for dashboard and application interfaces, integrating with `@skyra/ui` components.

## Runtime Support
React + Browser

## Installation
```bash
pnpm add @skyra/app-shell
```

## Public API
- `.` (Main React components: `ApplicationShell`, `Sidebar`, `Header`, etc.)
- `./styles.css` (Required component styles)

## Basic Usage
```tsx
import { ApplicationShell } from '@skyra/app-shell';
import '@skyra/app-shell/styles.css';

export function Layout({ children }) {
  return (
    <ApplicationShell header={<Header />} sidebar={<Sidebar />}>
      {children}
    </ApplicationShell>
  );
}
```

## Dependencies / Peer Dependencies
- **Dependencies:** `@skyra/design-tokens`, `@skyra/ui`, `@skyra/utils`
- **Peer Dependencies:** `react`, `react-dom`, `lucide-react`

## Responsive Behavior
Automatically adapts to mobile and desktop viewports using CSS media queries (`max-width: 768px`) and JS `window.matchMedia` for sidebar toggling logic.

## Version & Lifecycle
Current Version: `0.1.0` (Pre-1.0 Minor bumps signify breaking changes).
Lifecycle: `@stable` defaults for UI primitives.
