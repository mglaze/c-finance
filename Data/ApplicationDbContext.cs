using Microsoft.EntityFrameworkCore;
using CreditCardLoan.Core.Models;

namespace CreditCardLoan.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Loan> Loans { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Loan>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.CustomerName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Amount).HasPrecision(18, 2);
                entity.Property(e => e.InterestRate).HasPrecision(4, 2);
                entity.Property(e => e.MonthlyPayment).HasPrecision(18, 2);
                entity.Property(e => e.TotalPayment).HasPrecision(18, 2);
                entity.Property(e => e.TotalInterest).HasPrecision(18, 2);
            });
        }
    }
} 