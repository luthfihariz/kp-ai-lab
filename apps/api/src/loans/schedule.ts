import { addMonthsClamped, daysBetween, mulBps } from "../money";

export type InstallmentStatus = "PAID" | "UNPAID" | "CANCELLED";

export type Installment = {
  number: number;
  dueDate: string;
  principal: number;
  interest: number;
  amount: number;
  daysInPeriod: number;
  status: InstallmentStatus;
};

export function buildSchedule(
  principal: number,
  tenorMonths: number,
  monthlyRateBps: number,
  disbursedAt: Date,
): Installment[] {
  const regularPrincipal = Math.trunc(principal / tenorMonths);
  const interest = mulBps(principal, monthlyRateBps);
  const installments: Installment[] = [];
  let previousDueDate = disbursedAt;

  for (let number = 1; number <= tenorMonths; number++) {
    const dueDate = addMonthsClamped(disbursedAt, number);
    const installmentPrincipal =
      number === tenorMonths ? principal - regularPrincipal * (tenorMonths - 1) : regularPrincipal;
    installments.push({
      number,
      dueDate: dueDate.toISOString().slice(0, 10),
      principal: installmentPrincipal,
      interest,
      amount: installmentPrincipal + interest,
      daysInPeriod: daysBetween(previousDueDate, dueDate),
      status: "UNPAID",
    });
    previousDueDate = dueDate;
  }

  return installments;
}
