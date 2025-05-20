import { test, expect } from './fixtures/test-fixture';
import { DashboardPage } from './pages/DashboardPage';

test.describe('Loan Stats', () => {
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    // Seed test data before each test
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.waitForLoad();
  });

  test('displays total number of loans', async () => {
    const totalLoans = await dashboardPage.getTotalLoans();
    expect(totalLoans).toContain('2'); // We seeded 2 test loans
  });

  test('displays active loans count', async () => {
    const activeLoans = await dashboardPage.getActiveLoans();
    expect(activeLoans).toContain('1'); // One of our test loans is active
  });

  test('displays total loan amount', async () => {
    const totalAmount = await dashboardPage.getTotalAmount();
    expect(totalAmount).toContain('$15,000.00'); // Sum of our test loans
  });

  test('updates stats when loan is deleted', async () => {
    // Get initial stats
    const initialTotalLoans = await dashboardPage.getTotalLoans();
    const initialTotalAmount = await dashboardPage.getTotalAmount();

    // Delete a loan
    await dashboardPage.deleteLoan('TEST001');

    // Wait for stats to update
    await dashboardPage.waitForLoad();

    // Verify updated stats
    const updatedTotalLoans = await dashboardPage.getTotalLoans();
    const updatedTotalAmount = await dashboardPage.getTotalAmount();

    expect(updatedTotalLoans).not.toBe(initialTotalLoans);
    expect(updatedTotalAmount).not.toBe(initialTotalAmount);
  });
}); 