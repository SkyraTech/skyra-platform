# F-11 Dashboard generated-file investigation

Date: 2026-10-15

**Verdict: UNRESOLVED.** A separate running Dashboard development server is strongly supported as the source. Direct historical attribution of the write is unavailable, so the file was preserved and no restoration was performed. It is a standard Next.js generated artifact, not evidence of an intentional configuration update.

## Exact contents

Verified F-11 baseline (CRLF line endings, final newline):

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
import "./.next/types/routes.d.ts";

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
```

Current contents (also CRLF, final newline):

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
import "./.next/dev/types/routes.d.ts";

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
```

The saved `.tmp/f11/preservation.json` baseline SHA-256 is `4e4da12aa061aac172fb1bcb48e9b6e4b293080d2f494327925fdba8f39632ac`. `git show HEAD:dashboard/next-env.d.ts`, converted from Git LF to the original working-tree CRLF, matches that hash exactly. Thus original contents and line endings are verified. Current SHA-256 is `083e23c4c5e7761db151134ea1ef7896120c86c5888cdc8a861f534f7e86d6fd`. Replacing only the dev import path reconstructs the baseline bytes exactly; no other content changed.

## Evidence and attribution limits

- Installed Next.js 16.2.12 `dist/lib/typescript/writeAppTypeDeclarations.js` explicitly writes `next-env.d.ts`, constructing the route import from `distDir`, preserving existing line endings, and writing only when content differs.
- `dist/server/config.js` appends `dev` to `distDir` during `PHASE_DEVELOPMENT_SERVER`. `setup-dev-bundler.js` calls TypeScript verification using that directory; verification calls the declaration writer. This explains the exact observed import through executable source, independently of timestamps.
- Read-only process inspection confirmed a separate `pnpm dashboard` / `pnpm --filter dashboard dev` / `node scripts/dev.mjs` / `next dev --port 3002` chain. Next CLI PID 29812 and server PID 25612 began at 11:38:56 India time (06:08:56 UTC). The CLI command resolves to this repository's Dashboard Next installation. The root `dashboard` script and Dashboard dev wrapper explicitly launch this command.
- File write time is 06:09:03 UTC. `.next/dev/types/routes.d.ts` was written at 06:09:04 UTC; `.next/types/routes.d.ts` remains dated 2026-10-14 12:32:54 UTC. Both files exist. The development log records active server/browser work and filesystem cache activity. These facts support the dev-server explanation but do not independently prove which process wrote the file.
- F-11 logs contain Dashboard `npm run generate:data && tsc --noEmit`, not `next dev`, `next build`, or `dashboard:build`. The two data generators write examples metadata, component mapping, and release JSON; they do not invoke Next or write next-env. Plain TypeScript CLI checking does not run the Next development declaration writer. The configured Next editor plugin is not a CLI generation command.
- F-11 filtered builds cover the eight component packages, not Dashboard. Turbo typecheck/lint depend on upstream dependency builds (`^build`), not Dashboard's own build. API checking runs the governance script. No inspected validation path explains a `.next/dev` import write.
- Dashboard Next configuration has no custom `distDir` change; no configuration diff was found. This is consistent with normal mode-dependent generation, not a newly intended configuration update.

No file-write audit trail or historical process-launch provenance establishes the exact writer or who started the dev server. Therefore the strongest supported conclusion is a likely concurrent development-server regeneration outside the recorded F-11 validation commands, not proven historical causation. A hypothetical manual edit producing identical content cannot be excluded. No broad build or reproduction command was run.

## Restoration and preservation

Restoration was **not justified under the requested condition**: evidence does not clearly establish an unintended validation-generated change. The current file is compatible with the observed live development process. No process was stopped and no generated file was overwritten.

At investigation start, Git status, staged/unstaged diffs, exact file contents, and SHA-256 hashes of all current tracked and untracked files were captured. Final hash comparison confirms all 544 captured files unchanged, including all eight F-11 manifests and the existing untracked F-11 report. No staged diff existed initially or finally. The only added visible file is this investigation report; supporting snapshot evidence is ignored under `.tmp/f11/`.

Final tracked diff remains 9 files, 9 insertions, 1 deletion: eight one-line typecheck script additions and the previously observed Dashboard import replacement. `git diff --check` exits 0 (manifest LF/CRLF notices only).

Final status:

```text
 M dashboard/next-env.d.ts
 M packages/collapsible/package.json
 M packages/command-palette/package.json
 M packages/context-menu/package.json
 M packages/date-time/package.json
 M packages/dialog/package.json
 M packages/dropdown-menu/package.json
 M packages/popover/package.json
 M packages/tabs/package.json
?? F11_DASHBOARD_GENERATED_FILE_INVESTIGATION_REPORT.md
?? F11_PACKAGE_TYPECHECK_SCRIPTS_FINAL_AUDIT_REPORT.md
```

No application changes, Git mutations, commits, staging, pushes, pulls, or branch changes were performed. ERP and QR-generator were not modified. F-12 was not started. Suggested commit message for this report only: `docs: investigate F-11 Dashboard generated-file discrepancy`.
