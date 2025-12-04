// src/lib/types/auth.types.ts
// =============================================
// TIPOS RELACIONADOS CON AUTENTICACIÓN
// =============================================

/**
 * Roles de usuario disponibles en el sistema
 * - admin: Administrador completo del sistema
 * - teacher: Profesor con privilegios académicos
 * - student: Estudiante con acceso limitado
 * - user: Usuario general (por defecto)
 */
export type UserRole = 'admin' | 'teacher' | 'student' | 'user';

/**
 * Interfaz que representa un usuario del sistema
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string | null;
  department?: string;
  createdAt: string;
}

/**
 * Credenciales necesarias para iniciar sesión
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Estado de autenticación en la aplicación
 */
export interface AuthState {
  user: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Contexto de autenticación que extiende el estado
 * e incluye funciones para manipular la autenticación
 */
export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: UserRole) => void;
}