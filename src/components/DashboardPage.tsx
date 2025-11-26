'use client';

import React, { useState } from 'react';
import Avatar from './Avatar'; 
import UserDropdown from './UserDropdown'; 

const DashboardPage = () => {
  const [openMenu, setOpenMenu] = useState(null);

  const handleMenuClick = (menuName: string | null) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const isMenuOpen = (menuName: string) => {
    return openMenu === menuName || (openMenu && openMenu.startsWith(`${menuName}.`));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar con menú completo */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="flex items-center space-x-3 p-4 border-b border-gray-700">
          <Avatar 
            src={null} 
            alt="Avatar" 
            size="w-8 h-8" 
          />
          <h2 className="text-xl font-semibold">Dashboard</h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {/* Inicio */}
          <a 
            href="#inicio" 
            className="flex items-center py-2 px-4 rounded-md hover:bg-gray-700 transition-colors duration-200"
          >
            <span>Inicio</span>
          </a>

          {/* Administración */}
          <div>
            <button
              onClick={() => handleMenuClick('administracion')}
              className="w-full flex items-center justify-between py-2 px-4 rounded-md hover:bg-gray-700 transition-colors duration-200"
            >
              <span>Administración</span>
              <span className="text-xs transform transition-transform">
                {isMenuOpen('administracion') ? '▲' : '▼'}
              </span>
            </button>
            
            {isMenuOpen('administracion') && (
              <div className="ml-4 mt-1 space-y-1 border-l border-gray-600 pl-4">
                <a href="#gestioncursos" className="block py-2 text-sm hover:text-blue-300 transition-colors">
                  Gestión de cursos
                </a>
                <a href="#instructores" className="block py-2 text-sm hover:text-blue-300 transition-colors">
                  Instructores
                </a>
                <a href="#grupos" className="block py-2 text-sm hover:text-blue-300 transition-colors">
                  Grupos
                </a>
                <a href="#convocatorias" className="block py-2 text-sm hover:text-blue-300 transition-colors">
                  Convocatorias
                </a>
                
                {/* Submenú Reportes */}
                <div>
                  <button
                    onClick={() => handleMenuClick('administracion.reportes')}
                    className="w-full flex items-center justify-between py-2 text-sm hover:text-blue-300 transition-colors"
                  >
                    <span>Reportes</span>
                    <span className="text-xs transform transition-transform">
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
              </div>
            )}
          </div>

          {/* Evaluaciones */}
          <div>
            <button
              onClick={() => handleMenuClick('evaluaciones')}
              className="w-full flex items-center justify-between py-2 px-4 rounded-md hover:bg-gray-700 transition-colors duration-200"
            >
              <span>Evaluaciones</span>
              <span className="text-xs transform transition-transform">
                {isMenuOpen('evaluaciones') ? '▲' : '▼'}
              </span>
            </button>
            
            {isMenuOpen('evaluaciones') && (
              <div className="ml-4 mt-1 space-y-1 border-l border-gray-600 pl-4">
                <a href="#crear" className="block py-2 text-sm hover:text-blue-300 transition-colors">
                  Crear Evaluación
                </a>
                <a href="#revisar" className="block py-2 text-sm hover:text-blue-300 transition-colors">
                  Revisar Resultados
                </a>
                <a href="#reportes" className="block py-2 text-sm hover:text-blue-300 transition-colors">
                  Reportes
                </a>
              </div>
            )}
          </div>

          {/* Configuración */}
          <a 
            href="#configuracion" 
            className="flex items-center py-2 px-4 rounded-md hover:bg-gray-700 transition-colors duration-200"
          >
            <span>Configuración</span>
          </a>

          {/* Enlace para volver al Feed */}
          <a 
            href="/" 
            className="flex items-center py-2 px-4 rounded-md hover:bg-gray-700 transition-colors duration-200 mt-4 border-t border-gray-600 pt-4"
          >
            <span>← Volver al Feed</span>
          </a>
        </nav>

        {/* UserDropdown en el sidebar */}
        <div className="p-4 border-t border-gray-700">
          <UserDropdown />
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Header del contenido */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Bienvenido al Dashboard</h1>
          <p className="text-gray-600 mt-2">Gestiona tu plataforma educativa</p>
        </div>
        
        {/* Content Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Widget de Estadísticas */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Estadísticas Generales</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total de Cursos</span>
                <span className="font-semibold">24</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Estudiantes Activos</span>
                <span className="font-semibold">156</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Evaluaciones Pendientes</span>
                <span className="font-semibold">8</span>
              </div>
            </div>
          </div>

          {/* Widget de Actividad Reciente */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Actividad Reciente</h3>
            <div className="space-y-3">
              <div className="text-sm">
                <p className="font-medium">Nuevo curso creado</p>
                <p className="text-gray-500 text-xs">Hace 2 horas</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">Evaluación completada</p>
                <p className="text-gray-500 text-xs">Hace 5 horas</p>
              </div>
            </div>
          </div>

          {/* Widget de Acciones Rápidas */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Acciones Rápidas</h3>
            <div className="space-y-2">
              <button className="w-full text-left py-2 px-3 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors">
                Crear nueva evaluación
              </button>
              <button className="w-full text-left py-2 px-3 bg-green-50 hover:bg-green-100 rounded-md transition-colors">
                Gestionar cursos
              </button>
              <button className="w-full text-left py-2 px-3 bg-yellow-50 hover:bg-yellow-100 rounded-md transition-colors">
                Ver reportes
              </button>
            </div>
          </div>
        </div>

        {/* Vista General */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Vista General</h3>
          <p className="text-gray-600">
            Selecciona una opción del menú lateral para comenzar a gestionar tu plataforma educativa.
          </p>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;