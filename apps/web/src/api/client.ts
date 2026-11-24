import createClient from "openapi-fetch";
import type { components, paths } from "./schema";
import { getToken } from "../auth";

export type LoanSummary = components["schemas"]["LoanSummary"];
export type LoanDetail = components["schemas"]["LoanDetail"];
export type Installment = components["schemas"]["Installment"];
export type EarlyRepaymentQuote = components["schemas"]["EarlyRepaymentQuote"];
export type ApiError = components["schemas"]["Error"];

export const api = createClient<paths>({ baseUrl: window.location.origin });

api.use({
  onRequest({ request }) {
    const token = getToken();
    if (token) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }
    return request;
  },
});
