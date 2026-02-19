// src/lib/api/axios.ts
import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/v1";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const session = Cookies.get("univ_auth_session");

  if (session) {
    try {
      const user = JSON.parse(session);
      // Ajuste: Buscamos el token en todas las propiedades posibles que genera tu Auth
      const token = user.token || user.accessToken || user.data?.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        // console.log("✅ Token inyectado"); // Mantengo tus logs si los necesitas
      }
    } catch (e) {
      console.error("❌ Error al leer la cookie:", e);
    }
  }
  return config;
});

export default api;
