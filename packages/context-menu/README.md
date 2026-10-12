# @skyra-tech-platform/context-menu

## Overview
Canonical framework-agnostic contextual action menu Web Component anchored to pointer coordinates or keyboard invocation (`ContextMenu`, `Shift+F10`) with viewport collision detection, roving keyboard navigation, dark mode support, and focus restoration.

Reuses the pure mathematical positioning engine from `@skyra-tech-platform/popover` (`computePopoverPosition`) with zero duplicated calculation logic.

## Runtime Support
Runtime-neutral Web Component (Custom Element + Shadow DOM). 0 runtime dependencies, 0 framework coupling.

## Installation
```bash
pnpm add @skyra-tech-platform/context-menu
```

## Custom Elements
- `<skyra-context-menu>` / `<skyra-tech-context-menu>`: Root container, target surface listener, fixed floating panel, and roving keyboard navigation manager.
- `<skyra-context-menu-item>` / `<skyra-tech-context-menu-item>`: Context action, checkbox, or radio menu item with slots for `icon` and `trailing`.
- `<skyra-context-menu-group>` / `<skyra-tech-context-menu-group>`: Semantic group container with accessible `label`.
- `<skyra-context-menu-separator>` / `<skyra-tech-context-menu-separator>`: Visual divider with `role="separator"`.

## Basic Usage

### Web Component / Vanilla HTML
```html
<script type="module" src="@skyra-tech-platform/context-menu"></script>

<skyra-context-menu>
  <div slot="target" style="padding: 2rem; border: 1px dashed #ccc;">
    Right-click inside this target zone
  </div>
  <skyra-context-menu-item value="view">View Details</skyra-context-menu-item>
  <skyra-context-menu-item value="copy" shortcut="⌘C">Copy Link</skyra-context-menu-item>
  <skyra-context-menu-separator></skyra-context-menu-separator>
  <skyra-context-menu-item value="delete" destructive>Delete Record</skyra-context-menu-item>
</skyra-context-menu>
```

### React 19 / Next.js
```tsx
import '@skyra-tech-platform/context-menu';
import { ContextMenu, MenuItem, MenuSeparator } from '@/components/ui';

export function Demo() {
  return (
    <ContextMenu
      items={[
        { label: 'View Details', onClick: () => console.log('View') },
        { label: 'Copy Link', shortcut: '⌘C', onClick: () => console.log('Copy') },
        { type: 'separator' },
        { label: 'Delete', destructive: true, onClick: () => console.log('Delete') },
      ]}
    >
      <div style={{ padding: '2rem' }}>Right-click me</div>
    </ContextMenu>
  );
}
```

## Dependencies & Peer Dependencies
- **Dependencies:** `@skyra-tech-platform/popover` (for pure `computePopoverPosition`)
- **Peer Dependencies:** `@skyra-tech-platform/design-tokens` (optional)

## Lifecycle & Version
- Version: `0.1.0`
- Status: Stable / Canonical
