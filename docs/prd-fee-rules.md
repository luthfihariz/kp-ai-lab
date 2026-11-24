# Early repayment fee rules

Excerpt from docs/prd-early-repayment.md: the fee part of the quote.

| Rule | Value |
|---|---|
| Base | 1% of the outstanding principal |
| Rounding | Half-up to whole rupiah |
| Minimum | Rp 10.000 |
| Maximum | Rp 500.000 |
| Waiver | No fee (Rp 0) when only one UNPAID installment remains |
| Money type | All amounts are whole rupiah integers, never fractional |

## Examples

| Outstanding principal | Unpaid installments | Fee |
|---|---|---|
| Rp 2.000.000 | 2 | Rp 20.000 |
| Rp 500.000 | 3 | Rp 10.000 (minimum) |
| Rp 80.000.000 | 6 | Rp 500.000 (maximum) |
| Rp 1.666.668 | 4 | Rp 16.667 (16.666,68 rounded half-up) |
| Rp 1.500.000 | 1 | Rp 0 (last installment) |
