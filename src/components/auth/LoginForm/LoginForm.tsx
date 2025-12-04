// src/components/auth/LoginForm/LoginForm.tsx
// =============================================
// FORMULARIO DE INICIO DE SESIÓN
// =============================================

'use client';

import React, { useState } from 'react';
import { LoginCredentials } from '@/lib/types/auth.types';
import { Loader } from '@/components/ui/Loader/Loader';

/**
 * Props para el componente LoginForm
 */
interface LoginFormProps {
  /** Función que se ejecuta al enviar el formulario */
  onSubmit: (credentials: LoginCredentials) => Promise<boolean>;
  /** Indica si el formulario está procesando */
  isLoading?: boolean;
  /** Mensaje de error a mostrar */
  error?: string;
  /** Credenciales de demostración para mostrar */
  demoCredentials?: Array<{ email: string; role: string }>;
}

/**
 * Componente de formulario de inicio de sesión
 * 
 * @component
 * @example
 * <LoginForm 
 *   onSubmit={handleLogin}
 *   isLoading={isLoading}
 *   error={error}
 * />
 */
export function LoginForm({
  onSubmit,
  isLoading = false,
  error,
  demoCredentials = [
    { email: 'admin@universidad.edu', role: 'Admin' },
    { email: 'profesor@universidad.edu', role: 'Profesor' },
    { email: 'estudiante@universidad.edu', role: 'Estudiante' },
  ],
}: LoginFormProps) {
  // =============================================
  // ESTADO DEL FORMULARIO
  // =============================================
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });

  // =============================================
  // MANEJADORES DE EVENTOS
  // =============================================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(credentials);
  };

  const fillDemoCredentials = (email: string) => {
    setCredentials({
      email,
      password: 'password123', // Contraseña de demostración
    });
  };

  // =============================================
  // RENDERIZADO
  // =============================================
  return (
    <div className="max-w-md w-full space-y-8">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {/* Encabezado */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-linear-to-br from-blue-600 to-purple-600 rounded-full">
            <span className="text-white text-2xl font-bold">U</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Universidad PuroPollo
          </h2>
          <p className="text-gray-600">
            Inicia sesión en tu cuenta
          </p>
        </div>

        {/* Formulario */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Mensaje de Error */}
          {error && (
            <div 
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
              role="alert"
            >
              <strong className="font-medium">Error:</strong> {error}
            </div>
          )}

          {/* Campo Email */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={credentials.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="usuario@universidad.edu"
              disabled={isLoading}
              aria-required="true"
            />
          </div>

          {/* Campo Contraseña */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={credentials.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="••••••••"
              disabled={isLoading}
              aria-required="true"
            />
          </div>

          {/* Botón de Envío */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-linear-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg"
            aria-busy={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader size="sm" color="white" />
                <span className="ml-2">Iniciando sesión...</span>
              </div>
            ) : (
              'Iniciar sesión'
            )}
          </button>
        </form>

        {/* Credenciales de Demostración */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h4 className="font-medium text-blue-900 mb-3">
            <span className="inline-flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Credenciales de prueba
            </span>
          </h4>
          <div className="text-sm text-blue-800 space-y-2">
            <p className="mb-2">Contraseña para todos: <code className="bg-blue-100 px-1 rounded">password123</code></p>
            {demoCredentials.map((cred, index) => (
              <button
                key={index}
                onClick={() => fillDemoCredentials(cred.email)}
                className="block w-full text-left p-2 rounded hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                disabled={isLoading}
                type="button"
              >
                <span className="font-medium">{cred.role}:</span>{' '}
                <span className="text-blue-600">{cred.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}