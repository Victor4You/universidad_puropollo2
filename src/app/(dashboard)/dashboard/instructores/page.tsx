// src/app/(dashboard)/dashboard/instructores/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePermission } from '@/hooks/usePermission';

// Importación de componentes de UI de tu carpeta de componentes
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InstructorForm } from "@/components/Forms/InstructorForm";

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
  const { canView } = usePermission();

  // Permiso para ver el botón de creación (solo admin y teacher)
  const canEditPermission = canView(['admin', 'teacher']);

  const [instructores, setInstructores] = useState<Instructor[]>([]);
  const [filteredInstructores, setFilteredInstructores] = useState<Instructor[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estado para controlar el modal del formulario
  const [showInstructorModal, setShowInstructorModal] = useState(false);
  
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
      {/* Modal de Formulario para Nuevo Instructor */}
      {showInstructorModal && (
        <InstructorForm onClose={() => setShowInstructorModal(false)} />
      )}

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
            <Input
              type="text"
              className="pl-10"
              placeholder="Buscar instructores por nombre, especialidad..."
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>
        
        {/* Solo un botón aquí: Nuevo Instructor */}
        {canEditPermission && (
          <Button 
            onClick={() => setShowInstructorModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center shadow-sm"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Instructor
          </Button>
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
            </div>
          </div>
        ) : (
          currentInstructores.map((instructor) => (
            <div key={instructor.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100">
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
                </div>
              </div>

              {/* Información detallada */}
              <div className="border-t border-gray-200 px-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Email</p>
                    <p className="text-sm text-gray-900 truncate">{instructor.email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Teléfono</p>
                    <p className="text-sm text-gray-900">{instructor.telefono}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Experiencia</p>
                    <p className="text-sm text-gray-900">{instructor.experiencia} años</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Cursos</p>
                    <p className="text-sm text-gray-900">{instructor.cursos} asignados</p>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="border-t border-gray-200 px-6 py-3 bg-gray-50 flex justify-between">
                <Button variant="link" className="text-blue-600 p-0 h-auto">Ver perfil</Button>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="bg-white rounded-lg shadow px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{startIndex + 1}</span> a <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredInstructores.length)}</span> de <span className="font-medium">{filteredInstructores.length}</span>
          </p>
          <div className="flex space-x-1">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Anterior
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
            <Button 
              variant="outline" 
              size="sm" 
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-4">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" /></svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Instructores</p>
            <p className="text-2xl font-bold">{instructores.length}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mr-4">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Activos</p>
            <p className="text-2xl font-bold text-green-600">{instructores.filter(i => i.estado === 'activo').length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mr-4">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" /></svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Cursos Totales</p>
            <p className="text-2xl font-bold text-purple-600">{instructores.reduce((sum, i) => sum + i.cursos, 0)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}