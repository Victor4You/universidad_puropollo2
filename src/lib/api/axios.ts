import axios from 'axios';

// Detectamos si el navegador está corriendo en localhost
const isLocal = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const api = axios.create({
  // Si es local, usa el puerto 3001 detectado en tu main.ts. 
  // De lo contrario, usa la URL de Vercel.
  baseURL: isLocal 
    ? 'http://localhost:3001/v1' 
    : 'https://backend-universidad.vercel.app/v1',
  headers: {
    'Content-Type': 'application/json',
    'Bypass-Tunnel-Reminder': 'true', 
  },
  timeout: 15000, 
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;