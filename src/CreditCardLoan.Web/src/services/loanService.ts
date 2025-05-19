import { Loan } from '../types/Loan';

const API_BASE_URL = 'http://localhost:5181/api';

export const getLoans = async (): Promise<Loan[]> => {
  const response = await fetch(`${API_BASE_URL}/loans`);
  if (!response.ok) {
    throw new Error('Failed to fetch loans');
  }
  return response.json();
};

export const getLoan = async (id: number): Promise<Loan> => {
  const response = await fetch(`${API_BASE_URL}/loans/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch loan');
  }
  return response.json();
};

export const createLoan = async (loan: Omit<Loan, 'id'>): Promise<Loan> => {
  const response = await fetch(`${API_BASE_URL}/loans`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loan),
  });
  if (!response.ok) {
    throw new Error('Failed to create loan');
  }
  return response.json();
};

export const updateLoan = async (loan: Loan): Promise<Loan> => {
  const response = await fetch(`${API_BASE_URL}/loans/${loan.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loan),
  });
  if (!response.ok) {
    throw new Error('Failed to update loan');
  }
  return response.json();
};

export const deleteLoan = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/loans/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete loan');
  }
}; 