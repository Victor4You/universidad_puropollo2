'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { AuthProviderProps } from './AuthContext.types';
import { AuthState, User, LoginCredentials } from '@/lib/types/auth.types';
import { authService } from '@/services/auth.service';

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      // Usamos 'any' en la respuesta para evitar los errores 2339 de TS al mapear
      const userData: any = await authService.login(credentials);
      
      if (userData) {
        // Mapeamos cuidadosamente a la interfaz User
        const fullUser: User = {
          id: userData.id || 0,
          username: userData.usuario || userData.username || '',
          name: userData.name || `${userData.nombre} ${userData.apellido}` || '',
          email: userData.email || '',
          role: userData.role || 'estudiante',
          avatar: userData.avatar || '',
          // Si tu interfaz 'User' no tiene 'token', TS dará error 2353. 
          // Se quita del objeto 'User' si no es parte de la definición.
        };

        setAuthState({ user: fullUser, isAuthenticated: true, isLoading: false });
        return true;
      }
      return false;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error de conexión';
      throw new Error(message);
    }
  }, []);

  const logout = useCallback(() => {
    setAuthState({ user: null, isAuthenticated: false, isLoading: false });
    if (typeof window !== 'undefined') window.location.href = '/login';
  }, []);

  useEffect(() => {
    // REGLA: Sin LocalStorage, la sesión inicia limpia en cada recarga
    setAuthState(prev => ({ ...prev, isLoading: false }));
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, updateUser: () => {} }}>
      {children}
    </AuthContext.Provider>
  );
}