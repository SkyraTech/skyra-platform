# F-09 — Legacy Custom Element Tag Audit and Remediation

Date: October 14, 2026  
Repository: Skyra Platform  
Branch: `main`  
Verdict: **PASS within the tested environments**

## 1. Baseline and confirmed finding

The authoritative initial working tree was **clean**, with no staged, modified, or untracked files. The latest existing commit was `6ecb9e7` (`fix(platform): complete package health audit remedies F-04 to F-08 and ui playground navigation`). This task did not create that commit or alter Git history. Prior task changes, reports, and tests were already present in the baseline and were preserved.

The previous shorthand counts referred to **six legacy-only package families** and **four dual-alias package families**, not six individual tags and four individual components:

- Six families contained **16 legacy-only tags**: Accordion (2), Tabs (3), Collapsible (1), Loader (8), Notification (1), Toast (1).
- Four families already contained **10 dual-alias components**: Popover (1), Command Palette (1), Dropdown Menu (4), Context Menu (4).
- Across relevant package source there were **55 unique literal registration names**: 26 legacy and 29 canonical names.

The defect was missing canonical registrations for those 16 legacy-only components. Existing dual registrations intentionally use separate subclass constructors, guarded independently by `customElements.get`; they were not accidental duplicate registration of the same constructor.

## 2. Complete affected before/after inventory

Every canonical name below is the `skyra-tech-*` counterpart expected by the current naming convention. Canonical package identities remain `@skyra-tech-platform/*`.

“L → L+C” means only the legacy name was registered before, and both names are registered afterward. “L+C unchanged” means the existing compatibility contract was preserved. Consumer evidence is elaborated in section 3.

| Package / component | Legacy tag | Canonical tag | Before → after | Consumer evidence |
|---|---|---|---|---|
| accordion / container | `skyra-accordion` | `skyra-tech-accordion` | L → L+C | Accordion adapter, docs, Playground/showcase, package tests |
| accordion / item | `skyra-accordion-item` | `skyra-tech-accordion-item` | L → L+C | Same consumers; parent item lookup |
| tabs / container | `skyra-tabs` | `skyra-tech-tabs` | L → L+C | Tabs adapter, docs, Playground/showcase, tests |
| tabs / tab | `skyra-tab` | `skyra-tech-tab` | L → L+C | Same consumers; selection and keyboard lookup |
| tabs / panel | `skyra-tab-panel` | `skyra-tech-tab-panel` | L → L+C | Same consumers; panel lookup and ARIA linkage |
| collapsible | `skyra-collapsible` | `skyra-tech-collapsible` | L → L+C | Collapsible adapter/docs, tests |
| loader / spinner | `skyra-spinner` | `skyra-tech-spinner` | L → L+C | Loader adapters, loader/error-state showcases, tests |
| loader / progress | `skyra-progress` | `skyra-tech-progress` | L → L+C | Loader showcase, declarations/tests |
| loader / circular progress | `skyra-circular-progress` | `skyra-tech-circular-progress` | L → L+C | Loader showcase, declarations/tests |
| loader / skeleton | `skyra-skeleton` | `skyra-tech-skeleton` | L → L+C | Loader showcase, internal composed skeletons, tests |
| loader / skeleton text | `skyra-skeleton-text` | `skyra-tech-skeleton-text` | L → L+C | Loader showcase, internal skeleton composition, tests |
| loader / skeleton avatar | `skyra-skeleton-avatar` | `skyra-tech-skeleton-avatar` | L → L+C | Loader showcase, internal skeleton composition, tests |
| loader / skeleton card | `skyra-skeleton-card` | `skyra-tech-skeleton-card` | L → L+C | Public loader entry point and package tests; no direct Dashboard markup match identified |
| loader / skeleton table | `skyra-skeleton-table` | `skyra-tech-skeleton-table` | L → L+C | Loader showcase, declarations/tests |
| notification / bar | `skyra-notification-bar` | `skyra-tech-notification-bar` | L → L+C | Notification/Toast docs; Toast creates legacy bars; tests |
| toast / viewport | `skyra-toast-viewport` | `skyra-tech-toast-viewport` | L → L+C | Toast docs, imperative viewport discovery/creation, tests |
| popover | `skyra-popover` | `skyra-tech-popover` | L+C unchanged | Popover adapter/docs and several date/upload adapters; tests |
| command-palette | `skyra-command-palette` | `skyra-tech-command-palette` | L+C unchanged | CommandPalette adapter/docs, declarations and tests |
| dropdown-menu / menu | `skyra-dropdown-menu` | `skyra-tech-dropdown-menu` | L+C unchanged | DropdownMenu adapter/docs, tests |
| dropdown-menu / item | `skyra-dropdown-item` | `skyra-tech-dropdown-item` | L+C unchanged | MenuPrimitives adapter/docs, parent selectors, tests |
| dropdown-menu / separator | `skyra-dropdown-separator` | `skyra-tech-dropdown-separator` | L+C unchanged | MenuPrimitives adapter/docs, tests |
| dropdown-menu / group | `skyra-dropdown-group` | `skyra-tech-dropdown-group` | L+C unchanged | MenuPrimitives adapter/docs, declarations/tests |
| context-menu / menu | `skyra-context-menu` | `skyra-tech-context-menu` | L+C unchanged | ContextMenu adapter/docs, tests |
| context-menu / item | `skyra-context-menu-item` | `skyra-tech-context-menu-item` | L+C unchanged | Context Menu docs, parent selectors, tests |
| context-menu / separator | `skyra-context-menu-separator` | `skyra-tech-context-menu-separator` | L+C unchanged | Context Menu docs, declarations/tests |
| context-menu / group | `skyra-context-menu-group` | `skyra-tech-context-menu-group` | L+C unchanged | Public entry point/declarations/tests; no direct Dashboard markup match identified |

Final source inventory: **71 unique literal registration names**, comprising **26 legacy names and 45 canonical names**. Every legacy registration has a canonical counterpart; no original registration was removed.

The following **19 canonical-only names** were unaffected and remain unchanged: `skyra-tech-app-shell`, `skyra-tech-button`, `skyra-tech-checkbox`, `skyra-tech-data-table`, `skyra-tech-calendar`, `skyra-tech-date-field`, `skyra-tech-date-range-field`, `skyra-tech-time-field`, `skyra-tech-time-range-field`, `skyra-tech-date-time-field`, `skyra-tech-dialog`, `skyra-tech-dynamic-form`, `skyra-tech-dynamic-select`, `skyra-tech-input`, `skyra-tech-pdf-viewer`, `skyra-tech-qr-code`, `skyra-tech-radio`, `skyra-tech-switch`, and `skyra-tech-textarea`.

## 3. Consumer and compatibility evidence

Inspected all package registration calls/helpers, class aliases, entry points and export maps, relevant source selectors and tag checks, Dashboard adapters/markup/declarations, examples/docs, tests, and isolation/external-consumer scripts. Literal registrations and candidate consumer references were saved under `.tmp/f09/`.

Representative consumer paths include:

- `dashboard/src/components/ui/Accordion.tsx`, `Tabs.tsx`, `Collapsible.tsx`, `DataLoader.tsx`, `Popover.tsx`, `DropdownMenu.tsx`, `MenuPrimitives.tsx`, `ContextMenu.tsx`, and `CommandPalette.tsx`.
- `dashboard/src/app/(dashboard)/ui-components/page.tsx` and dedicated Accordion/Tabs/Loader showcases.
- Canonical documentation routes under `components/disclosure`, `components/navigation`, `components/feedback`, and `components/overlays`.
- `dashboard/src/custom-elements.d.ts` and existing package tests.
- Loader's internal templates create legacy skeleton children; Toast creates legacy notification bars and, when necessary, a legacy viewport. Those internal paths remain supported.

Dropdown and Context Menu selectors already accept both legacy and canonical item tags. Existing aliases therefore remain deliberate compatibility behavior. Public exported classes and documented legacy consumers also justify retaining aliases even where direct markup is absent. Searches were not treated as proof that external consumers do not exist.

No Dashboard markup, namespace documentation, JSX declarations, package-isolation tooling, or external-consumer script was migrated or cleaned up in this task.

## 4. Exact repair and safety

Added 16 guarded canonical registrations across **12 source files** in six packages. Each new canonical tag receives a distinct, non-exported subclass of the existing implementation:

```ts
if (typeof customElements !== 'undefined') {
  if (!customElements.get('skyra-tech-accordion')) {
    customElements.define('skyra-tech-accordion', class extends SkyraAccordionElement {});
  }
}
```

This preserves the legacy constructor binding and inherited implementation while avoiding registration of one constructor under two names. The guards preserve existing registry entries during repeated module evaluation. No new public class exports were introduced.

Three directly related lookup corrections make canonical elements functional:

1. Accordion item discovery now accepts `skyra-accordion-item` and `skyra-tech-accordion-item`.
2. Tabs discovers both tab/panel naming forms, and its keyboard handler accepts both tab names.
3. Toast's imperative API can reuse either existing viewport name rather than creating a separate legacy viewport beside a canonical one.

No legacy registration, event name, property contract, styling rule, accessibility implementation, package API/export map, version, dependency, or unrelated metadata was changed. Default legacy creation paths remain intact. The four previously dual-alias production implementations were left unchanged.

## 5. Focused tests and actual counts

Added `tests/custom-element-registration.ts` as a small shared Vitest contract helper, plus one registration test file per audited package. Nine use `tests/tags.test.ts`; Toast uses `tests/tags.spec.ts` to match its existing discovery configuration.

The shared helper verifies canonical/legacy constructors are defined and distinct, both names construct valid elements, canonical elements inherit the legacy implementation, connection works, and re-evaluating modules preserves registry bindings without duplicate-definition errors. Fixtures are disconnected after deferred connection work completes.

Additional focused tests cover canonical and mixed Accordion/Tabs composition, Tabs arrow-key selection and ARIA linkage, canonical Collapsible toggle semantics, canonical loader status/composed skeleton rendering, Notification dismissal/events, and imperative Toast reuse/dismissal of a canonical viewport.

| Package | Existing tests | New F-09 tests | Final actual passing total |
|---|---:|---:|---:|
| accordion | 5 | 6 | 11 |
| tabs | 11 | 7 | 18 |
| collapsible | 7 | 3 | 10 |
| loader | 12 | 10 | 22 |
| notification | 6 | 3 | 9 |
| toast | 6 | 3 | 9 |
| popover | 16 | 2 | 18 |
| dropdown-menu | 13 | 5 | 18 |
| context-menu | 14 | 5 | 19 |
| command-palette | 17 | 2 | 19 |
| **Total** | **107** | **46** | **153** |

All tests above actually executed via package test scripts, not a Turbo test cache replay. Notification's existing script also ran coverage instrumentation; no new coverage threshold or numerical coverage claim was introduced.

The pre-repair Accordion run exited **1** with three new contract failures and five existing tests passing, demonstrating the missing canonical registrations. After repair, all its tests passed.

The initial ten-package run passed 150 tests, but Toast's `*.spec.ts` configuration skipped the newly named `tags.test.ts` file. That new file was renamed to `tags.spec.ts` without modifying discovery configuration. A subsequent real Toast run passed all nine tests, yielding the final per-package total of 153. No test was suppressed or weakened.

## 6. Validation commands and results

Let **changed filters** denote the six explicit filters for `@skyra-tech-platform/accordion`, `tabs`, `collapsible`, `loader`, `notification`, and `toast`. Let **audited filters** denote those six plus `popover`, `dropdown-menu`, `context-menu`, and `command-palette`.

| Command/check | Exit | Result and cache qualification |
|---|---:|---|
| `pnpm --filter @skyra-tech-platform/accordion test` before production repair | 1 | Three new failures confirmed missing canonical registrations; five existing tests passed |
| `pnpm <changed filters> build` | 0 | All six actual package build scripts executed; ESM/CJS/declaration builds passed |
| `pnpm <audited filters> test` | 0 | Actual package executions: 150 tests passed; Toast discovery gap identified afterward |
| `pnpm --filter @skyra-tech-platform/toast test` after filename correction | 0 | Both test files discovered; all nine Toast tests passed |
| `pnpm typecheck` | 0 | 49 successful Turbo tasks; 34 cached, 15 executed |
| `pnpm lint` | 0 | 45 successful Turbo tasks; 40 cached, five executed; genuine Accordion/Tabs source lint included |
| `pnpm api:check` | 0 | All configured declaration/baseline governance checks passed |
| Node built-package registry probe, ESM-first then CommonJS | 0 | All 32 canonical/legacy names in the six changed packages constructed; registry bindings stable after re-evaluation |
| Same built-package probe, CommonJS-first then ESM | 0 | Same 32 names passed, without duplicate-registration or order-dependent registry errors |
| Source registration inventory/assertions | 0 | 55 → 71 unique literal registrations; all 26 original legacy names retained and paired |
| Consumer searches, final diff/status and hash comparison | 0 | Consumer evidence retained; only intended tracked source files changed |
| `git diff --check` | 0 | No whitespace errors; Git emitted LF/CRLF warnings |

Expanded build command:

```text
pnpm --filter @skyra-tech-platform/accordion --filter @skyra-tech-platform/tabs --filter @skyra-tech-platform/collapsible --filter @skyra-tech-platform/loader --filter @skyra-tech-platform/notification --filter @skyra-tech-platform/toast build
```

Expanded audited test command:

```text
pnpm --filter @skyra-tech-platform/accordion --filter @skyra-tech-platform/tabs --filter @skyra-tech-platform/collapsible --filter @skyra-tech-platform/loader --filter @skyra-tech-platform/notification --filter @skyra-tech-platform/toast --filter @skyra-tech-platform/popover --filter @skyra-tech-platform/dropdown-menu --filter @skyra-tech-platform/context-menu --filter @skyra-tech-platform/command-palette test
```

Built-package probes used public package-name import/require resolution through the Dashboard dependency environment, jsdom's actual registry, cache-cleared CommonJS reloads, and cache-busted ESM re-evaluation. They did not merely inspect manifest strings. Logs and inventories are under ignored `.tmp/f09/`.

## 7. Remaining compatibility and coverage limits

- All 26 legacy names remain intentionally supported; no external migration is required by this change.
- Tests use jsdom rather than a native browser. Native-browser visual layout, animation, assistive technology behavior, and every interaction are not certified by this task.
- Existing Dashboard JSX tag declarations and documentation remain unchanged. This task enables canonical runtime registration without a broad Dashboard/docs migration.
- Loader's internal skeleton templates and Toast's default creation paths continue using supported legacy names.
- Registry guards preserve pre-existing definitions. Compatibility with unrelated third-party code claiming the same tag names is not guaranteed or exhaustively tested.
- Focused mixed-name behavior is tested for Accordion/Tabs and Toast viewport discovery; not every possible cross-family nesting or simultaneous bundle-version combination is covered.
- The shared registration helper lives outside package source and is run via package tests; no production export or new framework dependency was added.
- Workspace lint retains placeholder scripts and omissions; its successful execution is not comprehensive genuine lint coverage. API governance validates only configured declarations/baselines.
- Full Dashboard browser navigation and publication/install workflows were not rerun because no Dashboard code, manifests, package exports, or package artifacts were changed by this task.

## 8. Preservation and final scope

Captured SHA-256 hashes for **all 530 baseline tracked files**. Final comparison confirmed that **518 remained unchanged** and exactly these 12 authorized production source files changed:

- Accordion: `src/skyra-accordion.ts`, `src/skyra-accordion-item.ts`.
- Tabs: `src/skyra-tabs.ts`, `src/skyra-tab.ts`, `src/skyra-tab-panel.ts`.
- Collapsible: `src/skyra-collapsible.ts`.
- Loader: `src/skyra-spinner.ts`, `src/skyra-progress.ts`, `src/skyra-circular-progress.ts`, `src/skyra-skeleton.ts`.
- Notification: `src/skyra-notification-bar.ts`.
- Toast: `src/skyra-toast-viewport.ts`.

New files are the ten focused test files, shared helper, and this report. Existing tests, previous reports, Playground/navigation files, Tabs metadata/export tests, Date-time module/test settings, Dialog tests, F-05 tooling, and F-08 artifact/ignore changes were preserved.

The initial tree had no pending changes, so there were no pre-existing uncommitted/untracked files to reconcile. Final diff/status were inspected. No package manifest, export map, dependency, API declaration, metadata, or unrelated tracked file changed. No preservation discrepancy was found.

No commit, push, pull, staging, branch switch, reset, clean, discard, or history rewrite was performed. ERP and SkyraQR were not accessed or modified. F-10 and subsequent findings were not started.

## 9. Final verdict

**PASS:** all affected tags and consumers were audited, the 16 missing canonical registrations were added with safe distinct constructors, existing aliases were preserved, composition lookups were repaired, focused tests and required gates passed, and prior work was preserved.

## 10. Suggested commit message

```text
fix(components): add canonical custom element tags with legacy compatibility
```

Suggestion only; no commit was created.
