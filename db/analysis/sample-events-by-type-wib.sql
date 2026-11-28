-- Payoff events per event type and WIB week.
-- occurred_at is a timestamptz: convert to Asia/Jakarta before bucketing.
-- One quote has several events, so events and quotes are different counts.
SELECT
  date_trunc('week', occurred_at AT TIME ZONE 'Asia/Jakarta')::date AS week_start_wib,
  event_type,
  count(*) AS events,
  count(DISTINCT quote_id) AS quotes
FROM analytics.payoff_events
GROUP BY 1, 2
ORDER BY 1, 2;

-- Why it matters: 17:48 UTC on 4 Nov is already 5 Nov in WIB.
SELECT
  (timestamptz '2026-11-04 17:48:00+00' AT TIME ZONE 'UTC')::date AS utc_date,
  (timestamptz '2026-11-04 17:48:00+00' AT TIME ZONE 'Asia/Jakarta')::date AS wib_date;
