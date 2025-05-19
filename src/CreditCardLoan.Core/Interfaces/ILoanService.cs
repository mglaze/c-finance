using System.Collections.Generic;
using System.Threading.Tasks;
using CreditCardLoan.Core.Models;

namespace CreditCardLoan.Core.Interfaces
{
    public interface ILoanService
    {
        Task<IEnumerable<Loan>> GetAllLoansAsync();
        Task<Loan> GetLoanByIdAsync(int id);
        Task<Loan> CreateLoanAsync(Loan loan);
        Task<Loan> UpdateLoanAsync(Loan loan);
        Task DeleteLoanAsync(int id);
        Task<IEnumerable<Loan>> SearchLoansAsync(string searchTerm);
        Task<LoanStatistics> GetLoanStatisticsAsync();
    }

    public class LoanStatistics
    {
        public decimal TotalAmount { get; set; }
        public decimal AverageAmount { get; set; }
        public decimal TotalInterest { get; set; }
        public int TotalLoans { get; set; }
    }
} 