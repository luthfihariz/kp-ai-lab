import { sql } from "drizzle-orm";
import {
  bigint,
  char,
  check,
  date,
  index,
  integer,
  pgSchema,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const borrowers = pgTable(
  "borrowers",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    nik: char("nik", { length: 16 }).notNull().unique(),
    phone: text("phone").notNull(),
    email: text("email").notNull().unique(),
    bankName: text("bank_name").notNull(),
    bankAccountNumber: text("bank_account_number").notNull(),
    city: text("city").notNull(),
    registeredAt: date("registered_at", { mode: "string" }).notNull(),
    password: text("password").notNull().default("password123"),
  },
);

export const loans = pgTable(
  "loans",
  {
    id: text("id").primaryKey(),
    borrowerId: text("borrower_id")
      .notNull()
      .references(() => borrowers.id),
    status: text("status").notNull(),
    principal: bigint("principal", { mode: "number" }).notNull(),
    tenorMonths: integer("tenor_months").notNull(),
    monthlyInterestRateBps: integer("monthly_interest_rate_bps").notNull(),
    disbursedAt: date("disbursed_at", { mode: "string" }).notNull(),
    lateFees: bigint("late_fees", { mode: "number" }).notNull().default(0),
  },
  (table) => [
    index("loans_borrower_id_idx").on(table.borrowerId),
    check("loans_status_check", sql`${table.status} IN ('ACTIVE', 'PAID_OFF', 'CANCELLED')`),
    check("loans_principal_check", sql`${table.principal} > 0`),
    check("loans_tenor_check", sql`${table.tenorMonths} > 0`),
    check("loans_rate_check", sql`${table.monthlyInterestRateBps} >= 0`),
  ],
);

export const installments = pgTable(
  "installments",
  {
    loanId: text("loan_id")
      .notNull()
      .references(() => loans.id),
    number: integer("number").notNull(),
    dueDate: date("due_date", { mode: "string" }).notNull(),
    principal: bigint("principal", { mode: "number" }).notNull(),
    interest: bigint("interest", { mode: "number" }).notNull(),
    amount: bigint("amount", { mode: "number" }).notNull(),
    daysInPeriod: integer("days_in_period").notNull(),
    status: text("status").notNull(),
    paidAt: date("paid_at", { mode: "string" }),
  },
  (table) => [
    primaryKey({ columns: [table.loanId, table.number] }),
    index("installments_due_date_idx").on(table.dueDate),
    check("installments_status_check", sql`${table.status} IN ('PAID', 'UNPAID', 'CANCELLED')`),
  ],
);

export const analytics = pgSchema("analytics");

export const payoffEvents = analytics.table(
  "payoff_events",
  {
    eventId: text("event_id").primaryKey(),
    eventType: text("event_type").notNull(),
    quoteId: text("quote_id").notNull(),
    loanId: text("loan_id").notNull(),
    borrowerId: text("borrower_id").notNull(),
    occurredAt: timestamp("occurred_at", { withTimezone: true, mode: "date" }).notNull(),
    outstandingPrincipal: bigint("outstanding_principal", { mode: "number" }).notNull(),
    overdueInterest: bigint("overdue_interest", { mode: "number" }).notNull(),
    accruedInterest: bigint("accrued_interest", { mode: "number" }).notNull(),
    lateFees: bigint("late_fees", { mode: "number" }).notNull(),
    earlyRepaymentFee: bigint("early_repayment_fee", { mode: "number" }).notNull(),
    total: bigint("total", { mode: "number" }).notNull(),
    amountPaid: bigint("amount_paid", { mode: "number" }),
  },
  (table) => [
    check(
      "payoff_events_type_check",
      sql`${table.eventType} IN ('quote_created', 'quote_confirmed', 'quote_expired', 'payment_received', 'payment_rejected_underpayment')`,
    ),
  ],
);
