import { test, expect } from '@playwright/test';
import { APPROVED_FONTS } from '../thor-constants';

test.describe('THOR Brand Compliance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('no element has border-radius > 0', async ({ page }) => {
    const violations = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*');
      const results: { tag: string; className: string; borderRadius: string }[] = [];

      // Elements to exclude from border-radius checks (scrollbar thumbs, etc.)
      const excludeSelectors = [
        '[class*="ScrollAreaThumb"]',
        '[class*="scrollbar"]',
        '[data-radix-scroll-area-thumb]',
      ];

      allElements.forEach((el) => {
        // Skip excluded elements
        for (const sel of excludeSelectors) {
          if (el.matches(sel)) return;
        }
        // Skip elements that are not visible
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) return;

        const styles = window.getComputedStyle(el);
        const br = styles.borderRadius;
        if (br && br !== '0px' && br !== '0%' && br !== '0') {
          const tlr = styles.borderTopLeftRadius;
          const trr = styles.borderTopRightRadius;
          const blr = styles.borderBottomLeftRadius;
          const brr = styles.borderBottomRightRadius;

          const hasNonZero = [tlr, trr, blr, brr].some((v) => {
            const num = parseFloat(v);
            return !isNaN(num) && num > 0;
          });

          if (hasNonZero) {
            results.push({
              tag: el.tagName.toLowerCase(),
              className: el.className?.toString().slice(0, 80) || '',
              borderRadius: br,
            });
          }
        }
      });

      return results;
    });

    if (violations.length > 0) {
      const summary = violations.slice(0, 10).map(
        (v) => `<${v.tag} class="${v.className}"> has border-radius: ${v.borderRadius}`
      );
      expect(violations, `Found ${violations.length} elements with border-radius > 0:\n${summary.join('\n')}`).toHaveLength(0);
    }
  });

  test('all heading elements use Montserrat font', async ({ page }) => {
    const headings = await page.evaluate((approvedHeadingFont: string) => {
      const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const results: { tag: string; text: string; fontFamily: string; pass: boolean }[] = [];

      headingElements.forEach((el) => {
        const styles = window.getComputedStyle(el);
        const ff = styles.fontFamily;
        const pass = ff.toLowerCase().includes(approvedHeadingFont.toLowerCase());
        results.push({
          tag: el.tagName.toLowerCase(),
          text: el.textContent?.slice(0, 40) || '',
          fontFamily: ff,
          pass,
        });
      });

      return results;
    }, APPROVED_FONTS.heading);

    const failures = headings.filter((h) => !h.pass);
    if (failures.length > 0) {
      const summary = failures.map(
        (f) => `<${f.tag}> "${f.text}" uses "${f.fontFamily}" instead of "${APPROVED_FONTS.heading}"`
      );
      expect(failures, `Heading font violations:\n${summary.join('\n')}`).toHaveLength(0);
    }
  });

  test('body text uses Open Sans font', async ({ page }) => {
    const bodyElements = await page.evaluate((approvedBodyFont: string) => {
      const elements = document.querySelectorAll('p, span, td, li, label, a');
      const results: { tag: string; text: string; fontFamily: string; pass: boolean }[] = [];

      elements.forEach((el) => {
        // Skip empty or icon-only elements
        if (!el.textContent?.trim() || el.textContent.trim().length < 2) return;
        // Skip elements inside headings
        if (el.closest('h1, h2, h3, h4, h5, h6')) return;
        // Skip elements with explicit Montserrat (callout labels, badges)
        const styles = window.getComputedStyle(el);
        const ff = styles.fontFamily;
        // Labels/badges that are Montserrat are allowed per design spec
        if (ff.toLowerCase().includes('montserrat')) return;

        const pass = ff.toLowerCase().includes(approvedBodyFont.toLowerCase());
        if (!pass) {
          results.push({
            tag: el.tagName.toLowerCase(),
            text: el.textContent?.slice(0, 40) || '',
            fontFamily: ff,
            pass,
          });
        }
      });

      return results;
    }, APPROVED_FONTS.body);

    if (bodyElements.length > 0) {
      const summary = bodyElements.slice(0, 10).map(
        (f) => `<${f.tag}> "${f.text}" uses "${f.fontFamily}" instead of "${APPROVED_FONTS.body}"`
      );
      expect(bodyElements, `Body font violations:\n${summary.join('\n')}`).toHaveLength(0);
    }
  });

  test('no unapproved font families are used anywhere', async ({ page }) => {
    const fontViolations = await page.evaluate(() => {
      const approvedFonts = ['montserrat', 'open sans'];
      const systemFonts = [
        'system-ui', '-apple-system', 'blinkmacsystemfont', 'segoe ui',
        'roboto', 'helvetica neue', 'arial', 'noto sans', 'sans-serif',
        'apple color emoji', 'segoe ui emoji', 'segoe ui symbol', 'noto color emoji',
        'serif', 'monospace', 'ui-sans-serif', 'ui-serif', 'ui-monospace',
      ];

      const allElements = document.querySelectorAll('*');
      const fontFamilies = new Set<string>();

      allElements.forEach((el) => {
        const ff = window.getComputedStyle(el).fontFamily;
        if (ff) fontFamilies.add(ff);
      });

      const violations: string[] = [];
      fontFamilies.forEach((ff) => {
        const fonts = ff.split(',').map((f) => f.trim().replace(/['"]/g, '').toLowerCase());
        const hasApproved = fonts.some((f) => approvedFonts.some((a) => f.includes(a)));
        const allSystem = fonts.every((f) => systemFonts.includes(f));
        if (!hasApproved && !allSystem) {
          violations.push(ff);
        }
      });

      return violations;
    });

    if (fontViolations.length > 0) {
      expect(
        fontViolations,
        `Unapproved fonts found: ${fontViolations.join('; ')}`
      ).toHaveLength(0);
    }
  });

  test('THOR colors are applied correctly via Tailwind', async ({ page }) => {
    // The project uses Tailwind direct color classes (bg-dark-green, text-lightest, etc.)
    // rather than CSS custom properties. Verify the colors are actually applied.
    const colorUsage = await page.evaluate(() => {
      const results: { element: string; property: string; value: string }[] = [];

      // Check header background - should be THOR Dark Green (#495737 / rgb(73, 87, 55))
      const header = document.querySelector('header');
      if (header) {
        const bg = getComputedStyle(header).backgroundColor;
        results.push({ element: 'header', property: 'backgroundColor', value: bg });
      }

      // Check sidebar background - should be Darkest Grey (#2A2928 / rgb(42, 41, 40))
      const sidebar = document.querySelector('aside');
      if (sidebar) {
        const bg = getComputedStyle(sidebar).backgroundColor;
        results.push({ element: 'sidebar', property: 'backgroundColor', value: bg });
      }

      return results;
    });

    // Verify header has THOR Dark Green background
    const headerBg = colorUsage.find(c => c.element === 'header');
    expect(headerBg).toBeTruthy();
    expect(headerBg!.value).toBe('rgb(73, 87, 55)'); // #495737

    // Verify sidebar has THOR Darkest Grey background
    const sidebarBg = colorUsage.find(c => c.element === 'sidebar');
    expect(sidebarBg).toBeTruthy();
    expect(sidebarBg!.value).toBe('rgb(42, 41, 40)'); // #2A2928
  });
});
