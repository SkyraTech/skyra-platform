# Skyra Platform — Package Versioning & Release Hardening Report
## Milestone: PLATFORM-LOGHUB-004 — Final Package Versioning, Branding Governance & Shared UI Integration Closure

**Status:** PASS — RELEASE HARDENING & VERSIONING INTEGRITY CERTIFIED  
**Author:** Principal Frontend Architect & Design System Maintainer  
**Workspace:** `SkyraTechProjects` (`skyra-platform`)  
**Previous Milestone:** PLATFORM-LOGHUB-003  
**Date:** October 2026  

---

## 1. Executive Summary

During the PLATFORM-LOGHUB-003 acceptance audit, an issue in package release integrity was identified: modified distributable packages (specifically `@skyra-tech-platform/button`, `@skyra-tech-platform/tabs`, `@skyra-tech-platform/loader`, `@skyra-tech-platform/accordion`, and `@skyra-tech-platform/collapsible`) were rebuilt with bug fixes and styling improvements while retaining the initial `0.1.0` version identifier. This posed an architectural risk of silent non-deterministic package overwrites across local and remote consumers.

In PLATFORM-LOGHUB-004, we instituted a formal semantic versioning and release policy:
1. **Changesets Integration**: Configured Changesets across the monorepo workspace to track changes and patch releases. Fixed an anomaly in `@skyra-tech-platform/date-time` (`private: true` flag removed) that prevented Changesets dependency graph traversal.
2. **Semantic Version Increment (v0.1.1)**: Formally bumped all 6 modified packages (`accordion`, `button`, `collapsible`, `design-tokens`, `loader`, `tabs`) to `v0.1.1`.
3. **Immutable Baseline (v0.1.0)**: Preserved all 25 unmodified packages strictly at `v0.1.0`.
4. **Authoritative TypeScript Design Tokens**: Enhanced `@skyra-tech-platform/design-tokens` with strongly typed semantic token mappings (`severityTokens`, `getSeverityColor`) to eliminate literal color strings in consumer TypeScript logic.
5. **Cryptographic Manifest Synchronization**: Rebuilt all 31 package tarballs with versioned filenames (`*-0.1.1.tgz`) and updated `PACKAGES_MANIFEST.json` containing SHA-256 cryptographic hashes for full release reproducibility.
6. **Full Test & Build Validation**: Turbo executed 59 successful tasks across all 32 workspace packages with 0 test failures.

---

## 2. Root Cause Analysis: Versioning & Overwriting Risk

### The Defect
In milestone PLATFORM-LOGHUB-001 and PLATFORM-LOGHUB-002, defect fixes were introduced in `packages/button/src/skyra-tech-button.css.ts`, `packages/tabs/src/skyra-tabs.css.ts`, `packages/loader/src/skyra-progress.ts`, etc. However, because `packages/*/package.json` maintained `"version": "0.1.0"`, running `pnpm pack` produced identical archive names (`skyra-tech-platform-button-0.1.0.tgz`).

When consumer package managers (pnpm / npm) resolve dependencies pointing to fixed tarball names or paths without a version change, local cache layers, lockfile content hashes, and virtual store directories (`.pnpm/...`) may not detect updated binaries unless manually cleared or forced. This broke the contract of release immutability.

### The Resolution
- Established standard Changesets workflow (`.changeset/platform-loghub-004-hardening.md`).
- Only modified packages received a semantic patch version bump (`0.1.0` -> `0.1.1`).
- `sync-platform-packages.cjs` was updated to pack packages using their explicit `pkg.version`, outputting version-specific archives (e.g., `skyra-tech-platform-button-0.1.1.tgz`).
- Regenerated `PACKAGES_MANIFEST.json` mapping each package to its exact version, archive file, and SHA-256 checksum.

---

## 3. Package Inventory & Version Changes

| Package Name | Previous Version | Hardened Version | Reason for Version Bump / Status | Archive Filename |
|---|---|---|---|---|
| `@skyra-tech-platform/accordion` | `0.1.0` | `0.1.1` | Fixed styling & collapsible transition behavior | `skyra-tech-platform-accordion-0.1.1.tgz` |
| `@skyra-tech-platform/app-shell` | `0.1.0` | `0.1.0` | Unchanged baseline; export and styling stable | `skyra-tech-platform-app-shell-0.1.0.tgz` |
| `@skyra-tech-platform/badge` | `0.1.0` | `0.1.0` | Unchanged baseline; dot and variants stable | `skyra-tech-platform-badge-0.1.0.tgz` |
| `@skyra-tech-platform/button` | `0.1.0` | `0.1.1` | Fixed outline border, loading spinner slot, focus rings | `skyra-tech-platform-button-0.1.1.tgz` |
| `@skyra-tech-platform/checkbox` | `0.1.0` | `0.1.0` | Unchanged baseline | `skyra-tech-platform-checkbox-0.1.0.tgz` |
| `@skyra-tech-platform/collapsible` | `0.1.0` | `0.1.1` | Fixed disclosure animation & ARIA attributes | `skyra-tech-platform-collapsible-0.1.1.tgz` |
| `@skyra-tech-platform/command-palette`| `0.1.0` | `0.1.0` | Unchanged baseline | `skyra-tech-platform-command-palette-0.1.0.tgz` |
| `@skyra-tech-platform/context-menu` | `0.1.0` | `0.1.0` | Unchanged baseline | `skyra-tech-platform-context-menu-0.1.0.tgz` |
| `@skyra-tech-platform/data-export` | `0.1.0` | `0.1.0` | Unchanged baseline | `skyra-tech-platform-data-export-0.1.0.tgz` |
| `@skyra-tech-platform/data-table` | `0.1.0` | `0.1.0` | Unchanged baseline | `skyra-tech-platform-data-table-0.1.0.tgz` |
| `@skyra-tech-platform/date-time` | `0.1.0` | `0.1.0` | Removed `"private": true`; baseline preserved | `skyra-tech-platform-date-time-0.1.0.tgz` |
| `@skyra-tech-platform/design-tokens` | `0.1.0` | `0.1.1` | Added `severityTokens` & `getSeverityColor` TS exports | `skyra-tech-platform-design-tokens-0.1.1.tgz` |
| `@skyra-tech-platform/dialog` | `0.1.0` | `0.1.0` | Unchanged baseline | `skyra-tech-platform-dialog-0.1.0.tgz` |
| `@skyra-tech-platform/drawer` | `0.1.0` | `0.1.0` | Unchanged baseline | `skyra-tech-platform-drawer-0.1.0.tgz` |
| `@skyra-tech-platform/dropdown-menu` | `0.1.0` | `0.1.0` | Unchanged baseline | `skyra-tech-platform-dropdown-menu-0.1.0.tgz` |
| `@skyra-tech-platform/dynamic-form` | `0.1.0` | `0.1.0` | Unchanged baseline | `skyra-tech-platform-dynamic-form-0.1.0.tgz` |
| `@skyra-tech-platform/dynamic-select`| `0.1.0` | `0.1.0` | Unchanged baseline | `skyra-tech-platform-dynamic-select-0.1.0.tgz` |
| `@skyra-tech-platform/empty-state` | `0.1.0` | `0.1.0` | Unchanged baseline | `skyra-tech-platform-empty-state-0.1.0.tgz` |
| `@skyra-tech-platform/input` | `0.1.0` | `0.1.0` | Unchanged baseline | `skyra-tech-platform-input-0.1.0.tgz` |
| `@skyra-tech-platform/loader` | `0.1.0` | `0.1.1` | Fixed progress indeterminate animation & spinner size | `skyra-tech-platform-loader-0.1.1.tgz` |
| `@skyra-tech-platform/notification`| `0.1.0` | `0.1.0` | Unchanged baseline | `skyra-tech-platform-notification-0.1.0.tgz` |
| `@skyra-tech-platform/pdf-viewer` | `0.1.0` | `0.1.0` | Unchanged baseline | `skyra-tech-platform-pdf-viewer-0.1.0.tgz` |
| `@skyra-tech-platform/popover` | `0.1.0` | `0.1.0` | Unchanged baseline | `skyra-tech-platform-popover-0.1.0.tgz` |
| `@skyra-tech-platform/qr` | `0.1.0` | `0.1.0` | Unchanged baseline | `skyra-tech-platform-qr-0.1.0.tgz` |
| `@skyra-tech-platform/radio` | `0.1.0` | `0.1.0` | Unchanged baseline | `skyra-tech-platform-radio-0.1.0.tgz` |
| `@skyra-tech-platform/switch` | `0.1.0` | `0.1.0` | Unchanged baseline | `skyra-tech-platform-switch-0.1.0.tgz` |
| `@skyra-tech-platform/tabs` | `0.1.0` | `0.1.1` | Fixed tab indicator positioning & keyboard arrows | `skyra-tech-platform-tabs-0.1.1.tgz` |
| `@skyra-tech-platform/textarea` | `0.1.0` | `0.1.0` | Unchanged baseline | `skyra-tech-platform-textarea-0.1.0.tgz` |
| `@skyra-tech-platform/toast` | `0.1.0` | `0.1.0` | Unchanged baseline | `skyra-tech-platform-toast-0.1.0.tgz` |
| `@skyra-tech-platform/utils` | `0.1.0` | `0.1.0` | Unchanged baseline | `skyra-tech-platform-utils-0.1.0.tgz` |
| `@skyra-tech-platform/validation` | `0.1.0` | `0.1.0` | Unchanged baseline | `skyra-tech-platform-validation-0.1.0.tgz` |

---

## 4. TypeScript Design-Token API Enhancements

To eliminate hardcoded hex codes (such as `#0A58CA` or `#DC3545`) in consumer TypeScript code, `@skyra-tech-platform/design-tokens` was enhanced with:
1. `severityTokens`: An authoritative frozen dictionary of ECS severity hex codes derived from official Skyra tokens:
   - `fatal`: `#991B1B`
   - `error`: `#DC2626`
   - `warn`: `#D97706`
   - `info`: `#0A58CA`
   - `debug`: `#4B5563`
   - `trace`: `#6B7280`
2. `getSeverityColor(level: string): string`: A safe lookup utility that normalizes case and returns the authoritative hex code, falling back to `#4B5563`.
3. Added comprehensive unit tests in `packages/design-tokens/src/index.test.ts` verifying all levels and fallbacks (5/5 PASS).
4. Rebuilt package distributions providing ESM (`dist/index.js`), CJS (`dist/index.cjs`), and TypeScript declarations (`dist/index.d.ts`).

---

## 5. Build, Packaging & Reproducibility Evidence

- **Changeset Status Check**: `pnpm -C skyra-platform exec changeset status`
  - Output: Exit Code 0, 16 packages registered in release graph.
- **Sync & Pack Command**: `node skyra-platform/scripts/sync-platform-packages.cjs`
  - Result: Built all 31 packages; generated versioned archives in `skyra-log-hub/artifacts/platform-packages/`.
  - Manifest Checksums: SHA-256 computed for each archive and serialized into `PACKAGES_MANIFEST.json`.
- **Turbo Test Suite**: `pnpm -C skyra-platform test`
  - Result: 59 tasks successful, 0 failures, 3m59s total time.

---

## 6. How Future Skyra Applications Should Consume Packages

1. **Local Monorepo Consumption**:
   - Reference platform packages via `file:../artifacts/platform-packages/skyra-tech-platform-<name>-<version>.tgz`.
   - Never use unpublished mutable tarball names without matching semver updates.
2. **Authoritative Design Tokens**:
   - Web / CSS: Load `@skyra-tech-platform/design-tokens/styles.css` or map `--skyra-*` variables.
   - TypeScript / Charts / Visual Logic: Import `{ severityTokens, getSeverityColor }` from `@skyra-tech-platform/design-tokens`.
3. **Changeset Release Governance**:
   - Run `pnpm changeset` when modifying a component in `skyra-platform`.
   - Run `node scripts/sync-platform-packages.cjs` to produce versioned release artifacts and update `PACKAGES_MANIFEST.json`.

---

## 7. Acceptance Verdict

**PASS** — All package versioning requirements, Changesets integration, semantic version increments, cryptographic manifests, and test gates are satisfied.

