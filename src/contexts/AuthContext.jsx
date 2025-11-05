import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserFromStorage = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        try {
          const { data } = await api.get("/auth/me");
          setUser(data.user);
        } catch (err) {
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUserFromStorage();
  }, []);

  async function login(email, senha) {
    try {
      const { data } = await api.post("/auth/login", {
        email,
        password: senha,
      });
      localStorage.setItem("token", data.accessToken);
      api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
      setUser(data.user);
      return true;
    } catch {
      return false;
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
