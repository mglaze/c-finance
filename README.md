# Credit Card Loan Dashboard Demo

This project demonstrates a modern banking application with a focus on testing and CI/CD practices. The application provides a dashboard for managing credit card loans.

## Technology Stack

- **Backend**: .NET Core 8.0
- **Frontend**: React 18 with TypeScript
- **Database**: PostgreSQL
- **Caching**: Redis
- **Testing**: 
  - xUnit for backend unit tests
  - Playwright for E2E testing
  - Jest for frontend unit tests
- **CI/CD**: GitHub Actions

## Project Structure

```
.
├── src/
│   ├── CreditCardLoan.API/        # Backend API
│   ├── CreditCardLoan.Core/       # Core business logic
│   ├── CreditCardLoan.Infrastructure/ # Data access and external services
│   └── CreditCardLoan.Web/        # React frontend
├── tests/
│   ├── CreditCardLoan.UnitTests/  # Backend unit tests
│   ├── CreditCardLoan.IntegrationTests/ # Backend integration tests
│   └── CreditCardLoan.E2ETests/   # End-to-end tests
└── docker/                        # Docker configuration files
```

## Getting Started

### Prerequisites

- .NET 8.0 SDK
- Node.js 18+
- Docker and Docker Compose
- PostgreSQL 15+
- Redis 7+

### Running the Application

1. Start the infrastructure:
```bash
docker-compose up -d
```

2. Run the backend:
```bash
cd src/CreditCardLoan.API
dotnet run
```

3. Run the frontend:
```bash
cd src/CreditCardLoan.Web
npm install
npm start
```

### Running Tests

```bash
# Backend tests
dotnet test

# Frontend tests
cd src/CreditCardLoan.Web
npm test

# E2E tests
cd tests/CreditCardLoan.E2ETests
dotnet test
```

## CI/CD Pipeline

The project includes a GitHub Actions workflow that:
1. Builds the application
2. Runs all tests
3. Generates test reports
4. Builds and pushes Docker images
5. Deploys to staging environment

## Test Reports

Test reports are generated in multiple formats:
- HTML reports for unit tests
- Allure reports for E2E tests
- JUnit XML reports for CI integration

Reports can be found in the `test-results` directory after running tests. 