// src/app/(dashboard)/dashboard/gestion-cursos/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CourseFormModal from '@/components/CourseFormModal';
import CourseStudentsModal from '@/components/CourseStudentsModal';
import CourseTestModal from '@/components/test/CourseTestModal';
import { CourseFormData } from '@/lib/types/form';

// 2. Imports de componentes UI
import { Loader } from '@/components/ui/Loader/Loader';

// 4. Imports de hooks
import { useAuth } from '@/hooks/useAuth';
import { usePermission } from '@/hooks/usePermission';

interface Curso {
  id: string;
  codigo: string;
  nombre: string;
  creditos: number;
  semestre: string;
  profesor: string;
  estado: 'activo' | 'inactivo' | 'pendiente';
  estudiantes: number;
}

const cursosMock: Curso[] = [
  { id: '1', codigo: 'MAT101', nombre: 'Matemáticas Básicas', creditos: 4, semestre: '2024-I', profesor: 'Carlos Mendoza', estado: 'activo', estudiantes: 45 },
  { id: '2', codigo: 'FIS201', nombre: 'Física General', creditos: 5, semestre: '2024-I', profesor: 'Ana López', estado: 'activo', estudiantes: 38 },
  { id: '3', codigo: 'PROG301', nombre: 'Programación I', creditos: 6, semestre: '2024-II', profesor: 'Roberto García', estado: 'activo', estudiantes: 52 },
  { id: '4', codigo: 'HIS102', nombre: 'Historia Universal', creditos: 3, semestre: '2024-I', profesor: 'María Rodríguez', estado: 'inactivo', estudiantes: 0 },
  { id: '5', codigo: 'ING401', nombre: 'Inglés Técnico', creditos: 4, semestre: '2024-II', profesor: 'John Smith', estado: 'pendiente', estudiantes: 30 },
  { id: '6', codigo: 'QUI202', nombre: 'Química General', creditos: 5, semestre: '2024-I', profesor: 'Luis Fernández', estado: 'activo', estudiantes: 42 },
  { id: '7', codigo: 'ADM105', nombre: 'Administración', creditos: 4, semestre: '2024-II', profesor: 'Carmen Ruiz', estado: 'activo', estudiantes: 35 },
  { id: '8', codigo: 'FIL103', nombre: 'Filosofía', creditos: 3, semestre: '2024-I', profesor: 'Pedro Sánchez', estado: 'inactivo', estudiantes: 0 },
];

export default function GestionCursosPage() {
// Estados para el modal de prueba
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [selectedCourseForTest, setSelectedCourseForTest] = useState<Curso | null>(null);

  // Función para abrir el modal de prueba
  const handleTestCourseClick = (curso: Curso) => {
    setSelectedCourseForTest(curso);
    setIsTestModalOpen(true);
  };

  // Función para cerrar el modal de prueba
  const handleCloseTestModal = () => {
    setIsTestModalOpen(false);
    setSelectedCourseForTest(null);
  };

  const [isStudentsModalOpen, setIsStudentsModalOpen] = useState(false);
  const [selectedCourseForStudents, setSelectedCourseForStudents] = useState<Curso | null>(null);

  // Función para abrir el modal de estudiantes
  const handleViewStudentsClick = (curso: Curso) => {
    setSelectedCourseForStudents(curso);
    setIsStudentsModalOpen(true);
  };

  // Función para cerrar el modal de estudiantes
  const handleCloseStudentsModal = () => {
    setIsStudentsModalOpen(false);
    setSelectedCourseForStudents(null);
  };
  
  const { user } = useAuth();
  const { canView, isRole } = usePermission();

  const canViewButon = canView (['admin', 'teacher']);

  // TODOS los hooks deben declararse aquí, al inicio del componente
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [filteredCursos, setFilteredCursos] = useState<Curso[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 5;

  // Estados para el modal - DEBEN estar antes de cualquier return
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Curso | null>(null);
 // Función para manejar la creación de un nuevo curso
  const handleCreateClick = () => {
    setSelectedCourse(null); // Asegurar que no hay curso seleccionado (modo creación)
    setIsModalOpen(true);
  };
  

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setCursos(cursosMock);
      setFilteredCursos(cursosMock);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const filtered = cursos.filter(curso =>
      curso.nombre.toLowerCase().includes(search.toLowerCase()) ||
      curso.codigo.toLowerCase().includes(search.toLowerCase()) ||
      curso.profesor.toLowerCase().includes(search.toLowerCase()) ||
      curso.semestre.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCursos(filtered);
    setCurrentPage(1);
  }, [search, cursos]);

  // Función para manejar la edición de un curso
  const handleEditClick = (curso: Curso) => {
    setSelectedCourse(curso);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const totalPages = Math.ceil(filteredCursos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCursos = filteredCursos.slice(startIndex, startIndex + itemsPerPage);

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
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  const getEstadoText = (estado: string) => {
    switch (estado) {
      case 'activo': return 'Activo';
      case 'inactivo': return 'Inactivo';
      default: return 'Desconocido';
    }
  };

   // Funciones para cambiar estado
  const abrirModalEstadoCurso = (curso: Curso) => {
    setSelectedCurso(curso);
    setNuevoEstado(curso.estado);
    setShowEstadoCursoModal(true);
  };

   const cambiarEstadoCurso = () => {
    if (selectedCurso && nuevoEstado) {
      setCursos(prev => prev.map(curso => 
        curso.id === selectedCurso.id 
          ? { ...curso, estado: nuevoEstado as Curso['estado'] }
          : curso
      ));
      setShowEstadoCursoModal(false);
      setSelectedCurso(null);
      setNuevoEstado('');
    }
  };

  // Estados para modals
  const [showEstadoCursoModal, setShowEstadoCursoModal] = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState<string>('');
   const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);
  
  // El return condicional debe estar DESPUÉS de todos los hooks
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando cursos...</p>
        </div>
      </div>
    );
  }
  const opcionesEstadoCurso = [
    { value: 'activo', label: 'Activo', color: 'bg-green-100 text-green-800' },
    { value: 'inactivo', label: 'Inactivo', color: 'bg-red-100 text-red-800' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Cursos</h1>
        <p className="text-gray-600">Administra los cursos de la universidad</p>
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
              placeholder="Buscar cursos por nombre, código, profesor o semestre..."
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>
        {canViewButon && (
        <button onClick={handleCreateClick} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Curso
        </button>
        )}
      </div>

      {/* Tabla de cursos */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Créditos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semestre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profesor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estudiantes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentCursos.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="mt-2">No se encontraron cursos</p>
                      <p className="text-sm">Intenta con otros términos de búsqueda</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentCursos.map((curso) => (
                  <tr key={curso.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900">{curso.codigo}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{curso.nombre}</div>
                        <div className="text-sm text-gray-500">{curso.creditos} créditos</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-900">{curso.creditos}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {curso.semestre}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <span className="text-gray-900">{curso.profesor}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-900">{curso.estudiantes}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {canViewButon ? (
                      <button
                              onClick={(e) => {
                                e.stopPropagation();
                                abrirModalEstadoCurso(curso);
                              }} className={`px-3 py-1 text-xs font-medium rounded-full ${getEstadoColor(curso.estado)}`}
                              >
                               {getEstadoText(curso.estado)}
                              <span className="ml-1 text-xs">✎</span>
                      </button>
                      ) : (
                                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getEstadoColor(curso.estado)}`}>
                                            {getEstadoText(curso.estado)}
                                          </span>
                                        )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                         {canViewButon && (
                        <button 
                          onClick={() => handleEditClick(curso)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                          title="Editar curso"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        )}
                         {canViewButon && (
                        <button className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                        )}
                         {canViewButon && (
                        <button  onClick={() => handleViewStudentsClick(curso)} className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        )}
                        {/* Botón REALIZAR PRUEBA (nuevo) */}
                      <button 
                      onClick={() => handleTestCourseClick(curso)}
                      className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50 transition-colors"
                      title="Realizar prueba del curso"
                      >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{startIndex + 1}</span> a{' '}
                <span className="font-medium">
                  {Math.min(startIndex + itemsPerPage, filteredCursos.length)}
                </span>{' '}
                de <span className="font-medium">{filteredCursos.length}</span> cursos
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
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Total de Cursos</h3>
              <p className="text-3xl font-bold text-blue-600">{cursos.length}</p>
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
              <h3 className="text-lg font-semibold text-gray-900">Cursos Activos</h3>
              <p className="text-3xl font-bold text-green-600">
                {cursos.filter(c => c.estado === 'activo').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="shrink-0">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Estudiantes</h3>
              <p className="text-3xl font-bold text-purple-600">
                {cursos.reduce((sum, curso) => sum + curso.estudiantes, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de edición */}
      <CourseFormModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        courseData={selectedCourse}
      />

       {/* Modal de estudiantes */}
      {selectedCourseForStudents && (
        <CourseStudentsModal
          isOpen={isStudentsModalOpen}
          onClose={handleCloseStudentsModal}
          courseData={selectedCourseForStudents}
        />
      )}

      {/* Modal de prueba del curso */}
      {selectedCourseForTest && (
        <CourseTestModal
          isOpen={isTestModalOpen}
          onClose={handleCloseTestModal}
          courseData={selectedCourseForTest}
        />
      )}

           {/* Modal para cambiar estado del Grupo */}
      {showEstadoCursoModal && selectedCurso && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Cambiar Estado del Curso
                </h3>
                <button
                  onClick={() => setShowEstadoCursoModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-700 mb-2">
                  Grupo: <span className="font-semibold">{selectedCurso.nombre}</span>
                </p>
                <p className="text-gray-700 mb-4">
                  Estado actual: <span className={`px-2 py-1 text-xs rounded-full ${getEstadoColor(selectedCurso.estado)}`}>
                    {getEstadoText(selectedCurso.estado)}
                  </span>
                </p>
              </div>
              
              <div className="space-y-3 mb-6">
                <p className="text-sm font-medium text-gray-700">Seleccionar nuevo estado:</p>
                {opcionesEstadoCurso.map((opcion) => (
                  <label 
                    key={opcion.value} 
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      nuevoEstado === opcion.value 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="estadoCurso"
                      value={opcion.value}
                      checked={nuevoEstado === opcion.value}
                      onChange={(e) => setNuevoEstado(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="ml-3 flex items-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${opcion.color}`}>
                        {opcion.label}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowEstadoCursoModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={cambiarEstadoCurso}
                  disabled={!nuevoEstado || nuevoEstado === selectedCurso.estado}
                  className={`px-4 py-2 rounded-md text-sm font-medium text-white transition-colors ${
                    !nuevoEstado || nuevoEstado === selectedCurso.estado
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  Cambiar Estado
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}