import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('displays login form', async ({ page }) => {
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button:has-text("Login")')).toBeVisible();
  });

  test('validates required fields', async ({ page }) => {
    await page.click('button:has-text("Login")');
    
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });

  test('validates email format', async ({ page }) => {
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button:has-text("Login")');
    
    await expect(page.locator('text=Invalid email format')).toBeVisible();
  });

  test('handles invalid credentials', async ({ page }) => {
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'wrong-password');
    await page.click('button:has-text("Login")');
    
    await expect(page.locator('text=Invalid email or password')).toBeVisible();
  });

  test('successfully logs in', async ({ page }) => {
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button:has-text("Login")');
    
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=Welcome, User')).toBeVisible();
  });

  test('redirects to login when accessing protected route', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login');
  });

  test('remembers user after successful login', async ({ page }) => {
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button:has-text("Login")');
    
    await page.reload();
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=Welcome, User')).toBeVisible();
  });

  test('handles API error during login', async ({ page }) => {
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({
        status: 500,
        body: JSON.stringify({ message: 'Internal server error' })
      });
    });

    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button:has-text("Login")');
    
    await expect(page.locator('text=Failed to login')).toBeVisible();
  });
}); 