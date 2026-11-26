-- Data-quality checks for <schema.table>
-- Grain: one row per <grain>.
-- Every check returns zero rows when the data is clean.

-- 1. The grain is unique
SELECT <grain_column>, COUNT(*) AS n
FROM <schema.table>
GROUP BY <grain_column>
HAVING COUNT(*) > 1;

-- 2. Required columns are filled
SELECT <grain_column>
FROM <schema.table>
WHERE <required_column> IS NULL;

-- 3. Only allowed values
SELECT <grain_column>, <category_column>
FROM <schema.table>
WHERE <category_column> NOT IN ('<value_1>', '<value_2>');

-- 4. A total equals its parts
SELECT <grain_column>
FROM <schema.table>
WHERE <total_column> <> <part_1> + <part_2>;
