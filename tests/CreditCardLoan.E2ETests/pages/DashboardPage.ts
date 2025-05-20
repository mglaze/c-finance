import { Page } from '@playwright/test';

export class DashboardPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Locators
  private get loanStats() {
    return this.page.getByTestId('loan-stats');
  }

  private get totalLoans() {
    return this.page.getByTestId('stats-total-loans-value');
  }

  private get activeLoans() {
    return this.page.getByTestId('stats-active-loans-value');
  }

  private get totalAmount() {
    return this.page.getByTestId('stats-total-amount-value');
  }

  private get loanList() {
    return this.page.getByTestId('loan-list');
  }

  private get newLoanButton() {
    return this.page.getByRole('button', { name: 'New Loan' });
  }

  // Actions
  async navigate() {
    await this.page.goto('/');
    await this.waitForLoad();
  }

  async waitForLoad() {
    await this.loanStats.waitFor();
    await this.loanList.waitFor();
  }

  async clickNewLoan() {
    await this.newLoanButton.click();
  }

  async clickEditLoan(accountNumber: string) {
    const loanItem = await this.getLoanItem(accountNumber);
    await loanItem.getByTestId('edit-button').click();
  }

  async clickDeleteLoan(accountNumber: string) {
    const loanItem = await this.getLoanItem(accountNumber);
    await loanItem.getByTestId('delete-button').click();
  }

  async getLoanItem(accountNumber: string) {
    return this.page.getByTestId(`loan-item-${accountNumber}`);
  }

  // Stats
  async getTotalLoans() {
    return await this.totalLoans.textContent();
  }

  async getActiveLoans() {
    return await this.activeLoans.textContent();
  }

  async getTotalAmount() {
    return await this.totalAmount.textContent();
  }

  async getLoanItemsCount() {
    return await this.page.getByTestId(/^loan-item-/).count();
  }

  async filterByStatus(status: string) {
    await this.page.getByRole('combobox', { name: 'Status' }).selectOption(status);
  }

  async confirmDelete() {
    await this.page.getByRole('button', { name: 'Confirm' }).click();
  }
} 