import { Page, expect } from '@playwright/test';

export const mockLoan = {
  id: 1,
  customerName: 'John Doe',
  amount: 5000,
  interestRate: 5.5,
  termMonths: 12,
  status: 'Pending',
  createdAt: new Date().toISOString()
};

export async function createTestLoan(page: Page) {
  await page.click('button:has-text("New Loan")');
  await page.fill('input[name="customerName"]', mockLoan.customerName);
  await page.fill('input[name="amount"]', mockLoan.amount.toString());
  await page.fill('input[name="interestRate"]', mockLoan.interestRate.toString());
  await page.fill('input[name="termMonths"]', mockLoan.termMonths.toString());
  await page.click('button:has-text("Create")');
  await expect(page.locator(`text=${mockLoan.customerName}`)).toBeVisible();
}

export async function deleteTestLoan(page: Page) {
  const loanCount = await page.locator('tr').count();
  await page.click('button:has-text("Delete")');
  await page.click('button:has-text("Confirm")');
  await expect(page.locator('tr')).toHaveCount(loanCount - 1);
}

export async function mockApiFailure(page: Page) {
  await page.route('**/api/loans', async (route) => {
    await route.fulfill({
      status: 500,
      body: JSON.stringify({ message: 'Internal server error' })
    });
  });
}

export async function clearMockApiFailure(page: Page) {
  await page.unroute('**/api/loans');
} 