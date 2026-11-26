import { sentry } from "@sentry/hono/node";
import { factory } from "./env";
import { authRoutes } from "./auth/routes";
import { loanRoutes } from "./loans/routes";
import type { AppDb } from "./loans";
import { repaymentRoutes } from "./repayment/routes";

const labToday = "2026-11-16";

export function resolveToday(value = process.env.APP_TODAY) {
  if (value === undefined || value === "") {
    return labToday;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00.000Z`))) {
    throw new Error(`APP_TODAY must look like 2026-11-16: ${value}`);
  }
  return value;
}

export function createApp(db: AppDb, today = resolveToday()) {
  const app = factory.createApp();
  app.use(sentry(app));
  app.route("/api/auth", authRoutes(db));
  app.route("/api/loans", loanRoutes(db, today));
  app.route("/api/loans", repaymentRoutes(db, today));
  return app;
}
