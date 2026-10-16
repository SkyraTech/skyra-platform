# F-22 — Production Build Blocker Investigation and Remediation

Verdict: **PARTIAL**. The API detail route mismatch is corrected and the complete supported Dashboard production build succeeds. The additional F-19 Webpack reproduction now fails at a separate, pre-existing parent capability route; that route was left unchanged under the explicit stop condition. This report does not claim all production build paths are repaired.

## Baseline and confirmed diagnosis

Branch: main. HEAD: 5b344c4e41df75ea3ca73500d0bb86bd9303a36a. Installed Next.js: 16.2.12; Node.js: 24.14.0. F-19, F-20 and F-21 reports were inspected. Initial staged diff was empty. Initial working tree:

```text
M dashboard/src/app/(dashboard)/components/page.tsx
?? F21_COMPONENT_CATALOGUE_COMPLETENESS_FINAL_REPORT.md
?? dashboard/scripts/component-catalogue.test.ts
?? dashboard/scripts/verify-component-catalogue.mjs
```

The supported Dashboard build script is `npm run generate:data && next build`. With this Next.js version its default bundler is Turbopack. An isolated, unmodified baseline copy passed that entire command, including TypeScript validation and generation of 724/724 pages. Thus the originally reported failure does not reproduce with the current default command.

The F-19 report used `next build --webpack`. Repeating that mode against the isolated baseline reproduced the exact failure:

```text
.next/types/app/(dashboard)/packages/[slug]/[capability]/[api]/page.ts:37:29
Type '{ params: { slug: string; capability: string; api: string; }; }'
does not satisfy the constraint 'PageProps'.
Object params is missing Promise members: then, catch, finally, [Symbol.toStringTag].
```

The route is a Server Component. Both its default page and generateMetadata synchronously accessed object params. Installed Next.js's Webpack type generator defines PageProps.params as Promise<SegmentParams>. The compatible parent package detail route already uses async handlers and awaits promised params. The generated Turbopack validator instead intersects props with `any`, explaining why its successful typecheck did not expose this mismatch; no generated validator was changed or used as a workaround.

## Exact changes

- `dashboard/src/app/(dashboard)/packages/[slug]/[capability]/[api]/page.tsx`: only generateMetadata and ApiDetailPage signatures changed to async functions accepting Promise params; each awaits pendingParams into the existing local params name. All downstream lookup, legacy/current registry resolution, titles, notFound, links, examples, JSX and generateStaticParams remain unchanged. Two replacements and two added statements.
- `dashboard/scripts/api-detail-route.test.ts`: three focused tests execute the actual handler declarations, extracted with the TypeScript parser. They verify promised-parameter lookup/title, missing-API metadata, and page notFound behavior without importing unrelated UI modules.
- This new report.

No manifests, compiler settings, dependencies, APIs, catalog data, CI or other routes were changed. No error suppression was introduced.

## Actual validation

All executions were fresh, without Turbo cache-only results. Commands are relative to the repository root. Each production copy included Dashboard source/scripts/public/configuration, root TypeScript configuration and changesets; package outputs and installed dependencies were linked to existing workspace locations. Build-generated files were confined to new ignored copies under .tmp/f22/. The full supported script, including both data generators, ran in each copy.

| Command | Exit | Actual result |
| --- | ---: | --- |
| pnpm --dir .tmp/f22/baseline-copy/dashboard build | 0 | Unmodified baseline: Turbopack compiled, TypeScript passed, 724/724 pages generated, optimization completed. |
| node dashboard/node_modules/next/dist/bin/next build .tmp/f22/baseline-copy/dashboard --webpack | 1 | Reproduced original API detail route PageProps failure after successful compilation. |
| pnpm --filter dashboard typecheck (before correction) | 0 | Data generation and genuine tsc --noEmit passed. |
| pnpm --filter dashboard catalog:check | 0 | Non-writing deterministic catalog check plus 17/17 extractor/catalog tests passed, including route lookup relationships. |
| pnpm --dir .tmp/f22/after-copy/dashboard build | 0 | Complete supported production command after correction: compiled in 8.4s, TypeScript finished in 11.9s, 724/724 pages and optimization completed. |
| pnpm --filter dashboard typecheck (after correction) | 0 | Data generation and genuine tsc --noEmit passed. |
| pnpm exec tsx --test dashboard/scripts/api-detail-route.test.ts | 0 | Final run: 3 discovered, 3 passed, 0 failed/skipped. Initial test-harness run exited 1 (2/3 passed) because generated JSX required a require binding; the harness was corrected with createRequire and rerun successfully. |
| node dashboard/node_modules/next/dist/bin/next build .tmp/f22/after-copy/dashboard --webpack | 1 | API detail check now passes; next independent failure is parent capability route, below. |
| pnpm api:check | 0 | All API governance checks passed. |
| git diff --check | 0 | No whitespace errors; Git reports normal LF/CRLF conversion warning. |

Detailed command logs and exit-code files are retained in .tmp/f22/, including build-before.log, build-webpack.log, build-after.log, build-webpack-after.log, typecheck-before.log, typecheck-after.log, catalog.log, route-tests.log and api-check.log.

## Remaining blocker and validation limits

The Webpack recheck compiled successfully in 24.4s and then exited 1 at:

```text
.next/types/app/(dashboard)/packages/[slug]/[capability]/page.ts:37:29
Type '{ params: { slug: string; capability: string; }; }'
does not satisfy the constraint 'PageProps'.
```

Application source: `dashboard/src/app/(dashboard)/packages/[slug]/[capability]/page.tsx`. Its page and metadata handlers also declare synchronous object params. This defect existed at baseline. It was not automatically folded into this repair. Additional Webpack blockers beyond it remain unverified.

No browser or HTTP route interaction test was run for F-22. Focused tests cover actual metadata and missing-page handlers, not complete valid-page React rendering; the supported production build supplies rendering/static-generation coverage. The standalone Dashboard tsconfig excludes scripts, so its passing typecheck does not certify test-script type safety. Root lint/typecheck were not run or claimed comprehensive. No hosted CI, registry install, root workspace production build, ERP or QR-generator build was run.

## Preservation

Before editing, SHA-256 hashes were captured for 577 tracked and nonignored untracked files, along with initial status, stat, branch, HEAD and staged diff. Final comparison found exactly one changed baseline file: the authorized API detail route. The other 576 baseline files, including the prior F-21 modifications and all prior tracked/nonignored reports, remained byte-identical. Initial diff: one file, 1 insertion/2 deletions. Final tracked diff: two files, 5 insertions/4 deletions; the extra file is the authorized API route. New files are only the focused test and this report outside ignored scratch.

The protected dashboard/next-env.d.ts remained byte-identical, SHA-256:
`083e23c4c5e7761db151134ea1ef7896120c86c5888cdc8a861f534f7e86d6fd`.
Its exact retained contents:

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
import "./.next/dev/types/routes.d.ts";

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
```

Existing .tmp/consumer-test, .tmp-consumer and retained Button archive were not used or modified by this workflow. The 577-file baseline covers tracked/nonignored files; it is not a recursive hash inventory of every pre-existing ignored scratch file. New build work used only the new .tmp/f22/ directories. No new package-root archive was generated. No staged changes were introduced. Branch and HEAD were unchanged; no commit, push, pull or destructive Git operation occurred. ERP and QR-generator files were untouched.

Final Git status (report included):

```text
 M dashboard/src/app/(dashboard)/components/page.tsx
 M dashboard/src/app/(dashboard)/packages/[slug]/[capability]/[api]/page.tsx
?? F21_COMPONENT_CATALOGUE_COMPLETENESS_FINAL_REPORT.md
?? F22_PRODUCTION_BUILD_BLOCKER_REMEDIATION_FINAL_REPORT.md
?? dashboard/scripts/api-detail-route.test.ts
?? dashboard/scripts/component-catalogue.test.ts
?? dashboard/scripts/verify-component-catalogue.mjs
```

Suggested commit message, for later explicit authorization: `fix(dashboard): await API detail route parameters`.

Stopped after F-22 for review; the separate parent capability route blocker remains unresolved.
