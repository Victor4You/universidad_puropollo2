// src/lib/utils/auth.utils.ts
// =============================================
// UTILIDADES PARA MANEJO DE AUTENTICACIÓN
// =============================================

import { User } from '../types/auth.types';

/**
 * Claves de almacenamiento para datos de autenticación
 */
const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data',
} as const;

/**
 * Obtiene los datos de autenticación almacenados
 * 
 * @returns Objeto con usuario y token, o null si no existen
 */
export const getStoredAuthData = (): { user: User | null; token: string | null } => {
  if (typeof window === 'undefined') {
    return { user: null, token: null };
  }

  try {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    
    const user = userData ? JSON.parse(userData) : null;
    
    return { user, token };
  } catch (error) {
    console.error('Error reading auth data from storage:', error);
    return { user: null, token: null };
  }
};

/**
 * Guarda datos de autenticación en el almacenamiento
 * 
 * @param user - Datos del usuario
 * @param token - Token de autenticación
 */
export const setAuthData = (user: User, token: string): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving auth data to storage:', error);
  }
};

/**
 * Elimina los datos de autenticación del almacenamiento
 */
export const clearAuthData = (): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  } catch (error) {
    console.error('Error clearing auth data from storage:', error);
  }
};

/**
 * Verifica si un token es válido (en este caso simulado)
 * 
 * @param token - Token a verificar
 * @returns boolean - True si el token es válido
 */
export const isTokenValid = (token: string): boolean => {
  // En una aplicación real, aquí verificarías la expiración del token
  // y su validez con el backend
  
  // Para esta demo, asumimos que cualquier token que exista es válido
  // por un período de tiempo (simulamos 24 horas)
  
  try {
    // Extraer timestamp del token (en esta demo)
    const parts = token.split('_');
    if (parts.length < 3) return false;
    
    const timestamp = parseInt(parts[parts.length - 1]);
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    
    // El token es válido por 24 horas
    return (now - timestamp) < twentyFourHours;
  } catch {
    return false;
  }
};

/**
 * Verifica si el usuario está autenticado
 * 
 * @returns boolean - True si el usuario está autenticado
 */
export const isAuthenticated = (): boolean => {
  const { user, token } = getStoredAuthData();
  return !!(user && token && isTokenValid(token));
};