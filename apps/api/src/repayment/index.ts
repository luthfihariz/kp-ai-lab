import { mulBps } from "../money";

const ADMIN_FEE_RATE_BPS = 100;
const MIN_ADMIN_FEE = 10_000;
const MAX_ADMIN_FEE = 500_000;

/** 1% of outstanding principal, clamped to Rp 10.000–500.000. */
export function earlyRepaymentAdminFee(outstandingPrincipal: number) {
  const fee = mulBps(outstandingPrincipal, ADMIN_FEE_RATE_BPS);
  if (fee < MIN_ADMIN_FEE) {
    return MIN_ADMIN_FEE;
  }
  if (fee > MAX_ADMIN_FEE) {
    return MAX_ADMIN_FEE;
  }
  return fee;
}
