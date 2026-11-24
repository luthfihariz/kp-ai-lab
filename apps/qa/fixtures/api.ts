import { expect, type APIRequestContext } from "@playwright/test";

export async function loginAs(request: APIRequestContext, user: { email: string; password: string }): Promise<string> {
  const response = await request.post("/api/auth/login", {
    data: { email: user.email, password: user.password },
  });
  expect(response.status()).toBe(200);
  const body = await response.json();
  return body.token;
}

export function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}
