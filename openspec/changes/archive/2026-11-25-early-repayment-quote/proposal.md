# Proposal

## Why

Borrowers who can pay a loan off early still have to ask customer service for a manual figure. The API can already show a loan, but it cannot say what closing that loan costs today. The quote is the first step of Pelunasan Dipercepat (KP-422): the amount and the breakdown, before any payment.

## What Changes

- Add `POST /api/loans/{id}/early-repayment/quote`, matching the `early-repayment` contract: a 201 quote whose components sum to `total`.
- Calculate outstanding principal, overdue interest, accrued interest, late fees, and the early repayment fee from the loan and `APP_TODAY`. The fee is waived when one unpaid installment remains.
- Return a deterministic `quoteId` and a `validUntil` of 23:59:59 WIB on the quote day.
- Reject a missing or foreign loan with 404 `LOAN_NOT_FOUND`, and a loan that is not `ACTIVE` with 409 `LOAN_NOT_ACTIVE`. Log ids only.
- Leave confirm, the virtual account, and the payment callback out of this change. Do not add a table or write `analytics.payoff_events`.

## Capabilities

### New Capabilities

- `early-repayment`: Quoting the amount required to close an active loan today, including the breakdown, the fee waiver, quote identity, and expiry.

### Modified Capabilities

## Impact

- `apps/api`: new quote route beside the existing loan routes, calculation in `src/repayment`, and unit plus request tests. `earlyRepaymentAdminFee` gains the unpaid-installment count so the last installment is free.
- Contract: implement the existing quote operation in `contract/openapi.yaml`. No new error code and no change to loan list or loan detail.
- Database: read `loans` and `installments` only. `APP_TODAY` stays the lab clock (default `2026-11-16`).
