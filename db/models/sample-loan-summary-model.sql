-- Model: analytics.sample_loan_summary
-- Grain: one row per loan.
-- No PII: borrower_id only.
CREATE OR REPLACE VIEW analytics.sample_loan_summary AS
SELECT
  l.id AS loan_id,
  l.borrower_id,
  l.status,
  l.principal,
  l.tenor_months,
  l.disbursed_at,
  count(i.number) AS installment_count,
  count(i.number) FILTER (WHERE i.status = 'PAID') AS paid_count,
  coalesce(sum(i.amount), 0) AS scheduled_amount,
  coalesce(sum(i.amount) FILTER (WHERE i.status = 'PAID'), 0) AS paid_amount,
  max(i.paid_at) AS last_paid_at
FROM loans l
LEFT JOIN installments i ON i.loan_id = l.id
GROUP BY l.id;

SELECT * FROM analytics.sample_loan_summary ORDER BY loan_id LIMIT 10;
