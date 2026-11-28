# Infra request: container and CI for the API

**Type:** Infra request · **Priority:** High · **Requested by:** Engineering (early repayment) · **Sprint:** Training lab

## Background

Pelunasan Dipercepat (`docs/prd/prd-early-repayment.md`) adds new endpoints to the API in `apps/api`. Today the API only runs on laptops with `pnpm dev`. Before the feature can ship, the API needs a container image and a CI pipeline that blocks a bad merge.

All data in the lab is synthetic. Treat it as if it were real customer data anyway.

## Scope

The API only (`apps/api` and the packages it uses). The web app, the QA project and real deployment are out of scope.

## What the API needs at runtime

| Item | Value |
|---|---|
| Runtime | Node.js 20.19 or newer (`engines` in `package.json`), pnpm (version in `package.json` `packageManager`), Turborepo monorepo |
| Entry point | `apps/api/src/index.ts` (TypeScript; today it runs through `tsx`) |
| Port | 8080 |
| Database | Postgres 16, from `DATABASE_URL` |
| Other environment | `APP_TODAY` (lab date, optional), `SENTRY_DSN` (optional), `NODE_ENV` |
| Local stack | `compose.yaml` (Postgres on 5499), `pnpm db:up` migrates and seeds |

## Requirements

### 1. Container image

- Multi-stage build. Use `turbo prune @kp/api --docker` so the image only holds the API and its workspace packages.
- Runs as a non-root user.
- No dev dependencies, tests or source maps the API does not need in the final stage.
- No secret values in the image or the Dockerfile. Configuration comes from environment variables at run time.
- The container exposes port 8080 and has a health check.

### 2. Health route

- `GET /health` returns 200 when the API can reach Postgres, and 503 when it cannot.
- No authentication, no personal data in the response.
- Add it to `contract/openapi.yaml` so FE and QA know it exists.

### 3. CI pipeline

Pick the CI tool your team uses. On every pull request:

1. Install with a frozen lockfile.
2. Typecheck and unit tests (scripts from `package.json`).
3. Start Postgres 16 as a service, migrate and seed, start the API, then run the Playwright API tests (`pnpm --filter @kp/qa test:api`).
4. Build the container image (no push).
5. Leak gate (below).

Any failing step fails the pipeline. Secrets, if any, come from the CI tool's secret store, never from a file in the repo.

### 4. Leak gate

A step that fails the build when the API code logs personal data: NIK, phone number, email or bank account number, or a whole borrower object. It must explain which file and line failed.

## Definition of done

- [ ] `docker build` works from a clean clone, and the container starts and answers `GET /health` with 200 next to `pnpm db:up`
- [ ] The container runs as a non-root user
- [ ] No secret value in any file in the repo
- [ ] The pipeline runs every step above and fails when one fails
- [ ] The leak gate is shown failing on a log line with personal data and passing without it
- [ ] Reviewed by a teammate (human), not only by AI
