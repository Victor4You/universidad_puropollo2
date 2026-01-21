// src/lib/api/axios.ts
import axios from "axios";

// 1. Definimos la URL base usando variables de entorno
// En Vercel usará la variable configurada en el panel.
// En local, si no encuentra la variable, usará localhost.
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/v1";

const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    "Bypass-Tunnel-Reminder": "true",
  },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
