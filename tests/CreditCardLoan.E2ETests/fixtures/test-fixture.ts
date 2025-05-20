import { test as base } from '@playwright/test';
import { DatabaseSeeder } from '../utils/db-seeder';
import { setupApiMocks } from '../utils/api-mock';

// Extend the base test type with our custom fixtures
type TestFixtures = {
  seedDatabase: void;
};

const API_URL = 'http://localhost:5181';

export const test = base.extend<TestFixtures>({
  seedDatabase: [async ({ page }, use) => {
    console.log('Setting up test database...');
    
    try {
      // Set up API mocks
      await setupApiMocks(page);
      console.log('API mocks set up');

      // Create seeder instance and seed the database before the test
      const seeder = new DatabaseSeeder(API_URL);
      await seeder.seedTestData();
      console.log('Database seeded successfully');
      
      // Run the test
      await use();
      
      // Clean up after the test
      console.log('Cleaning up test database...');
      await seeder.clearTestData();
      console.log('Database cleanup completed');
    } catch (error) {
      console.error('Test setup/teardown failed:', error);
      throw error;
    }
  }, { auto: true }]
});

export { expect } from '@playwright/test'; 