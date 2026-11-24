import { expect, test } from "@playwright/test";
import { authHeader, loginAs } from "../fixtures/api";
import { budi } from "../fixtures/users";

test.describe("Loans API", () => {
  test("lists only the logged-in borrower's loans", async ({ request }) => {
    const token = await loginAs(request, budi);

    const response = await request.get("/api/loans", { headers: authHeader(token) });

    expect(response.status()).toBe(200);
    const loans = await response.json();
    expect(loans.map((loan: { id: string }) => loan.id)).not.toContain("LN-2001");
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
