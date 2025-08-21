// src/lib/api.ts
import axios from "axios";
import { authRouter } from "../router/authRouter";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_LOCAL_API, 
  headers: {
    "Content-Type": "application/json"
  },
});

// Interceptor: runs before every request
api.interceptors.request.use((config) => {
  const token = authRouter.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization; // remove header if no token
  }
  return config;
});

export default api;
