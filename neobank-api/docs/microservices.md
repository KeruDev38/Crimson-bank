# Microservices Architecture

This repository currently runs as one Spring Boot deployable with clear internal service boundaries. That is the safest intermediate shape before extracting physical microservices because the API contract, database migrations, DTOs, and CI can stabilize first.

## Target Services

| Service | Responsibility | Owns Data |
| --- | --- | --- |
| API Gateway | Routing, CORS, auth enforcement, request correlation | No business tables |
| Identity Service | Registration, login, JWT issuance, users, MFA, sessions, trusted devices | `users`, `user_roles`, `auth_sessions`, `trusted_devices` |
| Account Service | Accounts, balances, limits, cards, beneficiaries | `accounts`, `bank_cards`, `beneficiaries` |
| Transaction Service | Deposits, withdrawals, transfers, ledger records, transaction risk metadata | `transactions` |
| Compliance Service | KYC profiles, audit trail, sanctions and risk workflows | `customer_profiles`, `audit_logs` |

## Extraction Order

1. Keep this app as the public API while the frontend integrates against DTOs.
2. Extract Identity Service first because it has the clearest boundary and public auth contract. Initial source lives in `services/identity-service`.
3. Extract Account Service and move account reads/writes behind service APIs. Initial source lives in `services/account-service`.
4. Extract Transaction Service last because it coordinates money movement and needs idempotency, locking, and event publication. Initial source lives in `services/transaction-service`.
5. Add asynchronous events after the synchronous service contracts are stable.

## Communication

Start with REST between services for clarity:

- Identity validates users and issues JWTs.
- Account exposes owned account lookups and balance mutation commands.
- Transaction creates ledger entries and calls Account for balance changes.

Move to events for side effects:

- `UserRegistered`
- `AccountCreated`
- `TransactionCompleted`
- `TransactionFailed`
- `KycStatusChanged`

## Database Rule

Each extracted service gets its own schema or database. Other services cannot query those tables directly. During the transition, Flyway migrations remain in this API until the owning service is extracted.

## DevOps Baseline

GitHub Actions now provides:

- Java 21 setup
- Maven dependency cache
- PostgreSQL service for integration tests
- Maven test and package steps
- Docker image build validation
- GHCR publish on pushes to `main`
- Dependabot for Maven, Docker, and GitHub Actions updates

## Gateway Template

The future extracted topology is sketched in:

- `infra/nginx/microservices-gateway.conf`
- `infra/docker-compose.microservices.example.yml`

Keep using the root `docker-compose.yml` until the physical service extraction is complete.
