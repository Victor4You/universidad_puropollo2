// src/components/auth/LoginView.tsx
'use client';

import { LoginForm } from '@/components/auth/LoginForm/LoginForm';
import { useAuth } from '@/hooks/useAuth';

export default function LoginView() {
  const { login } = useAuth();

  const handleLogin = async (credentials: any) => {
    return await login(credentials);
    // No hace falta router.push aquí, porque al cambiar el estado de auth, 
    // la página principal (page.tsx) detectará el cambio y mostrará el Feed sola.
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <LoginForm onSubmit={handleLogin} isLoading={false} />
    </div>
  );
}