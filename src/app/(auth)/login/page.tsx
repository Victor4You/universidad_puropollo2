'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm/LoginForm';
import { Loader } from '@/components/ui/Loader/Loader';

export default function LoginPage() {
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // =============================================
  // MANEJADOR DE LOGIN CORREGIDO
  // =============================================
  const handleLogin = async (credentials: { email: string; password: string }) => {
    // IMPORTANTE: No usar try/catch aquí para que el LoginForm reciba el error
    const success = await login(credentials);
    
    if (success) {
      router.push('/');
      return true;
    }
    
    return false;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
        <Loader size="lg" text="Verificando sesión..." />
      </div>
    );
  }

  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <LoginForm 
        onSubmit={handleLogin}
        isLoading={false} 
        error={undefined} 
      />
    </div>
  );
}