// src/lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_LOCAL_API, 
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
