using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;
using CreditCardLoan.Core.Models;
using CreditCardLoan.Core.Interfaces;
using System.Threading.Tasks;

namespace CreditCardLoan.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoansController : ControllerBase
    {
        private readonly ILoanService _loanService;
        private readonly IDistributedCache? _cache;
        private const string CacheKeyPrefix = "loan_";

        public LoansController(ILoanService loanService, IDistributedCache? cache = null)
        {
            _loanService = loanService;
            _cache = cache;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Loan>>> GetLoans()
        {
            if (_cache != null)
            {
                var cacheKey = $"{CacheKeyPrefix}all";
                var cachedLoans = await _cache.GetStringAsync(cacheKey);

                if (!string.IsNullOrEmpty(cachedLoans))
                {
                    return Ok(JsonSerializer.Deserialize<IEnumerable<Loan>>(cachedLoans));
                }
            }

            var loans = await _loanService.GetAllLoansAsync();

            if (_cache != null)
            {
                await _cache.SetStringAsync($"{CacheKeyPrefix}all", JsonSerializer.Serialize(loans), new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)
                });
            }

            return Ok(loans);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Loan>> GetLoan(int id)
        {
            if (_cache != null)
            {
                var cacheKey = $"{CacheKeyPrefix}{id}";
                var cachedLoan = await _cache.GetStringAsync(cacheKey);

                if (!string.IsNullOrEmpty(cachedLoan))
                {
                    return Ok(JsonSerializer.Deserialize<Loan>(cachedLoan));
                }
            }

            var loan = await _loanService.GetLoanByIdAsync(id);
            if (loan == null)
            {
                return NotFound();
            }

            if (_cache != null)
            {
                await _cache.SetStringAsync($"{CacheKeyPrefix}{id}", JsonSerializer.Serialize(loan), new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)
                });
            }

            return Ok(loan);
        }

        [HttpPost]
        public async Task<ActionResult<Loan>> CreateLoan(Loan loan)
        {
            var createdLoan = await _loanService.CreateLoanAsync(loan);
            await InvalidateCache();
            return CreatedAtAction(nameof(GetLoan), new { id = createdLoan.Id }, createdLoan);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLoan(int id, Loan loan)
        {
            if (id != loan.Id)
            {
                return BadRequest();
            }

            await _loanService.UpdateLoanAsync(loan);
            await InvalidateCache();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLoan(int id)
        {
            await _loanService.DeleteLoanAsync(id);
            await InvalidateCache();
            return NoContent();
        }

        private async Task InvalidateCache()
        {
            if (_cache != null)
            {
                await _cache.RemoveAsync($"{CacheKeyPrefix}all");
            }
        }
    }
} 