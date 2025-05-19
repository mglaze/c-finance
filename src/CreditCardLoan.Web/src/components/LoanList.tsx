import React from 'react';
import { Loan } from '../types/Loan';
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

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'status-active';
      case 'pending':
        return 'status-pending';
      case 'paid':
        return 'status-paid';
      case 'defaulted':
        return 'status-defaulted';
      default:
        return '';
    }
  };

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
            <tr key={loan.id}>
              <td>{loan.accountNumber}</td>
              <td>{formatCurrency(loan.amount)}</td>
              <td>{loan.interestRate}%</td>
              <td>{loan.termInMonths} months</td>
              <td>{formatCurrency(loan.monthlyPayment)}</td>
              <td>
                <span className={`status-badge ${getStatusClass(loan.status)}`}>
                  {loan.status}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    className="edit-button"
                    onClick={() => onUpdate(loan)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => onDelete(loan.id)}
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