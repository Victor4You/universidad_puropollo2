// src/services/auth.service.ts
// =============================================
// SERVICIO DE AUTENTICACIÓN
// =============================================

import { LoginCredentials, User } from '@/lib/types/auth.types';
import { mockUsers } from '@/lib/constants/users';

/**
 * Servicio para manejar operaciones de autenticación
 * En una aplicación real, aquí se harían llamadas API
 */
class AuthService {
  /**
   * Simula un inicio de sesión
   * 
   * @param credentials - Credenciales del usuario
   * @returns Promise con el usuario si es exitoso, null si falla
   */
  async login(credentials: LoginCredentials): Promise<User | null> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Buscar usuario en datos mock
    const user = mockUsers.find(u => 
      u.email === credentials.email && 
      credentials.password === 'password123'
    );
    
    return user || null;
  }

  /**
   * Valida si un token es válido
   * 
   * @param token - Token a validar
   * @returns boolean - True si es válido
   */
  validateToken(token: string): boolean {
    // En una app real, aquí validarías con el backend
    return token.startsWith('mock_jwt_token_');
  }

  /**
   * Obtiene información del usuario desde el token
   * 
   * @param token - Token del usuario
   * @returns Promise con información del usuario
   */
  async getUserFromToken(token: string): Promise<User | null> {
    try {
      // Extraer ID del usuario del token
      const parts = token.split('_');
      if (parts.length < 3) return null;
      
      const userId = parts[2];
      
      // Buscar usuario en datos mock
      return mockUsers.find(u => u.id === userId) || null;
    } catch {
      return null;
    }
  }

  /**
   * Renueva el token de autenticación
   * 
   * @param oldToken - Token actual
   * @returns Promise con nuevo token
   */
  async refreshToken(oldToken: string): Promise<string> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // En una app real, aquí llamarías al endpoint de refresh
    return `mock_jwt_token_${oldToken.split('_')[2]}_${Date.now()}`;
  }
}

// Exportar instancia singleton
export const authService = new AuthService();