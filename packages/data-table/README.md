# @skyra/data-table

## Overview
Skyra Platform DynamicDataTable — typed, sortable, paginated, mobile-responsive data tables.

## Runtime Support
React + Browser

## Installation
```bash
pnpm add @skyra/data-table
```

## Public API
- `.` (Main React component: `DataTable`, `Pagination`, etc.)

## Basic Usage
```tsx
import { DataTable } from '@skyra/data-table';

export function UserTable({ users }) {
  return <DataTable data={users} columns={columns} />;
}
```

## Dependencies / Peer Dependencies
- **Dependencies:** `@skyra/ui`
- **Peer Dependencies:** `react`, `react-dom`, `lucide-react`

## Responsive Behavior
Adapts to mobile viewports using advanced CSS Grid (`auto-fit`, `minmax`) for extreme resilience without fixed JS media queries.

## Accessibility
Includes ARIA attributes for sortable headers, pagination controls, and row selections. Keyboard navigable.

## Version & Lifecycle
Current Version: `0.1.0` (Pre-1.0 Minor bumps signify breaking changes).
Lifecycle: `@stable`
