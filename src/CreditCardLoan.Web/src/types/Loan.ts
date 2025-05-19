export interface Loan {
  id: number;
  accountNumber: string;
  amount: number;
  interestRate: number;
  termInMonths: number;
  status: 'Pending' | 'Active' | 'Paid' | 'Defaulted';
  monthlyPayment: number;
  remainingBalance: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
} 