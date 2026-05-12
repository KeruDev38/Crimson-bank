# Crimson NeoBank API

A secure and robust banking API built with Spring Boot microservices, Java 21, PostgreSQL, Flyway, and JWT authentication.

## Features

- **Microservices Architecture**: 4 independent services (Identity, Account, Transaction, Compliance)
- **User Management**: Registration and authentication with JWT tokens
- **Account Management**: Create and manage bank accounts with limits
- **Transaction Processing**: Deposits, withdrawals, and transfers with ACID compliance
- **Compliance & KYC**: Profile management and verification
- **Security**: JWT-based authentication and authorization
- **Database Migrations**: Flyway-managed schema evolution
- **RESTful API**: DTO-based REST endpoints for all operations
- **API Gateway**: Nginx reverse proxy for service routing
- **DevOps**: GitHub Actions CI with PostgreSQL, Maven, Docker build validation, and GHCR publishing

## Prerequisites

- Docker & Docker Compose (recommended)
- Java 21 (for local development)
- Maven 3.6+ (for local development)

## Quick Start with Docker

1. **Start all services:**
   ```bash
   docker-compose -f docker-compose.microservices.yml up -d
   ```

2. **Check logs:**
   ```bash
   docker-compose -f docker-compose.microservices.yml logs -f
   ```

3. **Stop services:**
   ```bash
   docker-compose -f docker-compose.microservices.yml down
   ```

The API will be available at `http://localhost:8080`

## Local Development

### Database Setup

Each service requires its own PostgreSQL database. Use Docker for databases:

```bash
# Start databases only
docker-compose -f docker-compose.microservices.yml up -d identity-db account-db transaction-db compliance-db

# Or start all databases
docker-compose -f docker-compose.microservices.yml up -d *-db
```

### Running Individual Services

1. **Set Java 21 in JAVA_HOME**
2. **Run a service:**
   ```bash
   cd services/{service-name}
   mvn spring-boot:run
   ```

Service ports:
- Identity Service: 8081
- Account Service: 8082
- Transaction Service: 8083
- Compliance Service: 8084
- API Gateway: 8080

### Environment Variables

Services use these environment variables (configured in docker-compose):

```env
SERVER_PORT=8081
DB_HOST=identity-db
DB_NAME=identity
DB_USERNAME=identity_user
DB_PASSWORD=identity_password
JWT_SECRET=changeMeToASecretKeyThatIsAtLeast32CharactersLong
```

## API Endpoints

All endpoints are prefixed with `/api/` and require JWT authentication (except auth endpoints).

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Accounts (`/api/accounts`)
- `GET /api/accounts` - Get user's accounts
- `POST /api/accounts` - Create a new account
- `GET /api/accounts/{accountNumber}` - Get account details

### Transactions (`/api/transactions`)
- `GET /api/transactions` - Get user's transaction history
- `POST /api/transactions/deposit` - Deposit money
- `POST /api/transactions/withdraw` - Withdraw money
- `POST /api/transactions/transfer` - Transfer money

### Compliance (`/api/compliance`)
- `GET /api/compliance/profile` - Get KYC profile
- `PUT /api/compliance/profile` - Update profile
- `POST /api/compliance/profile/verify` - Verify profile
- `GET /api/compliance/audit-logs` - View audit logs

## Testing

### Unit Tests
```bash
mvn test
```

### Integration Tests
```bash
mvn verify
```

### Smoke Tests
```bash
./scripts/smoke-test.ps1
```

## Database Schema

Each service has its own database schema managed by Flyway migrations in `src/main/resources/db/migration/`.

## Security

- JWT tokens with configurable expiration
- BCrypt password hashing
- CORS configuration for frontend
- Input validation with Bean Validation
- Audit logging for compliance

## Monitoring

Services expose health endpoints:
- `GET /actuator/health` - Health check
- `GET /actuator/info` - Application info

## Deployment

### Docker Images
```bash
# Build all services
docker-compose -f docker-compose.microservices.yml build

# Push to registry
docker-compose -f docker-compose.microservices.yml push
```

### Production Considerations
- Use external databases
- Configure proper JWT secrets
- Set up monitoring and logging
- Configure HTTPS/TLS
- Set up load balancing

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 8080-8084 are available
2. **Database connection**: Check PostgreSQL containers are running
3. **JWT token issues**: Verify JWT_SECRET is set correctly
4. **CORS errors**: Check frontend is running on correct port

### Logs
```bash
# View all logs
docker-compose -f docker-compose.microservices.yml logs

# View specific service logs
docker-compose -f docker-compose.microservices.yml logs identity-service
```

## Contributing

1. Follow the existing code structure
2. Add tests for new features
3. Update documentation
4. Ensure all tests pass
5. Submit pull request

## License

MIT License
- `POST /api/transactions/deposit` - Deposit money
- `POST /api/transactions/withdraw` - Withdraw money
- `POST /api/transactions/transfer` - Transfer between accounts

## Security

All endpoints except `/api/auth/**` require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Database Schema

The application uses Flyway for database migrations. The schema includes:

- `users` - User accounts
- `accounts` - Bank accounts (linked to users)
- `transactions` - Transaction records

## Development

- Run tests: `mvn test`
- Build JAR: `mvn package`
- Clean build: `mvn clean compile`

Tests start the Spring context and require PostgreSQL. Use `docker compose up -d postgres` before `mvn test` for the default local setup.

## Docker

Run the API and PostgreSQL locally:

```bash
docker compose up --build
```

The API runs at `http://localhost:8080`.

## CI/CD

GitHub Actions lives in `.github/workflows/ci.yml`.

The pipeline:

- Starts PostgreSQL for integration tests
- Runs `mvn test`
- Packages the application
- Builds the Docker image
- Publishes to GitHub Container Registry on pushes to `main`

See `docs/github-actions.md` for details.

## Microservices Direction

The API has been extracted into standalone microservices. Use the top-level Docker Compose file below to start the gateway and all services.

- `docker-compose.microservices.yml`
- `docs/microservices.md`
- `docs/service-boundaries.md`
- `infra/docker-compose.microservices.example.yml`
- `docs/integration-tests.md`
- `docs/adr-0001-microservices-cutover.md`
- `scripts/smoke-test.ps1`

Extracted services currently live in:

- `services/identity-service`
- `services/account-service`
- `services/transaction-service`
- `services/compliance-service`

## Architecture

- **Controller Layer**: REST endpoints
- **DTO Layer**: Stable frontend-facing request and response contracts
- **Service Layer**: Business logic and transaction boundaries
- **Repository Layer**: Data access with Spring Data JPA
- **Security Layer**: JWT authentication and authorization
- **Database Layer**: PostgreSQL with Flyway migrations
