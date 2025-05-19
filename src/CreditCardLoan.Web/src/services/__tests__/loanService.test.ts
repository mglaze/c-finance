import { fetchLoans, fetchLoan, createLoan, updateLoan, deleteLoan } from '../loanService';

// Mock the global fetch function
global.fetch = jest.fn();

describe('loanService', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

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

  describe('fetchLoans', () => {
    it('fetches loans successfully', async () => {
      const mockResponse = [mockLoan];
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await fetchLoans();
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/api/loans');
    });

    it('throws error when fetch fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false
      });

      await expect(fetchLoans()).rejects.toThrow('Failed to fetch loans');
    });
  });

  describe('fetchLoan', () => {
    it('fetches a single loan successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockLoan)
      });

      const result = await fetchLoan(1);
      expect(result).toEqual(mockLoan);
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/api/loans/1');
    });

    it('throws error when fetch fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false
      });

      await expect(fetchLoan(1)).rejects.toThrow('Failed to fetch loan');
    });
  });

  describe('createLoan', () => {
    it('creates a loan successfully', async () => {
      const newLoan = { ...mockLoan, id: undefined };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockLoan)
      });

      const result = await createLoan(newLoan);
      expect(result).toEqual(mockLoan);
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/api/loans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLoan),
      });
    });

    it('throws error when creation fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false
      });

      await expect(createLoan(mockLoan)).rejects.toThrow('Failed to create loan');
    });
  });

  describe('updateLoan', () => {
    it('updates a loan successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true
      });

      await updateLoan(mockLoan);
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/api/loans/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockLoan),
      });
    });

    it('throws error when update fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false
      });

      await expect(updateLoan(mockLoan)).rejects.toThrow('Failed to update loan');
    });
  });

  describe('deleteLoan', () => {
    it('deletes a loan successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true
      });

      await deleteLoan(1);
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/api/loans/1', {
        method: 'DELETE',
      });
    });

    it('throws error when deletion fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false
      });

      await expect(deleteLoan(1)).rejects.toThrow('Failed to delete loan');
    });
  });
}); 