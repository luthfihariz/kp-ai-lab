import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, type Profile } from "../api/client";
import { clearToken } from "../auth";

export function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    api.GET("/api/me").then(({ data, error, response }) => {
      if (response?.status === 401) {
        clearToken();
        navigate("/login", { replace: true });
        return;
      }
      if (error || !data) {
        setFailed(true);
        return;
      }
      setProfile(data);
    });
  }, [navigate]);

  function logout() {
    clearToken();
    navigate("/login");
  }

  return (
    <main className="page">
      <Link to="/loans">← Pinjaman Saya</Link>
      <header className="page-header">
        <h1>Profil Saya</h1>
        <button className="secondary" onClick={logout}>Keluar</button>
      </header>
      {failed && <p role="alert" className="error">Gagal memuat profil.</p>}
      {!profile && !failed && <p>Memuat…</p>}
      {profile && (
        <>
          <dl className="details">
            <dt>Nama</dt><dd>{profile.name}</dd>
            <dt>Email</dt><dd>{profile.email}</dd>
            <dt>No. HP</dt><dd>{profile.phoneMasked}</dd>
            <dt>Bank</dt><dd>{profile.bankName}</dd>
            <dt>Rekening</dt><dd>{profile.bankAccountMasked}</dd>
            <dt>Kota</dt><dd>{profile.city}</dd>
            <dt>Pinjaman aktif</dt><dd>{profile.activeLoans}</dd>
          </dl>
          {profile.activeLoans === 0 && <p>Belum ada pinjaman aktif.</p>}
        </>
      )}
    </main>
  );
}
