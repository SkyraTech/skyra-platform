# Skyra Platform

> Enterprise-grade reusable UI foundation, design tokens, and frontend infrastructure for the Skyra ecosystem.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.x-black.svg)](https://turbo.build/)
[![Next.js](https://img.shields.io/badge/Next.js-16.x-black.svg)](https://nextjs.org/)
[![Vitest](https://img.shields.io/badge/Vitest-2.x-green.svg)](https://vitest.dev/)
[![Accessibility](https://img.shields.io/badge/WAI--ARIA-Compliant-success.svg)](https://www.w3.org/WAI/ARIA/)

---

## 📖 Overview

**Skyra Platform** is the shared frontend foundation powering Skyra enterprise applications. It delivers a composable, accessible, theme-aware, and type-safe component system built around the architectural principle:

> **"Build Shared Semantics, Not Shared Rendering."**

All primitives are presentation-focused, headless-capable where appropriate, business-logic-free, and designed to compose cleanly using `ReactNode` slots rather than rigid configuration schemas.

---

## 📦 Monorepo Architecture

The workspace is organized as a Turborepo monorepo powered by `pnpm` workspaces:

```
skyra-platform/
├── dashboard/                 # Next.js 16 showcase & documentation app
│   └── src/app/
│       ├── (dashboard)/
│       │   ├── accessibility/
│       │   ├── data-table/
│       │   ├── design-system/
│       │   ├── dialogs/
│       │   ├── dynamic-form/
│       │   ├── export/
│       │   ├── overview/
│       │   ├── pdf-viewer/
│       │   ├── print/
│       │   ├── responsive/
│       │   └── ui-components/ # Interactive showcase for every primitive
│       │       ├── accordion/
│       │       ├── breadcrumb/
│       │       ├── checkbox/
│       │       ├── collapsible/
│       │       ├── context-menu/
│       │       ├── date-fields/
│       │       ├── dropdown-menu/
│       │       ├── inputs/
│       │       ├── loaders/
│       │       ├── notifications/
│       │       ├── popover/
│       │       ├── radio/
│       │       ├── select/
│       │       ├── switch/
│       │       ├── tabs/
│       │       └── tooltip/
├── packages/
│   ├── design-tokens/         # CSS variables & design token foundations
│   ├── ui/                    # Core accessible UI primitives (@skyra/ui)
│   ├── utils/                 # Currency, date, string formatting utilities
│   ├── validation/            # Zod validation schemas & common rules
│   ├── data-table/            # High-performance enterprise table package
│   ├── dialogs/               # Modal dialog, alert dialog, drawer primitives
│   ├── dynamic-form/          # Schema-driven dynamic form engine
│   └── data-export/           # Excel/CSV export utilities
└── docs/                      # Architectural specs, BRD, and design docs
```

---

## 🧩 Packages

| Package | Version | Description |
| :--- | :--- | :--- |
| [`@skyra/ui`](file:///packages/ui) | `0.1.0` | Production-grade accessible UI primitives (Inputs, Date/Time, Popover, Menu, Tabs, Accordion, Collapsible, Breadcrumbs, Loaders, Select, Switch, etc.) |
| [`@skyra/design-tokens`](file:///packages/design-tokens) | `0.1.0` | Centralized `--skyra-*` CSS variable tokens for colors, typography, radii, spacing, elevations, and dark mode |
| [`@skyra/utils`](file:///packages/utils) | `0.1.0` | Pure helper functions for currency formatting, date arithmetic, string utilities, and math |
| [`@skyra/validation`](file:///packages/validation) | `0.1.0` | Reusable Zod schemas and validation helpers (GSTIN, PAN, email, phone, org rules) |
| [`@skyra/data-table`](file:///packages/data-table) | `0.1.0` | Enterprise data grid with sorting, filtering, selection, and pagination hooks |
| [`@skyra/dialogs`](file:///packages/dialogs) | `0.1.0` | Accessible dialogs, confirm dialogs, slide-out drawers, and sheets |
| [`@skyra/dynamic-form`](file:///packages/dynamic-form) | `0.1.0` | Declarative form builder with real-time validation and conditional fields |
| [`@skyra/data-export`](file:///packages/data-export) | `0.1.0` | Client-side CSV and Excel workbook generators |

---

## 🚀 Implemented UI Primitives

### Standard Inputs & Text Controls
- **Input**, **SearchInput**, **NumberInput**, **PasswordInput**, **Textarea** (Prefix/Suffix slots, clear button, error states)

### Selection & Toggles
- **Checkbox**, **RadioGroup**, **RadioItem**, **Switch**, **DynamicSelect** (Single, multi-select, searchable, grouping, chips + overflow)

### Date & Time Suite
- **Calendar**, **DateField**, **DateRangeField**, **TimeField**, **TimeRangeField**, **DateTimeField**, **DateTimeRangeField**, **MonthField**, **YearField**, **WeekField**

### Advanced Positioning & Interaction Primitives (Phase 4A)
- **Popover**: Floating anchored content with arrow, collision avoidance, and outside-click dismissal
- **DropdownMenu**: Accessible action menus with item groups, checkboxes, radio items, shortcuts, and sub-menus
- **ContextMenu**: Right-click contextual action menus with coordinate positioning
- **MenuPrimitives**: Composable primitives (`MenuItem`, `MenuSeparator`, `MenuGroupLabel`, `MenuShortcut`, `MenuCheckboxItem`)
- **useFloatingPosition**: Positioning hook with automatic boundary flip, shift, offset, and portal integration

### Structural & Navigation Primitives (Phase 4B)
- **Tabs**: WAI-ARIA tablist/tab/tabpanel, horizontal & vertical orientations, automatic & manual activation, line & pill variants, lazy mounting
- **Accordion**: Single (with collapsible toggle) and multiple expand modes, keyboard navigation (`ArrowUp`/`ArrowDown`/`Home`/`End`), disabled items
- **Collapsible**: Independent single expandable region with controlled/uncontrolled state
- **Breadcrumbs**: `<nav aria-label="Breadcrumb">` landmark, `<ol>` list structure, composable separators, page state, `asChild` link integration, and responsive ellipsis

### Feedback & Loading
- **Alert**, **NotificationBar**, **StatusBadge**
- **Spinner**, **Progress**, **CircularProgress**, **Skeleton**, **SkeletonText**, **SkeletonAvatar**, **SkeletonTable**, **DataLoader**, **OverlayLoader**

---

## ♿ Accessibility & Design Standards

- **Strict WAI-ARIA Semantics**: Tested for 0 Axe violations and full screen reader compatibility (`role`, `aria-expanded`, `aria-selected`, `aria-controls`, `aria-labelledby`, `aria-current`).
- **Keyboard Usability**: Comprehensive keyboard traversal (roving `tabIndex`, `Arrow` keys, `Home`, `End`, `Enter`, `Space`, `Escape`).
- **Touch-Friendly Targets**: All interactive elements meet or exceed 44×44px touch targets.
- **Motion Accessibility**: All transitions respect `@media (prefers-reduced-motion: reduce)` with instant state transitions.
- **Dark Mode**: Native CSS variable theming supporting instant `.dark` switching without layout shift.
- **Strict TypeScript**: 100% strict mode (`noImplicitAny`, complete prop interfaces, generic types).

---

## 🛠️ Getting Started

### Prerequisites
- **Node.js**: `>= 18.0.0`
- **pnpm**: `>= 9.0.0`

### Installation
```bash
pnpm install
```

### Development
Start the Next.js 16 showcase dashboard and watch packages:
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to view the component showcase.

---

## 🧪 Verification & Quality Commands

```bash
# Run unit tests across all packages (216+ passing in @skyra/ui)
pnpm test

# Run TypeScript typecheck across all packages and dashboard
pnpm typecheck

# Run linter
pnpm lint

# Build all packages and Next.js static dashboard
pnpm build
```

---

## 📜 License
Internal Proprietary — Skyra Tech. All rights reserved.
