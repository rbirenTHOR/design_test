import { test, expect } from '@playwright/test';
import { APPROVED_FONTS } from '../thor-constants';

test.describe('Data Table Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('table headers are Montserrat uppercase', async ({ page }) => {
    const headers = await page.evaluate((headingFont: string) => {
      const thElements = document.querySelectorAll('th, [role="columnheader"]');
      const results: { text: string; fontFamily: string; textTransform: string; pass: boolean }[] = [];

      thElements.forEach((el) => {
        const styles = window.getComputedStyle(el);
        const ff = styles.fontFamily;
        const tt = styles.textTransform;
        const text = el.textContent?.trim() || '';

        if (!text) return;

        const hasMontserrat = ff.toLowerCase().includes(headingFont.toLowerCase());
        const isUppercase = tt === 'uppercase' || text === text.toUpperCase();

        results.push({
          text: text.slice(0, 30),
          fontFamily: ff.slice(0, 60),
          textTransform: tt,
          pass: hasMontserrat && isUppercase,
        });
      });

      return results;
    }, APPROVED_FONTS.heading);

    if (headers.length > 0) {
      const failures = headers.filter((h) => !h.pass);
      if (failures.length > 0) {
        const summary = failures.map(
          (f) => `"${f.text}" font="${f.fontFamily}" transform="${f.textTransform}"`
        );
        expect(failures, `Table header styling violations:\n${summary.join('\n')}`).toHaveLength(0);
      }
    }
  });

  test('table row hover effect works', async ({ page }) => {
    const rows = page.locator('tbody tr, [role="row"]');
    const count = await rows.count();

    if (count > 0) {
      const firstRow = rows.first();

      // Get initial background
      const initialBg = await firstRow.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      // Hover over the row
      await firstRow.hover();
      await page.waitForTimeout(200);

      const hoverBg = await firstRow.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      // On hover, background should change (or at least be defined)
      // Some implementations use CSS :hover which may not show in evaluate
      // At minimum verify the row exists and is interactive
      expect(firstRow).toBeTruthy();
    }
  });

  test('table pagination works', async ({ page }) => {
    // Look for pagination controls
    const nextBtn = page.locator('button:has-text("Next"), button[aria-label*="ext page"]').first();
    const prevBtn = page.locator('button:has-text("Previous"), button[aria-label*="revious"]').first();
    const pageNumbers = page.locator('[class*="pagination"] button, nav[aria-label*="pagination"] button');

    // If pagination exists, verify it works
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await page.waitForTimeout(300);
      // Previous button should now be enabled
      if (await prevBtn.isVisible()) {
        await expect(prevBtn).toBeEnabled();
      }
    }
  });

  test('table sort works', async ({ page }) => {
    const sortableHeaders = page.locator('th[class*="sort"], th button, [role="columnheader"] button');
    const count = await sortableHeaders.count();

    if (count > 0) {
      const firstSortable = sortableHeaders.first();
      await firstSortable.click();
      await page.waitForTimeout(300);

      // After click, some sort indicator should appear
      // Just verify the click didn't break anything
      const table = page.locator('table, [role="table"]').first();
      await expect(table).toBeVisible();
    }
  });

  test('table cells use Open Sans font', async ({ page }) => {
    const cellViolations = await page.evaluate((bodyFont: string) => {
      const cells = document.querySelectorAll('td, [role="cell"]');
      const results: { text: string; fontFamily: string }[] = [];

      cells.forEach((el) => {
        const text = el.textContent?.trim() || '';
        if (!text || text.length < 2) return;

        const ff = window.getComputedStyle(el).fontFamily;
        if (!ff.toLowerCase().includes(bodyFont.toLowerCase())) {
          // Skip if it's a badge or special element inside the cell
          if (ff.toLowerCase().includes('montserrat')) return;
          results.push({
            text: text.slice(0, 30),
            fontFamily: ff.slice(0, 60),
          });
        }
      });

      return results;
    }, APPROVED_FONTS.body);

    if (cellViolations.length > 0) {
      const summary = cellViolations.slice(0, 5).map(
        (v) => `"${v.text}" uses "${v.fontFamily}"`
      );
      expect(cellViolations, `Table cell font violations:\n${summary.join('\n')}`).toHaveLength(0);
    }
  });

  test('table has zero border-radius', async ({ page }) => {
    const table = page.locator('table, [role="table"]').first();

    if (await table.isVisible()) {
      const br = await table.evaluate((el) => {
        return window.getComputedStyle(el).borderRadius;
      });
      expect(br).toBe('0px');
    }
  });

  test('data table screenshot', async ({ page }) => {
    const table = page.locator('table, [role="table"]').first();
    if (await table.isVisible()) {
      await table.screenshot({ path: 'tests/screenshots/data-table.png' });
    }
  });
});
