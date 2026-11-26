# Data request: early payoff pilot, funnel and metrics

**Type:** Data request · **Priority:** Medium · **Requested by:** Product (early repayment) · **Sprint:** Training lab

## Background

Pelunasan Dipercepat (`docs/prd-early-repayment.md`) has run as a pilot since September 2026. Every step of a quote is recorded as an event in `analytics.payoff_events`. Product wants to know whether borrowers who request a quote go on to pay, and what the feature earns, before rolling it out to everyone.

Pilot data covers 1 Sep 2026 to 16 Nov 2026, so November is a partial month. All data is synthetic.

## Source data

`analytics.payoff_events` in the practice database (`pnpm db:up`). Schema: `packages/db/src/schema.ts`.

- **One row per event, not per quote.** A quote has two to three events.
- Event types: `quote_created`, `quote_confirmed`, `quote_expired`, `payment_received`, `payment_rejected_underpayment`.
- Each row repeats the quote breakdown: `outstanding_principal`, `overdue_interest`, `accrued_interest`, `late_fees`, `early_repayment_fee`, `total`. `amount_paid` is set on payment events only.
- `occurred_at` is a `timestamptz`. Other tables: `loans`, `installments`, `borrowers`.

## Definitions

| Term | Definition |
|---|---|
| Quote | One `quote_id` |
| Quote date, month | The date of its `quote_created` event in Asia/Jakarta (WIB), never UTC |
| Paid | The quote has a `payment_received` event. `payment_rejected_underpayment` is not paid |
| Expired | The quote has a `quote_expired` event |
| Fee revenue | Sum of `early_repayment_fee` of paid quotes |

## Data Engineer: payoff funnel model

Build `payoff_funnel` (a view or table) in `db/models/`.

- **Grain:** one row per `quote_id`.
- **Columns:** `quote_id`, `loan_id`, `borrower_id`, `quote_date` (WIB), `created_at`, `confirmed_at`, `paid_at`, `expired_at`, `final_status` (`paid`, `rejected_underpayment`, `expired` or `confirmed`), `total`, `early_repayment_fee`, `amount_paid`.
- **No PII:** no NIK, phone, email, name or bank account. Keep `borrower_id` only.
- **Checks** (each is a SQL query that must return zero rows):
  1. `quote_id` is unique in the model.
  2. Every quote has exactly one `quote_created` event.
  3. No quote is both paid and expired.
  4. `total` equals the sum of its five components on every event.
  5. Every paid quote has `amount_paid` greater than or equal to `total`.

## Data Analyst: questions

1. What share of quotes were paid, per month from September to November 2026 (WIB)?
2. What was the fee revenue per month?
3. How many quotes were created per day in November 2026 (WIB)?
4. Stretch: how much interest was waived on paid quotes (interest of installments due after the payment date)?

Deliver the SQL in `db/analysis/`, the result tables, and two or three sentences per question. State every assumption.

## Definition of done

- [ ] Dates bucketed in WIB
- [ ] Amounts in whole rupiah, never fractional
- [ ] No PII in any output
- [ ] Every model check returns zero rows
- [ ] Numbers reviewed by a teammate (human), not only by AI
