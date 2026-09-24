# Skyra Platform — Design System & Token Specification

**Version:** 3.0.0 — Platform Governance Expansion
**Date:** September 2026
**Author:** Skyra Tech Architecture Team
**Status:** GOVERNANCE BASELINE — PENDING FORMAL APPROVAL

---

> ### CLASSIFICATION KEY
> - **`[CONFIRMED]`** — Value directly confirmed by inspection of `skyra-erp` source.
> - **`[PROPOSED]`** — Deliberate platform addition not present verbatim in ERP but consistent with ERP design language.

---

## 1. Visual Source of Truth

The Skyra Design System is derived from and must remain visually compatible with `skyra-erp`.
The ERP is the primary visual reference. This design system systematizes ERP's established
design language into reusable, platform-wide CSS custom properties.

**Platform Token Prefix Strategy:**
ERP uses `--primary`, `--card-bg`, `--text-main`, etc. (no namespace).
Platform renames these to `--skyra-primary`, `--skyra-card-bg`, `--skyra-text-main`, etc.
for global namespace safety when multiple libraries coexist.

**Consuming applications install tokens:**
```css
@import '@skyra/design-tokens/tokens.css';
@import '@skyra/design-tokens/tokens.dark.css';
```

**Zero Hard-Coded Values Rule:**
No component in Layer 2 or Layer 3 may use hard-coded color, spacing, radius, or shadow values.
All visual styles must resolve through `--skyra-*` tokens.

---

## 2. Brand Color Tokens

All confirmed from `skyra-erp/src/app/globals.css`.

| Platform Token | ERP Source | Light Value | Dark Value | Source Line |
|---|---|---|---|---|
| `--skyra-primary` | `--primary` | `#0A58CA` | `#0A58CA` | `globals.css:8` | `[CONFIRMED]` |
| `--skyra-primary-hover` | `--primary-hover` | `#0847a8` | `#0847a8` | `globals.css:9` | `[CONFIRMED]` |
| `--skyra-primary-light` | `--primary-light` | `rgba(10,88,202,0.1)` | `rgba(10,88,202,0.15)` | `globals.css:10,74` | `[CONFIRMED]` |
| `--skyra-primary-dark` | (derived) | `#0038a8` | `#0038a8` | — | `[PROPOSED]` |
| `--skyra-orange` | `--orange` | `#FF6B00` | `#FF6B00` | `globals.css:11` | `[CONFIRMED]` |
| `--skyra-orange-hover` | `--orange-hover` | `#e05e00` | `#e05e00` | `globals.css:12` | `[CONFIRMED]` |
| `--skyra-orange-light` | `--orange-light` | `rgba(255,107,0,0.1)` | `rgba(255,107,0,0.15)` | `globals.css:13,75` | `[CONFIRMED]` |
| `--skyra-cyan` | `--cyan` | `#00A3E0` | `#00A3E0` | `globals.css:14` | `[CONFIRMED]` |
| `--skyra-cyan-light` | `--cyan-light` | `rgba(0,163,224,0.1)` | `rgba(0,163,224,0.15)` | `globals.css:15,76` | `[CONFIRMED]` |
| `--skyra-navy` | `--navy` | `#002B66` | `#002B66` | `globals.css:16` | `[CONFIRMED]` |

---

## 3. Semantic Status Color Tokens

| Platform Token | ERP Source | Light Value | Dark Value | Source | Classification |
|---|---|---|---|---|---|
| `--skyra-danger` | `--danger` | `#ef4444` | `#ef4444` | `globals.css:39` | `[CONFIRMED]` |
| `--skyra-danger-hover` | (derived from ERP: `#dc2626` used in DashboardLayout) | `#dc2626` | `#dc2626` | `DashboardLayout.module.css:471` | `[CONFIRMED]` |
| `--skyra-danger-light` | `--danger-light` | `rgba(239,68,68,0.1)` | `rgba(239,68,68,0.15)` | `globals.css:40,77` | `[CONFIRMED]` |
| `--skyra-success` | `--success` | `#10b981` | `#10b981` | `globals.css:41` | `[CONFIRMED]` |
| `--skyra-success-hover` | (derived) | `#059669` | `#059669` | — | `[PROPOSED]` |
| `--skyra-success-light` | `--success-light` | `rgba(16,185,129,0.1)` | `rgba(16,185,129,0.15)` | `globals.css:42,78` | `[CONFIRMED]` |
| `--skyra-warning` | `--warning` | `#f59e0b` | `#f59e0b` | `globals.css:43` | `[CONFIRMED]` |
| `--skyra-warning-hover` | (derived) | `#d97706` | `#d97706` | — | `[PROPOSED]` |
| `--skyra-warning-light` | `--warning-light` | `rgba(245,158,11,0.1)` | `rgba(245,158,11,0.15)` | `globals.css:44` | `[CONFIRMED]` |
| `--skyra-info` | (platform addition) | `#3b82f6` | `#60a5fa` | — | `[PROPOSED]` |
| `--skyra-info-light` | (platform addition) | `rgba(59,130,246,0.1)` | `rgba(96,165,250,0.15)` | — | `[PROPOSED]` |

---

## 4. Surface and Background Tokens

| Platform Token | ERP Source | Light Value | Dark Value | Source | Classification |
|---|---|---|---|---|---|
| `--skyra-bg` | `--bg-color` | `#F4F7FC` | `#0B111E` | `globals.css:19,58` | `[CONFIRMED]` |
| `--skyra-card-bg` | `--card-bg` | `#FFFFFF` | `#151D30` | `globals.css:20,59` | `[CONFIRMED]` |
| `--skyra-sidebar-bg` | `--sidebar-bg` | `#002B66` | `#0B111E` | `globals.css:21,60` | `[CONFIRMED]` |
| `--skyra-sidebar-text` | `--sidebar-text` | `rgba(255,255,255,0.75)` | `rgba(255,255,255,0.65)` | `globals.css:22,61` | `[CONFIRMED]` |
| `--skyra-sidebar-active` | `--sidebar-active` | `rgba(255,255,255,0.12)` | `rgba(10,88,202,0.25)` | `globals.css:23,62` | `[CONFIRMED]` |
| `--skyra-elevated-bg` | (platform addition — popover/dropdown) | `#FFFFFF` | `#1E2A42` | — | `[PROPOSED]` |
| `--skyra-input-bg` | (derived from `--bg-color` in inputs) | `#F4F7FC` | `rgba(255,255,255,0.06)` | `DynamicForm.module.css:75` | `[CONFIRMED]` |
| `--skyra-overlay-bg` | (from ConfirmDialog + DashboardLayout) | `rgba(0,0,0,0.5)` | `rgba(0,0,0,0.7)` | `ConfirmDialog.tsx:62`, `DashboardLayout.module.css:394` | `[CONFIRMED]` |

---

## 5. Text Color Tokens

| Platform Token | ERP Source | Light Value | Dark Value | Source | Classification |
|---|---|---|---|---|---|
| `--skyra-text-main` | `--text-main` | `#0f172a` | `#f1f5f9` | `globals.css:26,64` | `[CONFIRMED]` |
| `--skyra-text-muted` | `--text-muted` | `#64748b` | `#94a3b8` | `globals.css:27,65` | `[CONFIRMED]` |
| `--skyra-text-subtle` | `--text-subtle` | `#94a3b8` | `#64748b` | `globals.css:28,66` | `[CONFIRMED]` |
| `--skyra-text-on-primary` | (derived — button text on solid blue) | `#ffffff` | `#ffffff` | `ui.css:59` | `[CONFIRMED]` |
| `--skyra-text-link` | (derived from `--primary`) | `#0A58CA` | `#60a5fa` | `globals.css:107` | `[CONFIRMED]` |
| `--skyra-text-disabled` | (derived from `--text-subtle`) | `#94a3b8` | `#475569` | — | `[PROPOSED]` |

---

## 6. Border Tokens

| Platform Token | ERP Source | Light Value | Dark Value | Source | Classification |
|---|---|---|---|---|---|
| `--skyra-border` | `--border-color` | `#e2e8f0` | `rgba(255,255,255,0.08)` | `globals.css:31,68` | `[CONFIRMED]` |
| `--skyra-border-focus` | `--border-focus` | `#0A58CA` | `#0A58CA` | `globals.css:32,69` | `[CONFIRMED]` |
| `--skyra-border-danger` | (derived from `--danger`) | `#ef4444` | `#ef4444` | `DynamicForm.module.css:103` | `[CONFIRMED]` |
| `--skyra-border-success` | (derived) | `#10b981` | `#10b981` | — | `[PROPOSED]` |
| `--skyra-border-strong` | (platform addition) | `#cbd5e1` | `rgba(255,255,255,0.16)` | — | `[PROPOSED]` |
| `--skyra-divider` | (derived from `border-color` in `ui.css`) | `#f1f5f9` | `rgba(255,255,255,0.05)` | — | `[PROPOSED]` |

---

## 7. Shadow Tokens

| Platform Token | ERP Source | Light Value | Dark Value | Source | Classification |
|---|---|---|---|---|---|
| `--skyra-shadow-sm` | `--shadow-sm` | `0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)` | `0 1px 3px rgba(0,0,0,0.4)` | `globals.css:33,70` | `[CONFIRMED]` |
| `--skyra-shadow-md` | `--shadow-md` | `0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)` | `0 4px 12px rgba(0,0,0,0.5)` | `globals.css:34,71` | `[CONFIRMED]` |
| `--skyra-shadow-lg` | `--shadow-lg` | `0 10px 30px rgba(0,0,0,0.10), 0 4px 10px rgba(0,0,0,0.05)` | `0 10px 30px rgba(0,0,0,0.6)` | `globals.css:35,72` | `[CONFIRMED]` |
| `--skyra-shadow-glow` | `--shadow-glow` | `0 0 0 3px rgba(10,88,202,0.15)` | `0 0 0 3px rgba(10,88,202,0.15)` | `globals.css:36` | `[CONFIRMED]` |
| `--skyra-shadow-danger-glow` | (derived from error ring in DynamicForm) | `0 0 0 3px rgba(239,68,68,0.10)` | `0 0 0 3px rgba(239,68,68,0.12)` | `DynamicForm.module.css:104` | `[CONFIRMED]` |
| `--skyra-shadow-btn-primary` | (from `ui.css` button) | `0 2px 8px rgba(10,88,202,0.25)` | `0 2px 8px rgba(10,88,202,0.25)` | `ui.css:61` | `[CONFIRMED]` |
| `--skyra-shadow-btn-orange` | (from `ui.css` button) | `0 2px 8px rgba(255,107,0,0.25)` | `0 2px 8px rgba(255,107,0,0.25)` | `ui.css:73` | `[CONFIRMED]` |

---

## 8. Border Radius Tokens

| Platform Token | ERP Source | Value | Source | Classification |
|---|---|---|---|---|
| `--skyra-radius-sm` | `--radius-sm` | `6px` | `globals.css:47` | `[CONFIRMED]` |
| `--skyra-radius-md` | `--radius-md` | `10px` | `globals.css:48` | `[CONFIRMED]` |
| `--skyra-radius-lg` | `--radius-lg` | `14px` | `globals.css:49` | `[CONFIRMED]` |
| `--skyra-radius-xl` | `--radius-xl` | `20px` | `globals.css:50` | `[CONFIRMED]` |
| `--skyra-radius-full` | (derived from badge `border-radius: 999px`) | `9999px` | `ui.css:266` | `[CONFIRMED]` |

---

## 9. Typography Specification

### Font Stacks

| Platform Token | ERP Source | Value | Source | Classification |
|---|---|---|---|---|
| `--skyra-font-body` | `'Inter'` on `body` | `'Inter', -apple-system, BlinkMacSystemFont, sans-serif` | `globals.css:98` | `[CONFIRMED]` |
| `--skyra-font-heading` | `'Outfit'` on `.page-title`, `.fieldsetTitle`, etc. | `'Outfit', -apple-system, BlinkMacSystemFont, sans-serif` | `ui.css:31` | `[CONFIRMED]` |
| `--skyra-font-mono` | (platform addition — for financial figures) | `'JetBrains Mono', 'Fira Code', monospace` | — | `[PROPOSED]` |

**Loading:** Consuming applications load Google Fonts in their root layout:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```
Confirmed from `globals.css:1`.

### Confirmed Font Sizes (from ERP source inspection)

| Usage | Confirmed ERP Value | Source |
|---|---|---|
| Nav group label | `0.7rem` | `DashboardLayout.module.css:221` |
| Badge (standard) | `0.75rem` | `ui.css:267` |
| Form label | `0.82rem` | `ui.css:213` |
| Table header | `0.72rem` uppercase | `Table.module.css:212` |
| Form input | `0.875rem` | `DynamicForm.module.css:78` |
| Body / table data | `0.875rem` | `Table.module.css:252` |
| Nav item | `0.9rem` | `DashboardLayout.module.css:248` |
| Page title | `1.75rem` Outfit 700 | `ui.css:32-33` |
| Logo text | `1.25rem` Outfit 700 | `DashboardLayout.module.css:66` |

---

## 10. Invoice Status Badge Token Map

Confirmed from `skyra-erp/src/components/invoices/StatusBadge.tsx`:

| Status | Background | Text Color | Border | Source Line |
|---|---|---|---|---|
| `DRAFT` | `var(--border-color)` | `var(--text-muted)` | `var(--border-color)` | `StatusBadge.tsx:7` |
| `SENT` | `var(--primary-light)` | `var(--primary)` | `var(--primary)` | `StatusBadge.tsx:8` |
| `VIEWED` | `#eff6ff` | `#1d4ed8` | `#bfdbfe` | `StatusBadge.tsx:9` |
| `PARTIAL` | `var(--orange-light)` | `var(--orange)` | `var(--orange)` | `StatusBadge.tsx:10` |
| `PAID` | `var(--success-light)` | `var(--success)` | `var(--success)` | `StatusBadge.tsx:11` |
| `OVERDUE` | `var(--danger-light)` | `var(--danger)` | `var(--danger)` | `StatusBadge.tsx:12` |
| `VOIDED` | `#f3f4f6` | `#6b7280` | `#e5e7eb` | `StatusBadge.tsx:13` |

`StatusBadge` sizes (confirmed): `sm` (`0.68rem`, `0.12rem 0.45rem`), `md` (`0.75rem`, `0.2rem 0.65rem`), `lg` (`0.82rem`, `0.3rem 0.9rem`, `font-weight: 700`, border shows). Source: `StatusBadge.tsx:26-28`.

---

## 11. Motion and Easing Tokens

| Platform Token | ERP Source | Value | Source | Classification |
|---|---|---|---|---|
| `--skyra-duration-fast` | `0.2s ease` on interactions | `120ms` | `ui.css:52` | `[CONFIRMED]` |
| `--skyra-duration-normal` | Sidebar and dropdown animations | `200ms` | `DashboardLayout.module.css:182-184` | `[CONFIRMED]` |
| `--skyra-duration-slow` | Sidebar slide transition | `280ms` | `DashboardLayout.module.css:23` | `[CONFIRMED]` |
| `--skyra-ease-default` | Sidebar cubic-bezier | `cubic-bezier(0.4, 0, 0.2, 1)` | `DashboardLayout.module.css:24` | `[CONFIRMED]` |
| `--skyra-ease-out` | Dropdown enter (`dropdownIn`) | `cubic-bezier(0, 0, 0.2, 1)` | — | `[PROPOSED]` |
| `--skyra-body-transition` | Body theme transition | `background-color 0.3s ease, color 0.3s ease` | `globals.css:103` | `[CONFIRMED]` |

**Reduced Motion Guarantee:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 12. Spacing Scale

All spacing tokens are `[PROPOSED]` — derived from observed ERP padding/gap patterns but
not defined as explicit ERP CSS custom properties.

| Token | Value | Observed ERP Usage |
|---|---|---|
| `--skyra-space-xs` | `4px` | Badge padding elements, label gaps (`ui.css:265`) |
| `--skyra-space-sm` | `8px` | Nav item padding components |
| `--skyra-space-md` | `16px` | Standard container padding |
| `--skyra-space-lg` | `24px` | Card padding (`ui.css:12`), fieldset padding |
| `--skyra-space-xl` | `28px` | Page content padding (`1.75rem`) |
| `--skyra-space-2xl` | `32px` | Auth card padding (`2.5rem ≈ 40px`) |
| `--skyra-space-3xl` | `48px` | Major section gaps |

---

## 13. Responsive Breakpoint Tokens

| Token | Value | Usage | ERP Confirmed |
|---|---|---|---|
| `--skyra-bp-xs` | `320px` | Minimum supported mobile | — |
| `--skyra-bp-sm` | `640px` | Form 1-col breakpoint | `DynamicForm.module.css:270` [CONFIRMED] |
| `--skyra-bp-md` | `768px` | Sidebar mobile breakpoint | `DashboardLayout.module.css:582` [CONFIRMED] |
| `--skyra-bp-lg` | `1024px` | Tablet landscape / small desktop | — |
| `--skyra-bp-xl` | `1280px` | Standard desktop | — |
| `--skyra-bp-2xl` | `1536px` | Wide desktop | — |

---

## 14. Future Mobile Token Architecture [D]

CSS custom properties cannot be consumed directly by React Native.
A future typed JS/TS token representation is classified `[D] FUTURE` and
must not be implemented until the mobile architecture is formally approved (OQ10, OQ11).

```
Canonical Skyra Design Semantics (meaning, e.g., "primary brand color")
                    ↓
         Platform Token Source
           ↙               ↘
    Web CSS tokens        JS/TS token object [D] FUTURE
    --skyra-primary       { skyra: { primary: '#0A58CA' } }
                                    ↓
                           React Native StyleSheet
```

---

## 15. Dashboard Design System Browser Requirements

The dashboard `design-system/` section must:

1. Present all tokens in searchable cards with: Token Name, ERP Source Variable, ERP Source File+Line, Light Value, Dark Value, Classification (`[CONFIRMED]` / `[PROPOSED]`), Semantic Purpose, Live Swatch, Copy-to-Clipboard.
2. Show side-by-side ERP reference vs platform token for `[B]` extractions.
3. Include a live Light/Dark mode toggle.
4. Provide a Breakpoint Visualizer showing component behavior at 320, 375, 640, 768, 1024, 1280, 1536px.
5. Show typography scale with font-size, weight, line-height, and usage examples.
6. Show motion tokens with animated live previews (subject to `prefers-reduced-motion`).

---

*End of Design System & Token Specification v2.1.0 — Awaiting formal approval.*


---

# Platform Governance Expansion — v3.0.0

> This section supersedes conflicting planning assumptions in earlier v2.1.0 material where necessary. It does not remove existing component or domain requirements; it establishes the operating standards required for Skyra Platform to function as a professional, reusable internal platform for Skyra Tech.

## Platform Mission

Skyra Platform is the reusable engineering foundation for Skyra Tech applications. It provides reusable UI, interaction patterns, design semantics, validation, utilities, application-shell infrastructure, accessibility, responsive behavior, documentation, testing, and release governance.

**Core rule:** Build reusable technology once in Skyra Platform and consume it across Skyra applications. Applications own their business/domain logic, persistence, authentication, routing, product workflows, and application-specific behavior.

## Mandatory Platform Standards

1. **Version-controlled platform APIs** — packages and public APIs follow explicit lifecycle states: Experimental → Stable → Deprecated → Removed.
2. **Documented public APIs** — every stable reusable package/component has usage, API, accessibility, responsive, and migration documentation in the Platform Dashboard.
3. **Dashboard as engineering workbench** — the Dashboard is the authoritative interactive documentation and QA surface, not a product/customer dashboard.
4. **Style isolation** — Platform must not inject application-global styling that can unexpectedly alter consuming applications. Component styles are scoped/component-local or explicitly opt-in. Design tokens remain available as a controlled contract.
5. **No global element styling leakage** — Platform packages must not impose selectors such as `body`, `button`, `input`, `h1`, or `*` on consuming applications unless a separately documented, explicitly imported reset/base package is introduced in a future approved change.
6. **Responsive by contract** — reusable elements must remain usable at 320px, 375px, 640px, 768px, 1024px, 1280px, and 1536px unless a component is explicitly documented as viewport-specific.
7. **Accessibility by contract** — keyboard behavior, focus management, semantic structure, ARIA, reduced motion, touch targets, and axe validation are release requirements.
8. **Security by boundary** — reusable packages must not contain credentials, application persistence, auth/session implementation, secret access, or uncontrolled network calls.
9. **Dependency discipline** — lower-level packages cannot import higher-level packages; application packages cannot leak into foundational packages; forbidden dependency rules are CI-enforced.
10. **Strict TypeScript** — public APIs contain no `any`; new `@ts-ignore` and `@ts-nocheck` are prohibited.
11. **Real implementation showcase** — Dashboard examples must import the actual compiled workspace package. No duplicated showcase implementations or mock component copies.
12. **Frozen regression contracts** — completed package behavior must remain protected by tests and regression gates when later phases are implemented.

## Platform Quality Gate

A package or component is not considered release-ready until architecture, API, type safety, tests, accessibility, responsive behavior, light/dark behavior, reduced-motion behavior, documentation, Dashboard integration, and security/package-boundary checks pass.

## Release Lifecycle

Every public package/component must have a lifecycle state, release version, changelog entry, migration guidance for breaking changes, and a documented deprecation path where applicable.

## Documentation Lifecycle

Documentation is versioned with the implementation. The Dashboard must expose the current package API and examples, while repository documentation records architecture, governance, contribution rules, release policy, security, accessibility, responsive standards, and migration guidance.

## Future-Proofing Rule

A capability belongs in Skyra Platform when it is genuinely reusable across multiple Skyra applications or is foundational infrastructure. Product-specific behavior remains in the consuming application. The Platform must not become a shared dumping ground for unrelated business logic.

## 14. Styling Isolation & Consumer Safety

### 14.1 No Global Styling Leakage

The Skyra Design System is a token and component styling system, not an application-wide CSS override system. Platform packages must not silently modify consumer application elements.

Prohibited by default:

```css
body { ... }
* { ... }
button { ... }
input { ... }
h1, h2, h3 { ... }
```

Allowed:

- `--skyra-*` semantic CSS custom properties.
- `.dark` theme contract where explicitly established by the consuming application.
- Component-scoped classes/selectors.
- Explicitly opt-in base/reset styles only if a future package is separately approved.

### 14.2 Token Contract

Tokens remain canonical and namespaced with `--skyra-*`. Token values describe design semantics; they do not dictate an application's global layout. Components must resolve visual values through the token contract rather than duplicating arbitrary values.

### 14.3 Responsive Contract

Every component must document its behavior across 320, 375, 640, 768, 1024, 1280, and 1536px. Responsive behavior includes usability, not only visual fit: touch targets, overflow, focus, readable content, dialog sizing, table behavior, and navigation behavior must remain functional.

### 14.4 Theme and Motion Contract

Light/dark behavior must use the established token system. Components must respect `prefers-reduced-motion` and avoid requiring motion for comprehension or interaction.

### 14.5 Design System QA

Design-system releases require component-level visual QA, accessibility checks, responsive checks, and regression protection. The Dashboard is the primary interactive inspection surface.
