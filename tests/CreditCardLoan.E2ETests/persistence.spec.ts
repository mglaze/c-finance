import { test, expect } from '@playwright/test';

test.describe('Data Persistence', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('persists loan data after page reload', async ({ page }) => {
    // Create a loan
    await page.click('button:has-text("New Loan")');
    await page.fill('input[name="customerName"]', 'John Doe');
    await page.fill('input[name="amount"]', '5000');
    await page.fill('input[name="interestRate"]', '5.5');
    await page.fill('input[name="termMonths"]', '12');
    await page.click('button:has-text("Create")');
    
    // Verify loan is created
    await expect(page.locator('text=John Doe')).toBeVisible();
    
    // Reload the page
    await page.reload();
    
    // Verify loan still exists
    await expect(page.locator('text=John Doe')).toBeVisible();
    await expect(page.locator('text=$5,000.00')).toBeVisible();
    await expect(page.locator('text=5.5%')).toBeVisible();
    await expect(page.locator('text=12 months')).toBeVisible();
  });

  test('persists loan updates after page reload', async ({ page }) => {
    // Create a loan
    await page.click('button:has-text("New Loan")');
    await page.fill('input[name="customerName"]', 'John Doe');
    await page.fill('input[name="amount"]', '5000');
    await page.fill('input[name="interestRate"]', '5.5');
    await page.fill('input[name="termMonths"]', '12');
    await page.click('button:has-text("Create")');
    
    // Update the loan
    await page.click('button:has-text("Edit")');
    await page.fill('input[name="amount"]', '6000');
    await page.fill('input[name="interestRate"]', '6.0');
    await page.click('button:has-text("Update")');
    
    // Verify updates
    await expect(page.locator('text=$6,000.00')).toBeVisible();
    await expect(page.locator('text=6.0%')).toBeVisible();
    
    // Reload the page
    await page.reload();
    
    // Verify updates persist
    await expect(page.locator('text=$6,000.00')).toBeVisible();
    await expect(page.locator('text=6.0%')).toBeVisible();
  });

  test('persists loan deletion after page reload', async ({ page }) => {
    // Create a loan
    await page.click('button:has-text("New Loan")');
    await page.fill('input[name="customerName"]', 'John Doe');
    await page.fill('input[name="amount"]', '5000');
    await page.fill('input[name="interestRate"]', '5.5');
    await page.fill('input[name="termMonths"]', '12');
    await page.click('button:has-text("Create")');
    
    // Get initial count
    const initialCount = await page.locator('tr').count();
    
    // Delete the loan
    await page.click('button:has-text("Delete")');
    await page.click('button:has-text("Confirm")');
    
    // Verify deletion
    await expect(page.locator('tr')).toHaveCount(initialCount - 1);
    
    // Reload the page
    await page.reload();
    
    // Verify deletion persists
    await expect(page.locator('tr')).toHaveCount(initialCount - 1);
  });

  test('persists filter state after page reload', async ({ page }) => {
    // Create multiple loans with different statuses
    await page.click('button:has-text("New Loan")');
    await page.fill('input[name="customerName"]', 'John Doe');
    await page.fill('input[name="amount"]', '5000');
    await page.fill('input[name="interestRate"]', '5.5');
    await page.fill('input[name="termMonths"]', '12');
    await page.click('button:has-text("Create")');
    
    await page.click('button:has-text("New Loan")');
    await page.fill('input[name="customerName"]', 'Jane Doe');
    await page.fill('input[name="amount"]', '6000');
    await page.fill('input[name="interestRate"]', '6.0');
    await page.fill('input[name="termMonths"]', '24');
    await page.selectOption('select[name="status"]', 'Active');
    await page.click('button:has-text("Create")');
    
    // Apply filter
    await page.selectOption('select[name="statusFilter"]', 'Active');
    
    // Verify filter
    await expect(page.locator('text=Jane Doe')).toBeVisible();
    await expect(page.locator('text=John Doe')).not.toBeVisible();
    
    // Reload the page
    await page.reload();
    
    // Verify filter persists
    await expect(page.locator('text=Jane Doe')).toBeVisible();
    await expect(page.locator('text=John Doe')).not.toBeVisible();
  });

  test('persists sort state after page reload', async ({ page }) => {
    // Create multiple loans with different amounts
    await page.click('button:has-text("New Loan")');
    await page.fill('input[name="customerName"]', 'John Doe');
    await page.fill('input[name="amount"]', '5000');
    await page.fill('input[name="interestRate"]', '5.5');
    await page.fill('input[name="termMonths"]', '12');
    await page.click('button:has-text("Create")');
    
    await page.click('button:has-text("New Loan")');
    await page.fill('input[name="customerName"]', 'Jane Doe');
    await page.fill('input[name="amount"]', '6000');
    await page.fill('input[name="interestRate"]', '6.0');
    await page.fill('input[name="termMonths"]', '24');
    await page.click('button:has-text("Create")');
    
    // Sort by amount
    await page.click('th:has-text("Amount")');
    
    // Verify sort
    const amounts = await page.locator('td:nth-child(3)').allTextContents();
    expect(amounts).toEqual(['$5,000.00', '$6,000.00']);
    
    // Reload the page
    await page.reload();
    
    // Verify sort persists
    const amountsAfterReload = await page.locator('td:nth-child(3)').allTextContents();
    expect(amountsAfterReload).toEqual(['$5,000.00', '$6,000.00']);
  });

  test('persists pagination state after page reload', async ({ page }) => {
    // Create multiple loans
    for (let i = 0; i < 25; i++) {
      await page.click('button:has-text("New Loan")');
      await page.fill('input[name="customerName"]', `Customer ${i}`);
      await page.fill('input[name="amount"]', '5000');
      await page.fill('input[name="interestRate"]', '5.5');
      await page.fill('input[name="termMonths"]', '12');
      await page.click('button:has-text("Create")');
    }
    
    // Go to second page
    await page.click('button:has-text("Next")');
    
    // Verify pagination
    await expect(page.locator('text=Customer 10')).toBeVisible();
    
    // Reload the page
    await page.reload();
    
    // Verify pagination persists
    await expect(page.locator('text=Customer 10')).toBeVisible();
  });
}); 