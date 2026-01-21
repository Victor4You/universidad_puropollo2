import axios from "axios";

// Esta constante detecta automáticamente si estás en Vercel o en tu PC
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/v1";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Log para que siempre sepas a dónde estás conectando en la consola
console.log("Conectado a API en:", API_URL);

export default api;
