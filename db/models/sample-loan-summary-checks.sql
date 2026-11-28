-- Checks for analytics.sample_loan_summary (run sample-loan-summary-model.sql first).
-- Each query returns zero rows when the data is clean.

-- 1. loan_id is unique.
SELECT loan_id, count(*)
FROM analytics.sample_loan_summary
GROUP BY loan_id
HAVING count(*) > 1;

-- 2. Every loan in the source is in the model.
SELECT l.id
FROM loans l
LEFT JOIN analytics.sample_loan_summary s ON s.loan_id = l.id
WHERE s.loan_id IS NULL;

-- 3. A loan has one installment per month of its tenor.
SELECT loan_id, tenor_months, installment_count
FROM analytics.sample_loan_summary
WHERE installment_count <> tenor_months;

-- 4. Paid amount never exceeds the scheduled amount.
SELECT loan_id, scheduled_amount, paid_amount
FROM analytics.sample_loan_summary
WHERE paid_amount > scheduled_amount;
