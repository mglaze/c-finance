interface Loan {
  id?: number;
  customerName: string;
  amount: number;
  interestRate: number;
  termInMonths: number;
  createdAt?: Date;
  updatedAt?: Date;
  status: number;
}

export class DatabaseSeeder {
  private readonly apiUrl: string;
  private readonly testLoans: Loan[] = [
    {
      customerName: 'TEST001',
      amount: 5000,
      interestRate: 0.05,
      termInMonths: 12,
      status: 1 // Active
    },
    {
      customerName: 'TEST002',
      amount: 10000,
      interestRate: 0.07,
      termInMonths: 24,
      status: 0 // Pending
    },
    {
      customerName: 'TEST003',
      amount: 7500,
      interestRate: 0.06,
      termInMonths: 18,
      status: 2 // Paid
    }
  ];

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  async seedTestData(): Promise<void> {
    console.log('Starting to seed test data...');
    
    // First, clear any existing test data
    await this.clearTestData();
    
    // Create test loans
    for (const loan of this.testLoans) {
      console.log(`Creating test loan for ${loan.customerName}...`);
      const response = await fetch(`${this.apiUrl}/api/loans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loan),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create test loan: ${errorText}`);
      }
    }
    
    console.log('Test data seeding completed successfully.');
  }

  async clearTestData(): Promise<void> {
    console.log('Clearing existing test data...');
    
    // Get all loans
    const response = await fetch(`${this.apiUrl}/api/loans`);
    if (!response.ok) {
      throw new Error('Failed to fetch existing loans');
    }
    
    const loans: Loan[] = await response.json();
    
    // Delete test loans
    for (const loan of loans) {
      if (loan.customerName.startsWith('TEST')) {
        console.log(`Deleting test loan for ${loan.customerName}...`);
        const deleteResponse = await fetch(`${this.apiUrl}/api/loans/${loan.id}`, {
          method: 'DELETE',
        });
        
        if (!deleteResponse.ok) {
          throw new Error(`Failed to delete test loan ${loan.id}`);
        }
      }
    }
    
    console.log('Test data clearing completed.');
  }
} 