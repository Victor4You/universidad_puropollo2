// src/app/(auth)/login/page.tsx
// =============================================
// PÁGINA DE INICIO DE SESIÓN
// =============================================

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm/LoginForm';
import { Loader } from '@/components/ui/Loader/Loader';

/**
 * Página de inicio de sesión
 * 
 * @description
 * - Maneja redirección si el usuario ya está autenticado
 * - Muestra formulario de login con credenciales de demo
 * - Procesa inicio de sesión y maneja errores
 */
export default function LoginPage() {
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // =============================================
  // EFECTO: REDIRECCIÓN SI YA ESTÁ AUTENTICADO
  // =============================================
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // =============================================
  // MANEJADOR DE LOGIN
  // =============================================
  const handleLogin = async (credentials: { email: string; password: string }) => {
    const success = await login(credentials);
    
    if (success) {
      router.push('/');
      return true;
    }
    
    return false;
  };

  // =============================================
  // RENDERIZADO
  // =============================================
  // Mostrar loader mientras se verifica autenticación
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
        <Loader size="lg" text="Verificando sesión..." />
      </div>
    );
  }

  // No mostrar nada si ya está autenticado (será redirigido)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <LoginForm 
        onSubmit={handleLogin}
        isLoading={false} // El loading se maneja internamente en el formulario
        error={undefined} // El error se maneja internamente
      />
    </div>
  );
}