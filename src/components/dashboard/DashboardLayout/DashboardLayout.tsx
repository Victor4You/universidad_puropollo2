// src/components/dashboard/DashboardLayout/DashboardLayout.tsx
// =============================================
// LAYOUT PRINCIPAL DEL DASHBOARD
// =============================================

'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Loader } from '@/components/ui/Loader/Loader';

/**
 * Props para el componente DashboardLayout
 */
interface DashboardLayoutProps {
  /** Contenido principal del dashboard */
  children: React.ReactNode;
  /** Título de la página */
  title?: string;
  /** Descripción de la página */
  description?: string;
}

/**
 * Layout principal para todas las páginas del dashboard
 * Incluye sidebar y área de contenido principal
 * 
 * @component
 * @example
 * <DashboardLayout title="Dashboard" description="Bienvenido al panel">
 *   <div>Contenido...</div>
 * </DashboardLayout>
 */
export function DashboardLayout({
  children,
  title = 'Dashboard',
  description = 'Gestiona tu plataforma educativa',
}: DashboardLayoutProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // =============================================
  // RENDERIZADO
  // =============================================
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar 
        openMenu={openMenu} 
        onMenuToggle={setOpenMenu} 
      />
      
      {/* Área de contenido principal */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Encabezado del contenido */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {title}
          </h1>
          {description && (
            <p className="text-gray-600 mt-2">{description}</p>
          )}
        </header>
        
        {/* Contenido */}
        <div className="space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}