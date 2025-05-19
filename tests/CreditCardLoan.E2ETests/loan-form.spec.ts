import { test, expect } from '@playwright/test';
import { mockApiFailure, clearMockApiFailure } from './test-helpers';

test.describe('Loan Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("New Loan")');
  });

  test('validates amount field', async ({ page }) => {
    await page.fill('input[name="customerName"]', 'John Doe');
    await page.fill('input[name="amount"]', '-1000');
    await page.fill('input[name="interestRate"]', '5.5');
    await page.fill('input[name="termMonths"]', '12');
    await page.click('button:has-text("Create")');

    await expect(page.locator('text=Amount must be greater than 0')).toBeVisible();
  });

  test('validates interest rate field', async ({ page }) => {
    await page.fill('input[name="customerName"]', 'John Doe');
    await page.fill('input[name="amount"]', '5000');
    await page.fill('input[name="interestRate"]', '101');
    await page.fill('input[name="termMonths"]', '12');
    await page.click('button:has-text("Create")');

    await expect(page.locator('text=Interest rate must be between 0 and 100')).toBeVisible();
  });

  test('validates term months field', async ({ page }) => {
    await page.fill('input[name="customerName"]', 'John Doe');
    await page.fill('input[name="amount"]', '5000');
    await page.fill('input[name="interestRate"]', '5.5');
    await page.fill('input[name="termMonths"]', '0');
    await page.click('button:has-text("Create")');

    await expect(page.locator('text=Term must be greater than 0')).toBeVisible();
  });

  test('handles API error gracefully', async ({ page }) => {
    await mockApiFailure(page);

    await page.fill('input[name="customerName"]', 'John Doe');
    await page.fill('input[name="amount"]', '5000');
    await page.fill('input[name="interestRate"]', '5.5');
    await page.fill('input[name="termMonths"]', '12');
    await page.click('button:has-text("Create")');

    await expect(page.locator('text=Failed to create loan')).toBeVisible();
    await expect(page.locator('form')).toBeVisible();

    await clearMockApiFailure(page);
  });

  test('closes form on cancel', async ({ page }) => {
    await page.click('button:has-text("Cancel")');
    await expect(page.locator('form')).not.toBeVisible();
  });
}); 