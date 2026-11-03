# Skyra Platform — Documentation Gap Analysis
**Document ID:** `DOCUMENTATION-GAP-ANALYSIS`  
**Milestone:** `SKYRA-PLATFORM-DASHBOARD-001`  
**Audit Date:** 2026-11-01  
**Status:** Canonical Defect & Architectural Risk Assessment  

---

## 1. Executive Summary

The documentation audit of `skyra-platform` reveals substantial discrepancies between what exists in the package monorepo and what is presented in the dashboard portal.

While the monorepo has **31 well-engineered, tested packages** (with 59/59 passing turbo test suites), the dashboard documentation is fractured into two parallel, competing systems with significant architectural defects, missing components, outdated metadata, and incomplete developer guidance.

---

## 2. High-Severity Functional & Architectural Gaps

### GAP-01: Critical SSR Crash on All Dashboard Routes (P0 — Blocker)
- **Problem:** Every route under `dashboard/src/app/(dashboard)` fails during Server-Side Rendering (SSR) in Next.js Turbopack dev mode with:
  ```text
  ReferenceError: HTMLElement is not defined
    at module evaluation (packages/app-shell/src/skyra-tech-app-shell.ts:1:8)
    at module evaluation (src/app/(dashboard)/layout.tsx:12:1)
  ```
- **Root Cause:** `packages/app-shell/src/skyra-tech-app-shell.ts` defines `export class SkyraAppShell extends HTMLElement` directly without checking if `HTMLElement` exists in the execution environment. Unlike other packages (which use `const BaseClass = typeof HTMLElement !== 'undefined' ? HTMLElement : (class {} as typeof HTMLElement)`), importing `app-shell` in Node.js server context throws immediately. Because `layout.tsx` imports `registerAppShell` at the top level, every route in `(dashboard)` returns HTTP 500 on server execution.
- **Impact:** Real browser inspection shows 61/61 routes throwing 500 errors on initial server response, and `next build` static page generation fails at 0/725 pages.

### GAP-02: Total Absence of Newly Created Packages (P0 — Blocker)
- **Problem:** Three packages created during the Skyra LogHub integration milestones are completely absent from the dashboard:
  1. `@skyra-tech-platform/drawer` (v0.1.0)
  2. `@skyra-tech-platform/badge` (v0.1.0)
  3. `@skyra-tech-platform/empty-state` (v0.1.0)
- **Manifestation:**
  - Zero pages exist under `/components/` for these packages.
  - None are listed in `dashboard/package.json` dependencies.
  - None are registered in `dashboard/src/docs-system/catalog-targets.ts`.
  - None appear in the component catalog at `/components/page.tsx`.
- **Impact:** Consumers cannot discover, evaluate, or install these core platform primitives from the design system portal.

### GAP-03: Showcase Mock React Duplication (P0 — Blocker)
- **Problem:** The dashboard maintains a directory `dashboard/src/components/ui/` containing over 35 standalone React component implementations (`Accordion.tsx`, `Badge.tsx`, `EmptyState.tsx`, `CommandPalette.tsx`, `DataLoader.tsx`, etc.).
- **Manifestation:**
  - In `/ui-components/empty-state`, the page imports `<EmptyState>` and `<Badge>` from `@/components/ui`, rather than using `<skyra-tech-empty-state>` or `<skyra-tech-badge>`!
  - In `/ui-components/loaders`, the page imports `<DataLoader>` and `<OverlayLoader>` from `@/components/ui`, rather than using `@skyra-tech-platform/loader`.
- **Impact:** Violates the foundational design system principle: *The dashboard must not showcase mock components that behave differently from the real published packages.*

### GAP-04: Outdated API Metadata & Check Failure (P1 — Important)
- **Problem:** Running `pnpm exec tsx scripts/extract-api.ts --check` in `dashboard` fails with:
  ```text
  Error: API catalog is out of date; run extraction
  ```
- **Root Cause:** Packages were modified during LogHub integration (Button, Accordion, Collapsible, Tabs, Loader, Design Tokens), but `dashboard/src/docs-system/data/apis.json` was never re-extracted. Furthermore, `catalog-targets.ts` lacks targets for `drawer`, `badge`, and `empty-state`.

---

## 3. Structural Information Architecture Gaps

The current dashboard has two conflicting navigation and showcase paradigms:

```text
Current Fractured Architecture:
├── Canonical Documentation (/components/...)
│   ├── Basic Controls (button, checkbox, input, radio, switch, textarea)
│   ├── Disclosure (accordion, collapsible)
│   ├── Feedback (notification, toast)
│   ├── Forms (date-time, dynamic-form)
│   ├── Layouts (app-shell)
│   ├── Navigation (tabs)
│   ├── Overlays (command-palette, context-menu, dialog, dropdown-menu, popover)
│   ├── Selection (dynamic-select)
│   └── Utilities (qr)
│
└── Legacy UI Playground (/ui-components/...)
    ├── 22 detail pages using internal React mocks
    └── 7 Orphaned Components with NO platform package:
        ├── breadcrumb
        ├── dropzone
        ├── error-state
        ├── file-upload
        ├── keyboard-shortcuts
        ├── pagination
        └── tooltip
```

### Risks of the Fractured Architecture
1. **Developer Confusion:** A developer looking for "Tabs" or "Accordion" finds two separate pages (`/components/navigation/tabs` vs `/ui-components/tabs`) with different code examples and styling.
2. **False Promises:** Developers see "Breadcrumb" or "Tooltip" in `/ui-components` and try to install `@skyra-tech-platform/breadcrumb` or `@skyra-tech-platform/tooltip`, which do not exist.
3. **Maintenance Overhead:** Bug fixes to the real packages are not reflected in the legacy UI playground.

---

## 4. Documentation Content Gaps

### 4.1 Missing Getting Started System
There is currently **no unified Getting Started section**:
- No "What is Skyra Platform?" conceptual introduction.
- No quick-start installation guide (`npm install @skyra-tech-platform/button`, etc.).
- No setup guide explaining how to load `@skyra-tech-platform/design-tokens/tokens.css` into an application.
- No explanation of Web Component registration and SSR considerations in consumer apps.

### 4.2 Missing Framework Integration Guides
Skyra Platform components are standard Web Components with TypeScript interfaces. However, documentation lacks framework guides:
- **Angular Integration:** How to use `CUSTOM_ELEMENTS_SCHEMA` in Angular modules/standalone components.
- **React Integration:** How to bind events (CustomEvent listeners) and complex object properties in React 18/19.
- **Vanilla JS:** How to import and register components via ES modules or script tags.

### 4.3 Missing Component API Reference Tables
Most existing component pages in `/components/...` contain only:
1. A brief 1-2 sentence description.
2. A single static rendering demo.
3. A code snippet showing basic HTML markup.

They **lack comprehensive API tables**:
- Attribute names, types, default values, and description.
- Property types and reflection behavior.
- CustomEvent names and `detail` payload interfaces.
- Slot names and fallback content behavior.
- Public method signatures and return types.
- CSS shadow parts (`part="..."`) and customizable CSS custom properties.

### 4.4 Missing Interactive Playgrounds
- No component page provides real-time interactive controls (knobs) to toggle variants, sizes, disabled states, or test dynamic content without editing source code.
- Event listeners are not demonstrated with live interactive event loggers.

---

## 5. Design System & Branding Gaps

### 5.1 Hardcoded Values in Dashboard
- In `dashboard/src/app/(dashboard)/layout.tsx`:
  - Hardcoded logo styles: `color: '#fff'`, `background: 'rgba(255,255,255,0.08)'`.
  - Hardcoded blue fallback: `var(--skyra-focus, #3b82f6)`.
- In `globals.css`:
  - Contains duplicate token declarations that override or drift from `@skyra-tech-platform/design-tokens`.

### 5.2 Accessibility Non-Compliance (WCAG 2.2 AA Gaps)
Real-browser automated auditing with `axe-core` across 61 routes identified **82 distinct violations**:
1. **Color Contrast (1,145 instances):** Subtitle text and muted body text using `var(--skyra-text-muted)` on light surfaces fall below the 4.5:1 ratio threshold.
2. **Missing Form Control Labels (5 instances):** Demo inputs and textareas in `/components/basic-controls/input` and `textarea` lack explicit `<label>` or `aria-label`.
3. **Missing Button Names (34 instances):** Icon-only buttons in toolbar demos lack accessible names.
4. **Invalid ARIA Parent/Child Roles (44 instances):** In `/components/overlays/context-menu` and `dropdown-menu`, menuitems are rendered without appropriate container roles.
5. **Missing `<html lang>` attribute:** 8 pages fail document language validation.

---

## 6. Prioritized Remediation Roadmap

| ID | Gap Description | Severity | Impact | Required Action |
| :--- | :--- | :--- | :--- | :--- |
| **G-01** | `app-shell` SSR `HTMLElement` crash | **P0** | All 61 routes fail 500 | Add `BaseClass` SSR guard in `packages/app-shell/src/skyra-tech-app-shell.ts`. |
| **G-02** | Missing Drawer showcase & docs | **P0** | Component undiscoverable | Add `/components/overlays/drawer`, register in `package.json` & catalog. |
| **G-03** | Missing Badge showcase & docs | **P0** | Component undiscoverable | Add `/components/basic-controls/badge`, register in `package.json` & catalog. |
| **G-04** | Missing Empty State canonical showcase | **P0** | Component undiscoverable | Add `/components/feedback/empty-state`, replace mock in `/ui-components`. |
| **G-05** | API extraction out of date | **P1** | Documentation drift | Update `catalog-targets.ts` and run `extract-api.ts`. |
| **G-06** | Incomplete `transpilePackages` | **P1** | Next.js bundling issues | Add `app-shell`, `drawer`, `badge`, `empty-state`, `pdf-viewer` to `next.config.ts`. |
| **G-07** | Duplicate React mocks in `components/ui` | **P1** | False API expectations | Deprecate `dashboard/src/components/ui/` in favor of real platform packages. |
| **G-08** | Missing Getting Started & Framework guides | **P1** | High adoption barrier | Create `/docs/getting-started` and framework integration guides. |
| **G-09** | Missing Component API tables & slots | **P1** | Developer trial-and-error | Implement standardized API table template across all component pages. |
| **G-10** | WCAG 2.2 AA Contrast & Label defects | **P1** | Accessibility failure | Fix muted text contrast tokens and add labels to all showcase controls. |

