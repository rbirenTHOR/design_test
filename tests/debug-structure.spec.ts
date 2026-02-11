import { test, expect } from '@playwright/test';

test('debug: inspect page structure', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const result = await page.evaluate(() => {
    const headers = document.querySelectorAll('header');
    const asides = document.querySelectorAll('aside');
    const navs = document.querySelectorAll('nav');

    const headerInfo = Array.from(headers).map((el, i) => {
      const styles = getComputedStyle(el);
      return {
        index: i,
        position: styles.position,
        height: el.getBoundingClientRect().height,
        width: el.getBoundingClientRect().width,
        bg: styles.backgroundColor,
        className: el.className.slice(0, 120),
      };
    });

    const asideInfo = Array.from(asides).map((el, i) => {
      const styles = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        index: i,
        position: styles.position,
        width: rect.width,
        height: rect.height,
        visible: rect.width > 0 && rect.height > 0,
        bg: styles.backgroundColor,
        className: el.className.slice(0, 120),
      };
    });

    return { headers: headerInfo, asides: asideInfo, navCount: navs.length };
  });

  console.log('HEADERS:', JSON.stringify(result.headers, null, 2));
  console.log('ASIDES:', JSON.stringify(result.asides, null, 2));
  console.log('NAV count:', result.navCount);
});
