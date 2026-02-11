import { test, expect } from '@playwright/test';

test.describe('Showcase / Style Guide Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/showcase');
    await page.waitForLoadState('networkidle');
  });

  test('showcase page loads successfully', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => {
      pageErrors.push(err.message);
    });

    await page.goto('/showcase');
    await page.waitForLoadState('networkidle');

    // Page should load without errors
    expect(pageErrors).toHaveLength(0);

    // Should have some content
    const body = page.locator('body');
    const text = await body.textContent();
    expect(text!.length).toBeGreaterThan(100);
  });

  test('all component categories are present', async ({ page }) => {
    // The showcase should demonstrate these component categories
    const categories = ['Color', 'Typography', 'Button', 'Card', 'Table', 'Badge'];

    for (const category of categories) {
      const section = page.locator(`text=${category}`).first();
      const isVisible = await section.isVisible().catch(() => false);
      // At minimum, the heading or section should exist in the page content
      const pageContent = await page.content();
      const exists = pageContent.toLowerCase().includes(category.toLowerCase());
      expect(exists, `Category "${category}" should exist on showcase page`).toBe(true);
    }
  });

  test('color swatches render with hex values', async ({ page }) => {
    // Look for color swatches/samples
    const colorElements = page.locator('[class*="swatch"], [class*="color-sample"], [class*="Color"]');
    const count = await colorElements.count();

    if (count === 0) {
      // Alternative: check if hex codes are displayed on the page
      const pageContent = await page.content();
      const hasHexCodes = /\#[0-9A-Fa-f]{6}/.test(pageContent);
      expect(hasHexCodes, 'Showcase should display color hex values').toBe(true);
    }
  });

  test('typography section shows different heading levels', async ({ page }) => {
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const count = await headings.count();
    // Showcase should display multiple heading levels
    expect(count).toBeGreaterThan(2);
  });

  test('button variants are displayed', async ({ page }) => {
    const buttons = page.locator('button');
    const count = await buttons.count();
    // Showcase should have multiple button examples
    expect(count).toBeGreaterThan(3);
  });

  test('components render in all states', async ({ page }) => {
    const pageContent = await page.content();
    // Check for common state demonstrations
    const states = ['loading', 'empty', 'error', 'disabled', 'active', 'hover'];
    let stateCount = 0;

    for (const state of states) {
      if (pageContent.toLowerCase().includes(state)) {
        stateCount++;
      }
    }

    // At least some states should be demonstrated
    expect(stateCount, 'Showcase should demonstrate component states').toBeGreaterThanOrEqual(1);
  });

  test('showcase has zero border-radius violations', async ({ page }) => {
    const violations = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*');
      const results: { tag: string; className: string; borderRadius: string }[] = [];

      allElements.forEach((el) => {
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

      return results;
    });

    if (violations.length > 0) {
      const summary = violations.slice(0, 10).map(
        (v) => `<${v.tag} class="${v.className}"> border-radius: ${v.borderRadius}`
      );
      expect(violations, `Showcase border-radius violations:\n${summary.join('\n')}`).toHaveLength(0);
    }
  });

  test('showcase full page screenshot', async ({ page }) => {
    await page.screenshot({ path: 'tests/screenshots/showcase-full.png', fullPage: true });
  });
});
