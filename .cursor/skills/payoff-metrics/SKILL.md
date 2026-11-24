---
name: payoff-metrics
description: Answer questions about early-repayment quotes, payments and conversion. Use when asked about quotes, paid, conversion, fee revenue or the payoff funnel.
paths: "db/analysis/**"
---
1. Name the metric and read its definition in references/metrics.md. If the question needs a metric that isn't there, say so before writing SQL.
2. Dates in WIB: (occurred_at AT TIME ZONE 'Asia/Jakarta').
3. Count quotes with COUNT(DISTINCT quote_id), never COUNT(*) on events.
4. Every percentage comes with its base count and date range, e.g. "4 of 12 (33,3%), 1 to 16 Nov".
5. Save the SQL in db/analysis/ and show the psql command: psql "postgres://lab:lab@127.0.0.1:5499/lab" -f <file>. No PII columns in the output.
