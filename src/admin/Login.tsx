import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import { ApiError, errorMessage } from "../lib/api";
import { useAuth } from "./auth";

export default function Login() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/admin" replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof ApiError && err.status === 429 ? "Too many attempts. Wait a minute and try again." : errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="adm adm-login">
      <form className="adm-card adm-login-card" onSubmit={submit} noValidate>
        <h1>Administrator login</h1>
        <p className="adm-muted">Sign in to manage the Haribon website content.</p>

        {error && <div className="adm-notice error" role="alert">{error}</div>}

        <label className="adm-field">
          <span className="adm-label">Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
        </label>
        <label className="adm-field">
          <span className="adm-label">Password</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </label>

        <button type="submit" className="adm-btn primary full" disabled={busy}>
          {busy ? "Signing in..." : "Log in"}
        </button>
        <p className="adm-muted center"><Link to="/">Back to the website</Link></p>
      </form>
    </div>
  );
}
