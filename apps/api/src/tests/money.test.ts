import { describe, expect, it } from "vitest";
import { addMonthsClamped, calendarDays, daysBetween, isoDate, mulBps } from "../money";

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

describe("calendarDays", () => {
  it.each([
    ["February in a non-leap year", "2026-01-31", "2026-02-28", 28],
    ["a leap day", "2028-02-01", "2028-02-29", 28],
    ["a 31-day month", "2026-07-01", "2026-07-31", 30],
    ["the same date", "2026-11-16", "2026-11-16", 0],
  ] as const)("%s", (_name, from, to, want) => {
    expect(calendarDays(from, to)).toBe(want);
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
