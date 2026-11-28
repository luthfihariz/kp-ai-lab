-- Loans disbursed per month and tenor.
-- disbursed_at is a date (no time zone), so date_trunc is safe here.
SELECT
  to_char(date_trunc('month', disbursed_at), 'YYYY-MM') AS month,
  tenor_months,
  count(*) AS loans,
  sum(principal) AS total_principal,
  div(sum(principal), count(*)) AS avg_principal  -- whole rupiah, rounded down
FROM loans
WHERE status <> 'CANCELLED'
GROUP BY 1, 2
ORDER BY 1, 2;
