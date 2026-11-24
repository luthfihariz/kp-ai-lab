import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { factory } from "../env";
import { httpError } from "../errors";
import { borrowerByEmail, type AppDb } from "../loans";

const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export function authRoutes(db: AppDb) {
  const auth = factory.createApp();

  auth.post(
    "/login",
    zValidator("json", loginSchema, (result, c) => {
      if (!result.success) {
        return c.json(
          { code: "INVALID_REQUEST", message: "request body must be JSON with email and password" },
          400,
        );
      }
    }),
    async (c) => {
      const { email, password } = c.req.valid("json");
      const borrower = await borrowerByEmail(db, email);
      if (!borrower || borrower.password !== password) {
        httpError(401, "INVALID_CREDENTIALS", "email or password is incorrect");
      }
      return c.json({
        token: `demo-${borrower.id}`,
        borrower: { id: borrower.id, name: borrower.name },
      });
    },
  );

  return auth;
}
