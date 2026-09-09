# SKYRA PLATFORM
## Business Requirements Document (BRD)

**Version:** 2.1.0 — Final Pre-Approval Specification
**Date:** September 2026
**Author:** Skyra Tech Architecture Team
**Status:** PENDING APPROVAL — DO NOT IMPLEMENT

---

> ### STRICT GOVERNANCE NOTICE
>
> **NO IMPLEMENTATION, NO ERP CODE MODIFICATIONS, AND NO MIGRATIONS MAY COMMENCE**
> until this Business Requirements Document and all companion specifications receive
> formal written sign-off from the Skyra Tech Engineering Lead and Product Owner.
>
> `skyra-erp` remains READ-ONLY for the entire duration of this planning phase.

---

## Table of Contents

1. [Vision and Goals](#1-vision-and-goals)
2. [Primary Architectural Principles](#2-primary-architectural-principles)
3. [Non-Goals and Application Boundaries](#3-non-goals-and-application-boundaries)
4. [Target User Personas](#4-target-user-personas)
5. [ERP Technology Stack Reference](#5-erp-technology-stack-reference)
6. [Source-of-Truth Classification System](#6-source-of-truth-classification-system)
7. [Three-Layer Platform Architecture](#7-three-layer-platform-architecture)
8. [ERP Design Fidelity and Visual Source of Truth](#8-erp-design-fidelity-and-visual-source-of-truth)
9. [Mobile-First Web Architecture Requirement](#9-mobile-first-web-architecture-requirement)
10. [Future Native Mobile Application Readiness](#10-future-native-mobile-application-readiness)
11. [Shared Semantics, Not Shared Rendering](#11-shared-semantics-not-shared-rendering)
12. [Layer 1 — Design Foundation](#12-layer-1--design-foundation)
13. [Layer 2 — Reusable UI Systems](#13-layer-2--reusable-ui-systems)
14. [Layer 3 — Reusable Business Modules](#14-layer-3--reusable-business-modules)
15. [Platform Dashboard — Showcase Application](#15-platform-dashboard--showcase-application)
16. [Standard Showcase Page (24 Requirements)](#16-standard-showcase-page-24-requirements)
17. [Package Topology and Dependency Architecture](#17-package-topology-and-dependency-architecture)
18. [Platform vs Application Boundary and Adapter Pattern](#18-platform-vs-application-boundary-and-adapter-pattern)
19. [StatusBadge Ownership Architecture](#19-statusbadge-ownership-architecture)
20. [Reusable Invoice System Requirements](#20-reusable-invoice-system-requirements)
21. [Payment System Integration Requirements](#21-payment-system-integration-requirements)
22. [Organization Foundations Requirements](#22-organization-foundations-requirements)
23. [Accessibility Requirements — WCAG 2.1 AA](#23-accessibility-requirements--wcag-21-aa)
24. [Responsive Design Requirements (7 Viewports)](#24-responsive-design-requirements-7-viewports)
25. [Dark Mode System Requirements](#25-dark-mode-system-requirements)
26. [Performance Targets](#26-performance-targets)
27. [Security Standards](#27-security-standards)
28. [Testing Strategy and Quality Verification](#28-testing-strategy-and-quality-verification)
29. [Package Documentation Standards](#29-package-documentation-standards)
30. [Versioning and Distribution Strategy](#30-versioning-and-distribution-strategy)
31. [ERP Incremental Migration Overview](#31-erp-incremental-migration-overview)
32. [Second-Product Onboarding — Zero Copy-Paste Rule](#32-second-product-onboarding--zero-copy-paste-rule)
33. [Component Acceptance Workflow (22-Step DoD)](#33-component-acceptance-workflow-22-step-dod)
34. [Classified Open Architectural Questions](#34-classified-open-architectural-questions)
35. [Phased Implementation Roadmap](#35-phased-implementation-roadmap)
36. [Risk Analysis](#36-risk-analysis)
37. [Final Acceptance Gate](#37-final-acceptance-gate)

---

## 1. Vision and Goals

### 1.1 Platform Objective

Build a reusable, configurable, documented internal application platform that empowers multiple
Skyra Tech products to share design foundations, UI systems, reusable workflows, and domain
capabilities — without duplicating or copy-pasting implementation code.

The platform is NOT merely a component library, an ERP extraction dump, or an ERP-specific
shared folder. It is an independent, three-layer, multi-product application platform.

### 1.2 Strategic Goals

| # | Goal | Impact |
|---|---|---|
| G1 | **ERP Visual Fidelity** | Platform components are visually derived from and remain compatible with Skyra ERP's established design language. Products share a unified Skyra visual identity. |
| G2 | **Mobile-First Architecture** | Platform components are designed for mobile-first web. Desktop is an expansion, not the baseline. |
| G3 | **Future Mobile Readiness** | Shared business logic (types, calculations, validation) is platform-neutral. A future native mobile layer may consume it without requiring a rewrite. |
| G4 | **Eliminate Code Duplication** | UI, data tables, forms, validation, and calculation engines built once and shared across Skyra products. |
| G5 | **Accelerate Time-to-Market** | New products bootstrap in days by assembling verified platform packages. |
| G6 | **Brand and UX Consistency** | Unified design tokens, responsive typography, coherent interaction states. |
| G7 | **Zero ERP Regression** | `skyra-erp` continues compiling, functioning, and serving users without downtime throughout all migration steps. |
| G8 | **First-Class Platform Dashboard** | Dedicated showcase application serving as engineering workbench, design validator, and QA testing suite. |

### 1.3 Engineering Principles

- **Consistency**: Unified visual vocabulary across all Skyra products.
- **ERP Visual Fidelity**: Platform components reproduce ERP visual language before generalizing it.
- **Mobile-First**: Smallest supported viewport drives component layout decisions.
- **Build Shared Semantics, Not Shared Rendering**: Shared logic and contracts; platform-specific rendering layers.
- **Reuse**: Build once, test thoroughly, use everywhere.
- **Configuration**: Components driven by type-safe declarative schemas.
- **Accessibility**: 100% WCAG 2.1 AA compliance across all interactive elements.
- **Strict TypeScript**: Zero `any` types in public APIs.
- **Testability**: Enforced coverage targets with automated accessibility audits.
- **Clear Boundaries**: Platform owns rendering and logic; applications own persistence and auth.

---

## 2. Primary Architectural Principles

### Principle 1 — ERP Is the Visual Source of Truth

The Skyra ERP (`skyra-erp`) is the primary visual reference for the entire platform design system.
The platform must NOT invent a different visual identity. It systematizes and generalizes the ERP's
established design language so that all future Skyra products share one Skyra visual identity.

```
ERP Visual Language
       ↓
Platform Design System
       ↓
Skyra CRM | Skyra Billing | Future Skyra Products
```

### Principle 2 — Mobile-First Web

Skyra Platform's UI architecture is mobile-first. The smallest breakpoint (320px) is the baseline.
Components expand gracefully to tablet, desktop, and wide-desktop. Desktop-only assumptions
(fixed widths, hover-only states, mouse-only interactions) are architectural defects.

### Principle 3 — Build Shared Semantics, Not Shared Rendering

The platform shares:
- Domain types and interfaces
- Validation contracts (Zod schemas)
- Configuration schemas
- Business calculation engines
- Design semantics (token meaning, not implementation)
- Accessibility principles
- Interaction contracts

While keeping rendering platform-specific:
- Web: React + Next.js + CSS custom properties
- Future Native Mobile: React Native / Expo + native styling

This prevents the web architecture from blocking future mobile development.

### Principle 4 — Strict One-Way Dependencies

Lower-level packages never import from higher-level packages. Zero circular dependencies enforced by CI.

---

## 3. Non-Goals and Application Boundaries

| Area | Reason for Exclusion |
|---|---|
| Prisma ORM and PostgreSQL queries | Database schemas belong to application persistence layer |
| API Route Handlers (`/api/*`) | Application-specific endpoints and middleware |
| Authentication and session state | NextAuth configuration, JWT, session cookies |
| Dashboard routing and pages | Product-specific navigation and layouts |
| Role-Based Access Control (RBAC) | Permission checks enforced in application servers |
| Expense and financial accounts modules | ERP-specific bookkeeping not shared across products |
| Cloud storage SDK integrations | Direct Supabase/Vercel Blob calls (platform uses upload callbacks) |
| Transactional email delivery | Direct Resend SDK dispatch (platform ships templates only) |

---

## 4. Target User Personas

| Persona | Needs |
|---|---|
| **Platform Engineers** | Develop, package, and release `@skyra/*` packages; maintain showcase dashboard and CI |
| **Product Engineers** | Import platform packages into Skyra ERP/CRM/Billing; implement API callback adapters |
| **Designers** | Audit design tokens, verify ERP visual fidelity, inspect component states via dashboard |
| **QA Engineers** | Execute accessibility audits, verify multi-breakpoint layouts, test edge cases |
| **Product Managers** | Review platform capabilities, inspect invoice templates, evaluate feature readiness |
| **New Engineers** | Learn Skyra architectural patterns and APIs from the dashboard |

---

## 5. ERP Technology Stack Reference

Confirmed via direct source inspection of `skyra-erp`:

| Dimension | Details | Source |
|---|---|---|
| Framework | Next.js 16.2.12 (App Router) | `package.json` |
| Runtime | React 19.2.4 | `package.json` |
| Language | TypeScript 5.x (Strict mode) | `tsconfig.json` |
| Styling | Vanilla CSS Modules + global CSS design tokens | `globals.css`, `ui.css`, `*.module.css` |
| ORM | Prisma 5.21.1 | `package.json` |
| Database | PostgreSQL (Supabase managed) | `.env` |
| Authentication | NextAuth 4 + `@auth/prisma-adapter` | `package.json` |
| Validation | Zod 3.25 | `package.json` |
| Form Management | React Hook Form 7.85 + `@hookform/resolvers` | `package.json` |
| Email Templating | Resend 6.25 + `@react-email/components` | `package.json` |
| PDF Generation | Client: `html2canvas` 1.4 + `jsPDF` 4.2; Server: `jsPDF` direct | `package.json` |
| File Storage | Supabase Storage + `@vercel/blob` | source |
| Iconography | Lucide React 1.33 | `package.json` |
| Charts | Recharts 3.10 | `package.json` |
| Notifications | `react-hot-toast` | `package.json` |
| Fonts | Inter (body/UI), Outfit (headings) loaded via Google Fonts | `globals.css:1` |
| Sidebar Width | 280px expanded, 72px collapsed | `DashboardLayout.module.css:19-33` |
| Mobile Sidebar | `position: fixed; transform: translateX(-100%)` below 768px | `DashboardLayout.module.css:582-608` |
| Body Line Height | 1.6 | `globals.css:101` |
| Dark Mode Strategy | `.dark` class on `<html>` element | `globals.css:57` |

---

## 6. Source-of-Truth Classification System

Every capability, component, and feature across all documentation is classified using this taxonomy:

| Code | Meaning |
|---|---|
| **`[A] EXISTING IN ERP`** | Confirmed by direct source inspection of `skyra-erp` |
| **`[B] PLATFORM EXTRACTION`** | ERP capability generalized and decoupled into a reusable platform package |
| **`[C] PLATFORM ENHANCEMENT`** | Deliberate improvement or new capability for platform reusability (does not exist identically in ERP today) |
| **`[D] FUTURE / OPTIONAL`** | Planned capability not required for the initial platform release |

Rules:
- Never describe `[C]` or `[D]` capabilities as existing ERP behavior.
- Never label future mobile architecture items as `[A]` or `[B]`.
- Every intentional visual deviation from ERP must be explicitly classified as `[C]` with justification.

---

## 7. Three-Layer Platform Architecture

```
+-------------------------------------------------------------------------------+
| LAYER 3: REUSABLE BUSINESS MODULES                                            |
| @skyra/invoice                                                                |
| - Complete Invoice Capability (Config, Engine, Preview, Line Items, Tax/GST,  |
|   PDF, Email, Payment UI via Adapters)                                        |
| - [D] Future domain modules when justified by 2+ consuming products           |
+-------------------------------------------------------------------------------+
                               (imports Layer 2 + Layer 1)
+-------------------------------------------------------------------------------+
| LAYER 2: REUSABLE UI SYSTEMS                                                  |
| @skyra/ui           — Primitive Components (Button, Input, Select, Badge...)  |
| @skyra/data-table   — DynamicDataTable (Client + Server, Mobile-Responsive)   |
| @skyra/dynamic-form — Schema-Driven DynamicForm (13 Field Types, Conditional) |
| @skyra/dialogs      — ConfirmDialog, Modal, Drawer (Focus Trap, Escape Key)   |
+-------------------------------------------------------------------------------+
                               (imports Layer 1)
+-------------------------------------------------------------------------------+
| LAYER 1: DESIGN FOUNDATION                                                    |
| @skyra/design-tokens — CSS Custom Properties (--skyra-*), Dark Mode Overrides |
| @skyra/utils         — Pure TS Utilities (amountInWords, currency, geo, date) |
| @skyra/validation    — Authoritative Zod Schemas (Invoice, Payment, Org, Bank)|
+-------------------------------------------------------------------------------+
                               (consumed via workspace / registry imports)
               +--------------------------+--------------------------+
               |                                                     |
  +------------------------+                       +----------------------------------+
  | APPLICATION: skyra-erp |                       | APPLICATION: skyra-crm (Future)  |
  | Prisma, NextAuth, Pages|                       | Prisma, Auth, CRM Pages          |
  +------------------------+                       +----------------------------------+
```

---

## 8. ERP Design Fidelity and Visual Source of Truth

This is a **FIRST-CLASS PLATFORM REQUIREMENT**, not an aesthetic preference.

### 8.1 Governing Rule

Skyra ERP is the primary visual reference for the platform design system. The platform
must preserve the ERP's established visual language as it systematizes and generalizes it.

### 8.2 What Must Be Preserved

| Design Dimension | ERP Established Value | Source |
|---|---|---|
| Brand primary color | `#0A58CA` | `globals.css:8` |
| Brand orange accent | `#FF6B00` | `globals.css:11` |
| Brand cyan accent | `#00A3E0` | `globals.css:14` |
| Brand navy | `#002B66` | `globals.css:16` |
| Sidebar background | `var(--navy)` = `#002B66` | `DashboardLayout.module.css:20` |
| Sidebar width (expanded) | `280px` | `DashboardLayout.module.css:19` |
| Sidebar width (collapsed) | `72px` | `DashboardLayout.module.css:32` |
| Header height | `64px` | `DashboardLayout.module.css:484` |
| Card background | `#FFFFFF` / Dark: `#151D30` | `globals.css:20,59` |
| Page background | `#F4F7FC` / Dark: `#0B111E` | `globals.css:19,58` |
| Primary button style | Solid `#0A58CA` + shadow `rgba(10,88,202,0.25)` + `-1px` hover lift | `ui.css:58-68` |
| Submit button gradient | `linear-gradient(135deg, var(--primary) 0%, #0847a8 100%)` | `DynamicForm.module.css:231` |
| Table action button gradient | `linear-gradient(135deg, var(--primary) 0%, #0847a8 100%)` | `Table.module.css:125` |
| Body font | `Inter`, system-ui, sans-serif | `globals.css:98` |
| Heading font | `Outfit`, sans-serif | `ui.css:31` |
| Border radius sm | `6px` | `globals.css:47` |
| Border radius md | `10px` | `globals.css:48` |
| Border radius lg | `14px` | `globals.css:49` |
| Border radius xl | `20px` | `globals.css:50` |
| Badge shape | `border-radius: 999px` (pill) | `ui.css:266` |
| Logo mark | Orange-to-`#ff8c33` gradient, Outfit 800, 36×36, `border-radius: var(--radius-md)` | `DashboardLayout.module.css:47-61` |
| Nav active item | `rgba(10,88,202,0.35)` bg + `inset 3px 0 0 var(--primary)` left accent border | `DashboardLayout.module.css:264-268` |
| Form fieldset card | `border-radius: var(--radius-xl)` + `1px solid var(--border-color)` | `DynamicForm.module.css:14-19` |
| Table card | `border-radius: var(--radius-xl)` + `1px solid var(--border-color)` | `Table.module.css:8-14` |
| Dark mode strategy | `.dark` CSS class on `<html>` element | `globals.css:57` |
| Mobile sidebar behavior | Slides in from left via `translateX(0)` at `≤768px` | `DashboardLayout.module.css:582-608` |
| Form 2-col → 1-col breakpoint | `max-width: 640px` | `DynamicForm.module.css:270` |
| Table horizontal scroll | `overflow-x: auto; -webkit-overflow-scrolling: touch` | `Table.module.css:192-195` |
| Modal backdrop | `rgba(0,0,0,0.5)` + `backdropFilter: blur(2px)` | `ConfirmDialog.tsx:62-63` |
| Dialog width | `440px max-width: calc(100vw - 2rem)` | `ConfirmDialog.tsx:78-79` |
| Dialog radius | `var(--radius-lg)` | `ConfirmDialog.tsx:81` |
| Dialog padding | `2rem` | `ConfirmDialog.tsx:83` |
| Form input height | `padding: 0.65rem 0.875rem` (≈38px) | `DynamicForm.module.css:74` |
| Form input font | `0.875rem` | `DynamicForm.module.css:78` |
| Form focus ring | `0 0 0 3px rgba(10,88,202,0.12)` | `DynamicForm.module.css:97` |
| Error focus ring | `0 0 0 3px rgba(239,68,68,0.10)` | `DynamicForm.module.css:104` |
| Table header text | `0.72rem`, uppercase, `letter-spacing: 0.06em` | `Table.module.css:211-217` |
| Table row hover | `background: var(--bg-color)` | `Table.module.css:246-247` |
| Skeleton shimmer | `linear-gradient` shifting `200% → -200%` at 1.4s | `Table.module.css:341-352` |
| Disabled opacity | `0.55` | `ui.css:152` |
| Transition speed | `0.2s ease` for interactions, `0.28s cubic-bezier(0.4,0,0.2,1)` for sidebar | `DashboardLayout.module.css:23-24` |

### 8.3 Platform Extraction and Generalization Rule

When extracting a component into a platform package:

1. First reproduce the ERP component's visual appearance exactly (`[B] PLATFORM EXTRACTION`).
2. Then generalize it (add variants, sizes, accessibility, responsiveness) (`[C] PLATFORM ENHANCEMENT`).
3. Any intentional visual change from ERP must be documented as `[C]` with a reason.
4. Architectural improvements (focus traps, ARIA, server-side modes) are always `[C]`.

### 8.4 Dashboard Design Verification Requirement

Every platform showcase page must display:
- An "ERP Reference" section showing the ERP file path, line numbers, and a description of the original implementation.
- A visual side-by-side or labeled comparison of the ERP component vs the platform component.
- Any `[C]` enhancements must be labeled with their justification.

### 8.5 Migration Must Not Accidentally Redesign ERP

ERP migration validation must verify visual fidelity at each step. If a migrated component
looks different from its ERP predecessor without a documented `[C]` classification, the PR
must be rejected.

---

## 9. Mobile-First Web Architecture Requirement

Skyra Platform UI is **mobile-first**. This is an architectural decision, not a CSS afterthought.

### 9.1 What Mobile-First Means

- The baseline viewport is 320px wide.
- Component layout at 320px must be functional, not broken.
- Desktop behavior is built by expanding and enhancing mobile layout.
- All CSS uses mobile-first `min-width` media queries.

### 9.2 Architectural Requirements for Every Component

Each component must define and verify:

| Behavior | Requirement |
|---|---|
| Minimum supported width | 320px |
| Mobile layout | Explicit mobile-first design |
| Tablet layout | Defined expansion from mobile |
| Desktop layout | Full feature display |
| Touch targets | Minimum 44×44px touch target area |
| Hover-only interactions | None — all interactions must also work on touch |
| Overflow behavior | Defined — no accidental horizontal overflow |
| Resizing behavior | Defined — components respond gracefully to viewport changes |

### 9.3 Mobile Behavior Specifications (Confirmed from ERP Source)

| Component | Mobile Behavior |
|---|---|
| Sidebar | `position: fixed; transform: translateX(-100%)` below 768px — slides in from left | [A] |
| Mobile overlay | `display: block` below 768px — full-screen backdrop | [A] |
| DynamicForm | Collapses from 2 columns to 1 column at `max-width: 640px` | [A] |
| DynamicDataTable | `overflow-x: auto; -webkit-overflow-scrolling: touch` — horizontal scroll | [A] |
| Page content padding | Reduces from `1.75rem 2rem` to `1.25rem` on mobile | [A] |
| Drawers | Expand to `100vw` on mobile `<640px` | [C] |
| Dialogs | `maxWidth: calc(100vw - 2rem)` — already confirmed in ERP | [A] |
| InvoicePreview | Contained in a horizontally scrollable wrapper on mobile | [C] |
| Action button groups | Stack vertically on mobile | [C] |

### 9.4 Required Verification Viewports

Platform components must be verified at all of these widths:

```
320px   — Minimum supported mobile (small phones)
375px   — Standard mobile (iPhone SE/standard)
640px   — Mobile landscape / large phones
768px   — Tablet portrait (iPad)
1024px  — Tablet landscape / small desktop
1280px  — Standard desktop
1536px  — Wide desktop
```

---

## 10. Future Native Mobile Application Readiness

### 10.1 Classification

All future native mobile architecture is classified `[D] FUTURE / OPTIONAL`.
No native mobile code will be created as part of the current platform.

### 10.2 Strategic Intent

The Skyra Platform must be architecturally prepared so that a future native mobile
application (`Skyra Mobile`) can be developed without rebuilding the business logic foundation.

**Preferred future direction**: React Native / Expo, subject to formal architecture approval.
This is not a finalized decision.

### 10.3 Future Architecture Diagram

```
                    SKYRA PLATFORM
                          |
          +---------------+---------------+
          |                               |
   SHARED FOUNDATIONS           SHARED BUSINESS LOGIC
   @skyra/utils                 @skyra/invoice (engine)
   @skyra/validation            @skyra/validation
   Domain Types                 Calculation Engine
   Configuration Models         Shared Schemas
          |
     +----+----+
     |         |
   WEB UI    MOBILE UI [D] FUTURE
     |         |
 React/Next  React Native / Expo (TBD)
 @skyra/ui   @skyra/mobile-ui [D] FUTURE
```

### 10.4 Shared Foundation Requirements (Enables Future Mobile)

The following must remain platform-neutral (no DOM, CSS, browser APIs, or Next.js imports):

- `@skyra/utils` — all calculation and formatting functions
- `@skyra/validation` — all Zod schemas
- `@skyra/invoice` root export (types, engine, config) — no React imports

### 10.5 Future Mobile Package [D]

A future package `@skyra/mobile-ui` (or architecture-approved equivalent) may eventually provide:
- Native Button, Input, Select, Card, Badge, Dialog, Drawer/Sheet
- Mobile navigation primitives
- Touch-optimized components

This package would consume:
- Same Skyra semantic design tokens (mapped to React Native StyleSheet values)
- Same `@skyra/utils` and `@skyra/validation`
- Same `@skyra/invoice` calculation engine and types

No business logic will be duplicated between web and mobile packages.

### 10.6 Future Token Architecture [D]

CSS custom properties serve the current web implementation correctly.
A future typed JS/TS token representation for native mobile may be introduced:

```
Canonical Skyra Design Semantics
            ↓
    Platform Token Source
       ↙           ↘
  Web CSS          JS/TS Token Object [D] FUTURE
  tokens.css       skyra.tokens.ts
                   ↓
             React Native
             StyleSheet values
```

Token semantic meaning must remain stable regardless of rendering technology.
Examples of platform-neutral semantic names:
`skyra.primary`, `skyra.surface.background`, `skyra.text.primary`,
`skyra.text.muted`, `skyra.border.default`, `skyra.radius.md`, `skyra.spacing.md`

---

## 11. Shared Semantics, Not Shared Rendering

**Core Principle:** The platform shares design semantics, domain contracts, and business rules.
It does NOT force web React components to run in React Native or vice versa.

### What Is Shared (Platform-Neutral)

- TypeScript domain types and interfaces
- Zod validation schemas
- Business calculation engines (invoice math, tax logic)
- Configuration schemas (InvoiceConfig)
- Currency and locale formatting utilities
- Geographic and reference data
- Design token semantic names and meanings
- Accessibility principles and interaction contracts

### What Is Platform-Specific (Rendering Layer)

| Platform | Rendering Stack |
|---|---|
| Web (current) | React + Next.js + CSS custom properties |
| Native Mobile [D] | React Native / Expo + native StyleSheet |
| Future platforms | Additional rendering adapters as needed |

---

## 12. Layer 1 — Design Foundation

Zero dependencies on React or browser DOM. Safe to import in Node.js, edge workers, and future React Native apps.

- **`@skyra/design-tokens`**: Ships `tokens.css` and `tokens.dark.css`. Defines all `--skyra-*` CSS custom properties derived from ERP.
- **`@skyra/utils`**: Pure deterministic TypeScript utilities (`amountInWords`, `formatCurrency`, `formatDate`, geographic data, dial codes). Zero DOM dependencies.
- **`@skyra/validation`**: Authoritative Zod schemas for invoices, payments, organizations, banks, clients.

---

## 13. Layer 2 — Reusable UI Systems

React 19 UI systems. Zero direct network or database calls. Mobile-first layout. WCAG 2.1 AA compliant.

- **`@skyra/ui`**: Primitive components (`Button`, `Input`, `Textarea`, `Native Select`, `CustomSelect`, `Checkbox`, `Badge`, `Card`, `Alert`, `Spinner`, `Divider`, `PhoneInputField`, `LogoUploader`).
- **`@skyra/data-table`**: `DynamicDataTable` — client and server modes, row selection, bulk actions, mobile-responsive horizontal scroll and stacked row presentation.
- **`@skyra/dynamic-form`**: `DynamicForm` schema-driven engine — 13 field types, conditional visibility, 2-col to 1-col mobile collapse at `≤640px`.
- **`@skyra/dialogs`**: `ConfirmDialog`, `Modal`, `Drawer` — focus trapping, focus restoration, Escape key handling, backdrop blur, mobile full-screen behavior.

---

## 14. Layer 3 — Reusable Business Modules

Complex domain workflows reused across multiple Skyra products.

- **`@skyra/invoice`**: Complete invoicing system (configuration, data model, validation, calculation engine, GST logic, line items, invoice preview, template configuration, payment UI, client PDF, server PDF buffer, email template).

---

## 15. Platform Dashboard — Showcase Application

The Platform Dashboard (`skyra-platform/dashboard/`) is a dedicated Next.js application —
the primary engineering workbench, design system catalog, and QA testing suite.

**Not an ERP dashboard. Not a customer portal. Not an end-user business interface.**

**The dashboard itself must be responsive** and usable at all 7 specified viewports.

### 15.1 Information Architecture

```
Skyra Platform Dashboard
|
+-- 1. Overview — Architecture diagram, package inventory, quick start
|
+-- 2. Design System
|      ERP Reference | Brand Colors | Semantic Colors | Surfaces |
|      Typography | Spacing | Radius | Shadows | Borders | Motion |
|      Breakpoints | Icons | Dark Mode | [CONFIRMED] vs [PROPOSED] labels
|
+-- 3. UI Components — Every @skyra/ui component with ERP reference comparison
|
+-- 4. Data Table — 9 showcase designs
|      Basic | Finance | CRM | Selectable | Bulk Actions |
|      Server-Side | Loading | Empty | Error
|
+-- 5. Dynamic Form — 5 showcase workflows
|      Simple | Business Two-Column | Conditional Logic |
|      Settings + Danger Zone | Validation Errors
|
+-- 6. Dialogs and Overlays
|      ConfirmDialog (danger, warning, primary) |
|      Modal (sm, md, lg, xl, full) |
|      Drawer (right, left, detail, edit, filter, payment)
|
+-- 7. Invoice System
|      Interactive Invoice Builder (3-pane) |
|      8 Configuration-Driven Showcase Designs |
|      Line Item Grid Editor |
|      Tax and GST Engine Calculator |
|      Payment Modal and Drawer |
|      PDF Download Preview |
|      Email Template Preview
|
+-- 8. Validation Schemas — Interactive Zod schema tester
|
+-- 9. Utilities — Interactive amountInWords, formatCurrency, formatDate calculators
|
+-- 10. Accessibility Studio — Keyboard tracer, focus auditor, ARIA inspector, contrast matrix
|
+-- 11. Responsive Viewport Studio — 7-viewport frame tester (320, 375, 640, 768, 1024, 1280, 1536)
|
+-- 12. Package Documentation — Live README, changelogs, API contracts per package
```

### 15.2 Real Package Rendering Guarantee

The dashboard must NEVER render mocked or copy-pasted component code.
It must import and render compiled workspace package builds from `@skyra/*`.

---

## 16. Standard Showcase Page (24 Requirements)

```
================================================================================
STANDARD SHOWCASE PAGE STRUCTURE
================================================================================
1.  Component / Module Name (H1)
2.  Package name and subpath export
3.  Source-of-Truth Classification [A/B/C/D]
4.  Component description and architecture role
5.  Primary purpose and business rationale
6.  When to use (recommended cases)
7.  When NOT to use (anti-patterns and alternatives)
8.  Live interactive visual preview
9.  Live interactive controls panel
10. All documented design variants (labeled)
11. All supported sizes (sm, md, lg side-by-side)
12. All interaction states (default, hover, focus, active, disabled, loading, error, read-only)
13. TypeScript props / API table (prop, type, default, required, description)
14. Events and callback signatures table
15. Children, slots, and render props documentation
16. Accessibility specification (ARIA roles, attributes, screen-reader behaviors)
17. Keyboard interaction contract (key-by-key mapping)
18. Responsive behavior across 7 viewports (320, 375, 640, 768, 1024, 1280, 1536)
19. Light and dark mode comparison views
20. Verified copy-pasteable code examples
21. Do's and don'ts usage guidelines
22. Related platform components and dependencies
23. ERP source reference (file path and line numbers in skyra-erp)
24. Testing requirements and coverage targets
================================================================================
```

---

## 17. Package Topology and Dependency Architecture

### 17.1 Package Inventory

| Package Directory | Package Name | Layer | Runtime | Dependencies |
|---|---|---|---|---|
| `packages/design-tokens` | `@skyra/design-tokens` | 1 | CSS | None |
| `packages/utils` | `@skyra/utils` | 1 | Universal TS | None |
| `packages/validation` | `@skyra/validation` | 1 | Universal TS | `zod` (peer) |
| `packages/ui` | `@skyra/ui` | 2 | React (Browser/SSR) | `@skyra/design-tokens`, `react` (peer), `lucide-react` (peer) |
| `packages/data-table` | `@skyra/data-table` | 2 | React (Browser/SSR) | `@skyra/ui`, `react` (peer), `lucide-react` (peer) |
| `packages/dynamic-form` | `@skyra/dynamic-form` | 2 | React (Browser/SSR) | `@skyra/ui`, `react` (peer), `lucide-react` (peer) |
| `packages/dialogs` | `@skyra/dialogs` | 2 | React (Browser/SSR) | `@skyra/ui`, `react` (peer), `lucide-react` (peer) |
| `packages/invoice` | `@skyra/invoice` | 3 | Hybrid | `@skyra/ui`, `@skyra/utils`, `@skyra/validation`, `jspdf`, `html2canvas`, `@react-email/components`, `nanoid` |
| `dashboard/` | `skyra-platform-dashboard` | App | Next.js 16 | All workspace `@skyra/*` packages |

### 17.2 One-Way Dependency Graph

```
@skyra/design-tokens  @skyra/utils  @skyra/validation
         |                 |               |
         +-----------------+---------------+
                           |
                       @skyra/ui
                           |
          +----------------+--------------+
          |                |              |
  @skyra/data-table  @skyra/dynamic-form  @skyra/dialogs
          |                |              |
          +----------------+--------------+
                           |
                      @skyra/invoice
```

### 17.3 Runtime-Safe Subpath Exports for `@skyra/invoice`

| Subpath | Runtime | Contents |
|---|---|---|
| `@skyra/invoice` | Universal | Types, Zod schemas, calculation engine |
| `@skyra/invoice/components` | Client (Browser/SSR) | InvoicePreview, LineItemGrid, StatusBadge, RecordPaymentModal, PaymentDrawer |
| `@skyra/invoice/pdf/client` | Client (Browser only) | `downloadInvoicePDF()` via `html2canvas` + `jsPDF` |
| `@skyra/invoice/pdf/server` | Server (Node.js only) | `generateInvoicePdfBuffer()` via Node.js-compatible server-side jsPDF vector/buffer generator |
| `@skyra/invoice/email` | Server (Node.js only) | `InvoiceEmail` via `@react-email/components` |

---

## 18. Platform vs Application Boundary and Adapter Pattern

```
+------------------------------------------+------------------------------------------+
| PLATFORM OWNS (@skyra/*)                 | APPLICATION OWNS                         |
+------------------------------------------+------------------------------------------+
| TypeScript interfaces, types, enums      | Prisma ORM schemas, client, migrations   |
| Declarative configuration schemas        | Server API route handlers (/api/*)       |
| Zod validation schemas                   | NextAuth authentication and sessions     |
| Pure business calculation engines        | Database persistence and transactions    |
| UI rendering, layouts, grids, badges     | File storage credentials and buckets     |
| Form field dispatchers and validations   | Transactional email delivery (Resend)    |
| Modal and drawer focus/state management  | Role-Based Access Control rules          |
| High-fidelity HTML invoice templates     | Multi-tenant organization switching      |
| React Email component markup             | Page routing, breadcrumbs, app shell     |
| Adapter callback prop definitions        | Implementation of mutation callbacks     |
+------------------------------------------+------------------------------------------+
```

Platform components must NOT call `fetch`, `prisma`, `getServerSession`, Resend, or Supabase.

---

## 19. StatusBadge Ownership Architecture

**Resolved ownership to eliminate duplication between `@skyra/ui` and `@skyra/invoice`.**

| Package | Ownership |
|---|---|
| **`@skyra/ui`** | Owns the generic `StatusBadge` UI primitive — a reusable badge component that accepts any `status` string key, a `statusMap` record (bg, color, border, label per status key), and a `size` prop. |
| **`@skyra/invoice`** | Owns the invoice-specific `INVOICE_STATUS_MAP` configuration object (DRAFT, SENT, VIEWED, PARTIAL, PAID, OVERDUE, VOIDED) and re-exports a pre-configured `InvoiceStatusBadge` convenience wrapper that passes the `INVOICE_STATUS_MAP` to the generic `@skyra/ui` `StatusBadge`. |

No component implementation is duplicated. `@skyra/invoice/components` imports `StatusBadge` from `@skyra/ui`.

---

## 20. Reusable Invoice System Requirements

`@skyra/invoice` is a cohesive business capability — 15 conceptual subsystems.
See `invoice-module.md` for the complete specification.

Key confirmed business rules (source: `skyra-erp/src/components/invoices/LineItemGrid.tsx`):

```
base = quantity × rate
discount = (if PERCENTAGE) base × discountAmt/100  |  (if FIXED) discountAmt
taxable = base - discount
tax = taxable × taxRate/100
rowTotal = round2(taxable + tax)
subtotal = sum(qty × rate) for item rows (header rows contribute 0)
totalDiscount = sum(discount)  |  totalTax = sum(tax)
grandTotal = round2(subtotal - totalDiscount + totalTax)
GST: if orgState ≠ placeOfSupply → 100% IGST  |  else → 50% CGST + 50% SGST
```

### Confirmed Payment Business Rules

1. Payment amount cannot exceed outstanding `balanceDue`.
2. Payment amount is permanently locked after recording.
3. Deleting a payment atomically updates invoice paid balance and status.
4. `VOIDED` and `PAID` invoices cannot accept payments.
5. Status auto-computes: `PAID` when `balanceDue ≤ 0.009`, else `PARTIAL`.

---

## 21. Payment System Integration Requirements

- Platform exposes `RecordPaymentModal` and `PaymentDrawer` with callback adapters (`onSubmit`, `onSuccess`, `onClose`).
- Application owns atomic database transactions (`$transaction`), invoice status updates, and payment persistence.

---

## 22. Organization Foundations Requirements

Platform provides **Organization Foundations** (primitives and validation), NOT a full organization management module.

- **Platform**: `createOrganizationSchema`, `updateOrganizationSchema`, GSTIN validation, business types, industry categories, geographic data, `LogoUploader` with adapter callbacks.
- **Application**: OrganizationDrawer, `/api/organizations`, Prisma queries, memberships, RBAC, organization switching UI.

---

## 23. Accessibility Requirements — WCAG 2.1 AA

All interactive components must achieve 100% WCAG 2.1 AA compliance.

| Requirement | Standard |
|---|---|
| Keyboard navigation | Full Tab/Shift+Tab traversal; Arrow keys in CustomSelect |
| Focus trapping | Active within Modal, Drawer, ConfirmDialog |
| Focus restoration | Auto-returns to trigger element on dismiss |
| Escape key | Dismisses all dialogs, drawers, and dropdowns |
| Visible focus rings | 3px blue glow (`0 0 0 3px rgba(10,88,202,0.15)`) — confirmed ERP value |
| ARIA roles | `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby`, `aria-invalid`, `aria-expanded` |
| Icon-only controls | Mandatory `aria-label` |
| Error announcements | `role="alert"` or `aria-live="polite"` on error containers |
| Color contrast | ≥4.5:1 normal text, ≥3:1 large text/icons |
| Touch targets | Minimum 44×44px touch target area |
| No hover-only interactions | All states accessible via keyboard and touch |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` collapses all animations |

---

## 24. Responsive Design Requirements (7 Viewports)

All platform components must be specified and manually verified at 7 viewport widths:

| Viewport | Width | Key Layout Behaviors |
|---|---|---|
| Extra Small Mobile | 320px | 1-column forms, full-width buttons, touch-scroll tables, slide-in mobile sidebar |
| Standard Mobile | 375px | Standard mobile layout; touch target verification |
| Mobile Landscape | 640px | Form 2-col threshold; form collapses to 1-col below this |
| Tablet | 768px | Sidebar switches from slide-in to fixed-width; 2-col forms |
| Small Desktop | 1024px | Full sidebar expanded; complete table columns |
| Standard Desktop | 1280px | Primary development target; full feature display |
| Wide Desktop | 1536px | Max-width container constraints; extended data grid views |

---

## 25. Dark Mode System Requirements

1. Driven by `.dark` class on `<html>` element — confirmed from `globals.css:57`.
2. Overrides defined in `tokens.dark.css` in `@skyra/design-tokens`.
3. All ERP dark mode values (`#0B111E`, `#151D30`, etc.) confirmed and preserved.
4. Dashboard provides live light/dark split comparison for every component.
5. **Invoice Print Integrity**: Application chrome renders dark; A4 invoice document container preserves light/print fidelity.

---

## 26. Performance Targets

| Target | Budget | Verification |
|---|---|---|
| Package bundle size | <50 KB gzipped per package (excluding peer deps) | `tsup` bundle analyzer |
| Tree-shaking | `"sideEffects": false` | Automated ESM test |
| Table render (1,000 rows) | <100ms client-side sort/filter | Chrome DevTools Profiler |
| Client PDF generation | <3.0s for standard 2-page invoice | Performance test script |
| Component mount time | <16ms for UI primitives | React 19 Profiler |
| Dashboard initial load | <3.0s on broadband | Lighthouse CI |
| Mobile performance | Lightweight architecture with minimal deps, tree-shakeable, lazy-loadable | Review during implementation |

Mobile-specific considerations: minimal unnecessary dependencies, lazy loading, image optimization, animation performance, reduced motion support, and network-conscious data loading patterns.

---

## 27. Security Standards

1. No API keys or credentials in platform packages or dashboard.
2. Client-side Zod validation for UX; server-side must independently enforce Zod parsing.
3. PDF generation accepts only explicit structured props — zero external URL fetching.
4. All user strings rendered via standard React DOM bindings — no dangerouslySetInnerHTML.

---

## 28. Testing Strategy and Quality Verification

### 28.1 Mandatory V1 Quality

| Test Type | Target Coverage | Tool |
|---|---|---|
| Unit tests (utils, validation, engine) | ≥95% | Vitest |
| Component tests | ≥80% | Vitest + RTL |
| Integration tests (invoice workflows) | ≥70% | Vitest |
| Accessibility audits (all interactive states) | 100% pass | jest-axe (axe-core) |
| Type-level tests | All public APIs | tsd / Vitest |
| Multi-viewport manual verification | 7 viewports | Manual + Responsive Studio |
| Dark mode verification | All components | Manual |
| ERP visual regression baseline | All ERP pages pre/post migration | Screenshot diff |

### 28.2 Future Automation [D]

Automated cloud screenshot-diff infrastructure (Storybook / Chromatic CI) is classified `[D] FUTURE`.
Manual responsive and visual regression verification is mandatory for V1.

---

## 29. Package Documentation Standards

Every `packages/*` must contain:
1. `README.md` — overview, installation, subpath import guide, TypeScript prop tables, copy-pasteable examples.
2. JSDoc annotations on all exported functions, classes, and interfaces.
3. `CHANGELOG.md` via Changesets.

---

## 30. Versioning and Distribution Strategy

- Independent SemVer per package.
- Published as `0.1.0` during development; promoted to `1.0.0` after stable ERP consumption.
- Initial distribution: pnpm workspace protocol (`workspace:*`).
- Production distribution: private npm registry (timing is an open question — OQ1).

---

## 31. ERP Incremental Migration Overview

8-step non-destructive migration with mandatory dashboard verification at every step:

```
Step 1: @skyra/design-tokens  →  Step 2: @skyra/utils  →  Step 3: @skyra/validation
→  Step 4: @skyra/ui  →  Step 5: @skyra/data-table  →  Step 6: @skyra/dynamic-form
→  Step 7: @skyra/dialogs  →  Step 8: @skyra/invoice
```

See `migration-plan.md` for full pre-migration gates, step-by-step checklists, and rollback runbooks.

---

## 32. Second-Product Onboarding — Zero Copy-Paste Rule

A second product (Skyra CRM) is onboarding-ready when:
1. Platform packages install cleanly.
2. Design tokens style all views automatically.
3. Product owns its own database, API routes, and auth.
4. Platform components connected via callback adapters.
5. Zero platform source files copied into product codebase.
6. Zero platform packages forked.

---

## 33. Component Acceptance Workflow (22-Step DoD)

```
================================================================================
COMPONENT ACCEPTANCE WORKFLOW
================================================================================
[ ] 1.  TypeScript API implemented — zero public `any`
[ ] 2.  Dedicated showcase page in dashboard/ imports actual compiled package
[ ] 3.  Dashboard showcase renders real package build (no mocked copies)
[ ] 4.  All documented design variants rendered and verified
[ ] 5.  All supported sizes (sm, md, lg) demonstrated
[ ] 6.  All interaction states (default, hover, focus, active, disabled, loading, error) verified
[ ] 7.  Light mode verified
[ ] 8.  Dark mode verified
[ ] 9.  320px viewport verified
[ ] 10. 375px viewport verified
[ ] 11. 640px viewport verified
[ ] 12. 768px viewport verified
[ ] 13. 1024px viewport verified
[ ] 14. 1280px viewport verified
[ ] 15. 1536px viewport verified
[ ] 16. Keyboard navigation contract fully verified
[ ] 17. ARIA roles and screen-reader announcements verified
[ ] 18. Touch targets ≥44px verified
[ ] 19. Unit/component test suite passes (≥80% coverage)
[ ] 20. Accessibility test passes — 0 axe-core violations
[ ] 21. Package README.md updated with complete API reference
[ ] 22. Platform engineer and design sign-off received
================================================================================
```

---

## 34. Classified Open Architectural Questions

### Category A — Must Be Decided Before Phase 1 Implementation

| # | Question | Recommendation |
|---|---|---|
| OQ1 | Package distribution mechanism (pnpm workspace vs private npm registry) | Start with workspace; publish to private registry at v1.0 |
| OQ2 | Are all initial **web** consuming products standardized on Next.js App Router + React 19? (Does not constrain future native mobile products — see OQ11) | Yes — Next.js App Router + React 19 is the company standard for initial web products. Future native mobile remains `[D] FUTURE` subject to OQ11. |
| OQ3 | DynamicForm state model — controlled vs React Hook Form adapter | Controlled interface with optional React Hook Form adapter |
| OQ4 | Invoice v1 tax scope — Indian GST only vs extensible multi-tax | `taxMode: 'GST' | 'VAT' | 'CUSTOM' | 'NONE'` extensible schema |

### Category B — Can Remain Open During Early Implementation

| # | Question |
|---|---|
| OQ5 | jsPDF / html2canvas as bundled vs peer dependencies |
| OQ6 | Dashboard deployment — internal Vercel preview vs local dev only |
| OQ7 | Multi-currency roster for `@skyra/utils` v1 (INR, USD, EUR, GBP) |
| OQ8 | LogoUploader optional storage helper presets |

### Category C — Future Product Decisions

| # | Question |
|---|---|
| OQ9 | Automated cloud visual regression (Storybook / Chromatic) |
| OQ10 | Design tokens JS/TS object API for future native mobile |
| OQ11 | Formal approval of React Native / Expo as future mobile technology |
| OQ12 | Timeline and scope for `@skyra/mobile-ui` package |

---

## 35. Phased Implementation Roadmap

```
PHASE 0 (NOW):    Specification finalization and formal approval
PHASE 1:          Monorepo setup + @skyra/design-tokens + dashboard skeleton
PHASE 2:          @skyra/utils + @skyra/validation (≥95% test coverage)
PHASE 3:          @skyra/ui + UI showcase section (ERP visual fidelity verified)
PHASE 4:          @skyra/data-table + 9 table showcase designs
PHASE 5:          @skyra/dynamic-form + 5 form showcase workflows
PHASE 6:          @skyra/dialogs + dialog showcase
PHASES 7-9:       @skyra/invoice (engine → preview → PDF/email → payment)
PHASE 10:         8-step incremental ERP migration
PHASE 11:         Second product onboarding + platform v1.0.0 release
[D] PHASE FUTURE: Mobile architecture — @skyra/mobile-ui if approved
```

---

## 36. Risk Analysis

| Risk | Mitigation |
|---|---|
| ERP regression during migration | Visual screenshot baseline + 8-step atomic PRs + rollback runbooks |
| Design drift from ERP | ERP fidelity requirement with dashboard comparison panels |
| Accidental desktop-only architecture | Mobile-first mandate enforced at component DoD |
| Circular monorepo dependencies | CI lint with `madge` / `eslint-plugin-import` |
| Blocking future mobile | Shared semantics principle + platform-neutral Layer 1 |
| Over-engineering | Strict [D] classification for speculative features |

---

## 37. Final Acceptance Gate

**NO IMPLEMENTATION, NO ERP MIGRATION, NO PRODUCTION PLATFORM CODE** until:

- [ ] BRD v2.1.0 approved by Engineering Lead and Product Owner
- [ ] Architecture v2.1.0 approved
- [ ] Design System v2.1.0 approved
- [ ] Invoice Architecture approved
- [ ] Migration Plan approved
- [ ] Category A Open Questions (OQ1–OQ4) formally resolved

---
*End of BRD v2.1.0 — Awaiting formal sign-off before implementation.*
