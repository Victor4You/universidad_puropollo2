// src/components/dashboard/DashboardLayout/Sidebar.tsx
// =============================================
// BARRA LATERAL DEL DASHBOARD
// =============================================

'use client';

import React, { useState } from 'react';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import { useAuth } from '@/hooks/useAuth';
import { usePermission } from '@/hooks/usePermission';
import { UserDropdown } from '@/components/auth/UserDropdown/UserDropdown';

/**
 * Props para el componente Sidebar
 */
interface SidebarProps {
  /** Función para cambiar el menú abierto */
  onMenuToggle: (menuName: string | null) => void;
  /** Menú actualmente abierto */
  openMenu: string | null;
}

/**
 * Componente Sidebar para el dashboard
 * Muestra navegación basada en roles y permisos
 * 
 * @component
 */
export function Sidebar({ onMenuToggle, openMenu }: SidebarProps) {
  const { user } = useAuth();
  const { canView } = usePermission();

  // =============================================
  // MANEJADORES DE MENÚ
  // =============================================
  const handleMenuClick = (menuName: string) => {
    onMenuToggle(openMenu === menuName ? null : menuName);
  };

  const isMenuOpen = (menuName: string) => {
    return openMenu === menuName || (openMenu && openMenu.startsWith(`${menuName}.`));
  };

  // =============================================
  // RENDERIZADO
  // =============================================
  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
      {/* Encabezado del Sidebar */}
      <div className="flex items-center space-x-3 p-4 border-b border-gray-700">
        <Avatar 
          src={user?.avatar || null} 
          alt={user?.name || 'Usuario'} 
          size="md"
          fallbackLetter={user?.name?.charAt(0) || 'U'}
        />
        <div>
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <p className="text-sm text-gray-400 capitalize">{user?.role}</p>
        </div>
      </div>
      
      {/* Navegación */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {/* Inicio - Accesible para todos */}
        <a 
          href="#inicio" 
          className="flex items-center py-2 px-4 rounded-md hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span>Inicio</span>
        </a>

        {/* Administración - Con submenús */}
        <div>
          <button
            onClick={() => handleMenuClick('administracion')}
            className="w-full flex items-center justify-between py-2 px-4 rounded-md hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-expanded={isMenuOpen('administracion') || undefined}
            aria-controls="administracion-submenu"
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              <span>Administración</span>
            </div>
            <span className="text-xs transform transition-transform duration-200">
              {isMenuOpen('administracion') ? '▲' : '▼'}
            </span>
          </button>
          
          {isMenuOpen('administracion') && (
            <div 
              id="administracion-submenu"
              className="ml-10 mt-1 space-y-1 border-l border-gray-600 pl-4"
              role="region"
              aria-label="Submenú de Administración"
            >
              <a href="#gestioncursos" className="block py-2 text-sm hover:text-blue-300 transition-colors focus:text-blue-300">
                Gestión de cursos
              </a>
              <a href="#instructores" className="block py-2 text-sm hover:text-blue-300 transition-colors focus:text-blue-300">
                Instructores
              </a>
              <a href="#grupos" className="block py-2 text-sm hover:text-blue-300 transition-colors focus:text-blue-300">
                Grupos
              </a>
              <a href="#convocatorias" className="block py-2 text-sm hover:text-blue-300 transition-colors focus:text-blue-300">
                Convocatorias
              </a>
              
              {/* Submenú Reportes - Solo Admin y Teachers */}
              {canView(['admin', 'teacher']) && (
                <div>
                  <button 
                    onClick={() => handleMenuClick('administracion.reportes')}
                    className="w-full flex items-center justify-between py-2 text-sm hover:text-blue-300 transition-colors focus:text-blue-300 focus:outline-none"
                    aria-expanded={isMenuOpen('administracion') || undefined}
                  >
                    <span>Reportes</span>
                    <span className="text-xs">
                      {isMenuOpen('administracion.reportes') ? '▲' : '▼'}
                    </span>
                  </button>
                  
                  {isMenuOpen('administracion.reportes') && (
                    <div className="ml-4 mt-1 space-y-1 border-l border-gray-600 pl-4">
                      <a href="#generacion_indicadores" className="block py-2 text-xs hover:text-blue-200 transition-colors">
                        Generación de indicadores
                      </a>
                      <a href="#exportacion_datos" className="block py-2 text-xs hover:text-blue-200 transition-colors">
                        Exportación de datos
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Enlace para volver al Feed */}
        <div className="mt-8 pt-4 border-t border-gray-600">
          <a 
            href="/" 
            className="flex items-center py-2 px-4 rounded-md hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg className="w-5 h-5 mr-3 transform rotate-180" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span>Volver al Feed</span>
          </a>
        </div>
      </nav>

      {/* UserDropdown en el footer del sidebar */}
      <div className="p-4 border-t border-gray-700">
        <UserDropdown />
      </div>
    </aside>
  );
}