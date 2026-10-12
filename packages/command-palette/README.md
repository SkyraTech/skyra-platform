# @skyra-tech-platform/command-palette

## Overview
Canonical framework-agnostic modal Command Palette (`Ctrl+K` / `Cmd+K`) Web Component featuring interactive search filtering, group separation, keyboard navigation, accessible listbox semantics, focus restoration, backdrop dismiss, and custom execution hooks.

Reuses the multi-term scoring search filter from `@skyra-tech-platform/utils` (`filterCommands`, `normalizeShortcut`, `matchesShortcutKey`) with zero duplicated matching logic.

## Runtime Support
Runtime-neutral Web Component (Custom Element + Shadow DOM). 0 runtime dependencies, 0 framework coupling.

## Installation
```bash
pnpm add @skyra-tech-platform/command-palette
```

## Custom Elements
- `<skyra-command-palette>` / `<skyra-tech-command-palette>`: Root modal overlay, search input field, category groups, command listbox, empty state, and footer keyboard navigation hints.

## Basic Usage

### Web Component / Vanilla HTML
```html
<script type="module" src="@skyra-tech-platform/command-palette"></script>

<skyra-command-palette shortcut="mod+k" placeholder="Search commands...">
</skyra-command-palette>

<script>
  const palette = document.querySelector('skyra-command-palette');
  palette.commands = [
    { id: 'home', label: 'Go to Home', group: 'Navigation', shortcut: 'G H', onExecute: () => console.log('Home') },
    { id: 'settings', label: 'Open Settings', group: 'Preferences', shortcut: '⌘,', onExecute: () => console.log('Settings') },
    { id: 'dark-mode', label: 'Toggle Theme', group: 'Preferences', shortcut: '⌘T', onExecute: () => console.log('Theme') }
  ];

  palette.addEventListener('skyra-command-select', (e) => {
    console.log('Command executed:', e.detail);
  });
</script>
```

### React 19 / Next.js
```tsx
import '@skyra-tech-platform/command-palette';
import { CommandPalette } from '@/components/ui';

export function App() {
  return (
    <CommandPalette
      commands={[
        { id: 'nav-dashboard', label: 'Go to Dashboard', group: 'Navigation', shortcut: 'G D' },
        { id: 'nav-users', label: 'Manage Users', group: 'Navigation', shortcut: 'G U' },
        { id: 'act-export', label: 'Export Report', group: 'Actions', shortcut: '⌘E' },
      ]}
      onSelect={(cmd) => console.log('Selected:', cmd)}
    />
  );
}
```

## Dependencies & Peer Dependencies
- **Dependencies:** `@skyra-tech-platform/utils` (for `filterCommands`, `matchesShortcutKey`, `isInputElement`)
- **Peer Dependencies:** `@skyra-tech-platform/design-tokens` (optional)

## Lifecycle & Version
- Version: `0.1.0`
- Status: Stable / Canonical
