-- Borrowers and active loans per city: aggregates, no PII.
SELECT
  b.city,
  count(DISTINCT b.id) AS borrowers,
  count(l.id) FILTER (WHERE l.status = 'ACTIVE') AS active_loans
FROM borrowers b
LEFT JOIN loans l ON l.borrower_id = b.id
GROUP BY b.city
ORDER BY borrowers DESC;

-- When rows are needed, keep borrower_id and mask contact data.
SELECT
  b.id AS borrower_id,
  b.city,
  left(b.phone, 4) || '****' || right(b.phone, 3) AS phone_masked
FROM borrowers b
ORDER BY b.id
LIMIT 10;
