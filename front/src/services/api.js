import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

// request interceptor: adiciona auth e log
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  console.log(
    "[API] request:",
    (config.method || "GET").toUpperCase(),
    config.baseURL + config.url,
    "params:",
    config.params,
    "data:",
    config.data
  );
  return config;
});

// response interceptor: log e tratamento de erro padronizado
api.interceptors.response.use(
  (res) => {
    console.log("[API] response:", res.status, res.config.url);
    return res;
  },
  (err) => {
    console.error(
      "[API] response error:",
      err?.response?.status,
      err?.response?.data,
      err?.message
    );
    return Promise.reject(err.response?.data || err);
  }
);

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

// Clients
export const getClients = () => apiRequest("GET", "/clients");


// Finances (GET helpers)
export const getFinancialByDay = () => {
  const today = new Date().toISOString().split("T")[0];
  return apiRequest("GET", "/financial/transactions", {}, { from: today, to: today });
};

export const getFinancialByMonth = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];
  return apiRequest("GET", "/financial/transactions", {}, { from: firstDay, to: lastDay });
};

export const getFinancialAll = () => apiRequest("GET", "/financial/transactions");

// --- CRUD helpers for transactions ---
export const createTransaction = (payload) =>
  apiRequest("POST", "/financial/transactions", payload);

export const updateTransaction = (id, payload) =>
  apiRequest("PATCH", `/financial/transactions/${id}`, payload);

export const deleteTransaction = (id) =>
  apiRequest("DELETE", `/financial/transactions/${id}`);

// Loyalty
export const getLoyaltyHistory = (id) =>
  apiRequest("GET", `/loyalty/history/${id}`);

export const getClientPoints = (id) =>
  apiRequest("GET", `/loyalty/points/${id}`);

export const getRewards = () =>
  apiRequest("GET", "/loyalty/rewards");

export const getRewardById = (id) =>
  apiRequest("GET", `/loyalty/rewards/${id}`);

export const createReward = (payload) =>
  apiRequest("POST", "/loyalty/rewards", payload);

export const updateReward = (id, payload) =>
  apiRequest("PUT", `/loyalty/rewards/${id}`, payload);

export const deleteReward = (id) =>
  apiRequest("DELETE", `/loyalty/rewards/${id}`);

export const redeemReward = (payload) =>
  apiRequest("POST", "/loyalty/points/redeem", payload);

// Promotions
export const getPromotions = () => apiRequest("GET", "/promotions");

export const getPromotionById = (id) =>
  apiRequest("GET", `/promotions/${id}`);

export const createPromotion = (payload) =>
  apiRequest("POST", "/promotions", payload);

export const updatePromotion = (id, payload) =>
  apiRequest("PUT", `/promotions/${id}`, payload);

export const deletePromotion = (id) =>
  apiRequest("DELETE", `/promotions/${id}`);

// Categories 
export const getCategories = () => apiRequest("GET", "/financial/categories");

export default api;
