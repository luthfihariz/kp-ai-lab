---
name: playwright-e2e
description: Write Playwright e2e tests for the KP lab from acceptance criteria or a user scenario. Use when asked for browser, UI or e2e tests.
paths: "apps/qa/**"
---
1. Read the acceptance criteria or the scenario the user gives (docs/prd/prd-early-repayment.md for AC-1 to AC-12).
2. Copy assets/test-template.spec.ts to apps/qa/tests/<feature>.e2e.spec.ts. The file name must end in .e2e.spec.ts.
3. Log in through the LoginPage page object in apps/qa/pages and use the users in apps/qa/fixtures/users.ts. See references/page-objects.md.
4. Run scripts/check.sh <file> until it exits 0. Never edit check.sh.

Rules: prefer getByRole and getByLabel; never use waitForTimeout; one behaviour per test.