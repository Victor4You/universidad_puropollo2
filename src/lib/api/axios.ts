import axios from 'axios';

const api = axios.create({
  // CAMBIO: Usa la URL que te dio Vercel al desplegar tu BACKEND
  baseURL: 'backend-universidad.vercel.app', 
  headers: {
    'Content-Type': 'application/json',
    'Bypass-Tunnel-Reminder': 'true',
  },
  timeout: 15000, // Aumentamos un poco el tiempo por la latencia del túnel
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