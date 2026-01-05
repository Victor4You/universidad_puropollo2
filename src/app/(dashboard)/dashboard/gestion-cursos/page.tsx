// src/app/(dashboard)/dashboard/gestion-cursos/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, Search, Edit2, Trash2, Users, 
  ChevronLeft, ChevronRight, MoreVertical, CheckCircle2,
  BookOpen, Star
} from 'lucide-react';
import CourseFormModal from '@/components/CourseFormModal';
import CourseStudentsModal from '@/components/CourseStudentsModal';
import CourseTestModal from '@/components/test/CourseTestModal';
import { Loader } from '@/components/ui/Loader/Loader';
import { useAuth } from '@/hooks/useAuth';
import { usePermission } from '@/hooks/usePermission';

interface Curso {
  id: string;
  codigo: string;
  nombre: string;
  creditos: number;
  semestre: string;
  profesor: string;
  estado: 'activo' | 'inactivo';
  estudiantes: number;
  completado?: boolean;
  calificacion?: number; // Añadido para guardar la nota
}

const cursosMock: Curso[] = [
  { id: '1', codigo: 'MAT101', nombre: 'TALLER ATENCION Y SERVICIO AL CLIENTE', creditos: 4, semestre: '2024-I', profesor: 'Carlos Mendoza', estado: 'activo', estudiantes: 45, completado: false },
  { id: '2', codigo: 'FIS201', nombre: 'INDUCCIÓN A LAS BUENAS PRACTICAS DE MANUFACTURA', creditos: 5, semestre: '2024-I', profesor: 'Ana López', estado: 'activo', estudiantes: 38, completado: false },
  { id: '3', codigo: 'PROG301', nombre: 'TALLER DE ATENCIÓN Y SERVICIO PARA CALL CENTER', creditos: 4, semestre: '2024-I', profesor: 'Roberto Gómez', estado: 'activo', estudiantes: 30, completado: false },
  { id: '4', codigo: 'QUIM401', nombre: 'CAPACITACIÓN EN SERVICIOS DE VENTAS', creditos: 4, semestre: '2024-I', profesor: 'Elena Torres', estado: 'inactivo', estudiantes: 25, completado: false },
  { id: '5', codigo: 'HIS102', nombre: 'SEGURIDAD Y PROTECCION EN EL TRABAJO', creditos: 2, semestre: '2024-I', profesor: 'Luis Rivas', estado: 'activo', estudiantes: 50, completado: false },
  { id: '6', codigo: 'BIO101', nombre: 'LIDERAZGO', creditos: 4, semestre: '2024-I', profesor: 'Martha Soto', estado: 'activo', estudiantes: 42, completado: false },
];

export default function GestionCursosPage() {
  const { isLoading: authLoading } = useAuth();
  const { userRole } = usePermission();

  const [cursos, setCursos] = useState<Curso[]>(cursosMock);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showEstadoCursoModal, setShowEstadoCursoModal] = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState<string>('');

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    // Cargar progreso guardado al iniciar
    const savedProgress = localStorage.getItem('progreso_academico');
    if (savedProgress) {
      try {
        const progreso = JSON.parse(savedProgress); // { "cursoId": score }
        setCursos(prev => prev.map(c => ({
          ...c,
          completado: progreso[c.id] !== undefined,
          calificacion: progreso[c.id]
        })));
      } catch (e) { console.error("Error al cargar progreso", e); }
    }

    const timer = setTimeout(() => { setLoading(false); }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const esAdminOProfesor = userRole === 'admin' || userRole === 'teacher';

  const filteredCursos = cursos.filter(curso =>
    curso.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    curso.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCursos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCursos.length / itemsPerPage);

  const handleTestSuccess = (courseId: string, score: number) => {
    // Actualizar estado local
    const nuevosCursos = cursos.map(c => 
      c.id === courseId ? { ...c, completado: true, calificacion: score } : c
    );
    setCursos(nuevosCursos);

    // Persistir calificaciones (para esta página)
    const saved = JSON.parse(localStorage.getItem('progreso_academico') || '{}');
    saved[courseId] = score;
    localStorage.setItem('progreso_academico', JSON.stringify(saved));

    // Persistir IDs completados (para el Feed)
    const idsCompletados = nuevosCursos.filter(c => c.completado).map(c => c.id);
    localStorage.setItem('progreso_cursos', JSON.stringify(idsCompletados));
    
    setShowTestModal(false);
  };

  const cambiarEstadoCurso = () => {
    if (selectedCurso && nuevoEstado) {
      setCursos(prevCursos => 
        prevCursos.map(c => c.id === selectedCurso.id ? { ...c, estado: nuevoEstado as 'activo' | 'inactivo' } : c)
      );
      setShowEstadoCursoModal(false);
    }
  };

  if (authLoading || loading) return <div className="flex justify-center items-center min-h-[400px]"><Loader /></div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Cursos</h1>
          <p className="text-gray-500">Administra y supervisa los cursos de la plataforma</p>
        </div>
        {esAdminOProfesor && (
          <button 
            onClick={() => { setSelectedCurso(null); setIsModalOpen(true); }} 
            className="flex items-center justify-center px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5 mr-2" /> Nuevo Curso
          </button>
        )}
      </div>

      {/* Buscador */}
      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar curso..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {currentItems.map((curso, index) => {
          // Mantengo tu lógica de habilitación original
          const globalIndex = indexOfFirstItem + index;
          const estaHabilitado = esAdminOProfesor || (globalIndex === 0 || !!cursos[globalIndex - 1].completado);

          return (
            <div 
              key={curso.id} 
              className={`bg-white rounded-2xl border border-gray-100 shadow-sm transition-all flex flex-col overflow-hidden ${!estaHabilitado ? 'opacity-50 grayscale-[0.5]' : 'hover:shadow-md'}`}
            >
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-1 rounded">
                    {curso.codigo}
                  </span>
                  <span 
                    onClick={() => esAdminOProfesor && (setSelectedCurso(curso), setNuevoEstado(curso.estado), setShowEstadoCursoModal(true))}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                      esAdminOProfesor ? 'cursor-pointer hover:opacity-80' : ''
                    } ${curso.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                  >
                    {curso.estado.charAt(0).toUpperCase() + curso.estado.slice(1)}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">{curso.nombre}</h3>
                <p className="text-gray-500 text-sm mb-4 flex items-center">
                  <Users className="w-4 h-4 mr-1.5" /> {curso.profesor}
                </p>

                {/* Mostrar Calificación si está completado */}
                {curso.completado && curso.calificacion !== undefined && (
                  <div className="mb-4 flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 w-fit">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="text-sm font-bold text-amber-700">Nota: {curso.calificacion}/10</span>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="text-[11px] font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                    {curso.creditos} CRÉDITOS
                  </div>
                  <div className="text-[11px] font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                    {curso.semestre}
                  </div>
                </div>
              </div>

              {/* Acciones del Card */}
              <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
                <div className="flex space-x-1">
                  <button
                    onClick={() => estaHabilitado && !curso.completado && (setSelectedCurso(curso), setShowTestModal(true))}
                    disabled={!estaHabilitado || curso.completado}
                    className={`p-2 rounded-lg transition-colors ${estaHabilitado && !curso.completado ? 'text-purple-600 hover:bg-purple-100' : 'text-gray-300'}`}
                  >
                    <BookOpen className="w-5 h-5" />
                  </button>

                  {esAdminOProfesor && (
                    <>
                      <button onClick={() => (setSelectedCurso(curso), setShowStudentsModal(true))} className="p-2 text-green-600 hover:bg-green-100 rounded-lg">
                        <Users className="w-5 h-5" />
                      </button>
                      <button onClick={() => (setSelectedCurso(curso), setIsModalOpen(true))} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg">
                        <Edit2 className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
                
                {curso.completado && <CheckCircle2 className="w-6 h-6 text-green-500" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <p className="text-sm text-gray-500 hidden sm:block">
          Mostrando página <span className="font-bold text-gray-900">{currentPage}</span> de {totalPages}
        </p>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl border border-gray-200 disabled:opacity-20 hover:bg-gray-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex space-x-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                  currentPage === i + 1 ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl border border-gray-200 disabled:opacity-20 hover:bg-gray-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Modal de Estado adaptado para que sea interactivo */}
      {showEstadoCursoModal && selectedCurso && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Estado del Curso</h3>
            <p className="text-sm text-gray-500 mb-6">{selectedCurso.nombre}</p>
            
            <div className="space-y-3 mb-8">
              {[{ id: 'activo', label: 'Activo', color: 'text-green-700 bg-green-100' }, 
                { id: 'inactivo', label: 'Inactivo', color: 'text-red-700 bg-red-100' }].map((opt) => (
                <label 
                  key={opt.id} 
                  className={`flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    nuevoEstado === opt.id ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <input 
                    type="radio" 
                    className="hidden" 
                    checked={nuevoEstado === opt.id} 
                    onChange={() => setNuevoEstado(opt.id)} 
                  />
                  <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${nuevoEstado === opt.id ? 'border-blue-600' : 'border-gray-300'}`}>
                    {nuevoEstado === opt.id && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${opt.color}`}>{opt.label}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowEstadoCursoModal(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl">Cancelar</button>
              <button onClick={cambiarEstadoCurso} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modales originales */}
      {isModalOpen && <CourseFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} courseData={selectedCurso} />}
      {showStudentsModal && selectedCurso && <CourseStudentsModal isOpen={showStudentsModal} onClose={() => setShowStudentsModal(false)} {...(selectedCurso as any)} />}
      {showTestModal && selectedCurso && (
        <CourseTestModal 
          isOpen={showTestModal} 
          onClose={() => setShowTestModal(false)} 
          courseData={selectedCurso as any} 
          onSuccess={(score: number) => handleTestSuccess(selectedCurso!.id, score)} 
        />
      )}
    </div>
  );
}