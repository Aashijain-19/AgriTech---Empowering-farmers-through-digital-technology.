import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../AuthContext";

// Uses the free Open-Meteo API (no key required)
const codes = { 0: "☀️ Clear", 1: "🌤 Mostly clear", 2: "⛅ Partly cloudy", 3: "☁️ Overcast", 45: "🌫 Fog", 51: "🌦 Drizzle", 61: "🌧 Rain", 63: "🌧 Rain", 65: "🌧 Heavy rain", 80: "🌦 Showers", 95: "⛈ Thunderstorm" };
const label = (c) => codes[c] || codes[Math.floor(c / 10) * 10] || "🌥 Mixed";

export default function Weather() {
  const { user } = useAuth();
  const [farms, setFarms] = useState([]);
  const [loc, setLoc] = useState({ lat: 28.61, lon: 77.21, name: "New Delhi" });
  const [data, setData] = useState(null);
  const [city, setCity] = useState("");

  useEffect(() => { if (user) api.get("/farms").then((r) => setFarms(r.data.filter((f) => f.latitude && f.longitude))); }, [user]);
  useEffect(() => {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`)
      .then((r) => r.json()).then(setData);
  }, [loc]);

  const search = async (e) => {
    e.preventDefault();
    const r = await (await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`)).json();
    if (r.results?.[0]) setLoc({ lat: r.results[0].latitude, lon: r.results[0].longitude, name: r.results[0].name });
  };
  const advice = () => {
    if (!data) return [];
    const t = [];
    if (data.daily.precipitation_sum.slice(0, 3).some((p) => p > 5)) t.push("Rain expected in the next 3 days - postpone spraying and irrigation.");
    if (data.daily.temperature_2m_max.slice(0, 3).some((x) => x > 38)) t.push("Heat wave likely - irrigate in the evening and mulch soil.");
    if (data.current.wind_speed_10m > 20) t.push("High winds - avoid pesticide spraying today.");
    if (!t.length) t.push("Good conditions for regular field work.");
    return t;
  };

  return (
    <>
      <h1>Weather Forecast · {loc.name}</h1>
      <div className="row wrap">
        <form onSubmit={search} className="row"><input placeholder="Search city/village" value={city} onChange={(e) => setCity(e.target.value)} /><button className="btn">Search</button></form>
        {farms.map((f) => <button key={f._id} className="btn ghost" onClick={() => setLoc({ lat: f.latitude, lon: f.longitude, name: f.farmName })}>{f.farmName}</button>)}
      </div>
      {data && (
        <>
          <div className="stats">
            <div className="stat"><span>Now</span><strong>{label(data.current.weather_code)}</strong></div>
            <div className="stat"><span>Temperature</span><strong>{data.current.temperature_2m}°C</strong></div>
            <div className="stat"><span>Humidity</span><strong>{data.current.relative_humidity_2m}%</strong></div>
            <div className="stat"><span>Wind</span><strong>{data.current.wind_speed_10m} km/h</strong></div>
          </div>
          <div className="card"><h3>Farming advice</h3><ul>{advice().map((a) => <li key={a}>{a}</li>)}</ul></div>
          <div className="grid seven">
            {data.daily.time.map((d, i) => (
              <div key={d} className="card center">
                <b>{new Date(d).toLocaleDateString(undefined, { weekday: "short", day: "numeric" })}</b>
                <p>{label(data.daily.weather_code[i])}</p>
                <p>{data.daily.temperature_2m_max[i]}° / {data.daily.temperature_2m_min[i]}°</p>
                <small className="muted">💧 {data.daily.precipitation_sum[i]} mm</small>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
