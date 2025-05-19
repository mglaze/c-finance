import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays correct navigation items', async ({ page }) => {
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=Loans')).toBeVisible();
    await expect(page.locator('text=Reports')).toBeVisible();
    await expect(page.locator('text=Settings')).toBeVisible();
  });

  test('highlights active page', async ({ page }) => {
    await expect(page.locator('text=Dashboard').locator('..')).toHaveClass(/active/);
    
    await page.click('text=Loans');
    await expect(page.locator('text=Loans').locator('..')).toHaveClass(/active/);
    await expect(page.locator('text=Dashboard').locator('..')).not.toHaveClass(/active/);
  });

  test('navigates to correct pages', async ({ page }) => {
    await page.click('text=Loans');
    await expect(page).toHaveURL('/loans');
    
    await page.click('text=Reports');
    await expect(page).toHaveURL('/reports');
    
    await page.click('text=Settings');
    await expect(page).toHaveURL('/settings');
    
    await page.click('text=Dashboard');
    await expect(page).toHaveURL('/');
  });

  test('displays user menu', async ({ page }) => {
    await page.click('button:has-text("User")');
    await expect(page.locator('text=Profile')).toBeVisible();
    await expect(page.locator('text=Logout')).toBeVisible();
  });

  test('handles logout', async ({ page }) => {
    await page.click('button:has-text("User")');
    await page.click('text=Logout');
    await expect(page).toHaveURL('/login');
  });
}); 