import { HTTPException } from "hono/http-exception";
import type { ErrorHandler } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export function httpError(status: ContentfulStatusCode, code: string, message: string): never {
  throw new HTTPException(status, {
    res: Response.json({ code, message }, { status }),
  });
}

export const handleError: ErrorHandler = (err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  console.error(err);
  return c.json({ code: "INTERNAL", message: "internal server error" }, 500);
};
