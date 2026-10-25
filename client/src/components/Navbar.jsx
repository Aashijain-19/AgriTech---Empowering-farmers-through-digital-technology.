import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <header className="nav">
      <NavLink to="/" className="brand">🌾 AgriTech</NavLink>
      <nav>
        {user && <NavLink to="/dashboard">Dashboard</NavLink>}
        {user && <NavLink to="/farms">Farms</NavLink>}
        {user && <NavLink to="/crops">Crops</NavLink>}
        <NavLink to="/crop-info">Crop Info</NavLink>
        <NavLink to="/weather">Weather</NavLink>
        <NavLink to="/shop">Buy Resources</NavLink>
        {user && <NavLink to="/orders">My Orders</NavLink>}
        {user && <NavLink to="/forum">Community</NavLink>}
        {user?.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
      </nav>
      <div className="nav-right">
        {user ? (
          <>
            <NavLink to="/profile">{user.name}</NavLink>
            <button className="btn ghost" onClick={() => { logout(); nav("/"); }}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register" className="btn">Sign up</NavLink>
          </>
        )}
      </div>
    </header>
  );
}
