# Data models

Data Engineers put their models and checks here. The `sample-*.sql` files are starting points that show the tables and the house style; they answer none of the lab questions in `docs/data-req/`.

Run a file against the lab database (`pnpm db:up` first):

```bash
docker compose exec -T db psql -U lab -d lab < db/models/sample-explore.sql
```

| Sample | Shows |
|---|---|
| `sample-explore.sql` | Tables, columns and row counts |
| `sample-loan-summary-model.sql` | A model with a stated grain and no PII |
| `sample-loan-summary-checks.sql` | Checks that return zero rows when the data is clean |

House style:

- Amounts are whole rupiah in `bigint`. Never cast to `numeric` or `float` for money; round only shares and averages, and say so.
- `analytics.payoff_events.occurred_at` is a `timestamptz`. Bucket it with `AT TIME ZONE 'Asia/Jakarta'`, never in UTC.
- `analytics.payoff_events` has one row per event. Count quotes with `count(DISTINCT quote_id)`.
- No PII in any output: no name, NIK, phone, email or bank account. Keep `borrower_id`.
- All data is synthetic.
