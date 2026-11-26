---
name: model-from-metric
description: Turn a metric definition into a SQL model with checks.
disable-model-invocation: true
---
The user gives a metric definition or a request file after the command.
1. State the grain in one sentence and the source tables (schema in packages/db/src/schema.ts).
2. Write the model in db/models/<name>.sql, dates in Asia/Jakarta, no PII columns.
3. Write the data-quality checks as SQL queries that return zero rows when the data is clean.
4. Tell me the commands to run them (docker compose exec db psql -U lab -d lab). Don't invent results.
