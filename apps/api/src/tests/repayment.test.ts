import { describe, expect, it } from "vitest";
import { earlyRepaymentAdminFee } from "../repayment";

describe("earlyRepaymentAdminFee", () => {
  it.each([
    ["1% of outstanding principal", 2_000_000, 20_000],
    ["rounds half-up to whole rupiah", 1_666_668, 16_667],
    ["applies the Rp 10.000 minimum", 500_000, 10_000],
    ["keeps a fee already at the minimum", 1_000_000, 10_000],
    ["applies the Rp 500.000 maximum", 80_000_000, 500_000],
    ["keeps a fee already at the maximum", 50_000_000, 500_000],
  ] as const)("%s", (_name, outstandingPrincipal, want) => {
    expect(earlyRepaymentAdminFee(outstandingPrincipal)).toBe(want);
  });
});
