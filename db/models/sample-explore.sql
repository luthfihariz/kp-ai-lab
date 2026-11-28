-- Tables and columns in the lab database.
SELECT table_schema, table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema IN ('public', 'analytics')
  AND table_name NOT LIKE '\_\_%'
ORDER BY table_schema, table_name, ordinal_position;

-- Row count per table.
SELECT 'borrowers' AS table_name, count(*) AS row_count FROM borrowers
UNION ALL SELECT 'loans', count(*) FROM loans
UNION ALL SELECT 'installments', count(*) FROM installments
UNION ALL SELECT 'analytics.payoff_events', count(*) FROM analytics.payoff_events;

-- Allowed values of the status columns.
SELECT 'loans' AS table_name, status, count(*) FROM loans GROUP BY status
UNION ALL
SELECT 'installments', status, count(*) FROM installments GROUP BY status
ORDER BY table_name, status;
