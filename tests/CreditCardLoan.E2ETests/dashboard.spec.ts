import { test, expect } from './fixtures/test-fixture';
import { DashboardPage } from './pages/DashboardPage';

test.describe('Dashboard', () => {
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    // Seed test data before each test

    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.waitForLoad();
  });

  test('displays loan statistics', async () => {
    const totalLoans = await dashboardPage.getTotalLoans();
    const activeLoans = await dashboardPage.getActiveLoans();
    const totalAmount = await dashboardPage.getTotalAmount();

    expect(totalLoans).toBeTruthy();
    expect(activeLoans).toBeTruthy();
    expect(totalAmount).toBeTruthy();
  });

  test('displays loan list', async () => {
    const loanItemsCount = await dashboardPage.getLoanItemsCount();
    expect(loanItemsCount).toBeGreaterThan(0);
  });

  test('navigates to loan form', async ({ page }) => {
    await dashboardPage.clickNewLoan();
    await expect(page.locator('[data-testid="loan-form"]')).toBeVisible();
    expect(page.url()).toContain('/new');
  });
}); 