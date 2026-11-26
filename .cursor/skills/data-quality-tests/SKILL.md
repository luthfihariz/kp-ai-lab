---
name: data-quality-tests
description: Write data-quality checks for a table or model. Use when asked for data quality, DQ checks, tests for a table, or to validate a model.
paths: "db/**"
---
1. State the table's grain in one sentence (one row per …).
2. Copy assets/dq-template.sql to db/tests/<table>_checks.sql.
3. One check per rule. Each check is a SELECT that returns zero rows when the data is clean: unique grain, required columns not null, allowed values, totals that equal their parts.
4. Never select NIK, phone, email or account columns into the output; select ids only.
5. Finish with the psql command to run it: psql "postgres://lab:lab@127.0.0.1:5499/lab" -f <file>. Don't claim a result you didn't run.
