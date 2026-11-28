-- Loans and principal per status.
-- Amounts in whole rupiah; the share is rounded to one decimal.
SELECT
  status,
  count(*) AS loans,
  sum(principal) AS total_principal,
  round(100.0 * count(*) / sum(count(*)) OVER (), 1) AS pct_of_loans
FROM loans
GROUP BY status
ORDER BY loans DESC;
