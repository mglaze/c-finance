import React, { useEffect, useState } from 'react';
import { Loan } from '../types/Loan';
import { getLoans, createLoan, updateLoan, deleteLoan } from '../services/loanService';
import LoanList from './LoanList';
import LoanForm from './LoanForm';
import LoanStats from './LoanStats';
import '../styles/Dashboard.css';

const Dashboard: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = async () => {
    try {
      setLoading(true);
      const data = await getLoans();
      setLoans(data);
      setError(null);
    } catch (err) {
      setError('Failed to load loans');
      console.error('Error loading loans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoanSubmit = async (loan: Loan) => {
    try {
      if (selectedLoan) {
        // Update existing loan
        const updatedLoan = await updateLoan(loan);
        setLoans(loans.map(l => l.id === updatedLoan.id ? updatedLoan : l));
      } else {
        // Create new loan
        const newLoan = await createLoan(loan);
        setLoans([...loans, newLoan]);
      }
      setSelectedLoan(null);
    } catch (err) {
      setError('Failed to save loan');
      console.error('Error saving loan:', err);
    }
  };

  const handleLoanDelete = async (id: number) => {
    try {
      await deleteLoan(id);
      setLoans(loans.filter(loan => loan.id !== id));
    } catch (err) {
      setError('Failed to delete loan');
      console.error('Error deleting loan:', err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="dashboard" data-testid="dashboard">
      <div className="dashboard-header">
        <h1>Loan Management Dashboard</h1>
      </div>
      <div className="dashboard-content">
        <div className="dashboard-stats" data-testid="loan-stats">
          <LoanStats loans={loans} />
        </div>
        <div className="dashboard-form">
          <LoanForm
            onSubmit={handleLoanSubmit}
            selectedLoan={selectedLoan}
            onCancel={() => setSelectedLoan(null)}
          />
        </div>
        <div className="dashboard-list" data-testid="loan-list">
          <LoanList
            loans={loans}
            onUpdate={setSelectedLoan}
            onDelete={handleLoanDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 