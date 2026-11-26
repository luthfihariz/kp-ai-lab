# Design: payoff screen (text version of the Figma frame)

Mockups are in `docs/design/`. Attach them to the agent (for example `@docs/design/payoff-default.png`) together with this file. The Figma frame is shown by the trainer as a demo only.

Route: `/loans/:id/early-repayment` · Language: Bahasa Indonesia

## Mockups

| State | Image |
|---|---|
| Default | [payoff-default.png](payoff-default.png) |
| Overdue loan (all rows visible) | [payoff-overdue.png](payoff-overdue.png) |
| Last installment (fee waived) | [payoff-last-installment.png](payoff-last-installment.png) |
| Loading | [payoff-loading.png](payoff-loading.png) |
| Confirming (button disabled) | [payoff-confirming.png](payoff-confirming.png) |

There are no mockups yet for the confirmed, 409, 410 and network error states. Build those from the text below.

## Layout, top to bottom

1. **Back link:** "← Kembali ke pinjaman"
2. **Title:** "Pelunasan Dipercepat"
3. **Subtitle:** "Pinjaman {loanId} · Rekening tujuan dana: {bankName} ****{last 4 digits}"
4. **Breakdown card** (one row per component, label left, amount right, formatted as `Rp 1.234.567`):
   - Sisa pokok
   - Bunga terlambat (hide the row when 0)
   - Bunga berjalan ({accruedInterestDays} hari)
   - Denda (hide the row when 0)
   - Biaya pelunasan (show "Gratis" when 0)
   - Divider, then **Total pelunasan** in bold
5. **Validity note:** "Berlaku sampai {validUntil as HH:mm} WIB hari ini"
6. **Primary button:** "Konfirmasi pelunasan"
7. **After confirming:** replace the button with a card showing the virtual account number (copy button) and the amount

## States

| State | What to show |
|---|---|
| Loading | Skeleton rows in the breakdown card |
| Loan not active (409) | Message "Pinjaman ini sudah tidak aktif." and the back link |
| Quote expired (410 on confirm) | Message "Penawaran sudah kedaluwarsa." and a button "Hitung ulang" that requests a new quote |
| Network error | Message "Gagal memuat. Coba lagi." and a retry button |

## Rules

- Never show the full bank account number, NIK or phone number on this screen.
- Disable the confirm button while the request is in flight, so a double tap sends one request.
