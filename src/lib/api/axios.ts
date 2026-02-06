import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/v1";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const session = Cookies.get("univ_auth_session");

  if (session) {
    try {
      const user = JSON.parse(session);
      if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
        console.log("✅ Token inyectado en la petición");
      } else {
        console.error("❌ La sesión existe pero no tiene token");
      }
    } catch (e) {
      console.error("❌ Error al leer la cookie (JSON inválido):", e);
    }
  } else {
    console.warn("⚠️ No se encontró la cookie 'univ_auth_session'");
  }
  return config;
});

export default api;
