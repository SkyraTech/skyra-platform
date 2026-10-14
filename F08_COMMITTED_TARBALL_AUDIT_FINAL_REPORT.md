# F-08 — Committed Package Tarball Audit and Remediation

Date: October 14, 2026  
Repository: Skyra Platform  
Branch: `main`  
Final verdict: **PASS for the scoped working-tree remediation**

## 1. Finding and outcome

The reported inventory was confirmed: **24 tracked `.tgz` archives across 20 package directories**, totaling 523,521 bytes before remediation. Archive identities and versions were read using `tar -xOf <path> package/package.json`, without extracting files over the repository.

Removed **23 generated/stale package archives**, totaling 512,301 bytes. Retained the 11,220-byte Button archive because the tracked `.tmp/consumer-test/package.json` directly depends on that exact local file and the tracked consumer source imports Button. Preserving that dependency is preferable to deleting every archive indiscriminately.

Added a package-root ignore rule with an explicit exception for the retained fixture. No source, APIs, exports, versions, dependencies, scripts, build behavior, or existing reports were changed. No staging, commit, push, pull, branch change, or history rewrite was performed.

## 2. Counts before and after

| Inventory measure | Before | After |
|---|---:|---:|
| Entries returned by `git ls-files '*.tgz'` | 24 | 24 |
| Distinct package directories in that index inventory | 20 | 20 |
| Indexed archives physically present in the working tree | 24 | 1 |
| Distinct package directories with a physically present indexed archive | 20 | 1 |
| Indexed archives pending working-tree deletion | 0 | 23 |

The Git index still lists the deleted paths because deletions were deliberately left unstaged. The reviewable diff records all 23 deletions. This report does not claim that Git history or the index has already lost those files.

The sole retained original archive is `packages/button/skyra-tech-platform-button-0.1.0.tgz`. Two new, ignored pack-proof archives were generated under `.tmp/f08/pack-proof/`; they are validation outputs, not retained original artifacts or new tracked files.

## 3. Complete original inventory and disposition

All archive versions below are **0.1.0**, verified from their internal manifests. Canonical names are written in full so legacy identities and misplaced Button archives are explicit.

Reference/rationale keys:

- **U:** No active reference requiring the checked-in archive found; ordinary package-root generated pack output. Workspace manifests use workspace/registry dependencies, not these files.
- **G:** Tooling uses a freshly generated archive: App Shell runs `npm pack` first; Dynamic Form builds and runs `pnpm pack` first. Fresh packing was verified without the deleted files.
- **L:** Legacy namespace pack. Matching basenames occur in the external-consumer script, but that script reads a separately generated `.tmp/.../tarballs` directory, not these package-root paths. Historical audit references are not active dependencies.
- **M:** Misplaced Button pack; no dependency points to this location. References in the original audit describe the defect. A basename match to the consumer fixture resolves to `packages/button`, not Notification/Toast.
- **R:** Direct dependency of tracked `.tmp/consumer-test`; retained without modification.

| Original tracked path | Internal package identity | Decision / evidence |
|---|---|---|
| `packages/accordion/skyra-tech-platform-accordion-0.1.0.tgz` | `@skyra-tech-platform/accordion` | Removed — U |
| `packages/app-shell/skyra-tech-platform-app-shell-0.1.0.tgz` | `@skyra-tech-platform/app-shell` | Removed — G |
| `packages/button/skyra-tech-platform-button-0.1.0.tgz` | `@skyra-tech-platform/button` | **Retained — R** |
| `packages/checkbox/skyra-tech-platform-checkbox-0.1.0.tgz` | `@skyra-tech-platform/checkbox` | Removed — U |
| `packages/collapsible/skyra-tech-platform-collapsible-0.1.0.tgz` | `@skyra-tech-platform/collapsible` | Removed — U |
| `packages/data-export/skyra-tech-platform-data-export-0.1.0.tgz` | `@skyra-tech-platform/data-export` | Removed — U |
| `packages/date-time/skyra-tech-platform-date-time-0.1.0.tgz` | `@skyra-tech-platform/date-time` | Removed — U |
| `packages/design-tokens/skyra-design-tokens-0.1.0.tgz` | `@skyra/design-tokens` | Removed — L |
| `packages/design-tokens/skyra-tech-platform-design-tokens-0.1.0.tgz` | `@skyra-tech-platform/design-tokens` | Removed — U |
| `packages/dialog/skyra-tech-platform-dialog-0.1.0.tgz` | `@skyra-tech-platform/dialog` | Removed — U |
| `packages/dynamic-form/skyra-dynamic-form-0.1.0.tgz` | `@skyra/dynamic-form` | Removed — L; stale candidate for the generic isolation-script scan |
| `packages/dynamic-form/skyra-tech-platform-dynamic-form-0.1.0.tgz` | `@skyra-tech-platform/dynamic-form` | Removed — G |
| `packages/dynamic-select/skyra-tech-platform-dynamic-select-0.1.0.tgz` | `@skyra-tech-platform/dynamic-select` | Removed — U |
| `packages/input/skyra-tech-platform-input-0.1.0.tgz` | `@skyra-tech-platform/input` | Removed — U |
| `packages/notification/skyra-tech-platform-button-0.1.0.tgz` | `@skyra-tech-platform/button` | Removed — M |
| `packages/notification/skyra-tech-platform-notification-0.1.0.tgz` | `@skyra-tech-platform/notification` | Removed — U |
| `packages/radio/skyra-tech-platform-radio-0.1.0.tgz` | `@skyra-tech-platform/radio` | Removed — U |
| `packages/switch/skyra-tech-platform-switch-0.1.0.tgz` | `@skyra-tech-platform/switch` | Removed — U |
| `packages/tabs/skyra-tech-platform-tabs-0.1.0.tgz` | `@skyra-tech-platform/tabs` | Removed — U |
| `packages/textarea/skyra-tech-platform-textarea-0.1.0.tgz` | `@skyra-tech-platform/textarea` | Removed — U |
| `packages/toast/skyra-tech-platform-button-0.1.0.tgz` | `@skyra-tech-platform/button` | Removed — M |
| `packages/toast/skyra-tech-platform-toast-0.1.0.tgz` | `@skyra-tech-platform/toast` | Removed — U |
| `packages/utils/skyra-tech-platform-utils-0.1.0.tgz` | `@skyra-tech-platform/utils` | Removed — U |
| `packages/validation/skyra-tech-platform-validation-0.1.0.tgz` | `@skyra-tech-platform/validation` | Removed — U |

## 4. Misplaced Button archives and retained consumer dependency

Both Notification/Toast Button archives internally declare:

```json
{ "name": "@skyra-tech-platform/button", "version": "0.1.0" }
```

Both are 9,573 bytes and share SHA-256:

```text
bfec3c228738bb3b36e3e8caa23558f7382d1df658d1abc52ad370e924e51f46
```

They are byte-identical to each other, but differ from the retained Button archive. They are not Notification or Toast packages despite their directory locations.

The tracked consumer's dependency is:

```json
"@skyra-tech-platform/button": "file:..\\..\\packages\\button\\skyra-tech-platform-button-0.1.0.tgz"
```

Resolving this path relative to `.tmp/consumer-test/package.json` identifies the retained archive. Its internal metadata is `@skyra-tech-platform/button@0.1.0`; every declared root export target is present in the archive. Its unchanged SHA-256 is:

```text
e6179c8dd9f0002f24af7df77ccceb531f7952f1e060cdf4e63fcf09676191b7
```

Although `.tmp/` is ignored for new files, this consumer project is already tracked and was added during the Button migration. Its direct dependency was not dismissed merely because of its directory name. Its continued use remains a reason to retain this fixture.

## 5. Workflow audit and minimal changes

Inspected root/package scripts, pnpm workspace settings, relevant package-manager configuration, CI/release workflows, packaging/isolation scripts, documentation references, tracked consumer manifests, and archive-related Git history.

- No root, Dashboard, or workspace package manifest and no pnpm lockfile entry references a removed local tarball as a dependency.
- CI and `scripts/platform-validate.sh` pack current packages into `.tmp/platform-consumer-validation/tarballs` before use.
- Release workflow packs into `.tmp/tarballs`; it does not publish the deleted package-root copies.
- `packages/app-shell/test-isolation.cjs` generates its expected archive before installation.
- `scripts/test-package-isolation.mjs` generates Dynamic Form's archive before selecting a package-root `.tgz`; stale committed copies can cause its generic first-match scan to choose an obsolete archive.
- The external-consumer script contains legacy tarball names but reads the generated scratch tarball directory. Those existing namespace/workflow defects were not modified as part of F-08.
- Registry URL `.tgz` references in lockfiles are registry downloads, not these local package artifacts.
- No documentation procedure requiring the removed package-root bytes was found. Audit reports describe historical findings and were preserved.

Removed the 23 approved individual files with `Remove-Item -LiteralPath`, using an explicit inventory-derived list. Each resolved absolute target was checked to remain inside this repository and to be a single `.tgz` file. No wildcard or recursive deletion, broad cleanup, or index mutation was used.

Added only this narrowly scoped block to `.gitignore`:

```gitignore
# Locally packed packages; retain the tracked consumer-test Button fixture
/packages/*/*.tgz
!/packages/button/skyra-tech-platform-button-0.1.0.tgz
```

Checks confirmed that a generated package-root archive is ignored, the retained Button path is exempt, and nested test-fixture archive paths are not caught by the rule.

## 6. Validation commands and actual results

Commands ran at repository root unless noted. Logs and inventory evidence are retained under ignored `.tmp/f08/`.

| Command/check | Exit | Actual evidence |
|---|---:|---|
| `git ls-files '*.tgz'` before and after | 0 | 24 index entries both times; no staging performed |
| `git ls-files --deleted '*.tgz'` | 0 | Exactly 23 pending deletions, matching the explicit removal list |
| `tar -xOf <each tracked archive> package/package.json` | 0 for all 24 | All internal names/versions recorded before removal |
| `tar -tf` on Notification's misplaced Button archive, the retained fixture, and fresh pack proofs | 0 | Archive members inspected without extraction over repository files |
| Targeted `git grep` for `.tgz`, `pnpm pack`, and `npm pack` in tooling/consumer files | 0 | References classified by actual path and generation order |
| `git grep -n -I -E '\.tgz\|file:.*packages' -- package.json dashboard/package.json 'packages/*/package.json' pnpm-lock.yaml` | 1 | Expected no matches; no removed-file dependency found in workspace manifests/lockfile |
| Node assertions for dependency-path resolution, retained archive metadata/export members, ignore behavior, pending-deletion list, and hash preservation | 0 | All assertions passed |
| `pnpm --filter @skyra-tech-platform/app-shell pack --pack-destination <F08 scratch directory>` | 1 | Unsupported filtered pack form: `Unknown option: recursive` |
| `pnpm --filter @skyra-tech-platform/dynamic-form pack --pack-destination <F08 scratch directory>` | 1 | Same command-form error; not counted as a successful pack |
| `pnpm pack --pack-destination C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/.tmp/f08/pack-proof` from `packages/app-shell` | 0 | Fresh App Shell archive generated without the deleted copy |
| Same `pnpm pack --pack-destination` command from `packages/dynamic-form` | 0 | Fresh canonical Dynamic Form archive generated without either deleted copy |
| Node assertions against both fresh archives | 0 | Correct names/version; App Shell's four export targets and Dynamic Form's three targets present; no nested `.tgz` members |
| `pnpm typecheck` | 0 | 49 successful Turbo tasks; 13 cached, 36 executed |
| `pnpm lint` | 0 | 45 successful Turbo tasks; 32 cached, 13 executed |
| `pnpm api:check` | 0 | All configured API governance checks passed |
| `git diff --check` | 0 | No whitespace errors; existing LF/CRLF warnings emitted |

The actual targeted search used the alternation expression `\.tgz|file:.*packages`; the escaped table separator above represents the same expression. Packaging command retries corrected invocation syntax; no implementation or workflow was weakened to obtain a pass.

## 7. Limits and retained dependencies

- One original archive is intentionally retained because of an actual tracked consumer dependency. Migrating or deleting that consumer is outside F-08.
- Fresh packing verifies generation and declared archive members, not a full clean consumer install or browser build. The old isolation scripts were not run wholesale because they install dependencies and write/delete unrelated scratch or external directories. Their relevant pack-generation step was tested separately.
- CI/release workflows and external registry publication were inspected, not executed. Existing legacy names in the external-consumer script remain outside scope.
- Workspace lint contains placeholder scripts and missing lint tasks; its success is not a claim of comprehensive genuine lint validation.
- API governance validates configured declarations/baselines, not archive correctness. Direct archive inspection and targeted pack proofs provide the artifact-specific evidence.
- No package API, component behavior, or export-resolution change was made, so no new browser suite or broad package-resolution sweep was required or claimed.
- No pre-existing untracked/ignored tarball was deleted. Project-level physical tarballs were captured excluding dependency and Git-internal directories; the only removals were the 23 explicit original Git-index paths.

## 8. Preservation and final scope

Initial state: `main`, no staged changes; 13 modified tracked files with 1,024 insertions and 947 deletions, plus earlier untracked work. SHA-256 snapshots covered all **24 pre-existing modified/untracked files**, including earlier audit reports and tests.

Final comparison confirmed all 24 pre-existing files remained byte-for-byte unchanged. The retained Button archive and tracked consumer project were preserved. Git status comparison confirmed that only `.gitignore`, the 23 exact archive deletions, and this new report were added to the initial status.

Final tracked diff: **37 files**, 1,028 insertions and 947 deletions, plus 23 binary deletions. The four new text lines are the scoped ignore block; previous text changes remain attributable to earlier tasks. The report is untracked and therefore absent from `git diff --stat` until explicitly staged by the user.

No package source, manifest, exports, API, version, dependency, unrelated archive, or earlier work was changed. No preservation discrepancy was found. ERP and SkyraQR were not accessed or modified.

## 9. Verdict

**PASS:** the inventory and mismatches were confirmed, 23 unjustified committed pack outputs were removed from the working tree, the referenced Button fixture was retained, narrowly scoped recurrence protection was added, and required gates plus targeted packaging checks passed. Git index/history changes remain unperformed as requested.

F-09 and all subsequent remediation remain unstarted.

## 10. Suggested commit message

```text
chore(packages): remove stale tarballs and preserve referenced Button fixture
```

Suggestion only. No commit, push, or pull was performed.
