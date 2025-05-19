import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has proper heading hierarchy', async ({ page }) => {
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    const levels = await Promise.all(headings.map(h => h.evaluate(el => parseInt(el.tagName[1]))));
    
    // Check if headings are in order
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
    }
  });

  test('has proper ARIA labels', async ({ page }) => {
    const buttons = page.locator('button');
    for (const button of await buttons.all()) {
      const hasLabel = await button.evaluate(el => {
        return el.hasAttribute('aria-label') || 
               el.hasAttribute('aria-labelledby') || 
               el.textContent?.trim().length > 0;
      });
      expect(hasLabel).toBeTruthy();
    }
  });

  test('has proper form labels', async ({ page }) => {
    await page.click('button:has-text("New Loan")');
    
    const inputs = page.locator('input, select, textarea');
    for (const input of await inputs.all()) {
      const hasLabel = await input.evaluate(el => {
        const id = el.getAttribute('id');
        return id && document.querySelector(`label[for="${id}"]`) || 
               el.hasAttribute('aria-label') || 
               el.hasAttribute('aria-labelledby');
      });
      expect(hasLabel).toBeTruthy();
    }
  });

  test('has proper color contrast', async ({ page }) => {
    const elements = page.locator('*');
    for (const element of await elements.all()) {
      const style = await element.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          backgroundColor: computed.backgroundColor,
          color: computed.color
        };
      });
      
      // Skip elements with transparent or inherited colors
      if (style.backgroundColor === 'transparent' || style.color === 'inherit') {
        continue;
      }
      
      // Check if text color and background color are different
      expect(style.backgroundColor).not.toBe(style.color);
    }
  });

  test('has proper focus indicators', async ({ page }) => {
    const focusableElements = page.locator('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    for (const element of await focusableElements.all()) {
      await element.focus();
      const hasFocusIndicator = await element.evaluate(el => {
        const style = window.getComputedStyle(el);
        return style.outline !== 'none' || style.boxShadow !== 'none';
      });
      expect(hasFocusIndicator).toBeTruthy();
    }
  });

  test('has proper keyboard navigation', async ({ page }) => {
    await page.keyboard.press('Tab');
    const firstFocusable = page.locator('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])').first();
    await expect(firstFocusable).toBeFocused();
    
    await page.keyboard.press('Tab');
    const secondFocusable = page.locator('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])').nth(1);
    await expect(secondFocusable).toBeFocused();
  });

  test('has proper error messages', async ({ page }) => {
    await page.click('button:has-text("New Loan")');
    await page.click('button:has-text("Create")');
    
    const errorMessages = page.locator('[role="alert"]');
    for (const message of await errorMessages.all()) {
      const isVisible = await message.isVisible();
      expect(isVisible).toBeTruthy();
      
      const hasAriaLive = await message.getAttribute('aria-live');
      expect(hasAriaLive).toBeTruthy();
    }
  });

  test('has proper skip links', async ({ page }) => {
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeVisible();
    
    await skipLink.click();
    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeFocused();
  });
}); 