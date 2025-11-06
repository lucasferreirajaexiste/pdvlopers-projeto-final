import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  async function login(email, senha) {
    try {
      const { data } = await api.post("/auth/login", { email, password: senha });
      localStorage.setItem("token", data.accessToken);
      setUser(data.user); // <-- define o usuário após login
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
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
