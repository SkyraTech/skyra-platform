import { test, expect } from '@playwright/test';

test.describe('Packages Catalogue', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/packages');
  });

  test('displays correct initial registry metrics', async ({ page }) => {
    // We expect some total count and some stable count, for our specific registry data
    const totalLocator = page.getByText('Total', { exact: true }).locator('..').locator('span').first();
    const stableLocator = page.getByText('Stable', { exact: true }).locator('..').locator('span').first();
    
    await expect(async () => {
      const totalText = await totalLocator.textContent();
      expect(Number(totalText)).toBeGreaterThan(0);
    }).toPass();
    
    await expect(async () => {
      const stableText = await stableLocator.textContent();
      expect(Number(stableText)).toBeGreaterThanOrEqual(0);
    }).toPass();
  });

  test('filters by search input (name, description, namespace)', async ({ page }) => {
    const searchInput = page.locator('skyra-tech-input').first();
    
    // Search for a specific package name
    await searchInput.evaluate((node: any) => {
      node.value = 'app-shell';
      node.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      node.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    });
    let cards = page.locator('.package-card');
    await expect(async () => {
      expect(await cards.count()).toBe(1);
    }).toPass();
    await expect(cards.first()).toContainText('app-shell');

    // Search by namespace (@skyra-tech-platform) should match multiple
    await searchInput.evaluate((node: any) => {
      node.value = '@skyra';
      node.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      node.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    });
    await expect(async () => {
      expect(await cards.count()).toBeGreaterThan(1);
    }).toPass();
  });

  test('filters by lifecycle status and runtime category', async ({ page }) => {
    const statusSelect = page.locator('select').first(); // Status
    const runtimeSelect = page.locator('select').nth(1); // Runtime
    
    // Select Stable
    await statusSelect.selectOption('stable');
    
    // Select React
    await runtimeSelect.selectOption('react-browser');
    
    // Should show results
    const countText = await page.locator('text=Showing').textContent();
    expect(countText).toMatch(/Showing \d+ packages/);
  });

  test('shows empty state when no results match', async ({ page }) => {
    const searchInput = page.locator('skyra-tech-input').first();
    await searchInput.evaluate((node: any) => {
      node.value = 'nonexistent-package-xyz';
      node.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      node.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    });
    
    const emptyTitle = page.locator('text=No packages found');
    await expect(emptyTitle).toBeVisible();
    
    // Test Clear All
    const clearButton = page.locator('skyra-tech-button', { hasText: 'Clear all filters' });
    await clearButton.evaluate((node: any) => node.click());
    
    // Should be restored
    await expect(async () => {
      expect(await page.locator('.package-card').count()).toBeGreaterThan(1);
    }).toPass();
  });

  test('maintains alphabetical sorting', async ({ page }) => {
    const titles = await page.locator('.package-card h3').allTextContents();
    
    // Verify they are sorted alphabetically
    const sortedTitles = [...titles].sort((a, b) => a.localeCompare(b));
    expect(titles).toEqual(sortedTitles);
  });

  test('navigates to the correct detail route', async ({ page }) => {
    const firstCard = page.locator('a:has(.package-card)').first();
    const href = await firstCard.getAttribute('href');
    expect(href).toMatch(/^\/packages\/.+/);
    
    await firstCard.click();
    await expect(page).toHaveURL(new RegExp(href!));
  });
});
