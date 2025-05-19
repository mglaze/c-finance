using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Moq;
using Xunit;
using CreditCardLoan.Core.Interfaces;
using CreditCardLoan.Core.Models;
using CreditCardLoan.API.Controllers;

namespace CreditCardLoan.UnitTests.Controllers
{
    public class LoansControllerTests
    {
        private readonly Mock<ILoanService> _mockLoanService;
        private readonly Mock<IDistributedCache> _mockCache;
        private readonly LoansController _controller;

        public LoansControllerTests()
        {
            _mockLoanService = new Mock<ILoanService>();
            _mockCache = new Mock<IDistributedCache>();
            _controller = new LoansController(_mockLoanService.Object, _mockCache.Object);
        }

        [Fact]
        public async Task GetLoans_ReturnsOkResult_WithListOfLoans()
        {
            // Arrange
            var expectedLoans = new List<Loan>
            {
                new Loan { Id = 1, CustomerName = "John Doe", Amount = 1000, InterestRate = 0.05m, TermInMonths = 12 },
                new Loan { Id = 2, CustomerName = "Jane Smith", Amount = 2000, InterestRate = 0.06m, TermInMonths = 24 }
            };

            _mockLoanService.Setup(x => x.GetAllLoansAsync())
                .ReturnsAsync(expectedLoans);

            // Act
            var result = await _controller.GetLoans();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsAssignableFrom<IEnumerable<Loan>>(okResult.Value);
            Assert.Equal(2, returnValue.Count());
            Assert.Equal(expectedLoans[0].CustomerName, returnValue.First().CustomerName);
            Assert.Equal(expectedLoans[1].CustomerName, returnValue.Last().CustomerName);
        }

        [Fact]
        public async Task GetLoan_WithValidId_ReturnsOkResult_WithLoan()
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

            _mockLoanService.Setup(x => x.GetLoanByIdAsync(1))
                .ReturnsAsync(expectedLoan);

            // Act
            var result = await _controller.GetLoan(1);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<Loan>(okResult.Value);
            Assert.Equal(expectedLoan.Id, returnValue.Id);
            Assert.Equal(expectedLoan.CustomerName, returnValue.CustomerName);
        }

        [Fact]
        public async Task GetLoan_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            _mockLoanService.Setup(x => x.GetLoanByIdAsync(1))
                .ReturnsAsync((Loan)null);

            // Act
            var result = await _controller.GetLoan(1);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task CreateLoan_WithValidLoan_ReturnsCreatedAtAction()
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

            _mockLoanService.Setup(x => x.CreateLoanAsync(It.IsAny<Loan>()))
                .ReturnsAsync(createdLoan);

            // Act
            var result = await _controller.CreateLoan(newLoan);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnValue = Assert.IsType<Loan>(createdAtActionResult.Value);
            Assert.Equal(createdLoan.Id, returnValue.Id);
            Assert.Equal(createdLoan.CustomerName, returnValue.CustomerName);
        }

        [Fact]
        public async Task UpdateLoan_WithValidLoan_ReturnsNoContent()
        {
            // Arrange
            var loan = new Loan
            {
                Id = 1,
                CustomerName = "John Doe",
                Amount = 1500,
                InterestRate = 0.05m,
                TermInMonths = 12
            };

            _mockLoanService.Setup(x => x.UpdateLoanAsync(It.IsAny<Loan>()))
                .ReturnsAsync(loan);

            // Act
            var result = await _controller.UpdateLoan(1, loan);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task UpdateLoan_WithMismatchedId_ReturnsBadRequest()
        {
            // Arrange
            var loan = new Loan
            {
                Id = 2,
                CustomerName = "John Doe",
                Amount = 1500,
                InterestRate = 0.05m,
                TermInMonths = 12
            };

            // Act
            var result = await _controller.UpdateLoan(1, loan);

            // Assert
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public async Task DeleteLoan_WithValidId_ReturnsNoContent()
        {
            // Arrange
            _mockLoanService.Setup(x => x.DeleteLoanAsync(1))
                .Returns(Task.CompletedTask);

            // Act
            var result = await _controller.DeleteLoan(1);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }
    }
} 