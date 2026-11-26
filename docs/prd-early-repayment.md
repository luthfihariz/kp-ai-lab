# PRD: Pelunasan Dipercepat (Early Loan Payoff)

| | |
|---|---|
| Status | Ready for development |
| Design | docs/design-early-repayment.md (mockups in docs/design/) |
| API contract | contract/openapi.yaml, tag `early-repayment` |

## Problem

Borrowers who receive money early (salary, bonus, THR) want to close their loan before the tenor ends. Today they must contact customer service, wait for a manual calculation and transfer to a shared account. This is slow, error-prone and generates support tickets.

## Goal

A borrower can see exactly how much it costs to close an active loan today, confirm it, and pay through a virtual account, without contacting customer service.

## Out of scope

- Partial early repayment (paying more than one installment without closing the loan)
- Refunds for overpayment (handled manually for now)
- Payment provider signature verification

## User flow

1. Borrower opens a loan detail page and taps **Pelunasan Dipercepat**.
2. The app requests a quote and shows the breakdown and the total.
3. Borrower taps **Konfirmasi** and receives a virtual account number.
4. Borrower pays. The payment provider calls our callback.
5. The loan becomes **Lunas** (PAID_OFF) and remaining installments are cancelled.

## Business rules

All amounts are whole rupiah (integers, never fractional). Dates use the Asia/Jakarta (WIB) calendar.

### Quote components

| Component | Rule |
|---|---|
| Outstanding principal | Sum of `principal` of all UNPAID installments |
| Overdue interest | Sum of `interest` of UNPAID installments whose due date is before today |
| Accrued interest | Outstanding principal × monthly rate × days ÷ 30. Days = actual calendar days from the start of the current period to today. The current period starts on the latest installment due date on or before today, or on the disbursement date if no due date has passed yet. |
| Late fees | The loan's `lateFees` |
| Early repayment fee | See [Early repayment fee](#early-repayment-fee) below |
| Future interest | Waived. Interest of installments due after today is not charged. |

### Early repayment fee

| Rule | Value |
|---|---|
| Base | 1% of the outstanding principal |
| Rounding | Half-up to whole rupiah |
| Minimum | Rp 10.000 |
| Maximum | Rp 500.000 |
| Waiver | No fee (Rp 0) when only one UNPAID installment remains |

| Outstanding principal | Unpaid installments | Fee |
|---|---|---|
| Rp 2.000.000 | 2 | Rp 20.000 |
| Rp 500.000 | 3 | Rp 10.000 (minimum) |
| Rp 80.000.000 | 6 | Rp 500.000 (maximum) |
| Rp 1.666.668 | 4 | Rp 16.667 (16.666,68 rounded half-up) |
| Rp 1.500.000 | 1 | Rp 0 (last installment) |

### Rounding

Each component is rounded **half-up** to whole rupiah. The total is the sum of the rounded components, so the breakdown always adds up to the total shown.

### Quote validity

A quote is valid until 23:59:59 WIB on the day it was created. After that, confirming it fails and the borrower must request a new quote.

## Acceptance criteria

| ID | Criterion |
|---|---|
| AC-1 | A quote can only be created for an ACTIVE loan. PAID_OFF or CANCELLED loans return 409 `LOAN_NOT_ACTIVE`. |
| AC-2 | A borrower can only quote their own loans. Another borrower's loan returns 404 `LOAN_NOT_FOUND`. |
| AC-3 | The quote returns every component listed above, and `total` equals their sum. |
| AC-4 | Accrued interest uses actual calendar days, including months with 28, 29, 30 or 31 days. |
| AC-5 | An overdue loan's quote includes overdue interest and late fees. |
| AC-6 | The early repayment fee follows the fee rules above, including the waiver for the last installment. |
| AC-7 | `validUntil` is 23:59:59 WIB of the day the quote was created. |
| AC-8 | Confirming an expired quote returns 410 `QUOTE_EXPIRED`. |
| AC-9 | Confirming the same quote twice returns the same virtual account number. |
| AC-10 | A payment callback with an amount lower than the quote total returns 422 `UNDERPAYMENT`; the loan stays ACTIVE. |
| AC-11 | A payment callback with an amount equal to or higher than the total marks the loan PAID_OFF and all UNPAID installments CANCELLED. |
| AC-12 | NIK, phone number and bank account number never appear unmasked in logs or on the payoff screen. Bank account shows only the last 4 digits (`****4501`). |

## Worked example

Loan LN-1001 on 16 Nov 2026: principal Rp 6.000.000, 6 months, 3% flat per month, disbursed 14 Jul 2026, installments 1 to 4 paid.

| Component | Calculation | Amount |
|---|---|---|
| Outstanding principal | 2 unpaid × 1.000.000 | 2.000.000 |
| Overdue interest | none overdue | 0 |
| Accrued interest | 2.000.000 × 3% × 2 days ÷ 30 (14 Nov to 16 Nov) | 4.000 |
| Late fees | | 0 |
| Early repayment fee | 1% × 2.000.000 | 20.000 |
| **Total** | | **2.024.000** |

## Definition of done

- [ ] Behaviour matches the contract exactly (field names, status codes, error codes)
- [ ] Unit tests for the calculation, including end-of-month and overdue loans
- [ ] No raw NIK, phone or bank account in logs or on screen
- [ ] Playwright tests pass against the running backend
- [ ] Code reviewed by a teammate (human), not only by AI
