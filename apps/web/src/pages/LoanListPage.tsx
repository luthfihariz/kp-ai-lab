import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, type LoanSummary } from "../api/client";
import { clearToken } from "../auth";
import { formatDate, formatRupiah, loanStatusLabel } from "../format";

export function LoanListPage() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState<LoanSummary[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    api.GET("/api/loans").then(({ data, error }) => {
      if (error || !data) {
        setFailed(true);
        return;
      }
      setLoans(data);
    });
  }, []);

  function logout() {
    clearToken();
    navigate("/login");
  }

  return (
    <main className="page">
      <header className="page-header">
        <h1>Pinjaman Saya</h1>
        <div className="page-header">
          <Link to="/profil">Profil</Link>
          <button className="secondary" onClick={logout}>Keluar</button>
        </div>
      </header>
      {failed && <p role="alert" className="error">Gagal memuat pinjaman.</p>}
      {!loans && !failed && <p>Memuat…</p>}
      {loans && (
        <table>
          <thead>
            <tr>
              <th>ID Pinjaman</th>
              <th>Status</th>
              <th>Pokok</th>
              <th>Sisa pokok</th>
              <th>Jatuh tempo berikutnya</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.id}>
                <td><Link to={`/loans/${loan.id}`}>{loan.id}</Link></td>
                <td>
                  {loanStatusLabel[loan.status]}
                  {loan.isOverdue && <span className="tag danger">Terlambat</span>}
                </td>
                <td>{formatRupiah(loan.principal)}</td>
                <td>{formatRupiah(loan.outstandingPrincipal)}</td>
                <td>{loan.nextDueDate ? formatDate(loan.nextDueDate) : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
