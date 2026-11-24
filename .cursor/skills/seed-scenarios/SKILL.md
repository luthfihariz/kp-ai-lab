---
name: seed-scenarios
description: Choose test data for a QA test: which seed borrower and loan fit a case. Use when writing any API or e2e test for a scenario, or when asked which loan or user to test with.
paths: "apps/qa/**"
---
1. Name the case in one line (overdue, paid off, cancelled, another borrower's loan, …).
2. Look it up in references/seed-loans.md. Use only loans listed there; never invent a loan, a borrower or a NIK.
3. Log in with the users in apps/qa/fixtures/users.ts.
4. Add a one-line comment in the test: why this loan fits the case.
5. If no seed loan fits, say so and stop; don't change the seed.
