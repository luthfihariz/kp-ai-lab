# Spec Delta

## Purpose

Gives a borrower the amount and the breakdown required to close an active loan on the current lab date.

## ADDED Requirements

### Requirement: Authenticated quote request
The system SHALL reject a quote request that has no valid bearer token with HTTP 401 and code `UNAUTHORIZED`.

#### Scenario: Missing token
- **WHEN** a client requests a quote without a bearer token
- **THEN** the system responds 401 with code `UNAUTHORIZED`

### Requirement: Quote only the caller's loan
The system SHALL return HTTP 404 and code `LOAN_NOT_FOUND` when the loan does not exist or belongs to another borrower. A loan owned by someone else MUST receive 404 even when that loan is not `ACTIVE`.

#### Scenario: Another borrower's loan
- **WHEN** an authenticated borrower requests a quote for a loan owned by someone else
- **THEN** the system responds 404 with code `LOAN_NOT_FOUND`

#### Scenario: Unknown loan
- **WHEN** an authenticated borrower requests a quote for a loan id that does not exist
- **THEN** the system responds 404 with code `LOAN_NOT_FOUND`

#### Scenario: Foreign loan that is not active
- **WHEN** an authenticated borrower requests a quote for another borrower's `PAID_OFF` loan
- **THEN** the system responds 404 with code `LOAN_NOT_FOUND`

### Requirement: Quote only an active loan
The system SHALL create a quote only when the caller's loan has status `ACTIVE`. A `PAID_OFF` or `CANCELLED` loan owned by the caller MUST receive HTTP 409 and code `LOAN_NOT_ACTIVE`.

#### Scenario: Paid-off loan
- **WHEN** the owner requests a quote for a `PAID_OFF` loan
- **THEN** the system responds 409 with code `LOAN_NOT_ACTIVE`

#### Scenario: Cancelled loan
- **WHEN** the owner requests a quote for a `CANCELLED` loan
- **THEN** the system responds 409 with code `LOAN_NOT_ACTIVE`

### Requirement: Quote breakdown adds up
The system SHALL respond HTTP 201 with `loanId`, `quoteId`, `outstandingPrincipal`, `overdueInterest`, `accruedInterestDays`, `accruedInterest`, `lateFees`, `earlyRepaymentFee`, `total`, `currency`, and `validUntil`. `currency` MUST be `IDR`. Each amount MUST be a whole rupiah integer. `total` MUST equal the sum of the five amount components after each has been rounded half-up.

#### Scenario: Worked example on 16 November 2026
- **WHEN** the owner of loan `LN-1001` requests a quote on 2026-11-16
- **THEN** the system responds 201 with `outstandingPrincipal` 2000000, `overdueInterest` 0, `accruedInterestDays` 2, `accruedInterest` 4000, `lateFees` 0, `earlyRepaymentFee` 20000, `total` 2024000, and `currency` `IDR`

### Requirement: Outstanding principal
The system SHALL set `outstandingPrincipal` to the sum of `principal` of every installment with status `UNPAID`.

#### Scenario: Two unpaid installments
- **WHEN** a loan has two `UNPAID` installments of principal 1000000 each
- **THEN** `outstandingPrincipal` is 2000000

### Requirement: Overdue interest
The system SHALL set `overdueInterest` to the sum of `interest` of `UNPAID` installments whose due date is before today. Interest of an installment due on today or after today MUST NOT be included.

#### Scenario: Installment due before today
- **WHEN** an `UNPAID` installment is due before today
- **THEN** `overdueInterest` includes that installment's interest

#### Scenario: Installment due today
- **WHEN** an `UNPAID` installment is due on today
- **THEN** that installment's interest is not included in `overdueInterest`

#### Scenario: Future interest is waived
- **WHEN** an `UNPAID` installment is due after today
- **THEN** that installment's interest is not included in `overdueInterest`

### Requirement: Accrued interest uses calendar days
The system SHALL set `accruedInterest` to outstanding principal × the loan's monthly rate × calendar days ÷ 30, rounded half-up once to whole rupiah. Days are the actual calendar days from the current period start to today. The period starts on the latest installment due date on or before today, or on the disbursement date when no due date has passed.

#### Scenario: Two days after the latest due date
- **WHEN** today is 2026-11-16 and the latest installment due date on or before today is 2026-11-14
- **THEN** `accruedInterestDays` is 2

#### Scenario: Period has not started a due date yet
- **WHEN** no installment due date is on or before today
- **THEN** `accruedInterestDays` equals the calendar days from the disbursement date to today

#### Scenario: February in a non-leap year
- **WHEN** the period starts on 2026-01-31 and today is 2026-02-28
- **THEN** `accruedInterestDays` is 28

#### Scenario: Leap day
- **WHEN** the period starts on 2028-02-01 and today is 2028-02-29
- **THEN** `accruedInterestDays` is 28

#### Scenario: A 31-day month
- **WHEN** the period starts on 2026-07-01 and today is 2026-07-31
- **THEN** `accruedInterestDays` is 30

#### Scenario: Today is a due date
- **WHEN** today equals an installment due date
- **THEN** `accruedInterestDays` is 0

### Requirement: Late fees
The system SHALL set `lateFees` to the loan's stored late fee balance, including when that balance is zero.

#### Scenario: Loan has a late fee balance
- **WHEN** the loan's stored late fee balance is greater than zero
- **THEN** `lateFees` equals that balance

#### Scenario: Loan has no late fees
- **WHEN** the loan's stored late fee balance is zero
- **THEN** `lateFees` is 0

### Requirement: Early repayment fee
The system SHALL set `earlyRepaymentFee` to 1% of outstanding principal, rounded half-up to whole rupiah, then clamped to a minimum of 10000 and a maximum of 500000. When exactly one `UNPAID` installment remains, the fee MUST be 0.

#### Scenario: Standard fee
- **WHEN** outstanding principal is 2000000 and two installments are `UNPAID`
- **THEN** `earlyRepaymentFee` is 20000

#### Scenario: Half-up to whole rupiah
- **WHEN** outstanding principal is 1666668 and more than one installment is `UNPAID`
- **THEN** `earlyRepaymentFee` is 16667

#### Scenario: Minimum fee
- **WHEN** outstanding principal is 500000 and more than one installment is `UNPAID`
- **THEN** `earlyRepaymentFee` is 10000

#### Scenario: Maximum fee
- **WHEN** outstanding principal is 80000000 and more than one installment is `UNPAID`
- **THEN** `earlyRepaymentFee` is 500000

#### Scenario: Last installment is free
- **WHEN** outstanding principal is 1500000 and one installment is `UNPAID`
- **THEN** `earlyRepaymentFee` is 0

### Requirement: Quote identity and validity
The system SHALL set `quoteId` to `Q-{loanId}-{yyyyMMdd}` for the quote date and `validUntil` to that date at 23:59:59 Asia/Jakarta (`+07:00`). Repeating the request for the same loan on the same date MUST return the same `quoteId` and `validUntil`.

#### Scenario: Validity on the lab date
- **WHEN** a quote for loan `LN-1001` is created on 2026-11-16
- **THEN** `quoteId` is `Q-LN-1001-20261116` and `validUntil` is `2026-11-16T23:59:59+07:00`

#### Scenario: Same quote on the same day
- **WHEN** the owner requests a quote twice for the same loan on the same date
- **THEN** both responses are 201 and carry the same `quoteId` and `validUntil`

### Requirement: Quote response excludes sensitive identifiers
The quote response MUST NOT contain a NIK, phone number, email address, or bank account number.

#### Scenario: Successful quote body
- **WHEN** the owner receives a quote
- **THEN** the response body contains none of NIK, phone number, email address, or bank account number

### Requirement: Quote logs use identifiers
When handling a quote, the system MUST NOT write an unmasked NIK, phone number, email address, or bank account number. A log record for the request MUST identify the loan and the borrower by id.

#### Scenario: Quote is logged
- **WHEN** a quote is created
- **THEN** the log record includes the loan id and the borrower id and includes none of NIK, phone number, email address, or bank account number
