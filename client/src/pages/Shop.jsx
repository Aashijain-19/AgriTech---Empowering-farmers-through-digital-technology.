import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { errMsg } from "../api";
import { useAuth } from "../AuthContext";

const cats = ["", "seeds", "fertilizers", "pesticides", "equipment", "service"];
const icons = { seeds: "🌱", fertilizers: "🧪", pesticides: "🐛", equipment: "🛠", service: "👨‍🌾" };

export default function Shop() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [cat, setCat] = useState("");
  const [search, setSearch] = useState("");
  const [qty, setQty] = useState({});
  const [date, setDate] = useState({});
  const [msg, setMsg] = useState("");
  const load = () => api.get("/products", { params: { category: cat || undefined, search: search || undefined } }).then((r) => setItems(r.data));
  useEffect(() => { load(); }, [cat, search]);

  const buy = async (p) => {
    if (!user) return nav("/login");
    try {
      await api.post("/bookings", { productId: p._id, quantity: Number(qty[p._id] || 1), serviceDate: date[p._id] });
      setMsg(`✅ Ordered ${p.name}. See it in My Orders.`); load();
    } catch (e) { setMsg(`❌ ${errMsg(e)}`); }
  };

  return (
    <>
      <h1>Buy Resources</h1>
      <div className="row wrap">
        {cats.map((c) => <button key={c} className={`btn ${cat === c ? "" : "ghost"}`} onClick={() => setCat(c)}>{c || "All"}</button>)}
        <input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      {msg && <p className="notice">{msg}</p>}
      <div className="grid">
        {items.map((p) => (
          <div key={p._id} className="card">
            <div className="icon">{icons[p.category]}</div>
            <h3>{p.name}</h3>
            <p className="muted">{p.description}</p>
            <p className="price">₹{p.price} <small>/ {p.unit}</small></p>
            <p className="muted">{p.stock > 0 ? `${p.stock} available` : "Out of stock"}</p>
            {p.category === "service" && <input type="date" value={date[p._id] || ""} onChange={(e) => setDate({ ...date, [p._id]: e.target.value })} />}
            <div className="row">
              <input type="number" min="1" style={{ width: 70 }} value={qty[p._id] || 1} onChange={(e) => setQty({ ...qty, [p._id]: e.target.value })} />
              <button className="btn" disabled={p.stock < 1} onClick={() => buy(p)}>{p.category === "service" ? "Book" : "Buy"}</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
