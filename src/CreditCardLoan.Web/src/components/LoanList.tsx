import React from 'react';
import { Loan, LoanStatus } from '../types/Loan';
import '../styles/LoanList.css';

interface LoanListProps {
  loans: Loan[];
  onUpdate: (loan: Loan) => void;
  onDelete: (id: number) => void;
}

const LoanList: React.FC<LoanListProps> = ({ loans, onUpdate, onDelete }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  function getStatusText(status: number): string {
    switch (status) {
      case LoanStatus.Active:
        return 'Active';
      case LoanStatus.Pending:
        return 'Pending';
      case LoanStatus.Paid:
        return 'Paid';
      case LoanStatus.Defaulted:
        return 'Defaulted';
      default:
        return 'Unknown';
    }
  }

  function getStatusClass(status: number) {
    switch (status) {
      case LoanStatus.Active:
        return 'loan-status-active';
      case LoanStatus.Pending:
        return 'loan-status-pending';
      case LoanStatus.Paid:
        return 'loan-status-paid';
      case LoanStatus.Defaulted:
        return 'loan-status-defaulted';
      default:
        return 'loan-status-unknown';
    }
  }

  return (
    <div className="loan-list">
      <h2>Loans</h2>
      <table>
        <thead>
          <tr>
            <th>Account Number</th>
            <th>Amount</th>
            <th>Interest Rate</th>
            <th>Term</th>
            <th>Monthly Payment</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loans.map(loan => (
            <tr key={loan.id} data-testid={`loan-item-${loan.customerName}`}>
              <td data-testid="account-number">{loan.customerName}</td>
              <td data-testid="amount">{formatCurrency(loan.amount)}</td>
              <td data-testid="interest-rate">{loan.interestRate}%</td>
              <td data-testid="term">{loan.termInMonths} months</td>
              <td data-testid="monthly-payment">{formatCurrency(loan.monthlyPayment)}</td>
              <td>
                <span className={getStatusClass(loan.status)}>
                  {getStatusText(loan.status)}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    className="edit-button"
                    onClick={() => onUpdate(loan)}
                    data-testid="edit-button"
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => onDelete(loan.id)}
                    data-testid="delete-button"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoanList; 