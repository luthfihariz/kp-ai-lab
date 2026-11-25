import { describe, expect, it } from "vitest";
import type { Loan } from "../loans";
import type { Installment } from "../loans/schedule";
import { earlyRepaymentAdminFee, quoteEarlyRepayment } from "../repayment";

describe("earlyRepaymentAdminFee", () => {
  it.each([
    ["1% of outstanding principal", 2_000_000, 2, 20_000],
    ["rounds half-up to whole rupiah", 1_666_668, 4, 16_667],
    ["applies the Rp 10.000 minimum", 500_000, 3, 10_000],
    ["keeps a fee already at the minimum", 1_000_000, 2, 10_000],
    ["applies the Rp 500.000 maximum", 80_000_000, 6, 500_000],
    ["keeps a fee already at the maximum", 50_000_000, 2, 500_000],
    ["waives the fee for the last installment", 1_500_000, 1, 0],
  ] as const)("%s", (_name, outstandingPrincipal, unpaidCount, want) => {
    expect(earlyRepaymentAdminFee(outstandingPrincipal, unpaidCount)).toBe(want);
  });
});

function installment(
  number: number,
  dueDate: string,
  status: Installment["status"],
  principal: number,
  interest: number,
): Installment {
  return { number, dueDate, principal, interest, amount: principal + interest, daysInPeriod: 30, status };
}

function loan(partial: Pick<Loan, "id" | "disbursedAt" | "lateFees" | "installments">): Loan {
  return {
    borrowerId: "B001",
    status: "ACTIVE",
    principal: 6_000_000,
    tenorMonths: partial.installments.length,
    monthlyInterestRateBps: 300,
    ...partial,
  };
}

describe("quoteEarlyRepayment", () => {
  it("matches the LN-1001 worked example on 16 Nov 2026", () => {
    const quoted = quoteEarlyRepayment(
      loan({
        id: "LN-1001",
        disbursedAt: "2026-07-14",
        lateFees: 0,
        installments: [
          installment(1, "2026-08-14", "PAID", 1_000_000, 180_000),
          installment(2, "2026-09-14", "PAID", 1_000_000, 180_000),
          installment(3, "2026-10-14", "PAID", 1_000_000, 180_000),
          installment(4, "2026-11-14", "PAID", 1_000_000, 180_000),
          installment(5, "2026-12-14", "UNPAID", 1_000_000, 180_000),
          installment(6, "2027-01-14", "UNPAID", 1_000_000, 180_000),
        ],
      }),
      "2026-11-16",
    );
    expect(quoted).toEqual({
      quoteId: "Q-LN-1001-20261116",
      loanId: "LN-1001",
      outstandingPrincipal: 2_000_000,
      overdueInterest: 0,
      accruedInterestDays: 2,
      accruedInterest: 4_000,
      lateFees: 0,
      earlyRepaymentFee: 20_000,
      total: 2_024_000,
      currency: "IDR",
      validUntil: "2026-11-16T23:59:59+07:00",
    });
  });

  it("charges no accrued days and excludes interest due today", () => {
    const quoted = quoteEarlyRepayment(
      loan({
        id: "LN-DUE",
        disbursedAt: "2026-10-16",
        lateFees: 0,
        installments: [
          installment(1, "2026-11-16", "UNPAID", 1_000_000, 50_000),
          installment(2, "2026-12-16", "UNPAID", 1_000_000, 50_000),
        ],
      }),
      "2026-11-16",
    );
    expect(quoted.accruedInterestDays).toBe(0);
    expect(quoted.accruedInterest).toBe(0);
    expect(quoted.overdueInterest).toBe(0);
  });

  it("matches the overdue LN-1002 figures on 16 Nov 2026", () => {
    const quoted = quoteEarlyRepayment(
      loan({
        id: "LN-1002",
        disbursedAt: "2026-08-20",
        lateFees: 75_000,
        installments: [
          installment(1, "2026-09-20", "PAID", 1_000_000, 90_000),
          installment(2, "2026-10-20", "UNPAID", 1_000_000, 90_000),
          installment(3, "2026-11-20", "UNPAID", 1_000_000, 90_000),
        ],
      }),
      "2026-11-16",
    );
    expect(quoted.outstandingPrincipal).toBe(2_000_000);
    expect(quoted.overdueInterest).toBe(90_000);
    expect(quoted.accruedInterestDays).toBe(27);
    expect(quoted.accruedInterest).toBe(54_000);
    expect(quoted.lateFees).toBe(75_000);
    expect(quoted.earlyRepaymentFee).toBe(20_000);
    expect(quoted.total).toBe(2_239_000);
  });
});
