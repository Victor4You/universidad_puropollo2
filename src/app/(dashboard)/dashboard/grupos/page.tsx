// src/app/(dashboard)/dashboard/grupos/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface Estudiante {
  id: string;
  nombre: string;
  matricula: string;
  email: string;
  telefono: string;
  estado: 'activo' | 'inactivo';
}

interface Grupo {
  id: string;
  nombre: string;
  curso: string;
  codigo: string;
  instructor: string;
  estudiantes: number;
  estado: 'activo' | 'inactivo';
  capacidad: number;
  horario: string;
  aula: string;
  fechaInicio: string;
  fechaFin: string;
  estudiantesLista: Estudiante[];
}

// Datos mock de estudiantes
const estudiantesMock: Estudiante[] = [
  { id: '1', nombre: 'Juan Pérez', matricula: '20230001', email: 'juan.perez@universidad.edu', telefono: '+51 999 111 222', estado: 'activo' },
  { id: '2', nombre: 'María López', matricula: '20230002', email: 'maria.lopez@universidad.edu', telefono: '+51 999 111 223', estado: 'activo' },
  { id: '3', nombre: 'Carlos Sánchez', matricula: '20230003', email: 'carlos.sanchez@universidad.edu', telefono: '+51 999 111 224', estado: 'activo' },
  { id: '4', nombre: 'Ana Rodríguez', matricula: '20230004', email: 'ana.rodriguez@universidad.edu', telefono: '+51 999 111 225', estado: 'inactivo' },
  { id: '5', nombre: 'Pedro Gómez', matricula: '20230005', email: 'pedro.gomez@universidad.edu', telefono: '+51 999 111 226', estado: 'activo' },
  { id: '6', nombre: 'Laura Martínez', matricula: '20230006', email: 'laura.martinez@universidad.edu', telefono: '+51 999 111 227', estado: 'activo' },
  { id: '7', nombre: 'Miguel Torres', matricula: '20230007', email: 'miguel.torres@universidad.edu', telefono: '+51 999 111 228', estado: 'inactivo' },
  { id: '8', nombre: 'Sofía Ramírez', matricula: '20230008', email: 'sofia.ramirez@universidad.edu', telefono: '+51 999 111 229', estado: 'activo' },
];

const gruposMock: Grupo[] = [
  { 
    id: '1', 
    nombre: 'Grupo A - Matemáticas', 
    curso: 'Matemáticas Básicas', 
    codigo: 'GRP-MAT-001',
    instructor: 'Carlos Mendoza', 
    estudiantes: 4, 
    capacidad: 30,
    estado: 'activo', 
    horario: 'Lun/Mié/Vie 8:00-10:00',
    aula: 'Aula 301',
    fechaInicio: '15/01/2024',
    fechaFin: '15/06/2024',
    estudiantesLista: estudiantesMock.slice(0, 4)
  },
  { 
    id: '2', 
    nombre: 'Grupo B - Programación', 
    curso: 'Programación I', 
    codigo: 'GRP-PROG-002',
    instructor: 'Roberto García', 
    estudiantes: 4, 
    capacidad: 25,
    estado: 'inactivo', 
    horario: 'Mar/Jue 14:00-16:00',
    aula: 'Lab. Computación 1',
    fechaInicio: '20/01/2024',
    fechaFin: '20/06/2024',
    estudiantesLista: estudiantesMock.slice(2, 6)
  },
  { 
    id: '3', 
    nombre: 'Grupo C - Física', 
    curso: 'Física General', 
    codigo: 'GRP-FIS-003',
    instructor: 'Ana López', 
    estudiantes: 3, 
    capacidad: 25,
    estado: 'activo', 
    horario: 'Lun/Mié 10:00-12:00',
    aula: 'Aula 205',
    fechaInicio: '18/01/2024',
    fechaFin: '18/06/2024',
    estudiantesLista: estudiantesMock.slice(1, 4)
  },
  { 
    id: '4', 
    nombre: 'Grupo D - Inglés', 
    curso: 'Inglés Técnico', 
    codigo: 'GRP-ING-004',
    instructor: 'John Smith', 
    estudiantes: 5, 
    capacidad: 30,
    estado: 'activo', 
    horario: 'Mar/Jue 16:00-18:00',
    aula: 'Aula 102',
    fechaInicio: '22/01/2024',
    fechaFin: '22/06/2024',
    estudiantesLista: estudiantesMock.slice(3, 8)
  },
  { 
    id: '5', 
    nombre: 'Grupo E - Historia', 
    curso: 'Historia Universal', 
    codigo: 'GRP-HIS-005',
    instructor: 'María Rodríguez', 
    estudiantes: 0, 
    capacidad: 20,
    estado: 'inactivo', 
    horario: 'Vie 14:00-17:00',
    aula: 'Aula 108',
    fechaInicio: '25/01/2024',
    fechaFin: '25/06/2024',
    estudiantesLista: []
  },
  { 
    id: '6', 
    nombre: 'Grupo F - Química', 
    curso: 'Química General', 
    codigo: 'GRP-QUI-006',
    instructor: 'Luis Fernández', 
    estudiantes: 3, 
    capacidad: 30,
    estado: 'inactivo', 
    horario: 'Mié/Vie 9:00-11:00',
    aula: 'Lab. Química 2',
    fechaInicio: '17/01/2024',
    fechaFin: '17/06/2024',
    estudiantesLista: estudiantesMock.slice(4, 7)
  },
];

export default function GruposPage() {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [filteredGrupos, setFilteredGrupos] = useState<Grupo[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const itemsPerPage = 4;

  // Estados para modals
  const [showEstadoGrupoModal, setShowEstadoGrupoModal] = useState(false);
  const [showEstadoEstudianteModal, setShowEstadoEstudianteModal] = useState(false);
  const [selectedGrupo, setSelectedGrupo] = useState<Grupo | null>(null);
  const [selectedEstudiante, setSelectedEstudiante] = useState<{grupoId: string, estudiante: Estudiante} | null>(null);
  const [nuevoEstado, setNuevoEstado] = useState<string>('');

  // Filtros
  const [filterEstado, setFilterEstado] = useState<string>('todos');
  const [filterCurso, setFilterCurso] = useState<string>('todos');

  const cursosUnicos = Array.from(new Set(gruposMock.map(g => g.curso)));

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setGrupos(gruposMock);
      setFilteredGrupos(gruposMock);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = grupos;
    
    // Filtro por búsqueda
    if (search) {
      filtered = filtered.filter(grupo =>
        grupo.nombre.toLowerCase().includes(search.toLowerCase()) ||
        grupo.curso.toLowerCase().includes(search.toLowerCase()) ||
        grupo.codigo.toLowerCase().includes(search.toLowerCase()) ||
        grupo.instructor.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Filtro por estado
    if (filterEstado !== 'todos') {
      filtered = filtered.filter(grupo => grupo.estado === filterEstado);
    }
    
    // Filtro por curso
    if (filterCurso !== 'todos') {
      filtered = filtered.filter(grupo => grupo.curso === filterCurso);
    }
    
    setFilteredGrupos(filtered);
    setCurrentPage(1);
  }, [search, filterEstado, filterCurso, grupos]);

  const totalPages = Math.ceil(filteredGrupos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentGrupos = filteredGrupos.slice(startIndex, startIndex + itemsPerPage);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const toggleRow = (grupoId: string) => {
    setExpandedRows(prev => 
      prev.includes(grupoId) 
        ? prev.filter(id => id !== grupoId)
        : [...prev, grupoId]
    );
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactivo': return 'bg-red-100 text-red-800 border-red-200';
      case 'completo': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'suspendido': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEstadoEstudianteColor = (estado: string) => {
    switch (estado) {
      case 'activo': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactivo': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEstadoText = (estado: string) => {
    switch (estado) {
      case 'activo': return 'Activo';
      case 'inactivo': return 'Inactivo';
      default: return 'Desconocido';
    }
  };

  const calcularPorcentaje = (estudiantes: number, capacidad: number) => {
    return (estudiantes / capacidad) * 100;
  };

  const handleAltaBajaEstudiante = (grupoId: string, estudianteId: string, accion: 'alta' | 'baja') => {
    setGrupos(prev => prev.map(grupo => {
      if (grupo.id === grupoId) {
        if (accion === 'alta') {
          // Encontrar un estudiante no asignado
          const estudianteLibre = estudiantesMock.find(e => 
            !grupo.estudiantesLista.some(est => est.id === e.id)
          );
          
          if (estudianteLibre) {
            return {
              ...grupo,
              estudiantes: grupo.estudiantes + 1,
              estudiantesLista: [...grupo.estudiantesLista, estudianteLibre]
            };
          }
        } else if (accion === 'baja') {
          return {
            ...grupo,
            estudiantes: Math.max(0, grupo.estudiantes - 1),
            estudiantesLista: grupo.estudiantesLista.filter(e => e.id !== estudianteId)
          };
        }
      }
      return grupo;
    }));
  };

  // Funciones para cambiar estado
  const abrirModalEstadoGrupo = (grupo: Grupo) => {
    setSelectedGrupo(grupo);
    setNuevoEstado(grupo.estado);
    setShowEstadoGrupoModal(true);
  };

  const abrirModalEstadoEstudiante = (grupoId: string, estudiante: Estudiante) => {
    setSelectedEstudiante({ grupoId, estudiante });
    setNuevoEstado(estudiante.estado);
    setShowEstadoEstudianteModal(true);
  };

  const cambiarEstadoGrupo = () => {
    if (selectedGrupo && nuevoEstado) {
      setGrupos(prev => prev.map(grupo => 
        grupo.id === selectedGrupo.id 
          ? { ...grupo, estado: nuevoEstado as Grupo['estado'] }
          : grupo
      ));
      setShowEstadoGrupoModal(false);
      setSelectedGrupo(null);
      setNuevoEstado('');
    }
  };

  const cambiarEstadoEstudiante = () => {
    if (selectedEstudiante && nuevoEstado) {
      setGrupos(prev => prev.map(grupo => {
        if (grupo.id === selectedEstudiante.grupoId) {
          return {
            ...grupo,
            estudiantesLista: grupo.estudiantesLista.map(est => 
              est.id === selectedEstudiante.estudiante.id
                ? { ...est, estado: nuevoEstado as Estudiante['estado'] }
                : est
            )
          };
        }
        return grupo;
      }));
      setShowEstadoEstudianteModal(false);
      setSelectedEstudiante(null);
      setNuevoEstado('');
    }
  };

  const opcionesEstadoGrupo = [
    { value: 'activo', label: 'Activo', color: 'bg-green-100 text-green-800' },
    { value: 'inactivo', label: 'Inactivo', color: 'bg-red-100 text-red-800' },
  ];

  const opcionesEstadoEstudiante = [
    { value: 'activo', label: 'Activo', color: 'bg-green-100 text-green-800' },
    { value: 'inactivo', label: 'Inactivo', color: 'bg-red-100 text-red-800' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando grupos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header de la página con título y descripción */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Grupos</h1>
        <p className="text-gray-600">Administra los grupos de estudiantes</p>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <div className="w-full lg:w-96">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Buscar grupos por nombre, curso o instructor..."
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {/* Filtro por estado */}
          <div>
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
            >
              <option value="todos">Todos los estados</option>
              {opcionesEstadoGrupo.map(opcion => (
                <option key={opcion.value} value={opcion.value}>{opcion.label}</option>
              ))}
            </select>
          </div>
          
          {/* Filtro por curso */}
          <div>
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filterCurso}
              onChange={(e) => setFilterCurso(e.target.value)}
            >
              <option value="todos">Todos los cursos</option>
              {cursosUnicos.map(curso => (
                <option key={curso} value={curso}>{curso}</option>
              ))}
            </select>
          </div>
          
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Grupo
          </button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Total Grupos</p>
              <p className="text-2xl font-bold text-blue-600">{grupos.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="shrink-0">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Grupos Activos</p>
              <p className="text-2xl font-bold text-green-600">
                {grupos.filter(g => g.estado === 'activo').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="shrink-0">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Total Estudiantes</p>
              <p className="text-2xl font-bold text-purple-600">
                {grupos.reduce((sum, grupo) => sum + grupo.estudiantes, 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Ocupación Promedio</p>
              <p className="text-2xl font-bold text-yellow-600">
                {Math.round(grupos.reduce((sum, grupo) => sum + (grupo.estudiantes / grupo.capacidad * 100), 0) / grupos.length)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de grupos */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                  {/* Columna vacía para el botón de expandir */}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grupo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Curso</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estudiantes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentGrupos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="mt-2">No se encontraron grupos</p>
                      <p className="text-sm">Intenta con otros términos de búsqueda o filtros</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentGrupos.map((grupo) => {
                  const isExpanded = expandedRows.includes(grupo.id);
                  return (
                    <>
                      <tr 
                        key={grupo.id} 
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => toggleRow(grupo.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            className="text-gray-500 hover:text-gray-700 focus:outline-none"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRow(grupo.id);
                            }}
                          >
                            <svg 
                              className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{grupo.nombre}</div>
                            <div className="text-sm text-gray-500">{grupo.codigo}</div>
                            <div className="text-xs text-gray-400">
                              {grupo.aula} • {grupo.fechaInicio} - {grupo.fechaFin}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {grupo.horario}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-gray-900">{grupo.curso}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <span className="text-gray-900">{grupo.instructor}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-900">{grupo.estudiantes} / {grupo.capacidad}</span>
                              <span className="text-gray-500">{Math.round(calcularPorcentaje(grupo.estudiantes, grupo.capacidad))}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  calcularPorcentaje(grupo.estudiantes, grupo.capacidad) >= 90 ? 'bg-red-600' :
                                  calcularPorcentaje(grupo.estudiantes, grupo.capacidad) >= 70 ? 'bg-yellow-600' :
                                  'bg-green-600'
                                }`}
                                style={{ width: `${calcularPorcentaje(grupo.estudiantes, grupo.capacidad)}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              abrirModalEstadoGrupo(grupo);
                            }}
                            className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors hover:opacity-90 ${getEstadoColor(grupo.estado)}`}
                          >
                            {getEstadoText(grupo.estado)}
                            <span className="ml-1 text-xs">✎</span>
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                            <button 
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors" 
                              title="Editar"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Lógica para editar
                              }}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button 
                              className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors" 
                              title="Agregar estudiante"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAltaBajaEstudiante(grupo.id, '', 'alta');
                              }}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Fila expandida con lista de estudiantes */}
                      {isExpanded && (
                        <tr className="bg-gray-50">
                          <td colSpan={7} className="px-6 py-4">
                            <div className="ml-8">
                              <h4 className="font-medium text-gray-900 mb-3">Estudiantes del Grupo ({grupo.estudiantesLista.length})</h4>
                              
                              {grupo.estudiantesLista.length === 0 ? (
                                <div className="text-center py-4 text-gray-500">
                                  <p>No hay estudiantes asignados a este grupo</p>
                                  <button 
                                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    onClick={() => handleAltaBajaEstudiante(grupo.id, '', 'alta')}
                                  >
                                    + Agregar estudiante
                                  </button>
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {grupo.estudiantesLista.map((estudiante) => (
                                    <div 
                                      key={estudiante.id} 
                                      className="bg-white border rounded-lg p-3 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
                                    >
                                      <div className="flex-1">
                                        <div className="font-medium text-gray-900">{estudiante.nombre}</div>
                                        <div className="text-sm text-gray-500">{estudiante.matricula}</div>
                                        <div className="text-xs text-gray-400 truncate">{estudiante.email}</div>
                                      </div>
                                      <div className="flex items-center space-x-2 ml-3">
                                        <button
                                          onClick={() => abrirModalEstadoEstudiante(grupo.id, estudiante)}
                                          className={`px-2 py-1 text-xs font-medium rounded-full border transition-colors hover:opacity-90 ${getEstadoEstudianteColor(estudiante.estado)}`}
                                          title="Cambiar estado"
                                        >
                                          {getEstadoText(estudiante.estado)}
                                          <span className="ml-1 text-xs">✎</span>
                                        </button>
                                        <button 
                                          className="text-red-600 hover:text-red-800 p-1 transition-colors"
                                          onClick={() => handleAltaBajaEstudiante(grupo.id, estudiante.id, 'baja')}
                                          title="Dar de baja"
                                        >
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                          </svg>
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              <div className="mt-4 flex justify-between items-center pt-4 border-t border-gray-200">
                                <div className="text-sm text-gray-500">
                                  Capacidad: {grupo.capacidad} estudiantes • Disponibles: {grupo.capacidad - grupo.estudiantes}
                                </div>
                                <button 
                                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                                  onClick={() => handleAltaBajaEstudiante(grupo.id, '', 'alta')}
                                >
                                  + Agregar estudiante
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })
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
                  {Math.min(startIndex + itemsPerPage, filteredGrupos.length)}
                </span>{' '}
                de <span className="font-medium">{filteredGrupos.length}</span> grupos
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

      {/* Modal para cambiar estado del Grupo */}
      {showEstadoGrupoModal && selectedGrupo && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Cambiar Estado del Grupo
                </h3>
                <button
                  onClick={() => setShowEstadoGrupoModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-700 mb-2">
                  Grupo: <span className="font-semibold">{selectedGrupo.nombre}</span>
                </p>
                <p className="text-gray-700 mb-4">
                  Estado actual: <span className={`px-2 py-1 text-xs rounded-full ${getEstadoColor(selectedGrupo.estado)}`}>
                    {getEstadoText(selectedGrupo.estado)}
                  </span>
                </p>
              </div>
              
              <div className="space-y-3 mb-6">
                <p className="text-sm font-medium text-gray-700">Seleccionar nuevo estado:</p>
                {opcionesEstadoGrupo.map((opcion) => (
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
                      name="estadoGrupo"
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
                  onClick={() => setShowEstadoGrupoModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={cambiarEstadoGrupo}
                  disabled={!nuevoEstado || nuevoEstado === selectedGrupo.estado}
                  className={`px-4 py-2 rounded-md text-sm font-medium text-white transition-colors ${
                    !nuevoEstado || nuevoEstado === selectedGrupo.estado
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

      {/* Modal para cambiar estado del Estudiante */}
      {showEstadoEstudianteModal && selectedEstudiante && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Cambiar Estado del Estudiante
                </h3>
                <button
                  onClick={() => setShowEstadoEstudianteModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-700 mb-2">
                  Estudiante: <span className="font-semibold">{selectedEstudiante.estudiante.nombre}</span>
                </p>
                <p className="text-gray-700 mb-2">
                  Matrícula: <span className="font-medium">{selectedEstudiante.estudiante.matricula}</span>
                </p>
                <p className="text-gray-700 mb-4">
                  Estado actual: <span className={`px-2 py-1 text-xs rounded-full ${getEstadoEstudianteColor(selectedEstudiante.estudiante.estado)}`}>
                    {getEstadoText(selectedEstudiante.estudiante.estado)}
                  </span>
                </p>
              </div>
              
              <div className="space-y-3 mb-6">
                <p className="text-sm font-medium text-gray-700">Seleccionar nuevo estado:</p>
                {opcionesEstadoEstudiante.map((opcion) => (
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
                      name="estadoEstudiante"
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
                  onClick={() => setShowEstadoEstudianteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={cambiarEstadoEstudiante}
                  disabled={!nuevoEstado || nuevoEstado === selectedEstudiante.estudiante.estado}
                  className={`px-4 py-2 rounded-md text-sm font-medium text-white transition-colors ${
                    !nuevoEstado || nuevoEstado === selectedEstudiante.estudiante.estado
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