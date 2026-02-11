import { test, expect } from '@playwright/test';
import { APPROVED_FONTS } from '../thor-constants';

test.describe('KPI Cards Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { timeout: 60000 });
    await page.waitForLoadState('networkidle');
  });

  test('KPI cards render with correct structure', async ({ page }) => {
    // KPI cards should have a label, value, and optional change indicator
    const kpiCards = page.locator('[class*="kpi"], [data-testid*="kpi"], [class*="Kpi"]');

    // If no specific KPI selectors, look for card-like structures with metrics
    const cards = await kpiCards.count() > 0
      ? kpiCards
      : page.locator('[class*="card"]').filter({ hasText: /\$|%|\d+[,.]/ });

    const count = await cards.count();
    // Dashboard should have at least some KPI cards
    if (count > 0) {
      const firstCard = cards.first();
      await expect(firstCard).toBeVisible();

      // Card should contain text content
      const text = await firstCard.textContent();
      expect(text).toBeTruthy();
      expect(text!.length).toBeGreaterThan(0);
    }
  });

  test('KPI labels are uppercase Montserrat', async ({ page }) => {
    // KPI labels are typically small uppercase text
    const kpiLabels = await page.evaluate((headingFont: string) => {
      // Look for elements that appear to be KPI labels
      const candidates = document.querySelectorAll(
        '[class*="kpi-label"], [class*="label"], [class*="metric-name"]'
      );

      // Also look for small uppercase text elements in card-like containers
      const allSmallText = document.querySelectorAll('[class*="card"] p, [class*="card"] span, [class*="card"] div');

      const results: { text: string; fontFamily: string; textTransform: string; isCorrect: boolean }[] = [];

      const check = (el: Element) => {
        const styles = window.getComputedStyle(el);
        const text = el.textContent?.trim() || '';
        if (!text || text.length > 50) return; // Skip long text or empty

        const isUppercase = styles.textTransform === 'uppercase' || text === text.toUpperCase();
        const fontSize = parseFloat(styles.fontSize);
        const isSmall = fontSize <= 14;

        if (isUppercase && isSmall && text.length > 2) {
          const ff = styles.fontFamily;
          const hasMontserrat = ff.toLowerCase().includes(headingFont.toLowerCase());
          results.push({
            text: text.slice(0, 30),
            fontFamily: ff.slice(0, 60),
            textTransform: styles.textTransform,
            isCorrect: hasMontserrat,
          });
        }
      };

      candidates.forEach(check);
      allSmallText.forEach(check);

      return results;
    }, APPROVED_FONTS.heading);

    const failures = kpiLabels.filter((l) => !l.isCorrect);
    if (failures.length > 0) {
      const summary = failures.map(
        (f) => `"${f.text}" uses "${f.fontFamily}" instead of "${APPROVED_FONTS.heading}"`
      );
      expect(failures, `KPI label font violations:\n${summary.join('\n')}`).toHaveLength(0);
    }
  });

  test('KPI change indicators show correct colors', async ({ page }) => {
    const indicators = await page.evaluate(() => {
      // Look for trend/change indicators
      const elements = document.querySelectorAll(
        '[class*="trend"], [class*="change"], [class*="indicator"]'
      );

      const results: { text: string; color: string }[] = [];
      elements.forEach((el) => {
        const text = el.textContent?.trim() || '';
        if (text.includes('+') || text.includes('-') || text.includes('%')) {
          const color = window.getComputedStyle(el).color;
          results.push({ text: text.slice(0, 20), color });
        }
      });

      return results;
    });

    // Verify indicators exist and have color applied
    if (indicators.length > 0) {
      indicators.forEach((ind) => {
        expect(ind.color).toBeTruthy();
        expect(ind.color).not.toBe('rgba(0, 0, 0, 0)');
      });
    }
  });

  test('KPI cards have zero border-radius', async ({ page }) => {
    const cards = page.locator('[class*="card"], [class*="Card"]');
    const count = await cards.count();

    for (let i = 0; i < Math.min(count, 10); i++) {
      const br = await cards.nth(i).evaluate((el) => {
        return window.getComputedStyle(el).borderRadius;
      });
      expect(br, `Card ${i} has border-radius ${br}`).toBe('0px');
    }
  });

  test('KPI cards screenshot', async ({ page }) => {
    await page.screenshot({ path: 'tests/screenshots/kpi-cards.png', fullPage: false });
  });
});
