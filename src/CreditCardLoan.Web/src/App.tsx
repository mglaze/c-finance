import React, { useEffect, useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import LoanList from './components/LoanList';
import LoanForm from './components/LoanForm';
import LoanStats from './components/LoanStats';
import { getLoans, createLoan, updateLoan, deleteLoan } from './services/loanService';
import { Loan } from './types/Loan';

function App() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const data = await getLoans();
        setLoans(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch loans');
        setLoading(false);
      }
    };
    fetchLoans();
  }, []);

  const handleCreateLoan = async (loan: Loan) => {
    try {
      const newLoan = await createLoan(loan);
      setLoans([...loans, newLoan]);
    } catch (err) {
      setError('Failed to create loan');
    }
  };

  const handleUpdateLoan = async (loan: Loan) => {
    try {
      const updatedLoan = await updateLoan(loan);
      setLoans(loans.map(l => l.id === updatedLoan.id ? updatedLoan : l));
    } catch (err) {
      setError('Failed to update loan');
    }
  };

  const handleDeleteLoan = async (id: number) => {
    try {
      await deleteLoan(id);
      setLoans(loans.filter(l => l.id !== id));
    } catch (err) {
      setError('Failed to delete loan');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Credit Card Loan Dashboard</h1>
      </header>
      <main>
        <Dashboard loans={loans} />
        <LoanStats loans={loans} />
        <LoanForm onSubmit={handleCreateLoan} />
        <LoanList loans={loans} onUpdate={handleUpdateLoan} onDelete={handleDeleteLoan} />
      </main>
    </div>
  );
}

export default App; 