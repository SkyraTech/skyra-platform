import { test } from '@playwright/test';
import { injectAxe, getViolations } from 'axe-playwright';
import fs from 'fs';

test('check axe violations', async ({ page }) => {
  await page.goto('http://localhost:3006/ui-components/date-fields');
  await page.waitForLoadState('networkidle');
  await injectAxe(page);
  const violations = await getViolations(page);
  
  fs.writeFileSync('axe-violations.json', JSON.stringify(violations.map(v => ({
    id: v.id,
    impact: v.impact,
    description: v.description,
    nodes: v.nodes.map(n => ({
      html: n.html,
      target: n.target,
      failureSummary: n.failureSummary
    }))
  })), null, 2));
});
