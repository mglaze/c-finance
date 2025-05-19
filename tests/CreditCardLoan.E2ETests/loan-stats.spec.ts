import { test, expect } from '@playwright/test';
import { createTestLoan, mockApiFailure, clearMockApiFailure } from './test-helpers';

test.describe('Loan Statistics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays correct total loans count', async ({ page }) => {
    await createTestLoan(page);
    
    const totalLoans = await page.locator('.stat-card:has-text("Total Loans") .stat-value').textContent();
    expect(totalLoans).toBe('1');
  });

  test('displays correct total amount', async ({ page }) => {
    await createTestLoan(page);
    
    const totalAmount = await page.locator('.stat-card:has-text("Total Amount") .stat-value').textContent();
    expect(totalAmount).toBe('$5,000.00');
  });

  test('displays correct average interest rate', async ({ page }) => {
    await createTestLoan(page);
    
    await page.click('button:has-text("New Loan")');
    await page.fill('input[name="customerName"]', 'Jane Doe');
    await page.fill('input[name="amount"]', '6000');
    await page.fill('input[name="interestRate"]', '6.0');
    await page.fill('input[name="termMonths"]', '24');
    await page.click('button:has-text("Create")');
    
    const avgRate = await page.locator('.stat-card:has-text("Average Interest Rate") .stat-value').textContent();
    expect(avgRate).toBe('5.75%');
  });

  test('updates statistics when loan status changes', async ({ page }) => {
    await createTestLoan(page);
    
    await page.click('button:has-text("Edit")');
    await page.selectOption('select[name="status"]', 'Active');
    await page.click('button:has-text("Update")');
    
    const activeLoans = await page.locator('.stat-card:has-text("Active Loans") .stat-value').textContent();
    expect(activeLoans).toBe('1');
    
    const pendingLoans = await page.locator('.stat-card:has-text("Pending Loans") .stat-value').textContent();
    expect(pendingLoans).toBe('0');
  });

  test('handles API error when loading statistics', async ({ page }) => {
    await mockApiFailure(page);
    await page.reload();
    
    await expect(page.locator('text=Failed to load statistics')).toBeVisible();
    
    await clearMockApiFailure(page);
  });
}); 