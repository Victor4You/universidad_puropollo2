// src/app/page.tsx - VERSIÓN RESPONSIVA (CORREGIDA)
'use client';

import { useState, useEffect } from 'react'; // ← CORREGIDO AQUÍ
import { useAuth } from '@/hooks/useAuth'; // ← SOLO useAuth
import { Loader } from '@/components/ui/Loader/Loader';
import { UserDropdown } from '@/components/auth/UserDropdown/UserDropdown';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Cargar Feed dinámicamente
const Feed = dynamic(() => import('@/components/Feed'), {
  loading: () => <Loader text="Cargando feed..." />,
  ssr: false
});

export default function HomePage() {
  const { isLoading } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Cargando..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header responsivo */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className={`${isMobile ? 'px-3' : 'max-w-7xl mx-auto px-4 lg:px-8'}`}>
          <div className="flex justify-between items-center h-14 lg:h-16">
            {/* Logo responsivo */}
            <Link href="/" className="flex items-center space-x-2 lg:space-x-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm lg:text-lg">U</span>
              </div>
              {!isMobile && (
                <div>
                  <h1 className="text-lg lg:text-xl font-bold text-gray-900">Universidad PuroPolio</h1>
                  <p className="text-xs lg:text-sm text-gray-500 hidden lg:block">Plataforma Educativa</p>
                </div>
              )}
            </Link>

            {/* UserDropdown */}
            <div className="flex-shrink-0">
              <UserDropdown />
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className={`${isMobile ? '' : 'max-w-7xl mx-auto'}`}>
        <Feed />
      </main>
    </div>
  );
}