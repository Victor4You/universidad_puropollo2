'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Tipos (los movemos aquí temporalmente para evitar problemas de importación)
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuarios de ejemplo
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user_data');
        
        if (token && userData) {
          const user = JSON.parse(userData);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false
          });
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Buscar usuario en los datos de ejemplo
      const user = mockUsers.find(u => 
        u.email === credentials.email && 
        credentials.password === 'password123' // Contraseña simple para demo
      );

      if (user) {
        const token = `mock_jwt_token_${user.id}`;
        
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));
        
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

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

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}