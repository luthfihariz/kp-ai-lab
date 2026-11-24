import { beforeAll, describe, expect, it } from "vitest";
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

async function request(method: string, path: string, token = "", body?: string) {
  const headers = new Headers();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (body !== undefined) {
    headers.set("content-type", "application/json");
  }
  const response = await app().request(path, { method, headers, body });
  const text = await response.text();
  return { status: response.status, body: text ? JSON.parse(text) : null };
}

describe("login", () => {
  it("returns a demo token for the lab password", async () => {
    const { status, body } = await request(
      "POST",
      "/api/auth/login",
      "",
      JSON.stringify({ email: "budi@example.com", password: "password123" }),
    );
    expect(status).toBe(200);
    expect(body.token).toBe("demo-B001");
  });

  it("rejects a wrong password", async () => {
    const { status } = await request(
      "POST",
      "/api/auth/login",
      "",
      JSON.stringify({ email: "budi@example.com", password: "wrong" }),
    );
    expect(status).toBe(401);
  });
});

describe("loans", () => {
  it("requires a token", async () => {
    const { status } = await request("GET", "/api/loans");
    expect(status).toBe(401);
  });

  it("lists the borrower's loans", async () => {
    const { status, body } = await request("GET", "/api/loans", "demo-B001");
    expect(status).toBe(200);
    expect(body).toHaveLength(7);
  });

  it("returns the loan detail for the owner", async () => {
    const { status, body } = await request("GET", "/api/loans/LN-1001", "demo-B001");
    expect(status).toBe(200);
    expect(body.outstandingPrincipal).toBe(2_000_000);
  });

  it("hides another borrower's loan", async () => {
    const { status } = await request("GET", "/api/loans/LN-2001", "demo-B001");
    expect(status).toBe(404);
  });

  it("returns 404 for an unknown loan", async () => {
    const { status } = await request("GET", "/api/loans/LN-9999", "demo-B001");
    expect(status).toBe(404);
  });
});
