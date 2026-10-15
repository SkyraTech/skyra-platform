# F-15 Safe Package Isolation Workflow — Final Audit Report

Date: 2026-10-15

**Verdict: PASS.** F14-008 is repaired. The no-argument workflow now builds and packs its dependency closure into a unique owned directory, validates the exact archives, installs offline into a separate consumer, verifies dependency origins and the Dynamic Form import, and cleans only its own verified successful-run directory. Nine focused tests and the final fresh workflow passed. Existing fixtures, archives, reports, manifests and protected Dashboard file remain intact. No API catalog migration or F-16 work was started.

## Original defect and inspection

The entire original scripts/test-package-isolation.mjs was inspected without executing it. It:

- Used process.cwd()/.tmp-consumer and recursively deleted that pre-existing directory (original lines 5–8).
- Packed Dynamic Form in its package root without --pack-destination (line 14).
- Selected the first filename ending in .tgz, without identity/version validation (lines 16–17).
- Rewrote the shared consumer package.json/test.js and ran npm install over that directory.
- Installed only the Dynamic Form archive, despite required internal workspace dependencies and Validation's external Zod peer.

The package name itself was already canonical. The archive-selection and dependency-resolution assumptions were defective, rather than an obsolete namespace in this script. The tracked .tmp/consumer-test and existing .tmp-consumer were both inventoried before editing; neither old workflow was executed. Repository searches found no current caller or parser depending on intermediate output. The no-argument invocation remains `node scripts/test-package-isolation.mjs`, default target remains @skyra-tech-platform/dynamic-form, and final success message remains `Package isolation verified successfully!`.

Inspection covered actual package scripts, exports, workspace dependency declarations and external peers in the complete closure. None of these packages has a pack lifecycle hook that required another workflow. The package manager remains pnpm for builds and packing; npm remains the consumer installer, as in the original script.

## Files changed

1. **scripts/test-package-isolation.mjs** — repaired workflow and small exported helpers for focused tests. No package APIs, manifests, topology or unrelated scripts changed.
2. **scripts/test-package-isolation.test.mjs** — new built-in Node test suite; no new dependency or package test script required.
3. **F15_PACKAGE_ISOLATION_WORKFLOW_FINAL_AUDIT_REPORT.md** — this new report.

Audit evidence is under new ignored .tmp/f15. Invocation-owned artifacts are under .tmp/package-isolation/run-*. No pre-existing report or evidence directory was repurposed. A copy of the original isolation script is retained in .tmp/f15/original-script.mjs.

## Isolation, archive and dependency behavior

Each invocation uses fs.mkdtempSync with a run- prefix. It never deletes or rewrites a shared fixture and resolves the repository from its own module location, rather than trusting the caller's working directory. It refuses a redirected scratch parent. Windows launches package-manager JavaScript CLIs through Node with argument arrays and shell:false, avoiding command-string interpolation of filesystem paths. Linux/macOS use the ordinary pnpm/npm executables on PATH.

Successful cleanup requires an object registered by this process, the exact absolute scratch parent, matching directory identity, unredirected real paths, a non-symlink owner marker and its random per-invocation token. Cleanup removes that exact run directory only. Unknown/replaced ownership is retained. Failed runs retain their artifacts; a future invocation never sweeps old run directories. Marker-replacement tests intentionally leave evidence in ignored scratch instead of restoring ownership to force deletion.

The required internal closure is discovered recursively from dependencies, optionalDependencies and peerDependencies. Internal workspace references must exist, cycles terminate, and duplicate package identities fail. Current closure is **12 packages**:

@skyra-tech-platform/button, @skyra-tech-platform/checkbox, @skyra-tech-platform/date-time, @skyra-tech-platform/design-tokens, @skyra-tech-platform/dynamic-form, @skyra-tech-platform/dynamic-select, @skyra-tech-platform/input, @skyra-tech-platform/radio, @skyra-tech-platform/switch, @skyra-tech-platform/textarea, @skyra-tech-platform/utils, @skyra-tech-platform/validation.

These receive genuine filtered builds, then each is packed with an explicit invocation-owned destination. Archive filename is derived exactly from canonical manifest name and version; the script never uses directory-order selection. Before consuming an archive it verifies:

- Expected file exists, is a regular file and is not a symlink.
- Listed entries remain inside package/ and contain no traversal segments.
- Archived package.json name/version exactly match the expected package.
- Packed dependency metadata contains no unresolved workspace: protocol.
- Every declared export target is present in the archive.

The consumer's internal dependencies reference those exact archive files. Mandatory external peers are explicit: currently Zod ^3.22.0. Optional external peers are not made mandatory. Incompatible duplicate external peer requirements fail explicitly rather than choosing a silent override. Other external dependencies retain the packed packages' declarations and are resolved by the installer. There are no symlinks into workspace packages, dependency overrides or forced version substitutions.

Consumer installation uses npm install --offline --ignore-scripts --strict-peer-deps --no-audit --no-fund. npm natively checks dependency ranges against the complete local archive set; unsatisfied peers, missing cached dependencies and installer errors propagate. Registry fetching and dependency lifecycle scripts are disabled. The consumer is a new package directory; npm does not operate on the parent pnpm workspace or the existing fixtures.

The final Node consumer checks SkyraTechDynamicForm is exported as a function and verifies the real resolved path of **every direct consumer dependency** lies inside its own node_modules. It cannot report success by borrowing a platform package or Zod from an ancestor workspace installation.

### Real installation issue encountered and corrected

The first implementation attempted pnpm install --ignore-workspace --offline --ignore-scripts --strict-peer-dependencies. Fresh builds/packing succeeded, but pnpm attempted to resolve Date-time's Design Tokens semver dependency from registry metadata even though the archive was a direct consumer dependency. It failed with ERR_PNPM_NO_OFFLINE_META and script exit 1. Artifacts were preserved under run-ROD4zM; no passing result was manufactured.

The correction retained the original npm installer with the complete local archive set, offline operation and strict peers, rather than forcing version overrides or relaxing declarations. Two subsequent fresh npm workflows passed: each installed **13 packages (12 internal packages plus Zod)**, imported Dynamic Form, and removed only its owned directory. The second successful run includes the final dependency-origin assertions. No registry-dependent installation or generated Next build was needed.

## Tests and actual validation

The final command `node --test scripts/test-package-isolation.test.mjs` exited **0**: **9 tests discovered, 9 passed**, no skipped or suppressed tests. The tests cover:

1. Unique scratch paths and cleanup preserving sibling runs/shared fixtures.
2. Refusal to clean an unowned path or changed owner marker.
3. Deterministic archive name, unrelated stale archive rejection and missing expected archive failure.
4. Wrong archived identity, traversal, unresolved workspace ranges and missing export targets.
5. Complete current closure, missing package identity, explicit Zod peer and conflicting peer rejection.
6. Installer dependency failure propagation, artifact retention and no attempted consumer import afterward.
7. Subprocess nonzero exit propagation.
8. Missing transitive workspace dependency and valid dependency cycles.
9. Protected fixture file/link, Button archive and Dashboard hashes unchanged through the test run.

Negative archive/orchestration tests use controlled fixtures/injected commands; the actual workflow separately exercised real builds, tar archives and installation. Those mocked tests are not represented as real package installs.

| Exact command / operation | Actual exit | Result |
| --- | ---: | --- |
| node --test scripts/test-package-isolation.test.mjs, final | 0 | 9/9 passed; tests-preservation.log |
| Earlier focused runs of the same test command | 0 each | Incremental suites passed at 7, 7 and 8 tests; retained separate logs |
| node --check scripts/test-package-isolation.mjs, final | 0 | Final module syntax valid |
| node scripts/test-package-isolation.mjs, initial pnpm installer implementation | 1 | Genuine internal dependency resolution failure described above; workflow.log |
| node scripts/test-package-isolation.mjs, npm implementation | 0 | Fresh builds, 12 validated archives, offline installation/import, owned cleanup; workflow-npm.log |
| node scripts/test-package-isolation.mjs, final dependency-origin checks | 0 | Fresh workflow passed; workflow-final.log |
| node scripts/verify-package-resolution.mjs | 0 | 11 cases covering NodeNext/Bundler declarations, negative targets/declarations, ESM/CJS imports and invalid subpath rejection; package-resolution.log |
| pnpm api:check | 0 | Actual governance script ran; all checks passed |
| git diff --check | 0 | No whitespace errors; Git LF/CRLF conversion notices only |
| git diff --cached --quiet | 0 | No staged changes introduced |

Each successful workflow executed the following direct build command (exit 0; not a Turbo cache-only build):

```text
pnpm --filter @skyra-tech-platform/button --filter @skyra-tech-platform/checkbox --filter @skyra-tech-platform/date-time --filter @skyra-tech-platform/design-tokens --filter @skyra-tech-platform/dynamic-form --filter @skyra-tech-platform/dynamic-select --filter @skyra-tech-platform/input --filter @skyra-tech-platform/radio --filter @skyra-tech-platform/switch --filter @skyra-tech-platform/textarea --filter @skyra-tech-platform/utils --filter @skyra-tech-platform/validation build
```

Each then executed pnpm pack --pack-destination <unique-run>/tarballs from the corresponding 12 package directories, each exit 0, with tar -tf and tar -xOf package/package.json validation, each exit 0. The installer command above and the child Node test.mjs command each exited 0 in both successful runs. Outputs show actual tsup/declaration execution and archive paths. No archive was placed in a package root.

A preliminary read-only pnpm help install inspection encountered registry fetch failure. Its inspection pipeline did not preserve pnpm's separate exit code, so it is not counted as passing validation. No implementation decision relies on a successful help fetch. The actual first installer invocation recognized its flags and failed on missing offline package metadata; the corrected npm commands subsequently ran successfully.

No broad workspace typecheck/lint, production Dashboard build, catalog extraction or unrelated tests were run. The script is JavaScript and has focused Node tests/syntax checks; package source/APIs were unchanged. Existing package-resolution/governance checks provide additional compatibility evidence, not comprehensive validation of every possible consumer.

## Preservation verification

Before editing, SHA-256 baseline captured **548 tracked/non-ignored untracked files**. A separate recursive inventory captured **40 protected file/link entries** across .tmp/consumer-test, .tmp-consumer, the retained Button tarball and dashboard/next-env.d.ts. Symlinks were compared by target path without traversing shared dependency stores.

Final comparison:

- The only changed baseline file is the authorized scripts/test-package-isolation.mjs. **All other 547 baseline files match byte-for-byte.**
- All 40 protected entries match; no protected path was added, deleted, rewritten or reinstalled over.
- Retained Button archive SHA-256: e6179c8dd9f0002f24af7df77ccceb531f7952f1e060cdf4e63fcf09676191b7.
- Dashboard next-env SHA-256 remains 083e23c4c5e7761db151134ea1ef7896120c86c5888cdc8a861f534f7e86d6fd; its unresolved development-route import was untouched.
- All F-08–F-14 fixes/reports, F-09 registrations, F-10 files lists, F-11 scripts and F-12 sideEffects metadata remain unchanged.
- Physical package-root archives still consist solely of the pre-existing packages/button/skyra-tech-platform-button-0.1.0.tgz.
- Successful run-oy3lon and run-ctPD2n directories were confirmed absent after cleanup. Failed/test ownership-uncertain run artifacts remain intentionally preserved under ignored scratch.

No preservation discrepancy was detected. The baseline includes all Git-visible user work; ignored tool caches/build outputs are not a comprehensive filesystem snapshot. Builds necessarily refresh ignored dist output, and the command logs show their scope; shared fixtures and their actual file/link hashes were checked separately.

Initial Git state was 33 modified tracked files and five untracked earlier reports, with no staged changes; diff was 139 insertions/202 deletions. Final tracked diff relative to HEAD is 34 files, 293 insertions/245 deletions, including all initial work. F-15 adds only the isolation script diff, new focused test file and this new report. Final status:

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
 M scripts/test-package-isolation.mjs
?? F11_DASHBOARD_GENERATED_FILE_INVESTIGATION_REPORT.md
?? F11_PACKAGE_TYPECHECK_SCRIPTS_FINAL_AUDIT_REPORT.md
?? F12_PACKAGE_SIDE_EFFECTS_AUDIT_FINAL_REPORT.md
?? F13_SHARED_BUILD_CONFIGURATION_FINAL_AUDIT_REPORT.md
?? F14_PACKAGE_NAMESPACE_AND_CONSUMER_AUDIT_FINAL_REPORT.md
?? scripts/test-package-isolation.test.mjs
?? F15_PACKAGE_ISOLATION_WORKFLOW_FINAL_AUDIT_REPORT.md
```

No staging, commits, pushes, pulls, branch changes, reset/clean/discard/revert or history rewrite occurred. No ERP or QR-generator changes. Other audit findings, including the legacy API catalog, were not changed.

## Remaining limitations

- Offline external dependency resolution requires npm's cache to contain the necessary metadata/artifacts. A cold or incompatible cache fails explicitly and preserves evidence; no network fallback was added.
- The default target remains Dynamic Form as in the original interface. This is not a new general-purpose CLI for choosing arbitrary packages.
- Windows Node 24.14.0 execution was verified. Source uses APIs available in supported Node 20 and repository pnpm 9.12.0 conventions, but Node 20 and other operating systems were not executed in this task. pnpm, npm and tar must be available; unsupported Windows launcher layouts fail clearly.
- Wildcard export targets or complex conflicting peer requirements may require explicit future handling; current closure uses concrete export targets and one mandatory external peer. The script fails instead of guessing unsupported archive/peer mappings.
- The consumer smoke check is Node import/export/origin validation, not complete browser component behavior. Existing resolution probes separately include jsdom cases. No Next application was generated or built.
- Failed/interrupted/ownership-uncertain runs can accumulate ignored evidence. Later runs do not automatically delete them.

User-specified message for a future explicitly authorized commit only:

```text
fix: isolate package consumer validation artifacts
```
