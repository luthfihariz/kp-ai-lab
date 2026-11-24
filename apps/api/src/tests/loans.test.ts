import { beforeAll, describe, expect, it } from "vitest";
import { isOverdue, loanById, loansFor, outstandingPrincipal, type AppDb } from "../loans";
import { createTestDb } from "./test-db";

const today = "2026-11-16";
let db: AppDb;

beforeAll(async () => {
  db = await createTestDb();
});

describe("seeded loans", () => {
  it("marks paid installments", async () => {
    const loan = await loanById(db, "LN-1001");
    expect(loan).toBeDefined();
    expect(loan?.installments.map((installment) => installment.status)).toEqual([
      "PAID",
      "PAID",
      "PAID",
      "PAID",
      "UNPAID",
      "UNPAID",
    ]);
    expect(outstandingPrincipal(loan!)).toBe(2_000_000);
  });

  it("marks a paid-off loan as fully paid", async () => {
    const loan = await loanById(db, "LN-1003");
    expect(loan?.installments.every((installment) => installment.status === "PAID")).toBe(true);
  });

  it("marks a cancelled loan as fully cancelled", async () => {
    const loan = await loanById(db, "LN-1007");
    expect(loan?.installments.every((installment) => installment.status === "CANCELLED")).toBe(true);
  });

  it("flags only loans whose next unpaid installment is before today", async () => {
    const overdue = await loanById(db, "LN-1002");
    const current = await loanById(db, "LN-1001");
    expect(isOverdue(overdue!, today)).toBe(true);
    expect(isOverdue(current!, today)).toBe(false);
  });

  it("lists only that borrower's loans", async () => {
    const loans = await loansFor(db, "B002");
    expect(loans.length).toBeGreaterThan(0);
    expect(loans.every((loan) => loan.borrowerId === "B002")).toBe(true);
  });
});
