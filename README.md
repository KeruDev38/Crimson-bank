# Crimson NeoBank

A modern, secure banking application built with microservices architecture. Features a React frontend and Spring Boot microservices backend with PostgreSQL databases.

## 🏗️ Architecture

This application consists of:

- **Frontend**: React + Vite application with modern UI
- **Backend**: Microservices architecture with 4 services:
  - Identity Service: Authentication & user management
  - Account Service: Account management
  - Transaction Service: Transaction processing
  - Compliance Service: KYC and compliance checks
- **API Gateway**: Nginx reverse proxy routing requests to services
- **Databases**: Separate PostgreSQL instances for each service

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for frontend development)
- Java 21 (for backend development, optional)

### Automated Setup

**Windows:**
```powershell
./setup.ps1
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

### Manual Setup

1. **Start all services with Docker Compose:**
   ```bash
   cd neobank-api
   docker-compose -f docker-compose.microservices.yml up -d
   ```

2. **Start the frontend:**
   ```bash
   cd ../neobank-frontend
   npm install
   npm run dev
   ```

3. **Access the application:**
   - Frontend: http://localhost:5173
   - API Gateway: http://localhost:8080

### Stopping the Application

```bash
cd neobank-api
docker-compose -f docker-compose.microservices.yml down
```

To also remove volumes (⚠️ this will delete all data):
```bash
docker-compose -f docker-compose.microservices.yml down -v
```

### First Time Setup

1. **Register a new user** at http://localhost:5173/register
2. **Login** with your credentials
3. **Create an account** from the dashboard
4. **Start making transactions** (deposits, withdrawals, transfers)

## 📁 Project Structure

```
crimsom/
├── neobank-api/           # Backend microservices
│   ├── services/          # Individual microservices
│   │   ├── identity-service/
│   │   ├── account-service/
│   │   ├── transaction-service/
│   │   └── compliance-service/
│   ├── docker-compose.microservices.yml
│   ├── infra/             # Nginx configuration
│   └── scripts/           # Utility scripts
└── neobank-frontend/      # React frontend
    ├── src/
    │   ├── components/    # React components
    │   ├── contexts/      # React contexts
    │   └── data/          # Mock data (legacy)
    └── public/
```

## 🔧 Development

### Backend Development

Each service can be run individually for development:

```bash
cd neobank-api/services/{service-name}
mvn spring-boot:run
```

Services will run on ports 8081-8084, with the API gateway on 8080.

### Frontend Development

```bash
cd neobank-frontend
npm install
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
```

### Database Access

Each service has its own PostgreSQL database. Connection details are in the docker-compose file.

## 🧪 Testing

### Backend Tests

```bash
cd neobank-api
mvn test
```

### Frontend Tests

```bash
cd neobank-frontend
npm run lint
```

### Smoke Tests

A PowerShell smoke test script is available:

```bash
cd neobank-api/scripts
./smoke-test.ps1
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Accounts
- `GET /api/accounts` - List user accounts
- `POST /api/accounts` - Create new account
- `GET /api/accounts/{accountNumber}` - Get account details

### Transactions
- `GET /api/transactions` - Transaction history
- `POST /api/transactions/deposit` - Deposit money
- `POST /api/transactions/withdraw` - Withdraw money
- `POST /api/transactions/transfer` - Transfer money

### Compliance
- `GET /api/compliance/profile` - Get KYC profile
- `PUT /api/compliance/profile` - Update profile
- `POST /api/compliance/profile/verify` - Verify profile
- `GET /api/compliance/audit-logs` - View audit logs

## 🔒 Security

- JWT-based authentication
- Password hashing with BCrypt
- CORS configuration
- Input validation
- Audit logging

## 🔧 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 8080-8084 and 5173 are available
2. **Docker issues**: Make sure Docker Desktop is running
3. **Database connection**: Services need time to start - wait 30+ seconds
4. **Frontend API errors**: Verify backend is running on port 8080
5. **Permission issues**: On Linux/Mac, you might need `sudo` for Docker

### Checking Service Status

```bash
cd neobank-api
docker-compose -f docker-compose.microservices.yml ps
```

### Viewing Logs

```bash
# All services
docker-compose -f docker-compose.microservices.yml logs -f

# Specific service
docker-compose -f docker-compose.microservices.yml logs -f identity-service
```

### Resetting Everything

```bash
cd neobank-api
docker-compose -f docker-compose.microservices.yml down -v
docker system prune -f
```

Then restart with the setup script.