# F-18 — Historical API Metadata and Orphaned Identity Audit

Date: 2026-10-15

**Verdict: PASS (audit completed; no metadata correction justified).** Historical provenance was established for several items, but no current-API equivalence or safe association with a different F-16 archived record was proved. All five items remain preserved in their existing representation. This verdict does not assert that all historical authoring decisions have been resolved.

## Scope and method

Inspected the F-16 historical API/example archives, historical behavioral map and explicit quarantine, current catalog and declarations, package manifests/public entry points, custom-element registration code, original example annotations, bootstrap/registry, catalog integrity validation, API documentation route and focused tests. Read-only Git history supplied original catalog records, source entry points and the exact namespace/tag-key changes. No production Dashboard build, package build, registry installation or hosted CI run was performed.

Baseline was captured before investigation in the new ignored .tmp/f18 directory: 558 tracked/nonignored untracked file hashes, initial Git status/stat and staged diff. No existing scratch directory was repurposed. Evidence includes history-catalog-evidence.txt, provenance-probe.ts/log, catalog-check.log and preservation.json.

## Evidence and dispositions

### F18-001 — @skyra-tech-platform/app-shell::skyra-tech-app-shell

The exact ID exists in historical-apis.json, with signature “class SkyraAppShell extends HTMLElement”, HTML-attribute properties collapsed/mobile-open, and an original example referencing the same ID. Git commit a1c9836 replaced the React ApplicationShell catalog entry with this tag-named component record. Its preceding catalog used @skyra/app-shell::ApplicationShell with a React.FC signature. The historical tag record therefore has concrete provenance as documentation of the Web Component migration, not evidence that a JavaScript export named skyra-tech-app-shell ever existed.

Current packages/app-shell/src/index.ts re-exports skyra-tech-app-shell.ts, whose public class is SkyraAppShell and whose registration helper registers the string skyra-tech-app-shell (source lines 244–245). The current README explicitly distinguishes SkyraAppShell/registerAppShell from the removed React components. The manifest exposes the main declaration entry and CSS subpath; a tag string is neither a named JavaScript export nor a public JavaScript subpath. Existing catalog extraction verifies the real declarations.

**Disposition:** retain the exact archived record, original payload, historical example and unresolved-symbol classification. Its historical purpose is now established, but its ID still cannot be treated as a current JavaScript identity. Registry.getHistoricalApi/getApi preserve access, and no current API uses this ID. No alias, signature rewrite or historyReason change is necessary. The existing schema has no separate tag-documentation category; adding one solely to relabel a preserved snapshot is not justified here.

**Owner decision:** whether to author a separate custom-element/tag reference page or annotate the historical record's purpose in a future documentation feature. Any association to SkyraAppShell would describe registration provenance, not an export alias or proof of API compatibility.

### F18-002 — @skyra/data-table::DataTable

The exact ID occurs in the original catalog at commit 3e3cedb (also c6c7c9b). At 3e3cedb, packages/data-table/src/index.ts exported ./DataTable, ./useDataTableState and a deprecated DynamicDataTable forward export. This establishes a real historical package/export identity rather than a merely similar name. The behavioral note already used this exact ID in that revision.

The F-16 archive instead contains @skyra/ui::DataTable, a React.FC<DataTableProps> record with a separate package identity; it does not contain @skyra/data-table::DataTable. Earlier catalog snapshots and source entry points establish existence, but do not authorize attaching this note to that differently scoped React record. Current data-table exports SkyraTechDataTable plus utilities/types; shared table markup/aria-sort is not proof of whole-contract equivalence.

**Disposition:** document as a retired React-export note with verified original identity, while retaining its explicit unbound quarantine against the existing F-16 archive. No rekeying to @skyra/ui or the current class; no historical record deleted or silently reconstructed.

**Owner decision:** whether to expand the historical documentation archive with versioned, Git-sourced records for the older package. That is a deliberate historical-documentation policy decision; the current archive is an immutable F-16 baseline snapshot, not a promise to include every past API version.

### F18-003 — @skyra-tech-platform/dialog::skyra-tech-dialog

Git commit 34e2c73 changed only the behavioral key from @skyra/dialogs::Dialog to the current tag-shaped key; the behavioral payload was carried forward. At 3e3cedb, packages/dialogs/src/index.ts exported ConfirmDialog, Modal, Drawer, useFocusTrap and their types. It did not export Dialog. The F-16 archive likewise contains no @skyra/dialogs::Dialog or exact tag-key record.

The current Dialog entry exports SkyraTechDialog; source lines 211–212 register skyra-tech-dialog. Native dialog markup, Escape handling and focus restoration overlap parts of the old prose, but registration does not prove a named export or validate every behavioral claim (including unconditional focus trapping, first-focus targeting and ARIA requirements).

**Disposition:** retain as an invalid/unverified historical JavaScript identity with a proven key-rewrite origin. Keep the original note unbound. Do not attach it to ConfirmDialog, Modal, Drawer or SkyraTechDialog; their contracts/programming models differ or are not proven equivalent.

**Owner decision:** identify whether the original generic Dialog note meant one of those historical exports, multiple implementations, or an intended future abstraction. A future current behavioral note requires direct implementation/browser evidence and fresh authoring, not wholesale transfer.

### F18-004 — @skyra/dynamic-form::DynamicForm

The exact ID exists at 3e3cedb and c6c7c9b. The former's packages/dynamic-form/src/index.ts explicitly exported DynamicForm from ./DynamicForm alongside React-era fields/hooks. The original behavioral note used the same ID. This proves retired React-export provenance.

The F-16 archive contains @skyra/ui::DynamicForm with a React-returning signature, not the original package ID. Current dynamic-form exports SkyraTechDynamicForm and utilities/types. A native form and related validation/responsive features do not establish equivalent props, hooks, focus/ARIA or layout contracts across these identities.

**Disposition:** preserve the note under its exact key and quarantine. Do not map it to the UI record or current Web Component. No new historical snapshot was imported.

**Owner decision:** same historical-version/archive policy as DataTable; decide whether the older exact API deserves a separately versioned historical page. Current behavior must be documented from current evidence independently.

### F18-005 — @skyra-tech-platform/app-shell::ApplicationShell

The exact canonical ID is absent from both current and F-16 historical API catalogs. Git a1c9836 explicitly changed the behavioral key from @skyra/app-shell::ApplicationShell to @skyra-tech-platform/app-shell::ApplicationShell, while replacing the old React implementation/catalog with a Web Component. Its parent catalog contained the exact old-namespace React ApplicationShell record and the source entry exported ./components/ApplicationShell. The old note therefore has established React provenance; the canonicalized key became stale during the architecture change.

The current main entry exports SkyraAppShell/registerAppShell, not ApplicationShell. The archived tag record is a different identity/programming model. Similar sidebar widths and responsive intentions do not validate the entire old landmark/interaction prose for the new class.

**Disposition:** retain the canonicalized-but-unbound historical note and its payload. Document its origin without treating it as a valid current export, mapping it to the tag snapshot, or rekeying it into a historical API that is absent from the F-16 snapshot.

**Owner decision:** whether to restore a versioned old @skyra/app-shell::ApplicationShell documentation record from the verified Git revision, together with an explicit provenance association. Such a future association must remain historical and must not imply a current canonical export.

## Changes and compatibility

Only F18_HISTORICAL_API_METADATA_AUDIT_FINAL_REPORT.md was added. No catalog, behavioral map, schema, lookup logic, example, test, package manifest/source or CI workflow changed. No new API alias or current behavioral claim was introduced. No record/note was removed. The existing unresolved-symbol and explicit unbound list can safely preserve these outcomes, so no schema change was required.

The read-only investigation strengthens provenance knowledge, but does not erase the distinction between an exact record in an older Git revision and a record present in the deliberately preserved F-16 archive. Similar names, tags and overlapping behaviors were not used to manufacture associations. Original 471-record archive payload equality was asserted against HEAD's pre-F-16 apis.json after removing only F-16 classification fields.

## Commands, exit codes and results

| Executed command/check | Exit | Result |
|---|---:|---|
| Get-Content of the supplied F-18 attachment | 0 | Read full scope and constraints. |
| Node baseline capture plus Git status/diff-stat/staged-diff | 0 | 558 file hashes; initial 51 modified tracked/15 untracked files, zero staged. |
| git log --all --format='%h %s' -- relevant catalog/behavior/example paths; targeted git log -S identity searches | 0 | Located original docs, App Shell migration and Dialog key rewrite. Read-only history access. |
| git show a1c9836 -- dashboard/src/docs-system/data/apis.json dashboard/src/docs-system/behavioral-metadata.ts | 0 | Verified React record removal, tag-record introduction and ApplicationShell behavioral key change. |
| git show 34e2c73 -- dashboard/src/docs-system/behavioral-metadata.ts | 0 | Verified Dialog-to-tag behavioral key rewrite. |
| git show 3e3cedb:dashboard/src/docs-system/behavioral-metadata.ts and historical git ls-tree commands | 0 | Located original authored keys and React implementation files. |
| Node history inventory using git show at HEAD, 34e2c73, a1c9836, cd788de, c6c7c9b, 3e3cedb and 3f90db9 | 0 | Saved historical catalog evidence; missing catalog at any sampled revision was recorded rather than assumed. |
| pnpm exec tsx .tmp/f18/provenance-probe.ts | 0 | Fresh assertions: exact older React identities; all 471 payloads preserved; tag historical lookup/example accessible; four notes present/unbound and absent from current APIs; no generic Dialog export in the inspected old index. |
| pnpm --filter dashboard catalog:check | 0 | Fresh non-writing validation: 274 current APIs/29 entries; all 17 tests passed, zero failures/skips. Includes historical lookup, quarantine, classification, referential integrity, generation and output preservation coverage. |
| Node SHA-256/link preservation verifier | 0 | All 558 baseline files unchanged; 40 protected fixture entries unchanged; no staging. |
| git diff --check | 0 | No whitespace errors. |
| git diff --cached --quiet | 0 | No staged changes. |

Exploratory rg searches included several nonexistent conventional documentation directories and returned code 2 while finding relevant hits in scripts; those missing directories were not evidence that references were absent. Subsequent investigation used actual docs-system/routes/example/source paths and Git snapshots. File reads and searches are investigation, not build/test passes.

No production Dashboard build or dev command ran. Dashboard typecheck was not rerun because this task made no application/configuration change. No root lint/typecheck/build, registry install or hosted CI was run/claimed. Catalog validation used existing declarations, freshly built during F-17, and fresh test processes rather than Turbo cache. This audit does not certify all historical accessibility/responsive claims or browser compatibility. Available local Git evidence was sampled at relevant revisions and searched by identity; external unpublished history and owner intent remain unavailable.

## Preservation and final state

All 558 baseline files remain byte-for-byte unchanged. This includes F-08–F-17 fixes/reports, both CI workflows, all package manifests, current/historical catalogs/examples, original behavioral payloads, fixtures and protected generated file. Additional prior inventory verification matched all 40 protected regular-file/link entries, including both consumer fixture trees and the retained Button archive. No archives, package outputs or unrelated generated files were created by F-18.

Dashboard next-env.d.ts SHA-256 remains:

083e23c4c5e7761db151134ea1ef7896120c86c5888cdc8a861f534f7e86d6fd

Final status: 51 pre-existing modified tracked files and 16 untracked files (15 pre-existing plus this report), zero staged changes. Full initial/final status and evidence are under .tmp/f18. No ERP/QR-generator file changed. No stage, commit, push, pull, branch switch, reset, clean, discard or revert was performed.

The remaining product-owner choices concern historical archive breadth and the intended generic Dialog contract, not permission to relabel React APIs as Web Components. Until those choices have supporting authoring/implementation evidence, existing historical lookup and quarantine are the safe outcomes.

Suggested message for a future explicitly authorized commit only:

    docs: clarify historical API metadata identities

Stopped after F-18 for review; no F-19 work started.
