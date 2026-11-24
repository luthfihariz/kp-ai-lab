export function divRoundHalfUp(numerator: number, denominator: number) {
  return Math.trunc((numerator * 2 + denominator) / (denominator * 2));
}

export function mulBps(amount: number, bps: number) {
  return divRoundHalfUp(amount * bps, 10_000);
}

/** 30/360 day count used by the installment schedule. */
export function daysBetween(from: Date, to: Date) {
  const years = to.getUTCFullYear() - from.getUTCFullYear();
  const months = to.getUTCMonth() - from.getUTCMonth();
  const days = to.getUTCDate() - from.getUTCDate();
  return years * 360 + months * 30 + days;
}

export function addMonthsClamped(date: Date, months: number) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + months;
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const day = Math.min(date.getUTCDate(), lastDay);
  return new Date(Date.UTC(year, month, day));
}

export function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}
