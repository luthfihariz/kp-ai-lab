import { createFactory } from "hono/factory";
import { handleError } from "./errors";

export type Env = {
  Variables: {
    borrowerId: string;
  };
};

export const factory = createFactory<Env>({
  initApp: (app) => {
    app.onError(handleError);
  },
});
