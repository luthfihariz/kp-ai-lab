---
name: money-calc
description: Write or change any money calculation in apps/api: amounts, fees, totals, interest. Use when asked to compute or add an amount in rupiah. Not for frontend formatting.
paths: "apps/api/**"
---
1. Money is whole rupiah in a number and must stay an integer. Never Math.round, toFixed or floats on money.
2. Percentages in basis points with mulBps from src/money.ts; any division with divRoundHalfUp. Round each component, then add them.
3. Check every worked example in references/money-examples.md that touches your calculation, and add one Vitest case per example (it.each).
4. Run pnpm --filter @kp/api test until it is green. Don't change existing tests to make yours pass.
