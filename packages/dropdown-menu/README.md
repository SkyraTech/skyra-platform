# @skyra-tech-platform/dropdown-menu

## Overview
Canonical framework-agnostic action menu overlay Web Component with roving keyboard navigation (ArrowUp/Down, Home/End, Enter, Space), viewport collision detection, focus restoration, groups, icons, destructive states, and checkable items.

Reuses the pure mathematical positioning engine from `@skyra-tech-platform/popover` (`computePopoverPosition`) with zero duplicate calculation logic.

## Runtime Support
Runtime-neutral Web Component (Custom Element + Shadow DOM). 0 runtime dependencies, 0 framework coupling.

## Installation
```bash
pnpm add @skyra-tech-platform/dropdown-menu
```

## Custom Elements
- `<skyra-dropdown-menu>` / `<skyra-tech-dropdown-menu>`: Root container, trigger slot, panel, and roving keyboard navigation manager.
- `<skyra-dropdown-item>` / `<skyra-tech-dropdown-item>`: Action, checkbox, or radio menu item with slots for `icon` and `trailing`.
- `<skyra-dropdown-group>` / `<skyra-tech-dropdown-group>`: Semantic group container with accessible `label`.
- `<skyra-dropdown-separator>` / `<skyra-tech-dropdown-separator>`: Visual divider with `role="separator"`.

## Basic Usage

### Web Component / Vanilla HTML
```html
<script type="module" src="@skyra-tech-platform/dropdown-menu"></script>

<skyra-dropdown-menu placement="bottom" align="start">
  <button slot="trigger">Actions Menu</button>
  <skyra-dropdown-item value="profile">Profile Overview</skyra-dropdown-item>
  <skyra-dropdown-item value="billing" shortcut="⌘B">Billing & Plans</skyra-dropdown-item>
  <skyra-dropdown-separator></skyra-dropdown-separator>
  <skyra-dropdown-item value="logout" destructive>Log Out</skyra-dropdown-item>
</skyra-dropdown-menu>
```

### React 19 / Next.js
```tsx
import '@skyra-tech-platform/dropdown-menu';
import { DropdownMenu, MenuItem, MenuSeparator } from '@/components/ui';

export function Demo() {
  return (
    <DropdownMenu trigger={<button>Actions</button>} placement="bottom" align="start">
      <MenuItem onClick={() => console.log('Edit')}>Edit</MenuItem>
      <MenuSeparator />
      <MenuItem destructive onClick={() => console.log('Delete')}>Delete</MenuItem>
    </DropdownMenu>
  );
}
```

## Dependencies & Peer Dependencies
- **Dependencies:** `@skyra-tech-platform/popover` (for pure `computePopoverPosition`)
- **Peer Dependencies:** `@skyra-tech-platform/design-tokens` (optional)

## Lifecycle & Version
- Version: `0.1.0`
- Status: Stable / Canonical
