import { test, expect } from '@playwright/test';
import { mockApiFailure, clearMockApiFailure } from './utils/api-mock';
import { DatabaseSeeder } from './utils/database-seeder';
import { LoanFormPage } from './pages/LoanFormPage';
import { DashboardPage } from './pages/DashboardPage';

test.describe('Loan Form', () => {
  let loanFormPage: LoanFormPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loanFormPage = new LoanFormPage(page, 'create');
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    await dashboardPage.clickNewLoan();
    await loanFormPage.waitForLoad();
  });

  test('validates form inputs', async () => {
    // Test amount validation
    await loanFormPage.fillForm({
      accountNumber: 'TEST001',
      amount: -1000,
      interestRate: 5,
      termInMonths: 12,
      status: 'Active'
    });
    await loanFormPage.submit();
    expect(await loanFormPage.getAmountError()).toBe('Amount must be greater than 0');

    // Test interest rate validation
    await loanFormPage.fillForm({
      accountNumber: 'TEST001',
      amount: 1000,
      interestRate: 101,
      termInMonths: 12,
      status: 'Active'
    });
    await loanFormPage.submit();
    expect(await loanFormPage.getInterestRateError()).toBe('Interest rate must be between 0 and 100');

    // Test term validation
    await loanFormPage.fillForm({
      accountNumber: 'TEST001',
      amount: 1000,
      interestRate: 5,
      termInMonths: 0,
      status: 'Active'
    });
    await loanFormPage.submit();
    expect(await loanFormPage.getTermError()).toBe('Term must be between 1 and 360 months');
  });

  test('handles API errors', async () => {
    await mockApiFailure('POST', '/api/loans');
    
    await loanFormPage.fillForm({
      accountNumber: 'TEST001',
      amount: 1000,
      interestRate: 5,
      termInMonths: 12,
      status: 'Active'
    });
    await loanFormPage.submit();
    
    await expect(page.getByText('Failed to save loan')).toBeVisible();
    await clearMockApiFailure();
  });

  test('closes form on cancel', async () => {
    await loanFormPage.cancel();
    await expect(loanFormPage.form).not.toBeVisible();
  });

  test('creates a new loan', async () => {
    await loanFormPage.fillForm({
      accountNumber: 'TEST001',
      amount: 1000,
      interestRate: 5,
      termInMonths: 12,
      status: 'Active'
    });
    await loanFormPage.submit();
    
    await expect(loanFormPage.form).not.toBeVisible();
    await expect(dashboardPage.getLoanItem('TEST001')).toBeVisible();
  });

  test('edits an existing loan', async () => {
    // First create a loan
    await loanFormPage.fillForm({
      accountNumber: 'TEST001',
      amount: 1000,
      interestRate: 5,
      termInMonths: 12,
      status: 'Active'
    });
    await loanFormPage.submit();

    // Then edit it
    await dashboardPage.clickEditLoan('TEST001');
    const editFormPage = new LoanFormPage(page, 'edit');
    await editFormPage.waitForLoad();
    
    await editFormPage.fillForm({
      accountNumber: 'TEST001',
      amount: 2000,
      interestRate: 5,
      termInMonths: 12,
      status: 'Active'
    });
    await editFormPage.submit();

    // Verify the loan was updated
    const loanItem = await dashboardPage.getLoanItem('TEST001');
    await expect(loanItem.getByTestId('amount')).toHaveText('$2,000.00');
  });
}); 