# @skyra/dialogs

## Overview
Skyra Platform generic dialogs — ConfirmDialog, Modal, Drawer with focus traps and ERP visual fidelity.

## Runtime Support
React + Browser

## Installation
```bash
pnpm add @skyra/dialogs
```

## Public API
- `.` (Components: `ConfirmDialog`, `Modal`, `Drawer`)

## Basic Usage
```tsx
import { ConfirmDialog } from '@skyra/dialogs';

export function Action() {
  return (
    <ConfirmDialog 
      title="Delete User"
      description="Are you sure?"
      onConfirm={handleDelete}
    />
  );
}
```

## Dependencies / Peer Dependencies
- **Dependencies:** `@skyra/ui`
- **Peer Dependencies:** `react`, `react-dom`, `lucide-react`

## Accessibility
Dialogs feature focus trapping, `Escape` key listeners, and strict ARIA dialog roles.

## Version & Lifecycle
Current Version: `0.1.0` (Pre-1.0 Minor bumps signify breaking changes).
Lifecycle: `@stable`
