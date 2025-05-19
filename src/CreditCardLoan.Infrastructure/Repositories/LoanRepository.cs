using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CreditCardLoan.Core.Interfaces;
using CreditCardLoan.Core.Models;
using CreditCardLoan.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CreditCardLoan.Infrastructure.Repositories
{
    public class LoanRepository : ILoanRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<LoanRepository> _logger;

        public LoanRepository(ApplicationDbContext context, ILogger<LoanRepository> logger)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<IEnumerable<Loan>> GetAllAsync()
        {
            return await _context.Loans.ToListAsync();
        }

        public async Task<Loan> GetByIdAsync(int id)
        {
            return await _context.Loans.FindAsync(id);
        }

        public async Task<Loan> AddAsync(Loan loan)
        {
            _context.Loans.Add(loan);
            await _context.SaveChangesAsync();
            return loan;
        }

        public async Task<Loan> UpdateAsync(Loan loan)
        {
            _context.Entry(loan).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return loan;
        }

        public async Task DeleteAsync(int id)
        {
            var loan = await _context.Loans.FindAsync(id);
            if (loan != null)
            {
                _context.Loans.Remove(loan);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Loan>> SearchAsync(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return await GetAllAsync();

            return await _context.Loans
                .Where(l => l.CustomerName.Contains(searchTerm))
                .ToListAsync();
        }
    }
} 