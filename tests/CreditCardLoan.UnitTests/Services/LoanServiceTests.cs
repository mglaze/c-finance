using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Moq;
using Xunit;
using Microsoft.Extensions.Logging;
using CreditCardLoan.Core.Interfaces;
using CreditCardLoan.Core.Models;
using CreditCardLoan.Infrastructure.Services;
using System.ComponentModel.DataAnnotations;

namespace CreditCardLoan.UnitTests.Services
{
    public class LoanServiceTests
    {
        private readonly Mock<ILoanRepository> _mockLoanRepository;
        private readonly Mock<ILogger<LoanService>> _mockLogger;
        private readonly LoanService _loanService;

        public LoanServiceTests()
        {
            _mockLoanRepository = new Mock<ILoanRepository>();
            _mockLogger = new Mock<ILogger<LoanService>>();
            _loanService = new LoanService(_mockLoanRepository.Object, _mockLogger.Object);
        }

        [Fact]
        public async Task GetAllLoansAsync_ReturnsAllLoans()
        {
            // Arrange
            var expectedLoans = new List<Loan>
            {
                new Loan { Id = 1, CustomerName = "John Doe", Amount = 1000, InterestRate = 0.05m, TermInMonths = 12 },
                new Loan { Id = 2, CustomerName = "Jane Smith", Amount = 2000, InterestRate = 0.06m, TermInMonths = 24 }
            };

            _mockLoanRepository.Setup(x => x.GetAllAsync())
                .ReturnsAsync(expectedLoans);

            // Act
            var result = await _loanService.GetAllLoansAsync();

            // Assert
            Assert.Equal(2, result.Count());
            Assert.Equal(expectedLoans[0].CustomerName, result.First().CustomerName);
            Assert.Equal(expectedLoans[1].CustomerName, result.Last().CustomerName);
        }

        [Fact]
        public async Task GetLoanByIdAsync_WithValidId_ReturnsLoan()
        {
            // Arrange
            var expectedLoan = new Loan
            {
                Id = 1,
                CustomerName = "John Doe",
                Amount = 1000,
                InterestRate = 0.05m,
                TermInMonths = 12
            };

            _mockLoanRepository.Setup(x => x.GetByIdAsync(1))
                .ReturnsAsync(expectedLoan);

            // Act
            var result = await _loanService.GetLoanByIdAsync(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(expectedLoan.Id, result.Id);
            Assert.Equal(expectedLoan.CustomerName, result.CustomerName);
        }

        [Fact]
        public async Task CreateLoanAsync_WithValidLoan_CreatesAndReturnsLoan()
        {
            // Arrange
            var newLoan = new Loan
            {
                CustomerName = "John Doe",
                Amount = 1000,
                InterestRate = 0.05m,
                TermInMonths = 12
            };

            var createdLoan = new Loan
            {
                Id = 1,
                CustomerName = "John Doe",
                Amount = 1000,
                InterestRate = 0.05m,
                TermInMonths = 12,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _mockLoanRepository.Setup(x => x.AddAsync(It.IsAny<Loan>()))
                .ReturnsAsync(createdLoan);

            // Act
            var result = await _loanService.CreateLoanAsync(newLoan);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(1, result.Id);
            Assert.Equal(newLoan.CustomerName, result.CustomerName);
            Assert.Equal(newLoan.Amount, result.Amount);
            Assert.Equal(newLoan.InterestRate, result.InterestRate);
            Assert.Equal(newLoan.TermInMonths, result.TermInMonths);
        }

        [Fact]
        public async Task CreateLoanAsync_WithInvalidAmount_ThrowsValidationException()
        {
            // Arrange
            var newLoan = new Loan
            {
                CustomerName = "John Doe",
                Amount = -1000, // Invalid amount
                InterestRate = 0.05m,
                TermInMonths = 12
            };

            // Act & Assert
            await Assert.ThrowsAsync<ValidationException>(() => _loanService.CreateLoanAsync(newLoan));
        }

        [Fact]
        public async Task CreateLoanAsync_WithInvalidInterestRate_ThrowsValidationException()
        {
            // Arrange
            var newLoan = new Loan
            {
                CustomerName = "John Doe",
                Amount = 1000,
                InterestRate = -0.05m, // Invalid interest rate
                TermInMonths = 12
            };

            // Act & Assert
            await Assert.ThrowsAsync<ValidationException>(() => _loanService.CreateLoanAsync(newLoan));
        }

        [Fact]
        public async Task UpdateLoanAsync_WithValidLoan_UpdatesLoan()
        {
            // Arrange
            var existingLoan = new Loan
            {
                Id = 1,
                CustomerName = "John Doe",
                Amount = 1000,
                InterestRate = 0.05m,
                TermInMonths = 12
            };

            var updatedLoan = new Loan
            {
                Id = 1,
                CustomerName = "John Doe",
                Amount = 1500,
                InterestRate = 0.05m,
                TermInMonths = 12,
                UpdatedAt = DateTime.UtcNow
            };

            _mockLoanRepository.Setup(x => x.GetByIdAsync(1))
                .ReturnsAsync(existingLoan);

            _mockLoanRepository.Setup(x => x.UpdateAsync(It.IsAny<Loan>()))
                .ReturnsAsync(updatedLoan);

            // Act
            var result = await _loanService.UpdateLoanAsync(updatedLoan);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(updatedLoan.Amount, result.Amount);
            _mockLoanRepository.Verify(x => x.UpdateAsync(It.IsAny<Loan>()), Times.Once);
        }

        [Fact]
        public async Task UpdateLoanAsync_WithNonExistentLoan_ThrowsValidationException()
        {
            // Arrange
            var loan = new Loan
            {
                Id = 1,
                CustomerName = "John Doe",
                Amount = 1000,
                InterestRate = 0.05m,
                TermInMonths = 12
            };

            _mockLoanRepository.Setup(x => x.GetByIdAsync(1))
                .ReturnsAsync((Loan)null);

            // Act & Assert
            await Assert.ThrowsAsync<ValidationException>(() => _loanService.UpdateLoanAsync(loan));
        }

        [Fact]
        public async Task DeleteLoanAsync_WithValidId_DeletesLoan()
        {
            // Arrange
            var existingLoan = new Loan
            {
                Id = 1,
                CustomerName = "John Doe",
                Amount = 1000,
                InterestRate = 0.05m,
                TermInMonths = 12
            };

            _mockLoanRepository.Setup(x => x.GetByIdAsync(1))
                .ReturnsAsync(existingLoan);

            _mockLoanRepository.Setup(x => x.DeleteAsync(1))
                .Returns(Task.CompletedTask);

            // Act
            await _loanService.DeleteLoanAsync(1);

            // Assert
            _mockLoanRepository.Verify(x => x.DeleteAsync(1), Times.Once);
        }

        [Fact]
        public async Task DeleteLoanAsync_WithNonExistentId_ThrowsValidationException()
        {
            // Arrange
            _mockLoanRepository.Setup(x => x.GetByIdAsync(1))
                .ReturnsAsync((Loan)null);

            // Act & Assert
            await Assert.ThrowsAsync<ValidationException>(() => _loanService.DeleteLoanAsync(1));
        }
    }
} 