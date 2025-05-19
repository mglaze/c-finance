import React from 'react';
import { Loan } from '../types/Loan';
import '../styles/LoanStats.css';

interface LoanStatsProps {
  loans: Loan[];
}

const LoanStats: React.FC<LoanStatsProps> = ({ loans }) => {
  const totalLoans = loans.length;
  const totalAmount = loans.reduce((sum, loan) => sum + loan.amount, 0);
  const activeLoans = loans.filter(loan => loan.status === 'Active').length;
  const pendingLoans = loans.filter(loan => loan.status === 'Pending').length;
  const paidLoans = loans.filter(loan => loan.status === 'Paid').length;
  const defaultedLoans = loans.filter(loan => loan.status === 'Defaulted').length;
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
        <div className="stat-card">
          <h3>Total Loans</h3>
          <p className="stat-value">{totalLoans}</p>
        </div>
        
        <div className="stat-card">
          <h3>Total Amount</h3>
          <p className="stat-value">{formatCurrency(totalAmount)}</p>
        </div>
        
        <div className="stat-card">
          <h3>Active Loans</h3>
          <p className="stat-value">{activeLoans}</p>
        </div>
        
        <div className="stat-card">
          <h3>Pending Loans</h3>
          <p className="stat-value">{pendingLoans}</p>
        </div>
        
        <div className="stat-card">
          <h3>Paid Loans</h3>
          <p className="stat-value">{paidLoans}</p>
        </div>
        
        <div className="stat-card">
          <h3>Defaulted Loans</h3>
          <p className="stat-value">{defaultedLoans}</p>
        </div>
        
        <div className="stat-card">
          <h3>Average Interest Rate</h3>
          <p className="stat-value">{averageInterestRate.toFixed(2)}%</p>
        </div>
      </div>
    </div>
  );
};

export default LoanStats; 