const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const shortDate = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function formatRupiah(amount: number): string {
  return rupiah.format(amount);
}

export function formatDate(isoDate: string): string {
  return shortDate.format(new Date(isoDate));
}

export const loanStatusLabel: Record<string, string> = {
  ACTIVE: "Aktif",
  PAID_OFF: "Lunas",
  CANCELLED: "Dibatalkan",
};

export const installmentStatusLabel: Record<string, string> = {
  PAID: "Dibayar",
  UNPAID: "Belum dibayar",
  CANCELLED: "Dibatalkan",
};
