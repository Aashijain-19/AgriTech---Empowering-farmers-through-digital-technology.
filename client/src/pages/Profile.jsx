import { useState } from "react";
import api from "../api";
import { useAuth } from "../AuthContext";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [f, setF] = useState({ name: user.name, phone: user.phone || "", address: user.address || "" });
  const [ok, setOk] = useState(false);
  const save = async (e) => { e.preventDefault(); setUser((await api.put("/users/me", f)).data); setOk(true); };
  return (
    <form className="card auth" onSubmit={save}>
      <h2>My Profile</h2>
      <p className="muted">{user.email} · {user.role} · {user.isVerified ? "✅ verified" : "⏳ pending verification"}</p>
      <input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Name" />
      <input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} placeholder="Phone" />
      <input value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} placeholder="Address" />
      <button className="btn">Save</button>
      {ok && <p className="notice">Profile updated</p>}
    </form>
  );
}
