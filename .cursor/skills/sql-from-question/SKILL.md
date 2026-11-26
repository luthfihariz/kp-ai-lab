---
name: sql-from-question
description: Answer one business question with SQL and sanity checks.
disable-model-invocation: true
---
The user gives a question after the command.
1. Restate the question and list your assumptions (definitions, time zone, date range).
2. Write the SQL in db/analysis/<name>.sql, dates in Asia/Jakarta, counting distinct ids (quote_id, loan_id) rather than rows.
3. Write three sanity checks (row counts, totals that should match, a known value).
4. Explain in two sentences how to read the result. Don't invent numbers: I run the SQL.
