# F-17 — API Catalog CI Gate Final Audit Report

Date: 2026-10-15

**Verdict: PASS.** The existing pull-request/main-push quality job now builds canonical package declarations and runs the real, non-writing F-16 catalog gate. Local workflow-equivalent execution passed: 28 package builds, 274 current APIs across 29 declaration entry points, and 17 focused tests. Hosted CI was not run or observed.

## Selected workflow and exact changes

Workflow: `.github/workflows/platform-ci.yml`, job: `platform-quality` (Platform Quality Gates). It runs on all pull requests and pushes to main. This is the appropriate repository quality gate; release.yml runs only on main and includes registry authentication/publication, so it was left byte-for-byte unchanged.

Only eight lines were added to the workflow, immediately after Regression Tests and before the existing Build Packages step:

```yaml
      - name: Build API Catalog Declarations
        run: pnpm --filter './packages/**' -r build

      - name: API Catalog Integrity Check
        run: |
          mkdir -p .tmp/f16
          pnpm --filter dashboard catalog:check
```

No root/package scripts, dependencies, catalog data, extractor, tests, release settings, authentication or deployment settings changed. The second new file is this report. Existing workflow steps retain their commands and order. Removing precisely the new block reconstructs the original workflow (normalizing line endings for this structural assertion).

## Prerequisites and execution order

The existing install uses pnpm 9.12.0, frozen lockfile, and Node 20. The added recursive pnpm filter selects only packages beneath packages/, not the Dashboard; the local result confirmed 28 of 30 workspace projects. Pnpm executes dependency-aware package builds, including declaration generation. QR builds both core and web-component declarations; design-tokens builds its TypeScript entry alongside its existing CSS publication contract. All 29 explicit F-16 declaration targets were validated afterward.

The resulting order is install → existing typecheck/lint/regression gates → package-only declaration build → catalog:check → existing full build → existing API governance and other gates. Turbo's existing typecheck/test dependency configuration may already build some libraries; the dedicated build makes the catalog prerequisite explicit rather than relying on incidental cache state. Existing full build behavior is retained, even though this means duplicate package builds are possible.

The added build does not invoke Next.js or the Dashboard build. The pre-existing workflow still contains production Dashboard builds later; F-17 did not run those locally or alter them. They are not prerequisites for the new gate.

The F-16 test helper uses mkdtemp under .tmp/f16. A clean CI checkout may lack that ignored parent, so mkdir -p ensures it exists. It neither deletes nor rewrites existing evidence, and tests allocate unique child directories. This is a test scratch prerequisite, not catalog generation. Locally the existing parent was already available; the same test allocation behavior ran.

## Failure and non-writing semantics

Dashboard catalog:check remains exactly:

```text
tsx scripts/extract-api.ts --check && tsx --test scripts/extract-api.test.ts
```

The extractor resolves canonical manifest identities/public export targets, requires declarations, validates references and compares deterministic extraction with checked-in apis.json. Drift throws and sets exit code 1; the && prevents a later test success from masking an extractor failure. The workflow step has no condition, continue-on-error or error suppression. No catalog:extract step was added.

API governance is distinct: pnpm api:check compares governed public API signatures/baselines. The catalog gate checks current declaration-derived documentation identities, deterministic data and catalog/metadata relationships, plus the focused F-16 regressions. Both commands remain separate; neither replaces the other.

## Executed validation

All successful package builds/checks below were fresh processes, not cached Turbo results. Logs are retained in the new ignored .tmp/f17/ evidence directory.

| Command/check | Actual exit | Meaningful result |
|---|---:|---|
| pnpm --filter './packages/**' -r build | 0 | 28 canonical packages built with ESM/CJS/declarations through their existing scripts. Evidence: build-approved.log and build-approved.exit. |
| pnpm --filter dashboard catalog:check | 0 | Validated 274 current APIs from 29 published entry points; 17 tests passed, zero failures/skips. Evidence: catalog-check.log. |
| pnpm exec tsx .tmp/f17/negative-probe.ts drift | 1 (expected) | Isolated fixture first passed generation/check, then stale fixture catalog failed with “API catalog is out of date; run extraction”; stale bytes remained unchanged. |
| pnpm exec tsx .tmp/f17/negative-probe.ts missing | 1 (expected) | Separate fixture first passed generation/check, then its declaration was moved within its own scratch directory; failed with “Missing required declaration packages/fixture/dist/index.d.ts; build @skyra-tech-platform/fixture”. Output remained unchanged. |
| Node YAML/workflow assertions, via PowerShell here-string piped to node | 0 | Existing installed yaml 2.9.1 parser reported no YAML errors; PR/main triggers, exact build/check commands, ordering, absence of optional/suppressed gate behavior, separate governance, and unchanged original steps asserted. Evidence: workflow-validation.log. |
| pnpm api:check | 0 | All API governance checks passed. Evidence: api-check.log. |
| git diff --check | 0 | No whitespace errors. Evidence: diff-check.log. |
| git diff --cached --quiet (spawned by preservation script) | 0 | No staged changes. |
| SHA-256 baseline comparison and protected-fixture/link verification | 0 final | Only authorized workflow bytes changed among 557 baseline files; all 40 fixture entries matched. Evidence: preservation.json. |

The negative probes import the actual F-16 generate implementation in check mode with their isolated target; they are process-level failure probes, not a hosted GitHub Actions run. The production package command itself passed, including existing invalid-identity/reference, missing-declaration, drift, historical lookup and partial-write protection tests.

An initial sandboxed build attempt produced no build output and was interrupted (session exit 1); it is not counted as a build pass or package failure. The subsequent approved execution completed with exit 0. Two exploratory inventory commands also encountered absent optional AGENTS/.agents or an incorrectly guessed prior evidence filename; these were inspection misses, not validation passes. No AGENTS.md files were found at the root or searched affected paths. An initial fixture comparison used the wrong representation for three stored link objects; inspecting and comparing their actual link targets corrected the verifier, with zero real fixture discrepancies. No repository files were reverted or repaired in response.

## Preservation and final Git state

Initial: 50 modified tracked files, 14 untracked files, zero staged changes. Initial full status/diff-stat and hashes were captured under .tmp/f17 before edits.

Final: 51 modified tracked files and 15 untracked files (including this report), zero staged changes. The sole added tracked modification is .github/workflows/platform-ci.yml; the sole new nonignored file is this report. The workflow adds eight lines. All 556 other baseline files remain byte-for-byte unchanged, including every existing F-08–F-16 report/fix, all package manifests, F-16 data and examples, F-15 workflow/tests, and release.yml. Active/historical API catalogs, active/historical examples and protected Dashboard file are included in these hashes.

Protected dashboard/next-env.d.ts SHA-256 remains:

`083e23c4c5e7761db151134ea1ef7896120c86c5888cdc8a861f534f7e86d6fd`

Additional prior protected inventory verification matched all 40 entries (regular file hashes and symbolic-link targets), including existing consumer fixtures and retained Button tarball. The only package-root archive remains the pre-existing packages/button/skyra-tech-platform-button-0.1.0.tgz; no archive was generated. Expected ignored library dist outputs were rebuilt by the explicitly required package build; no tracked or nonignored pre-existing file other than the authorized workflow changed. Scratch probes/evidence use new .tmp/f17 paths; F-16 tests create unique scratch children without overwriting old evidence.

No ERP/QR-generator file changed. No staging, commit, push, pull, branch switch, reset, clean, discard or revert occurred. Full final status is stored at .tmp/f17/final-status.txt.

## Limitations

- Hosted GitHub Actions execution was not requested, run or observed. YAML parsing/structural assertions and local command equivalence do not prove hosted runner availability, registry credentials or unrelated existing gates pass.
- Local runtime is Node 24.14.0 on Windows; CI retains Node 20 on Ubuntu. No new runtime API/dependency was introduced. A hosted Node 20 run remains unverified.
- No registry installation, release workflow, full root build, production Dashboard build, browser suite or deployment was run. This deliberately preserves next-env.d.ts. Existing registry/release and other quality-job behavior is unchanged.
- No root lint/typecheck was rerun for a YAML-only change. Existing workspace lint placeholders do not provide comprehensive lint coverage. YAML was parsed with the installed YAML parser; actionlint was not available/run.
- Earlier workflow gates can fail before reaching the new step, as with any sequential fail-fast job; their success is not evidence the catalog gate ran. The explicit named catalog step and its output provide that evidence when hosted CI runs.

Suggested message for a future explicitly authorized commit only:

```text
ci: enforce API catalog integrity checks
```

Stopped after F-17 for review; no F-18 work started.
