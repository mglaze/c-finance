import React from 'react';
import { render, screen } from '@testing-library/react';
import LoanStats from '../LoanStats';

const mockLoans = [
  {
    id: 1,
    accountNumber: 'ACC001',
    amount: 10000,
    interestRate: 5.5,
    termInMonths: 12,
    startDate: '2024-01-01',
    status: 'Active',
    monthlyPayment: 856.07,
    remainingBalance: 10000,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 2,
    accountNumber: 'ACC002',
    amount: 20000,
    interestRate: 6.0,
    termInMonths: 24,
    startDate: '2024-01-01',
    status: 'Pending',
    monthlyPayment: 886.41,
    remainingBalance: 20000,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 3,
    accountNumber: 'ACC003',
    amount: 15000,
    interestRate: 7.0,
    termInMonths: 36,
    startDate: '2024-01-01',
    status: 'Defaulted',
    monthlyPayment: 463.88,
    remainingBalance: 15000,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
];

describe('LoanStats', () => {
  it('renders loan statistics correctly', () => {
    render(<LoanStats loans={mockLoans} />);

    // Check if all stat cards are present
    expect(screen.getByText('Total Loans')).toBeInTheDocument();
    expect(screen.getByText('Total Amount')).toBeInTheDocument();
    expect(screen.getByText('Active Loans')).toBeInTheDocument();
    expect(screen.getByText('Defaulted Loans')).toBeInTheDocument();
    expect(screen.getByText('Average Interest Rate')).toBeInTheDocument();

    // Check if values are calculated correctly
    expect(screen.getByText('3')).toBeInTheDocument(); // Total Loans
    expect(screen.getByText('$45,000.00')).toBeInTheDocument(); // Total Amount
    expect(screen.getByText('1')).toBeInTheDocument(); // Active Loans
    expect(screen.getByText('1')).toBeInTheDocument(); // Defaulted Loans
    expect(screen.getByText('6.17%')).toBeInTheDocument(); // Average Interest Rate
  });

  it('handles empty loan list', () => {
    render(<LoanStats loans={[]} />);

    expect(screen.getByText('0')).toBeInTheDocument(); // Total Loans
    expect(screen.getByText('$0.00')).toBeInTheDocument(); // Total Amount
    expect(screen.getByText('0')).toBeInTheDocument(); // Active Loans
    expect(screen.getByText('0')).toBeInTheDocument(); // Defaulted Loans
    expect(screen.getByText('0.00%')).toBeInTheDocument(); // Average Interest Rate
  });

  it('calculates statistics correctly with different loan statuses', () => {
    const loansWithDifferentStatuses = [
      ...mockLoans,
      {
        id: 4,
        accountNumber: 'ACC004',
        amount: 25000,
        interestRate: 4.5,
        termInMonths: 48,
        startDate: '2024-01-01',
        status: 'Paid',
        monthlyPayment: 570.60,
        remainingBalance: 0,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      }
    ];

    render(<LoanStats loans={loansWithDifferentStatuses} />);

    expect(screen.getByText('4')).toBeInTheDocument(); // Total Loans
    expect(screen.getByText('$70,000.00')).toBeInTheDocument(); // Total Amount
    expect(screen.getByText('1')).toBeInTheDocument(); // Active Loans
    expect(screen.getByText('1')).toBeInTheDocument(); // Defaulted Loans
  });
}); 