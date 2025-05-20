import React from 'react';
import { Loan, LoanStatus } from '../types/Loan';
import '../styles/LoanStats.css';

interface LoanStatsProps {
  loans: Loan[];
}

const LoanStats: React.FC<LoanStatsProps> = ({ loans }) => {
  const totalLoans = loans.length;
  const totalAmount = loans.reduce((sum, loan) => sum + loan.amount, 0);
  const activeLoansAmount = loans
    .filter(loan => loan.status === LoanStatus.Active)
    .reduce((sum, loan) => sum + loan.amount, 0);
  const pendingLoans = loans.filter(loan => loan.status === LoanStatus.Pending).length;
  const paidLoans = loans.filter(loan => loan.status === LoanStatus.Paid).length;
  const defaultedLoans = loans.filter(loan => loan.status === LoanStatus.Defaulted).length;
  const averageInterestRate = loans.length > 0
    ? loans.reduce((sum, loan) => sum + loan.interestRate, 0) / loans.length
    : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="loan-stats">
      <h2>Loan Statistics</h2>
      <div className="stats-grid">
        <div className="stat-card" data-testid="stats-total-loans">
          <h3>Total Loans</h3>
          <p className="stat-value" data-testid="stats-total-loans-value">{totalLoans}</p>
        </div>
        
        <div className="stat-card" data-testid="stats-total-amount">
          <h3>Total Amount</h3>
          <p className="stat-value" data-testid="stats-total-amount-value">{formatCurrency(totalAmount)}</p>
        </div>
        
        <div className="stat-card" data-testid="stats-active-loans">
          <h3>Active Loans</h3>
          <p className="stat-value" data-testid="stats-active-loans-value">{formatCurrency(activeLoansAmount)}</p>
        </div>
        
        <div className="stat-card" data-testid="stats-pending-loans">
          <h3>Pending Loans</h3>
          <p className="stat-value" data-testid="stats-pending-loans-value">{pendingLoans}</p>
        </div>
        
        <div className="stat-card" data-testid="stats-paid-loans">
          <h3>Paid Loans</h3>
          <p className="stat-value" data-testid="stats-paid-loans-value">{paidLoans}</p>
        </div>
        
        <div className="stat-card" data-testid="stats-defaulted-loans">
          <h3>Defaulted Loans</h3>
          <p className="stat-value" data-testid="stats-defaulted-loans-value">{defaultedLoans}</p>
        </div>
        
        <div className="stat-card" data-testid="stats-avg-interest">
          <h3>Average Interest Rate</h3>
          <p className="stat-value" data-testid="stats-avg-interest-value">{averageInterestRate.toFixed(2)}%</p>
        </div>
      </div>
    </div>
  );
};

export default LoanStats; 