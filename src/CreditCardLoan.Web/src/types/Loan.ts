export interface Loan {
  id: number;
  accountNumber: string;
  amount: number;
  interestRate: number;
  termInMonths: number;
  status: number; // 0: Pending, 1: Active, 2: Paid, 3: Defaulted
  monthlyPayment: number;
  remainingBalance: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export const LoanStatus = {
  Pending: 0,
  Active: 1,
  Paid: 2,
  Defaulted: 3
} as const; 