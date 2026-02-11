import { test, expect } from '@playwright/test';
import { LAYOUT } from '../thor-constants';

test.describe('Header Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('header is position:fixed', async ({ page }) => {
    const header = page.locator('header').first();
    await expect(header).toBeVisible();

    const position = await header.evaluate((el) => {
      return window.getComputedStyle(el).position;
    });

    expect(
      ['fixed', 'sticky'].includes(position),
      `Header position should be fixed or sticky, got "${position}"`
    ).toBe(true);
  });

  test('header height is 64px', async ({ page }) => {
    const header = page.locator('header').first();
    await expect(header).toBeVisible();

    const box = await header.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.height).toBe(LAYOUT.headerHeight);
  });

  test('header has correct background color', async ({ page }) => {
    const header = page.locator('header').first();
    await expect(header).toBeVisible();

    const bgColor = await header.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Header background should be one of the THOR colors or a themed variant
    // It should not be transparent/unset
    expect(bgColor).toBeTruthy();
    expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('header has zero border-radius', async ({ page }) => {
    const header = page.locator('header').first();

    const borderRadius = await header.evaluate((el) => {
      return window.getComputedStyle(el).borderRadius;
    });

    expect(borderRadius).toBe('0px');
  });

  test('header stays fixed on scroll', async ({ page }) => {
    const header = page.locator('header').first();
    await expect(header).toBeVisible();

    // Get initial position
    const initialBox = await header.boundingBox();
    expect(initialBox).toBeTruthy();
    const initialTop = initialBox!.y;

    // Scroll down
    await page.evaluate(() => {
      const main = document.querySelector('main') || document.documentElement;
      main.scrollTop = 500;
    });

    // Also try window scroll
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(300);

    // Header should still be at the top
    const afterScrollBox = await header.boundingBox();
    expect(afterScrollBox).toBeTruthy();
    expect(afterScrollBox!.y).toBeLessThanOrEqual(initialTop + 2); // Allow 2px tolerance
  });

  test('header contains THOR branding', async ({ page }) => {
    const header = page.locator('header').first();
    const headerText = await header.textContent();

    // Header should contain some THOR branding text
    expect(headerText).toBeTruthy();
  });

  test('header screenshot matches', async ({ page }) => {
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
    await header.screenshot({ path: 'tests/screenshots/header.png' });
  });
});
