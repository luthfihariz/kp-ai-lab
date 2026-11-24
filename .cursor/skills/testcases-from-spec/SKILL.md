---
name: testcases-from-spec
description: Turn a spec (OpenSpec scenarios or PRD acceptance criteria) into a test-case table.
disable-model-invocation: true
---
The user gives a spec file after the command, and optionally the scenario or AC ids.
1. Read every scenario (or the named ACs) and the business rules in that file.
2. For each, write at least one positive and one negative case, plus edge cases (end of month, another borrower, bad input).
3. Pick a seed loan and user for each case from the README table (LN-1001 to LN-2001, Budi and Siti).
4. Output a table: ID, scenario, type (API or E2E), data (loan, user), steps, expected result in whole rupiah.
Do not write test code, and do not map cases to existing tests (the test-gap-auditor does that in Session 3).
