'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// =============================================
// TIPOS DE DATOS - Definimos las interfaces
// =============================================
export type UserRole = 'admin' | 'teacher' | 'student' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string | null;
  department?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: User) => void;
}

// =============================================
// CONTEXTO - Creamos el contexto de autenticación
// =============================================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// =============================================
// DATOS DE EJEMPLO - Usuarios para pruebas
// =============================================
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin Universidad',
    email: 'admin@universidad.edu',
    role: 'admin',
    avatar: null,
    department: 'Administración',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Profesor Carlos Mendoza',
    email: 'profesor@universidad.edu',
    role: 'teacher',
    avatar: null,
    department: 'Matemáticas',
    createdAt: '2024-01-01'
  },
  {
    id: '3',
    name: 'Ana García',
    email: 'ana@universidad.edu',
    role: 'teacher',
    avatar: null,
    department: 'Ciencias',
    createdAt: '2024-01-01'
  },
  {
    id: '4',
    name: 'Estudiante Ejemplo',
    email: 'estudiante@universidad.edu',
    role: 'student',
    avatar: null,
    department: 'Ingeniería',
    createdAt: '2024-01-01'
  },
  {
    id: '5',
    name: 'Usuario General',
    email: 'usuario@universidad.edu',
    role: 'user',
    avatar: null,
    department: 'General',
    createdAt: '2024-01-01'
  }
];

// =============================================
// PROVEEDOR DEL CONTEXTO - Componente principal
// =============================================
export function AuthProvider({ children }: { children: ReactNode }) {
  // Estado inicial de autenticación
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  // =============================================
  // EFECTO: Verificar autenticación al cargar la app
  // =============================================
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Buscar token y datos de usuario en localStorage
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user_data');
        
        // Si existen, el usuario está autenticado
        if (token && userData) {
          const user = JSON.parse(userData);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false
          });
        } else {
          // Si no existen, usuario no autenticado
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkAuth();
  }, []);

  // =============================================
  // FUNCIÓN: Iniciar sesión
  // =============================================
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      // Simular delay de red (1 segundo)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Buscar usuario en los datos de ejemplo
      const user = mockUsers.find(u => 
        u.email === credentials.email && 
        credentials.password === 'password123' // Contraseña simple para demo
      );

      if (user) {
        // Crear token simulado
        const token = `mock_jwt_token_${user.id}`;
        
        // Guardar en localStorage
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));
        
        // Actualizar estado
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
        
        return true; // Login exitoso
      }
      
      return false; // Credenciales incorrectas
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // =============================================
  // FUNCIÓN: Cerrar sesión - ACTUALIZADA
  // =============================================
  const logout = () => {
    // PASO 1: Limpiar localStorage (eliminar datos de sesión)
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    
    // PASO 2: Actualizar estado (usuario ya no está autenticado)
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
    
    // PASO 3: REDIRECCIÓN A PÁGINA PRINCIPAL - NUEVA FUNCIONALIDAD
    // Verificamos que window existe (estamos en el cliente)
    if (typeof window !== 'undefined') {
      // Usamos window.location.href para forzar la recarga y redirección
      // Esto asegura que siempre vayas a la página principal (/)
      // sin importar en qué parte de la app estés
      window.location.href = '/';
    }
  };

  // =============================================
  // FUNCIÓN: Actualizar datos del usuario
  // =============================================
  const updateUser = (user: User) => {
    localStorage.setItem('user_data', JSON.stringify(user));
    setAuthState(prev => ({ ...prev, user }));
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// =============================================
// HOOK PERSONALIZADO: useAuth
// =============================================
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}