import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays mobile menu on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    
    await expect(page.locator('button:has-text("Menu")')).toBeVisible();
    await expect(page.locator('nav')).not.toBeVisible();
    
    await page.click('button:has-text("Menu")');
    await expect(page.locator('nav')).toBeVisible();
  });

  test('displays desktop navigation on large screens', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 }); // Full HD
    
    await expect(page.locator('button:has-text("Menu")')).not.toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
  });

  test('adjusts loan form layout on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.click('button:has-text("New Loan")');
    
    const form = page.locator('form');
    await expect(form).toHaveCSS('flex-direction', 'column');
    await expect(form).toHaveCSS('width', '100%');
  });

  test('adjusts loan list layout on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const table = page.locator('table');
    await expect(table).toHaveCSS('display', 'block');
    await expect(table).toHaveCSS('width', '100%');
  });

  test('adjusts statistics cards layout on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const statsContainer = page.locator('.stats-container');
    await expect(statsContainer).toHaveCSS('grid-template-columns', '1fr');
  });

  test('adjusts statistics cards layout on medium screens', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    
    const statsContainer = page.locator('.stats-container');
    await expect(statsContainer).toHaveCSS('grid-template-columns', 'repeat(2, 1fr)');
  });

  test('adjusts statistics cards layout on large screens', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    const statsContainer = page.locator('.stats-container');
    await expect(statsContainer).toHaveCSS('grid-template-columns', 'repeat(5, 1fr)');
  });

  test('maintains form usability on touch devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.click('button:has-text("New Loan")');
    
    const inputs = page.locator('input');
    for (const input of await inputs.all()) {
      const box = await input.boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(44); // Minimum touch target size
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
  });

  test('maintains button usability on touch devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const buttons = page.locator('button');
    for (const button of await buttons.all()) {
      const box = await button.boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
  });
}); 