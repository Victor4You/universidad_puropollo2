// src/lib/types/user.types.ts
// =============================================
// TIPOS RELACIONADOS CON USUARIOS Y PERFILES
// =============================================
import { UserRole } from './auth.types';
/**
 * Interfaz para datos de perfil de usuario
 * (Puede extenderse según necesidades futuras)
 */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string | null;
  department?: string;
  bio?: string;
  createdAt: string;
  lastLogin?: string;
}