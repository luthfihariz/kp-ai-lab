# Seed loans (db/seed.sql, app date 2026-11-16)

| Loan | Owner | Status | Use it for |
|---|---|---|---|
| LN-1001 | Budi (B001) | ACTIVE, on time, 2 of 6 left | normal active loan, schedule |
| LN-1002 | Budi | ACTIVE, overdue, late fee 75.000 | overdue cases |
| LN-1003 | Budi | PAID_OFF | "not active" cases |
| LN-1004 | Budi | ACTIVE, only the last installment left | last-installment cases (fee waiver, AC-6) |
| LN-1005 | Budi | ACTIVE, disbursed 16 Nov | brand-new loan, nothing paid yet |
| LN-1006 | Budi | ACTIVE, 6 months | second active 6-month loan |
| LN-1007 | Budi | CANCELLED | "not active" cases |
| LN-2001 | Siti (B002) | ACTIVE | another borrower's loan (404 for Budi) |

Users and passwords: apps/qa/fixtures/users.ts.
