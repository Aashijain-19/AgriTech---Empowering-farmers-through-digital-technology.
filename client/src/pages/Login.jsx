import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { errMsg } from "../api";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const submit = async (e) => {
    e.preventDefault(); setErr("");
    try { await login(f.email, f.password); nav("/dashboard"); } catch (e) { setErr(errMsg(e)); }
  };
  return (
    <form className="card auth" onSubmit={submit}>
      <h2>Welcome back</h2>
      {err && <p className="error">{err}</p>}
      <input type="email" placeholder="Email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
      <input type="password" placeholder="Password" required value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
      <button className="btn">Login</button>
      <p className="muted">No account? <Link to="/register">Sign up</Link></p>
    </form>
  );
}
