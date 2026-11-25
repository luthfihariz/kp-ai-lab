import { beforeAll, describe, expect, it, vi } from "vitest";
import { createApp } from "../app";
import type { AppDb } from "../loans";
import { createTestDb } from "./test-db";

let db: AppDb;

beforeAll(async () => {
  db = await createTestDb();
});

function app() {
  return createApp(db, "2026-11-16");
}

async function request(method: string, path: string, token = "") {
  const headers = new Headers();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const response = await app().request(path, { method, headers });
  const text = await response.text();
  return { status: response.status, body: text ? JSON.parse(text) : null };
}

const quotePath = (id: string) => `/api/loans/${id}/early-repayment/quote`;

describe("early repayment quote", () => {
  it("requires a token", async () => {
    const { status, body } = await request("POST", quotePath("LN-1001"));
    expect(status).toBe(401);
    expect(body.code).toBe("UNAUTHORIZED");
  });

  it("hides another borrower's loan, including one that is paid off", async () => {
    const active = await request("POST", quotePath("LN-2001"), "demo-B001");
    const paidOff = await request("POST", quotePath("LN-3001"), "demo-B001");
    expect(active.status).toBe(404);
    expect(active.body.code).toBe("LOAN_NOT_FOUND");
    expect(paidOff.status).toBe(404);
    expect(paidOff.body.code).toBe("LOAN_NOT_FOUND");
  });

  it("returns 404 for an unknown loan", async () => {
    const { status, body } = await request("POST", quotePath("LN-9999"), "demo-B001");
    expect(status).toBe(404);
    expect(body.code).toBe("LOAN_NOT_FOUND");
  });

  it("rejects a paid-off or cancelled loan owned by the caller", async () => {
    const paidOff = await request("POST", quotePath("LN-1003"), "demo-B001");
    const cancelled = await request("POST", quotePath("LN-1007"), "demo-B001");
    expect(paidOff.status).toBe(409);
    expect(paidOff.body.code).toBe("LOAN_NOT_ACTIVE");
    expect(cancelled.status).toBe(409);
    expect(cancelled.body.code).toBe("LOAN_NOT_ACTIVE");
  });

  it("quotes LN-1001 and repeats the same quote id", async () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    try {
      const first = await request("POST", quotePath("LN-1001"), "demo-B001");
      const second = await request("POST", quotePath("LN-1001"), "demo-B001");
      expect(first.status).toBe(201);
      expect(first.body).toEqual({
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
      expect(second.status).toBe(201);
      expect(second.body.quoteId).toBe(first.body.quoteId);
      expect(second.body.validUntil).toBe(first.body.validUntil);
      const serialized = JSON.stringify(first.body);
      expect(serialized).not.toMatch(/nik|phone|email|bank/i);
      const payloads = spy.mock.calls.map((call) => call[1]);
      expect(payloads).toContainEqual({
        loanId: "LN-1001",
        borrowerId: "B001",
        quoteId: "Q-LN-1001-20261116",
      });
      const logged = JSON.stringify(spy.mock.calls);
      expect(logged).not.toMatch(/nik|phone|email|bankAccount/i);
    } finally {
      spy.mockRestore();
    }
  });

  it("includes overdue interest and late fees for LN-1002", async () => {
    const { status, body } = await request("POST", quotePath("LN-1002"), "demo-B001");
    expect(status).toBe(201);
    expect(body.overdueInterest).toBe(90_000);
    expect(body.lateFees).toBe(75_000);
    expect(body.total).toBe(2_239_000);
  });
});
