# ADR 0001: Microservices Cutover Strategy

## Status

Accepted

## Decision

The existing root Spring Boot API remains as a temporary compatibility app while the extracted services stabilize. The target production topology is the gateway plus extracted services:

- `identity-service`
- `account-service`
- `transaction-service`
- `compliance-service`

The frontend should keep using the same public paths through the gateway:

- `/api/auth/**`
- `/api/accounts/**`
- `/api/transactions/**`
- `/api/compliance/**`

After the gateway-backed services pass smoke and integration tests, the root API should be retired or converted into a thin backend-for-frontend only if the frontend needs aggregation endpoints.

## Rationale

Keeping the root API temporarily reduces migration risk. The frontend contract remains stable while service ownership, databases, Docker images, and CI jobs are separated.

## Consequences

- Short term: duplicated endpoint behavior exists in the root API and extracted services.
- Medium term: gateway routing becomes the source of truth.
- Long term: the root API should not own banking domain data or business rules.
