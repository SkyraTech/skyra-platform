# F-14 Package Namespace and Consumer # F-15 — Safe Package Isolation and Consumer Validation Workflow

## Objective

Repair `scripts/test-package-isolation.mjs` so it can validate Skyra Platform packages without deleting, overwriting, or selecting the wrong consumer fixtures or package archives.

This task addresses F14-008 only. Do not begin API catalog migration, documentation extraction changes, or any other audit.

## Mandatory preservation rules

- Work only in the Skyra Platform repository.
- `skyra-erp` is strictly READ-ONLY.
- Do not modify `skyra-qr-code-generator`.
- Preserve all pre-existing tracked modifications and untracked files, including F-08 through F-14 work and all previous audit reports.
- Preserve `dashboard/next-env.d.ts` exactly as it currently exists.
- Do not delete, rewrite, reinstall over, or repurpose the tracked `.tmp/consumer-test` fixture or the existing `.tmp-consumer` directory.
- Do not create archives in package directories.
- Do not stage, commit, push, pull, switch branches, reset, clean, discard, or revert files.

## Phase 1 — Inspect before changing

Inspect the entire `scripts/test-package-isolation.mjs` implementation and all directly relevant package manifests, package export maps, workspace dependency declarations, existing fixture files, and current Git status.

Establish concretely:
- Which directories and files the script currently deletes or overwrites.
- How package archives are generated and selected.
- Whether archive selection is deterministic.
- How workspace dependencies and external dependencies/peers are resolved.
- Whether the script assumes obsolete package names or archive paths.
- Whether any existing caller depends on the current command-line interface or output format.

Do not execute the existing destructive workflow before establishing its effects.

## Phase 2 — Minimal safe correction

Implement only the corrections justified by inspection.

Requirements:
1. Use a new, unique scratch directory for each run. Never recursively delete a pre-existing shared fixture directory.
2. Generate package archives into an explicit scratch destination outside package roots.
3. Select archives deterministically by canonical package identity and validate the selected archive before consuming it.
4. Resolve the required internal package dependency closure and declared external dependencies/peers without silently masking missing dependencies.
5. Clean up only directories and files created by the current invocation. If ownership of a path cannot be established, preserve it.
6. Preserve the existing interface unless a concrete incompatibility requires a documented adjustment.
7. Keep the script compatible with the repository's supported Node.js version and package manager.
8. Do not modify package APIs, package manifests, workspace topology, or unrelated scripts merely to accommodate the test workflow.

If the script's intended behavior cannot be established safely, stop and report the blocker rather than guessing.

## Phase 3 — Validation

Use fresh, isolated scratch paths and non-destructive tests.

- Add or update focused tests for scratch-path isolation, deterministic archive selection, missing-archive failures, dependency-resolution failures, and cleanup ownership.
- Test that pre-existing consumer fixtures and the preserved Button tarball remain byte-for-byte unchanged.
- Exercise the corrected workflow using freshly packed canonical packages where feasible.
- Confirm that no archive is generated in a package root.
- Run the relevant package-resolution verification and `git diff --check`.
- Run `pnpm api:check` if the script change affects a governance or validation entry point.

Do not run registry-dependent installation or generated Next.js builds unless they are necessary, safe, and their effects are understood. Clearly distinguish tests and probes that actually ran from scenarios that were only inspected.

## Phase 4 — Preservation verification

Compare the final state against a baseline captured before editing.

Verify:
- All pre-existing tracked changes and untracked files are preserved.
- `.tmp/consumer-test`, `.tmp-consumer`, and the retained Button tarball are unchanged.
- `dashboard/next-env.d.ts` remains unchanged.
- No new package-root archives were created.
- No staged changes were introduced.
- Only the explicitly authorized script and focused tests changed.

Do not claim preservation based only on Git status; verify the relevant fixture contents and hashes.

## Deliverable

Create `F15_PACKAGE_ISOLATION_WORKFLOW_FINAL_AUDIT_REPORT.md` documenting:
- Verdict: PASS, PARTIAL, or FAIL.
- Original defect and concrete evidence.
- Exact files changed and why.
- Tests and commands actually executed, with exit codes.
- Dependency and archive-selection behavior.
- Preservation checks and remaining limitations.
- Final Git status summary.

Stop after F-15. Do not begin F-16 or the legacy API catalog migration until the report has been reviewed.

Suggested commit message, only if explicitly authorized later:

`fix: isolate package consumer validation artifacts`Reference Audit — Final Report

Date: 2026-10-15

**Verdict: PARTIAL.** All 28 current library manifests use the canonical namespace, and the audited literal source imports resolve to known exported package paths. Twelve targeted files were corrected after concrete failures were established. Those corrections passed focused validation. Legacy documentation extraction/catalog defects and an unsafe older isolation workflow remain unresolved; no invented API mappings or broad cleanup was applied.

## Scope and methodology

The audit stayed inside Skyra Platform. Initial Git status, staged diff, unstaged diff summary, package manifests, workspace definitions, scripts, exports, TypeScript/build configuration, governance targets, README snippets, Dashboard documentation metadata/routes, CI/release configuration, and tracked external-consumer fixtures were inspected. Searches used rg plus a TypeScript AST inventory to distinguish imports from comments and metadata. Git-tracked hidden files were included; ignored historical audit scratch was not recursively rewritten or treated as active tooling.

The workspace consists of packages/* and Dashboard. Its 28 package names have prefix `@skyra-tech-platform/`:

accordion, app-shell, button, checkbox, collapsible, command-palette, context-menu, data-export, data-table, date-time, design-tokens, dialog, dropdown-menu, dynamic-form, dynamic-select, input, loader, notification, pdf-viewer, popover, qr, radio, switch, tabs, textarea, toast, utils, validation.

No missing or obsolete internal dependency name was found in the 28 manifests. Package APIs, export maps, dependency declarations, versions, sideEffects fields, files whitelists, scripts and workspace topology were left unchanged. The root project name `skyra-platform` and private Dashboard name are intentional unscoped workspace names.

An AST scan examined 406 tracked JS/TS source/config files and found 156 literal Skyra package import/export/require references, with zero unknown packages or undeclared export subpaths. Computed imports require separate inspection: Dynamic Form's explicit dependency list uses current canonical packages. Shell here-docs, Markdown snippets and documentation metadata were audited separately rather than mistaken for AST import nodes. TypeScript's `@/*` alias is Dashboard-local, not an obsolete npm namespace. Shared build configuration refers to canonical QR naming; governance targets are canonical and their legacy comments explain historical migrations.

## Findings and remediation

Locations marked **original** refer to the captured pre-F-14 version; current changes may shift lines. Confidence is high unless explicitly stated otherwise. Severity describes impact, not an asserted security incident.

| ID | Exact location / key | Reference and concrete impact | Minimal action, risk and status |
| --- | --- | --- | --- |
| F14-001 | .github/workflows/release.yml:34; .npmrc.example:4–5 | `@skyra:registry` does not match any of the 28 current package scopes. A scope-specific npm mapping for @skyra cannot route @skyra-tech-platform packages to Azure. | **Fixed**, High confidence / High severity: replace only the scope with @skyra-tech-platform. Endpoint/auth placeholders retained. No actual registry/auth/publish operation was performed; deployment configuration must still supply real Azure values. |
| F14-002 | scripts/external-consumer-validation.sh, original lines 26–48, 89, 123–137 | Node tarballs/imports use skyra-utils, skyra-data-export, skyra-validation and @skyra/*; Next fixture requests removed skyra-ui/skyra-dialogs artifacts and imports React Button/styles from @skyra/ui. Fresh canonical archives have different names and no UI package exists. | **Fixed**, High / High: canonical Node filenames/imports; Next installs the canonical archive set (including internal dependency closure) and imports Button/QR Web Components plus published token CSS. Typed React JSX augmentation and a client directive make the template match its actual consumer model. No package API/dependency changes. Installing all archives increases the Next fixture's dependency footprint; its full network-driven run is not certified here. |
| F14-003a | packages/data-table/README.md, original lines 1, 11, 15–23 | Deprecated @skyra/data-table and non-exported React DataTable/Pagination API. Original import produces TS2307; canonical declarations export SkyraTechDataTable and processTableData. | **Fixed**, High / Medium: canonical installation and element-property example using real columns/data properties. No React wrapper promised. |
| F14-003b | packages/dynamic-form/README.md, original lines 1, 11, 15–42 | Deprecated @skyra/dynamic-form, unsupported React DynamicForm/config interface and incorrect React peer requirements. Actual manifest has workspace component dependencies. | **Fixed**, High / Medium: canonical import, real fields/values properties and skyra-submit event. Removed unsupported peer/API claims. |
| F14-003c | packages/app-shell/README.md, original lines 15–29 | ApplicationShell/Sidebar/Header React exports do not exist; named ApplicationShell import produces TS2305. Actual registration is explicit. | **Fixed**, High / Medium: registerAppShell(), published styles.css and actual named slots; list real exports. |
| F14-003d | packages/data-export/README.md, original lines 19–21 | generateCsv is not exported (TS2305); current API is exportToCsv(data, options). | **Fixed**, High / Medium: correct symbol and column-options example; API unchanged. |
| F14-003e | packages/notification/README.md, original lines 1, 19, 33 | README is copied Button documentation; its import registers Button, not Notification. | **Fixed**, High / Medium: actual Notification import, canonical/legacy tags, title/default slots and real exports. |
| F14-003f | packages/toast/README.md, original lines 1, 19, 33 | README is copied Button documentation and never imports Toast. | **Fixed**, High / Medium: actual toast API and viewport behavior; no Button dependency claimed by the example. |
| F14-004 | dashboard/src/app/(dashboard)/packages/[slug]/[capability]/page.tsx, original lines 15, 23, 33, 40; corresponding [api]/page.tsx, original lines 16, 24–43 | Removing only @skyra/ leaves canonical slugs containing scope/slashes. Canonical API records are then looked up using @skyra IDs and fail. Dialog package slug is singular while its existing capability ID is dialogs/core. Regression probe reproduced invalid static params, missing dialog capability metadata and missing canonical utils API metadata. | **Fixed**, High / High: derive package slugs from the final name segment; find capabilities using stored package identity; look up canonical API IDs first and retain existing legacy-ID fallback; use the resolved record for package/capability/example/release joins. Existing historical UI lookup remains supported inside documentation. No npm alias or public compatibility API was introduced or removed. Production Next routing remains untested. |
| F14-005 | dashboard/src/app/(dashboard)/releases/page.tsx:133 | Canonical name replacement yields /packages/@skyra-tech-platform/utils instead of /packages/utils. Current releases data is empty, so this is a reproducible valid-input defect rather than an observed live release click. | **Fixed**, High / Medium: derive the final package segment. Deterministic old/new URL probe passed. |
| F14-006 | dashboard/scripts/extract-api.ts:11 and :14, TARGETS | Targets @skyra/dialogs and @skyra/ui reference packages/dialogs/dist/index.d.ts and packages/ui/dist/index.d.ts; both paths are absent. The extractor unconditionally adds those files before writing output, so it cannot complete against current checkout. | **Unresolved**, High / High. Dialog package identity is established as @skyra-tech-platform/dialog, but removed UI APIs have no single canonical replacement. Correcting only one path leaves extraction broken; deleting or relabeling old APIs would require a deliberate catalog/schema migration. Script was not executed because it writes existing generated catalog data. |
| F14-007 | dashboard/src/docs-system/data/apis.json:1089–1093 and other packageId/exportPath fields; bootstrap.ts:47, :247–249; behavioral-metadata.ts:6, :25, :56; data/examples.json:15, :23–24, :31 and source annotations | 471 catalog records include 316 @skyra/ui and 9 @skyra/dialogs APIs, totaling **325 records for nonexistent current packages**. Bootstrap still advertises a UI capability without a matching package manifest. Examples/behavior records retain removed React symbol identities, while actual imports use Web Components. | **Unresolved**, High / High. Blind prefix substitution would falsely publish ConfirmDialog, DataTable, DynamicForm, Button and other old React signatures as current Web Component APIs. Generated data, source example identities and behavioral joins were preserved. A supported migration must regenerate from current declarations and explicitly retire/map old records without inventing compatibility. |
| F14-008 | scripts/test-package-isolation.mjs:5–14 and tarball selection immediately afterward | Older consumer workflow deletes existing .tmp-consumer recursively, invokes pnpm pack without a scratch destination (creating a package-root archive), then selects the first .tgz. Current .tmp-consumer/package.json is tracked baseline work. | **Unresolved**, High / Medium: script was inspected but not run. A future isolated-consumer redesign should use a new unique scratch directory, explicit archive destination and deterministic selection, with dependency closure. It was not conflated with a namespace-only edit or used to overwrite preserved fixtures. |

The 12 changed files are exactly the two registry configuration/example files, the shell consumer script, six READMEs, two nested documentation routes and the releases route. All were initially unmodified. No production library source, package manifest, existing report or generated API/example catalog was rewritten.

### References intentionally retained

Historical audit reports, prior test-output logs, governance migration comments and negative tests mention @skyra/ui or @skyra/dialogs intentionally. F-09 canonical and legacy custom-element tag registrations are runtime compatibility, not npm package names, and remain untouched. Component comments identifying former @skyra/ui ownership and hypothetical @skyra/invoice plans were not interpreted as live imports. Illustrative @skyra/core-engine demo text is not an installed dependency or import target.

React examples in Command Palette, Context Menu and Dropdown Menu READMEs use `@/components/ui`, whose exports exist in Dashboard. These are local wrapper integrations, not npm exports. Their standalone external portability is limited by that local alias; wrapper APIs were not automatically renamed into package exports. Existing registry aliases and legacy documentation lookup fallback were preserved. No search-and-replace cleanup of all legacy strings was performed.

The retained Button tarball dependency in the tracked .tmp/consumer-test fixture points to the existing Button archive, whose preservation was established during F-08. It was not treated as an obsolete namespace or deleted. .tmp-consumer has an empty dependency map. Neither existing fixture was reinstalled or overwritten.

## Validation actually executed

All successful package/test/probe executions below are fresh direct runs, not Turbo cache-only results. Scratch scripts, fresh archives and isolated consumers are exclusively under ignored .tmp/f14.

| Exact command / operation | Actual exit | Meaningful result |
| --- | ---: | --- |
| `node scripts/verify-package-resolution.mjs` | 0 | 11 existing consumer cases: declaration resolution in NodeNext .mts/.cts and Bundler modes, invalid-target/missing-declaration negative checks, ESM/CJS runtime checks and invalid-subpath rejection; covers a subset of packages, not all 28 |
| `node .tmp/f14/check.cjs` | 0 | Reproduced rejected obsolete namespaces and missing named exports; corrected ESM and React TSX templates typecheck; ESM/CJS shell templates execute against workspace packages; all six corrected README consumers bundle/run in isolated jsdom, with App Shell CSS emitted; registry scope and release URL checked |
| `node .tmp/f14/routes.cjs` | 0 | Actual extracted route functions reproduce original failures and pass canonical static-param/metadata cases; historical UI metadata lookup preserved |
| `node .tmp/f14/packed.cjs`, first attempt | 1 | Fixture omitted Validation's declared Zod peer; packed ESM import correctly failed with ERR_MODULE_NOT_FOUND. No package metadata or source was changed to bypass it |
| `node .tmp/f14/packed.cjs`, corrected attempt, log packed-corrected.log | 0 | New consumer-2 scratch directory, same fresh archives, declared peer supplied from installed vendor dependency; first failed fixture/log retained. Packed ESM/CJS templates execute; packed browser template bundles and retains QR/Button registrations and token CSS |
| `pnpm --filter dashboard typecheck`, initial and final after route changes | 0, 0 | Existing generate:data and tsc --noEmit executed; all protected content unchanged |
| `pnpm api:check` | 0 | Existing API governance checks passed; their target list is not an exhaustive validation of the legacy Dashboard catalog |
| `& 'C:/Program Files/Git/bin/bash.exe' -n scripts/external-consumer-validation.sh`, sandbox attempt | -1073741502 | Git Bash could not initialize its Windows shared object in sandbox; no shell script body executed |
| Same Bash syntax command with approved execution outside sandbox | 0 | Syntax valid; -n does not execute cleanup/install/build commands |
| `git diff --check` | 0 | No whitespace errors; manifest/config LF/CRLF conversion notices remain |
| `git diff --cached --quiet` | 0 | No staged changes |

Archive generation ran `pnpm pack --pack-destination ../../.tmp/f14/tarballs` from each of the following package directories. Each command exited **0**:

`packages/accordion`, `packages/app-shell`, `packages/button`, `packages/checkbox`, `packages/collapsible`, `packages/command-palette`, `packages/context-menu`, `packages/data-export`, `packages/data-table`, `packages/date-time`, `packages/design-tokens`, `packages/dialog`, `packages/dropdown-menu`, `packages/dynamic-form`, `packages/dynamic-select`, `packages/input`, `packages/loader`, `packages/notification`, `packages/pdf-viewer`, `packages/popover`, `packages/qr`, `packages/radio`, `packages/switch`, `packages/tabs`, `packages/textarea`, `packages/toast`, `packages/utils`, `packages/validation`.

This generated 28 canonical archive filenames. All were inspected/extracted into new scratch node_modules trees, never over repository files. Packed dependency ranges were checked to reject leftover workspace: ranges. Read-only checks verified all **90 export targets** from the 28 extracted manifests exist. The corrected Next fixture's canonical archive glob therefore matches the complete generated set. Browser bundling uses real packed platform files; existing external vendor dependencies/peers were linked inside scratch rather than fetched. This is not a claim that a registry-backed install or a full generated Next application build passed.

Focused existing package test commands:

| Exact command | Exit | Passed tests / files |
| --- | ---: | ---: |
| `pnpm --filter @skyra-tech-platform/app-shell test` | 0 | 7 / 1 |
| `pnpm --filter @skyra-tech-platform/data-export test` | 0 | 20 / 4 |
| `pnpm --filter @skyra-tech-platform/data-table test` | 0 | 11 / 1 |
| `pnpm --filter @skyra-tech-platform/dynamic-form test` | 0 | 10 / 2 |
| `pnpm --filter @skyra-tech-platform/notification test` | 0 | 9 / 2 |
| `pnpm --filter @skyra-tech-platform/toast test` | 0 | 9 / 2 |

**66 tests passed across 12 files.** Notification used its existing coverage-enabled test script. No test was suppressed or duplicated. Package library builds/typechecks were not rerun: no library code/config/metadata changed, and archive/import probes used existing outputs from earlier verified builds. Only Dashboard source changed, and its actual compiler check ran after the final route edits.

No root lint/typecheck was claimed or run for F-14; the known workspace placeholders, omissions and caching would not establish comprehensive validation of namespace references. No production Dashboard build/dev command was run. The full external-consumer shell script was not run end to end: it deletes shared consumer directories, installs from registries, runs create-next-app@latest and builds a generated Next app. Instead its corrected templates, syntax, actual archive names, peer/dependency closure and import/bundler behavior were independently exercised in fresh scratch paths. This does not certify external registry availability, Azure authentication, CI release behavior, future framework versions, or full Next routing/rendering. Route probes call current synchronous function contracts; they do not establish production Next parameter lifecycle behavior.

## Preservation and final Git state

Initial baseline: 547 tracked and non-ignored untracked files; 21 modified tracked files, four untracked prior reports, no staged changes. Initial diff relative to HEAD was 21 files, 29 insertions and 1 deletion. SHA-256 comparison now identifies only the **12 authorized F-14 files** above; the other **535 files match byte-for-byte**. Every pre-existing modified manifest and pre-existing untracked report remains unchanged. Manifests, F-11 typecheck scripts, F-12 sideEffects fields, F-10 publication whitelists and F-09 registrations/tests matched their initial hashes. Existing generated API/example data and preserved fixture files also matched. Ignored tooling caches are not part of this Git-visible hash inventory.

The protected Dashboard next-env file remains exactly its captured development-route version, SHA-256 `083e23c4c5e7761db151134ea1ef7896120c86c5888cdc8a861f534f7e86d6fd`. The unresolved F-11 discrepancy was neither restored nor changed. No preservation discrepancy was detected in the captured inventory.

The sole tracked/retained package-root archive is still `packages/button/skyra-tech-platform-button-0.1.0.tgz`; no new package-root tarball was generated. F-08 cleanup remains intact. Fresh archives, failed/corrected consumer fixtures and logs stay under the new ignored .tmp/f14 directory. No old evidence/report was overwritten.

Final tracked diff relative to HEAD: **33 files, 139 insertions, 202 deletions**, including all initial work. Only 12 of those tracked files are newly changed by F-14. This report is the only new visible untracked file; the four previous reports remain untracked. Final status:

```text
 M .github/workflows/release.yml
 M .npmrc.example
 M dashboard/next-env.d.ts
 M dashboard/src/app/(dashboard)/packages/[slug]/[capability]/[api]/page.tsx
 M dashboard/src/app/(dashboard)/packages/[slug]/[capability]/page.tsx
 M dashboard/src/app/(dashboard)/releases/page.tsx
 M packages/app-shell/README.md
 M packages/app-shell/package.json
 M packages/collapsible/package.json
 M packages/command-palette/package.json
 M packages/context-menu/package.json
 M packages/data-export/README.md
 M packages/data-export/package.json
 M packages/data-table/README.md
 M packages/data-table/package.json
 M packages/date-time/package.json
 M packages/design-tokens/package.json
 M packages/dialog/package.json
 M packages/dropdown-menu/package.json
 M packages/dynamic-form/README.md
 M packages/dynamic-form/package.json
 M packages/loader/package.json
 M packages/notification/README.md
 M packages/notification/package.json
 M packages/pdf-viewer/package.json
 M packages/popover/package.json
 M packages/qr/package.json
 M packages/tabs/package.json
 M packages/toast/README.md
 M packages/toast/package.json
 M packages/utils/package.json
 M packages/validation/package.json
 M scripts/external-consumer-validation.sh
?? F11_DASHBOARD_GENERATED_FILE_INVESTIGATION_REPORT.md
?? F11_PACKAGE_TYPECHECK_SCRIPTS_FINAL_AUDIT_REPORT.md
?? F12_PACKAGE_SIDE_EFFECTS_AUDIT_FINAL_REPORT.md
?? F13_SHARED_BUILD_CONFIGURATION_FINAL_AUDIT_REPORT.md
?? F14_PACKAGE_NAMESPACE_AND_CONSUMER_AUDIT_FINAL_REPORT.md
```

No stage, commit, push, pull, branch switch, reset, clean, discard, revert or history rewrite was performed. ERP and QR-generator files were not modified. Stop after F-14 for review; unresolved findings are documented, not claimed resolved.

User-specified message for a future explicitly authorized commit only:

```text
audit: verify package namespaces and consumer references
```
