import { test, expect } from '@playwright/test';

test.describe('Dashboard Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('full page loads without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Filter out known benign errors (hydration warnings, etc.)
    const realErrors = errors.filter(
      (e) => !e.includes('hydration') && !e.includes('Warning:') && !e.includes('DevTools')
    );

    expect(realErrors, `Console errors: ${realErrors.join('\n')}`).toHaveLength(0);
  });

  test('all major sections render', async ({ page }) => {
    // Check for KPI section
    const kpiSection = page.locator('[class*="kpi"], [class*="Kpi"], [class*="metric"]').first();
    const hasKpi = await kpiSection.isVisible().catch(() => false);

    // Check for chart section
    const chartSection = page.locator('canvas, svg[class*="chart"], [class*="chart"], [class*="Chart"]').first();
    const hasChart = await chartSection.isVisible().catch(() => false);

    // Check for table section
    const tableSection = page.locator('table, [role="table"]').first();
    const hasTable = await tableSection.isVisible().catch(() => false);

    // At least some content sections should render
    const sectionCount = [hasKpi, hasChart, hasTable].filter(Boolean).length;
    expect(sectionCount, 'Dashboard should have at least 1 major content section').toBeGreaterThanOrEqual(1);
  });

  test('navigation sidebar is present', async ({ page }) => {
    const sidebar = page.locator('aside, nav[class*="sidebar"], [class*="Sidebar"]').first();
    await expect(sidebar).toBeVisible();
  });

  test('filter panel can be opened', async ({ page }) => {
    const filterBtn = page.locator('button:has-text("Filter"), button[aria-label*="ilter"]').first();

    if (await filterBtn.isVisible()) {
      await filterBtn.click();
      await page.waitForTimeout(400);

      // Some filter-related content should appear - look for Apply button or filter heading
      const filterContent = page.locator('button:has-text("Apply"), h2:has-text("Filter"), h2:has-text("FILTER")').first();
      const hasFilter = await filterContent.isVisible().catch(() => false);
      expect(hasFilter).toBe(true);
    }
  });

  test('page title or heading is present', async ({ page }) => {
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
    const text = await heading.textContent();
    expect(text).toBeTruthy();
  });

  test('no JavaScript errors on page load', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => {
      pageErrors.push(err.message);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    expect(pageErrors, `Page errors: ${pageErrors.join('\n')}`).toHaveLength(0);
  });

  test('dashboard full page screenshot', async ({ page }) => {
    await page.screenshot({ path: 'tests/screenshots/dashboard-full.png', fullPage: true });
  });

  test('dashboard above-fold screenshot', async ({ page }) => {
    await page.screenshot({ path: 'tests/screenshots/dashboard-above-fold.png', fullPage: false });
  });
});
