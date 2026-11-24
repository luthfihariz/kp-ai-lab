import { describe, expect, it } from "vitest";
import { addMonthsClamped, daysBetween, isoDate, mulBps } from "../money";

describe("mulBps", () => {
  it.each([
    ["exact", 6_000_000, 300, 180_000],
    ["rounds down below half", 1_234_567, 300, 37_037],
    ["rounds half up", 50, 100, 1],
    ["zero amount", 0, 300, 0],
  ] as const)("%s", (_name, amount, bps, want) => {
    expect(mulBps(amount, bps)).toBe(want);
  });
});

describe("daysBetween", () => {
  it("counts 30/360 days", () => {
    const from = new Date(Date.UTC(2026, 10, 1));
    const to = new Date(Date.UTC(2026, 10, 16));
    expect(daysBetween(from, to)).toBe(15);
  });
});

describe("addMonthsClamped", () => {
  it.each([
    ["mid month", Date.UTC(2026, 7, 20), 1, "2026-09-20"],
    ["clamps to end of February", Date.UTC(2026, 0, 31), 1, "2026-02-28"],
    ["crosses year", Date.UTC(2026, 10, 30), 3, "2027-02-28"],
  ] as const)("%s", (_name, timestamp, months, want) => {
    expect(isoDate(addMonthsClamped(new Date(timestamp), months))).toBe(want);
  });
});
