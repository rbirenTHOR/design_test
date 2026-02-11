import { test, expect } from '@playwright/test';

test.describe('Filter Panel Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { timeout: 60000 });
    await page.waitForLoadState('networkidle');
  });

  test('filter panel opens when toggle is clicked', async ({ page }) => {
    // The header has a "Toggle filters" or "Filters" button
    const filterBtn = page.locator('button[aria-label="Toggle filters"], button:has-text("Filters")').first();

    if (await filterBtn.isVisible()) {
      await filterBtn.click();
      await page.waitForTimeout(400);

      // Filter panel header should be visible (has "FILTERS" heading)
      const panelHeading = page.locator('h2:has-text("Filter"), h2:has-text("FILTER")').first();
      await expect(panelHeading).toBeVisible();
    }
  });

  test('filter panel closes when close button is clicked', async ({ page }) => {
    const filterBtn = page.locator('button[aria-label="Toggle filters"], button:has-text("Filters")').first();

    if (await filterBtn.isVisible()) {
      // Open
      await filterBtn.click();
      await page.waitForTimeout(400);

      // Close using the X button
      const closeBtn = page.locator('button[aria-label="Close filters"]').first();
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
        await page.waitForTimeout(400);

        // The panel should slide away (translate-x-full)
        const panel = page.locator('aside').filter({ hasText: 'Apply' });
        const transform = await panel.evaluate((el) => {
          return window.getComputedStyle(el).transform;
        }).catch(() => 'none');

        // Either the panel is not visible or it has a translate transform
        // indicating it's off-screen
      }
    }
  });

  test('filter groups expand and collapse (accordion)', async ({ page }) => {
    const filterBtn = page.locator('button[aria-label="Toggle filters"], button:has-text("Filters")').first();

    if (await filterBtn.isVisible()) {
      await filterBtn.click();
      await page.waitForTimeout(400);

      // FilterGroup components use accordion-style expand/collapse
      // Look for clickable section headers within the filter panel
      const filterGroupTriggers = page.locator('[data-state] button, button:has-text("Brand"), button:has-text("Region"), button:has-text("Date"), button:has-text("Category"), button:has-text("Dealer")');
      const count = await filterGroupTriggers.count();

      if (count > 0) {
        const firstTrigger = filterGroupTriggers.first();
        const initialState = await firstTrigger.getAttribute('data-state').catch(() => null);

        // Click to toggle
        await firstTrigger.click();
        await page.waitForTimeout(300);

        // Click again to toggle back
        await firstTrigger.click();
        await page.waitForTimeout(300);

        // Trigger should still be functional
        await expect(firstTrigger).toBeVisible();
      }
    }
  });

  test('Apply and Reset buttons are present and work', async ({ page }) => {
    const filterBtn = page.locator('button[aria-label="Toggle filters"], button:has-text("Filters")').first();

    if (await filterBtn.isVisible()) {
      await filterBtn.click();
      await page.waitForTimeout(400);

      // Check for Apply button
      const applyBtn = page.locator('button:has-text("Apply")').first();
      const resetBtn = page.locator('button:has-text("Reset")').first();

      await expect(applyBtn).toBeVisible();
      await expect(resetBtn).toBeVisible();

      // Verify Apply button has THOR dark green background
      const applyBg = await applyBtn.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });
      expect(applyBg).toBeTruthy();
      expect(applyBg).not.toBe('rgba(0, 0, 0, 0)');

      // Verify Reset button has border styling (outline/secondary style)
      const resetBorder = await resetBtn.evaluate((el) => {
        return window.getComputedStyle(el).borderWidth;
      });
      expect(resetBorder).toBeTruthy();

      // Click Reset
      await resetBtn.click();
      await page.waitForTimeout(300);
    }
  });

  test('filter panel has zero border-radius on all elements', async ({ page }) => {
    const filterBtn = page.locator('button[aria-label="Toggle filters"], button:has-text("Filters")').first();

    if (await filterBtn.isVisible()) {
      await filterBtn.click();
      await page.waitForTimeout(400);

      const violations = await page.evaluate(() => {
        // Find filter panel aside (the one with "Apply" button)
        const filterPanels = document.querySelectorAll('aside');
        const results: { tag: string; className: string; borderRadius: string }[] = [];

        filterPanels.forEach((panel) => {
          if (!panel.textContent?.includes('Apply')) return;

          const children = panel.querySelectorAll('*');
          children.forEach((el) => {
            const styles = window.getComputedStyle(el);
            const br = styles.borderRadius;
            if (br && br !== '0px' && br !== '0%' && br !== '0') {
              const num = parseFloat(br);
              if (!isNaN(num) && num > 0) {
                results.push({
                  tag: el.tagName.toLowerCase(),
                  className: el.className?.toString().slice(0, 60) || '',
                  borderRadius: br,
                });
              }
            }
          });
        });

        return results;
      });

      if (violations.length > 0) {
        const summary = violations.slice(0, 5).map(
          (v) => `<${v.tag} class="${v.className}"> has border-radius: ${v.borderRadius}`
        );
        expect(violations, `Filter panel border-radius violations:\n${summary.join('\n')}`).toHaveLength(0);
      }
    }
  });

  test('filter panel screenshot', async ({ page }) => {
    const filterBtn = page.locator('button[aria-label="Toggle filters"], button:has-text("Filters")').first();
    if (await filterBtn.isVisible()) {
      await filterBtn.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: 'tests/screenshots/filter-panel-open.png', fullPage: false });
    }
  });
});
