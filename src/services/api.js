import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * Método genérico para chamadas à API
 * @param {string} method - Método HTTP (GET, POST, PUT, PATCH, DELETE)
 * @param {string} url - Endpoint da requisição (ex: '/users')
 * @param {Object} [data] - Corpo da requisição (para POST/PUT/PATCH)
 * @param {Object} [params] - Query params opcionais (para GET)
 */
export const apiRequest = async (method, url, data = {}, params = {}) => {
  try {
    const response = await api({
      method,
      url,
      data,
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Request error:", error);
    throw error.response?.data || error;
  }
};

// Auth

// Clients
export const getClients = () => apiRequest("GET", "/clients");

// Finances
export const getFinancialByDay = () => {
  const today = new Date().toISOString().split("T")[0];

  return apiRequest(
    "GET",
    "/financial/transactions",
    {},
    { from: today, to: today }
  );
};

export const getFinancialByMonth = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0];

  return apiRequest(
    "GET",
    "/financial/transactions",
    {},
    { from: firstDay, to: lastDay }
  );
};

export const getFinancialAll = () =>
  apiRequest("GET", "/financial/transactions");

// Loyalty
export const getLoyaltyHistory = (id) =>
  apiRequest("GET", `/loyalty/history/${id}`);

// Promotions
export const getPromotions = () => apiRequest("GET", "/promotions");

export default api;
