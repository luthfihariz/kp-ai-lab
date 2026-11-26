import { Link, useParams } from "react-router-dom";

export function EarlyRepaymentPage() {
  const { id = "" } = useParams();

  return (
    <main className="page">
      <Link to={`/loans/${id}`}>← Pinjaman</Link>
      <h1>Pelunasan Dipercepat</h1>
      <p>
        Layar ini dibangun saat lab. Lihat docs/design/design-early-repayment.md, mockup di docs/design/, dan
        POST /api/loans/{"{id}"}/early-repayment/quote di contract/openapi.yaml.
      </p>
    </main>
  );
}
