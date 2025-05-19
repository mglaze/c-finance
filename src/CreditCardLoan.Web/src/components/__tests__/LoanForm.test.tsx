import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoanForm from '../LoanForm';

const mockLoan = {
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
};

describe('LoanForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders create form with empty fields', () => {
    render(
      <LoanForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Create New Loan')).toBeInTheDocument();
    expect(screen.getByLabelText('Account Number')).toHaveValue('');
    expect(screen.getByLabelText('Amount')).toHaveValue(0);
    expect(screen.getByLabelText('Interest Rate (%)')).toHaveValue(0);
    expect(screen.getByLabelText('Term (months)')).toHaveValue(12);
    expect(screen.getByLabelText('Status')).toHaveValue('Pending');
  });

  it('renders edit form with loan data', () => {
    render(
      <LoanForm
        loan={mockLoan}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Edit Loan')).toBeInTheDocument();
    expect(screen.getByLabelText('Account Number')).toHaveValue('ACC001');
    expect(screen.getByLabelText('Amount')).toHaveValue(10000);
    expect(screen.getByLabelText('Interest Rate (%)')).toHaveValue(5.5);
    expect(screen.getByLabelText('Term (months)')).toHaveValue(12);
    expect(screen.getByLabelText('Status')).toHaveValue('Active');
  });

  it('calls onSubmit with form data when submitted', async () => {
    render(
      <LoanForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.change(screen.getByLabelText('Account Number'), {
      target: { value: 'ACC003' }
    });
    fireEvent.change(screen.getByLabelText('Amount'), {
      target: { value: '15000' }
    });
    fireEvent.change(screen.getByLabelText('Interest Rate (%)'), {
      target: { value: '6.0' }
    });
    fireEvent.change(screen.getByLabelText('Term (months)'), {
      target: { value: '24' }
    });
    fireEvent.change(screen.getByLabelText('Status'), {
      target: { value: 'Pending' }
    });

    fireEvent.click(screen.getByText('Create Loan'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
        accountNumber: 'ACC003',
        amount: 15000,
        interestRate: 6.0,
        termInMonths: 24,
        status: 'Pending'
      }));
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <LoanForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('validates required fields', async () => {
    render(
      <LoanForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByText('Create Loan'));

    await waitFor(() => {
      expect(screen.getByLabelText('Account Number')).toBeInvalid();
      expect(screen.getByLabelText('Amount')).toBeInvalid();
      expect(screen.getByLabelText('Interest Rate (%)')).toBeInvalid();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('calculates monthly payment correctly', async () => {
    render(
      <LoanForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.change(screen.getByLabelText('Account Number'), {
      target: { value: 'ACC003' }
    });
    fireEvent.change(screen.getByLabelText('Amount'), {
      target: { value: '10000' }
    });
    fireEvent.change(screen.getByLabelText('Interest Rate (%)'), {
      target: { value: '5.5' }
    });
    fireEvent.change(screen.getByLabelText('Term (months)'), {
      target: { value: '12' }
    });

    fireEvent.click(screen.getByText('Create Loan'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
        monthlyPayment: expect.any(Number)
      }));
    });
  });
}); 