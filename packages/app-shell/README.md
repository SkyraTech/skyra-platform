# @skyra-tech-platform/app-shell

## Overview
Skyra Platform reusable application shell and layout system. It provides the core responsive layout for dashboard and application interfaces, integrating with `@skyra-tech-platform/app-shell` components.

## Runtime Support
web components + Browser

## Installation
```bash
pnpm add @skyra-tech-platform/app-shell
```

## Public API
- `.` (Main web components components: `ApplicationShell`, `Sidebar`, `Header`, etc.)
- `./styles.css` (Required component styles)

## Basic Usage
```tsx
import { ApplicationShell } from '@skyra-tech-platform/app-shell';
import '@skyra-tech-platform/app-shell/styles.css';

export function Layout({ children }) {
  return (
    <ApplicationShell header={<Header />} sidebar={<Sidebar />}>
      {children}
    </ApplicationShell>
  );
}
```

## Dependencies / Peer Dependencies
- **Dependencies:** `@skyra-tech-platform/design-tokens`, `@skyra-tech-platform/app-shell`, `@skyra-tech-platform/utils`
- **Peer Dependencies:** `web components`, `web components-dom`, `lucide-web components`

## Responsive Behavior
Automatically adapts to mobile and desktop viewports using CSS media queries (`max-width: 768px`) and JS `window.matchMedia` for sidebar toggling logic.

## Version & Lifecycle
Current Version: `0.1.0` (Pre-1.0 Minor bumps signify breaking changes).
Lifecycle: `@stable` defaults for UI primitives.
