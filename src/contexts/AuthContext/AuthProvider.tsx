'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { AuthProviderProps } from './AuthContext.types';
import { AuthState, User, LoginCredentials } from '@/lib/types/auth.types';
import { authService } from '@/services/auth.service';
import { 
  getStoredAuthData, 
  clearAuthData, 
  setAuthData,
  isTokenValid 
} from '@/lib/utils/auth.utils';

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const authData = await authService.login(credentials);
      
      if (authData?.token) {
        // Guardar token primero para que las siguientes peticiones de Axios lo incluyan
        localStorage.setItem('auth_token', authData.token);
        
        const user = await authService.getUserProfile(authData.username || credentials.email);
        
        if (user) {
          setAuthData(user, authData.token);
          setAuthState({ user, isAuthenticated: true, isLoading: false });
          return true;
        }
      }
      return false;
    } catch (error: any) {
      // Extraemos el mensaje de error del backend para que la UI lo muestre
      const message = error.response?.data?.message || 'Error de conexión con el servidor';
      throw new Error(message);
    }
  }, []);

  const logout = useCallback(() => {
    clearAuthData();
    setAuthState({ user: null, isAuthenticated: false, isLoading: false });
    if (typeof window !== 'undefined') window.location.href = '/login';
  }, []);

  useEffect(() => {
    const init = async () => {
      const { user, token } = getStoredAuthData();
      if (user && token && isTokenValid(token)) {
        // Refrescar perfil al cargar la página para asegurar datos actualizados
        const freshUser = await authService.getUserProfile(user.username || user.id);
        if (freshUser) {
          setAuthState({ user: freshUser, isAuthenticated: true, isLoading: false });
        } else {
          logout();
        }
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };
    init();
  }, [logout]);

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, updateUser: () => {} }}>
      {children}
    </AuthContext.Provider>
  );
}