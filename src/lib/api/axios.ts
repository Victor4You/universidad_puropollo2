import axios from 'axios';

const api = axios.create({
  // Asegúrate de que esta URL sea la de tu BACKEND en Vercel
  baseURL: 'https://backend-universidad.vercel.app/v1',
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