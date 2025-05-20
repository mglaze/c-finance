import { Page } from '@playwright/test';

export class LoanFormPage {
  private readonly page: Page;
  private readonly formType: 'create' | 'edit';

  constructor(page: Page, formType: 'create' | 'edit' = 'create') {
    this.page = page;
    this.formType = formType;
  }

  // Locators
  private get form() {
    return this.page.getByTestId(`loan-form-${this.formType}`);
  }

  private get accountNumberInput() {
    return this.page.getByTestId(`account-number-input-${this.formType}`);
  }

  private get amountInput() {
    return this.page.getByTestId(`amount-input-${this.formType}`);
  }

  private get interestRateInput() {
    return this.page.getByTestId(`interest-rate-input-${this.formType}`);
  }

  private get termInput() {
    return this.page.getByTestId(`term-input-${this.formType}`);
  }

  private get statusSelect() {
    return this.page.getByTestId(`status-select-${this.formType}`);
  }

  private get submitButton() {
    return this.page.getByTestId(`submit-button-${this.formType}`);
  }

  private get cancelButton() {
    return this.page.getByTestId(`cancel-button-${this.formType}`);
  }

  // Error message locators
  private accountNumberError = this.page.locator('[data-testid="account-number-error"]');
  private amountError = this.page.locator('[data-testid="amount-error"]');
  private interestRateError = this.page.locator('[data-testid="interest-rate-error"]');
  private termError = this.page.locator('[data-testid="term-error"]');
  private startDateError = this.page.locator('[data-testid="start-date-error"]');

  // Actions
  async navigate() {
    await this.page.goto('/new');
  }

  async navigateToEdit(accountNumber: string) {
    await this.page.goto(`/edit/${accountNumber}`);
  }

  async waitForLoad() {
    await this.form.waitFor();
  }

  async fillForm(data: {
    accountNumber: string;
    amount: number;
    interestRate: number;
    termInMonths: number;
    status: string;
  }) {
    await this.accountNumberInput.fill(data.accountNumber);
    await this.amountInput.fill(data.amount.toString());
    await this.interestRateInput.fill(data.interestRate.toString());
    await this.termInput.fill(data.termInMonths.toString());
    await this.statusSelect.selectOption(data.status);
  }

  async submit() {
    await this.submitButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  // Validation
  async isAccountNumberErrorVisible() {
    return await this.accountNumberError.isVisible();
  }

  async isAmountErrorVisible() {
    return await this.amountError.isVisible();
  }

  async isInterestRateErrorVisible() {
    return await this.interestRateError.isVisible();
  }

  async isTermErrorVisible() {
    return await this.termError.isVisible();
  }

  async isStartDateErrorVisible() {
    return await this.startDateError.isVisible();
  }

  async isFormVisible() {
    return await this.form.isVisible();
  }

  async getAccountNumberError() {
    return this.page.getByTestId('account-number-error').textContent();
  }

  async getAmountError() {
    return this.page.getByTestId('amount-error').textContent();
  }

  async getInterestRateError() {
    return this.page.getByTestId('interest-rate-error').textContent();
  }

  async getTermError() {
    return this.page.getByTestId('term-error').textContent();
  }
} 