import { describe, expect, it } from "vitest";
import { buildSchedule } from "../loans/schedule";

describe("buildSchedule", () => {
  it.each([
    {
      name: "even split",
      principal: 3_000_000,
      tenorMonths: 3,
      monthlyRateBps: 300,
      disbursedAt: new Date(Date.UTC(2026, 7, 20)),
      wantPrincipals: [1_000_000, 1_000_000, 1_000_000],
      wantInterest: 90_000,
      wantDueDates: ["2026-09-20", "2026-10-20", "2026-11-20"],
    },
    {
      name: "last installment takes the remainder",
      principal: 1_000_000,
      tenorMonths: 3,
      monthlyRateBps: 300,
      disbursedAt: new Date(Date.UTC(2026, 8, 5)),
      wantPrincipals: [333_333, 333_333, 333_334],
      wantInterest: 30_000,
      wantDueDates: ["2026-10-05", "2026-11-05", "2026-12-05"],
    },
  ])("$name", ({ principal, tenorMonths, monthlyRateBps, disbursedAt, wantPrincipals, wantInterest, wantDueDates }) => {
    const got = buildSchedule(principal, tenorMonths, monthlyRateBps, disbursedAt);
    expect(got).toHaveLength(tenorMonths);
    got.forEach((installment, index) => {
      expect(installment.number).toBe(index + 1);
      expect(installment.principal).toBe(wantPrincipals[index]);
      expect(installment.interest).toBe(wantInterest);
      expect(installment.amount).toBe(installment.principal + installment.interest);
      expect(installment.dueDate).toBe(wantDueDates[index]);
      expect(installment.status).toBe("UNPAID");
    });
  });
});
