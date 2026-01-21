import axios from "axios";

// Log de depuración (solo se verá en la consola del navegador)
const envURL = process.env.NEXT_PUBLIC_API_URL;
console.log(
  "Intentando conectar a API:",
  envURL || "https://backend-universidad.vercel.app/v1",
);

const api = axios.create({
  // Forzamos el uso de la variable o el fallback
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://backend-universidad.vercel.app/v1",
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
