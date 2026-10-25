import { useEffect, useState } from "react";
import api, { errMsg } from "../api";

const empty = { cropName: "", cropType: "", farm: "", sowingTime: "", harvestingTime: "", stage: "sown", health: "good", expectedYield: "", notes: "" };
const stages = ["sown", "germination", "vegetative", "flowering", "fruiting", "harvested"];

export default function Crops() {
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [f, setF] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [err, setErr] = useState("");
  const load = () => api.get("/crops").then((r) => setCrops(r.data));
  useEffect(() => { load(); api.get("/farms").then((r) => setFarms(r.data)); }, []);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const save = async (e) => {
    e.preventDefault(); setErr("");
    const body = Object.fromEntries(Object.entries(f).filter(([, v]) => v !== ""));
    if (body.expectedYield) body.expectedYield = Number(body.expectedYield);
    try { editId ? await api.put(`/crops/${editId}`, body) : await api.post("/crops", body); setF(empty); setEditId(null); load(); } catch (e) { setErr(errMsg(e)); }
  };
  const edit = (c) => { setEditId(c._id); setF({ ...empty, ...c, farm: c.farm?._id || "", sowingTime: c.sowingTime?.slice(0, 10) || "", harvestingTime: c.harvestingTime?.slice(0, 10) || "", expectedYield: c.expectedYield ?? "" }); };
  const del = async (id) => { if (confirm("Delete this crop?")) { await api.delete(`/crops/${id}`); load(); } };
  const advance = async (c) => { const i = stages.indexOf(c.stage); if (i < stages.length - 1) { await api.put(`/crops/${c._id}`, { stage: stages[i + 1] }); load(); } };

  return (
    <>
      <h1>Crop Management</h1>
      <form className="card form-grid" onSubmit={save}>
        <h3 className="full">{editId ? "Edit crop" : "Add a crop"}</h3>
        {err && <p className="error full">{err}</p>}
        <input placeholder="Crop name" required value={f.cropName} onChange={set("cropName")} />
        <input placeholder="Crop type (e.g. cereal)" value={f.cropType} onChange={set("cropType")} />
        <select value={f.farm} onChange={set("farm")}><option value="">Select farm</option>{farms.map((x) => <option key={x._id} value={x._id}>{x.farmName}</option>)}</select>
        <label>Sowing <input type="date" value={f.sowingTime} onChange={set("sowingTime")} /></label>
        <label>Harvest <input type="date" value={f.harvestingTime} onChange={set("harvestingTime")} /></label>
        <select value={f.stage} onChange={set("stage")}>{stages.map((s) => <option key={s}>{s}</option>)}</select>
        <select value={f.health} onChange={set("health")}>{["good", "average", "poor"].map((s) => <option key={s}>{s}</option>)}</select>
        <input type="number" placeholder="Expected yield (quintals)" value={f.expectedYield} onChange={set("expectedYield")} />
        <input className="full" placeholder="Notes" value={f.notes} onChange={set("notes")} />
        <div className="full row"><button className="btn">{editId ? "Update" : "Add crop"}</button>{editId && <button type="button" className="btn ghost" onClick={() => { setEditId(null); setF(empty); }}>Cancel</button>}</div>
      </form>
      <div className="card">
        <table>
          <thead><tr><th>Crop</th><th>Farm</th><th>Sowing</th><th>Harvest</th><th>Stage</th><th>Health</th><th>Yield</th><th></th></tr></thead>
          <tbody>
            {crops.map((c) => (
              <tr key={c._id}>
                <td>{c.cropName}<br /><small className="muted">{c.cropType}</small></td>
                <td>{c.farm?.farmName || "-"}</td>
                <td>{c.sowingTime ? new Date(c.sowingTime).toLocaleDateString() : "-"}</td>
                <td>{c.harvestingTime ? new Date(c.harvestingTime).toLocaleDateString() : "-"}</td>
                <td><div className="progress"><div style={{ width: `${((stages.indexOf(c.stage) + 1) / stages.length) * 100}%` }} /></div>{c.stage}</td>
                <td><span className={`tag ${c.health}`}>{c.health}</span></td>
                <td>{c.expectedYield ?? "-"}</td>
                <td className="row"><button className="btn ghost" onClick={() => advance(c)}>Next stage</button><button className="btn ghost" onClick={() => edit(c)}>Edit</button><button className="btn danger" onClick={() => del(c._id)}>✕</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {crops.length === 0 && <p className="muted">No crops yet.</p>}
      </div>
    </>
  );
}
