# F20 — Sidebar Navigation Cleanup Final Report

Date: 2026-10-16

**Verdict: PASS.** The smallest justified correction is two sidebar label changes: **Utilities → Utility Functions** and **Validation → Validation Schemas**. All 12 sidebar destinations are distinct and retained. No route, group, icon, styling, active-route logic, component catalogue or F-19 Playground implementation changed.

## Root cause and audit conclusion

The confusing overlap was primarily terminology, not duplicate URLs or a redirect defect. The Components page's Utilities category contains QR Code and a planned future entry. The sidebar's /docs/utils page is a separate runtime-neutral TypeScript library reference covering currency, date, string, keyboard-shortcut and command-search functions. The old Utilities label did not communicate that distinction.

Similarly, /docs/validation documents Zod schemas and their reuse across forms/API/service layers; it is not another component category or a duplicate Dynamic Form page. Validation Schemas makes that purpose explicit.

The other reviewed documentation resources have useful independent purposes. Design System renders a registry-driven foundation overview; Design Tokens documents installation, CSS/TypeScript usage, token reference and cssVar. Data Export Docs covers pure string generators and browser helpers for CSV, Excel XML, JSON and TSV; it differs from the interactive Export Workbench and the Components page's Documents category. Related topics do not establish duplicate navigation. Removing these links would hide useful references, so no removal or repositioning was justified.

Read-only audit covered the Dashboard layout/configuration, Components groups/cards, all five reviewed documentation implementations, redirects, active matching, Docs breadcrumbs and existing navigation/test conventions before source editing. Relevant source evidence: layout.tsx NAV_SECTIONS and isItemActive; components/page.tsx COMPONENT_GROUPS; docs/{utils,validation,data-export,design-tokens}/page.tsx; design-system/page.tsx; next.config.ts. No source file changed during this audit phase.

## Initial sidebar inventory and disposition

| Group | Initial label | Destination | Distinct purpose | Final action |
|---|---|---|---|---|
| Platform | Overview | /overview | Platform landing/overview | Retained |
| Platform | Packages | /packages | Workspace package inventory | Retained |
| Platform | Releases & Changelog | /releases | Release/change history | Retained |
| Developer Documentation | Components | /components | Primary component catalogue | Retained |
| Developer Documentation | Design System | /design-system | Registry-driven design foundation overview | Retained |
| Developer Documentation | Design Tokens | /docs/design-tokens | CSS/TypeScript token installation and reference | Retained |
| Developer Documentation | Utilities | /docs/utils | Pure TypeScript utility-function reference | Renamed Utility Functions |
| Developer Documentation | Validation | /docs/validation | Zod schema reference and integration | Renamed Validation Schemas |
| Developer Documentation | Data Export Docs | /docs/data-export | Export-format API/reference | Retained |
| Playground & Workbenches | UI Playground | /ui-components | Functional Showcases and dedicated Workbench discovery | Retained |
| Quality Tools | Accessibility Studio | /accessibility | Accessibility quality tool | Retained |
| Quality Tools | Viewport Studio | /responsive | Responsive/viewport quality tool | Retained |

**Removed: none. Repositioned: none.** All four original groups and their ordering remain unchanged. Components remains the main catalogue entry point. No individual component link or new group was introduced.

## Exact files changed

- dashboard/src/app/(dashboard)/layout.tsx: two label literals in NAV_SECTIONS (lines 100–101). Their hrefs, icons and ordering are unchanged. The links' rendered text/title naturally reflect the new labels through existing rendering.
- dashboard/scripts/sidebar-navigation.test.ts: three focused Node/TSX tests reading the actual registry and executing the actual active-route matcher in an isolated VM. No duplicate production registry or refactor for testing was added.
- dashboard/scripts/verify-sidebar-navigation.mjs: focused real Chromium verifier following the repository's existing explicit-test-server script convention.
- F20_SIDEBAR_NAVIGATION_CLEANUP_FINAL_REPORT.md: this report.

The application diff is exactly two replacement lines. Reconstructing just the two original labels in memory reproduces the baseline layout SHA-256, proving that markup, accessibility attributes, handlers, active matching, styles and other layout code are unchanged.

## Catalogue, documentation and active-state preservation

The Components source is byte-identical and retains **11 categories and 25 existing cards**, including Documents and Utilities and their existing planned entries. Chromium verified all category headings. Package manifests, documentation pages, breadcrumbs, API/current/historical records and behavioral metadata are unchanged.

No redirects were added or changed. Utility Functions still opens /docs/utils, which contains genuine function-reference content; Components' Utilities category remains independently discoverable from /components. Validation Schemas and Data Export Docs still open their original independent pages.

The existing matcher already distinguished /components/* from /docs/utils and used slash-delimited prefix matching. It needed no correction. Three focused tests include 18 pathname cases, checking that at most one appropriate item is active and that lookalike prefixes such as /docs/utils-extra are not selected. Some matcher-only cases use hypothetical future nested paths; they do not assert those paths are implemented routes.

Real Chromium navigation verified all 12 retained top-level destinations plus four existing nested routes: /components/utilities/qr, /components/forms/dynamic-form, /packages/utils and /ui-components/popover. Every response was 200 at its intended URL and exactly one correct sidebar link was active.

## Commands and actual validation results

All validation below executed freshly, without cached Turbo results.

| Executed command/check | Exit | Meaningful result |
|---|---:|---|
| pnpm exec tsx --test dashboard/scripts/sidebar-navigation.test.ts | 0 | Three tests passed: four groups/12 unique valid destinations; precise independent-reference labels; actual active matcher with 18 cases. .tmp/f20/unit.log. |
| DASHBOARD_BASE_URL=http://localhost:3020 node dashboard/scripts/verify-sidebar-navigation.mjs | 0 final | Six browser groups passed: sidebar/category structure, 12 destinations/four nested routes, keyboard disclosure/Tab order/Enter navigation, directly loaded active-section visibility, mobile drawer navigation and no page runtime errors. .tmp/f20/browser-final.log. |
| pnpm exec tsx --test dashboard/scripts/ui-playground.test.ts | 0 | All three existing F-19 registry/navigation tests passed unchanged. .tmp/f20/playground-unit.log. |
| DASHBOARD_BASE_URL=http://localhost:3020 PLAYGROUND_CHECK_FILTER='catalogue, actions|search, category|all catalogue routes|direct/internal links|workbench' node dashboard/scripts/verify-ui-playground.mjs | 0 | Nine selected existing F-19 browser navigation groups passed: cards/actions/sidebar, filters, every catalogue/Docs destination and breadcrumb, Tabs/Accordion internal/history/back links, and all four Workbench destinations including QR preview. Explicitly focused execution; not a claim that all 48 F-19 groups reran. .tmp/f20/playground-navigation.log. |
| pnpm --filter dashboard typecheck | 0 | Existing generate:data then genuine tsc --noEmit completed; generated examples/releases remain byte-identical. .tmp/f20/typecheck.log. |
| pnpm exec eslint dashboard/scripts/sidebar-navigation.test.ts | 0 | Genuine ESLint validation of the new TypeScript test. Limited scope; not comprehensive Dashboard lint. .tmp/f20/focused-lint.log. |
| node --check dashboard/scripts/verify-sidebar-navigation.mjs | 0 | Browser verifier syntax valid. |
| git diff --check | 0 | No whitespace errors. .tmp/f20/diff-check.log. |
| git diff --cached --quiet | 0 | No staged changes introduced. |
| Node SHA-256/source reconstruction and protected-fixture comparison | 0 | Only the authorized layout changed among baseline files; its only changes are the two labels. All 40 additional protected file/link entries match prior evidence. .tmp/f20/preservation.json. |

Initial read-only Git status/stat/staged diff were captured before edits. The AGENTS.md inventory returned code 1 because no matching file was found; that inspection result was not treated as a test failure or validation pass.

The first new browser-verifier attempt exited 1 after passing structure and route checks because #currency matched both an existing section and heading. The test selectors were qualified to section#currency/section#shortcut; documentation was not changed. The final run passed with explicit Tab/Shift+Tab checks between the two clarified labels. Initial and final logs were retained separately; no retries or failure suppression were added.

## Keyboard, accessibility and responsive evidence

Chromium exercised Enter/Space on the Developer Documentation disclosure, checked aria-expanded/hidden-region behavior, used Tab/Shift+Tab between Utility Functions and Validation Schemas, and used Enter to open the utility reference. At 375px, the existing mobile drawer opened through Toggle Sidebar and closed after following Utility Functions. UI Playground remains in Playground & Workbenches; Accessibility Studio and Viewport Studio remain in Quality Tools. All original accessible link/button/region semantics and styling are unchanged apart from the intended link names.

This was actual browser execution against a **new isolated Dashboard copy under .tmp/f20/preview**, served on port 3020, using existing dependencies/packages. Next.js generated only that copy's next-env/.next files. The owned test server was stopped afterward and scratch evidence retained. The original Dashboard server was not restarted or repurposed.

## Initial/final Git state and preservation

Initial state: **clean checkout, zero staged or untracked files**. Prior F-08–F-19 work was already present in baseline HEAD 93c0cc6; no commit was created by this task. Baseline captured 571 tracked/nonignored files.

Final state: **one modified tracked file and three untracked files** (two focused test scripts and this report), zero staged changes. All **570 other baseline files are byte-identical**. This includes F-19 Showcases, Workbenches, its report and test scripts, the Components catalogue, all independent Docs, package source/manifests/exports, CI/build configuration, API history and prior reports.

Forty additional protected regular-file/link entries matched existing evidence, including consumer fixtures and the retained Button tarball. No archive or package build output was generated. No ERP or QR-generator file changed. No pre-existing scratch directory or report was overwritten or deleted. No stage, commit, push, pull, branch switch, reset, clean, discard or revert operation was performed.

Protected dashboard/next-env.d.ts SHA-256 remains:

083e23c4c5e7761db151134ea1ef7896120c86c5888cdc8a861f534f7e86d6fd

Initial/final status and preservation evidence are retained under .tmp/f20; final status is .tmp/f20/final-status.txt.

## Remaining limitations and review boundary

- No production build, registry install or hosted CI run was attempted/claimed. The known F-19 production-build limitation was not revisited by this navigation-only task.
- No full F-19 interaction/theme/accessibility matrix was rerun. Relevant existing navigation groups passed, and all its implementation/tests remain byte-identical.
- No comprehensive Dashboard lint or manual screen-reader/other-browser certification was claimed. The Dashboard lint script remains an echo placeholder and was not used as evidence of genuine application lint. Existing development hydration console warnings on unchanged documentation were observed; the focused verifier found no page runtime exceptions and did not broaden into unrelated hydration repairs.
- The cleanup clarifies labels rather than shortening the sidebar: the audit established that all reviewed destinations contain distinct useful content. Removing them would not be evidence-based.

Suggested message for a future explicitly authorized commit only:

    fix(dashboard): clarify sidebar documentation labels

Stopped after F-20 for review; no subsequent task started.
