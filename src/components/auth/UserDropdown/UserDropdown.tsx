// src/components/auth/UserDropdown/UserDropdown.tsx
// =============================================
// MENÚ DESPLEGABLE DE USUARIO
// =============================================

'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import { Loader } from '@/components/ui/Loader/Loader';


/**
 * Componente de menú desplegable para acciones de usuario
 * 
 * @component
 * @example
 * <UserDropdown />
 */
export function UserDropdown() {
  const { user, logout, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [settingsSubmenuOpen, setSettingsSubmenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);


  // =============================================
  // EFECTO: CERRAR DROPDOWN AL HACER CLIC FUERA
  // =============================================
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSettingsSubmenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // =============================================
  // MANEJADORES
  // =============================================
  const toggleDropdown = () => setIsOpen(!isOpen);

  const toggleSettingsSubmenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSettingsSubmenuOpen(!settingsSubmenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const handleDashboardClick = () => {
    // Dashboard navegation
    window.location.href = '/dashboard';
    setIsOpen(false);
  }

  const handleProfileClick = () => {
    // Navegar al perfil del usuario
    window.location.href = '/profile';
    setIsOpen(false);
  };

  const handleSettingsClick = () => {
    // Navegar a configuración principal
    window.location.href = '/settings';
    setIsOpen(false);
  };

  const handleChangePasswordClick = () => {
    // Navegar a cambiar contraseña
    window.location.href = '/changepass';
    setIsOpen(false);
    setSettingsSubmenuOpen(false);
  };

  // =============================================
  // RENDERIZADO
  // =============================================
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-2">
        <Loader size="sm" color="white" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <Link 
          href="/login" 
          className="text-blue-700 hover:text-blue-200 font-medium"
        >
          Iniciar Sesión
        </Link>
        <Link 
          href="/register" 
          className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 font-medium"
        >
          Registrarse
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón para abrir/cerrar el dropdown */}
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Menú de usuario"
      >
        <Avatar
          src={user.avatar}
          alt={user.name}
          size="sm"
          fallbackLetter={user.name.charAt(0)}
          bordered
        />
        <div className="flex-1 text-left">
          <p className="text-sm font-medium truncate">{user.name}</p>
          <p className="text-xs text-gray-400 capitalize">{user.role}</p>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transform transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 animate-fadeIn"
          role="menu" 
          aria-orientation="vertical"
        >
          {/* Información del usuario */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <Avatar
                src={user.avatar}
                alt={user.name}
                size="md"
                fallbackLetter={user.name.charAt(0)}
                bordered
              />
              <div>
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-gray-400">{user.email}</p>
                <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-900 text-blue-200 rounded-full capitalize">
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          {/* Opciones del menú */}
          <div className="py-2">
            <button
              onClick={handleProfileClick}
              className="w-full flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 transition-colors duration-150 focus:outline-none focus:bg-gray-700"
              role="menuitem"
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Mi Perfil
            </button>

            <button 
              onClick={handleDashboardClick}
              className="w-full flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 transition-colors duration-150 focus:outline-none focus:bg-gray-700"
              role="menuitem"
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
              </svg>
              Dashboard
            </button>

            {/* Opción de Configuración con submenú */}
            <div className="relative">
              <button
                onClick={toggleSettingsSubmenu}
                className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 transition-colors duration-150 focus:outline-none focus:bg-gray-700"
                role="menuitem"
                aria-expanded={settingsSubmenuOpen}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  Configuración
                </div>
                <svg
                  className={`w-4 h-4 text-gray-400 transform transition-transform duration-200 ${
                    settingsSubmenuOpen ? 'rotate-90' : ''
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Submenú de Configuración */}
              {settingsSubmenuOpen && (
                <div className="ml-4 mt-1 border-l border-gray-700">
                  <button
                    onClick={handleSettingsClick}
                    className="w-full flex items-center px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 transition-colors duration-150 focus:outline-none focus:bg-gray-700 pl-10"
                    role="menuitem"
                  >
                    <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                    Configuración General
                  </button>

                  <button
                    onClick={handleChangePasswordClick}
                    className="w-full flex items-center px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 transition-colors duration-150 focus:outline-none focus:bg-gray-700 pl-10"
                    role="menuitem"
                  >
                    <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Cambiar Contraseña
                  </button>
                </div>
              )}
            </div>

            {/* Separador */}
            <div className="border-t border-gray-700 my-2"></div>

            {/* Cerrar sesión */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-sm text-red-400 hover:bg-red-900 hover:text-red-300 transition-colors duration-150 focus:outline-none focus:bg-red-900"
              role="menuitem"
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
              Cerrar Sesión
            </button>
          </div>

          {/* Footer con información adicional */}
          <div className="px-4 py-3 border-t border-gray-700 bg-gray-900 rounded-b-lg">
            <p className="text-xs text-gray-500">
              Miembro desde {new Date(user.createdAt).toLocaleDateString('es-ES')}
            </p>
            {user.department && (
              <p className="text-xs text-gray-500 mt-1">
                Departamento: {user.department}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}