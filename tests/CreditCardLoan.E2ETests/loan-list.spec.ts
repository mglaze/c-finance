import { test, expect } from './fixtures/test-fixture';
import { createTestLoan, deleteTestLoan, mockApiFailure, clearMockApiFailure } from './test-helpers';
import { DashboardPage } from './pages/DashboardPage';

test.describe('Loan List', () => {
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    // Seed test data before each test
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.waitForLoad();
  });

  test('displays loan details correctly', async ({ page }) => {
    await createTestLoan(page);

    await expect(page.locator('text=John Doe')).toBeVisible();
    await expect(page.locator('text=$5,000.00')).toBeVisible();
    await expect(page.locator('text=5.5%')).toBeVisible();
    await expect(page.locator('text=12 months')).toBeVisible();
    await expect(page.locator('text=Pending')).toBeVisible();
  });

  test('sorts loans by amount', async ({ page }) => {
    await createTestLoan(page);
    
    await page.click('button:has-text("New Loan")');
    await page.fill('input[name="customerName"]', 'Jane Doe');
    await page.fill('input[name="amount"]', '6000');
    await page.fill('input[name="interestRate"]', '6.0');
    await page.fill('input[name="termMonths"]', '24');
    await page.click('button:has-text("Create")');

    await page.click('th:has-text("Amount")');
    
    const amounts = await page.locator('td:nth-child(3)').allTextContents();
    expect(amounts).toEqual(['$5,000.00', '$6,000.00']);
  });

  test('filters loans by status', async () => {
    await dashboardPage.filterByStatus('active');
    const activeLoansCount = await dashboardPage.getActiveLoansCount();
    const totalLoansCount = await dashboardPage.getLoanItemsCount();
    expect(activeLoansCount).toBe(totalLoansCount);
  });

  test('handles API error when loading loans', async ({ page }) => {
    await mockApiFailure(page);
    await page.reload();
    await expect(page.locator('text=Failed to load loans')).toBeVisible();
    await clearMockApiFailure(page);
  });

  test('confirms before deleting loan', async ({ page }) => {
    await createTestLoan(page);
    await page.click('button:has-text("Delete")');
    await expect(page.locator('text=Are you sure you want to delete this loan?')).toBeVisible();
    await page.click('button:has-text("Cancel")');
    await expect(page.locator('text=John Doe')).toBeVisible();
  });

  test('deletes a loan', async () => {
    await dashboardPage.deleteLoan('TEST001');
    expect(await dashboardPage.isLoanVisible('TEST001')).toBeFalsy();
  });
}); 