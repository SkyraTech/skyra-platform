# Skyra Platform — Component Catalog & Standards

**Version:** 2.1.0 — Final Pre-Approval Specification
**Date:** September 2026
**Author:** Skyra Tech Architecture Team
**Status:** PENDING APPROVAL — DO NOT IMPLEMENT

---

## 1. Governing Principles

1. **ERP Visual Fidelity First** — Every platform component must first reproduce the ERP's visual appearance exactly before adding enhancements.
2. **Mobile-First** — All components define explicit mobile behavior. Desktop is an expansion.
3. **Real Package Rendering** — Dashboard showcase pages must import actual compiled `@skyra/*` packages. No mocked implementations.
4. **StatusBadge Single Ownership** — `@skyra/ui` owns the generic `StatusBadge`. `@skyra/invoice` owns `InvoiceStatusBadge` (a configured wrapper). No duplication.

---

## 2. Component Catalog Index

| Component | Package | Classification | ERP Source |
|---|---|---|---|
| Button | `@skyra/ui` | `[B]` EXTRACTION | `ui.css:41-156` |
| Input | `@skyra/ui` | `[B]` EXTRACTION | `ui.css:161-231` |
| Textarea | `@skyra/ui` | `[B]` EXTRACTION | `DynamicForm.module.css:107-110` |
| Native Select | `@skyra/ui` | `[B]` EXTRACTION | `DynamicForm.module.css:112-118` |
| CustomSelect | `@skyra/ui` | `[B]` EXTRACTION | `CustomSelect.tsx` |
| Checkbox | `@skyra/ui` | `[B]` EXTRACTION | `DynamicForm.module.css:133-156` |
| StatusBadge (generic) | `@skyra/ui` | `[B]` EXTRACTION + `[C]` ENHANCEMENT | `StatusBadge.tsx` + generalized |
| Badge | `@skyra/ui` | `[B]` EXTRACTION | `ui.css:261-272` |
| Card | `@skyra/ui` | `[B]` EXTRACTION | `ui.css:8-16` |
| Alert | `@skyra/ui` | `[B]` EXTRACTION | `ui.css:277-286` |
| Spinner | `@skyra/ui` | `[B]` EXTRACTION | `ui.css:291-303` |
| Divider | `@skyra/ui` | `[B]` EXTRACTION | `ui.css:242-256` |
| PhoneInputField | `@skyra/ui` | `[B]` EXTRACTION | `PhoneInputField.tsx` |
| LogoUploader | `@skyra/ui` | `[B]` EXTRACTION (adapter) | `organizations/LogoUploader.tsx` |
| DynamicDataTable | `@skyra/data-table` | `[B]` EXTRACTION + `[C]` ENHANCEMENT | `DynamicDataTable.tsx`, `Table.module.css` |
| DynamicForm | `@skyra/dynamic-form` | `[B]` EXTRACTION + `[C]` ENHANCEMENT | `DynamicForm.tsx`, `DynamicForm.module.css` |
| ConfirmDialog | `@skyra/dialogs` | `[B]` EXTRACTION + `[C]` ENHANCEMENT | `ConfirmDialog.tsx` |
| Modal | `@skyra/dialogs` | `[C]` ENHANCEMENT | Standardizes ERP ad-hoc modals |
| Drawer | `@skyra/dialogs` | `[C]` ENHANCEMENT | Standardizes ERP ad-hoc drawers |
| InvoiceStatusBadge | `@skyra/invoice/components` | `[B]` EXTRACTION | `StatusBadge.tsx` + INVOICE_STATUS_MAP |

---

## 3. Button (`@skyra/ui`) — Detailed Specification

**ERP Source:** `ui.css:41-156`

### Variants (Confirmed from ERP)

| Variant | ERP Class | Visual Style | ERP Source |
|---|---|---|---|
| `primary` | `.btn-primary` | Solid `#0A58CA` bg, white text, `box-shadow: 0 2px 8px rgba(10,88,202,0.25)`, `-1px Y hover lift | `ui.css:58-68` [A] |
| `orange` | `.btn-orange` | Solid `#FF6B00` bg, white text, `box-shadow: 0 2px 8px rgba(255,107,0,0.25)` | `ui.css:70-78` [A] |
| `outline` | `.btn-outline` | Transparent bg, `1.5px solid var(--primary)`, blue text, `primary-light` hover bg | `ui.css:80-87` [A] |
| `ghost` | `.btn-ghost` | Transparent bg, `1.5px solid var(--border-color)`, muted text | `ui.css:89-98` [A] |
| `destructive` | (derived) | Solid `#ef4444` bg, white text | — [C] |
| `link` | (derived) | No bg, no border, underline on hover | — [C] |
| `icon-only` | `.btn-oauth-icon` | 48×48px square, `1.5px solid border`, `radius-md`, center-aligned icon | `ui.css:124-141` [A] |

### Sizes

| Size | Height | Padding | Font Size | Confirmation |
|---|---|---|---|---|
| `sm` | 32px | `0.4rem 0.875rem` | `0.8rem` | [C] enhancement — ERP has one standard `.btn` size |
| `md` | ~40px | `0.7rem 1.4rem` | `0.9rem` | `ui.css:46-49` [A] |
| `lg` | 48px | `0.9rem 1.75rem` | `1rem` | [C] enhancement |

### States (Confirmed)
- **Hover**: `translateY(-1px)` lift + shadow intensification — `ui.css:63-66` `[A]`
- **Active**: `translateY(0)` — `ui.css:68` `[A]`
- **Disabled**: `opacity: 0.55; cursor: not-allowed; transform: none` — `ui.css:149-156` `[A]`
- **Loading**: Spinner rendered, children hidden, `aria-busy="true"` — `[C]` enhancement
- **Focus-visible**: `--skyra-shadow-glow` = `0 0 0 3px rgba(10,88,202,0.15)` — `[C]` enhancement

### Mobile Behavior
- `fullWidth` prop: `width: 100%` — confirmed in ERP as `.btn-full` (`ui.css:147`)
- Touch target: minimum 40px height (default `md` size meets this via `0.7rem` vertical padding)
- `icon-only` at 48×48px already meets 44px minimum touch target

### TypeScript Contract
```typescript
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'orange' | 'outline' | 'ghost' | 'destructive' | 'link';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
```

---

## 4. Input (`@skyra/ui`) — Detailed Specification

**ERP Source:** `ui.css:161-231`, `DynamicForm.module.css:71-131`

### Variants and States (Confirmed)

| State | Visual | ERP Source |
|---|---|---|
| Default | `1.5px solid var(--border-color)`, `var(--bg-color)` bg | `DynamicForm.module.css:74-84` [A] |
| Focus | `border-color: var(--primary)`, `box-shadow: 0 0 0 3px rgba(10,88,202,0.12)` | `DynamicForm.module.css:93-98` [A] |
| Error | `border-color: var(--danger)`, `box-shadow: 0 0 0 3px rgba(239,68,68,0.10)` | `DynamicForm.module.css:100-105` [A] |
| Disabled | `opacity: 0.55; cursor: not-allowed` | `ui.css:149-156` [A] |
| Placeholder | `color: var(--text-subtle)` | `DynamicForm.module.css:88-91` [A] |

### Mobile Behavior
- Full width (`width: 100%`) — confirmed `DynamicForm.module.css:81`
- Padding `0.65rem 0.875rem` ≈ 38px height — adequate touch target

---

## 5. DynamicDataTable (`@skyra/data-table`) — Detailed Specification

**ERP Source:** `DynamicDataTable.tsx`, `Table.module.css`

### Capability Classification Table

| Capability | Classification | ERP Source |
|---|---|---|
| Generic `Column<T>` definition | `[A]` EXISTING | `DynamicDataTable.tsx` |
| Client-side search | `[A]` EXISTING | `DynamicDataTable.tsx` |
| Client-side sort | `[A]` EXISTING | `DynamicDataTable.tsx` |
| Client-side pagination | `[A]` EXISTING | `DynamicDataTable.tsx` |
| Column visibility picker | `[A]` EXISTING | `Table.module.css:142-189` |
| Skeleton loading (5 rows shimmer) | `[A]` EXISTING | `Table.module.css:341-352` |
| Empty state display | `[A]` EXISTING | `Table.module.css:320-338` |
| Row actions (View/Edit/Delete) | `[A]` EXISTING | `Table.module.css:286-318` |
| Primary action CTA (gradient button) | `[A]` EXISTING | `Table.module.css:120-140` |
| Horizontal overflow scroll (touch) | `[A]` EXISTING | `Table.module.css:192-195` |
| Server-side pagination | `[C]` ENHANCEMENT | — |
| Server-side search/filter callbacks | `[C]` ENHANCEMENT | — |
| Row selection with checkboxes | `[C]` ENHANCEMENT | — |
| Bulk actions toolbar | `[C]` ENHANCEMENT | — |
| Error state with retry | `[C]` ENHANCEMENT | — |
| Cell type helpers (currency, date, badge) | `[C]` ENHANCEMENT | — |
| Mobile stacked row presentation | `[C]` ENHANCEMENT | — |
| Export to CSV/Excel | `[D]` FUTURE | — |
| Row expansion / sub-rows | `[D]` FUTURE | — |

### Mobile Architecture Requirement

```typescript
export interface DynamicDataTableProps<T extends { id: string }> {
  // ... all existing props ...
  mobileStrategy?: 'scroll' | 'priority-columns' | 'stacked-cards'; // [C]
  mobilePriorityColumns?: string[]; // columns to show on mobile when strategy='priority-columns' [C]
}
```

Confirmed ERP mobile behavior: `overflow-x: auto; -webkit-overflow-scrolling: touch` (`Table.module.css:192-195`). This is the baseline `'scroll'` strategy.

### 9 Showcase Designs (Dashboard)

1. **Basic Table** — Standard 5-column listing, search, and pagination
2. **Finance Table** — Currency formatting, status badge cells (PAID, PARTIAL, OVERDUE)
3. **CRM Table** — Avatar initials, phone formatting, inline actions
4. **Selectable Table** — Header checkbox, row checkboxes, active highlight
5. **Bulk Actions Table** — Floating batch toolbar `"3 items selected"`
6. **Server-Side Table** — Debounced search + server-side pagination callbacks
7. **Loading State** — 5 rows of shimmer skeletons
8. **Empty State** — Centered illustration + CTA
9. **Error State** — Danger banner + retry button

---

## 6. DynamicForm (`@skyra/dynamic-form`) — Detailed Specification

**ERP Source:** `DynamicForm.tsx`, `DynamicForm.module.css`

### Confirmed Mobile Behavior `[A]`

```css
@media (max-width: 640px) {
  .fieldsetBody {
    grid-template-columns: 1fr;   /* collapses from 2-col to 1-col */
  }
}
```
Source: `DynamicForm.module.css:270-273`

### Field Type Classification Table

| Field Type | Classification | ERP Confirmation |
|---|---|---|
| text, email, tel, url, number | `[A]` EXISTING | `DynamicForm.tsx` |
| select (native) | `[A]` EXISTING | `DynamicForm.module.css:112-118` |
| checkbox | `[A]` EXISTING | `DynamicForm.module.css:133-156` |
| textarea | `[A]` EXISTING | `DynamicForm.module.css:107-110` |
| custom-select | `[A]` EXISTING | `CustomSelect.tsx` |
| date | `[C]` ENHANCEMENT | — |
| file | `[C]` ENHANCEMENT | LogoUploader adapted |
| phone | `[C]` ENHANCEMENT | PhoneInputField adapted |
| radio | `[C]` ENHANCEMENT | — |
| custom (render prop) | `[C]` ENHANCEMENT | — |

### Confirmed Visual Patterns `[A]`

- Fieldset card: `border-radius: var(--radius-xl)`, `overflow: hidden` — `DynamicForm.module.css:14-19`
- Fieldset header: `border-bottom` + `bg-color` background — `DynamicForm.module.css:21-25`
- Fieldset title: `Outfit` font, `0.95rem`, `font-weight: 600` — `DynamicForm.module.css:27-32`
- 2-column grid: `grid-template-columns: repeat(2, 1fr); gap: 1.25rem` — `DynamicForm.module.css:43-45`
- Danger Zone: `danger-light` bg, `1px solid var(--danger)`, `radius-xl` — `DynamicForm.module.css:159-163`
- Submit button gradient: `linear-gradient(135deg, var(--primary) 0%, #0847a8 100%)` — `DynamicForm.module.css:231`

### 5 Showcase Workflows (Dashboard)

1. **Simple Form** — Single-column contact/login form
2. **Business Two-Column Form** — Multi-section entity creation (Client/Organization)
3. **Validation and Error Form** — All error states, required markers
4. **Conditional Logic Form** — Dynamic field visibility via `dependsOn`
5. **Settings Form with Danger Zone** — Account settings + red destructive action zone

---

## 7. ConfirmDialog (`@skyra/dialogs`) — Detailed Specification

**ERP Source:** `ConfirmDialog.tsx`

### Confirmed ERP Visual Patterns `[A]`

| Visual Property | Value | Source |
|---|---|---|
| Width | `440px; max-width: calc(100vw - 2rem)` | `ConfirmDialog.tsx:78-79` |
| Border radius | `var(--radius-lg)` = 14px | `ConfirmDialog.tsx:81` |
| Padding | `2rem` | `ConfirmDialog.tsx:83` |
| z-index | 200 (dialog), 199 (backdrop) | `ConfirmDialog.tsx:64,84` |
| Backdrop | `rgba(0,0,0,0.5) + backdropFilter: blur(2px)` | `ConfirmDialog.tsx:62-63` |
| Icon container | 38×38px circle, variant-colored bg | `ConfirmDialog.tsx:91-101` |
| Action buttons | Equal flex `1`, `radius-md`, `0.65rem` padding | `ConfirmDialog.tsx:127-177` |
| Body text | `0.875rem`, `text-muted`, `lineHeight: 1.65` | `ConfirmDialog.tsx:116-118` |

### Platform Enhancements `[C]`

- Focus trapping (Tab cycles within dialog)
- Escape key dismissal
- Focus restoration to trigger element on close
- Smooth enter/exit animation (opacity + scale)
- Custom icon slot prop

### Mobile Behavior
- `maxWidth: calc(100vw - 2rem)` already confirmed in ERP `[A]`
- On very small screens (<375px), action buttons stack vertically `[C]`

---

## 8. Modal (`@skyra/dialogs`) — Specification

**Classification:** `[C]` ENHANCEMENT — standardizes ERP's ad-hoc overlay implementations

### Sizes

| Size | Width | Use Case |
|---|---|---|
| `sm` | 400px | Confirmations, quick prompts |
| `md` | 520px | Standard forms, payment recording |
| `lg` | 720px | Complex multi-column forms |
| `xl` | 960px | Rich data previews |
| `full` | 95vw / 95vh | Document previews |

All sizes: `maxWidth: calc(100vw - 2rem)` on mobile.

---

## 9. Drawer (`@skyra/dialogs`) — Specification

**Classification:** `[C]` ENHANCEMENT — standardizes ERP's `PaymentDrawer`, `TemplateDrawer`, `OrganizationDrawer`

| Variant | Width | Mobile Behavior |
|---|---|---|
| `right` (default) | 520px | Expands to `100vw` on `<640px` |
| `left` | 520px | Expands to `100vw` on `<640px` |

Drawer use cases:
- `detail` — Read-only entity detail
- `edit` — Entity edit form
- `filter` — Filter/search panel
- `payment` — Payment recording workflow

---

*End of Component Catalog & Standards v2.1.0 — Awaiting formal approval.*
