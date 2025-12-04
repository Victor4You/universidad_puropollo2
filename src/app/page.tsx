// src/app/page.tsx - VERSIÓN SIMPLIFICADA
'use client';

import { useAuth } from '@/hooks/useAuth';
import { Loader } from '@/components/ui/Loader/Loader';
import { UserDropdown } from '@/components/auth/UserDropdown/UserDropdown';
import Link from 'next/link';
import { PUBLIC_ROUTES } from '@/lib/constants/routes';
import dynamic from 'next/dynamic';

// Cargar Feed dinámicamente
const Feed = dynamic(() => import('@/components/Feed'), {
  loading: () => <Loader text="Cargando feed..." />,
  ssr: false
});

export default function HomePage() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Cargando..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header simplificado - SOLO con logo y UserDropdown */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Universidad PuroPolio</h1>
                <p className="text-sm text-gray-500">Plataforma Educativa</p>
              </div>
            </Link>

            {/* UserDropdown manejará login/registro automáticamente */}
            <UserDropdown />
          </div>
        </div>
      </header>

      {/* Dejar que Feed maneje todo el contenido */}
      <main className="max-w-7xl mx-auto">
        <Feed />
      </main>
    </div>
  );
}