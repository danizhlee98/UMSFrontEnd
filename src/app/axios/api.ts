// src/lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:44344/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

console.log("🔗 API Base URL:", process.env.NEXT_PUBLIC_LOCAL_API);


// 🔹 Interceptor: attach token automatically
api.interceptors.request.use((config) => {
  console.log("➡️ Request:", {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data,
  });
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔹 Interceptor: handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized! Redirecting to login...");
      // e.g. redirect to login page
    }
    return Promise.reject(error);
  }
);

export default api;
