using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using CreditCardLoan.Core.Interfaces;
using CreditCardLoan.Core.Models;
using Microsoft.Extensions.Logging;

namespace CreditCardLoan.Infrastructure.Services
{
    public class LoanService : ILoanService
    {
        private readonly ILoanRepository _loanRepository;
        private readonly ILogger<LoanService> _logger;

        public LoanService(ILoanRepository loanRepository, ILogger<LoanService> logger)
        {
            _loanRepository = loanRepository ?? throw new ArgumentNullException(nameof(loanRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<IEnumerable<Loan>> GetAllLoansAsync()
        {
            return await _loanRepository.GetAllAsync();
        }

        public async Task<Loan> GetLoanByIdAsync(int id)
        {
            return await _loanRepository.GetByIdAsync(id);
        }

        public async Task<Loan> CreateLoanAsync(Loan loan)
        {
            await ValidateLoanAsync(loan);
            return await _loanRepository.AddAsync(loan);
        }

        public async Task<Loan> UpdateLoanAsync(Loan loan)
        {
            await ValidateLoanAsync(loan);
            return await _loanRepository.UpdateAsync(loan);
        }

        public async Task DeleteLoanAsync(int id)
        {
            var existingLoan = await _loanRepository.GetByIdAsync(id);
            if (existingLoan == null)
                throw new ValidationException($"Loan with ID {id} does not exist.");
            await _loanRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<Loan>> SearchLoansAsync(string searchTerm)
        {
            return await _loanRepository.SearchAsync(searchTerm);
        }

        public async Task<LoanStatistics> GetLoanStatisticsAsync()
        {
            var loans = await _loanRepository.GetAllAsync();
            var loanList = loans.ToList();

            return new LoanStatistics
            {
                TotalAmount = loanList.Sum(l => l.Amount),
                AverageAmount = loanList.Any() ? loanList.Average(l => l.Amount) : 0,
                TotalInterest = loanList.Sum(l => l.Amount * (l.InterestRate / 100)),
                TotalLoans = loanList.Count
            };
        }

        private async Task ValidateLoanAsync(Loan loan)
        {
            if (loan == null)
                throw new ArgumentNullException(nameof(loan));

            var validationContext = new ValidationContext(loan);
            var validationResults = new List<ValidationResult>();
            if (!Validator.TryValidateObject(loan, validationContext, validationResults, true))
            {
                throw new ValidationException(string.Join(Environment.NewLine, validationResults.Select(r => r.ErrorMessage)));
            }

            // Business rules validation
            if (loan.Amount <= 0)
                throw new ValidationException("Loan amount must be greater than zero.");

            if (loan.InterestRate < 0 || loan.InterestRate > 100)
                throw new ValidationException("Interest rate must be between 0 and 100.");

            if (loan.TermInMonths <= 0)
                throw new ValidationException("Loan term must be greater than zero.");

            // Check if loan with same ID exists for updates
            if (loan.Id > 0)
            {
                var existingLoan = await _loanRepository.GetByIdAsync(loan.Id);
                if (existingLoan == null)
                    throw new ValidationException($"Loan with ID {loan.Id} does not exist.");
            }
        }
    }
} 