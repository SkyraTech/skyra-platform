# Contributing to Skyra Platform

## 1. Platform Purpose
The Skyra Platform is a reusable internal software foundation. It provides UI components, validation logic, and design tokens for consumption by SkyraQR, SkyraERP, Skyra Jarvis, and future applications.

**Rule:** Platform packages must NOT contain application secrets, database implementations, sessions, or application-specific business logic.

## 2. Repository Structure
The repository is managed as a Turborepo/pnpm monorepo.
- `packages/*`: The published, reusable packages.
- `dashboard/`: An internal engineering workbench for developing and testing components visually.

## 3. Package Layers & Dependency Direction
Packages follow a strict dependency hierarchy:
- **Layer 1 (Runtime-neutral):** `@skyra/design-tokens`, `@skyra/utils`, `@skyra/validation`.
- **Layer 2 (React UI Primitives):** `@skyra/ui`, `@skyra/data-table`, `@skyra/dynamic-form`, `@skyra/dialogs`, `@skyra/app-shell`.
- **Layer 3 (Advanced Modules):** `@skyra/data-export`, `@skyra/qr`.

**Rule:** Higher layers may depend on lower layers. Lower layers MUST NOT depend on higher layers.

## 4. Runtime Classification & Dependency Governance
Every package MUST declare its runtime requirements using the correct dependency mechanism:
- **`dependencies`:** For runtime implementations required by the package logic.
- **`peerDependencies`:** For host integrations (e.g., React, ReactDOM) where the consumer must provide a singleton instance.
- **`devDependencies`:** For tooling and testing.

## 5. Development Commands
- `pnpm dev`: Starts the dashboard and package watchers.
- `pnpm build`: Compiles all packages using tsup.
- `pnpm test`: Runs the Vitest and jest-axe suites.
- `pnpm typecheck`: Validates TypeScript strictness.
- `pnpm lint`: Validates code style.

## 6. Definition of Done
A Platform PR is "Done" when:
- **Implementation:** No new `any` or `@ts-ignore` usages are introduced.
- **Quality:** `pnpm test` passes, including 100% `jest-axe` accessibility coverage.
- **Style:** Design tokens are used. No uncontrolled global CSS mutations are introduced.
- **Documentation:** The package `README.md` is updated.
- **Distribution:** `pnpm build` and the external consumer validation checks pass in CI.
- **Release Intent:** A Changeset is included if the change is release-relevant.

## 7. Versioning & Changesets
We use [Changesets](https://github.com/changesets/changesets) for release intent and changelog generation.
A Changeset is **REQUIRED** when a PR changes public behavior, APIs, exports, dependencies, or releasable features.
A Changeset is **NOT REQUIRED** for internal CI tweaks, tests, or formatting.

To create a changeset, run:
```bash
pnpm changeset
```

### Pre-1.0 Versioning Rules
Because the platform is below `1.0.0`, breaking changes are handled carefully:
- **PATCH (0.x.y → 0.x.(y+1)):** Bug fixes, internal refactoring, non-breaking docs.
- **MINOR (0.x.y → 0.(x+1).0):** Breaking public API changes, removed exports, incompatible runtime changes. (Equivalent to a Major bump).

### Post-1.0 Versioning Rules
Once a package reaches `1.0.0`:
- **PATCH:** Compatible bug fixes.
- **MINOR:** Backward-compatible new features.
- **MAJOR:** Breaking API changes.

### API Lifecycle & Deprecation
- **Experimental:** May change without breaking version bumps.
- **Stable:** Default state. Breaking changes require appropriate version bumps.
- **Deprecated:** Must be supported for one applicable breaking-release cycle before removal:
  - Before 1.0: Supported for one `0.x` MINOR release.
  - After 1.0: Supported for one MAJOR release.

## 8. Prohibited Patterns
- Do NOT introduce ERP business logic into Platform.
- Do NOT add new global CSS resets without an explicit `tokens.css` boundary.
- Do NOT bypass `tsup` configuration or alter the ESM/CJS dual-distribution model.
