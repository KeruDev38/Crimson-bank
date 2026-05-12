# Service Boundaries

Use these package boundaries while the app is still one deployable:

| Package | Future Service |
| --- | --- |
| `controller.AuthController`, `service.AuthService`, `security.*` | Identity Service |
| `controller.AccountController`, `service.AccountService` | Account Service |
| `controller.TransactionController`, `service.TransactionService` | Transaction Service |
| `domain.CustomerProfile`, `domain.AuditLog` | Compliance Service |
| `dto.*`, `exception.*`, `config.*` | Shared API/kernel candidates |

## Rules

- Controllers depend only on DTOs and services.
- Services own business rules and transactions.
- Repositories stay behind services.
- Do not return JPA entities from controllers.
- New frontend-facing fields should be added to DTOs first.
- New microservice APIs should copy DTOs into service-owned contracts, not import classes across services.

## Extracted Services

- `services/identity-service`
- `services/account-service`
- `services/transaction-service`
- `services/compliance-service`
