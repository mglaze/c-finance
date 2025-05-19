using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using CreditCardLoan.Core.Interfaces;
using CreditCardLoan.Core.Models;

namespace CreditCardLoan.Infrastructure.Services
{
    public class LoanService : ILoanService
    {
        private readonly ILoanRepository _loanRepository;

        public LoanService(ILoanRepository loanRepository)
        {
            _loanRepository = loanRepository;
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
            if (!await ValidateLoanAsync(loan))
            {
                throw new ValidationException("Invalid loan data");
            }

            return await _loanRepository.CreateAsync(loan);
        }

        public async Task<Loan> UpdateLoanAsync(Loan loan)
        {
            if (!await ValidateLoanAsync(loan))
            {
                throw new ValidationException("Invalid loan data");
            }

            var existingLoan = await _loanRepository.GetByIdAsync(loan.Id);
            if (existingLoan == null)
            {
                throw new KeyNotFoundException($"Loan with ID {loan.Id} not found");
            }

            return await _loanRepository.UpdateAsync(loan);
        }

        public async Task DeleteLoanAsync(int id)
        {
            var loan = await _loanRepository.GetByIdAsync(id);
            if (loan == null)
            {
                throw new KeyNotFoundException($"Loan with ID {id} not found");
            }

            await _loanRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<Loan>> SearchLoansAsync(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return await _loanRepository.GetAllAsync();
            }

            return await _loanRepository.SearchAsync(searchTerm);
        }

        public async Task<(decimal TotalAmount, decimal TotalInterest)> GetLoanStatisticsAsync()
        {
            return await _loanRepository.GetStatisticsAsync();
        }

        public async Task<bool> ValidateLoanAsync(Loan loan)
        {
            if (loan == null)
            {
                return false;
            }

            var validationContext = new ValidationContext(loan);
            var validationResults = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(loan, validationContext, validationResults, true);

            if (!isValid)
            {
                return false;
            }

            // Additional business logic validation
            if (loan.Amount < 100 || loan.Amount > 100000)
            {
                return false;
            }

            if (loan.InterestRate < 0.01m || loan.InterestRate > 1.0m)
            {
                return false;
            }

            if (loan.TermInMonths < 1 || loan.TermInMonths > 60)
            {
                return false;
            }

            return true;
        }
    }
} 