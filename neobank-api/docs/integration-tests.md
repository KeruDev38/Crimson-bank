# Integration Test Plan

Use this flow after starting the microservices Compose topology.

## Start

```bash
docker compose -f infra/docker-compose.microservices.example.yml up --build
```

## Happy Path

1. Register a user through `POST /api/auth/register`.
2. Log in through `POST /api/auth/login` and capture the bearer token.
3. Create an account through `POST /api/accounts`.
4. Deposit money through `POST /api/transactions/deposit` with an `idempotencyKey`.
5. Repeat the same deposit request with the same `idempotencyKey` and confirm no second balance mutation occurs.
6. Withdraw money through `POST /api/transactions/withdraw`.
7. Create or update the KYC profile through `PUT /api/compliance/profile`.
8. Read transactions, accounts, and compliance profile through their `GET` endpoints.

## Failure Path

1. Attempt to withdraw more than the available balance.
2. Confirm transaction-service returns a transaction with status `FAILED`.
3. Confirm account-service balance remains unchanged.

## Notes

- Identity issues JWTs.
- Account and transaction services validate JWTs with the same `JWT_SECRET`.
- Transaction service calls account-service internal balance APIs with `X-Service-Token`.
- Compliance service exposes internal audit logging with the same service token.
