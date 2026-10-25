import { useEffect, useState } from "react";
import api, { errMsg } from "../api";

const empty = { farmName: "", farmSize: "", location: "", latitude: "", longitude: "", soilType: "", soilMoisture: "", soilPH: "", nitrogen: "", phosphorus: "", potassium: "" };
const num = ["farmSize", "latitude", "longitude", "soilMoisture", "soilPH", "nitrogen", "phosphorus", "potassium"];

export default function Farms() {
  const [farms, setFarms] = useState([]);
  const [f, setF] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [err, setErr] = useState("");
  const [advice, setAdvice] = useState({});
  const [act, setAct] = useState({ type: "irrigation", note: "", waterUsed: "", fertilizerUsed: "" });

  const load = () => api.get("/farms").then((r) => setFarms(r.data));
  useEffect(() => { load(); }, []);

  const clean = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== "").map(([k, v]) => [k, num.includes(k) ? Number(v) : v]));
  const save = async (e) => {
    e.preventDefault(); setErr("");
    try {
      editId ? await api.put(`/farms/${editId}`, clean(f)) : await api.post("/farms", clean(f));
      setF(empty); setEditId(null); load();
    } catch (e) { setErr(errMsg(e)); }
  };
  const edit = (farm) => { setEditId(farm._id); setF(Object.fromEntries(Object.keys(empty).map((k) => [k, farm[k] ?? ""]))); };
  const del = async (id) => { if (confirm("Delete this farm?")) { await api.delete(`/farms/${id}`); load(); } };
  const getAdvice = async (id) => setAdvice({ ...advice, [id]: (await api.get(`/farms/${id}/soil-advice`)).data.tips });
  const addActivity = async (id) => {
    await api.post(`/farms/${id}/activities`, { ...act, waterUsed: Number(act.waterUsed) || 0, fertilizerUsed: Number(act.fertilizerUsed) || 0 });
    setAct({ type: "irrigation", note: "", waterUsed: "", fertilizerUsed: "" }); load();
  };

  return (
    <>
      <h1>Farm Management</h1>
      <form className="card form-grid" onSubmit={save}>
        <h3 className="full">{editId ? "Edit farm" : "Add a farm"}</h3>
        {err && <p className="error full">{err}</p>}
        {Object.keys(empty).map((k) => (
          <input key={k} placeholder={k.replace(/([A-Z])/g, " $1")} required={k === "farmName" || k === "farmSize"} type={num.includes(k) ? "number" : "text"} step="any" value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} />
        ))}
        <div className="full row"><button className="btn">{editId ? "Update" : "Add farm"}</button>{editId && <button type="button" className="btn ghost" onClick={() => { setEditId(null); setF(empty); }}>Cancel</button>}</div>
      </form>
      {farms.map((farm) => (
        <div key={farm._id} className="card">
          <div className="list-row">
            <h3>{farm.farmName} <small className="muted">{farm.farmSize} acres · {farm.location}</small></h3>
            <div className="row"><button className="btn ghost" onClick={() => edit(farm)}>Edit</button><button className="btn danger" onClick={() => del(farm._id)}>Delete</button></div>
          </div>
          <p className="muted">Soil: {farm.soilType || "-"} · Moisture {farm.soilMoisture ?? "-"}% · pH {farm.soilPH ?? "-"} · N {farm.nitrogen ?? "-"} P {farm.phosphorus ?? "-"} K {farm.potassium ?? "-"}</p>
          <button className="btn ghost" onClick={() => getAdvice(farm._id)}>🧪 Soil recommendations</button>
          {advice[farm._id] && <ul>{advice[farm._id].map((t) => <li key={t}>{t}</li>)}</ul>}
          <h4>Activities</h4>
          <div className="row wrap">
            <select value={act.type} onChange={(e) => setAct({ ...act, type: e.target.value })}>{["planting", "fertilizing", "irrigation", "spraying", "harvesting", "other"].map((t) => <option key={t}>{t}</option>)}</select>
            <input placeholder="Note" value={act.note} onChange={(e) => setAct({ ...act, note: e.target.value })} />
            <input type="number" placeholder="Water (L)" value={act.waterUsed} onChange={(e) => setAct({ ...act, waterUsed: e.target.value })} />
            <input type="number" placeholder="Fertilizer (kg)" value={act.fertilizerUsed} onChange={(e) => setAct({ ...act, fertilizerUsed: e.target.value })} />
            <button className="btn" onClick={() => addActivity(farm._id)}>Log</button>
          </div>
          {farm.activities.slice().reverse().map((a) => (
            <div key={a._id} className="list-row small"><span>{new Date(a.date).toLocaleDateString()} · <b>{a.type}</b> {a.note}</span><span className="muted">{a.waterUsed}L · {a.fertilizerUsed}kg</span></div>
          ))}
        </div>
      ))}
    </>
  );
}
