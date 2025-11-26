'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Avatar from './Avatar';

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const router = useRouter();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push('/login');
  };

  const handleMenuItemClick = (action: string) => {
    setIsOpen(false);
    if (action === 'logout') {
      handleLogout();
    } else if (action === 'profile') {
      // Redirigir al dashboard
      router.push('/dashboard');
    } else if (action === 'settings') {
      console.log('Ir a configuraciones');
    }
  };

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !(dropdownRef.current as any).contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        onClick={toggleMenu}
      >
        <Avatar 
          src={user?.avatar || null} 
          alt={user ? `Foto de perfil de ${user.name}` : 'Usuario'} 
          size="w-10 h-10" 
        />
        
        <div className="text-left">
          <span className="text-sm font-medium text-gray-700 block">
            {user?.name || 'Usuario'}
          </span>
          {user && (
            <span className={`text-xs px-2 py-1 rounded-full ${
              user.role === 'admin' 
                ? 'bg-blue-100 text-blue-800' 
                : user.role === 'teacher'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {user.role === 'admin' ? 'Administrador' :
               user.role === 'teacher' ? 'Profesor' :
               user.role === 'student' ? 'Estudiante' : 'Usuario'}
            </span>
          )}
        </div>
        
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          {user ? (
            // Menú para usuario autenticado
            <>
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              
              <button 
                onClick={() => handleMenuItemClick('profile')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                📊 Mi Dashboard
              </button>
              <button 
                onClick={() => handleMenuItemClick('settings')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                ⚙️ Configuración
              </button>
              <hr className="my-1" />
              <button 
                onClick={() => handleMenuItemClick('logout')}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors duration-200"
              >
                🚪 Cerrar Sesión
              </button>
            </>
          ) : (
            // Menú para usuario NO autenticado (por si acaso)
            <>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  router.push('/login');
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Iniciar Sesión
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDropdown;