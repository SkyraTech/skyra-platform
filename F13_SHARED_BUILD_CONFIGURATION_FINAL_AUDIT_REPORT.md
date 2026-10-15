# F-13 Shared TypeScript and Build Configuration — Final Audit Report

Date: 2026-10-15

**Verdict: PASS (audit completed; no configuration change justified).** Both reported React-specific settings exist. Inspection and execution establish no demonstrated defect in current framework-agnostic consumers. Per the task instruction to avoid unnecessary changes when no defect is demonstrated, both shared configurations are retained unchanged. Dashboard JSX requirements remain satisfied. Its full Next build was deliberately not run because it writes the protected next-env file; the limitations below remain explicit. No F-14 work was started.

## Finding, consumers, and boundaries

The shared base declares `jsx: "react-jsx"`. Eighteen package projects and the Next.js Dashboard extend it. No package project contains a JSX/TSX root file; repository package source inspection found no JSX files or React runtime imports. No package declares React as a runtime dependency or peer. Dynamic Form has a lucide-react development dependency, but no production import was found; it does not establish a React-dependent package. PDF Viewer separately declares react-jsx in its standalone config, without JSX inputs; that unrelated local setting was not changed.

All 28 package configs were inspected. The exact package inheritance inventory is:

| Package | Extends shared base | Effective JSX | JSX/TSX root files | Build config |
| --- | --- | --- | ---: | --- |
| accordion | no | unset | 0 | package tsup |
| app-shell | yes | ReactJSX | 0 | shared tsup |
| button | yes | ReactJSX | 0 | package tsup |
| checkbox | yes | ReactJSX | 0 | package tsup |
| collapsible | no | unset | 0 | package tsup |
| command-palette | yes | ReactJSX | 0 | package tsup |
| context-menu | no | unset | 0 | package tsup |
| data-export | yes | ReactJSX | 0 | shared tsup |
| data-table | yes | ReactJSX | 0 | shared tsup |
| date-time | no | unset | 0 | package tsup |
| design-tokens | yes | ReactJSX | 0 | shared tsup |
| dialog | no | unset | 0 | package tsup |
| dropdown-menu | no | unset | 0 | package tsup |
| dynamic-form | yes | ReactJSX | 0 | shared tsup |
| dynamic-select | yes | ReactJSX | 0 | package tsup |
| input | yes | ReactJSX | 0 | package tsup |
| loader | no | unset | 0 | package tsup |
| notification | yes | ReactJSX | 0 | package tsup |
| pdf-viewer | no | ReactJSX | 0 | package tsup |
| popover | no | unset | 0 | package tsup |
| qr | yes | ReactJSX | 0 | package tsup |
| radio | yes | ReactJSX | 0 | package tsup |
| switch | yes | ReactJSX | 0 | package tsup |
| tabs | no | unset | 0 | package tsup |
| textarea | yes | ReactJSX | 0 | package tsup |
| toast | yes | ReactJSX | 0 | package tsup |
| utils | yes | ReactJSX | 0 | shared tsup |
| validation | yes | ReactJSX | 0 | shared tsup |

Classification: App Shell and component/control/overlay/layout packages are framework-agnostic Web Components. Data Export, Design Tokens, Utils and Validation provide data/constants/functions/schemas without React. QR combines a pure core with a Web Component entry. No genuinely React-dependent library package was identified. Dashboard is the React/Next.js consumer, containing 143 TSX project files.

Seven packages consume the shared tsup config through their build scripts: App Shell, Data Export, Data Table, Design Tokens, Dynamic Form, Utils and Validation. Others use local tsup configs. Shared configuration sets general ESM/CJS output, declaration generation, no splitting, sourcemaps and clean builds. Its React-specific branches are:

- `external: ["react", "react-dom"]`: controls resolution only when those module imports exist. None of the seven consumers imports them, so this does not change their current bundled contents or inject a React dependency.
- `isReactPackage` detects a React peer dependency; the `"use client"` banner is conditional on that and not-QR. All seven current consumers have no such peer, so no banner is emitted.
- Shared QR entry selection is currently unused: QR uses its local tsup config. It was not removed as unrelated dead-branch cleanup.

The seven inspected shared-tsup ESM outputs contain no React runtime imports or use-client banner. General externalization/bundling/declaration behavior was preserved. No documented current consumer requiring a change to this behavior was found.

## Evidence and before/after behavior

**No configuration, production source, manifest, or test edits were made.** Before and after options are identical. All strictness, target, resolution, declaration, path, module and JSX settings remain unchanged.

An in-memory TypeScript transpile comparison checked 129 source/test .ts inputs from the 25 selected projects with their effective options, then with the JSX option omitted. JavaScript output matched for all 129. This demonstrates lack of JSX transformation/runtime injection in these actual inputs; this comparison alone is not a full semantic typecheck. Direct genuine compiler checks below supply project type validation. No new React runtime import was inferred merely from the presence of a JSX option.

Moving JSX to Dashboard could improve organizational separation, but no current defect warrants that change under this task. It would otherwise require preserving the same Dashboard mode explicitly. Installed Next.js 16.2.12 `dist/lib/typescript/writeConfigurationDefaults.js` identifies react-jsx as required for its React automatic runtime. Dashboard currently receives exactly that setting.

A non-writing compiler probe transpiled all 143 Dashboard TSX files using its unchanged effective configuration: zero syntax diagnostics and 142 outputs containing react/jsx-runtime. One TSX input requires no runtime import. This confirms automatic JSX transformation remains enabled; it does not substitute for a production Next/SWC build.

Fresh builds retained all 105 captured ESM/CJS JavaScript and .d.ts/.d.cts outputs byte-for-byte. This includes existing public entry outputs and QR shared chunks. No declaration or runtime output regression was observed. No configuration regression test was added because there was no implementation change.

## Validation commands and actual results

Each command in this table ran directly through the package script, not through a cached Turbo task. The 25 projects are the union of 18 shared-base consumers and the eight F-11 packages (Command Palette belongs to both). All commands have actual exit code 0. Tests ran using existing scripts.

| Package | Exact compiler command (exit 0) | Exact build command (exit 0) | Exact test command (exit 0) | Tests / files passed |
| --- | --- | --- | --- | --- |
| app-shell | `pnpm --filter @skyra-tech-platform/app-shell typecheck` | `pnpm --filter @skyra-tech-platform/app-shell build` | `pnpm --filter @skyra-tech-platform/app-shell test` | 7 / 1 |
| button | `pnpm --filter @skyra-tech-platform/button typecheck` | `pnpm --filter @skyra-tech-platform/button build` | `pnpm --filter @skyra-tech-platform/button test` | 39 / 1 |
| checkbox | `pnpm --filter @skyra-tech-platform/checkbox typecheck` | `pnpm --filter @skyra-tech-platform/checkbox build` | `pnpm --filter @skyra-tech-platform/checkbox test` | 12 / 1 |
| command-palette | `pnpm --filter @skyra-tech-platform/command-palette typecheck` | `pnpm --filter @skyra-tech-platform/command-palette build` | `pnpm --filter @skyra-tech-platform/command-palette test` | 19 / 2 |
| data-export | `pnpm --filter @skyra-tech-platform/data-export typecheck` | `pnpm --filter @skyra-tech-platform/data-export build` | `pnpm --filter @skyra-tech-platform/data-export test` | 20 / 4 |
| data-table | `pnpm --filter @skyra-tech-platform/data-table typecheck` | `pnpm --filter @skyra-tech-platform/data-table build` | `pnpm --filter @skyra-tech-platform/data-table test` | 11 / 1 |
| design-tokens | `pnpm --filter @skyra-tech-platform/design-tokens typecheck` | `pnpm --filter @skyra-tech-platform/design-tokens build` | `pnpm --filter @skyra-tech-platform/design-tokens test` | 3 / 1 |
| dynamic-form | `pnpm --filter @skyra-tech-platform/dynamic-form typecheck` | `pnpm --filter @skyra-tech-platform/dynamic-form build` | `pnpm --filter @skyra-tech-platform/dynamic-form test` | 10 / 2 |
| dynamic-select | `pnpm --filter @skyra-tech-platform/dynamic-select typecheck` | `pnpm --filter @skyra-tech-platform/dynamic-select build` | `pnpm --filter @skyra-tech-platform/dynamic-select test` | 15 / 1 |
| input | `pnpm --filter @skyra-tech-platform/input typecheck` | `pnpm --filter @skyra-tech-platform/input build` | `pnpm --filter @skyra-tech-platform/input test` | 8 / 1 |
| notification | `pnpm --filter @skyra-tech-platform/notification typecheck` | `pnpm --filter @skyra-tech-platform/notification build` | `pnpm --filter @skyra-tech-platform/notification test` | 9 / 2 |
| qr | `pnpm --filter @skyra-tech-platform/qr typecheck` | `pnpm --filter @skyra-tech-platform/qr build` | `pnpm --filter @skyra-tech-platform/qr test` | 39 / 5 |
| radio | `pnpm --filter @skyra-tech-platform/radio typecheck` | `pnpm --filter @skyra-tech-platform/radio build` | `pnpm --filter @skyra-tech-platform/radio test` | 8 / 1 |
| switch | `pnpm --filter @skyra-tech-platform/switch typecheck` | `pnpm --filter @skyra-tech-platform/switch build` | `pnpm --filter @skyra-tech-platform/switch test` | 7 / 1 |
| textarea | `pnpm --filter @skyra-tech-platform/textarea typecheck` | `pnpm --filter @skyra-tech-platform/textarea build` | `pnpm --filter @skyra-tech-platform/textarea test` | 16 / 1 |
| toast | `pnpm --filter @skyra-tech-platform/toast typecheck` | `pnpm --filter @skyra-tech-platform/toast build` | `pnpm --filter @skyra-tech-platform/toast test` | 9 / 2 |
| utils | `pnpm --filter @skyra-tech-platform/utils typecheck` | `pnpm --filter @skyra-tech-platform/utils build` | `pnpm --filter @skyra-tech-platform/utils test` | 169 / 5 |
| validation | `pnpm --filter @skyra-tech-platform/validation typecheck` | `pnpm --filter @skyra-tech-platform/validation build` | `pnpm --filter @skyra-tech-platform/validation test` | 80 / 2 |
| collapsible | `pnpm --filter @skyra-tech-platform/collapsible typecheck` | `pnpm --filter @skyra-tech-platform/collapsible build` | `pnpm --filter @skyra-tech-platform/collapsible test` | 10 / 2 |
| context-menu | `pnpm --filter @skyra-tech-platform/context-menu typecheck` | `pnpm --filter @skyra-tech-platform/context-menu build` | `pnpm --filter @skyra-tech-platform/context-menu test` | 19 / 2 |
| date-time | `pnpm --filter @skyra-tech-platform/date-time typecheck` | `pnpm --filter @skyra-tech-platform/date-time build` | `pnpm --filter @skyra-tech-platform/date-time test` | 14 / 1 |
| dialog | `pnpm --filter @skyra-tech-platform/dialog typecheck` | `pnpm --filter @skyra-tech-platform/dialog build` | `pnpm --filter @skyra-tech-platform/dialog test` | 26 / 1 |
| dropdown-menu | `pnpm --filter @skyra-tech-platform/dropdown-menu typecheck` | `pnpm --filter @skyra-tech-platform/dropdown-menu build` | `pnpm --filter @skyra-tech-platform/dropdown-menu test` | 18 / 2 |
| popover | `pnpm --filter @skyra-tech-platform/popover typecheck` | `pnpm --filter @skyra-tech-platform/popover build` | `pnpm --filter @skyra-tech-platform/popover test` | 18 / 2 |
| tabs | `pnpm --filter @skyra-tech-platform/tabs typecheck` | `pnpm --filter @skyra-tech-platform/tabs build` | `pnpm --filter @skyra-tech-platform/tabs test` | 18 / 3 |

**Total: 604 tests passed across 47 test files.** Registration suites and existing Dialog/Date-time tests ran. QR keeps its existing passWithNoTests script, but actually discovered 39 tests; no empty-test success was counted. Notification used its existing coverage-enabled script. Existing warning/error diagnostics printed during passing package tests were not suppressed.

| Exact command / probe | Actual exit | Result |
| --- | ---: | --- |
| `pnpm --filter dashboard typecheck` | 0 | Existing generate:data then tsc --noEmit executed; protected file unchanged |
| `pnpm --filter dashboard build` | Not executed | Unsafe for protected generated file; explanation below |
| `pnpm typecheck` | 0 | 57 successful, 57 cached Turbo tasks; not fresh workspace compiler execution |
| `pnpm lint` | 0 | 45 successful, 45 cached Turbo tasks; known placeholders/omissions; not comprehensive genuine lint validation |
| `pnpm api:check` | 0 | Actual governance script ran; all checks passed |
| `git diff --check` | 0 | No whitespace errors; pre-existing manifest LF/CRLF notices only |
| In-memory package TypeScript comparison via Node stdin | 0 | 129 inputs, zero output differences with JSX omitted |
| Non-writing Dashboard TSX transpilation via Node stdin | 0 | 143 TSX inputs, zero syntax diagnostics, automatic runtime output verified |

The eight F-11 scripts ran first; an additional 17 shared-base compiler checks ran directly after the root command returned cached results. Each actual package command invoked tsc --noEmit. Full project root file scope remains unchanged; test type safety is limited by existing includes/excludes (for example Dialog tests are outside its project, Date-time tests are inside). Tests and compiler checks are not conflated.

Logs and snapshots are under ignored `.tmp/f13/`: inventory.json, selected.json, typecheck-*.log, typecheck-results.json, inherited-typecheck-results.json, build-*.log, build-results.json, test-*.log, test-results.json, dashboard-typecheck.log, dashboard-jsx-probe.json, compiler-probe.json, workspace-typecheck.log, workspace-lint.log, api-check.log and preservation/output snapshots. No network/registry failure blocked an executed validation gate.

The initial combined validation launch did not execute: automatic approval review timed out before its deadline. It was retried once as smaller, reviewable commands; these succeeded. An initial rg path used a Windows-unexpanded wildcard; filesystem-aware inspection was used instead. Neither event was treated as a passing check.

## Dashboard build and compatibility limits

Dashboard build is `npm run generate:data && next build`. Installed Next build/type-check.js invokes verifyAndRunTypeScript, whose implementation calls writeConfigurationDefaults and writeAppTypeDeclarations. The latter writes next-env.d.ts from distDir; development config appends /dev while production does not. A production build therefore can replace the protected .next/dev/types import with .next/types. It was not run, and no temporary overwrite/restore trick was used. No dev server was launched or stopped.

Dashboard typecheck was safe after inspection: its data generators write docs metadata/mapping/release data, not next-env; tsc --noEmit does not invoke the Next writer. Its JSX transformation probe writes nothing. These are the strongest validations performed here; production Next routing, SWC output, asset generation and deployment behavior remain unverified in F-13. No dependency or compiler option was weakened to bypass that restriction.

Current package builds and unchanged output hashes verify the present inputs only; a future package adding JSX or React imports should explicitly review its configuration boundary. This task does not claim the shared base is an ideal long-term design or guarantee hypothetical consumers. Existing dependency skipLibCheck settings remain, and no extra declarations/library checking was added.

## Preservation and final scope

Initial Git state: 21 modified tracked files (Dashboard generated file and 20 manifests), three untracked F-11/F-12 reports, no staged changes. Diff relative to HEAD: 21 files, 29 insertions, 1 deletion. SHA-256 baseline covered 546 existing tracked/untracked files.

Final comparison: **all 546 existing files match the baseline exactly**. No configurations changed. The eight F-11 scripts, F-12 sideEffects fields, F-10 whitelists, F-09 sources/tests, earlier reports and Playground work remain intact. All 105 captured relevant dist outputs also match their pre-build hashes. No pre-existing untracked work was overwritten. Dashboard next-env hash remains `083e23c4c5e7761db151134ea1ef7896120c86c5888cdc8a861f534f7e86d6fd`; its unresolved discrepancy is unchanged. No preservation discrepancy was detected.

Only the new F-13 report is an intentional visible addition; ignored scratch evidence is under .tmp/f13. F-08 tarball cleanup remains intact: no archive generated, sole pre-existing tracked package-root tarball is the Button fixture. No ERP or QR-generator changes.

Final status:

```text
 M dashboard/next-env.d.ts
 M packages/app-shell/package.json
 M packages/collapsible/package.json
 M packages/command-palette/package.json
 M packages/context-menu/package.json
 M packages/data-export/package.json
 M packages/data-table/package.json
 M packages/date-time/package.json
 M packages/design-tokens/package.json
 M packages/dialog/package.json
 M packages/dropdown-menu/package.json
 M packages/dynamic-form/package.json
 M packages/loader/package.json
 M packages/notification/package.json
 M packages/pdf-viewer/package.json
 M packages/popover/package.json
 M packages/qr/package.json
 M packages/tabs/package.json
 M packages/toast/package.json
 M packages/utils/package.json
 M packages/validation/package.json
?? F11_DASHBOARD_GENERATED_FILE_INVESTIGATION_REPORT.md
?? F11_PACKAGE_TYPECHECK_SCRIPTS_FINAL_AUDIT_REPORT.md
?? F12_PACKAGE_SIDE_EFFECTS_AUDIT_FINAL_REPORT.md
?? F13_SHARED_BUILD_CONFIGURATION_FINAL_AUDIT_REPORT.md
```

Final tracked diff/status remain the initial ones; the F-13 report adds one untracked file. No staged diff (git diff --cached --quiet exit 0). No commit, staging, push, pull, branch change, history rewrite, reset, clean, discard or revert occurred. Stop for review after F-13.

## Suggested commit message

```text
docs: audit shared TypeScript and build configuration
```
