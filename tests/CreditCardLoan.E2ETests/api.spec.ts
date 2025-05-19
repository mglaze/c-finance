import { test, expect } from '@playwright/test';

test.describe('API Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('fetches loans successfully', async ({ page }) => {
    const response = await page.request.get('/api/loans');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data[0]).toHaveProperty('id');
    expect(data[0]).toHaveProperty('customerName');
    expect(data[0]).toHaveProperty('amount');
    expect(data[0]).toHaveProperty('interestRate');
    expect(data[0]).toHaveProperty('termMonths');
    expect(data[0]).toHaveProperty('status');
    expect(data[0]).toHaveProperty('createdAt');
  });

  test('creates loan successfully', async ({ page }) => {
    const loanData = {
      customerName: 'John Doe',
      amount: 5000,
      interestRate: 5.5,
      termMonths: 12,
      status: 'Pending'
    };
    
    const response = await page.request.post('/api/loans', {
      data: loanData
    });
    
    expect(response.status()).toBe(201);
    
    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(data.customerName).toBe(loanData.customerName);
    expect(data.amount).toBe(loanData.amount);
    expect(data.interestRate).toBe(loanData.interestRate);
    expect(data.termMonths).toBe(loanData.termMonths);
    expect(data.status).toBe(loanData.status);
  });

  test('updates loan successfully', async ({ page }) => {
    // First create a loan
    const createResponse = await page.request.post('/api/loans', {
      data: {
        customerName: 'John Doe',
        amount: 5000,
        interestRate: 5.5,
        termMonths: 12,
        status: 'Pending'
      }
    });
    
    const loan = await createResponse.json();
    
    // Then update it
    const updateData = {
      amount: 6000,
      interestRate: 6.0,
      status: 'Active'
    };
    
    const updateResponse = await page.request.put(`/api/loans/${loan.id}`, {
      data: updateData
    });
    
    expect(updateResponse.status()).toBe(200);
    
    const updatedLoan = await updateResponse.json();
    expect(updatedLoan.amount).toBe(updateData.amount);
    expect(updatedLoan.interestRate).toBe(updateData.interestRate);
    expect(updatedLoan.status).toBe(updateData.status);
  });

  test('deletes loan successfully', async ({ page }) => {
    // First create a loan
    const createResponse = await page.request.post('/api/loans', {
      data: {
        customerName: 'John Doe',
        amount: 5000,
        interestRate: 5.5,
        termMonths: 12,
        status: 'Pending'
      }
    });
    
    const loan = await createResponse.json();
    
    // Then delete it
    const deleteResponse = await page.request.delete(`/api/loans/${loan.id}`);
    expect(deleteResponse.status()).toBe(204);
    
    // Verify it's deleted
    const getResponse = await page.request.get(`/api/loans/${loan.id}`);
    expect(getResponse.status()).toBe(404);
  });

  test('fetches loan statistics successfully', async ({ page }) => {
    const response = await page.request.get('/api/loans/statistics');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('totalLoans');
    expect(data).toHaveProperty('activeLoans');
    expect(data).toHaveProperty('pendingLoans');
    expect(data).toHaveProperty('totalAmount');
    expect(data).toHaveProperty('averageInterestRate');
  });

  test('handles validation errors', async ({ page }) => {
    const response = await page.request.post('/api/loans', {
      data: {
        customerName: '',
        amount: -1000,
        interestRate: 101,
        termMonths: 0
      }
    });
    
    expect(response.status()).toBe(400);
    
    const data = await response.json();
    expect(data).toHaveProperty('errors');
    expect(data.errors).toHaveProperty('customerName');
    expect(data.errors).toHaveProperty('amount');
    expect(data.errors).toHaveProperty('interestRate');
    expect(data.errors).toHaveProperty('termMonths');
  });

  test('handles not found errors', async ({ page }) => {
    const response = await page.request.get('/api/loans/999999');
    expect(response.status()).toBe(404);
    
    const data = await response.json();
    expect(data).toHaveProperty('message');
    expect(data.message).toContain('not found');
  });

  test('handles server errors', async ({ page }) => {
    const response = await page.request.get('/api/error');
    expect(response.status()).toBe(500);
    
    const data = await response.json();
    expect(data).toHaveProperty('message');
    expect(data.message).toContain('Internal server error');
  });

  test('handles rate limiting', async ({ page }) => {
    const responses = await Promise.all(
      Array(100).fill(null).map(() => 
        page.request.get('/api/loans')
      )
    );
    
    const tooManyRequests = responses.some(r => r.status() === 429);
    expect(tooManyRequests).toBeTruthy();
  });
}); 