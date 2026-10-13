import { chromium } from '@playwright/test';

export const ROUTES = [
  {
    path: '/overview',
    label: 'Overview',
    selector: '.dash-page h1',
    expectedText: 'Skyra Platform',
    sectionId: 'platform',
  },
  {
    path: '/packages',
    label: 'Packages',
    selector: 'header h1',
    expectedText: 'Platform Packages',
    sectionId: 'platform',
  },
  {
    path: '/components',
    label: 'Components',
    selector: 'h1',
    expectedText: 'Components',
    sectionId: 'documentation',
  },
  {
    path: '/ui-components',
    label: 'UI Playground',
    selector: 'h1',
    expectedText: 'UI Components Showcase',
    sectionId: 'tools-playgrounds',
  },
  {
    path: '/data-table',
    label: 'Data Table',
    selector: 'header h1',
    expectedText: 'Enterprise Data Table Showcase',
    sectionId: 'tools-playgrounds',
  },
  {
    path: '/pdf-viewer',
    label: 'PDF Viewer',
    selector: 'h1',
    expectedText: 'PdfViewer Component',
    sectionId: 'tools-playgrounds',
  },
  {
    path: '/qr-code',
    label: 'QR Code',
    selector: 'header h1',
    expectedText: 'Skyra QR Studio',
    sectionId: 'tools-playgrounds',
  },
  {
    path: '/docs/data-export',
    label: 'Data Export',
    selector: 'h1',
    expectedText: 'Data Export',
    sectionId: 'documentation',
    subgroupId: 'foundation-utils',
  },
];

/**
 * Calculates median and percentile from an array of numbers
 */
function calculateStats(values) {
  if (!values || values.length === 0) {
    return { min: 0, max: 0, median: 0, p95: 0, avg: 0, count: 0 };
  }
  const sorted = [...values].sort((a, b) => a - b);
  const min = Math.round(sorted[0]);
  const max = Math.round(sorted[sorted.length - 1]);
  const sum = sorted.reduce((acc, v) => acc + v, 0);
  const avg = Math.round(sum / sorted.length);

  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 !== 0 
    ? Math.round(sorted[mid]) 
    : Math.round((sorted[mid - 1] + sorted[mid]) / 2);

  const p95Index = Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95));
  const p95 = Math.round(sorted[p95Index]);

  return { min, max, median, p95, avg, count: sorted.length };
}

/**
 * Ensures a sidebar link is visible by expanding its parent section or subgroup
 */
async function ensureSidebarLinkVisible(page, route) {
  if (route.subgroupId) {
    const subgroupBtn = page.locator(`button[aria-controls="subgroup-content-${route.subgroupId}"]`).first();
    if (await subgroupBtn.count() > 0) {
      const isExpanded = await subgroupBtn.getAttribute('aria-expanded');
      if (isExpanded === 'false') {
        await subgroupBtn.click();
        await page.waitForTimeout(100);
      }
    }
  }

  if (route.sectionId) {
    const sectionBtn = page.locator(`button[aria-controls="section-content-${route.sectionId}"]`).first();
    if (await sectionBtn.count() > 0) {
      const isExpanded = await sectionBtn.getAttribute('aria-expanded');
      if (isExpanded === 'false') {
        await sectionBtn.click();
        await page.waitForTimeout(100);
      }
    }
  }

  const link = page.locator(`a[href="${route.path}"]`).first();
  await link.waitFor({ state: 'attached', timeout: 5000 });
  return link;
}

/**
 * Performs a single verified client navigation and measures URL transition vs Content readiness
 */
async function performVerifiedNavigation(page, route) {
  const link = await ensureSidebarLinkVisible(page, route);
  
  const t0 = performance.now();
  await link.click();

  // 1. Wait for URL transition
  await page.waitForFunction(
    (expected) => window.location.pathname === expected,
    route.path,
    { timeout: 30000 }
  );
  const tUrl = performance.now();

  // 2. Wait for route-specific primary content readiness
  const contentLocator = page.locator(route.selector).filter({ hasText: route.expectedText }).first();
  await contentLocator.waitFor({ state: 'visible', timeout: 30000 });
  const isUsable = await contentLocator.isVisible();
  if (!isUsable) {
    throw new Error(`Content element for ${route.path} was not visible after navigation`);
  }
  const tReady = performance.now();

  const urlTransitionMs = Math.round(tUrl - t0);
  const contentRenderMs = Math.round(tReady - tUrl);
  const totalReadinessMs = Math.round(tReady - t0);

  return {
    urlTransitionMs,
    contentRenderMs,
    totalReadinessMs,
  };
}

/**
 * Runs the benchmark suite against a target URL
 */
export async function runBenchmarkSuite(baseUrl = 'http://localhost:3001', options = {}) {
  const isDev = baseUrl.includes('3002') || options.isDev;
  const envName = isDev ? 'Development (Turbopack)' : 'Production (Optimized)';
  const trialsCount = options.trials || 3;

  console.log(`\n======================================================`);
  console.log(` SKYRA DASHBOARD NAVIGATION BENCHMARK: ${envName}`);
  console.log(` Target: ${baseUrl}`);
  console.log(` Trials per warm route: ${trialsCount}`);
  console.log(`======================================================\n`);

  const browser = await chromium.launch({ headless: true });
  
  const diagnostics = {
    consoleErrors: [],
    consoleWarnings: [],
    pageErrors: [],
    failedRequests: [],
  };

  const results = {
    baseUrl,
    envName,
    initialLoad: null,
    coldPrefetched: {},
    warmPrefetched: {},
    coldUnprefetched: {},
    diagnostics,
  };

  // ─── 1. INITIAL PAGE LOAD & DOCUMENT RESPONSE ─────────────────────────────
  console.log('[Phase 1] Measuring Initial Page Load (/overview)...');
  const mainContext = await browser.newContext();
  const mainPage = await mainContext.newPage();

  mainPage.on('console', (msg) => {
    if (msg.type() === 'error') diagnostics.consoleErrors.push({ url: mainPage.url(), text: msg.text() });
    if (msg.type() === 'warning') diagnostics.consoleWarnings.push({ url: mainPage.url(), text: msg.text() });
  });
  mainPage.on('pageerror', (err) => diagnostics.pageErrors.push({ url: mainPage.url(), message: err.message }));
  mainPage.on('requestfailed', (req) => {
    diagnostics.failedRequests.push({ url: req.url(), failure: req.failure()?.errorText });
  });

  const tInitStart = performance.now();
  await mainPage.goto(`${baseUrl}/overview`, { waitUntil: 'domcontentloaded' });
  const overviewHeader = mainPage.locator('.dash-page h1').filter({ hasText: 'Skyra Platform' }).first();
  await overviewHeader.waitFor({ state: 'visible', timeout: 30000 });
  const tInitReady = performance.now();

  const navTiming = await mainPage.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    if (!nav) return null;
    return {
      ttfb: Math.round(nav.responseStart - nav.requestStart),
      domContentLoaded: Math.round(nav.domContentLoadedEventEnd - nav.startTime),
      loadEvent: Math.round(nav.loadEventEnd - nav.startTime),
    };
  });

  results.initialLoad = {
    totalReadinessMs: Math.round(tInitReady - tInitStart),
    navigationTiming: navTiming,
  };

  console.log(`  -> Initial Document TTFB: ${navTiming?.ttfb ?? 'N/A'} ms`);
  console.log(`  -> DOM Content Loaded: ${navTiming?.domContentLoaded ?? 'N/A'} ms`);
  console.log(`  -> Initial Page Content Ready: ${results.initialLoad.totalReadinessMs} ms`);

  // Allow initial idle prefetching of links in sidebar
  await mainPage.waitForTimeout(1500);

  // ─── 2. FIRST CLIENT-SIDE NAVIGATION (COLD PREFETCHED) ────────────────────
  console.log('\n[Phase 2] Measuring First Client Navigation to Routes (Cold Session)...');
  for (const route of ROUTES) {
    if (route.path === '/overview') continue;

    process.stdout.write(`  -> Navigating to ${route.path.padEnd(20)} (${route.label})... `);
    try {
      const timing = await performVerifiedNavigation(mainPage, route);
      results.coldPrefetched[route.path] = timing;
      console.log(`Ready in ${timing.totalReadinessMs} ms (URL: ${timing.urlTransitionMs} ms, Render: ${timing.contentRenderMs} ms)`);
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
      results.coldPrefetched[route.path] = { error: err.message };
    }
  }

  // ─── 3. WARM CLIENT-SIDE NAVIGATION (REPEATED TRIALS) ─────────────────────
  console.log(`\n[Phase 3] Measuring Warm Client Navigation (${trialsCount} repeated trials per route)...`);
  for (const route of ROUTES) {
    const trialTimes = [];
    const urlTimes = [];
    const renderTimes = [];

    process.stdout.write(`  -> Testing ${route.path.padEnd(20)}: `);
    for (let i = 0; i < trialsCount; i++) {
      try {
        const timing = await performVerifiedNavigation(mainPage, route);
        trialTimes.push(timing.totalReadinessMs);
        urlTimes.push(timing.urlTransitionMs);
        renderTimes.push(timing.contentRenderMs);
      } catch (err) {
        console.error(`\n     Trial ${i + 1} failed: ${err.message}`);
      }
    }

    const stats = calculateStats(trialTimes);
    const urlStats = calculateStats(urlTimes);
    const renderStats = calculateStats(renderTimes);

    results.warmPrefetched[route.path] = {
      readiness: stats,
      urlTransition: urlStats,
      contentRender: renderStats,
    };

    console.log(`Median: ${stats.median} ms (p95: ${stats.p95} ms, min: ${stats.min} ms, max: ${stats.max} ms) [${stats.count}/${trialsCount} trials]`);
  }

  await mainContext.close();

  // ─── 4. UNPREFETCHED NAVIGATION COMPARISON ────────────────────────────────
  console.log('\n[Phase 4] Measuring Unprefetched Client Navigation (Isolated Cold Context)...');
  const unprefetchedContext = await browser.newContext();
  const unprefetchedPage = await unprefetchedContext.newPage();

  // Block Next.js prefetch requests: req.headers()['next-router-prefetch'] === '1'
  await unprefetchedPage.route('**/*', (route) => {
    const headers = route.request().headers();
    if (headers['next-router-prefetch'] === '1') {
      route.abort();
    } else {
      route.continue();
    }
  });

  await unprefetchedPage.goto(`${baseUrl}/overview`, { waitUntil: 'domcontentloaded' });
  await unprefetchedPage.locator('.dash-page h1').filter({ hasText: 'Skyra Platform' }).first().waitFor({ state: 'visible', timeout: 30000 });
  await unprefetchedPage.waitForTimeout(500);

  for (const route of ROUTES) {
    if (route.path === '/overview') continue;

    process.stdout.write(`  -> [Unprefetched] ${route.path.padEnd(20)} (${route.label})... `);
    try {
      const timing = await performVerifiedNavigation(unprefetchedPage, route);
      results.coldUnprefetched[route.path] = timing;
      console.log(`Ready in ${timing.totalReadinessMs} ms (URL: ${timing.urlTransitionMs} ms, Render: ${timing.contentRenderMs} ms)`);
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
      results.coldUnprefetched[route.path] = { error: err.message };
    }
  }

  await unprefetchedContext.close();
  await browser.close();

  // ─── SUMMARY REPORT ───────────────────────────────────────────────────────
  console.log(`\n======================================================`);
  console.log(` BENCHMARK REPORT: ${envName}`);
  console.log(`======================================================`);
  console.log(`Initial Document Response (TTFB): ${results.initialLoad.navigationTiming?.ttfb ?? 'N/A'} ms`);
  console.log(`Initial Content Readiness:       ${results.initialLoad.totalReadinessMs} ms\n`);

  console.log('Route Navigation Comparison Matrix (ms):');
  console.log('-----------------------------------------------------------------------------------------');
  console.log('Route                   | Cold (Prefetched) | Unprefetched | Warm Median | Warm p95 | Warm Range');
  console.log('-----------------------------------------------------------------------------------------');
  for (const route of ROUTES) {
    if (route.path === '/overview') continue;
    const cold = results.coldPrefetched[route.path]?.totalReadinessMs ?? 'ERR';
    const unpref = results.coldUnprefetched[route.path]?.totalReadinessMs ?? 'ERR';
    const warmStats = results.warmPrefetched[route.path]?.readiness;
    const warmMed = warmStats ? `${warmStats.median}` : 'ERR';
    const warmP95 = warmStats ? `${warmStats.p95}` : 'ERR';
    const warmRange = warmStats ? `${warmStats.min}–${warmStats.max}` : 'ERR';

    console.log(
      `${route.path.padEnd(23)} | ` +
      `${String(cold).padStart(17)} | ` +
      `${String(unpref).padStart(12)} | ` +
      `${String(warmMed).padStart(11)} | ` +
      `${String(warmP95).padStart(8)} | ` +
      `${warmRange.padStart(10)}`
    );
  }
  console.log('-----------------------------------------------------------------------------------------');

  console.log('\nDiagnostics:');
  console.log(`  Console Errors:   ${diagnostics.consoleErrors.length}`);
  if (diagnostics.consoleErrors.length) console.log(diagnostics.consoleErrors);
  console.log(`  Console Warnings: ${diagnostics.consoleWarnings.length}`);
  console.log(`  Page Exceptions:  ${diagnostics.pageErrors.length}`);
  if (diagnostics.pageErrors.length) console.log(diagnostics.pageErrors);
  console.log(`  Failed Requests:  ${diagnostics.failedRequests.length}`);

  return results;
}

// Direct CLI Execution
if (process.argv[1]?.includes('benchmark.mjs')) {
  const targetArg = process.argv[2];
  let targetUrl = 'http://localhost:3001';
  if (targetArg && targetArg.startsWith('http')) {
    targetUrl = targetArg;
  } else if (process.argv.includes('--dev')) {
    targetUrl = 'http://localhost:3002';
  }

  runBenchmarkSuite(targetUrl, { trials: 3 }).catch((err) => {
    console.error('Benchmark suite execution failed:', err);
    process.exit(1);
  });
}
