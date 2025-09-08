import axios from "axios";

// Base API instance
const api = axios.create({
  baseURL: "/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach token automatically if stored
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Main reusable service function
export const apiService = async (
  method,
  endpoint,
  payload = {},
  config = {}
) => {
  try {
    const response = await api.request({
      method: method.toLowerCase(),
      url: endpoint,
      ...(method.toLowerCase() === "get"
        ? { params: payload }
        : { data: payload }),
      ...config,
    });
    return response.data; // return API data
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};
