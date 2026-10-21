# F-23 — PDF Viewer Documentation, Canonical Routing and Workbench Separation

Verdict: **PASS** for the F-23 documentation/routing requirements. The separate worker-error screenshot is not claimed repaired: it did not reproduce in the browser probes described below.

## Baseline and confirmed cause

Date: 2026-10-21 (Asia/Calcutta). Branch main, HEAD 339fb7bdab5027def7843315fb1f60bf533e350b. Initial Git status and staged/unstaged diffs were empty. SHA-256 baseline captured for 579 tracked/nonignored files before editing, with evidence in .tmp/f23/baseline.json and initial-status.txt.

The Components PDF card explicitly linked to /pdf-viewer. F-21 had chosen that implemented destination because there was no dedicated PDF documentation page. That route imports the actual package and renders its interactive Workbench. The Playground separately used /packages/pdf-viewer for its documentation action and /pdf-viewer for its showcase.

Existing dedicated documentation follows direct routes such as /docs/validation, /docs/utils and /docs/data-export, using DocsLayout, DocsHeader, PackageMeta, HeadingAnchor and CodeBlock. No central registry controls these dedicated documentation URLs. Therefore /docs/pdf-viewer is the canonical new documentation destination. It is a static route without params, aliases or redirects; no promised-params workaround is needed.

## Implementation and source evidence

The new page uses those existing documentation components and Skyra theme variables. A responsive rule is scoped to the new page: below 900px it hides the fixed-width contents panel and stacks the shared layout, preventing the narrow content column observed in initial mobile screenshot review. Shared layout, sidebar and other documentation pages were not edited.

Documentation includes:

- Overview and distinction between reusable component and Dashboard Workbench.
- Canonical installation/import commands; only named public export SkyraPdfViewerElement; automatic browser registration of skyra-tech-pdf-viewer; ESM/CJS/declaration entry points; no declared peers; pdfjs-dist 4.4.168 dependency. Registry installation is explicitly unverified.
- Browser TypeScript quick start with source assigned after connection; explicit application-owned PDF and matching module-worker assets, plus default CDN/CORS/CSP requirements.
- Actual observed attributes title, src, initial-page, initial-zoom and worker-src; property differences for src, docTitle, currentPage, zoom and rotation; no invented totalPages input or thumbnail-visibility property.
- Page bounds, 50–300 property zoom clamp and 25-point steps, initial attribute parsing, rotation, approximate fit-width, thumbnails, fullscreen and states.
- Exact event names, payloads and dispatch conditions, direct non-bubbling listeners and teardown; document-loaded is distinguished from render-complete. Print/download invocation is distinguished from successful browser completion.
- Public navigation, zoom, rotation, fit-width, fullscreen, print and download methods. Print/download example bindings assume application-owned buttons, rather than introducing a package UI API.
- Implemented keyboard/region/toolbar semantics, theme variables, responsive thresholds and limitations of canvas-only rendering. No claim of complete PDF accessibility or universal compatibility.
- Visible Open Interactive Workbench links to the unchanged /pdf-viewer route.

Authority inspected: packages/pdf-viewer/package.json, src/index.ts, complete relevant properties/lifecycle/events/rendering code in src/skyra-pdf-viewer.ts, generated declarations and package tests. The current API catalog contains @skyra-tech-platform/pdf-viewer::SkyraPdfViewerElement with root exportPath @skyra-tech-platform/pdf-viewer. No catalog migration was required or performed.

## Exact files changed

Existing files:

1. dashboard/src/app/(dashboard)/components/page.tsx — PDF href only: /pdf-viewer → /docs/pdf-viewer. Stable status, description, QR and other cards preserved.
2. dashboard/src/app/(dashboard)/ui-components/page.tsx — PDF docsHref only: /packages/pdf-viewer → /docs/pdf-viewer. showcaseHref remains /pdf-viewer.
3. dashboard/scripts/component-catalogue.test.ts — expected documentation destination updated, with route existence assertion.
4. dashboard/scripts/verify-component-catalogue.mjs — browser test now follows catalogue → docs → Workbench, checking that docs contains no viewer instance.

New files:

5. dashboard/src/app/(dashboard)/docs/pdf-viewer/page.tsx — dedicated documentation.
6. dashboard/scripts/pdf-viewer-docs.test.tsx — three focused rendering/separation/routing tests.
7. dashboard/scripts/verify-pdf-viewer-docs.mjs — browser verification for direct access, refresh, theme, keyboard, existing documentation and mobile content width.
8. This report.

The existing /packages/pdf-viewer reference route remains available. The Workbench page and package source were not modified or duplicated.

## Actual commands and results

Commands ran from repository root; all checks below executed freshly, without Turbo cache-only results. Logs and exit-code files are retained under .tmp/f23/.

| Command | Exit | Result |
| --- | ---: | --- |
| Playwright baseline probe against http://localhost:3002/pdf-viewer via node | 0 | Existing viewer had a canvas and no .message-text.error after loading. Worker destroyed screenshot was not reproduced. |
| pnpm exec tsx --test dashboard/scripts/component-catalogue.test.ts dashboard/scripts/ui-playground.test.ts dashboard/scripts/sidebar-navigation.test.ts | 0 | 9/9 tests passed. |
| pnpm exec tsx --tsconfig dashboard/tsconfig.json --test dashboard/scripts/pdf-viewer-docs.test.tsx | 0 | 3/3 passed before and after the scoped mobile adjustment. Actual documentation markup rendered using React server rendering. |
| pnpm --filter @skyra-tech-platform/pdf-viewer test | 0 | Vitest: 1 file, 7/7 tests passed. |
| pnpm --filter dashboard typecheck | 0 | Actual generate:data and tsc --noEmit passed before and after mobile adjustment. |
| pnpm --dir .tmp/f23/validation/dashboard build | 0 | Actual supported generate:data && next build passed before and after mobile adjustment. Final: Next 16.2.12 Turbopack compiled in 8.4s, TypeScript completed in 9.9s, 725/725 pages generated in 9.3s, optimization completed. /docs/pdf-viewer appears as a static route. |
| node dashboard/node_modules/next/dist/bin/next start .tmp/f23/validation/dashboard -p 3123 | Service ready | Isolated production server started successfully, browser checks ran, then the owned server was stopped via Ctrl-C. It is not a finite build/check command; interrupt reports exit 1. Existing user server on 3002 was untouched. |
| DASHBOARD_BASE_URL=http://localhost:3123/ node dashboard/scripts/verify-pdf-viewer-docs.mjs | 0 | Both routes direct and refresh returned 200 with unchanged URL; dedicated docs/no embedded viewer; Workbench canvas and real three-page sample; keyboard Workbench link; light/dark toggle; /docs/validation; mobile width assertion; no page runtime errors. Passed again after final build. |
| DASHBOARD_BASE_URL=http://localhost:3123/ node dashboard/scripts/verify-component-catalogue.mjs | 0 | Catalogue keyboard navigation to docs, then existing Workbench; 11 categories/24 cards, unchanged QR and stable PDF; actual page rendering, zoom to 125%, next/previous page, PDF download and Playground return route. Passed again after final build. |
| pnpm api:check | 0 | All API governance checks passed. |
| git diff --check | 0 | No whitespace errors; only Git LF-to-CRLF notices. |

The browser environment variable was set using PowerShell $env:DASHBOARD_BASE_URL before running node. A fresh isolated copy included Dashboard source, scripts, public assets/configuration, root tsconfig and changesets; installed dependencies and package outputs were linked read-only in practice. Builds ran only there because Next can regenerate next-env.d.ts. Only the new page was recopied for the final responsive rebuild. No package build or registry-dependent install was needed.

## Browser evidence and remaining limits

Artifacts in .tmp/f23/: docs-light.png, docs-dark.png, docs-mobile.png and docs-mobile-viewport.png; browser-docs-final.log and browser-catalogue-final.log. Mobile viewport screenshot was visually reviewed after correction. Light/dark browser checks and screenshots cover theme switching; they are not a full visual regression or formal accessibility certification. Existing validation documentation was browser-tested; all unrelated documentation routes were not exhaustively visited. Package tests are not a complete PDF.js real-worker test suite; real PDF rendering was separately exercised in Chromium.

The attached Worker was destroyed error was investigated as a separate observation. Source inspection shows that attribute-driven loading before connection can overlap connectedCallback loading/cleanup. This is a plausible lifecycle risk, not proven causation for the screenshot. Baseline probe and all production browser checks loaded successfully, including direct navigation, refresh and client navigation. No speculative package or Workbench lifecycle fix was made. Intermittent worker failures under other remount/source-change conditions remain unverified. Documentation explains worker configuration and loading limitations.

No Webpack build was run for F-23. F-22's separate known parent capability-route PageProps/Promise mismatch remains outside scope; a successful Turbopack production build does not establish that Webpack now passes. No root lint was claimed genuine comprehensive validation; the PDF package lint script is an echo placeholder. No registry install, hosted CI or browser print/fullscreen permission-dialog validation was performed. Dashboard typecheck excludes scripts, so its result alone does not prove test-script type safety.

## Preservation and final status

Hash comparison of all 579 baseline files found exactly the four authorized existing-file changes listed above and zero unexpected differences. The other 575 baseline files remained byte-identical, including Workbench source, package implementation/manifests, API/history data, previous reports and F-22 changes. Git staged diff remained empty. No changes to branch/HEAD, ERP, QR generator, CI, shared configuration or dependencies; no package-root archive created. Pre-existing ignored scratch content was not reused; this is not a recursive hash certification of every ignored file.

Protected dashboard/next-env.d.ts before and after SHA-256:
083e23c4c5e7761db151134ea1ef7896120c86c5888cdc8a861f534f7e86d6fd

Its development import remains exactly import "./.next/dev/types/routes.d.ts";.

Initial status: empty. Final status:

```text
 M dashboard/scripts/component-catalogue.test.ts
 M dashboard/scripts/verify-component-catalogue.mjs
 M dashboard/src/app/(dashboard)/components/page.tsx
 M dashboard/src/app/(dashboard)/ui-components/page.tsx
?? F23_PDF_VIEWER_DOCUMENTATION_ROUTING_FINAL_REPORT.md
?? dashboard/scripts/pdf-viewer-docs.test.tsx
?? dashboard/scripts/verify-pdf-viewer-docs.mjs
?? dashboard/src/app/(dashboard)/docs/pdf-viewer/
```

Suggested commit message: `docs(pdf-viewer): separate documentation from interactive workbench`.

No staging, commit, push, pull or destructive Git operation was performed. Stopped after F-23 for review.
