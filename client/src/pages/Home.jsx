import { Link } from "react-router-dom";
const features = [
  ["🚜", "Farm Management", "Track farms, activities and resource usage from one dashboard."],
  ["🌱", "Crop Management", "Monitor growth stages, crop health and expected yield."],
  ["⛅", "Weather Forecasting", "7-day forecasts tailored to your farm's location."],
  ["🧪", "Soil Health", "Get recommendations from moisture, pH and N-P-K readings."],
  ["🐛", "Pest & Disease Alerts", "Outbreak warnings with suggested treatments."],
  ["🛒", "Buy Resources", "Seeds, fertilizers, pesticides, equipment and services."],
  ["📦", "My Orders", "Manage purchases, rentals and expert consultations."],
  ["💬", "Community Forum", "Ask questions and learn from other farmers."],
];
export default function Home() {
  return (
    <>
      <section className="hero">
        <h1>Grow smarter, harvest better.</h1>
        <p>One platform to manage your farm, protect your crops and buy everything you need.</p>
        <div className="row"><Link to="/register" className="btn lg">Get started</Link><Link to="/crop-info" className="btn ghost lg">Explore crops</Link></div>
      </section>
      <section className="grid">
        {features.map(([i, t, d]) => (<div key={t} className="card"><div className="icon">{i}</div><h3>{t}</h3><p className="muted">{d}</p></div>))}
      </section>
    </>
  );
}
