CREATE TABLE "borrowers" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"nik" char(16) NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"bank_name" text NOT NULL,
	"bank_account_number" text NOT NULL,
	"city" text NOT NULL,
	"registered_at" date NOT NULL,
	"password" text DEFAULT 'password123' NOT NULL,
	CONSTRAINT "borrowers_nik_unique" UNIQUE("nik"),
	CONSTRAINT "borrowers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "installments" (
	"loan_id" text NOT NULL,
	"number" integer NOT NULL,
	"due_date" date NOT NULL,
	"principal" bigint NOT NULL,
	"interest" bigint NOT NULL,
	"amount" bigint NOT NULL,
	"days_in_period" integer NOT NULL,
	"status" text NOT NULL,
	"paid_at" date,
	CONSTRAINT "installments_loan_id_number_pk" PRIMARY KEY("loan_id","number"),
	CONSTRAINT "installments_status_check" CHECK ("installments"."status" IN ('PAID', 'UNPAID', 'CANCELLED'))
);
--> statement-breakpoint
CREATE TABLE "loans" (
	"id" text PRIMARY KEY NOT NULL,
	"borrower_id" text NOT NULL,
	"status" text NOT NULL,
	"principal" bigint NOT NULL,
	"tenor_months" integer NOT NULL,
	"monthly_interest_rate_bps" integer NOT NULL,
	"disbursed_at" date NOT NULL,
	"late_fees" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "loans_status_check" CHECK ("loans"."status" IN ('ACTIVE', 'PAID_OFF', 'CANCELLED')),
	CONSTRAINT "loans_principal_check" CHECK ("loans"."principal" > 0),
	CONSTRAINT "loans_tenor_check" CHECK ("loans"."tenor_months" > 0),
	CONSTRAINT "loans_rate_check" CHECK ("loans"."monthly_interest_rate_bps" >= 0)
);
--> statement-breakpoint
ALTER TABLE "installments" ADD CONSTRAINT "installments_loan_id_loans_id_fk" FOREIGN KEY ("loan_id") REFERENCES "public"."loans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loans" ADD CONSTRAINT "loans_borrower_id_borrowers_id_fk" FOREIGN KEY ("borrower_id") REFERENCES "public"."borrowers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "installments_due_date_idx" ON "installments" USING btree ("due_date");--> statement-breakpoint
CREATE INDEX "loans_borrower_id_idx" ON "loans" USING btree ("borrower_id");