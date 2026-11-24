import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, type LoanDetail } from "../api/client";
import { formatDate, formatRupiah, installmentStatusLabel, loanStatusLabel } from "../format";

export function LoanDetailPage() {
  const { id = "" } = useParams();
  const [loan, setLoan] = useState<LoanDetail | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    api.GET("/api/loans/{id}", { params: { path: { id } } }).then(({ data, error }) => {
      if (error || !data) {
        setFailed(true);
        return;
      }
      setLoan(data);
    });
  }, [id]);

  if (failed) return <main className="page"><p role="alert" className="error">Pinjaman tidak ditemukan.</p></main>;
  if (!loan) return <main className="page"><p>Memuat…</p></main>;

  return (
    <main className="page">
      <Link to="/loans">← Pinjaman Saya</Link>
      <header className="page-header">
        <h1>Pinjaman {loan.id}</h1>
        {loan.status === "ACTIVE" && (
          <Link className="button" to={`/loans/${loan.id}/early-repayment`}>Pelunasan Dipercepat</Link>
        )}
      </header>

      <section className="cards">
        <div className="card"><span>Status</span><strong>{loanStatusLabel[loan.status]}{loan.isOverdue && " · Terlambat"}</strong></div>
        <div className="card"><span>Pokok pinjaman</span><strong>{formatRupiah(loan.principal)}</strong></div>
        <div className="card"><span>Sisa pokok</span><strong>{formatRupiah(loan.outstandingPrincipal)}</strong></div>
        <div className="card"><span>Denda</span><strong>{formatRupiah(loan.lateFees)}</strong></div>
      </section>

      <section>
        <h2>Data peminjam</h2>
        <dl className="details">
          <dt>Nama</dt><dd>{loan.borrower.name}</dd>
          <dt>NIK</dt><dd>{loan.borrower.nik}</dd>
          <dt>No. HP</dt><dd>{loan.borrower.phone}</dd>
          <dt>Rekening</dt><dd>{loan.borrower.bankName} {loan.borrower.bankAccountNumber}</dd>
        </dl>
      </section>

      <section>
        <h2>Jadwal cicilan</h2>
        <table>
          <thead>
            <tr>
              <th>Ke-</th>
              <th>Jatuh tempo</th>
              <th>Pokok</th>
              <th>Bunga</th>
              <th>Total</th>
              <th>Hari</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loan.installments.map((installment) => (
              <tr key={installment.number}>
                <td>{installment.number}</td>
                <td>{formatDate(installment.dueDate)}</td>
                <td>{formatRupiah(installment.principal)}</td>
                <td>{formatRupiah(installment.interest)}</td>
                <td>{formatRupiah(installment.amount)}</td>
                <td>{installment.daysInPeriod}</td>
                <td>{installmentStatusLabel[installment.status]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
