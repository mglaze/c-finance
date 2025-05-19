import { test, expect } from '@playwright/test';
import { mockApiFailure, clearMockApiFailure } from './test-helpers';

test.describe('Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays 404 page for non-existent route', async ({ page }) => {
    await page.goto('/non-existent-page');
    await expect(page.locator('text=Page Not Found')).toBeVisible();
    await expect(page.locator('text=The page you are looking for does not exist.')).toBeVisible();
    await expect(page.locator('a:has-text("Go to Dashboard")')).toBeVisible();
  });

  test('displays 500 page for server error', async ({ page }) => {
    await mockApiFailure(page);
    await page.reload();
    
    await expect(page.locator('text=Internal Server Error')).toBeVisible();
    await expect(page.locator('text=Something went wrong. Please try again later.')).toBeVisible();
    await expect(page.locator('button:has-text("Retry")')).toBeVisible();
    
    await clearMockApiFailure(page);
  });

  test('handles network error', async ({ page }) => {
    await page.route('**/api/**', async (route) => {
      await route.abort('failed');
    });

    await page.reload();
    
    await expect(page.locator('text=Network Error')).toBeVisible();
    await expect(page.locator('text=Please check your internet connection.')).toBeVisible();
    await expect(page.locator('button:has-text("Retry")')).toBeVisible();
  });

  test('handles API timeout', async ({ page }) => {
    await page.route('**/api/**', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 10000));
      await route.continue();
    });

    await page.reload();
    
    await expect(page.locator('text=Request Timeout')).toBeVisible();
    await expect(page.locator('text=The request took too long to complete.')).toBeVisible();
    await expect(page.locator('button:has-text("Retry")')).toBeVisible();
  });

  test('retries failed request', async ({ page }) => {
    let attemptCount = 0;
    await page.route('**/api/**', async (route) => {
      attemptCount++;
      if (attemptCount === 1) {
        await route.fulfill({
          status: 500,
          body: JSON.stringify({ message: 'Internal server error' })
        });
      } else {
        await route.continue();
      }
    });

    await page.reload();
    await expect(page.locator('text=Internal Server Error')).toBeVisible();
    
    await page.click('button:has-text("Retry")');
    await expect(page.locator('text=Welcome to Credit Card Loan Dashboard')).toBeVisible();
  });

  test('handles validation errors', async ({ page }) => {
    await page.route('**/api/loans', async (route) => {
      await route.fulfill({
        status: 400,
        body: JSON.stringify({
          errors: {
            amount: ['Amount must be greater than 0'],
            interestRate: ['Interest rate must be between 0 and 100']
          }
        })
      });
    });

    await page.click('button:has-text("New Loan")');
    await page.fill('input[name="customerName"]', 'John Doe');
    await page.fill('input[name="amount"]', '-1000');
    await page.fill('input[name="interestRate"]', '101');
    await page.fill('input[name="termMonths"]', '12');
    await page.click('button:has-text("Create")');
    
    await expect(page.locator('text=Amount must be greater than 0')).toBeVisible();
    await expect(page.locator('text=Interest rate must be between 0 and 100')).toBeVisible();
  });
}); 