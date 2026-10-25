import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Farms from "./pages/Farms";
import Crops from "./pages/Crops";
import CropInfo from "./pages/CropInfo";
import Weather from "./pages/Weather";
import Shop from "./pages/Shop";
import Orders from "./pages/Orders";
import Forum from "./pages/Forum";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";

function Private({ children, admin }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="container">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (admin && user.role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/crop-info" element={<CropInfo />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
          <Route path="/farms" element={<Private><Farms /></Private>} />
          <Route path="/crops" element={<Private><Crops /></Private>} />
          <Route path="/orders" element={<Private><Orders /></Private>} />
          <Route path="/forum" element={<Private><Forum /></Private>} />
          <Route path="/profile" element={<Private><Profile /></Private>} />
          <Route path="/admin" element={<Private admin><Admin /></Private>} />
          <Route path="*" element={<h2>Page not found</h2>} />
        </Routes>
      </main>
      <footer className="footer">© {new Date().getFullYear()} AgriTech · Smart farming for everyone</footer>
    </>
  );
}
