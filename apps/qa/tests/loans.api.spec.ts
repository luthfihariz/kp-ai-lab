import { expect, test } from "@playwright/test";
import { authHeader, loginAs } from "../fixtures/api";
import { budi, siti } from "../fixtures/users";

test.describe("Loans API", () => {
  test("lists only the logged-in borrower's loans", async ({ request }) => {
    const token = await loginAs(request, budi);

    const response = await request.get("/api/loans", { headers: authHeader(token) });

    expect(response.status()).toBe(200);
    const loans = await response.json();
    expect(loans.map((loan: { id: string }) => loan.id)).not.toContain("LN-2001");
  });

  test("lists Siti's loans after she logs in", async ({ request }) => {
    const token = await loginAs(request, siti);

    const response = await request.get("/api/loans", { headers: authHeader(token) });

    expect(response.status()).toBe(200);
    const loans = await response.json();
    expect(loans).toEqual([
      {
        id: "LN-2001",
        status: "ACTIVE",
        principal: 2_500_000,
        tenorMonths: 6,
        disbursedAt: "2026-09-10",
        outstandingPrincipal: 1_666_668,
        nextDueDate: "2026-12-10",
        isOverdue: false,
      },
    ]);
  });

  test("returns the schedule for an active loan", async ({ request }) => {
    const token = await loginAs(request, budi);

    const response = await request.get("/api/loans/LN-1001", { headers: authHeader(token) });

    expect(response.status()).toBe(200);
    const loan = await response.json();
    expect(loan.status).toBe("ACTIVE");
    expect(loan.installments).toHaveLength(6);
    expect(loan.outstandingPrincipal).toBe(2_000_000);
  });

  test("hides another borrower's loan", async ({ request }) => {
    const token = await loginAs(request, budi);

    const response = await request.get("/api/loans/LN-2001", { headers: authHeader(token) });

    expect(response.status()).toBe(404);
  });

  test("rejects requests without a token", async ({ request }) => {
    const response = await request.get("/api/loans");

    expect(response.status()).toBe(401);
  });
});
