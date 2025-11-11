import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  async function login(email, senha) {
    try {
      const { data } = await api.post("/auth/login", { email, password: senha });
      const payload = data?.data || data || {};
      const accessToken =
        payload.accessToken ||
        payload.access_token ||
        data?.accessToken ||
        data?.access_token;
      const refreshToken =
        payload.refreshToken ||
        payload.refresh_token ||
        data?.refreshToken ||
        data?.refresh_token;
      const detectedUser = payload.user || data?.user || null;

      if (accessToken) localStorage.setItem("token", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      if (detectedUser) setUser(detectedUser);
      return !!accessToken;
    } catch {
      return false;
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setUser(null);
  }

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
