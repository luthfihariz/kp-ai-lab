# KP Training Lab

Practice P2P lending app for the **AI Productivity for Engineering** training. During the day, Backend, Frontend and QA each build their part of one feature: **Pelunasan Dipercepat** (early loan payoff).

All data in this repo is synthetic. Never paste real customer data into it or into any AI tool.

This repo is a pnpm workspace run by Turborepo.

| Package | Path |
|---|---|
| `@kp/api` | `apps/api`: Hono API |
| `@kp/web` | `apps/web`: React + TypeScript + Vite |
| `@kp/qa` | `apps/qa`: Playwright |
| `@kp/db` | `packages/db`: Drizzle schema, migrations, and the Postgres client |

## What's inside

| Folder         | What it is                                                                            | Already built                                 | Built in the lab                                              |
| -------------- | ------------------------------------------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------- |
| `contract/`    | OpenAPI contract, agreed by FE and BE                                                 | All endpoints, including the new ones         |                                                               |
| `apps/api/`    | Hono API on Node                                                                      | Login, loan list, loan detail with schedule   | Early repayment quote (`src/repayment`)                       |
| `apps/web/`    | React + TypeScript + Vite                                                             | Login, loan list, loan detail                 | Payoff screen (`src/pages/EarlyRepaymentPage.tsx`)            |
| `apps/qa/`     | Playwright tests                                                                      | 4 API tests, 2 E2E tests, a page object       | Early repayment tests (`apps/qa/tests/early-repayment/`)      |
| `packages/db/` | Drizzle schema and migrations                                                         | Borrowers, loans, installments, payoff events |                                                               |
| `docs/`        | PRD, fee rules, ticket KP-421 (copied from Meegle), design notes, data request KP-425 |                                               |                                                               |
| `db/`          | Synthetic Postgres seed (`db/seed.sql`)                                               | Borrowers, loans, installments, payoff events | Your tables, views and models                                 |
| `openspec/`    | OpenSpec specs and changes                                                            | A spec of the existing loan behaviour         | One change per participant (Session 4)                        |
| `.cursor/`     | Cursor rules and skills                                                               | `/onboard-me` and the OpenSpec commands       | Your rules, commands, skills and subagents (Sessions 2 and 3) |

## Prerequisites

| Tool | Version | Check |
|---|---|---|
| Node.js | 20.19 or newer | `node -v` |
| pnpm | 10.6 | `corepack enable && corepack prepare pnpm@10.6.0 --activate`, then `pnpm -v` |
| OpenSpec CLI | 2.x | `pnpm add -g @fission-ai/openspec@latest`, then `openspec --version` |
| Docker | Desktop or Engine, with Compose | `docker compose version` |
| Cursor | 2.4 or newer (skills, subagents, hooks) | Signed in, Agent replies |

Free ports: 5499 (Postgres), 8080 (API), 5173 (web), 4010 (mock). First setup downloads packages, a Chromium build and the `postgres:16` image, so it needs internet. Data roles use `psql`; without it, `docker compose exec db psql -U lab -d lab` works too.

## Setup (once)

```bash
pnpm install
pnpm --filter @kp/qa exec playwright install chromium
```

## Run the app

Start Postgres, apply the Drizzle migrations, and load the seed:

```bash
pnpm db:up
```

Then, in another terminal:

```bash
pnpm dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080
- Log in with **budi@example.com** / **password123**

Stop the apps with `Ctrl+C`. `pnpm db:reset` drops the database volume, migrates, and seeds again.

### About "today"

The API uses a fixed date, **16 Nov 2026**, so every participant sees the same overdue loans and the same quote amounts. Change it with `APP_TODAY=2026-12-01 pnpm dev`. On Windows PowerShell: `$env:APP_TODAY="2026-12-01"; pnpm dev`.

## Frontend against the mock server

Frontend can build the payoff screen before the backend endpoint exists:

```bash
pnpm mock
```

This starts a Prism mock of `contract/openapi.yaml` on port 4010 and the frontend on 5173, proxied to the mock. The mock returns the examples written in the contract.

After any change to the contract, regenerate the frontend types:

```bash
pnpm --filter @kp/web generate:api
```

## Tests

```bash
pnpm test       # API unit tests (no database required)
pnpm test:qa    # Playwright API + E2E tests (run pnpm db:up and pnpm dev first)
```

Run one Playwright project: `pnpm --filter @kp/qa test:api` or `pnpm --filter @kp/qa test:e2e`. Open the last report: `pnpm --filter @kp/qa report`.

## Demo accounts and seed loans

| Account | Password |
|---|---|
| budi@example.com | password123 |
| siti@example.com | password123 |

| Loan | Owner | Scenario on 16 Nov 2026 |
|---|---|---|
| LN-1001 | Budi | Active, on time, 2 installments left |
| LN-1002 | Budi | Active, overdue since 20 Oct, has late fees |
| LN-1003 | Budi | Paid off |
| LN-1004 | Budi | Active, only the last installment left |
| LN-1005 | Budi | Active, disbursed today |
| LN-1006 | Budi | Active, due dates at the end of the month |
| LN-1007 | Budi | Cancelled |
| LN-2001 | Siti | Active, belongs to another borrower |

## Database

Drizzle migrations in `packages/db/drizzle` are the schema. `db/seed.sql` loads the synthetic data after migrate. `borrowers.password` defaults to `password123`, so the seed inserts do not set it.

```bash
pnpm db:up      # start Postgres 16 on 127.0.0.1:5499, migrate, seed
pnpm db:reset   # drop the volume, then migrate and seed again
pnpm db:down    # stop Postgres
pnpm db:studio  # open Drizzle Studio for the lab database
```

Open a shell with `docker compose exec db psql -U lab -d lab` (password `lab`).

Tables: `borrowers`, `loans`, `installments`, and `analytics.payoff_events` (quote created, confirmed, expired, paid). About 150 synthetic borrowers and 300 loans; Budi, Siti and their loans match the app. The API reads and writes this database.

## OpenSpec (Session 4)

OpenSpec is set up for Cursor. Each lab task is one change:

| Step | In Cursor | What happens |
|---|---|---|
| Explore (optional) | `/openspec-explore` | Think through the ticket before writing anything |
| Propose | `/openspec-propose <what you're building>` | Creates `openspec/changes/<name>/` with proposal, specs, design and tasks |
| Apply | `/openspec-apply-change` | Implements the tasks one by one |
| Verify | `/openspec-verify-change` | Checks the code against the change's specs and tasks |
| Archive | `/openspec-archive-change` | Merges the change's specs into `openspec/specs/` and moves the change to the archive |

Check from the terminal with `openspec list` and `openspec validate`. If the commands don't show in Cursor, restart Cursor and check Cursor Settings > Rules.

## The lab task

Start with the ticket, copied from Meegle: [docs/ticket-KP-421.md](docs/ticket-KP-421.md). Rules and acceptance criteria are in [docs/prd-early-repayment.md](docs/prd-early-repayment.md).

## Troubleshooting

| Problem | Fix |
|---|---|
| `address already in use` on 8080, 5173 or 4010 | Another process uses the port. Stop it, or close the old terminal. |
| Frontend shows "Gagal memuat pinjaman" | The API is not running, or Postgres has no seed. Run `pnpm db:up`, then `pnpm dev`. |
| Playwright says the browser is missing | `pnpm --filter @kp/qa exec playwright install chromium` |
| `pnpm db:up` fails with `Cannot connect to the Docker daemon` | Start Docker Desktop and try again. |
| Port 5499 is in use | Another process is using the lab database port. Stop it, or change the port in `compose.yaml` and set `DATABASE_URL`. |
