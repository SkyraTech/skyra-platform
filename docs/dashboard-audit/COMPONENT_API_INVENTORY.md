# Skyra Platform — Component API Inventory
**Document ID:** `COMPONENT-API-INVENTORY`  
**Milestone:** `SKYRA-PLATFORM-DASHBOARD-001`  
**Audit Date:** 2026-11-01  
**Status:** Authoritative Local Source-Derived Specification  

---

## 1. Inventory Overview

This document provides the canonical API contract for every package and Web Component in `skyra-platform`. All properties, attributes, events, slots, methods, and public exports are extracted directly from TypeScript declarations and source code implementations.

Total Packages Audited: **31**  
Total Custom Element Tags: **48** (including backwards-compatibility aliases)  
Visual Components: **27**  
Utility Packages: **3**  
Design Foundation Packages: **1**  

---

## 2. Component-by-Component API Inventory

### 1. Accordion (`@skyra-tech-platform/accordion`)
- **Version:** `0.1.1`
- **Exports:** `SkyraAccordionElement`, `SkyraAccordionItemElement`
- **Custom Elements:**
  - Canonical: `<skyra-tech-accordion>`, `<skyra-tech-accordion-item>`
  - Alias: `<skyra-accordion>`, `<skyra-accordion-item>`
- **CSS:** Shadow DOM embedded (`accordionStyles`, `itemStyles`)
- **Attributes & Properties:**
  - `<skyra-tech-accordion>`:
    - `multiple` (boolean): Allows multiple items to expand simultaneously. Default `false`.
    - `variant` (string): `default` | `bordered` | `separated`.
  - `<skyra-tech-accordion-item>`:
    - `open` (boolean): Whether item is expanded. Reflected.
    - `disabled` (boolean): Whether item is disabled. Reflected.
    - `header` (string): Accordion trigger text.
- **Events:**
  - `change` / `accordion-change`: Emitted when item expansion toggles. Detail: `{ open: boolean, item: HTMLElement }`.
- **Slots:**
  - `<skyra-tech-accordion-item>`:
    - `header`: Custom header trigger content.
    - `(default)`: Collapsible body content.
- **Methods:**
  - `toggle()`: Toggles expanded state.
  - `expand()`: Opens item.
  - `collapse()`: Closes item.
- **A11y:** `aria-expanded`, `aria-controls`, `aria-disabled`, `role="region"`, `role="button"`. Keyboard: `Enter`, `Space`, `ArrowUp`, `ArrowDown`, `Home`, `End`.

---

### 2. App Shell (`@skyra-tech-platform/app-shell`)
- **Version:** `0.1.0`
- **Exports:** `SkyraAppShell`, `registerAppShell`
- **Custom Elements:** `<skyra-tech-app-shell>`
- **CSS:** `@skyra-tech-platform/app-shell/styles.css`
- **Attributes & Properties:**
  - `collapsed` (boolean): Sidebar collapsed state (72px). Reflected.
  - `mobileOpen` (boolean): Mobile drawer visibility. Reflected.
  - `breakpoint` (number): Viewport threshold (default `768`).
- **Events:**
  - `collapse`: Fired when sidebar toggles. Detail: `{ collapsed: boolean }`.
  - `mobile-toggle`: Fired when mobile drawer toggles. Detail: `{ open: boolean }`.
- **Slots:**
  - `sidebar`: Navigation container.
  - `header`: Top application bar.
  - `(default)`: Main content area.
- **Methods:**
  - `toggle()`: Toggles sidebar collapsed state.
  - `toggleMobile()`: Toggles mobile drawer.
- **A11y:** Landmarks: `<header>`, `<aside>`, `<main>`. Mobile backdrop click dismissal. `Escape` key closes mobile drawer.

---

### 3. Badge (`@skyra-tech-platform/badge`)
- **Version:** `0.1.0`
- **Exports:** `SkyraTechBadge`, `defineSkyraTechBadge`, `badgeStyles`
- **Custom Elements:** `<skyra-tech-badge>`
- **CSS:** Shadow DOM embedded (`badgeStyles`)
- **Attributes & Properties:**
  - `variant` (string): `primary` | `secondary` | `neutral` | `success` | `warning` | `danger` | `info` | `orange` | `cyan` | `purple`. Default `neutral`.
  - `size` (string): `sm` (11px, 20px h) | `md` (12px, 24px h). Default `sm`.
  - `dot` (boolean): Shows 6px status indicator circle. Default `false`.
- **Events:** None.
- **Slots:**
  - `(default)`: Badge text content.
- **Methods:** None.
- **Theme Support:** Fully mapped to `--skyra-*` tokens (`--skyra-primary-light`, `--skyra-success-light`, etc.). High contrast text in light and dark mode.
- **A11y:** Inline element. If convey status only through color/dot, requires `aria-label` or visually hidden status description.

---

### 4. Button (`@skyra-tech-platform/button`)
- **Version:** `0.1.1`
- **Exports:** `SkyraTechButton`, `defineSkyraTechButton`, `buttonStyles`
- **Custom Elements:** `<skyra-tech-button>`
- **CSS:** Shadow DOM embedded (`buttonStyles`)
- **Attributes & Properties:**
  - `variant` (string): `primary` | `secondary` | `outline` | `ghost` | `danger`. Default `primary`.
  - `size` (string): `sm` (32px h) | `md` (40px h) | `lg` (48px h). Default `md`.
  - `disabled` (boolean): Disables click and interaction.
  - `loading` (boolean): Shows spinner, preserves dimensions, disables interaction.
  - `type` (string): `button` | `submit` | `reset`.
- **Events:** Native `click` suppressed when `disabled` or `loading`.
- **Slots:**
  - `prefix`: Icon/content before label.
  - `(default)`: Button label.
  - `suffix`: Icon/content after label.
- **Methods:**
  - `focus()`: Focuses internal button.
  - `blur()`: Blurs internal button.
- **A11y:** `aria-disabled`, `aria-busy` when loading. Focus ring: `3px var(--skyra-focus-ring)`. Keyboard: `Enter`, `Space`.

---

### 5. Checkbox (`@skyra-tech-platform/checkbox`)
- **Version:** `0.1.0`
- **Exports:** `SkyraTechCheckbox`, `defineSkyraTechCheckbox`, `checkboxStyles`
- **Custom Elements:** `<skyra-tech-checkbox>`
- **Attributes & Properties:**
  - `checked` (boolean): Checked state. Reflected.
  - `indeterminate` (boolean): Indeterminate visual state. Reflected.
  - `disabled` (boolean): Disabled state.
  - `required` (boolean): Required for form submission.
  - `name` (string): Form submission name.
  - `value` (string): Form value (default `'on'`).
  - `label` (string): Label text.
  - `error` (string): Error text message.
- **Events:**
  - `change`: Emitted when checked state changes. Detail: `{ checked: boolean, indeterminate: boolean }`.
- **Slots:**
  - `(default)`: Label content.
- **A11y:** `role="checkbox"`, `aria-checked` (`true`, `false`, `mixed`). Keyboard: `Space` toggles.

---

### 6. Collapsible (`@skyra-tech-platform/collapsible`)
- **Version:** `0.1.1`
- **Exports:** `SkyraCollapsibleElement`
- **Custom Elements:**
  - Canonical: `<skyra-tech-collapsible>`
  - Alias: `<skyra-collapsible>`
- **Attributes & Properties:**
  - `open` (boolean): Expanded state. Reflected.
  - `disabled` (boolean): Disables trigger.
- **Events:**
  - `open`: Fired when opened.
  - `close`: Fired when closed.
  - `toggle`: Fired on either state change. Detail: `{ open: boolean }`.
- **Slots:**
  - `trigger`: Clickable element to toggle.
  - `(default)`: Expandable content.
- **Methods:** `show()`, `hide()`, `toggle()`.
- **A11y:** `aria-expanded`, `aria-hidden` on body.

---

### 7. Command Palette (`@skyra-tech-platform/command-palette`)
- **Version:** `0.1.0`
- **Exports:** `SkyraCommandPaletteElement`, `SkyraTechCommandPaletteElement`, types `CommandItem`
- **Custom Elements:** `<skyra-tech-command-palette>`, `<skyra-command-palette>`
- **Attributes & Properties:**
  - `open` (boolean): Palette modal open state.
  - `placeholder` (string): Search input prompt.
  - `empty-text` (string): No results text.
  - `items` (property, `CommandItem[]`): Array of searchable actions.
- **Events:**
  - `select`: Emitted on item execution. Detail: `{ item: CommandItem }`.
  - `open`: Fired when opened.
  - `close`: Fired when dismissed.
- **A11y:** `role="dialog"`, `aria-modal="true"`, focus trapping, roving tabindex on list items, `Escape` dismissal.

---

### 8. Context Menu (`@skyra-tech-platform/context-menu`)
- **Version:** `0.1.0`
- **Exports:** `SkyraContextMenuElement`, `SkyraTechContextMenuElement`, item/group/separator classes
- **Custom Elements:**
  - Menu: `<skyra-tech-context-menu>`, `<skyra-context-menu>`
  - Item: `<skyra-tech-context-menu-item>`, `<skyra-context-menu-item>`
  - Separator: `<skyra-tech-context-menu-separator>`, `<skyra-context-menu-separator>`
  - Group: `<skyra-tech-context-menu-group>`, `<skyra-context-menu-group>`
- **Attributes & Properties:**
  - `open` (boolean): Visibility state.
  - `target` (string): CSS selector for activation element.
  - `x`, `y` (number): Coordinates.
- **Events:**
  - `select`: Fired when menu item is clicked. Detail: `{ value: string }`.
  - `open`, `close`: Overlay lifecycle events.
- **A11y:** `role="menu"`, `role="menuitem"`, keyboard navigation with `ArrowUp`, `ArrowDown`, `Escape`.

---

### 9. Data Export (`@skyra-tech-platform/data-export`)
- **Version:** `0.1.0`
- **Type:** Technical Utility Package
- **Exports:**
  - CSV: `exportToCsv`, `downloadCsv`, `escapeCsvCell`
  - Excel XML: `exportToExcelXml`, `downloadExcel`, `generateExcelXml`
  - JSON: `exportToJson`, `downloadJson`
  - TSV: `exportToTsv`, `downloadTsv`
  - Formatting: `formatDate`
- **Interfaces:** `ExportColumn`, `BaseExportOptions`, `CsvExportOptions`, `ExcelExportOptions`, etc.

---

### 10. Data Table (`@skyra-tech-platform/data-table`)
- **Version:** `0.1.0`
- **Exports:** `SkyraTechDataTable`, `processTableData`, types
- **Custom Elements:** `<skyra-tech-data-table>`
- **Attributes & Properties:**
  - `data` (property, `any[]`): Row items.
  - `columns` (property, `ColumnDef[]`): Column schemas (headers, accessors, formatters, width).
  - `sortable` (boolean): Enables column header sorting.
  - `filterable` (boolean): Enables column filtering.
  - `paginate` (boolean): Enables pagination.
  - `pageSize` (number): Default rows per page (default `10`).
  - `selectable` (boolean): Row checkboxes.
- **Events:**
  - `selection-change`: Fired on row select. Detail: `{ selectedRows: any[] }`.
  - `sort-change`: Detail: `{ column: string, direction: 'asc' | 'desc' }`.
  - `page-change`: Detail: `{ page: number, pageSize: number }`.
- **A11y:** Semantic `<table>`, `<th>`, `<td>`, `aria-sort="ascending|descending"`, keyboard navigable headers.

---

### 11. Date & Time Suite (`@skyra-tech-platform/date-time`)
- **Version:** `0.1.0`
- **Exports:** `SkyraTechCalendar`, `SkyraTechDateField`, `SkyraTechDateRangeField`, `SkyraTechTimeField`, `SkyraTechTimeRangeField`, `SkyraTechDateTimeField`, `toISODate`, `parseISODate`
- **Custom Elements:**
  - `<skyra-tech-calendar>`
  - `<skyra-tech-date-field>`
  - `<skyra-tech-date-range-field>`
  - `<skyra-tech-time-field>`
  - `<skyra-tech-time-range-field>`
  - `<skyra-tech-date-time-field>`
- **Attributes & Properties:**
  - `value` (string): ISO format (`YYYY-MM-DD`, `HH:mm`, etc.).
  - `min`, `max` (string): Boundary dates.
  - `disabled` (boolean): Form control disabled.
  - `label` (string): Field label.
  - `format` (string): Display formatting string.
- **Events:**
  - `change`: Emitted when value updates. Detail: `{ value: string }`.
- **A11y:** Full keyboard navigation inside calendar grid (`Arrow keys`, `PageUp`, `PageDown`, `Enter`). Axe zero-violation verified.

---

### 12. Design Tokens (`@skyra-tech-platform/design-tokens`)
- **Version:** `0.1.1`
- **Type:** Foundation Package
- **Exports:**
  - CSS: `tokens.css`, `reset.css`
  - JS: `tokens` object, `cssVar()` helper, `severityTokens`, `getSeverityColor()`
- **Token Categories:**
  - Brand Palette: `--skyra-primary` (`#0A58CA`), `--skyra-orange` (`#FF6B00`), `--skyra-cyan` (`#00A3E0`), `--skyra-navy` (`#002B66`)
  - Semantics: `--skyra-danger`, `--skyra-success`, `--skyra-warning`, `--skyra-info`
  - Typography: `--skyra-font-body` ('Inter'), `--skyra-font-display` ('Outfit'), `--skyra-font-mono` ('JetBrains Mono')
  - Radii: `sm` (6px), `md` (10px), `lg` (14px), `xl` (20px), `full` (9999px)
  - Surfaces: Light (`#FFFFFF`, `#F4F7FC`), Dark (`#151D30`, `#0B111E`)

---

### 13. Dialog (`@skyra-tech-platform/dialog`)
- **Version:** `0.1.0`
- **Exports:** `SkyraTechDialog`
- **Custom Elements:** `<skyra-tech-dialog>`
- **Attributes & Properties:**
  - `open` (boolean): Dialog modal visibility. Reflected.
  - `size` (string): `sm` | `md` | `lg` | `xl`. Default `md`.
  - `title` (string): Header title.
  - `closable` (boolean): Displays close button. Default `true`.
- **Events:**
  - `open`: Fired when displayed.
  - `close`: Fired when closed.
- **Slots:**
  - `header`: Custom dialog header.
  - `(default)`: Dialog body content.
  - `footer`: Action buttons slot.
- **Methods:** `show()`, `close()`.
- **A11y:** `role="dialog"`, `aria-modal="true"`, focus trap, focus restoration to opener, `Escape` key closes.

---

### 14. Drawer (`@skyra-tech-platform/drawer`)
- **Version:** `0.1.0`
- **Exports:** `SkyraTechDrawer`, `defineSkyraTechDrawer`, `drawerStyles`
- **Custom Elements:** `<skyra-tech-drawer>`
- **Attributes & Properties:**
  - `open` (boolean): Drawer visibility. Reflected.
  - `position` (string): `right` | `left` | `top` | `bottom`. Default `right`.
  - `size` (string): `sm` (320px) | `md` (480px) | `lg` (640px) | `full` (100%). Default `md`.
  - `title` (string): Drawer header title.
  - `backdrop` (string): `default` (click outside dismisses) | `static` (click outside does not dismiss).
- **Events:**
  - `open`: Dispatched when drawer opens.
  - `close`: Dispatched when drawer closes.
- **Slots:**
  - `header`: Header area.
  - `(default)`: Main body content.
  - `footer`: Action footer.
- **Methods:**
  - `show()`: Sets open = true.
  - `close()`: Sets open = false and fires close event.
- **A11y:** `role="dialog"`, `aria-modal="true"`, auto-focuses panel, focus restoration on close, `Escape` key dismissal.

---

### 15. Dropdown Menu (`@skyra-tech-platform/dropdown-menu`)
- **Version:** `0.1.0`
- **Exports:** `SkyraDropdownMenuElement`, `SkyraTechDropdownMenuElement`, item/group/separator classes
- **Custom Elements:**
  - Menu: `<skyra-tech-dropdown-menu>`, `<skyra-dropdown-menu>`
  - Item: `<skyra-tech-dropdown-item>`, `<skyra-dropdown-item>`
  - Separator: `<skyra-tech-dropdown-separator>`, `<skyra-dropdown-separator>`
  - Group: `<skyra-tech-dropdown-group>`, `<skyra-dropdown-group>`
- **Attributes & Properties:**
  - `open` (boolean): Menu open state.
  - `placement` (string): `bottom-start` | `bottom-end` | `top-start` | `top-end`.
- **Events:**
  - `select`: Emitted on item click. Detail: `{ value: string }`.
  - `open`, `close`.
- **A11y:** `role="menu"`, `role="menuitem"`, roving tabindex, `ArrowUp`/`ArrowDown` navigation.

---

### 16. Dynamic Form (`@skyra-tech-platform/dynamic-form`)
- **Version:** `0.1.0`
- **Exports:** `SkyraTechDynamicForm`, types `FieldDef`, `FieldsetDef`
- **Custom Elements:** `<skyra-tech-dynamic-form>`
- **Attributes & Properties:**
  - `fieldsets` (property, `FieldsetDef[]`): JSON schema defining form fields, types, validations, and conditions.
  - `values` (property, `Record<string, any>`): Initial/current form values.
- **Events:**
  - `form-submit`: Fired on submit. Detail: `{ values: Record<string, any> }`.
  - `form-change`: Fired on any field input. Detail: `{ field: string, value: any, values: Record<string, any> }`.
- **A11y:** Accessible labels generated for every field type, inline validation error associations (`aria-describedby`).

---

### 17. Dynamic Select (`@skyra-tech-platform/dynamic-select`)
- **Version:** `0.1.0`
- **Exports:** `SkyraTechDynamicSelect`, `defineSkyraTechDynamicSelect`, `dynamicSelectStyles`
- **Custom Elements:** `<skyra-tech-dynamic-select>`
- **Attributes & Properties:**
  - `value` (string | string[]): Selected item value(s).
  - `options` (property, `SelectOption[]`): List of available options.
  - `multiple` (boolean): Enables multi-select chip mode.
  - `searchable` (boolean): Enables text filtering.
  - `creatable` (boolean): Allows adding custom options.
  - `placeholder` (string): Input prompt.
  - `disabled` (boolean): Disabled state.
- **Events:**
  - `change`: Detail: `{ value: string | string[], selectedOption: any }`.
- **A11y:** `role="combobox"`, `aria-expanded`, `aria-activedescendant`, listbox navigation via keyboard.

---

### 18. Empty State (`@skyra-tech-platform/empty-state`)
- **Version:** `0.1.0`
- **Exports:** `SkyraTechEmptyState`, `defineSkyraTechEmptyState`, `emptyStateStyles`
- **Custom Elements:** `<skyra-tech-empty-state>`
- **Attributes & Properties:**
  - `variant` (string): `default` | `card` | `dashed`. Default `default`.
  - `headline` (string): Primary title text.
  - `description` (string): Explanatory body text.
- **Events:** None.
- **Slots:**
  - `icon`: Decorative illustration or SVG icon.
  - `headline`: Custom headline markup (if not using `headline` attribute).
  - `description`: Custom body markup.
  - `(default)`: Supplementary content.
  - `actions`: Call to action buttons.
- **A11y:** Role default or region. Headings styled semantically (`<h3>`). Action buttons focusable.

---

### 19. Input (`@skyra-tech-platform/input`)
- **Version:** `0.1.0`
- **Exports:** `SkyraTechInput`, `defineSkyraTechInput`, `inputStyles`
- **Custom Elements:** `<skyra-tech-input>`
- **Attributes & Properties:**
  - `type` (string): `text` | `email` | `password` | `number` | `search` | `tel` | `url`. Default `text`.
  - `value` (string): Text content. Reflected.
  - `placeholder` (string): Ghost prompt.
  - `label` (string): Field label.
  - `error` (string): Validation error message.
  - `disabled` (boolean): Disabled state.
  - `readonly` (boolean): Read-only state.
  - `clearable` (boolean): Shows clear button when value is present.
- **Events:**
  - `input`: Native input pass-through.
  - `change`: Native change pass-through.
  - `clear`: Fired when clear button is clicked.
- **Slots:**
  - `prefix`: Prefix icon/text.
  - `suffix`: Suffix icon/text.
- **A11y:** `aria-invalid="true"` when error present, `aria-describedby` links to error message.

---

### 20. Loader System (`@skyra-tech-platform/loader`)
- **Version:** `0.1.1`
- **Exports:** `SkyraSpinnerElement`, `SkyraProgressElement`, `SkyraCircularProgressElement`, `SkyraSkeletonElement`, and skeleton variants
- **Custom Elements:**
  - Spinners: `<skyra-tech-spinner>`, `<skyra-spinner>`
  - Progress: `<skyra-tech-progress>`, `<skyra-progress>`, `<skyra-tech-circular-progress>`, `<skyra-circular-progress>`
  - Skeletons: `<skyra-tech-skeleton>`, `<skyra-tech-skeleton-text>`, `<skyra-tech-skeleton-avatar>`, `<skyra-tech-skeleton-card>`, `<skyra-tech-skeleton-table>`
- **Attributes & Properties:**
  - Spinner: `size` (`sm` | `md` | `lg`), `variant` (`primary` | `neutral` | `white`).
  - Progress: `value` (0-100), `max` (number), `indeterminate` (boolean).
  - Skeleton: `variant` (`text` | `circular` | `rectangular`), `width`, `height`, `animated` (boolean).
- **A11y:** `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-busy="true"`.

---

### 21. Notification (`@skyra-tech-platform/notification`)
- **Version:** `0.1.0`
- **Exports:** `SkyraNotificationBarElement`
- **Custom Elements:** `<skyra-tech-notification-bar>`, `<skyra-notification-bar>`
- **Attributes & Properties:**
  - `variant` (string): `info` | `success` | `warning` | `danger`. Default `info`.
  - `title` (string): Bold banner title.
  - `closable` (boolean): Displays close button. Default `true`.
- **Events:**
  - `close`: Fired when banner is dismissed.
- **Slots:**
  - `icon`: Custom leading icon.
  - `(default)`: Message body.
  - `actions`: Inline action buttons.
- **A11y:** `role="alert"` for error/danger, `role="status"` for info/success.

---

### 22. PDF Viewer (`@skyra-tech-platform/pdf-viewer`)
- **Version:** `0.1.0`
- **Exports:** `SkyraPdfViewerElement`
- **Custom Elements:** `<skyra-tech-pdf-viewer>`
- **Attributes & Properties:**
  - `src` (string): Document URL.
  - `title` (string): File display title.
  - `totalPages` (number): Page count.
  - `initialPage` (number): Starting page.
  - `initialZoom` (number): Starting zoom percentage (50-200).
- **Events:**
  - `page-change`: Detail: `{ page: number }`.
  - `zoom-change`: Detail: `{ zoom: number }`.
  - `print`: Fired on print request.
  - `download`: Fired on download request.
- **A11y:** Keyboard zoom (`Ctrl +` / `Ctrl -`), accessible dark toolbar controls with `aria-label`.

---

### 23. Popover (`@skyra-tech-platform/popover`)
- **Version:** `0.1.0`
- **Exports:** `SkyraPopoverElement`, `SkyraTechPopoverElement`, `computePopoverPosition`
- **Custom Elements:** `<skyra-tech-popover>`, `<skyra-popover>`
- **Attributes & Properties:**
  - `open` (boolean): Popover visibility. Reflected.
  - `placement` (string): `top` | `bottom` | `left` | `right` (with `-start`/`-end` variants). Default `bottom`.
  - `offset` (number): Pixel distance from trigger (default `8`).
  - `arrow` (boolean): Displays pointer arrow.
- **Events:** `open`, `close`.
- **Slots:**
  - `trigger`: Element anchoring the popover.
  - `(default)`: Popover content.
- **A11y:** Focus trapping inside popover content, `Escape` key dismissal and trigger focus restoration.

---

### 24. QR Code (`@skyra-tech-platform/qr`)
- **Version:** `0.1.0`
- **Exports:** Core algorithms (`QRCodeCore`, matrix encoders) and Web Component
- **Custom Elements:** `<skyra-tech-qr-code>`
- **Attributes & Properties:**
  - `data` (string): Text or URL encoded.
  - `size` (number): Pixel dimensions (default `200`).
  - `error-correction` (string): `L` | `M` | `Q` | `H`. Default `M`.
  - `fg-color` (string): Foreground fill (default `#000000`).
  - `bg-color` (string): Background fill (default `#FFFFFF`).
- **Events:** None.
- **A11y:** Generates `<canvas>` or `<svg>` with fallback text `aria-label="QR Code for [data]"`. Axe zero violations.

---

### 25. Radio (`@skyra-tech-platform/radio`)
- **Version:** `0.1.0`
- **Exports:** `SkyraTechRadio`, `defineSkyraTechRadio`, `radioStyles`
- **Custom Elements:** `<skyra-tech-radio>`
- **Attributes & Properties:**
  - `checked` (boolean): Checked state. Reflected.
  - `disabled` (boolean): Disabled state.
  - `name` (string): Radio group identifier.
  - `value` (string): Form submission value.
  - `label` (string): Label text.
- **Events:**
  - `change`: Emitted when radio becomes selected. Detail: `{ value: string, name: string }`.
- **Slots:**
  - `(default)`: Custom label content.
- **A11y:** `role="radio"`, `aria-checked`. Keyboard navigation: Arrow keys navigate sibling radios in group.

---

### 26. Switch (`@skyra-tech-platform/switch`)
- **Version:** `0.1.0`
- **Exports:** `SkyraTechSwitch`, `defineSkyraTechSwitch`, `switchStyles`
- **Custom Elements:** `<skyra-tech-switch>`
- **Attributes & Properties:**
  - `checked` (boolean): Switch state. Reflected.
  - `disabled` (boolean): Disabled state.
  - `size` (string): `sm` | `md` | `lg`. Default `md`.
  - `name` (string): Form name.
  - `label` (string): Visible label text.
- **Events:**
  - `change`: Detail: `{ checked: boolean }`.
- **A11y:** `role="switch"`, `aria-checked`, `Space` / `Enter` toggles.

---

### 27. Tabs (`@skyra-tech-platform/tabs`)
- **Version:** `0.1.1`
- **Exports:** `SkyraTabsElement`, `SkyraTabElement`, `SkyraTabPanelElement`
- **Custom Elements:**
  - `<skyra-tech-tabs>`, `<skyra-tabs>`
  - `<skyra-tech-tab>`, `<skyra-tab>`
  - `<skyra-tech-tab-panel>`, `<skyra-tab-panel>`
- **Attributes & Properties:**
  - `<skyra-tech-tabs>`:
    - `active` (string): Value/id of selected tab.
    - `variant` (string): `line` | `pill` | `enclosed`. Default `line`.
  - `<skyra-tech-tab>`:
    - `value` (string): Tab identity.
    - `disabled` (boolean): Disables tab.
  - `<skyra-tech-tab-panel>`:
    - `value` (string): Matches tab `value`.
- **Events:**
  - `tab-change`: Detail: `{ value: string }`.
- **A11y:** `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`. Keyboard: `ArrowLeft`, `ArrowRight`, `Home`, `End`.

---

### 28. Textarea (`@skyra-tech-platform/textarea`)
- **Version:** `0.1.0`
- **Exports:** `SkyraTechTextarea`, `defineSkyraTechTextarea`, `textareaStyles`
- **Custom Elements:** `<skyra-tech-textarea>`
- **Attributes & Properties:**
  - `value` (string): Input text. Reflected.
  - `placeholder` (string): Ghost prompt.
  - `rows` (number): Visible rows (default `4`).
  - `maxlength` (number): Max character limit.
  - `show-count` (boolean): Displays character count counter.
  - `auto-resize` (boolean): Auto-expands height with content.
  - `disabled` (boolean): Disabled state.
  - `error` (string): Error text.
- **Events:** `input`, `change`.
- **A11y:** `aria-invalid`, `aria-describedby` for error and character count.

---

### 29. Toast (`@skyra-tech-platform/toast`)
- **Version:** `0.1.0`
- **Exports:** `SkyraToastViewportElement`, `toast` imperative API
- **Custom Elements:** `<skyra-tech-toast-viewport>`, `<skyra-toast-viewport>`
- **Attributes & Properties:**
  - `position` (string): `top-right` | `top-left` | `bottom-right` | `bottom-left`. Default `top-right`.
- **Imperative Methods:**
  - `toast.success(message, options)`
  - `toast.error(message, options)`
  - `toast.warning(message, options)`
  - `toast.info(message, options)`
  - `toast.dismiss(id)`
- **A11y:** `role="status"` (info/success) or `role="alert"` (error/warning), polite live region.

---

### 30. Utils (`@skyra-tech-platform/utils`)
- **Version:** `0.1.0`
- **Type:** Utility Package
- **Exports:**
  - Currency: `formatCurrency`, `roundMoney`, `parseMoney`, `amountInWords`
  - Dates: `formatDate`, `formatRelativeTime`, `isPast`, `isToday`, `addDays`, `startOfDay`, `toISODate`
  - Strings: `truncate`, `toTitleCase`, `toSlug`, `getInitials`, `capitalize`, `maskString`, `normalizePhone`, `isValidEmail`, `simpleId`, `normalizeWhitespace`
  - Keyboard: `normalizeShortcut`, `parseShortcut`, `formatShortcut`, `matchesShortcutKey`, `isInputElement`, `detectShortcutConflicts`
  - Search: `filterCommands`

---

### 31. Validation (`@skyra-tech-platform/validation`)
- **Version:** `0.1.0`
- **Type:** Utility Package
- **Exports (Zod Schemas):**
  - Text: `emailSchema`, `phoneSchema`, `urlSchema`, `nameSchema`, `shortTextSchema`, `longTextSchema`
  - Financial & Numeric: `positiveAmountSchema`, `nonNegativeIntSchema`, `percentageSchema`, `currencyCodeSchema`
  - Legal & Tax IDs: `gstinSchema`, `panSchema`, `pinCodeSchema`
  - Dates: `isoDateSchema`
  - Objects: `addressSchema`, `orgSchema`, `userProfileSchema`, `clientSchema`, `bankAccountSchema`

