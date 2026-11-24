import { asc, eq, inArray } from "drizzle-orm";
import type { PgliteDatabase } from "drizzle-orm/pglite";
import { borrowers, installments, loans, type Database, schema } from "@kp/db";
import type { Installment, InstallmentStatus } from "./schedule";

export type AppDb = Database | PgliteDatabase<typeof schema>;

export type LoanStatus = "ACTIVE" | "PAID_OFF" | "CANCELLED";

export type Borrower = {
  id: string;
  name: string;
  nik: string;
  phone: string;
  email: string;
  bankName: string;
  bankAccountNumber: string;
  password: string;
};

export type Loan = {
  id: string;
  borrowerId: string;
  status: LoanStatus;
  principal: number;
  tenorMonths: number;
  monthlyInterestRateBps: number;
  disbursedAt: string;
  lateFees: number;
  installments: Installment[];
};

export function outstandingPrincipal(loan: Loan) {
  return loan.installments.reduce(
    (total, installment) => (installment.status === "UNPAID" ? total + installment.principal : total),
    0,
  );
}

export function nextDueInstallment(loan: Loan) {
  return loan.installments.find((installment) => installment.status === "UNPAID");
}

export function isOverdue(loan: Loan, today: string) {
  const next = nextDueInstallment(loan);
  return next !== undefined && next.dueDate < today;
}

export async function borrowerByEmail(db: AppDb, email: string) {
  const [row] = await db.select().from(borrowers).where(eq(borrowers.email, email));
  return row ? toBorrower(row) : undefined;
}

export async function borrowerById(db: AppDb, id: string) {
  const [row] = await db.select().from(borrowers).where(eq(borrowers.id, id));
  return row ? toBorrower(row) : undefined;
}

export async function loansFor(db: AppDb, borrowerId: string) {
  const rows = await db.select().from(loans).where(eq(loans.borrowerId, borrowerId)).orderBy(asc(loans.id));
  return withInstallments(db, rows);
}

export async function loanById(db: AppDb, id: string) {
  const [row] = await db.select().from(loans).where(eq(loans.id, id));
  if (!row) {
    return undefined;
  }
  const [loan] = await withInstallments(db, [row]);
  return loan;
}

async function withInstallments(db: AppDb, rows: (typeof loans.$inferSelect)[]) {
  if (rows.length === 0) {
    return [];
  }
  const ids = rows.map((row) => row.id);
  const schedule = await db
    .select()
    .from(installments)
    .where(inArray(installments.loanId, ids))
    .orderBy(asc(installments.loanId), asc(installments.number));

  const byLoan = new Map<string, Installment[]>();
  for (const row of schedule) {
    const list = byLoan.get(row.loanId) ?? [];
    list.push(toInstallment(row));
    byLoan.set(row.loanId, list);
  }

  return rows.map((row) => toLoan(row, byLoan.get(row.id) ?? []));
}

function toBorrower(row: typeof borrowers.$inferSelect): Borrower {
  return {
    id: row.id,
    name: row.name,
    nik: row.nik.trim(),
    phone: row.phone,
    email: row.email,
    bankName: row.bankName,
    bankAccountNumber: row.bankAccountNumber,
    password: row.password,
  };
}

function toLoan(row: typeof loans.$inferSelect, schedule: Installment[]): Loan {
  return {
    id: row.id,
    borrowerId: row.borrowerId,
    status: row.status as Loan["status"],
    principal: row.principal,
    tenorMonths: row.tenorMonths,
    monthlyInterestRateBps: row.monthlyInterestRateBps,
    disbursedAt: row.disbursedAt,
    lateFees: row.lateFees,
    installments: schedule,
  };
}

function toInstallment(row: typeof installments.$inferSelect): Installment {
  return {
    number: row.number,
    dueDate: row.dueDate,
    principal: row.principal,
    interest: row.interest,
    amount: row.amount,
    daysInPeriod: row.daysInPeriod,
    status: row.status as InstallmentStatus,
  };
}
