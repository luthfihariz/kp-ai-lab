# Spec: Loans (current behaviour)

| | |
|---|---|
| Status | Live |
| Screens | Login, loan list, loan detail with the installment schedule |
| API contract | contract/openapi.yaml: `POST /api/auth/login`, `GET /api/loans`, `GET /api/loans/{id}` |

## Purpose

A borrower logs in and sees their loans and each loan's installment schedule. This is how the app works today, before Pelunasan Dipercepat is built.

## Business rules

All amounts are whole rupiah (integers, never fractional).

### Login

| Rule | Detail |
|---|---|
| Credentials | A demo borrower logs in with email and password |
| Success | Returns a bearer token, the borrower's id and name |
| Wrong password | 401 `INVALID_CREDENTIALS` |

### Who sees a loan

| Rule | Detail |
|---|---|
| Loan list | Only the logged-in borrower's own loans, each with outstanding principal, next due date and an overdue flag |
| Another borrower's loan | Reported as not found: 404 `LOAN_NOT_FOUND` |

### Installment schedule

| Rule | Detail |
|---|---|
| Principal | Split evenly across the tenor; any remainder goes on the last installment |
| Interest | Flat: original principal × monthly rate, the same in every installment |
| Due date | The disbursement day in each following month, moved to the last day of the month when that month is shorter |
| Days (Hari) | Actual calendar days since the previous due date, or since disbursement for the first installment |

### Rounding

Percentages are applied in basis points and rounded **half-up** to whole rupiah.

## Expected behaviour

| # | Behaviour |
|---|---|
| 1 | A known email with the matching password returns 200 with a token, the borrower's id and name. |
| 2 | A wrong password returns 401 `INVALID_CREDENTIALS`. |
| 3 | Listing loans returns only the logged-in borrower's loans. |
| 4 | Requesting another borrower's loan returns 404 `LOAN_NOT_FOUND`. |
| 5 | Each installment's principal and interest follow the schedule rules above. |
| 6 | A loan disbursed on 31 Jul 2026 has its September installment due on 30 Sep 2026. |
| 7 | 1% of Rp 1.666.668 is Rp 16.667 (half-up). |

## Worked example

Loan LN-1001: Rp 6.000.000 for 6 months at 3% (300 basis points) per month, disbursed 14 Jul 2026.

| Installment | Due date | Principal | Interest | Amount |
|---|---|---|---|---|
| 1 to 6 | The 14th, from Aug 2026 to Jan 2027 | 1.000.000 | 180.000 | 1.180.000 |
