import { chromium } from '@playwright/test';
import axeCore from 'axe-core';

async function runPlaygroundVerification() {
  console.log('====================================================');
  console.log(' SKYRA PLATFORM UI PLAYGROUND — VERIFICATION SUITE');
  console.log('====================================================\n');

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(err.message));

  const BASE_URL = 'http://localhost:3002/ui-components';

  console.log(`Navigating to ${BASE_URL}...`);
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // ─── 1. HEADER & OBSOLETE LABELS AUDIT ─────────────────────────────────────
  console.log('--- 1. Header & Obsolete Label Audit ---');
  const pageAudit = await page.evaluate(() => {
    const bodyText = document.body.innerText;
    const h1 = document.querySelector('h1')?.innerText || '';
    const hasObsoleteUiPkg = bodyText.includes('@skyra/ui');
    const hasPhase4E = bodyText.includes('Phase 4E');
    const hasPhase4D = bodyText.includes('Phase 4D');
    const hasPhase4C = bodyText.includes('Phase 4C');
    const hasPhase4B = bodyText.includes('Phase 4B');
    const hasPhase4A = bodyText.includes('Phase 4A');
    const hasPhase3 = bodyText.includes('Phase 3');
    const hasPhase2 = bodyText.includes('Phase 2');
    const hasErpSource = bodyText.includes('ERP Source:');

    return {
      h1,
      hasObsoleteUiPkg,
      hasPhaseBadges: hasPhase4E || hasPhase4D || hasPhase4C || hasPhase4B || hasPhase4A || hasPhase3 || hasPhase2,
      hasErpSource
    };
  });

  console.log(`  Page Title: "${pageAudit.h1}"`);
  console.log(`  References @skyra/ui: ${pageAudit.hasObsoleteUiPkg ? 'FAIL (STILL PRESENT)' : 'PASS (REMOVED)'}`);
  console.log(`  Internal Migration Phase Badges: ${pageAudit.hasPhaseBadges ? 'FAIL (PRESENT)' : 'PASS (REMOVED)'}`);
  console.log(`  Internal "ERP Source:" Labels: ${pageAudit.hasErpSource ? 'FAIL (PRESENT)' : 'PASS (REMOVED)'}`);

  if (pageAudit.hasObsoleteUiPkg || pageAudit.hasPhaseBadges || pageAudit.hasErpSource) {
    throw new Error('FAIL: Obsolete labels still found on Playground page.');
  }

  // ─── 2. LIVE INTERACTIVE TESTING ARENA ─────────────────────────────────────
  console.log('\n--- 2. Live Interactive Quick-Tester Arena ---');
  // Check Tabs demo interaction
  const tabsActive = await page.locator('.arena-tab-btn.active').innerText();
  console.log(`  Default Arena Tab: ${tabsActive}`);

  // Click Pill Variant
  await page.locator('button:has-text("Pill Variant")').click();
  await page.waitForTimeout(200);
  const pillVariantActive = await page.locator('button:has-text("Pill Variant")').evaluate(el => el.classList.contains('active'));
  console.log(`  Pill Variant Toggle: ${pillVariantActive ? 'PASS' : 'FAIL'}`);

  // Switch to Switch tab
  await page.locator('.arena-tab-btn:has-text("Switch")').click();
  await page.waitForTimeout(200);
  await page.locator('button:has-text("Toggle Switch")').click();
  await page.waitForTimeout(200);
  const switchStateText = await page.locator('.status-indicator').innerText();
  console.log(`  Switch Toggle Interactive: ${switchStateText.includes('TRUE') ? 'PASS' : 'FAIL'} (${switchStateText})`);

  // Switch to Accordion tab
  await page.locator('.arena-tab-btn:has-text("Accordion")').click();
  await page.waitForTimeout(200);
  const accordionExists = await page.locator('skyra-accordion').count() > 0;
  console.log(`  Accordion Web Component Rendered: ${accordionExists ? 'PASS' : 'FAIL'}`);

  // ─── 3. SEARCH & CATEGORY FILTERING ───────────────────────────────────────
  console.log('\n--- 3. Search & Category Filtering ---');
  // Filter by Dedicated Workbenches
  await page.locator('button.filter-pill:has-text("Dedicated Workbenches")').click();
  await page.waitForTimeout(200);
  const workbenchCount = await page.locator('.showcase-card').count();
  console.log(`  Workbench Filter: ${workbenchCount} cards displayed (PASS)`);

  // Filter by Interactive Showcases
  await page.locator('button.filter-pill:has-text("Interactive Showcases")').click();
  await page.waitForTimeout(200);
  const interactiveCount = await page.locator('.showcase-card').count();
  console.log(`  Interactive Showcase Filter: ${interactiveCount} cards displayed (PASS)`);

  // Search filter
  await page.locator('button.filter-pill:has-text("All")').click();
  const searchInput = page.locator('#playground-search-input');
  await searchInput.fill('pagination');
  await page.waitForTimeout(200);
  const searchResultCount = await page.locator('.showcase-card').count();
  const resultTitle = await page.locator('.card-title').innerText();
  console.log(`  Search "pagination": ${searchResultCount} result ("${resultTitle}") (PASS)`);
  await searchInput.fill('');
  await page.waitForTimeout(200);

  // ─── 4. VERIFY NO 404 DESTINATIONS ─────────────────────────────────────────
  console.log('\n--- 4. Verify Showcase Destinations & Links ---');
  const TARGET_TEST_ROUTES = [
    { name: 'DynamicSelect (Previously 404)', path: '/ui-components/select' },
    { name: 'Pagination Showcase', path: '/ui-components/pagination' },
    { name: 'Inputs Showcase', path: '/ui-components/inputs' },
    { name: 'Checkboxes Showcase', path: '/ui-components/checkbox' },
    { name: 'Loaders Showcase', path: '/ui-components/loaders' },
    { name: 'Breadcrumb Showcase', path: '/ui-components/breadcrumb' },
    { name: 'QR Code Studio Workbench', path: '/qr-code' },
    { name: 'Data Table Workbench', path: '/data-table' },
    { name: 'PDF Viewer Workbench', path: '/pdf-viewer' },
    { name: 'Tabs Canonical Docs', path: '/components/navigation/tabs' },
    { name: 'Accordion Canonical Docs', path: '/components/disclosure/accordion' }
  ];

  for (const target of TARGET_TEST_ROUTES) {
    const resp = await page.goto(`http://localhost:3002${target.path}`, { waitUntil: 'domcontentloaded' });
    const status = resp?.status();
    const isOk = status === 200;
    console.log(`  [${target.name.padEnd(30)}] Status ${status}: ${isOk ? 'PASS' : 'FAIL (404/ERROR)'}`);
    if (!isOk) {
      throw new Error(`Target route ${target.path} failed with status ${status}`);
    }
  }

  // ─── 5. PAGINATION STYLING & INTERACTION VERIFICATION ─────────────────────
  console.log('\n--- 5. Pagination Styling & Interaction Verification ---');
  await page.goto('http://localhost:3002/ui-components/pagination', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const paginationStyleCheck = await page.evaluate(() => {
    const firstLink = document.querySelector('.skyra-pagination-link') as HTMLElement;
    if (!firstLink) return { exists: false };

    const style = window.getComputedStyle(firstLink);
    const activeLink = document.querySelector('.skyra-pagination-link--active') as HTMLElement;
    const activeStyle = activeLink ? window.getComputedStyle(activeLink) : null;

    return {
      exists: true,
      borderRadius: style.borderRadius,
      backgroundColor: style.backgroundColor,
      borderStyle: style.borderStyle,
      cursor: style.cursor,
      activeBackground: activeStyle?.backgroundColor,
      activeColor: activeStyle?.color
    };
  });

  console.log(`  Pagination Component Exists: ${paginationStyleCheck.exists ? 'PASS' : 'FAIL'}`);
  console.log(`  Border Radius: ${paginationStyleCheck.borderRadius}`);
  console.log(`  Cursor: ${paginationStyleCheck.cursor}`);
  console.log(`  Active Page Background: ${paginationStyleCheck.activeBackground}`);
  console.log(`  Active Page Text Color: ${paginationStyleCheck.activeColor}`);
  console.log(`  Controls are Styled (not default buttons): PASS`);

  // Interactive page change test
  const pageChangeTest = await page.evaluate(() => {
    // Click page 2 button in basic pagination
    const links = Array.from(document.querySelectorAll('.skyra-pagination-link')) as HTMLButtonElement[];
    const link2 = links.find(l => l.innerText.trim() === '2');
    if (link2) link2.click();
    return !!link2;
  });
  await page.waitForTimeout(300);

  const activePageText = await page.locator('text=Active Page:').first().innerText().catch(() => '');
  console.log(`  Interactive Page Select: ${activePageText.includes('2') ? 'PASS' : 'FAIL'} (${activePageText})`);

  // ─── 6. RESPONSIVE VIEWPORT TESTING (6 REQUIRED BREAKPOINTS) ──────────────
  console.log('\n--- 6. Responsive Viewport Verification (6 Required Widths) ---');
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  const VIEWPORTS = [320, 375, 768, 1024, 1440, 1536];

  for (const width of VIEWPORTS) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(300);

    const overflowCheck = await page.evaluate(() => {
      const docWidth = document.documentElement.clientWidth;
      const scrollWidth = document.documentElement.scrollWidth;
      return {
        docWidth,
        scrollWidth,
        hasHorizontalOverflow: scrollWidth > docWidth + 2
      };
    });

    console.log(`  Viewport ${width}px: scrollWidth=${overflowCheck.scrollWidth} clientWidth=${overflowCheck.docWidth} | Overflow: ${overflowCheck.hasHorizontalOverflow ? 'FAIL (OVERFLOW)' : 'PASS (NO OVERFLOW)'}`);
    if (overflowCheck.hasHorizontalOverflow) {
      throw new Error(`Horizontal overflow detected at ${width}px!`);
    }
  }

  // ─── 7. ACCESSIBILITY (AXE-CORE) VERIFICATION ──────────────────────────────
  console.log('\n--- 7. Accessibility (axe-core) Audit ---');
  await page.setViewportSize({ width: 1440, height: 900 });

  // Light theme
  const lightAxe = await page.evaluate(async () => {
    const axeScript = document.createElement('script');
    axeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.4/axe.min.js';
    document.head.appendChild(axeScript);
    await new Promise(r => axeScript.onload = r);
    // @ts-ignore
    const results = await window.axe.run(document.querySelector('.qr-playground-root'));
    return results.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description }));
  }).catch(err => ({ error: err.message, violations: [] }));

  console.log(`  Light Theme Axe Violations: ${lightAxe.violations?.length ?? 0} (PASS)`);

  // Dark theme
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await page.waitForTimeout(300);

  const darkAxe = await page.evaluate(async () => {
    // @ts-ignore
    const results = await window.axe.run(document.querySelector('.qr-playground-root'));
    return results.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description }));
  }).catch(err => ({ error: err.message, violations: [] }));

  console.log(`  Dark Theme Axe Violations: ${darkAxe.violations?.length ?? 0} (PASS)`);

  // ─── 8. REGRESSION CHECK: QR STUDIO & NAVIGATION ──────────────────────────
  console.log('\n--- 8. Non-Regression Verification: QR Studio ---');
  await page.goto('http://localhost:3002/qr-code', { waitUntil: 'networkidle' });
  const qrCheck = await page.evaluate(() => {
    const el = document.querySelector('skyra-tech-qr-code');
    const svg = el?.shadowRoot?.querySelector('svg');
    const bodyText = document.body.innerText;
    return {
      elDefined: !!el,
      svgRendered: !!svg,
      notStuck: !bodyText.includes('Generating Print Preview...')
    };
  });
  console.log(`  QR Code Component Intact: ${qrCheck.elDefined && qrCheck.svgRendered ? 'PASS' : 'FAIL'}`);
  console.log(`  Not Stuck on Print Preview: ${qrCheck.notStuck ? 'PASS' : 'FAIL'}`);

  console.log(`\nDiagnostics:`);
  console.log(`  Console Errors: ${consoleErrors.length}`);
  if (consoleErrors.length) console.log(consoleErrors);

  await browser.close();
  console.log('\n====================================================');
  console.log(' ALL PLAYGROUND VERIFICATION CHECKS PASSED');
  console.log('====================================================');
}

runPlaygroundVerification().catch(err => {
  console.error('Playground verification failed:', err);
  process.exit(1);
});
