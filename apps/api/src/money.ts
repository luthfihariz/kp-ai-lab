export function divRoundHalfUp(numerator: number, denominator: number) {
  return Math.trunc((numerator * 2 + denominator) / (denominator * 2));
}

export function mulBps(amount: number, bps: number) {
  return divRoundHalfUp(amount * bps, 10_000);
}

const MS_PER_DAY = 86_400_000;

/** Actual calendar days between two YYYY-MM-DD dates, using UTC midnights. */
export function calendarDays(from: string, to: string) {
  const start = Date.parse(`${from}T00:00:00.000Z`);
  const end = Date.parse(`${to}T00:00:00.000Z`);
  return (end - start) / MS_PER_DAY;
}

/** Actual calendar days between two UTC midnights. */
export function daysBetween(from: Date, to: Date) {
  return (to.getTime() - from.getTime()) / MS_PER_DAY;
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
