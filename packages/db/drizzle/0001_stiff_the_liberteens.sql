CREATE SCHEMA "analytics";
--> statement-breakpoint
CREATE TABLE "analytics"."payoff_events" (
	"event_id" text PRIMARY KEY NOT NULL,
	"event_type" text NOT NULL,
	"quote_id" text NOT NULL,
	"loan_id" text NOT NULL,
	"borrower_id" text NOT NULL,
	"occurred_at" timestamp with time zone NOT NULL,
	"outstanding_principal" bigint NOT NULL,
	"overdue_interest" bigint NOT NULL,
	"accrued_interest" bigint NOT NULL,
	"late_fees" bigint NOT NULL,
	"early_repayment_fee" bigint NOT NULL,
	"total" bigint NOT NULL,
	"amount_paid" bigint,
	CONSTRAINT "payoff_events_type_check" CHECK ("analytics"."payoff_events"."event_type" IN ('quote_created', 'quote_confirmed', 'quote_expired', 'payment_received', 'payment_rejected_underpayment'))
);
