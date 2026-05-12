# GitHub Actions

## CI Workflow

Workflow file: `.github/workflows/ci.yml`

Runs on:

- Pull requests to `main` and `develop`
- Pushes to `main` and `develop`

Jobs:

- `test`: starts PostgreSQL, runs Maven tests, packages the JAR, uploads the artifact.
- `docker`: validates Docker image build, then publishes to GitHub Container Registry on pushes to `main`.
- `identity-test`: starts an identity PostgreSQL database and runs the extracted Identity Service tests.
- `account-test`: starts an account PostgreSQL database and runs the extracted Account Service tests.
- `transaction-test`: starts a transaction PostgreSQL database and runs the extracted Transaction Service tests.
- `compliance-test`: starts a compliance PostgreSQL database and runs the extracted Compliance Service tests.

## Required Secrets

The current workflow uses the built-in `GITHUB_TOKEN` for GitHub Container Registry publishing. No custom repository secrets are required for CI.

For production deployment later, add environment-specific secrets such as:

- `PROD_DB_HOST`
- `PROD_DB_NAME`
- `PROD_DB_USERNAME`
- `PROD_DB_PASSWORD`
- `PROD_JWT_SECRET`

## Image Tags

On pushes to `main`, the workflow publishes:

- `ghcr.io/<owner>/<repo>:latest`
- `ghcr.io/<owner>/<repo>:<commit-sha>`
- `ghcr.io/<owner>/<repo>-identity-service:latest`
- `ghcr.io/<owner>/<repo>-identity-service:<commit-sha>`
- `ghcr.io/<owner>/<repo>-account-service:latest`
- `ghcr.io/<owner>/<repo>-account-service:<commit-sha>`
- `ghcr.io/<owner>/<repo>-transaction-service:latest`
- `ghcr.io/<owner>/<repo>-transaction-service:<commit-sha>`
- `ghcr.io/<owner>/<repo>-compliance-service:latest`
- `ghcr.io/<owner>/<repo>-compliance-service:<commit-sha>`

## Local Equivalent

Run the same verification locally:

```bash
mvn test
docker build -t neobank-api:local .
```

`mvn test` requires PostgreSQL to be running with the environment values used by `application.yml`.
