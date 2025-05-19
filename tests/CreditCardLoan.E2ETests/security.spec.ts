import { test, expect } from '@playwright/test';

test.describe('Security', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('prevents XSS in loan form', async ({ page }) => {
    await page.click('button:has-text("New Loan")');
    
    const xssPayload = '<script>alert("XSS")</script>';
    await page.fill('input[name="customerName"]', xssPayload);
    await page.fill('input[name="amount"]', '5000');
    await page.fill('input[name="interestRate"]', '5.5');
    await page.fill('input[name="termMonths"]', '12');
    await page.click('button:has-text("Create")');
    
    const customerName = await page.locator('td:has-text("' + xssPayload + '")').textContent();
    expect(customerName).toBe(xssPayload);
    expect(customerName).not.toContain('<script>');
  });

  test('prevents SQL injection in search', async ({ page }) => {
    const sqlInjectionPayload = "' OR '1'='1";
    await page.fill('input[name="search"]', sqlInjectionPayload);
    await page.keyboard.press('Enter');
    
    const searchResults = await page.locator('td').allTextContents();
    expect(searchResults).not.toContain(sqlInjectionPayload);
  });

  test('enforces CSRF protection', async ({ page }) => {
    const response = await page.request.post('/api/loans', {
      data: {
        customerName: 'John Doe',
        amount: 5000,
        interestRate: 5.5,
        termMonths: 12
      }
    });
    
    expect(response.status()).toBe(403);
  });

  test('enforces content security policy', async ({ page }) => {
    const response = await page.goto('/');
    const headers = response?.headers();
    
    expect(headers?.['content-security-policy']).toBeTruthy();
    expect(headers?.['content-security-policy']).toContain("default-src 'self'");
    expect(headers?.['content-security-policy']).toContain("script-src 'self'");
    expect(headers?.['content-security-policy']).toContain("style-src 'self'");
  });

  test('enforces secure headers', async ({ page }) => {
    const response = await page.goto('/');
    const headers = response?.headers();
    
    expect(headers?.['x-frame-options']).toBe('DENY');
    expect(headers?.['x-content-type-options']).toBe('nosniff');
    expect(headers?.['x-xss-protection']).toBe('1; mode=block');
    expect(headers?.['strict-transport-security']).toContain('max-age=');
  });

  test('prevents clickjacking', async ({ page }) => {
    const response = await page.goto('/');
    const headers = response?.headers();
    
    expect(headers?.['x-frame-options']).toBe('DENY');
  });

  test('enforces password complexity', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'weak');
    await page.click('button:has-text("Login")');
    
    await expect(page.locator('text=Password must be at least 8 characters long')).toBeVisible();
    await expect(page.locator('text=Password must contain at least one uppercase letter')).toBeVisible();
    await expect(page.locator('text=Password must contain at least one number')).toBeVisible();
    await expect(page.locator('text=Password must contain at least one special character')).toBeVisible();
  });

  test('enforces rate limiting', async ({ page }) => {
    const responses = await Promise.all(
      Array(100).fill(null).map(() => 
        page.request.post('/api/auth/login', {
          data: {
            email: 'user@example.com',
            password: 'password123'
          }
        })
      )
    );
    
    const tooManyRequests = responses.some(r => r.status() === 429);
    expect(tooManyRequests).toBeTruthy();
  });

  test('enforces session timeout', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button:has-text("Login")');
    
    // Wait for session timeout (e.g., 30 minutes)
    await page.waitForTimeout(30 * 60 * 1000);
    
    await page.reload();
    await expect(page).toHaveURL('/login');
  });
}); 