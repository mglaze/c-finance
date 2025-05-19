import { test, expect } from '@playwright/test';

test.describe('State Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('maintains loan form state during navigation', async ({ page }) => {
    await page.click('button:has-text("New Loan")');
    await page.fill('input[name="customerName"]', 'John Doe');
    await page.fill('input[name="amount"]', '5000');
    await page.fill('input[name="interestRate"]', '5.5');
    await page.fill('input[name="termMonths"]', '12');
    
    // Navigate away
    await page.click('text=Loans');
    await page.click('text=Dashboard');
    
    // Open form again
    await page.click('button:has-text("New Loan")');
    
    // Verify form state is cleared
    await expect(page.locator('input[name="customerName"]')).toHaveValue('');
    await expect(page.locator('input[name="amount"]')).toHaveValue('');
    await expect(page.locator('input[name="interestRate"]')).toHaveValue('');
    await expect(page.locator('input[name="termMonths"]')).toHaveValue('');
  });

  test('maintains filter state during navigation', async ({ page }) => {
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
    
    // Navigate away and back
    await page.click('text=Loans');
    await page.click('text=Dashboard');
    
    // Verify filter state is maintained
    await expect(page.locator('select[name="statusFilter"]')).toHaveValue('Active');
    await expect(page.locator('text=Jane Doe')).toBeVisible();
    await expect(page.locator('text=John Doe')).not.toBeVisible();
  });

  test('maintains sort state during navigation', async ({ page }) => {
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
    
    // Navigate away and back
    await page.click('text=Loans');
    await page.click('text=Dashboard');
    
    // Verify sort state is maintained
    const amounts = await page.locator('td:nth-child(3)').allTextContents();
    expect(amounts).toEqual(['$5,000.00', '$6,000.00']);
  });

  test('maintains pagination state during navigation', async ({ page }) => {
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
    
    // Navigate away and back
    await page.click('text=Loans');
    await page.click('text=Dashboard');
    
    // Verify pagination state is maintained
    await expect(page.locator('text=Customer 10')).toBeVisible();
  });

  test('maintains selected loan during navigation', async ({ page }) => {
    // Create a loan
    await page.click('button:has-text("New Loan")');
    await page.fill('input[name="customerName"]', 'John Doe');
    await page.fill('input[name="amount"]', '5000');
    await page.fill('input[name="interestRate"]', '5.5');
    await page.fill('input[name="termMonths"]', '12');
    await page.click('button:has-text("Create")');
    
    // Select the loan
    await page.click('tr:has-text("John Doe")');
    
    // Navigate away and back
    await page.click('text=Loans');
    await page.click('text=Dashboard');
    
    // Verify selected loan is maintained
    await expect(page.locator('tr:has-text("John Doe")')).toHaveClass(/selected/);
  });

  test('maintains error state during navigation', async ({ page }) => {
    // Try to create a loan with invalid data
    await page.click('button:has-text("New Loan")');
    await page.click('button:has-text("Create")');
    
    // Verify error messages
    await expect(page.locator('text=Customer name is required')).toBeVisible();
    
    // Navigate away and back
    await page.click('text=Loans');
    await page.click('text=Dashboard');
    
    // Verify error state is cleared
    await expect(page.locator('text=Customer name is required')).not.toBeVisible();
  });

  test('maintains loading state during navigation', async ({ page }) => {
    // Start creating a loan
    await page.click('button:has-text("New Loan")');
    await page.fill('input[name="customerName"]', 'John Doe');
    await page.fill('input[name="amount"]', '5000');
    await page.fill('input[name="interestRate"]', '5.5');
    await page.fill('input[name="termMonths"]', '12');
    await page.click('button:has-text("Create")');
    
    // Verify loading state
    await expect(page.locator('button:has-text("Create")')).toBeDisabled();
    
    // Navigate away and back
    await page.click('text=Loans');
    await page.click('text=Dashboard');
    
    // Verify loading state is cleared
    await expect(page.locator('button:has-text("Create")')).not.toBeDisabled();
  });
}); 