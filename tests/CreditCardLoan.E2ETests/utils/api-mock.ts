import { Page } from '@playwright/test';

let mockFailures: { method: string; url: string }[] = [];

export async function mockApiFailure(method: string, url: string): Promise<void> {
  mockFailures.push({ method, url });
}

export async function clearMockApiFailure(): Promise<void> {
  mockFailures = [];
}

export async function setupApiMocks(page: Page): Promise<void> {
  await page.route('**/api/**', async (route) => {
    const request = route.request();
    const url = request.url();
    const method = request.method();

    // Check if this request should be mocked to fail
    const shouldFail = mockFailures.some(
      failure => failure.method === method && url.includes(failure.url)
    );

    if (shouldFail) {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    } else {
      await route.continue();
    }
  });
} 