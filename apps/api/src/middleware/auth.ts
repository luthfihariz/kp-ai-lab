import { factory } from "../env";
import { httpError } from "../errors";

export const requireBorrower = factory.createMiddleware(async (c, next) => {
  const header = c.req.header("Authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice("Bearer ".length) : header;
  if (!token.startsWith("demo-") || token.length === "demo-".length) {
    httpError(401, "UNAUTHORIZED", "missing or invalid token");
  }
  c.set("borrowerId", token.slice("demo-".length));
  await next();
});
