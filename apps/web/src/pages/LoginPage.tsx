import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { setToken } from "../auth";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    const { data, error } = await api.POST("/api/auth/login", { body: { email, password } });
    if (error || !data) {
      setError("Email atau password salah.");
      return;
    }
    setToken(data.token);
    navigate("/loans");
  }

  return (
    <main className="page narrow">
      <h1>Masuk</h1>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <p role="alert" className="error">{error}</p>}
        <button type="submit">Masuk</button>
      </form>
      <p className="hint">Akun demo: budi@example.com / password123</p>
    </main>
  );
}
