# Design

## Context

See proposal.md for why this change exists. Requirements are in specs/early-repayment/spec.md.

The API is Hono. `createApp` mounts auth and loan routes and passes `APP_TODAY` (default `2026-11-16`) into the loan routes. `requireBorrower` turns a `demo-{borrowerId}` bearer token into `borrowerId`. `loanById` loads a loan with its schedule. `outstandingPrincipal` already sums unpaid principal. Errors go through `httpError(status, code, message)`.

`src/repayment/index.ts` only exports `earlyRepaymentAdminFee(outstandingPrincipal)`. It applies 1% with `mulBps`, then the Rp 10.000 floor and Rp 500.000 cap. It does not know how many installments are unpaid, so a last installment still pays the floor. `daysBetween` in `money.ts` takes `Date` values and is what the installment schedule uses. Amounts stay integers via `divRoundHalfUp`.

There is no quote table. `analytics.payoff_events` is seeded reporting data with a different quote id scheme.

## Goals / Non-Goals

**Goals:**

- A pure function from `(loan, today)` to the quote body, plus a thin route that enforces auth, ownership, and status.
- One half-up rounding per component, calendar-day accrual, and the last-installment fee waiver.
- Request tests against the seeded loans, and unit tests for month lengths the seed does not cover.

**Non-Goals:**

- Confirm, a virtual account, or the payment callback.
- A new table, or any insert into `analytics.payoff_events`.
- Changing `GET /api/loans/{id}`, including the unmasked borrower fields that endpoint already returns.
- Changing the day count the installment schedule uses.

## Decisions

### Stateless quote

The quote is recomputed on every POST. `quoteId` is `Q-{loanId}-{yyyyMMdd}` from `APP_TODAY`, and `validUntil` is the string `{today}T23:59:59+07:00`. A second call the same day returns the same id and the same body with 201 again.

A stored quote would only pay off once confirm or the callback must freeze the amount. Both are out of this change. Deriving the id also avoids writing the analytics table, whose ids look like `Q-00001`.

### Accrual rounds once, on calendar days

```
accruedInterest = divRoundHalfUp(outstandingPrincipal * monthlyInterestRateBps * days, 10_000 * 30)
```

`mulBps` and then dividing by 30 rounds twice. The denominator is 300_000 only because the rate is in basis points and the month is 30 days; keep it as `10_000 * 30` at the call site so the two factors stay visible.

`days` is the actual calendar difference, not `daysBetween`. Add a calendar-day helper that parses both `YYYY-MM-DD` values as UTC dates and subtracts. ISO date strings compare in order, so the period start is the maximum `dueDate` that is `<= today` across every installment, paid or unpaid. When none exists, the start is `disbursedAt`. When today is itself a due date, days are 0 and that installment is not overdue (`dueDate < today` is the overdue test). That is the spec scenario, not an accident.

Worked check, `LN-1001` on `2026-11-16`: period start `2026-11-14`, 2 days, `2_000_000 * 300 * 2 / 300_000 = 4_000`.

Overdue check, `LN-1002` on the same day: unpaid principal `2_000_000`, overdue interest `90_000` (due `2026-10-20`), period start `2026-10-20`, 27 calendar days, accrued `54_000`, late fees `75_000`, fee `20_000`, total `2_239_000`.

### Fee waiver is an argument, applied before the clamp

Extend `earlyRepaymentAdminFee(outstandingPrincipal, unpaidCount)`. When `unpaidCount` is 1, return 0. Otherwise `mulBps(outstandingPrincipal, 100)`, then the existing floor and cap. The waiver has to win over the Rp 10.000 minimum: `1_500_000` with one installment unpaid is 0, not `10_000`.

### Route sits next to the loan routes

`src/repayment/routes.ts` owns `POST /:id/early-repayment/quote` and is mounted at `/api/loans` from `createApp`, with the same `db` and `today`. It uses `requireBorrower`. Order of checks: missing token (middleware) → load loan → missing or `borrowerId` mismatch → 404 `LOAN_NOT_FOUND` → status not `ACTIVE` → 409 `LOAN_NOT_ACTIVE` → 201 quote. The 404-before-409 order is what keeps another borrower's paid-off loan from answering 409.

The log line is `loanId`, `borrowerId`, and `quoteId`. It does not include the borrower row.

`validUntil` is concatenated from `today`. `Date.toISOString()` would emit `Z` and shift the calendar day.

## Risks / Trade-offs

- [Quote amount can change if the schedule changes later the same day] → Accepted. Nothing else in this change writes installments, and the quote is defined as the loan's state on `APP_TODAY`.
- [Today equal to a due date charges neither that installment's interest nor a day's accrual] → Locked by the spec scenario. Cover it with a unit test so a later "helpful" change is visible.
- [Callers may pass `daysBetween` into accrual] → The February, leap-day, and 31-day cases live in the unit tests. `2026-01-31` to `2026-02-28` is 28 calendar days.
- [`earlyRepaymentAdminFee` gains a parameter] → It is not on the HTTP contract. Update its unit tests in the same change.
- [Loan detail still returns a raw NIK, phone, and bank account] → Left as it is. The quote response is a different shape and must not copy the borrower object.

## Migration Plan

No schema change and no data backfill. Rollback is removing the route and the calculation. Existing loan and auth routes stay in place.
