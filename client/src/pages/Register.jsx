import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { errMsg } from "../api";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ name: "", email: "", phone: "", address: "", password: "" });
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault(); setErr("");
    if (f.password.length < 6) return setErr("Password must be at least 6 characters");
    try { await register(f); nav("/dashboard"); } catch (e) { setErr(errMsg(e)); }
  };
  return (
    <form className="card auth" onSubmit={submit}>
      <h2>Create your account</h2>
      {err && <p className="error">{err}</p>}
      <input placeholder="Full name" required value={f.name} onChange={set("name")} />
      <input type="email" placeholder="Email" required value={f.email} onChange={set("email")} />
      <input placeholder="Phone" value={f.phone} onChange={set("phone")} />
      <input placeholder="Address" value={f.address} onChange={set("address")} />
      <input type="password" placeholder="Password" required value={f.password} onChange={set("password")} />
      <button className="btn">Sign up</button>
      <p className="muted">Already registered? <Link to="/login">Login</Link></p>
    </form>
  );
}
