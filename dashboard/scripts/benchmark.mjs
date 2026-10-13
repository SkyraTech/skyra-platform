import { chromium } from '@playwright/test';

const ROUTES = [
  { path: '/overview', label: 'Overview' },
  { path: '/packages', label: 'Packages' },
  { path: '/components', label: 'Components' },
  { path: '/ui-components', label: 'UI Playground' },
  { path: '/data-table', label: 'Data Table' },
  { path: '/pdf-viewer', label: 'PDF Viewer' },
  { path: '/qr-code', label: 'QR Code' },
  { path: '/docs/data-export', label: 'Data Export' },
];

async function runBenchmark(baseUrl = process.argv[2] || 'http://localhost:3002') {
  console.log(`Starting benchmark against ${baseUrl}...`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Listen to console and errors
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));

  console.log('\n--- 1. INITIAL LOAD (/overview) ---');
  const t0 = Date.now();
  await page.goto(`${baseUrl}/overview`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('skyra-tech-app-shell');
  const initialLoadTime = Date.now() - t0;
  console.log(`Initial Load (/overview): ${initialLoadTime}ms`);

  // Wait for React hydration
  await page.waitForTimeout(2000);

  // Expand all sections so links are clickable
  const buttons = page.locator('button.skyra-sidebar-section-header, button.skyra-sidebar-subgroup-trigger');
  const btnCount = await buttons.count();
  for (let i = 0; i < btnCount; i++) {
    try {
      const isExpanded = await buttons.nth(i).getAttribute('aria-expanded');
      if (isExpanded === 'false') {
        await buttons.nth(i).click();
      }
    } catch(e) {}
  }
  await page.waitForTimeout(300);

  const coldResults = {};
  console.log('\n--- 2. COLD CLIENT NAVIGATION (Clicking sidebar links) ---');
  for (const route of ROUTES) {
    if (route.path === '/overview') continue;

    console.log(`Navigating to ${route.path} (${route.label})...`);
    const start = Date.now();

    const navLink = page.locator(`a[href="${route.path}"]`).first();
    await navLink.click();

    // Wait until URL updates to route.path
    await page.waitForFunction((expectedPath) => window.location.pathname === expectedPath, route.path, { timeout: 30000 });
    
    // Wait for network/render to settle
    await page.waitForLoadState('networkidle').catch(() => {});
    const duration = Date.now() - start;
    coldResults[route.path] = duration;
    console.log(`  -> ${route.path}: ${duration}ms`);
    
    await page.waitForTimeout(1000);
  }

  const warmResults = {};
  console.log('\n--- 3. WARM CLIENT NAVIGATION (Revisiting routes) ---');
  for (const route of ROUTES) {
    console.log(`Revisiting ${route.path}...`);
    const start = Date.now();
    const navLink = page.locator(`a[href="${route.path}"]`).first();
    await navLink.click();
    await page.waitForFunction((expectedPath) => window.location.pathname === expectedPath, route.path, { timeout: 30000 });
    await page.waitForLoadState('networkidle').catch(() => {});
    const duration = Date.now() - start;
    warmResults[route.path] = duration;
    console.log(`  -> ${route.path}: ${duration}ms`);
    await page.waitForTimeout(500);
  }

  console.log('\n=== BENCHMARK SUMMARY ===');
  console.log(`Initial Load (/overview): ${initialLoadTime}ms`);
  console.log('Cold Navigation:', JSON.stringify(coldResults, null, 2));
  console.log('Warm Navigation:', JSON.stringify(warmResults, null, 2));
  if (errors.length > 0) {
    console.log('Console Errors:', errors);
  } else {
    console.log('Console Errors: None');
  }

  await browser.close();
}

runBenchmark().catch(err => {
  console.error('Benchmark failed:', err);
  process.exit(1);
});
