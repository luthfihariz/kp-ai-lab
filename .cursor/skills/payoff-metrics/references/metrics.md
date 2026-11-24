# Payoff metrics (from docs/data-request-KP-425.md)

Table: analytics.payoff_events, one row per event.

| Term | Definition |
|---|---|
| Quote | One `quote_id` |
| Quote date, month | The date of its `quote_created` event in Asia/Jakarta (WIB), never UTC |
| Paid | The quote has a `payment_received` event. `payment_rejected_underpayment` is not paid |
| Expired | The quote has a `quote_expired` event |
| Fee revenue | Sum of `early_repayment_fee` of paid quotes |

Data runs to 16 Nov 2026, so November is a partial month. Say so in every November answer.
