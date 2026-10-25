import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [s, setS] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [crops, setCrops] = useState([]);
  useEffect(() => {
    api.get("/reports/summary").then((r) => setS(r.data));
    api.get("/crops/alerts").then((r) => setAlerts(r.data));
    api.get("/crops").then((r) => setCrops(r.data));
  }, []);
  const stats = s ? [
    ["Farms", s.farms], ["Total area (acres)", s.totalArea], ["Crops", s.crops], ["Expected yield (q)", s.expectedYield],
    ["Water used (L)", s.waterUsed], ["Fertilizer used (kg)", s.fertilizerUsed], ["Spent (₹)", s.spent.toLocaleString()],
  ] : [];
  return (
    <>
      <h1>Hello, {user.name} 👋</h1>
      <div className="stats">{stats.map(([l, v]) => <div key={l} className="stat"><span>{l}</span><strong>{v}</strong></div>)}</div>
      <div className="two">
        <div className="card">
          <h3>Crop growth stages</h3>
          {crops.length === 0 && <p className="muted">No crops yet. <Link to="/crops">Add a crop</Link></p>}
          {crops.map((c) => (
            <div key={c._id} className="list-row"><span>{c.cropName} <small className="muted">{c.farm?.farmName}</small></span><span className={`tag ${c.health}`}>{c.stage}</span></div>
          ))}
        </div>
        <div className="card">
          <h3>🐛 Pest & disease alerts</h3>
          {alerts.map((a) => (
            <div key={a._id} className={`alert ${a.severity}`}><strong>{a.title}</strong> <small>({a.crop})</small><p>{a.message}</p><p className="muted">Treatment: {a.treatment}</p></div>
          ))}
        </div>
      </div>
    </>
  );
}
