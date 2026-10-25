import { createContext, useContext, useEffect, useState } from "react";
import api from "./api";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("token")) return setLoading(false);
    api.get("/users/me").then((r) => setUser(r.data)).catch(() => localStorage.removeItem("token")).finally(() => setLoading(false));
  }, []);

  const handleAuth = ({ token, user }) => { localStorage.setItem("token", token); setUser(user); };
  const login = async (email, password) => handleAuth((await api.post("/users/login", { email, password })).data);
  const register = async (data) => handleAuth((await api.post("/users/register", data)).data);
  const logout = () => { localStorage.removeItem("token"); setUser(null); };

  return <AuthCtx.Provider value={{ user, setUser, loading, login, register, logout }}>{children}</AuthCtx.Provider>;
}
