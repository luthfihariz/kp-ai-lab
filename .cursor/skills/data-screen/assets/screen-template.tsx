import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, type LoanSummary } from "../api/client";
import { formatRupiah, loanStatusLabel } from "../format";

export function TemplatePage() {
  const [items, setItems] = useState<LoanSummary[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    api.GET("/api/loans").then(({ data, error }) => {
      if (error || !data) {
        setFailed(true);
        return;
      }
      setItems(data);
    });
  }, []);

  if (failed) return <main className="page"><p role="alert" className="error">Gagal memuat data.</p></main>;
  if (!items) return <main className="page"><p>Memuat…</p></main>;

  return (
    <main className="page">
      <Link to="/loans">← Pinjaman Saya</Link>
      <h1>JUDUL</h1>
      {items.length === 0 ? (
        <p>Belum ada data.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID Pinjaman</th>
              <th>Status</th>
              <th>Sisa pokok</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td><Link to={`/loans/${item.id}`}>{item.id}</Link></td>
                <td>{loanStatusLabel[item.status]}</td>
                <td>{formatRupiah(item.outstandingPrincipal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
