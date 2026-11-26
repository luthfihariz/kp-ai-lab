import type { Loan } from "../loans";
import { calendarDays, divRoundHalfUp, mulBps } from "../money";

const ADMIN_FEE_RATE_BPS = 100;
const MIN_ADMIN_FEE = 10_000;
const MAX_ADMIN_FEE = 500_000;

/** 1% of outstanding principal, clamped to Rp 10.000–500.000. Waived when one installment remains. */
export function earlyRepaymentAdminFee(outstandingPrincipal: number, unpaidCount: number) {
  if (unpaidCount === 1) {
    return 0;
  }
  const fee = mulBps(outstandingPrincipal, ADMIN_FEE_RATE_BPS);
  if (fee < MIN_ADMIN_FEE) {
    return MIN_ADMIN_FEE;
  }
  if (fee > MAX_ADMIN_FEE) {
    return MAX_ADMIN_FEE;
  }
  return fee;
}

const BPS_SCALE = 10_000;
const DAYS_IN_ACCRUAL_MONTH = 30;

export function quoteEarlyRepayment(loan: Loan, today: string) {
  const unpaid = loan.installments.filter((installment) => installment.status === "UNPAID");
  const outstandingPrincipal = unpaid.reduce((total, installment) => total + installment.principal, 0);
  const overdueInterest = unpaid.reduce(
    (total, installment) => (installment.dueDate < today ? total + installment.interest : total),
    0,
  );
  const periodStart = loan.installments.reduce(
    (latest, installment) => (installment.dueDate <= today && installment.dueDate > latest ? installment.dueDate : latest),
    "",
  );
  const accruedInterestDays = calendarDays(periodStart === "" ? loan.disbursedAt : periodStart, today);
  const accruedInterest = divRoundHalfUp(
    outstandingPrincipal * loan.monthlyInterestRateBps * accruedInterestDays,
    BPS_SCALE * DAYS_IN_ACCRUAL_MONTH,
  );
  const lateFees = loan.lateFees;
  const earlyRepaymentFee = earlyRepaymentAdminFee(outstandingPrincipal, unpaid.length);
  return {
    quoteId: `Q-${loan.id}-${today.replaceAll("-", "")}`,
    loanId: loan.id,
    outstandingPrincipal,
    overdueInterest,
    accruedInterestDays,
    accruedInterest,
    lateFees,
    earlyRepaymentFee,
    total: outstandingPrincipal + overdueInterest + accruedInterest + lateFees + earlyRepaymentFee,
    currency: "IDR" as const,
    validUntil: `${today}T23:59:59+07:00`,
  };
}
