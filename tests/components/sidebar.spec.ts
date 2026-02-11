import { test, expect } from '@playwright/test';
import { LAYOUT } from '../thor-constants';

test.describe('Sidebar Component', () => {
  test.beforeEach(async ({ page }) => {
    // Use a desktop viewport to ensure sidebar is visible
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('sidebar defaults to expanded (260px)', async ({ page }) => {
    // Look for the sidebar container - typically an aside or a nav with sidebar role
    const sidebar = page.locator('aside').first();
    await expect(sidebar).toBeVisible();

    const box = await sidebar.boundingBox();
    expect(box).toBeTruthy();

    // Sidebar expanded width should be approximately 260px (allow some tolerance for borders)
    expect(box!.width).toBeGreaterThanOrEqual(LAYOUT.sidebarExpanded - 10);
    expect(box!.width).toBeLessThanOrEqual(LAYOUT.sidebarExpanded + 10);
  });

  test('toggle collapses sidebar to 64px', async ({ page }) => {
    // Find the collapse toggle button
    const collapseBtn = page.locator('button[aria-label*="ollapse"], button[aria-label*="idebar"]').first();

    if (await collapseBtn.isVisible()) {
      await collapseBtn.click();
      await page.waitForTimeout(400); // Wait for transition

      const sidebar = page.locator('aside').first();
      const box = await sidebar.boundingBox();
      expect(box).toBeTruthy();

      // Collapsed width should be approximately 64px
      expect(box!.width).toBeGreaterThanOrEqual(LAYOUT.sidebarCollapsed - 10);
      expect(box!.width).toBeLessThanOrEqual(LAYOUT.sidebarCollapsed + 10);
    }
  });

  test('toggle expands sidebar back to 260px', async ({ page }) => {
    // Collapse first
    const collapseBtn = page.locator('button[aria-label*="ollapse"], button[aria-label*="idebar"]').first();

    if (await collapseBtn.isVisible()) {
      await collapseBtn.click();
      await page.waitForTimeout(400);

      // Now expand
      const expandBtn = page.locator('button[aria-label*="xpand"], button[aria-label*="idebar"]').first();
      if (await expandBtn.isVisible()) {
        await expandBtn.click();
        await page.waitForTimeout(400);

        const sidebar = page.locator('aside').first();
        const box = await sidebar.boundingBox();
        expect(box).toBeTruthy();

        expect(box!.width).toBeGreaterThanOrEqual(LAYOUT.sidebarExpanded - 10);
        expect(box!.width).toBeLessThanOrEqual(LAYOUT.sidebarExpanded + 10);
      }
    }
  });

  test('active nav item has correct highlight', async ({ page }) => {
    // Find nav items inside the sidebar - can be buttons or links
    const navItems = page.locator('aside nav button, aside nav a[href]');
    const count = await navItems.count();
    expect(count).toBeGreaterThan(0);

    // Look for an item with active styling (border-left color or background)
    let hasActive = false;
    for (let i = 0; i < count; i++) {
      const bgColor = await navItems.nth(i).evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });
      const borderLeftColor = await navItems.nth(i).evaluate((el) => {
        return window.getComputedStyle(el).borderLeftColor;
      });

      // Active item has a non-transparent background or a green left border
      if (bgColor !== 'rgba(0, 0, 0, 0)' || borderLeftColor.includes('119, 136, 98')) {
        hasActive = true;
        break;
      }
    }
    expect(hasActive, 'At least one nav item should have active highlight').toBe(true);
  });

  test('sidebar has zero border-radius', async ({ page }) => {
    const sidebar = page.locator('aside').first();

    const borderRadius = await sidebar.evaluate((el) => {
      return window.getComputedStyle(el).borderRadius;
    });

    expect(borderRadius).toBe('0px');
  });

  test('sidebar nav items have no border-radius', async ({ page }) => {
    const navLinks = page.locator('aside nav button, aside nav a[href]');
    const count = await navLinks.count();

    for (let i = 0; i < count; i++) {
      const br = await navLinks.nth(i).evaluate((el) => {
        return window.getComputedStyle(el).borderRadius;
      });
      expect(br, `Nav item ${i} has border-radius ${br}`).toBe('0px');
    }
  });

  test('sidebar screenshot - expanded', async ({ page }) => {
    const sidebar = page.locator('aside').first();
    await expect(sidebar).toBeVisible();
    await sidebar.screenshot({ path: 'tests/screenshots/sidebar-expanded.png' });
  });

  test('sidebar screenshot - collapsed', async ({ page }) => {
    const collapseBtn = page.locator('button[aria-label*="ollapse"], button[aria-label*="idebar"]').first();
    if (await collapseBtn.isVisible()) {
      await collapseBtn.click();
      await page.waitForTimeout(400);

      const sidebar = page.locator('aside').first();
      await sidebar.screenshot({ path: 'tests/screenshots/sidebar-collapsed.png' });
    }
  });
});
