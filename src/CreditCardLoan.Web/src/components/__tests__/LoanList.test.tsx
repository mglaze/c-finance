import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoanList from '../LoanList';

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
  }
];

describe('LoanList', () => {
  const mockOnSelectLoan = jest.fn();
  const mockOnDeleteLoan = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loan list with correct data', () => {
    render(
      <LoanList
        loans={mockLoans}
        onSelectLoan={mockOnSelectLoan}
        onDeleteLoan={mockOnDeleteLoan}
      />
    );

    // Check if table headers are present
    expect(screen.getByText('Account Number')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();
    expect(screen.getByText('Interest Rate')).toBeInTheDocument();
    expect(screen.getByText('Term')).toBeInTheDocument();
    expect(screen.getByText('Monthly Payment')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();

    // Check if loan data is displayed correctly
    expect(screen.getByText('ACC001')).toBeInTheDocument();
    expect(screen.getByText('$10,000.00')).toBeInTheDocument();
    expect(screen.getByText('5.5%')).toBeInTheDocument();
    expect(screen.getByText('12 months')).toBeInTheDocument();
    expect(screen.getByText('$856.07')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('calls onSelectLoan when edit button is clicked', () => {
    render(
      <LoanList
        loans={mockLoans}
        onSelectLoan={mockOnSelectLoan}
        onDeleteLoan={mockOnDeleteLoan}
      />
    );

    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);

    expect(mockOnSelectLoan).toHaveBeenCalledWith(mockLoans[0]);
  });

  it('calls onDeleteLoan when delete button is clicked', () => {
    render(
      <LoanList
        loans={mockLoans}
        onSelectLoan={mockOnSelectLoan}
        onDeleteLoan={mockOnDeleteLoan}
      />
    );

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(mockOnDeleteLoan).toHaveBeenCalledWith(mockLoans[0].id);
  });

  it('displays correct status badges with appropriate styles', () => {
    render(
      <LoanList
        loans={mockLoans}
        onSelectLoan={mockOnSelectLoan}
        onDeleteLoan={mockOnDeleteLoan}
      />
    );

    const activeStatus = screen.getByText('Active');
    const pendingStatus = screen.getByText('Pending');

    expect(activeStatus).toHaveClass('status-badge', 'status-active');
    expect(pendingStatus).toHaveClass('status-badge', 'status-pending');
  });
}); 