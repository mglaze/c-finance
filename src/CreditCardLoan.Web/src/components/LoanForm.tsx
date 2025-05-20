import React, { useState, useEffect } from 'react';
import { Loan } from '../types/Loan';
import '../styles/LoanForm.css';

interface LoanFormProps {
  onSubmit: (loan: Loan) => void;
  selectedLoan: Loan | null;
  onCancel: () => void;
}

const LoanForm: React.FC<LoanFormProps> = ({ onSubmit, selectedLoan, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Loan>>({
    accountNumber: '',
    amount: 0,
    interestRate: 0,
    termInMonths: 12,
    status: 'Pending'
  });

  useEffect(() => {
    if (selectedLoan) {
      setFormData(selectedLoan);
    } else {
      setFormData({
        accountNumber: '',
        amount: 0,
        interestRate: 0,
        termInMonths: 12,
        status: 'Pending'
      });
    }
  }, [selectedLoan]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' || name === 'interestRate' || name === 'termInMonths'
        ? parseFloat(value)
        : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as Loan);
  };

  const formType = selectedLoan ? 'edit' : 'create';
  const formTestId = `loan-form-${formType}`;

  return (
    <div className="loan-form" data-testid={formTestId}>
      <h2>{selectedLoan ? 'Edit Loan' : 'Create New Loan'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="accountNumber">Account Number</label>
          <input
            type="text"
            id="accountNumber"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            required
            data-testid={`account-number-input-${formType}`}
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
            data-testid={`amount-input-${formType}`}
          />
        </div>

        <div className="form-group">
          <label htmlFor="interestRate">Interest Rate (%)</label>
          <input
            type="number"
            id="interestRate"
            name="interestRate"
            value={formData.interestRate}
            onChange={handleChange}
            min="0"
            max="100"
            step="0.01"
            required
            data-testid={`interest-rate-input-${formType}`}
          />
        </div>

        <div className="form-group">
          <label htmlFor="termInMonths">Term (months)</label>
          <input
            type="number"
            id="termInMonths"
            name="termInMonths"
            value={formData.termInMonths}
            onChange={handleChange}
            min="1"
            max="360"
            required
            data-testid={`term-input-${formType}`}
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            data-testid={`status-select-${formType}`}
          >
            <option value="Pending">Pending</option>
            <option value="Active">Active</option>
            <option value="Paid">Paid</option>
            <option value="Defaulted">Defaulted</option>
          </select>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button"
            data-testid={`submit-button-${formType}`}
          >
            {selectedLoan ? 'Update Loan' : 'Create Loan'}
          </button>
          <button 
            type="button" 
            className="cancel-button" 
            onClick={onCancel}
            data-testid={`cancel-button-${formType}`}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoanForm; 