import { test, expect } from '@playwright/test';
import { createTestLoan, deleteTestLoan, mockApiFailure, clearMockApiFailure } from './test-helpers';

test.describe('Credit Card Loan Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the dashboard before each test
    await page.goto('/');
  });

  test('displays loan statistics', async ({ page }) => {
    // Wait for the stats to load
    await page.waitForSelector('.stat-card');

    // Check if all stat cards are present
    await expect(page.locator('.stat-card')).toHaveCount(5);
    await expect(page.locator('text=Total Loans')).toBeVisible();
    await expect(page.locator('text=Active Loans')).toBeVisible();
    await expect(page.locator('text=Pending Loans')).toBeVisible();
    await expect(page.locator('text=Total Amount')).toBeVisible();
    await expect(page.locator('text=Average Interest Rate')).toBeVisible();
  });

  test('creates a new loan', async ({ page }) => {
    await createTestLoan(page);
  });

  test('edits an existing loan', async ({ page }) => {
    await createTestLoan(page);
    
    await page.click('button:has-text("Edit")');
    await page.fill('input[name="customerName"]', 'Jane Doe');
    await page.fill('input[name="amount"]', '6000');
    await page.click('button:has-text("Update")');
    
    await expect(page.locator('text=Jane Doe')).toBeVisible();
    await expect(page.locator('text=$6,000.00')).toBeVisible();
  });

  test('deletes a loan', async ({ page }) => {
    await createTestLoan(page);
    await deleteTestLoan(page);
  });

  test('validates required fields', async ({ page }) => {
    await page.click('button:has-text("New Loan")');
    await page.click('button:has-text("Create")');
    
    await expect(page.locator('text=Customer name is required')).toBeVisible();
    await expect(page.locator('text=Amount is required')).toBeVisible();
    await expect(page.locator('text=Interest rate is required')).toBeVisible();
    await expect(page.locator('text=Term is required')).toBeVisible();
  });

  test('displays error message on API failure', async ({ page }) => {
    await mockApiFailure(page);
    
    await page.click('button:has-text("New Loan")');
    await page.fill('input[name="customerName"]', 'John Doe');
    await page.fill('input[name="amount"]', '5000');
    await page.fill('input[name="interestRate"]', '5.5');
    await page.fill('input[name="termMonths"]', '12');
    await page.click('button:has-text("Create")');
    
    await expect(page.locator('text=Failed to create loan')).toBeVisible();
    
    await clearMockApiFailure(page);
  });
}); 