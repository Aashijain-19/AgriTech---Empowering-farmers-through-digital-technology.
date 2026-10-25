import { useEffect, useState } from "react";
import api, { errMsg } from "../api";

const emptyP = { name: "", category: "seeds", price: "", unit: "unit", stock: "", description: "" };

export default function Admin() {
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [products, setProducts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [p, setP] = useState(emptyP);
  const [editId, setEditId] = useState(null);
  const [a, setA] = useState({ title: "", crop: "", severity: "medium", message: "", treatment: "" });

  const load = () => {
    api.get("/admin/stats").then((r) => setStats(r.data));
    api.get("/admin/users").then((r) => setUsers(r.data));
    api.get("/admin/bookings").then((r) => setBookings(r.data));
    api.get("/products").then((r) => setProducts(r.data));
    api.get("/crops/alerts").then((r) => setAlerts(r.data));
  };
  useEffect(load, []);

  const saveProduct = async (e) => {
    e.preventDefault();
    const body = { ...p, price: Number(p.price), stock: Number(p.stock) };
    try { editId ? await api.put(`/products/${editId}`, body) : await api.post("/products", body); setP(emptyP); setEditId(null); load(); } catch (e) { alert(errMsg(e)); }
  };

  return (
    <>
      <h1>Admin Panel</h1>
      <div className="row wrap">{["overview", "users", "bookings", "products", "alerts"].map((t) => <button key={t} className={`btn ${tab === t ? "" : "ghost"}`} onClick={() => setTab(t)}>{t}</button>)}</div>

      {tab === "overview" && stats && (
        <>
          <div className="stats">
            {[["Farmers", stats.users], ["Farms", stats.farms], ["Crops", stats.crops], ["Products", stats.products], ["Bookings", stats.bookings], ["Revenue (₹)", stats.revenue.toLocaleString()]].map(([l, v]) => <div key={l} className="stat"><span>{l}</span><strong>{v}</strong></div>)}
          </div>
          <div className="two">
            <div className="card"><h3>Bookings by status</h3>{stats.byStatus.map((s) => <div key={s._id} className="list-row"><span>{s._id}</span><b>{s.count}</b></div>)}</div>
            <div className="card"><h3>Low stock</h3>{stats.lowStock.length ? stats.lowStock.map((s) => <div key={s._id} className="list-row"><span>{s.name}</span><b>{s.stock}</b></div>) : <p className="muted">All products well stocked.</p>}</div>
          </div>
        </>
      )}

      {tab === "users" && (
        <div className="card"><table>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Verified</th><th></th></tr></thead>
          <tbody>{users.map((u) => (
            <tr key={u._id}><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td><td>{u.isVerified ? "✅" : "⏳"}</td>
              <td className="row">{!u.isVerified && <button className="btn" onClick={async () => { await api.put(`/admin/users/${u._id}/verify`); load(); }}>Verify</button>}
                {u.role !== "admin" && <button className="btn danger" onClick={async () => { if (confirm("Delete user?")) { await api.delete(`/admin/users/${u._id}`); load(); } }}>Delete</button>}</td></tr>
          ))}</tbody>
        </table></div>
      )}

      {tab === "bookings" && (
        <div className="card"><table>
          <thead><tr><th>User</th><th>Item</th><th>Qty</th><th>Total</th><th>Status</th></tr></thead>
          <tbody>{bookings.map((b) => (
            <tr key={b._id}><td>{b.user?.name}<br /><small className="muted">{b.user?.email}</small></td><td>{b.product?.name}</td><td>{b.quantity}</td><td>₹{b.totalAmount}</td>
              <td><select value={b.status} onChange={async (e) => { await api.put(`/admin/bookings/${b._id}`, { status: e.target.value }); load(); }}>{["pending", "confirmed", "delivered", "cancelled"].map((s) => <option key={s}>{s}</option>)}</select></td></tr>
          ))}</tbody>
        </table></div>
      )}

      {tab === "products" && (
        <>
          <form className="card form-grid" onSubmit={saveProduct}>
            <h3 className="full">{editId ? "Edit product" : "Add product"}</h3>
            <input placeholder="Name" required value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} />
            <select value={p.category} onChange={(e) => setP({ ...p, category: e.target.value })}>{["seeds", "fertilizers", "pesticides", "equipment", "service"].map((c) => <option key={c}>{c}</option>)}</select>
            <input type="number" placeholder="Price" required value={p.price} onChange={(e) => setP({ ...p, price: e.target.value })} />
            <input placeholder="Unit" value={p.unit} onChange={(e) => setP({ ...p, unit: e.target.value })} />
            <input type="number" placeholder="Stock" required value={p.stock} onChange={(e) => setP({ ...p, stock: e.target.value })} />
            <input placeholder="Description" value={p.description} onChange={(e) => setP({ ...p, description: e.target.value })} />
            <div className="full row"><button className="btn">{editId ? "Update" : "Add"}</button>{editId && <button type="button" className="btn ghost" onClick={() => { setEditId(null); setP(emptyP); }}>Cancel</button>}</div>
          </form>
          <div className="card"><table>
            <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th></th></tr></thead>
            <tbody>{products.map((x) => (
              <tr key={x._id}><td>{x.name}</td><td>{x.category}</td><td>₹{x.price}</td><td>{x.stock}</td>
                <td className="row"><button className="btn ghost" onClick={() => { setEditId(x._id); setP({ ...emptyP, ...x }); }}>Edit</button>
                  <button className="btn danger" onClick={async () => { if (confirm("Delete product?")) { await api.delete(`/products/${x._id}`); load(); } }}>Delete</button></td></tr>
            ))}</tbody>
          </table></div>
        </>
      )}

      {tab === "alerts" && (
        <>
          <form className="card form-grid" onSubmit={async (e) => { e.preventDefault(); await api.post("/admin/alerts", a); setA({ title: "", crop: "", severity: "medium", message: "", treatment: "" }); load(); }}>
            <h3 className="full">Publish pest / disease alert</h3>
            <input placeholder="Title" required value={a.title} onChange={(e) => setA({ ...a, title: e.target.value })} />
            <input placeholder="Crop" value={a.crop} onChange={(e) => setA({ ...a, crop: e.target.value })} />
            <select value={a.severity} onChange={(e) => setA({ ...a, severity: e.target.value })}>{["low", "medium", "high"].map((s) => <option key={s}>{s}</option>)}</select>
            <input placeholder="Message" value={a.message} onChange={(e) => setA({ ...a, message: e.target.value })} />
            <input className="full" placeholder="Suggested treatment" value={a.treatment} onChange={(e) => setA({ ...a, treatment: e.target.value })} />
            <div className="full"><button className="btn">Publish</button></div>
          </form>
          {alerts.map((x) => <div key={x._id} className={`alert ${x.severity}`}><div className="list-row"><strong>{x.title} ({x.crop})</strong><button className="btn danger" onClick={async () => { await api.delete(`/admin/alerts/${x._id}`); load(); }}>Delete</button></div><p>{x.message}</p></div>)}
        </>
      )}
    </>
  );
}
