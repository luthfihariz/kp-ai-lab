# Analysis

Data Analysts put their analysis SQL here. The `sample-*.sql` files are starting points that show the tables and the house style; they answer none of the lab questions in `docs/data-req/`.

Run a file against the lab database (`pnpm db:up` first):

```bash
docker compose exec -T db psql -U lab -d lab < db/analysis/sample-portfolio-by-status.sql
```

| Sample | Shows |
|---|---|
| `sample-portfolio-by-status.sql` | Counts and amounts per group |
| `sample-disbursement-by-tenor.sql` | Monthly buckets on a `date` column |
| `sample-events-by-type-wib.sql` | WIB buckets on a `timestamptz` column, and events versus quotes |
| `sample-borrowers-by-city.sql` | Aggregates instead of rows, and masking when rows are needed |

House style:

- Amounts are whole rupiah in `bigint`. Never cast to `numeric` or `float` for money; round only shares and averages, and say so.
- `analytics.payoff_events.occurred_at` is a `timestamptz`. Bucket it with `AT TIME ZONE 'Asia/Jakarta'`, never in UTC.
- `analytics.payoff_events` has one row per event. Count quotes with `count(DISTINCT quote_id)`.
- No PII in any output: no name, NIK, phone, email or bank account. Keep `borrower_id`.
- All data is synthetic.
