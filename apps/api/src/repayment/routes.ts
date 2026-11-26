import { factory } from "../env";
import { httpError } from "../errors";
import { loanById, type AppDb } from "../loans";
import { requireBorrower } from "../middleware/auth";
import { quoteEarlyRepayment } from ".";

export function repaymentRoutes(db: AppDb, today: string) {
  const repayment = factory.createApp();
  repayment.use("*", requireBorrower);

  repayment.post("/:id/early-repayment/quote", async (c) => {
    const loan = await loanById(db, c.req.param("id"));
    if (!loan || loan.borrowerId !== c.var.borrowerId) {
      httpError(404, "LOAN_NOT_FOUND", "loan not found");
    }
    if (loan.status !== "ACTIVE") {
      httpError(409, "LOAN_NOT_ACTIVE", "loan is not active");
    }
    const quote = quoteEarlyRepayment(loan, today);
    console.info("early repayment quoted", {
      loanId: loan.id,
      borrowerId: loan.borrowerId,
      quoteId: quote.quoteId,
    });
    return c.json(quote, 201);
  });

  return repayment;
}
