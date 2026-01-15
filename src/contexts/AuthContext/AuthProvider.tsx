'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie'; // <-- Importación necesaria
import { AuthContext } from './AuthContext';
import { AuthProviderProps } from './AuthContext.types';
import { AuthState, User, LoginCredentials } from '@/lib/types/auth.types';
import { authService } from '@/services/auth.service';

const COOKIE_NAME = 'univ_auth_session';

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // 1. EFECTO DE RECUPERACIÓN (Esto arregla el problema del refresh)
  useEffect(() => {
    const savedSession = Cookies.get(COOKIE_NAME);
    
    if (savedSession) {
      try {
        const restoredUser = JSON.parse(savedSession);
        setAuthState({
          user: restoredUser,
          isAuthenticated: true,
          isLoading: false
        });
      } catch (error) {
        console.error("Error al restaurar sesión:", error);
        Cookies.remove(COOKIE_NAME);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const userData: any = await authService.login(credentials);
      
      if (userData) {
        const fullUser: User = {
          id: userData.id || 0,
          username: userData.usuario || userData.username || '',
          name: userData.name || `${userData.nombre} ${userData.apellido}` || '',
          email: userData.email || '',
          role: userData.role || 'estudiante',
          avatar: userData.avatar || '',
        };

        // 2. GUARDAR EN ESTADO Y EN COOKIE
        setAuthState({ user: fullUser, isAuthenticated: true, isLoading: false });
        
        Cookies.set(COOKIE_NAME, JSON.stringify(fullUser), { 
          expires: 1, // La sesión dura 1 día
          sameSite: 'strict' 
        });

        return true;
      }
      return false;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error de conexión';
      throw new Error(message);
    }
  }, []);

  const logout = useCallback(() => {
    // 3. LIMPIAR TODO AL SALIR
    setAuthState({ user: null, isAuthenticated: false, isLoading: false });
    Cookies.remove(COOKIE_NAME);
    if (typeof window !== 'undefined') window.location.href = '/';
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, updateUser: () => {} }}>
      {children}
    </AuthContext.Provider>
  );
}