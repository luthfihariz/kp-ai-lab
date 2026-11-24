import { factory } from "../env";
import { httpError } from "../errors";
import { requireBorrower } from "../middleware/auth";
import {
  borrowerById,
  isOverdue,
  loanById,
  loansFor,
  nextDueInstallment,
  outstandingPrincipal,
  type AppDb,
  type Loan,
} from ".";

export function loanRoutes(db: AppDb, today: string) {
  const loans = factory.createApp();
  loans.use("*", requireBorrower);

  loans.get("/", async (c) => {
    const rows = await loansFor(db, c.var.borrowerId);
    return c.json(rows.map((loan) => toSummary(loan, today)));
  });

  loans.get("/:id", async (c) => {
    const loan = await loanById(db, c.req.param("id"));
    if (!loan || loan.borrowerId !== c.var.borrowerId) {
      httpError(404, "LOAN_NOT_FOUND", "loan not found");
    }
    const borrower = await borrowerById(db, loan.borrowerId);
    if (!borrower) {
      httpError(404, "LOAN_NOT_FOUND", "loan not found");
    }
    console.info("loan viewed", { loanId: loan.id, borrower });
    return c.json({
      ...toLoan(loan),
      outstandingPrincipal: outstandingPrincipal(loan),
      isOverdue: isOverdue(loan, today),
      borrower: {
        id: borrower.id,
        name: borrower.name,
        nik: borrower.nik,
        phone: borrower.phone,
        email: borrower.email,
        bankName: borrower.bankName,
        bankAccountNumber: borrower.bankAccountNumber,
      },
    });
  });

  return loans;
}

function toSummary(loan: Loan, today: string) {
  const next = nextDueInstallment(loan);
  return {
    id: loan.id,
    status: loan.status,
    principal: loan.principal,
    tenorMonths: loan.tenorMonths,
    disbursedAt: loan.disbursedAt,
    outstandingPrincipal: outstandingPrincipal(loan),
    nextDueDate: next?.dueDate ?? null,
    isOverdue: isOverdue(loan, today),
  };
}

function toLoan(loan: Loan) {
  return {
    id: loan.id,
    borrowerId: loan.borrowerId,
    status: loan.status,
    principal: loan.principal,
    tenorMonths: loan.tenorMonths,
    monthlyInterestRateBps: loan.monthlyInterestRateBps,
    disbursedAt: loan.disbursedAt,
    lateFees: loan.lateFees,
    installments: loan.installments,
  };
}
