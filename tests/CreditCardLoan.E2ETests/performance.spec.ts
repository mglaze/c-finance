import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads dashboard within 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000);
  });

  test('loads loan list within 2 seconds', async ({ page }) => {
    const startTime = Date.now();
    await page.click('text=Loans');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(2000);
  });

  test('creates loan within 1 second', async ({ page }) => {
    await page.click('button:has-text("New Loan")');
    
    const startTime = Date.now();
    await page.fill('input[name="customerName"]', 'John Doe');
    await page.fill('input[name="amount"]', '5000');
    await page.fill('input[name="interestRate"]', '5.5');
    await page.fill('input[name="termMonths"]', '12');
    await page.click('button:has-text("Create")');
    const createTime = Date.now() - startTime;
    
    expect(createTime).toBeLessThan(1000);
  });

  test('updates loan within 1 second', async ({ page }) => {
    await page.click('button:has-text("Edit")');
    
    const startTime = Date.now();
    await page.fill('input[name="amount"]', '6000');
    await page.click('button:has-text("Update")');
    const updateTime = Date.now() - startTime;
    
    expect(updateTime).toBeLessThan(1000);
  });

  test('deletes loan within 1 second', async ({ page }) => {
    const startTime = Date.now();
    await page.click('button:has-text("Delete")');
    await page.click('button:has-text("Confirm")');
    const deleteTime = Date.now() - startTime;
    
    expect(deleteTime).toBeLessThan(1000);
  });

  test('filters loans within 500ms', async ({ page }) => {
    const startTime = Date.now();
    await page.selectOption('select[name="statusFilter"]', 'Pending');
    const filterTime = Date.now() - startTime;
    
    expect(filterTime).toBeLessThan(500);
  });

  test('sorts loans within 500ms', async ({ page }) => {
    const startTime = Date.now();
    await page.click('th:has-text("Amount")');
    const sortTime = Date.now() - startTime;
    
    expect(sortTime).toBeLessThan(500);
  });

  test('updates statistics within 1 second', async ({ page }) => {
    await page.click('button:has-text("New Loan")');
    
    const startTime = Date.now();
    await page.fill('input[name="customerName"]', 'John Doe');
    await page.fill('input[name="amount"]', '5000');
    await page.fill('input[name="interestRate"]', '5.5');
    await page.fill('input[name="termMonths"]', '12');
    await page.click('button:has-text("Create")');
    
    // Wait for statistics to update
    await page.waitForSelector('.stat-card:has-text("Total Loans") .stat-value');
    const updateTime = Date.now() - startTime;
    
    expect(updateTime).toBeLessThan(1000);
  });

  test('handles large dataset efficiently', async ({ page }) => {
    // Create 100 loans
    for (let i = 0; i < 100; i++) {
      await page.click('button:has-text("New Loan")');
      await page.fill('input[name="customerName"]', `Customer ${i}`);
      await page.fill('input[name="amount"]', '5000');
      await page.fill('input[name="interestRate"]', '5.5');
      await page.fill('input[name="termMonths"]', '12');
      await page.click('button:has-text("Create")');
    }
    
    // Test pagination performance
    const startTime = Date.now();
    await page.click('button:has-text("Next")');
    const pageLoadTime = Date.now() - startTime;
    
    expect(pageLoadTime).toBeLessThan(1000);
  });
}); 