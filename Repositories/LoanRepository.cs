using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;
using CreditCardLoan.Core.Interfaces;
using CreditCardLoan.Core.Models;
using CreditCardLoan.Infrastructure.Data;

namespace CreditCardLoan.Infrastructure.Repositories
{
    public class LoanRepository : ILoanRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IDistributedCache _cache;
        private const string CacheKeyPrefix = "Loan_";
        private const int CacheExpirationMinutes = 30;

        public LoanRepository(ApplicationDbContext context, IDistributedCache cache)
        {
            _context = context;
            _cache = cache;
        }

        public async Task<IEnumerable<Loan>> GetAllAsync()
        {
            var cacheKey = $"{CacheKeyPrefix}All";
            var cachedLoans = await _cache.GetStringAsync(cacheKey);

            if (!string.IsNullOrEmpty(cachedLoans))
            {
                return JsonSerializer.Deserialize<IEnumerable<Loan>>(cachedLoans);
            }

            var loans = await _context.Loans.ToListAsync();
            await CacheLoansAsync(cacheKey, loans);
            return loans;
        }

        public async Task<Loan> GetByIdAsync(int id)
        {
            var cacheKey = $"{CacheKeyPrefix}{id}";
            var cachedLoan = await _cache.GetStringAsync(cacheKey);

            if (!string.IsNullOrEmpty(cachedLoan))
            {
                return JsonSerializer.Deserialize<Loan>(cachedLoan);
            }

            var loan = await _context.Loans.FindAsync(id);
            if (loan != null)
            {
                await CacheLoanAsync(cacheKey, loan);
            }
            return loan;
        }

        public async Task<Loan> CreateAsync(Loan loan)
        {
            _context.Loans.Add(loan);
            await _context.SaveChangesAsync();
            await InvalidateCacheAsync();
            return loan;
        }

        public async Task<Loan> UpdateAsync(Loan loan)
        {
            loan.UpdatedAt = DateTime.UtcNow;
            _context.Entry(loan).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            await InvalidateCacheAsync();
            return loan;
        }

        public async Task DeleteAsync(int id)
        {
            var loan = await _context.Loans.FindAsync(id);
            if (loan != null)
            {
                _context.Loans.Remove(loan);
                await _context.SaveChangesAsync();
                await InvalidateCacheAsync();
            }
        }

        public async Task<IEnumerable<Loan>> SearchAsync(string searchTerm)
        {
            return await _context.Loans
                .Where(l => l.CustomerName.Contains(searchTerm))
                .ToListAsync();
        }

        public async Task<(decimal TotalAmount, decimal TotalInterest)> GetStatisticsAsync()
        {
            var loans = await _context.Loans.ToListAsync();
            var totalAmount = loans.Sum(l => l.Amount);
            var totalInterest = loans.Sum(l => l.TotalInterest);
            return (totalAmount, totalInterest);
        }

        private async Task CacheLoanAsync(string key, Loan loan)
        {
            var options = new DistributedCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromMinutes(CacheExpirationMinutes));
            await _cache.SetStringAsync(key, JsonSerializer.Serialize(loan), options);
        }

        private async Task CacheLoansAsync(string key, IEnumerable<Loan> loans)
        {
            var options = new DistributedCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromMinutes(CacheExpirationMinutes));
            await _cache.SetStringAsync(key, JsonSerializer.Serialize(loans), options);
        }

        private async Task InvalidateCacheAsync()
        {
            var cacheKey = $"{CacheKeyPrefix}All";
            await _cache.RemoveAsync(cacheKey);
        }
    }
} 