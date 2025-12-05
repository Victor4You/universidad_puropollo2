

'use client';
// src/contexts/AuthContext/AuthProvider.tsx
// =============================================
// PROVEEDOR DEL CONTEXTO DE AUTENTICACIÓN
// =============================================
import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { AuthProviderProps } from './AuthContext.types';
import { AuthState, User, LoginCredentials } from '@/lib/types/auth.types';
import { mockUsers } from '@/lib/constants/users';
import { 
  getStoredAuthData, 
  clearAuthData, 
  setAuthData,
  isTokenValid 
} from '@/lib/utils/auth.utils';

/**
 * Proveedor principal de autenticación
 * Maneja el estado de autenticación y proporciona funciones
 * para login, logout y actualización de usuario
 */
export function AuthProvider({ children }: AuthProviderProps) {
  // =============================================
  // ESTADO DE AUTENTICACIÓN
  // =============================================
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // =============================================
  // EFECTO: VERIFICAR AUTENTICACIÓN AL INICIAR
  // =============================================
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const { user, token } = getStoredAuthData();
        
        if (user && token && isTokenValid(token)) {
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          // Si el token no es válido, limpiar datos
          clearAuthData();
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();
  }, []);

  // =============================================
  // FUNCIÓN: INICIAR SESIÓN
  // =============================================
  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      // Simular delay de red para demostración
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Buscar usuario en datos mock (en producción sería una API)
      const user = mockUsers.find(u => 
        u.email === credentials.email && 
        credentials.password === 'password123'
      );

      if (!user) {
        return false;
      }

      // Crear token simulado
      const token = `mock_jwt_token_${user.id}_${Date.now()}`;
      
      // Guardar datos en almacenamiento
      setAuthData(user, token);
      
      // Actualizar estado
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);

  // =============================================
  // FUNCIÓN: CERRAR SESIÓN
  // =============================================
  const logout = useCallback(() => {
    // Limpiar datos de almacenamiento
    clearAuthData();
    
    // Actualizar estado
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    
    // Redirigir a página principal
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }, []);

  // =============================================
  // FUNCIÓN: ACTUALIZAR USUARIO
  // =============================================
  const updateUser = useCallback((updatedUser: User) => {
    const { token } = getStoredAuthData();
    
    if (token) {
      setAuthData(updatedUser, token);
      setAuthState(prev => ({ ...prev, user: updatedUser }));
    }
  }, []);

  // =============================================
  // VALORES DEL CONTEXTO
  // =============================================
  const contextValue = {
    ...authState,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}