# KP-421: Pelunasan Dipercepat (early loan payoff)

**Type:** Story · **Priority:** High · **Sprint:** Training lab

## Description

As a borrower with an active loan, I want to see how much it costs to pay off my loan today and pay it through a virtual account, so I can close my loan early without contacting customer service.

PRD: docs/prd-early-repayment.md · Contract: contract/openapi.yaml · Design: docs/design-early-repayment.md

## Sub-tasks

| Key | Role | Task |
|---|---|---|
| KP-422 | Backend | Implement `POST /api/loans/{id}/early-repayment/quote` in `apps/api/src/repayment` (AC-1 to AC-7, AC-12 for logs). Stretch: confirm endpoint (AC-8, AC-9). |
| KP-423 | Frontend | Build the payoff screen at `/loans/:id/early-repayment` from the design and the contract (AC-3, AC-12 for display). Develop against the mock server first. |
| KP-424 | QA | Write test cases from the acceptance criteria, then automate at least 5 in Playwright (API and E2E). |

## Definition of done

- [ ] Behaviour matches the contract exactly (field names, status codes, error codes)
- [ ] Unit tests for the calculation, including end-of-month and overdue loans
- [ ] No raw NIK, phone or bank account in logs or on screen
- [ ] Playwright tests pass against the running backend
- [ ] Code reviewed by a teammate (human), not only by AI
