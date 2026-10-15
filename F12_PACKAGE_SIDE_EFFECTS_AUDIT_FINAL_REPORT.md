# F-12 Package sideEffects Audit — Final Report

Date: 2026-10-15

**Verdict: PASS.** Confirmed 20 missing fields among 28 package manifests. Added evidence-based metadata to those 20 only. All builds, focused tests, bundler probes, and required workspace commands passed. Prior work, including the unresolved Dashboard generated file, was preserved. No F-13 work was started.

## Complete inventory and rationale

Names below have prefix `@skyra-tech-platform/`. `missing` describes the captured pre-edit state.

| Package | Before | After | Import/registration and styling evidence |
| --- | --- | --- | --- |
| accordion | true | `true` | Existing true retained; source registration on import matches conservative metadata. |
| app-shell | missing | `["./src/styles.css"]` | Explicit registerAppShell() only; no import-time registration. Preserve exported src/styles.css. |
| button | true | `true` | Existing true retained; source registration on import matches conservative metadata. |
| checkbox | true | `true` | Existing true retained; source registration on import matches conservative metadata. |
| collapsible | missing | `true` | Public index imports/re-exports modules that define Custom Elements at module scope; true preserves automatic registration and associated component styles. |
| command-palette | missing | `true` | Public index imports/re-exports modules that define Custom Elements at module scope; true preserves automatic registration and associated component styles. |
| context-menu | missing | `true` | Public index imports/re-exports modules that define Custom Elements at module scope; true preserves automatic registration and associated component styles. |
| data-export | missing | `false` | Formatting/export/download functions; DOM download effects occur only on invocation. |
| data-table | missing | `true` | Public index imports/re-exports modules that define Custom Elements at module scope; true preserves automatic registration and associated component styles. |
| date-time | missing | `true` | Public index imports/re-exports modules that define Custom Elements at module scope; true preserves automatic registration and associated component styles. |
| design-tokens | missing | `["./src/reset.css","./src/tokens.css"]` | JS exports constants/helpers only; preserve both documented exported CSS files. |
| dialog | missing | `true` | Public index imports/re-exports modules that define Custom Elements at module scope; true preserves automatic registration and associated component styles. |
| dropdown-menu | missing | `true` | Public index imports/re-exports modules that define Custom Elements at module scope; true preserves automatic registration and associated component styles. |
| dynamic-form | missing | `true` | Public index imports/re-exports modules that define Custom Elements at module scope; true preserves automatic registration and associated component styles. |
| dynamic-select | true | `true` | Existing true retained; source registration on import matches conservative metadata. |
| input | true | `true` | Existing true retained; source registration on import matches conservative metadata. |
| loader | missing | `true` | Public index imports/re-exports modules that define Custom Elements at module scope; true preserves automatic registration and associated component styles. |
| notification | missing | `true` | Public index imports/re-exports modules that define Custom Elements at module scope; true preserves automatic registration and associated component styles. |
| pdf-viewer | missing | `true` | Public index imports/re-exports modules that define Custom Elements at module scope; true preserves automatic registration and associated component styles. |
| popover | missing | `true` | Public index imports/re-exports modules that define Custom Elements at module scope; true preserves automatic registration and associated component styles. |
| qr | missing | `["./dist/skyra-tech-qr-code.js","./dist/skyra-tech-qr-code.cjs"]` | Core has no registration; web-component entry automatically defines skyra-tech-qr-code. Preserve both published ESM/CJS registering files; shared core chunks can be removed when unused. |
| radio | true | `true` | Existing true retained; source registration on import matches conservative metadata. |
| switch | true | `true` | Existing true retained; source registration on import matches conservative metadata. |
| tabs | missing | `true` | Public index imports/re-exports modules that define Custom Elements at module scope; true preserves automatic registration and associated component styles. |
| textarea | true | `true` | Existing true retained; source registration on import matches conservative metadata. |
| toast | missing | `true` | Public index imports/re-exports modules that define Custom Elements at module scope; true preserves automatic registration and associated component styles. |
| utils | missing | `false` | Pure functions and local constant tables; no global initialization. |
| validation | missing | `false` | Zod schema construction is local allocation; no global registration/configuration. |

Fourteen missing packages received `true`, three received `false`, and three received file arrays. Boolean true follows the existing eight registering-package conventions and conservatively retains any shared chunks or dependency registration. It does not disable removal of individually unused exports inside retained modules. No broad false policy was applied.

The arrays name actual published paths: App Shell already publishes `src/styles.css`; Design Tokens exports/publishes `src/reset.css` and `src/tokens.css`; QR publishes `dist`, including both registering entries and their shared chunks. Whitelists and export maps were not changed. No extra CSS asset is needed for other changed component packages: styles are embedded JavaScript strings/templates and retained with the registering implementation. QR inline styles remain in its retained element implementation.

Inspection covered public indexes, registration sites, local tsup configs/shared tsup config, source imports and module-level state, existing dist outputs and fresh outputs, and documented imports. For example Command Palette, Context Menu, Dropdown Menu, Loader and QR documentation uses bare registration imports; Dashboard globals imports token/reset CSS. App Shell documentation imports a named export and styles separately. Existing Button/Accordion and other true packages supply comparison cases.

Dynamic Form also initiates browser-guarded imports of dependent registering components at module evaluation. Toast imports Notification for its registration. Context Menu/Dropdown Menu import Popover. Listeners and most DOM/style creation occur in constructors or lifecycle/interaction methods; they are not mistaken for independent module-level global setup. PDF worker configuration occurs in component behavior; the import still registers the viewer and imports pdfjs. Utils/validation/data-export have no required import-time external mutation. Pure metadata permits dropping their unused entry modules; invoked API effects remain available.

## Actual bundler probes

Commands executed:

```powershell
node .tmp/f12/probe.cjs
node .tmp/f12/output-check.cjs
```

Available esbuild 0.27.7 (resolved through the real tsup installation) and jsdom 25.0.1 were used without installing dependencies. Fixtures and output stay under ignored `.tmp/f12/`. Actual fresh built entry paths were bundled with tree shaking/minification. No package archives or package-root tarballs were created.

The main probe exited 0: all 20 package probes passed. Side-effect-only ESM import bundles were compared against namespace-use bundles that force retention. Both were executed in separate jsdom realms, observing all customElements.define calls, including dependent registrations and F-09 aliases. Tag sets and available constructor style counts matched. App Shell explicit registerAppShell() was exercised. Exported CSS imports emitted nonempty CSS. Unused JS from the three false packages, App Shell and Design Tokens disappeared; unused QR core also disappeared.

The first supplementary output probe exited 1 because it incorrectly expected App Shell embedded styles in an intentionally unused, removed JS import. The fixture was corrected to call the explicit registration export before checking its styles; production code and metadata were not weakened. The corrected `node .tmp/f12/output-check.cjs` exited 0. It checks decoded embedded stylesheet literals containing `:host` against bundled strings, and compares registration sets of bundled CJS entries with ESM results.

| Package | Main probe | Observed automatic registrations (including dependencies) | Embedded :host styles checked | Other evidence |
| --- | --- | ---: | ---: | --- |
| app-shell | PASS | 0 | 1 | unused JS removed; CSS retained: ./src/styles.css; explicit app-shell registration passed; CJS bundle passed |
| collapsible | PASS | 2 | 1 | CJS bundle passed |
| command-palette | PASS | 2 | 1 | CJS bundle passed |
| context-menu | PASS | 10 | 4 | CJS bundle passed |
| data-export | PASS | 0 | 0 | unused JS removed; CJS bundle passed |
| data-table | PASS | 1 | 1 | CJS bundle passed |
| date-time | PASS | 6 | 6 | CJS bundle passed |
| design-tokens | PASS | 0 | 0 | unused JS removed; CSS retained: ./src/reset.css, ./src/tokens.css; CJS bundle passed |
| dialog | PASS | 1 | 1 | CJS bundle passed |
| dropdown-menu | PASS | 10 | 4 | CJS bundle passed |
| dynamic-form | PASS | 14 | 1 | CJS bundle passed |
| loader | PASS | 16 | 1 | CJS bundle passed |
| notification | PASS | 2 | 0 | CJS bundle passed |
| pdf-viewer | PASS | 1 | 1 | CJS bundle passed |
| popover | PASS | 2 | 1 | CJS bundle passed |
| qr | PASS | 1 | 0 | unused QR core removed; CJS bundle passed |
| tabs | PASS | 6 | 3 | CJS bundle passed |
| toast | PASS | 4 | 1 | CJS bundle passed |
| utils | PASS | 0 | 0 | unused JS removed; CJS bundle passed |
| validation | PASS | 0 | 0 | unused JS removed; CJS bundle passed |

Probe limits: jsdom is not browser layout/paint validation. Constructor checks and embedded-string retention do not establish every connected lifecycle/style outcome. QR inline render styles are outside the :host literal check. PDF worker/network loading and QR image rendering were not exercised by the bare-import probes. Tests provide additional behavior coverage. Probes use actual built paths with package metadata, not installed packed archives, and do not establish compatibility with every bundler/version. CJS was bundled for browser execution; native Node CJS loading was not tested here. For pure APIs, unused-module removal was verified; exhaustive optimal removal of every individual export was not claimed.

## Commands, exit codes, and tests

For each row the exact commands were `pnpm --filter @skyra-tech-platform/<package> build` and `pnpm --filter @skyra-tech-platform/<package> test`, with the literal package column substituted. Commands ran sequentially per operation using existing scripts and outputs were saved to `build-<package>.log` and `test-<package>.log`. All are direct package execution, not Turbo cache-only results.

| Package | Build exit | Test exit | Tests passed | Test files passed |
| --- | ---: | ---: | ---: | ---: |
| app-shell | 0 | 0 | 7 | 1 |
| collapsible | 0 | 0 | 10 | 2 |
| command-palette | 0 | 0 | 19 | 2 |
| context-menu | 0 | 0 | 19 | 2 |
| data-export | 0 | 0 | 20 | 4 |
| data-table | 0 | 0 | 11 | 1 |
| date-time | 0 | 0 | 14 | 1 |
| design-tokens | 0 | 0 | 3 | 1 |
| dialog | 0 | 0 | 26 | 1 |
| dropdown-menu | 0 | 0 | 18 | 2 |
| dynamic-form | 0 | 0 | 10 | 2 |
| loader | 0 | 0 | 22 | 2 |
| notification | 0 | 0 | 9 | 2 |
| pdf-viewer | 0 | 0 | 7 | 1 |
| popover | 0 | 0 | 18 | 2 |
| qr | 0 | 0 | 39 | 5 |
| tabs | 0 | 0 | 18 | 3 |
| toast | 0 | 0 | 9 | 2 |
| utils | 0 | 0 | 169 | 5 |
| validation | 0 | 0 | 80 | 2 |
| **Total** | | | **528** | **43** |

QR retains its pre-existing `vitest run --passWithNoTests` script unchanged; this run actually discovered and passed 39 tests, so its result is not an empty-test success. Notification retains its existing coverage-enabled script. Tests include existing F-09 registration suites and Dialog/Date-time coverage. Some existing QR tests print component error diagnostics while passing; no errors were suppressed. Existing build export-condition warnings were not repaired within this metadata task.

| Exact workspace command | Exit | Result |
| --- | ---: | --- |
| `pnpm typecheck` | 0 | 57 successful Turbo tasks; 19 cached, 38 executed |
| `pnpm lint` | 0 | 45 successful Turbo tasks; 13 cached, 32 executed; known echo placeholders and omissions mean this is not comprehensive genuine lint coverage |
| `pnpm api:check` | 0 | All API governance checks passed |
| `git diff --check` | 0 | No whitespace errors; manifest LF/CRLF notices only |

No registry limitation blocked validation. Initial shell inspection used unsupported PowerShell brace expansion (parser failure) and an rg wildcard path that Windows did not expand; both were corrected with filesystem-aware enumeration. Initial helper resolution attempts could not find esbuild/jsdom through root paths; existing pnpm store installations were resolved explicitly. These investigation errors were not counted as passing validation.

## Preservation and scope

Initial status: modified Dashboard next-env plus eight F-11 manifests; untracked F-11 final report and investigation report; no staged changes. Initial unstaged diff was 9 files, 9 insertions, 1 deletion. Hash baseline covered 545 tracked/untracked files.

Final SHA-256 comparison: only the 20 authorized manifests differ; all other **525 existing files match byte-for-byte**. Each manifest was compared structurally with the captured version after deleting only the added sideEffects field. Raw reconstruction also verifies the one-line insertion is the only byte change. All eight F-11 typecheck additions, F-10 files lists, F-09 registrations/tests, prior reports and Playground work remain intact. Versions, dependencies, exports, scripts, source/build/compiler behavior were not changed.

Dashboard next-env remains exactly the captured development import version, hash `083e23c4c5e7761db151134ea1ef7896120c86c5888cdc8a861f534f7e86d6fd`. Its prior unresolved discrepancy was neither restored nor reclassified. No new preservation discrepancy was detected during F-12.

Final Git diff relative to HEAD includes the pre-existing Dashboard replacement and F-11 script additions, plus 20 new sideEffects lines: 21 tracked files, 29 insertions, 1 deletion. The new F-12 report is additionally untracked; both F-11 reports remain untracked. The eight pre-existing manifest diffs were extended, not overwritten. No staged diff. The sole tracked package-root tarball remains the pre-existing Button fixture; no archives were generated. F-08 cleanup remains intact.

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
```

Only authorized manifests and this report were intentionally changed; ignored scratch files hold investigation evidence and probes. No ERP or QR-generator changes, commits, staging, pushes, pulls, branch changes, resets, cleans, or history rewrites occurred. Stop after F-12 for review.

## Suggested commit message

```text
chore(packages): declare sideEffects metadata based on runtime behavior
```
