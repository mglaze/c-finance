using System;
using System.ComponentModel.DataAnnotations;

namespace CreditCardLoan.Core.Models
{
    public class Loan
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string CustomerName { get; set; }

        [Required]
        [Range(100, 100000)]
        public decimal Amount { get; set; }

        [Required]
        [Range(0.01, 1.0)]
        public decimal InterestRate { get; set; }

        [Required]
        [Range(1, 60)]
        public int TermInMonths { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        public decimal MonthlyPayment => CalculateMonthlyPayment();

        public decimal TotalPayment => MonthlyPayment * TermInMonths;

        public decimal TotalInterest => TotalPayment - Amount;

        private decimal CalculateMonthlyPayment()
        {
            var monthlyRate = InterestRate / 12;
            var denominator = (decimal)(Math.Pow(1 + (double)monthlyRate, TermInMonths) - 1);
            return Amount * monthlyRate * (1 + monthlyRate) / denominator;
        }
    }

    public enum LoanStatus
    {
        Pending,
        Active,
        Paid,
        Defaulted
    }
} 