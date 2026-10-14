# F-10 — Package Publication Files Whitelist Audit and Remediation

Date: October 14, 2026  
Repository: Skyra Platform  
Branch: `main`  
Final verdict: **PASS within the validated packing/consumer environments**

## 1. Confirmed finding and baseline

All eight requested packages still lacked a `files` whitelist. Before editing, their manifests, source entry points, build configurations, generated files, style/asset references, README usage, publication tooling, and ignore rules were inspected.

All eight use a single `src/index.ts` tsup entry, produce ESM and CommonJS bundles plus declarations, and publish only a root JavaScript/type export. None declares a `style` field or separate CSS/asset export. Component styles are TypeScript string modules bundled into JavaScript. No separate image, font, JSON, or local runtime asset requirement was found.

No relevant `.npmignore` was found. Root `.gitignore` ignores build/cache/coverage directories and package-root archives, with the F-08 Button-fixture exception. Fresh baseline packs showed that these root rules did not prevent source, test, configuration, cache, and coverage content from entering the unwhitelisted package archives.

The working tree already contained F-09's 12 modified source files and 12 untracked files (ten tests, the shared test helper, and its report). The initial tracked diff was 101 insertions and five deletions. Earlier F-04–F-08 and Playground work was present in the existing history. None was discarded or rewritten.

## 2. Before-and-after changes for every package

Each manifest received exactly this field, immediately before `scripts`:

```json
"files": [
  "dist"
]
```

| Manifest | Before | After | Rationale |
|---|---|---|---|
| `packages/accordion/package.json` | No `files` field | `["dist"]` | Bundled runtime, declarations, and maps cover all root exports; no external asset subpath |
| `packages/collapsible/package.json` | No `files` field | `["dist"]` | Same verified six-file build-output structure |
| `packages/command-palette/package.json` | No `files` field | `["dist"]` | Runtime/styles bundled; declaration dependency on Utils remains declared; existing README automatically included |
| `packages/context-menu/package.json` | No `files` field | `["dist"]` | Runtime bundled; Popover declaration/runtime dependency remains declared; README automatically included |
| `packages/date-time/package.json` | No `files` field | `["dist"]` | Calendar/field styles and code bundled; `.js`, `.cjs`, `.d.ts`, `.d.cts` retained; `private: true` preserved |
| `packages/dropdown-menu/package.json` | No `files` field | `["dist"]` | Exported style strings and runtime bundled; Popover dependency remains declared; README automatically included |
| `packages/popover/package.json` | No `files` field | `["dist"]` | Positioning helpers, style strings, and component bundled; no CSS file export |
| `packages/tabs/package.json` | No `files` field | `["dist"]` | All component classes/declarations bundled; repaired root export map remains unchanged |

`dist` is the verified publication directory, not a repository-wide wildcard. It includes both module formats, both declaration formats, and generated maps. Existing workspace packages such as Dialog already use this convention. App Shell's extra source-CSS whitelist was inspected but not copied because these eight packages have no corresponding source-asset export.

No explicit README entry is necessary: actual packs confirmed automatic inclusion of the existing Command Palette, Context Menu, and Dropdown Menu README files. No repository files were deleted. Exports, versions, dependencies, scripts, module settings, `sideEffects`, and build configuration were unchanged.

## 3. Actual fresh archive comparison

All eight package build scripts executed successfully before packing. Each package was packed from its own directory, first into `.tmp/f10/before/`, then after the manifest change into `.tmp/f10/after/`. All **16 actual pack commands exited 0**. No archive was generated in a package root.

Archive member lists were inspected with `tar -tf`; internal metadata/output contents were read with `tar -xOf`. Baseline source counts below count entries under `package/src/`; Date-time's source count includes its test suite and setup file.

| Package | Baseline members | Baseline source entries | Baseline `tests/` entries | Final members | Final automatic README |
|---|---:|---:|---:|---:|---|
| accordion | 20 | 4 | 2 | 7 | None present |
| collapsible | 17 | 3 | 2 | 7 | None present |
| command-palette | 33 | 4 | 2 | 8 | Included |
| context-menu | 33 | 4 | 2 | 8 | Included |
| date-time | 47 | 14 | 0 | 7 | None present |
| dropdown-menu | 19 | 4 | 2 | 8 | Included |
| popover | 18 | 4 | 2 | 7 | None present |
| tabs | 21 | 5 | 3 | 7 | None present |

Every final archive contains exactly this common set:

```text
package/package.json
package/dist/index.js
package/dist/index.cjs
package/dist/index.d.ts
package/dist/index.d.cts
package/dist/index.js.map
package/dist/index.cjs.map
```

The three packages identified above additionally contain `package/README.md`. There are no other members in the final archives.

Verified for every final archive:

- `main`, `module`, `types`, and every `exports` target are present.
- Both declaration formats and all bundled local runtime/declaration references are satisfied.
- Standalone source, tests, test setup, tsconfig, tsup/Vitest configuration, coverage output, Turbo logs, scratch content, and nested tarballs are absent.
- Styles needed by the component are bundled, not missing source-only CSS files.
- All sixteen JavaScript maps contain embedded source strings. Maps are intentionally retained build outputs; this whitelist does **not** claim to remove embedded source content from debugging maps.

Complete before/after member lists and packed dependency metadata are retained in `.tmp/f10/before-inventory.json` and `.tmp/f10/after-inventory.json`.

## 4. Archive-backed consumer verification

The temporary verifier `.tmp/f10/verify-archives.mjs` validated archive paths/members, then extracted only the fresh archives into newly created directories under `.tmp/f10/consumer/node_modules/@skyra-tech-platform/`. No extraction overwrote repository source or existing consumer files.

The eight audited packages were supplied solely from their archives, without workspace symlinks or source fallback. The two declared dependencies outside that audited set—Utils and Design Tokens—were supplied from their existing workspace build outputs, with Design Tokens' declared CSS targets. Popover dependencies were supplied from its audited archive. No network installation or dependency metadata change was performed.

Results:

- **24 typed-package checks:** all eight packages in NodeNext ESM (`.mts`), NodeNext CommonJS (`.cts`), and Bundler ESM modes. Strict compiler checking used `skipLibCheck: false`; declaration resolution was asserted to remain inside the scratch consumer.
- **16 runtime checks:** public package-name ESM import and CommonJS require for each archive. Representative exported classes were present, canonical custom elements constructed/connected, and Shadow DOM style content was nonempty.
- Modern Node syntax-detection and require(ESM) fallback conveniences were disabled in runtime probes. UI probes used jsdom from the installed test tooling.

All final checks exited **0**. These targeted archive consumers cover the publication-sensitive workflow; unchanged package unit suites were not rerun or claimed as executed by F-10.

## 5. Validation commands and actual results

Package names in the build command are the canonical eight-package names listed in the objective.

```text
pnpm --filter @skyra-tech-platform/accordion --filter @skyra-tech-platform/collapsible --filter @skyra-tech-platform/command-palette --filter @skyra-tech-platform/context-menu --filter @skyra-tech-platform/date-time --filter @skyra-tech-platform/dropdown-menu --filter @skyra-tech-platform/popover --filter @skyra-tech-platform/tabs build
```

For each package directory, the exact pack commands were:

```text
pnpm pack --pack-destination C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/.tmp/f10/before
pnpm pack --pack-destination C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/.tmp/f10/after
```

| Command/check | Exit | Meaningful result / cache status |
|---|---:|---|
| Eight-package build command above | 0 | Eight actual tsup scripts executed; ESM/CJS/declaration outputs succeeded |
| Eight baseline package-directory pack commands | 0 each | Actual baseline archives generated; missing-whitelist leakage demonstrated |
| Eight final package-directory pack commands | 0 each | Actual whitelisted archives generated |
| `tar -tf <archive>` / `tar -xOf <archive> <member>` used by inventory/verifier | 0 | Actual member lists, metadata, declarations, runtime contents, and maps inspected |
| `node .tmp/f10/verify-archives.mjs` — initial attempt | 1 | Scratch verifier imported TypeScript through an incorrect relative path; no production issue or consumer pass claimed |
| Same verifier after changing its import to the installed `typescript` package | 0 | Eight archives; 24 typed-package checks and 16 runtime checks passed |
| Additional Node assertions checking all sixteen maps' embedded source strings | 0 | Map source dependencies are self-contained |
| `pnpm typecheck` | 0 | 49 successful Turbo tasks; 37 cached, 12 executed |
| `pnpm lint` | 0 | 45 successful Turbo tasks; 41 cached, four executed |
| `pnpm api:check` | 0 | All configured API governance checks passed |
| `git diff --check` | 0 | No whitespace errors; Git emitted existing LF/CRLF warnings |
| Manifest, hash, Git status, and package-root archive assertions | 0 | Only authorized manifest insertions; prior work preserved; no new package-root tarball |

Workspace lint retains echo placeholders and missing tasks. Its successful execution is not a claim of comprehensive genuine lint coverage. API governance checks configured declarations/baselines and does not replace the archive-backed consumer evidence.

## 6. Publication and validation limits

- No registry publication, fresh online dependency installation, release workflow execution, or native-browser visual/accessibility suite was performed.
- The consumer environment uses Node 24.14.0 and TypeScript 5.9.3. It is archive-backed for all eight audited packages, but declared outside-set dependencies and jsdom harness tooling came from existing workspace builds/tooling.
- Date-time remains private; successful packing is not a claim that registry publication is permitted.
- Source maps intentionally retain embedded source content under the existing build convention. Changing map generation is outside F-10.
- Date-time retains its previously audited trailing-`types` warning. No export-map repair was combined with this task.
- README inclusion is verified for the current files/tooling, not assumed for arbitrary future asset additions. New public asset entry points would require corresponding publication review.
- No typecheck scripts, `sideEffects` metadata, namespace cleanup, dependency changes, or F-11 remediation were introduced.

## 7. Preservation and final scope

Captured SHA-256 hashes for **542 baseline tracked/untracked files**, including every F-09 modification, test, helper, and report. Final comparisons confirmed:

- All **534 files outside the eight authorized manifests** remained byte-for-byte unchanged.
- Removing the new `files` block from each current manifest reproduces the original captured bytes exactly. A parsed comparison also confirms all other fields are unchanged.
- All twelve pre-existing source modifications and twelve untracked F-09 files remain intact.
- Earlier Playground/navigation work, F-05–F-08 reports and settings, package tests, and F-08 ignore/tarball cleanup were preserved.
- Git's tracked tarball inventory is unchanged. The only package-root archive remains the original referenced Button fixture; generated F-10 archives are all under ignored `.tmp/f10/`.
- The index remains unstaged and unchanged.

Final tracked diff contains the original twelve source files plus eight manifests: **20 files, 125 insertions and five deletions**. The F-10 delta is exactly **24 added manifest lines**, plus this new untracked report. No source, tests, configurations, assets, or repository files were removed.

Final Git status and diffs were inspected. No preservation discrepancy was found. No reset, clean, discard, revert, commit, push, pull, branch change, or history rewrite was performed. ERP and SkyraQR were not accessed or modified.

## 8. Verdict

**PASS:** missing whitelists were confirmed and minimally repaired in all eight packages. Fresh archive contents exclude unintended files, retain required entry points/declarations/styles, and pass targeted archive-backed consumers. Required workspace gates passed and all earlier work was preserved.

F-11 and subsequent findings were not started.

## 9. Suggested commit message

```text
fix(packaging): whitelist build outputs for eight platform packages
```

Suggestion only; no commit was created.
