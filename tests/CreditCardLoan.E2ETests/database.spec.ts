import { test, expect } from './fixtures/test-fixture';

test.describe('Database Seeding', () => {
  test('verifies test data is seeded correctly', async ({ page }) => {
    // Navigate to the dashboard
    await page.goto('/');
    
    // Wait for the loan list to load and be visible
    const loanList = page.getByTestId('loan-list');
    await loanList.waitFor({ state: 'visible' });
    
    // Wait for the table to be populated
    await page.waitForSelector('table tbody tr');
    
    // Verify test loans are present
    const testLoans = ['TEST001', 'TEST002', 'TEST003'];
    for (const accountNumber of testLoans) {
      // Use the parent loan-list to scope the search
      const loanItem = loanList.getByTestId(`loan-item-${accountNumber}`);
      await expect(loanItem).toBeVisible({ timeout: 10000 });
    }
    
    // Verify loan stats
    const totalLoans = await page.getByTestId('stats-total-loans-value').textContent();
    expect(totalLoans).toBe('3');
    
    const activeLoans = await page.getByTestId('stats-active-loans-value').textContent();
    expect(activeLoans).toBe('$5,000.00');
    
    const totalAmount = await page.getByTestId('stats-total-amount-value').textContent();
    expect(totalAmount).toBe('$22,500.00');
  });
}); 