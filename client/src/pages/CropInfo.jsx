import { useEffect, useState } from "react";
import api from "../api";

export default function CropInfo() {
  const [list, setList] = useState([]);
  const [q, setQ] = useState("");
  useEffect(() => { api.get("/crops/info").then((r) => setList(r.data)); }, []);
  const shown = list.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <h1>Crop Info</h1>
      <input placeholder="Search crops..." value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="grid">
        {shown.map((c) => (
          <div key={c.name} className="card">
            <h3>{c.name} <small className="muted">{c.type}</small></h3>
            <p><b>Sowing:</b> {c.sowing} · <b>Harvest:</b> {c.harvest}</p>
            <p><b>Duration:</b> {c.duration}</p>
            <p><b>Soil:</b> {c.soil}</p>
            <p><b>Water:</b> {c.water}</p>
            <p><b>Care:</b> {c.care}</p>
            <p><b>Common pests:</b> {c.pests.join(", ")}</p>
            <p className="muted"><b>Treatment:</b> {c.treatment}</p>
          </div>
        ))}
      </div>
    </>
  );
}
