# Spec: loans (existing behaviour)

## Purpose
How a borrower logs in and views their loans and installment schedules in the KP training lab. This is the behaviour that exists before the Pelunasan Dipercepat lab starts.

## Requirements

### Requirement: Borrower login
The system SHALL let a demo borrower log in with email and password and return a bearer token and the borrower's id and name.

#### Scenario: Valid credentials
- **WHEN** a borrower posts a known email and the matching password to the login endpoint
- **THEN** the response is 200 with a token and the borrower's id and name

#### Scenario: Wrong password
- **WHEN** the password does not match
- **THEN** the response is 401 with error code `INVALID_CREDENTIALS`

### Requirement: Only the owner sees a loan
The system SHALL return a borrower's own loans only. A loan that belongs to another borrower MUST be reported as not found.

#### Scenario: Listing loans
- **WHEN** a logged-in borrower lists loans
- **THEN** only loans with their borrower id are returned, each with outstanding principal, next due date and an overdue flag

#### Scenario: Another borrower's loan
- **WHEN** a borrower requests a loan id that belongs to someone else
- **THEN** the response is 404 with error code `LOAN_NOT_FOUND`

### Requirement: Installment schedule
The system SHALL show each loan's installment schedule. Principal is split evenly, with any remainder on the last installment. Interest is flat: the original principal times the monthly rate, the same in every installment. Each installment's due date falls on the disbursement day in each following month, moved to the last day of the month when that month is shorter.

#### Scenario: Six-month loan
- **WHEN** a loan of Rp 6.000.000 for 6 months at 300 basis points per month is disbursed on 14 Jul 2026
- **THEN** each installment has principal Rp 1.000.000 and interest Rp 180.000, due on the 14th from Aug 2026 to Jan 2027

#### Scenario: Disbursed at the end of a month
- **WHEN** a loan is disbursed on 31 Jul 2026
- **THEN** the installment for September is due on 30 Sep 2026

### Requirement: Money is whole rupiah
All amounts SHALL be whole rupiah integers. Percentages SHALL be applied in basis points and rounded half-up to whole rupiah.

#### Scenario: Half-up rounding
- **WHEN** 1% of Rp 1.666.668 is calculated
- **THEN** the result is Rp 16.667
