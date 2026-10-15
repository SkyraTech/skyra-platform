# F-16 API Catalog Migration — Final Audit Report

Date: 2026-10-15

**Verdict: PASS.** The current catalog now contains **274 real public exports** from **29 JavaScript entry points across 28 canonical packages**. All **471 original API payloads** and **seven original example payloads** are preserved as explicit historical snapshots. No replacement API or compatibility alias was invented. **17 focused tests**, Dashboard typecheck, strict extractor typecheck, API governance and package-resolution checks passed. Remaining historical interpretation decisions are quarantined and described below; they are not presented as current contracts.

## Original defects and evidence

The original [dashboard/scripts/extract-api.ts](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/dashboard/scripts/extract-api.ts) had targets at original lines 11 and 14 for @skyra/dialogs and @skyra/ui, pointing to packages/dialogs/dist/index.d.ts and packages/ui/dist/index.d.ts. Neither directory/declaration exists. No current @skyra-tech-platform/ui package exists either.

The original active JSON contained 471 records: 316 for @skyra/ui, nine for @skyra/dialogs, and 146 with canonical package IDs. Thus **325 records referenced nonexistent current packages**. Of the 146 canonical records, 145 have an exact module-and-export identity in current declarations; the App Shell record named skyra-tech-app-shell is an HTML tag identifier, not a public JavaScript export.

The old schema used lifecycle status such as stable without distinguishing historical provenance. Bootstrap linked legacy APIs into documentation; normal search could index them. Examples and authored behavioral notes joined by stale identities. Two original example records had packageId values different from their referenced historical API's packageId. Several behavioral keys matched no catalog record at all.

The extractor also omitted ClassDeclaration handling, truncated function signatures at the first opening brace, and could fabricate React.FC signatures from similarly named props. Current packages expose Web Component classes and other TypeScript exports; this logic was unsuitable. The repaired extractor retains actual declaration text and overloads and records class kind explicitly.

The audit read the complete extractor, all current manifest exports and their primary declaration targets, all 471 catalog records, bootstrap/registry/search, behavioral metadata, seven example sources/annotations and generated records, release data, documentation consumers and existing invocation paths. No existing CI step invoked this extractor or a catalog consistency gate. Existing root API governance checks library baselines separately and does not validate this catalog.

## Migration semantics and schema compatibility

The migration rules were recorded **before generated data edits** in the new ignored .tmp/f16/MIGRATION_PLAN.md and explained during the task.

- **Current** means an actual named export of an explicitly configured canonical public module, with the module's real manifest types target. Identity is exportPath::exportedName. Module/name resemblance alone is not a migration rule.
- **Historical** preserves original IDs, package IDs, export paths, signatures, properties, descriptions and lifecycle fields. Additional provenance fields distinguish these snapshots from current contracts. No old namespace was broadly replaced.
- Optional catalogState/historyReason/declarationPath fields extend ApiMetadata; ExampleMetadata and CapabilityMetadata also gain optional classification. Serialized current records require catalogState=current and a valid declarationPath through runtime validation. Historical records require catalogState=historical and an explicit supported reason.
- ApiKind gains class. In-repository consumers were updated and typechecked. Consumers assuming a closed old kind set must account for class. Historical lifecycle statuses are retained as recorded; the separate catalog classification and page notice prevent treating those statuses as current promises.
- Current record lookup wins an exact same-ID collision. getHistoricalApi/getHistoricalApis retain explicit snapshot access. getApi preserves fallback for old-only identities. getHistoricalExamplesForApi exposes archived examples even when a current API shares the same ID.
- Normal package API lists and search use current records. getApis retains combined enumeration for historical route generation: **600 distinct IDs**, comprising 274 current identities and 326 old-only identities. The historical archive separately contains all 471 snapshots, including 145 same-ID snapshots superseded by current declarations.
- Historical API/capability pages carry a historical notice. Archived examples render recorded source with preview disabled, preventing a current mapped React example with the same stable example ID from being executed as a historical example.

No package name, public package API, dependency declaration, export map, version, publication whitelist, sideEffects field or package build configuration was altered. No fake UI package or React-to-Web-Component compatibility mapping was added.

## Classification and preserved legacy data

| Original cohort | Count | Handling |
| --- | ---: | --- |
| Exact canonical module/export identities | 145 | Regenerated from current declarations under the same IDs; original payloads preserved with superseded history reason |
| Nonexistent legacy packages | 325 | Original @skyra/ui and @skyra/dialogs payloads preserved with retired-package reason; no replacements asserted |
| Canonical package, invalid/unestablished exported symbol | 1 | @skyra-tech-platform/app-shell::skyra-tech-app-shell preserved with unresolved-symbol reason; no JS alias created |
| **All original API payloads** | **471** | **Preserved without loss** |

Historical archives are [dashboard/src/docs-system/data/historical-apis.json](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/dashboard/src/docs-system/data/historical-apis.json) and [dashboard/src/docs-system/data/historical-examples.json](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/dashboard/src/docs-system/data/historical-examples.json). Automated comparisons removed only the newly added classification/reason fields and verified every original API/example payload equals its captured original, including order and nested values.

All five original behavioral-note payloads are preserved in [dashboard/src/docs-system/historical-behavioral-metadata.ts](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/dashboard/src/docs-system/historical-behavioral-metadata.ts). The @skyra/ui::Button notes attach only to the corresponding historical API. Four keys had no matching archived API and remain explicitly listed as unbound:

- @skyra/data-table::DataTable
- @skyra-tech-platform/dialog::skyra-tech-dialog
- @skyra/dynamic-form::DynamicForm
- @skyra-tech-platform/app-shell::ApplicationShell

Their values were verified equal to the original authored map. They were not renamed onto current classes, since their intended semantic targets and behavioral accuracy are unproven. The current behavioral map is intentionally empty until claims are verified for exact current identities. The unresolved App Shell identifier and these four notes remain historical research/authoring decisions, not fabricated replacement contracts.

All seven original example snapshots remain archived. The two original package/API mismatches are explicitly classified original-join-mismatch. Five live source annotations now reference the exact class proven by their existing custom-element tag and registration code:

| Stable example ID | Current API association |
| --- | --- |
| app-shell-basic | @skyra-tech-platform/app-shell::SkyraAppShell |
| data-table-basic | @skyra-tech-platform/data-table::SkyraTechDataTable |
| dialogs-confirm-basic | @skyra-tech-platform/dialog::SkyraTechDialog |
| dynamic-form-basic | @skyra-tech-platform/dynamic-form::SkyraTechDynamicForm |
| ui-button-basic | @skyra-tech-platform/button::SkyraTechButton |

These are corrected associations for existing Web Component example sources, not aliases for retired React APIs. Actual registration strings and source tags were tested. Executable source bodies of all five files match their verified baseline exactly; only annotations changed. QR and utility example identities were already valid and remain unchanged. The current generated examples contain seven valid current joins. Release metadata is empty and remained byte-for-byte unchanged; the validator nevertheless checks release API references.

## Current extraction coverage

All target names, export paths and declaration paths are explicit in [dashboard/src/docs-system/catalog-targets.ts](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/dashboard/src/docs-system/catalog-targets.ts). Every target is checked against its actual package manifest and declaration file. CSS asset exports have no named TypeScript API records and are deliberately outside this JavaScript-symbol catalog. No declarations or exports were changed to fit extraction.

| Public module | Current records | Declaration target |
| --- | ---: | --- |
| @skyra-tech-platform/accordion | 2 | [packages/accordion/dist/index.d.ts](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/accordion/dist/index.d.ts) |
| @skyra-tech-platform/app-shell | 2 | [packages/app-shell/dist/index.d.ts](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/app-shell/dist/index.d.ts) |
| @skyra-tech-platform/button | 3 | [packages/button/dist/index.d.ts](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/button/dist/index.d.ts) |
| @skyra-tech-platform/checkbox | 3 | [packages/checkbox/dist/index.d.ts](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/checkbox/dist/index.d.ts) |
| @skyra-tech-platform/collapsible | 1 | [packages/collapsible/dist/index.d.ts](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/collapsible/dist/index.d.ts) |
| @skyra-tech-platform/command-palette | 14 | [packages/command-palette/dist/index.d.ts](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/command-palette/dist/index.d.ts) |
| @skyra-tech-platform/context-menu | 20 | [packages/context-menu/dist/index.d.ts](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/context-menu/dist/index.d.ts) |
| @skyra-tech-platform/data-export | 25 | [packages/data-export/dist/index.d.ts](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/data-export/dist/index.d.ts) |
| @skyra-tech-platform/data-table | 17 | [packages/data-table/dist/index.d.ts](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/data-table/dist/index.d.ts) |
| @skyra-tech-platform/date-time | 8 | [packages/date-time/dist/index.d.ts](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/date-time/dist/index.d.ts) |
| @skyra-tech-platform/design-tokens | 4 | [packages/design-tokens/dist/index.d.ts](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/design-tokens/dist/index.d.ts) |
| @skyra-tech-platform/dialog | 1 | [packages/dialog/dist/index.d.ts](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/dialog/dist/index.d.ts) |
| @skyra-tech-platform/dropdown-menu | 14 | [packages/dropdown-menu/dist/index.d.ts](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/dropdown-menu/dist/index.d.ts) |
| @skyra-tech-platform/dynamic-form | 29 | [packages/dynamic-form/dist/index.d.ts](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/dynamic-form/dist/index.d.ts) |
| @skyra-tech-platform/dynamic-select | 3 | [packages/dynamic-select/dist/index.d.ts](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/dynamic-select/dist/index.d.ts) |
| @skyra-tech-platform/input | 3 | [packages/input/dist/index.d.ts](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/input/dist/index.d.ts) |
| @skyra-tech-platform/loader | 14 | [packages/loader/dist/index.d.ts](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/loader/dist/index.d.ts) |
| @skyra-tech-platform/notification | 2 | [packages/notification/dist/index.d.ts](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/notification/dist/index.d.ts) |
| @skyra-tech-platform/pdf-viewer | 1 | [packages/pdf-viewer/dist/index.d.ts](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/pdf-viewer/dist/index.d.ts) |
| @skyra-tech-platform/popover | 9 | [packages/popover/dist/index.d.ts](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/popover/dist/index.d.ts) |
| @skyra-tech-platform/qr | 19 | [packages/qr/dist/core.d.ts](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/qr/dist/core.d.ts) |
| @skyra-tech-platform/qr/web-component | 1 | [packages/qr/dist/skyra-tech-qr-code.d.ts](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/qr/dist/skyra-tech-qr-code.d.ts) |
| @skyra-tech-platform/radio | 3 | [packages/radio/dist/index.d.ts](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/radio/dist/index.d.ts) |
| @skyra-tech-platform/switch | 3 | [packages/switch/dist/index.d.ts](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/switch/dist/index.d.ts) |
| @skyra-tech-platform/tabs | 3 | [packages/tabs/dist/index.d.ts](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/tabs/dist/index.d.ts) |
| @skyra-tech-platform/textarea | 3 | [packages/textarea/dist/index.d.ts](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/textarea/dist/index.d.ts) |
| @skyra-tech-platform/toast | 3 | [packages/toast/dist/index.d.ts](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/toast/dist/index.d.ts) |
| @skyra-tech-platform/utils | 38 | [packages/utils/dist/index.d.ts](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/utils/dist/index.d.ts) |
| @skyra-tech-platform/validation | 26 | [packages/validation/dist/index.d.ts](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/packages/validation/dist/index.d.ts) |

Record kinds follow actual declarations: **56 classes, 63 functions, 51 constants, 61 interfaces and 43 type aliases**. Full declaration text is retained rather than synthesized React signatures. Property/parameter tables describe declared members/parameters; the signature remains the authoritative complete text, including overloads, methods and inheritance. This is declaration-based reflection, not an inferred behavioral compatibility analysis.

## Exact files changed and rationale

**Existing files modified (18):**

| File | Rationale |
| --- | --- |
| [dashboard/package.json](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/dashboard/package.json) | Add real catalog:extract and catalog:check commands; all other manifest bytes preserved |
| [dashboard/scripts/extract-api.ts](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/dashboard/scripts/extract-api.ts) | Canonical target validation, required named-export checks, real declaration extraction, deterministic output, pre-write joins, atomic owned-file replacement and non-writing check mode |
| [dashboard/scripts/generate-examples.mjs](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/dashboard/scripts/generate-examples.mjs) | Deterministic source ordering, current-only identity validation, required exact joins and current classification |
| [dashboard/src/docs-system/metadata.ts](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/dashboard/src/docs-system/metadata.ts) | Additive provenance fields and class kind |
| [dashboard/src/docs-system/bootstrap.ts](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/dashboard/src/docs-system/bootstrap.ts) | Register current and historical stores separately, mark historical UI capability, fill missing real capability groups from manifests/targets, keep history notes separate |
| [dashboard/src/docs-system/registry.ts](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/dashboard/src/docs-system/registry.ts) | Current/historical enumeration and lookup, explicit archived example access, module/capability-aware routing |
| [dashboard/src/docs-system/search.ts](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/dashboard/src/docs-system/search.ts) | Exclude historical APIs/capabilities from normal search |
| [dashboard/src/docs-system/behavioral-metadata.ts](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/dashboard/src/docs-system/behavioral-metadata.ts) | Remove unverified bindings from the current map after preserving all original notes separately |
| [dashboard/src/docs-system/data/apis.json](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/dashboard/src/docs-system/data/apis.json) | Validated deterministic current catalog, 274 records |
| [dashboard/src/docs-system/data/examples.json](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/dashboard/src/docs-system/data/examples.json) | Regenerated seven current example associations and source annotations |
| [dashboard/src/app/(dashboard)/packages/[slug]/[capability]/[api]/page.tsx](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/dashboard/src/app/(dashboard)/packages/[slug]/[capability]/[api]/page.tsx) | Correct public-subpath/legacy lookup, historical notice and class examples |
| [dashboard/src/app/(dashboard)/packages/[slug]/[capability]/page.tsx](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/dashboard/src/app/(dashboard)/packages/[slug]/[capability]/page.tsx) | Historical capability notice; prior F-14 fixes retained |
| [dashboard/src/components/docs/ExampleViewer.tsx](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/dashboard/src/components/docs/ExampleViewer.tsx) | Historical source-only display with preview disabled |
| [dashboard/src/examples/app-shell/app-shell-basic.tsx](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/dashboard/src/examples/app-shell/app-shell-basic.tsx) | Proven current API/package/capability annotation only |
| [dashboard/src/examples/data-table/data-table-basic.tsx](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/dashboard/src/examples/data-table/data-table-basic.tsx) | Proven current API/package/capability annotation only |
| [dashboard/src/examples/dialogs/confirm-dialog.tsx](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/dashboard/src/examples/dialogs/confirm-dialog.tsx) | Proven current API/package/capability annotation only |
| [dashboard/src/examples/dynamic-form/dynamic-form-basic.tsx](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/dashboard/src/examples/dynamic-form/dynamic-form-basic.tsx) | Proven current API/package/capability annotation only |
| [dashboard/src/examples/ui/button-basic.tsx](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/dashboard/src/examples/ui/button-basic.tsx) | Proven current API/package/capability annotation only |

**New files:** the target list, [dashboard/src/docs-system/catalog-integrity.ts](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/dashboard/src/docs-system/catalog-integrity.ts), both historical JSON archives, the historical behavioral file, [dashboard/scripts/extract-api.test.ts](C:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/dashboard/scripts/extract-api.test.ts) and this report. The integrity module is pure metadata validation; it introduces no browser filesystem dependency.

The new commands are:

```json
"catalog:extract": "tsx scripts/extract-api.ts",
"catalog:check": "tsx scripts/extract-api.ts --check && tsx --test scripts/extract-api.test.ts"
```

They use existing tooling and do not invoke a Dashboard build. Existing scripts and dependency fields were preserved. No CI workflow was changed; catalog:check is an explicit gate to run after relevant library declarations are built. The root API governance gate remains separate.

## Determinism and failure protection

Before replacing the current catalog, the CLI validates required manifests/declarations, exact public modules, named exports, source example joins, current/historical classification, capabilities, behavioral bindings/quarantine and release references. Missing required declarations and named exports throw actionable failures. Unknown kinds and duplicate identities also fail.

Generation sorts by stable API IDs. Repeated real extraction/example generation produced identical hashes for current APIs, current examples and both historical archives. Existing example-components.ts and releases.json remained unchanged.

Output replacement uses an exclusively created UUID temporary file and atomic rename. Cleanup unlinks a temporary file only after this call successfully established ownership. Tests cover validation failure before any replacement, failed rename preserving an existing destination, and a pre-existing temporary-path collision preserving unrelated evidence. No partial catalog write or deletion of an unowned collision file is accepted.

## Commands executed, actual exits and tests

All checks below were actual direct executions, not cached Turbo task results. No registry install was performed.

| Exact command | Actual exit | Result |
| --- | ---: | --- |
| pnpm exec tsx .tmp/f16/prepare.ts | 0 | Candidate extraction and new historical snapshot creation before active catalog replacement |
| pnpm exec tsx dashboard/scripts/extract-api.ts | 0 | Initial validated current catalog extraction |
| node dashboard/scripts/generate-examples.mjs | 0 | Initial and repeated generation; seven valid current examples |
| pnpm exec tsx --test dashboard/scripts/extract-api.test.ts | 0 | Initial 11 focused tests passed |
| pnpm --filter dashboard catalog:extract | 0 | Actual production command, deterministic 274-record output |
| pnpm --filter dashboard catalog:check | 0 | Final **17 discovered / 17 passed**, no skips/suppression; drift and full referential checks also passed |
| pnpm --filter dashboard typecheck | 0 | Fresh configured Dashboard tsc execution after metadata generation; final source check passed |
| pnpm --filter dashboard exec tsc -p ../.tmp/f16/tsconfig.extractor.json | 0 | Fresh strict extractor source check; ignored project extends unchanged shared base with noEmit and Dashboard type roots |
| pnpm api:check | 0 | Existing library API governance checks passed |
| node scripts/verify-package-resolution.mjs | 0 | 11 package/subpath cases, NodeNext/Bundler declarations, negative declaration/target checks and ESM/CJS runtime probes |
| git diff --check | 0 | No whitespace errors; Git LF/CRLF conversion notices only |
| git diff --cached --quiet | 0 | No staged changes |

Intermediate catalog/strict-typecheck runs also exited 0 as checks were added. Negative cases deliberately failed inside passing tests; no failed production validation was hidden or weakened.

The 17 tests cover target/package/export validity, missing declarations, missing named exports, accurate class/object-return/overload signatures, deterministic generation/drift checks, invalid annotations and referential failures before writes, atomic rename/collision preservation, archive classification, all metadata joins, invalid current/historical identities, release references, current-wins/legacy fallback, public-subpath routing, explicit archived example access, search filtering, historical preview suppression and source-tag/registration proof for reannotated examples.

Dashboard's normal project excludes scripts. The extractor therefore received the separate strict check above. Tests were actually executed through tsx; this is not a claim that every test or historical source string received a standalone static compiler check. Existing package-resolution/governance coverage is a subset, not exhaustive runtime testing of all 29 modules.

No production Dashboard build/dev command, root lint/typecheck, package rebuild, package pack, registry-dependent install or unrelated audit command was run. Library source/config/exports were unchanged, and existing built declarations were the requested authority. No comprehensive genuine lint coverage is claimed. Production Next routing, parameter lifecycle, browser layout/accessibility and all example behaviors were not certified by these metadata checks. Future public entry-point changes require deliberate target-list updates and rebuilt declarations before extraction.

## Preservation and final Git state

Initial state: **550 tracked/non-ignored untracked baseline files**, 34 modified tracked files and seven untracked prior files; no staged changes. Initial tracked diff:  34 files changed, 293 insertions(+), 245 deletions(-).

Final SHA-256 comparison identifies precisely the 18 authorized existing F-16 files above. **All other 532 baseline files match byte-for-byte.** The two previously modified F-14 route files were extended only where required by this catalog migration; prior work was not discarded. All earlier reports, F-15 isolation implementation/tests, library manifests, F-09 registrations, F-10 files lists, F-11 typecheck scripts and F-12 sideEffects metadata remain intact.

Additional comparison with the preserved F-15 protected inventory still matched all 40 fixture/archive/file/link entries. The tracked .tmp/consumer-test, existing .tmp-consumer and Button tarball were not repurposed or reinstalled over. No new archive was generated. Ignored shared dependency stores are not followed when comparing symlink entries; Git-visible work and the protected fixture inventory are separately accounted for.

Protected dashboard/next-env.d.ts remains byte-for-byte unchanged, SHA-256 **083e23c4c5e7761db151134ea1ef7896120c86c5888cdc8a861f534f7e86d6fd**. Its unresolved development-route import was not restored, regenerated or reclassified. No ERP or QR-generator file was modified. No previous report or existing scratch directory was repurposed; new F-16 evidence/tests are under .tmp/f16.

Final tracked diff relative to HEAD, including all earlier work: ** 50 files changed, 4735 insertions(+), 15961 deletions(-)**. The apparent reduction in the active JSON is deliberate; the complete original payloads are retained in new historical files, which are untracked and therefore absent from tracked diff statistics. Six new implementation/data/test files plus this report are F-16 additions. No preservation discrepancy was detected in the captured inventory.

Final status:

```text
 M .github/workflows/release.yml
 M .npmrc.example
 M dashboard/next-env.d.ts
 M dashboard/package.json
 M dashboard/scripts/extract-api.ts
 M dashboard/scripts/generate-examples.mjs
 M dashboard/src/app/(dashboard)/packages/[slug]/[capability]/[api]/page.tsx
 M dashboard/src/app/(dashboard)/packages/[slug]/[capability]/page.tsx
 M dashboard/src/app/(dashboard)/releases/page.tsx
 M dashboard/src/components/docs/ExampleViewer.tsx
 M dashboard/src/docs-system/behavioral-metadata.ts
 M dashboard/src/docs-system/bootstrap.ts
 M dashboard/src/docs-system/data/apis.json
 M dashboard/src/docs-system/data/examples.json
 M dashboard/src/docs-system/metadata.ts
 M dashboard/src/docs-system/registry.ts
 M dashboard/src/docs-system/search.ts
 M dashboard/src/examples/app-shell/app-shell-basic.tsx
 M dashboard/src/examples/data-table/data-table-basic.tsx
 M dashboard/src/examples/dialogs/confirm-dialog.tsx
 M dashboard/src/examples/dynamic-form/dynamic-form-basic.tsx
 M dashboard/src/examples/ui/button-basic.tsx
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
?? F15_PACKAGE_ISOLATION_WORKFLOW_FINAL_AUDIT_REPORT.md
?? dashboard/scripts/extract-api.test.ts
?? dashboard/src/docs-system/catalog-integrity.ts
?? dashboard/src/docs-system/catalog-targets.ts
?? dashboard/src/docs-system/data/historical-apis.json
?? dashboard/src/docs-system/data/historical-examples.json
?? dashboard/src/docs-system/historical-behavioral-metadata.ts
?? scripts/test-package-isolation.test.mjs
?? F16_API_CATALOG_MIGRATION_FINAL_AUDIT_REPORT.md
```

No staging, commit, push, pull, branch switch, history rewrite, reset, clean, discard or revert was performed. Stop after F-16 for review; no F-17 work was started.

## Remaining historical decisions

The retired packages' APIs have no asserted current replacements. The one unresolved App Shell tag-shaped identifier and four unbound behavioral notes require deliberate future authoring decisions if they are to become current documentation. Historical signatures and example source are provenance snapshots, not compatibility guarantees. They remain stored and lookup-accessible with explicit classification; current APIs and joins are validated independently.

User-specified message for a future explicitly authorized commit only:

```text
fix: align API catalog with published package exports
```
