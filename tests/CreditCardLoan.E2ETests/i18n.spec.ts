import { test, expect } from '@playwright/test';

test.describe('Internationalization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays content in English by default', async ({ page }) => {
    await expect(page.locator('text=Welcome to Credit Card Loan Dashboard')).toBeVisible();
    await expect(page.locator('text=Total Loans')).toBeVisible();
    await expect(page.locator('text=Active Loans')).toBeVisible();
    await expect(page.locator('text=Pending Loans')).toBeVisible();
    await expect(page.locator('text=Total Amount')).toBeVisible();
    await expect(page.locator('text=Average Interest Rate')).toBeVisible();
  });

  test('switches to Spanish', async ({ page }) => {
    await page.click('button:has-text("Language")');
    await page.click('text=Español');
    
    await expect(page.locator('text=Bienvenido al Panel de Control de Préstamos')).toBeVisible();
    await expect(page.locator('text=Total de Préstamos')).toBeVisible();
    await expect(page.locator('text=Préstamos Activos')).toBeVisible();
    await expect(page.locator('text=Préstamos Pendientes')).toBeVisible();
    await expect(page.locator('text=Monto Total')).toBeVisible();
    await expect(page.locator('text=Tasa de Interés Promedio')).toBeVisible();
  });

  test('switches to French', async ({ page }) => {
    await page.click('button:has-text("Language")');
    await page.click('text=Français');
    
    await expect(page.locator('text=Bienvenue sur le Tableau de Bord des Prêts')).toBeVisible();
    await expect(page.locator('text=Total des Prêts')).toBeVisible();
    await expect(page.locator('text=Prêts Actifs')).toBeVisible();
    await expect(page.locator('text=Prêts en Attente')).toBeVisible();
    await expect(page.locator('text=Montant Total')).toBeVisible();
    await expect(page.locator('text=Taux d\'Intérêt Moyen')).toBeVisible();
  });

  test('formats currency according to locale', async ({ page }) => {
    await page.click('button:has-text("New Loan")');
    await page.fill('input[name="customerName"]', 'John Doe');
    await page.fill('input[name="amount"]', '5000');
    await page.fill('input[name="interestRate"]', '5.5');
    await page.fill('input[name="termMonths"]', '12');
    await page.click('button:has-text("Create")');
    
    // English (USD)
    await expect(page.locator('text=$5,000.00')).toBeVisible();
    
    // Spanish (EUR)
    await page.click('button:has-text("Language")');
    await page.click('text=Español');
    await expect(page.locator('text=5.000,00 €')).toBeVisible();
    
    // French (EUR)
    await page.click('button:has-text("Language")');
    await page.click('text=Français');
    await expect(page.locator('text=5 000,00 €')).toBeVisible();
  });

  test('formats dates according to locale', async ({ page }) => {
    await page.click('button:has-text("New Loan")');
    await page.fill('input[name="customerName"]', 'John Doe');
    await page.fill('input[name="amount"]', '5000');
    await page.fill('input[name="interestRate"]', '5.5');
    await page.fill('input[name="termMonths"]', '12');
    await page.click('button:has-text("Create")');
    
    // English
    await expect(page.locator('text=01/01/2024')).toBeVisible();
    
    // Spanish
    await page.click('button:has-text("Language")');
    await page.click('text=Español');
    await expect(page.locator('text=01/01/2024')).toBeVisible();
    
    // French
    await page.click('button:has-text("Language")');
    await page.click('text=Français');
    await expect(page.locator('text=01/01/2024')).toBeVisible();
  });

  test('formats numbers according to locale', async ({ page }) => {
    await page.click('button:has-text("New Loan")');
    await page.fill('input[name="customerName"]', 'John Doe');
    await page.fill('input[name="amount"]', '5000');
    await page.fill('input[name="interestRate"]', '5.5');
    await page.fill('input[name="termMonths"]', '12');
    await page.click('button:has-text("Create")');
    
    // English
    await expect(page.locator('text=5.5%')).toBeVisible();
    
    // Spanish
    await page.click('button:has-text("Language")');
    await page.click('text=Español');
    await expect(page.locator('text=5,5%')).toBeVisible();
    
    // French
    await page.click('button:has-text("Language")');
    await page.click('text=Français');
    await expect(page.locator('text=5,5 %')).toBeVisible();
  });

  test('persists language preference', async ({ page }) => {
    await page.click('button:has-text("Language")');
    await page.click('text=Español');
    
    await page.reload();
    await expect(page.locator('text=Bienvenido al Panel de Control de Préstamos')).toBeVisible();
  });

  test('handles RTL languages', async ({ page }) => {
    await page.click('button:has-text("Language")');
    await page.click('text=العربية');
    
    const body = page.locator('body');
    await expect(body).toHaveAttribute('dir', 'rtl');
    await expect(body).toHaveCSS('text-align', 'right');
  });
}); 