# SKYRA PLATFORM PHASE 9.2
# DOCUMENTATION, VERSIONING & CONTRIBUTION GOVERNANCE SPECIFICATION

## 1. Purpose
Establish the formal governance contract for the Skyra Platform. This specification defines how the platform is documented, versioned, contributed to, and released. It transitions the platform from relying on implicit developer discipline to explicit, enforceable rules.

## 2. Scope
This specification applies to all packages within the `packages/*` directory of the `skyra-platform` monorepo, as well as the overarching release and contribution processes. It does not alter Phase 8 (package distribution) or the Phase 9.1 findings (which remain slated for resolution in subsequent phases).

## 3. Package Documentation Standard
Every public package MUST contain a `README.md` at its root. 
The standard structure is:
1. **Package Name & Description:** Brief purpose of the package.
2. **Runtime Support:** Explicit statement (e.g., "Runtime-neutral", "React only", "Browser-only").
3. **Installation:** `pnpm add @skyra/<package-name>`.
4. **Basic Usage:** A minimal code example.
5. **API & Exports:** Documented public exports and subpaths.
6. **Dependencies / Peer Dependencies:** Required host dependencies.
7. **Accessibility & Responsive Behavior:** (If applicable to UI packages).
8. **Theming:** Required tokens or CSS files.
9. **Version & Lifecycle:** Current version and stability tag (e.g., `@stable`, `@experimental`).

## 4. Component Documentation Standard
Reusable components (e.g., Button, DataTable, QRCode) must be documented either in the package README (if small) or within a dedicated docs section/Dashboard.
The standard requires:
- **Purpose:** What it does.
- **Usage & API:** Required vs optional props.
- **Variants/States:** Visual and behavioral states.
- **Keyboard & Accessibility:** Focus management, ARIA roles.
- **Responsive Behavior:** How it adapts to mobile (e.g., CSS Grid `auto-fit`).
- **Dark Mode:** Verification of token consumption.
- **Do/Don't Guidance:** Explicit integration boundaries.

## 5. Public API Definition
**PUBLIC API:**
- Root exports defined in `package.json` (`"."`).
- Documented subpath exports (e.g., `"./core"`, `"./react"`).
- Documented interfaces, types, and components.

**INTERNAL API:**
- Anything imported via deep paths (`@skyra/ui/src/internal/helper.ts`).
- Private helpers, internal hooks, test files.
- Consumers **MUST NOT** depend on internal paths. Doing so voids all SemVer guarantees.

## 6. API Lifecycle
The platform adopts the following strict lifecycle:
- **EXPERIMENTAL:** New APIs. Marked with `@experimental` in TSDoc. May experience breaking changes in minor/patch releases. Not recommended for production critical paths.
- **STABLE:** Default state for released APIs. Marked with `@stable`. Breaking changes require a MAJOR version bump.
- **DEPRECATED:** APIs slated for removal. Marked with `@deprecated`. Must include a migration path. Supported for a minimum of 1 MAJOR release cycle before removal.
- **REMOVED:** API no longer exists.

## 7. Semantic Versioning Policy
The platform strictly adheres to Semantic Versioning (SemVer):
- **PATCH (x.y.Z):** Bug fixes, internal refactoring, dependency updates, documentation fixes. No public API changes.
- **MINOR (x.Y.z):** Backward-compatible new features (new components, new optional props, new exports). 
- **MAJOR (X.y.z):** Breaking changes (removed exports, changed required props, incompatible runtime changes, dropping Node/React versions).

## 8. Pre-1.0 Versioning Policy
Because all packages are currently `0.1.0`, the platform adopts the standard Pre-1.0 SemVer exception:
- **0.x MINOR (0.Y.z):** Acts as a MAJOR version for breaking changes.
- **0.x PATCH (0.y.Z):** Used for non-breaking features and bug fixes.
- **Requirement:** Once the platform is deemed architecturally settled, it MUST be promoted to `1.0.0` to enable standard SemVer.

## 9. Breaking Change Policy
A breaking change requires:
1. **Explicit PR Identification:** The PR title and description must loudly declare `BREAKING CHANGE`.
2. **Version Change:** Appropriate MAJOR (or 0.x MINOR) version bump.
3. **Changelog Entry:** Detailed explanation.
4. **Migration Guide:** Instructions on how consumers must update their code.
5. **Dashboard Verification:** Proof that the change works in the workbench.

## 10. Changelog Policy
Changelogs must be easily readable by consuming application developers (SkyraERP, Jarvis).
Required categories:
- **Added:** New functionality.
- **Changed:** Changes in existing functionality.
- **Deprecated:** Soon-to-be removed functionality.
- **Removed:** Now removed functionality.
- **Fixed:** Bug fixes.
- **Security:** Vulnerabilities addressed.

## 11. Changeset / Version Automation Evaluation
- **OPTION A (Manual):** Error-prone, hard to scale across 10 packages, easy to forget changelog entries.
- **OPTION B (Changesets):** Excellent for monorepos (Turborepo compatible). Developers write small markdown files describing their change and impact (patch/minor/major). CI aggregates them into version bumps and changelogs automatically. Prevents automatic publishing unless configured to do so.
- **RECOMMENDATION:** Adopt **Changesets** (Option B). It enforces version intent at the PR level and automates tedious changelog generation without forcing automated npm publishing (which is forbidden here).

## 12. CONTRIBUTING.md Specification
The repository requires a `CONTRIBUTING.md` containing:
- **Repository Structure:** Monorepo architecture (`packages/`, `dashboard/`).
- **Package Layers:** Clear rules on dependency direction (Layer 3 -> 2 -> 1).
- **Development Flow:** `pnpm dev`, `pnpm test`, `pnpm lint`.
- **Definition of Done:** Link to DoD requirements.
- **Versioning Workflow:** How to generate a Changeset (if adopted).
- **Prohibited Patterns:** No ERP business logic, no random global CSS, no runtime leakage.

## 13. Pull Request Template Specification
The PR template (`.github/pull_request_template.md`) must require the developer to verify:
- [ ] What changed & Why?
- [ ] Package(s) affected
- [ ] Public API change? (Stable / Experimental / Breaking)
- [ ] Accessibility & Responsive behavior verified in Dashboard?
- [ ] Dark mode / Reduced motion verified?
- [ ] Tests added/updated?
- [ ] README/Documentation updated?
- [ ] Changeset included? (if adopted)

## 14. Definition of Done
A Platform PR is "Done" when:
- **Architecture:** Correct package placement; strictly additive or controlled breaking; no circular dependencies.
- **Implementation:** Strict TypeScript; no new `any` or `@ts-ignore`; no application sessions/auth coupling.
- **Quality:** 100% `jest-axe` pass; tests pass; responsive/dark-mode visually verified.
- **Style:** Uses design tokens; no global CSS mutations (unless explicitly scoped).
- **Documentation:** README updated; API documented.
- **CI/Distribution:** `typecheck`, `lint`, `test`, `build`, and artifact external consumer validation pass.
- **Release:** Version bumped (via Changeset).

## 15. Governance Exception Policy
Exceptions are permitted but must be explicit:
- **Global CSS:** If a package *must* inject global CSS, it must be documented as an explicit opt-in requirement (e.g., `design-tokens/reset.css`).
- **Runtime Leakage:** If a package requires a specific runtime, it must declare it via `peerDependencies` and document it heavily.

## 16. Enforcement Matrix

| Governance Rule | Requirement | Enforcement Method | Mandatory? | Future Implementation Phase |
|---|---|---|---|---|
| Documentation | README per package | Code Review / PR Template | Yes | 9.2 (Implementation) |
| Versioning | SemVer / Changesets | CI (Changeset bot) | Yes | 9.2 (Implementation) |
| API Lifecycle | TSDoc tags | Code Review | Yes | 9.2 (Implementation) |
| Breaking Changes | Major/Minor bumps + Migration guide | CI (Changeset) / Code Review | Yes | 9.2 (Implementation) |
| Changelog | Clear, categorized updates | CI (Changeset) | Yes | 9.2 (Implementation) |
| Contribution | CONTRIBUTING.md exists | Documentation | Yes | 9.2 (Implementation) |
| PR Requirements | PR Template exists | GitHub Templates | Yes | 9.2 (Implementation) |
| Definition of Done | PRs meet all quality gates | CI + Code Review | Yes | Ongoing |
| Accessibility | 100% Axe pass | CI (`pnpm test`) | Yes | Implemented |
| Responsive | Flexible layouts | Dashboard Verification | Yes | Implemented |
| Security | No DOM injection / Secrets | Code Review | Yes | Implemented |
| Distribution | Artifact integrity | CI (`publint`, tar checks) | Yes | Implemented |
| CI | All gates pass | GitHub Actions | Yes | Implemented |

## 17. Proposed Repository Changes
- Add `.changeset/` configuration (if Changesets approved).
- Add `CONTRIBUTING.md` to repository root.
- Add `.github/pull_request_template.md`.
- Generate `README.md` for `app-shell`, `data-export`, `data-table`, `design-tokens`, `dialogs`, `dynamic-form`, `ui`, `utils`, `validation`.

## 18. Implementation Sequence
1. **Phase 9.2 (Next Steps):** Implement the Documentation & Versioning tools specified in this document (Changesets, PR Template, CONTRIBUTING.md, package READMEs).
2. **Phase 9.3:** Address Dependency & Boundary findings (`@skyra/qr` peerDep leakage).
3. **Phase 9.4:** Hardening Style Isolation (`@skyra/ui` global CSS fix).
4. **Phase 9.5:** Type Safety Hardening (Remove `any` usages).

## 19. Items Explicitly Deferred to Phase 9.3+
- **HIGH:** `@skyra/qr` React peer dependency boundary (Deferred to 9.3).
- **HIGH:** `@skyra/ui` global reduced-motion CSS (Deferred to 9.4).
- **LOW:** Existing `any`/`as any` usages (Deferred to 9.5).
- **CRITICAL:** Package documentation gap (Addressed in implementation stage of 9.2).

## 20. Final Recommendation
Approve the specification and authorize the Phase 9.2 implementation sequence to bootstrap Changesets, generate the required Markdown documentation, and install the PR templates. 
