// src/app/(dashboard)/dashboard/instructores/page.tsx
'use client';

import { useState, useEffect } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { usePermission } from '@/hooks/usePermission';

interface Instructor {
  id: string;
  nombre: string;
  especialidad: string;
  email: string;
  telefono: string;
  experiencia: number; // años
  cursos: number;
  avatar: string;
  estado: 'activo' | 'inactivo' | 'vacaciones';
}

const instructoresMock: Instructor[] = [
  { id: '1', nombre: 'Carlos Mendoza', especialidad: 'Matemáticas', email: 'carlos.mendoza@universidad.edu', telefono: '+51 987 654 321', experiencia: 10, cursos: 4, avatar: 'https://randomuser.me/api/portraits/men/32.jpg', estado: 'activo' },
  { id: '2', nombre: 'Ana López', especialidad: 'Física', email: 'ana.lopez@universidad.edu', telefono: '+51 987 654 322', experiencia: 8, cursos: 3, avatar: 'https://randomuser.me/api/portraits/women/44.jpg', estado: 'activo' },
  { id: '3', nombre: 'Roberto García', especialidad: 'Programación', email: 'roberto.garcia@universidad.edu', telefono: '+51 987 654 323', experiencia: 12, cursos: 5, avatar: 'https://randomuser.me/api/portraits/men/67.jpg', estado: 'activo' },
  { id: '4', nombre: 'María Rodríguez', especialidad: 'Historia', email: 'maria.rodriguez@universidad.edu', telefono: '+51 987 654 324', experiencia: 15, cursos: 2, avatar: 'https://randomuser.me/api/portraits/women/68.jpg', estado: 'inactivo' },
  { id: '5', nombre: 'John Smith', especialidad: 'Inglés', email: 'john.smith@universidad.edu', telefono: '+51 987 654 325', experiencia: 7, cursos: 3, avatar: 'https://randomuser.me/api/portraits/men/75.jpg', estado: 'vacaciones' },
  { id: '6', nombre: 'Carmen Ruiz', especialidad: 'Administración', email: 'carmen.ruiz@universidad.edu', telefono: '+51 987 654 326', experiencia: 9, cursos: 4, avatar: 'https://randomuser.me/api/portraits/women/26.jpg', estado: 'activo' },
  { id: '7', nombre: 'Luis Fernández', especialidad: 'Química', email: 'luis.fernandez@universidad.edu', telefono: '+51 987 654 327', experiencia: 11, cursos: 3, avatar: 'https://randomuser.me/api/portraits/men/54.jpg', estado: 'activo' },
  { id: '8', nombre: 'Pedro Sánchez', especialidad: 'Filosofía', email: 'pedro.sanchez@universidad.edu', telefono: '+51 987 654 328', experiencia: 14, cursos: 2, avatar: 'https://randomuser.me/api/portraits/men/86.jpg', estado: 'inactivo' },
];

export default function InstructoresPage() {
  const { user } = useAuth();
  const { canView, isRole } = usePermission();

  const canViewButon = canView (['admin', 'teacher']);

  const [instructores, setInstructores] = useState<Instructor[]>([]);
  const [filteredInstructores, setFilteredInstructores] = useState<Instructor[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 6;

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setInstructores(instructoresMock);
      setFilteredInstructores(instructoresMock);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const filtered = instructores.filter(instructor =>
      instructor.nombre.toLowerCase().includes(search.toLowerCase()) ||
      instructor.especialidad.toLowerCase().includes(search.toLowerCase()) ||
      instructor.email.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredInstructores(filtered);
    setCurrentPage(1);
  }, [search, instructores]);

  const totalPages = Math.ceil(filteredInstructores.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentInstructores = filteredInstructores.slice(startIndex, startIndex + itemsPerPage);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo': return 'bg-green-100 text-green-800';
      case 'inactivo': return 'bg-red-100 text-red-800';
      case 'vacaciones': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando instructores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Instructores</h1>
        <p className="text-gray-600">Administra los profesores de la universidad</p>
      </div>

      {/* Barra de búsqueda y acciones */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="w-full sm:w-96">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Buscar instructores por nombre, especialidad o email..."
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>
        {canViewButon && (
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Instructor
        </button>
        )}
      </div>

      {/* Cards de instructores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentInstructores.length === 0 ? (
          <div className="col-span-full py-12 text-center">
            <div className="text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-2">No se encontraron instructores</p>
              <p className="text-sm">Intenta con otros términos de búsqueda</p>
            </div>
          </div>
        ) : (
          currentInstructores.map((instructor) => (
            <div key={instructor.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Header de la card */}
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
                        src={instructor.avatar}
                        alt={instructor.nombre}
                      />
                      <span className={`absolute bottom-0 right-0 block h-4 w-4 rounded-full ring-2 ring-white ${instructor.estado === 'activo' ? 'bg-green-400' : instructor.estado === 'inactivo' ? 'bg-red-400' : 'bg-yellow-400'}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{instructor.nombre}</h3>
                      <p className="text-sm text-gray-500">{instructor.especialidad}</p>
                      <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(instructor.estado)}`}>
                        {instructor.estado.charAt(0).toUpperCase() + instructor.estado.slice(1)}
                      </span>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Información detallada */}
              <div className="border-t border-gray-200 px-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-sm text-gray-900 truncate">{instructor.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Teléfono</p>
                    <p className="text-sm text-gray-900">{instructor.telefono}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Experiencia</p>
                    <p className="text-sm text-gray-900">{instructor.experiencia} años</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Cursos</p>
                    <p className="text-sm text-gray-900">{instructor.cursos} cursos</p>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                <div className="flex justify-between">
                  <button className="text-blue-600 hover:text-blue-900 text-sm font-medium flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Ver perfil
                  </button>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="bg-white rounded-lg shadow px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando <span className="font-medium">{startIndex + 1}</span> a{' '}
              <span className="font-medium">
                {Math.min(startIndex + itemsPerPage, filteredInstructores.length)}
              </span>{' '}
              de <span className="font-medium">{filteredInstructores.length}</span> instructores
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Anterior
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Instructores</h3>
              <p className="text-3xl font-bold text-blue-600">{instructores.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Activos</h3>
              <p className="text-3xl font-bold text-green-600">
                {instructores.filter(i => i.estado === 'activo').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="shrink-0">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Cursos Totales</h3>
              <p className="text-3xl font-bold text-purple-600">
                {instructores.reduce((sum, instructor) => sum + instructor.cursos, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}