# F-05 — Package Export-Condition Audit and Repair

Date: October 14, 2026  
Repository: Skyra Platform  
Branch: `main`  
Final verdict: **PASS within the tested consumer environments**

## Outcome

All ten requested packages were audited. The reported condition ordering did not cause a consumer-resolution failure in the tested NodeNext ESM, NodeNext CommonJS, or Bundler environments. All ten export maps were intentionally left unchanged.

A related module-classification defect was demonstrated in Date-time: its ESM export points to `dist/index.js`, but its manifest did not declare `type: module`. Modern Node reparses this ambiguous file with a warning. With syntax detection and require(ESM) conveniences disabled, the advertised ESM import failed with `SyntaxError: Unexpected token 'export'`. Dynamic Form's asynchronous Date-time dependency import failed for the same reason, including from its CommonJS entry in a DOM environment.

Added only `"type": "module"` to Date-time's manifest. Its explicit `.cjs` target remains CommonJS. Rebuilding produced matching `.d.ts` and `.d.cts` declarations. No source API, component behavior, dependency, public subpath, or supported format was changed.

## Initial Git state and preservation

Initial branch was `main`, with these recent relevant commits:

- `697cfb6`: API governance F-03 repair.
- `13be087`: ESLint F-02 repair.
- `0282db5`: Data Table F-01 repair.
- `8c5fe1a` and `861b82b`: Dashboard navigation/sidebar work.

The tree already contained eleven modified tracked files: Dashboard Next configuration, Playground verification script, Data Table/Export/layout/PDF Viewer/Print/QR/Playground pages, documentation search, and Tabs package metadata. It also contained the prior final audit report, three untracked showcase page files, and the untracked Tabs export test. The initial tracked diff was 1,019 insertions and 945 deletions.

SHA-256 hashes were captured for all sixteen pre-existing modified/untracked files. A subsequent comparison reported **zero changed pre-existing files**. No reset, clean, discard, push, pull, commit, branch change, or history rewrite was performed. ERP and SkyraQR were not accessed.

## Audit method and tooling

Inspected manifests, source entry points, local/shared tsup configurations, existing generated files, scripts, dependencies, TypeScript settings, existing export tests and consumer-validation tooling, and Dashboard consumers.

All ten packages actually configure both ESM and CommonJS builds. Shared tsup is used by app-shell, data-export, data-table, design-tokens, dynamic-form, utils, and validation. Date-time, dialog, and QR use local configurations. QR has separate core and Web Component source/build entry points; the other packages use `src/index.ts`.

The existing shell consumer-validation script still references legacy namespaces and tarballs and installs dependencies. It was inspected but not run or modified. The existing Tabs export-map test was preserved.

Added `scripts/verify-package-resolution.mjs`, using existing installed TypeScript, Node, and jsdom tooling. It resolves public package names through the Dashboard workspace dependencies, without TS path aliases or direct `dist` imports. TypeScript consumers are virtual source files supplied to the compiler host; no consumer files are added to Dashboard source.

Host versions: Node **24.14.0**, TypeScript **5.9.3**. Runtime probes disable `--experimental-detect-module` and `--experimental-require-module` conveniences with their `--no-...` flags, so ambiguous metadata cannot silently pass. These are strict probes on Node 24, not execution on a separate Node 20 installation.

UI entry points are tested in separate processes with jsdom DOM globals and a custom-element registry. Pure libraries run without DOM globals. Dynamic Form's asynchronous component imports are awaited before closing the DOM.

## Complete package audit

All rows use the canonical `@skyra-tech-platform/` namespace. “TS pass” means named public-export consumers passed NodeNext `.mts`, NodeNext `.cts`, and Bundler `.mts` compilation with strict checking; the representative value was also checked not to have type `any`.

| Package | Relevant exact condition structure | Formats/targets | TypeScript | ESM / CJS runtime | Finding / action |
|---|---|---|---|---|---|
| app-shell | `require: ./dist/index.cjs`, `types: ./dist/index.d.ts`, `import: ./dist/index.js` | ESM + CJS; all declared targets exist; CSS subpath preserved | TS pass | Pass / pass with DOM | Valid in tested environments; unchanged |
| data-export | `require: ./dist/index.cjs`, `types: ./dist/index.d.ts`, `import: ./dist/index.js` | ESM + CJS; targets exist | TS pass | Pass / pass in Node | Valid; unchanged |
| data-table | `require: ./dist/index.cjs`, `types: ./dist/index.d.ts`, `import: ./dist/index.js` | ESM + CJS; targets exist | TS pass | Pass / pass with DOM | Valid; unchanged |
| date-time | `require: ./dist/index.cjs`, `import: ./dist/index.js`, `types: ./dist/index.d.ts` | ESM + CJS; fresh outputs and targets verified | TS pass after rebuild | Failed ESM before; pass / pass after | Missing module classification repaired; map unchanged |
| design-tokens | `require: ./dist/index.cjs`, `types: ./dist/index.d.ts`, `import: ./dist/index.js` | ESM + CJS; targets and CSS files exist | TS pass | Pass / pass in Node | Valid; unchanged |
| dialog | `require: ./dist/index.cjs`, `import: ./dist/index.js`, `types: ./dist/index.d.ts` | ESM + CJS; targets exist | TS pass | Pass / pass with DOM | Valid in tested environments despite bundler warning; unchanged |
| dynamic-form | `require: ./dist/index.cjs`, `types: ./dist/index.d.ts`, `import: ./dist/index.js` | ESM + CJS; targets exist | TS pass | Dependency failed before; pass / pass after | Date-time dependency failure resolved; own configuration unchanged |
| qr | Root: `require: ./dist/core.cjs`, `types: ./dist/core.d.ts`, `import: ./dist/core.js`; Web Component: `require: ./dist/skyra-tech-qr-code.cjs`, `types: ./dist/skyra-tech-qr-code.d.ts`, `import: ./dist/skyra-tech-qr-code.js` | Both entry points produce ESM + CJS; all targets exist | Both entry points TS pass | Core pass / pass in Node; component pass / pass with DOM | Valid; unchanged |
| utils | `require: ./dist/index.cjs`, `types: ./dist/index.d.ts`, `import: ./dist/index.js` | ESM + CJS; targets exist | TS pass | Pass / pass in Node | Valid; unchanged |
| validation | `require: ./dist/index.cjs`, `types: ./dist/index.d.ts`, `import: ./dist/index.js` | ESM + CJS; targets exist; installed Zod peer used | TS pass | Pass / pass in Node | Valid; unchanged |

Additional unchanged exports are `app-shell/styles.css -> ./src/styles.css`, `design-tokens/reset.css -> ./src/reset.css`, and `design-tokens/tokens.css -> ./src/tokens.css`. Their target files were checked; CSS rendering was not tested.

For the rebuilt packages and existing artifacts, ESM/Bundler consumers resolve `.d.ts`; CommonJS NodeNext consumers resolve `.d.cts`. QR uses `core` and `skyra-tech-qr-code` declaration basenames. The declaration selected for CommonJS comes from extension substitution on the earlier `.cjs` target; an earlier `require` condition does not by itself imply missing types.

## Before and after

No export map changed. Date-time's root map remains exactly:

```json
{
  ".": {
    "require": "./dist/index.cjs",
    "import": "./dist/index.js",
    "types": "./dist/index.d.ts"
  }
}
```

The manifest repair is:

```diff
   "private": true,
+  "type": "module",
   "main": "dist/index.cjs",
```

Date-time's existing build configuration already explicitly emits `.js` for ESM and `.cjs` for CommonJS. Its actual build script was run. The resulting files include `index.js`, `index.cjs`, their maps, `index.d.ts`, and `index.d.cts`. No build configuration change was necessary.

## Focused regression coverage

The final verification run produced **eleven passing entry-point records** covering ten packages and QR's extra public subpath:

- **33 positive typed-consumer checks**: three module environments per entry point.
- **22 runtime checks**: ESM import and CommonJS require per entry point, using public names and representative exports.
- **66 negative compiler checks**: virtual manifests with missing targets and virtual filesystems with missing declarations must produce resolution/declaration errors for every typed-consumer combination.
- All declared export targets must exist.
- Unexported subpaths must reject resolution.
- Representative utility behavior is exercised for CSV export, tokens, IDs, email validation, and Date-time formatting.

Representative public exports: `SkyraAppShell`, `exportToCsv`, `processTableData`, `toISODate`, `tokens`, `SkyraTechDialog`, `evaluateCondition`, `generateQRCode`, `SkyraTechQRCodeElement`, `simpleId`, and `emailSchema`.

The negative checks mutate only the compiler host's view of manifests/declarations; real package files are not renamed or deleted. The final script exited **0**, with no failed records.

## Validation commands and actual results

Commands below were run from repository root unless another directory is shown. Output redirection to `.tmp/f05/` retained logs; it does not change the command's exit status.

| Command | Final exit | Relevant result / cache status |
|---|---:|---|
| `pnpm --filter @skyra-tech-platform/date-time build` | 0 | Actual tsup execution, not a Turbo cache replay; ESM, CJS, and declaration builds succeeded |
| `node node_modules/typescript/bin/tsc --noEmit --incremental false -p packages/date-time/tsconfig.json` | 0 | Actual source typecheck; Date-time has no existing typecheck script, and none was added |
| `node ../../node_modules/vitest/vitest.mjs run` from `packages/date-time` | 0 | Actual execution: one test file, 14 tests passed, including existing axe checks |
| `node --check scripts/verify-package-resolution.mjs` | 0 | Syntax check passed |
| `node scripts/verify-package-resolution.mjs` | 0 | Final isolated sweep: 11 passing records, no failures; actual compiler and runtime execution |
| `pnpm typecheck` | 0 | 49 successful Turbo tasks; 45 cached, four executed |
| `pnpm lint` | 0 | 45 successful Turbo tasks; 43 cached, two executed; includes existing echo placeholders |
| `pnpm api:check` | 0 | All configured API governance checks passed |
| `git diff --check` | 0 | No whitespace errors; Git emitted existing LF/CRLF warnings |

The Date-time package build initially exited 1 because pnpm registry access failed in the sandbox. Its approved retry succeeded. The initial Date-time Vitest attempt exited 1 with a sandbox `EPERM` resolving an installed Vitest file; its approved retry passed all fourteen tests.

Exploratory checks were not counted as final passes. An initial virtual compiler-host probe did not recognize normalized Windows paths and was corrected. Early negative tests needed canonicalization of workspace symlink paths. Intermediate sweeps also exposed premature jsdom teardown while Dynamic Form imports were pending, a subprocess timeout under concurrent load, and checks racing a build cleaning declarations. The test harness now awaits those imports, and the final sweep ran after builds and earlier sweeps completed.

The initial strict runtime probes demonstrated the Date-time failure before repair. The early file named `before.log` crossed the metadata change/build boundary and is not a pristine full baseline; the final authoritative consumer evidence is `.tmp/f05/resolution.log`.

## Remaining risks and verification limits

- Date-time and Dialog retain esbuild warnings about a trailing `types` condition. Current TypeScript consumers resolve adjacent declarations successfully. No tested compatibility defect justified reordering those maps solely to remove warnings.
- Tests used Node 24.14.0 with modern fallback conveniences disabled, not a separate Node 20 installation. Other TypeScript/compiler versions and downstream bundlers were not exhaustively tested.
- `skipLibCheck` matches repository practice: consumer symbols and resolution are checked, but every dependency declaration body is not revalidated.
- Tests use workspace-installed packages and existing dependencies. Fresh packed/published tarball installation was not performed; publication whitelist/tarball remediation remains outside F-05.
- App Shell's bare Node import fails because it extends `HTMLElement`; DOM-enabled imports pass. Its pre-existing SSR limitation is recorded, not repaired by this package-resolution task.
- CSS targets exist; CSS rendering and bundler-specific CSS consumption were not tested.
- Workspace lint includes placeholders and omissions. Its success is not a claim of genuine lint coverage across every package.
- API governance covers configured declarations/baselines; it does not establish all ten packages' consumer compatibility. The separate consumer tests provide that evidence within their stated environments.
- No UI browser suite, snapshot update, or unrelated package remediation was performed.

## Files changed by this task

1. `packages/date-time/package.json`: one module-classification field.
2. `scripts/verify-package-resolution.mjs`: focused consumer-resolution regression tool.
3. `F05_PACKAGE_EXPORT_CONDITION_FINAL_AUDIT_REPORT.md`: this report.

Ignored scratch evidence is stored under `.tmp/f05/`. Existing work, including the Playground and Tabs changes and prior audit report, was preserved byte-for-byte. Final diffs and Git status were inspected.

## Final verdict and suggested commit message

**PASS:** all ten packages audited; the demonstrated module-classification defect repaired; supported consumer probes and negative checks passed; required non-regression gates passed. All export maps were intentionally preserved based on actual resolution evidence.

Suggested commit message (not executed):

```text
fix(date-time): declare ESM package type and verify consumer resolution
```

No push, pull, or commit was performed. F-06 and subsequent remediation remain unstarted.
