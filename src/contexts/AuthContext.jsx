/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  async function login(email, senha) {
    try {
      const { data } = await api.post("/login", { email, senha });
      localStorage.setItem("token", data.token);
      return true;
    } catch {
      return false;
    }
  }

  return (
    <AuthContext.Provider value={{ login }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
