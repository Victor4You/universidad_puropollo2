import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.13.87:3001/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  // Esto ayudará a diagnosticar si es un problema de tiempo de espera
  timeout: 10000, 
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