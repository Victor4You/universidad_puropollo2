// src/app/(dashboard)/dashboard/gestion-cursos/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CourseFormModal from '@/components/CourseFormModal';
import CourseStudentsModal from '@/components/CourseStudentsModal';
import CourseTestModal from '@/components/test/CourseTestModal';
import { CourseFormData } from '@/lib/types/form';
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
}

const cursosMock: Curso[] = [
  { id: '1', codigo: 'MAT101', nombre: 'Matemáticas Básicas', creditos: 4, semestre: '2024-I', profesor: 'Carlos Mendoza', estado: 'activo', estudiantes: 45, completado: false },
  { id: '2', codigo: 'FIS201', nombre: 'Física General', creditos: 5, semestre: '2024-I', profesor: 'Ana López', estado: 'activo', estudiantes: 38, completado: false },
  { id: '3', codigo: 'PROG301', nombre: 'Programación I', creditos: 4, semestre: '2024-I', profesor: 'Roberto Gómez', estado: 'activo', estudiantes: 30, completado: false },
  { id: '4', codigo: 'QUIM401', nombre: 'Química Orgánica', creditos: 4, semestre: '2024-I', profesor: 'Elena Torres', estado: 'inactivo', estudiantes: 25, completado: false },
];

export default function GestionCursosPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { canView, userRole } = usePermission();

  const [cursos, setCursos] = useState<Curso[]>(cursosMock);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showEstadoCursoModal, setShowEstadoCursoModal] = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState<string>('');

  useEffect(() => {
    const timer = setTimeout(() => { setLoading(false); }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleTestSuccess = (courseId: string) => {
    setCursos(prevCursos => 
      prevCursos.map(c => c.id === courseId ? { ...c, completado: true } : c)
    );
  };

  if (authLoading || loading) {
    return <div className="flex justify-center items-center min-h-[400px]"><Loader /></div>;
  }

  const esAdminOProfesor = userRole === 'admin' || userRole === 'teacher';

  const handleEdit = (curso: Curso) => { setSelectedCurso(curso); setIsModalOpen(true); };
  const handleStudents = (curso: Curso) => { setSelectedCurso(curso); setShowStudentsModal(true); };
  const handleTest = (curso: Curso) => { setSelectedCurso(curso); setShowTestModal(true); };
  
  const openEstadoModal = (curso: Curso) => {
    if (!esAdminOProfesor) return; 
    setSelectedCurso(curso);
    setNuevoEstado(curso.estado);
    setShowEstadoCursoModal(true);
  };

  const cambiarEstadoCurso = () => {
    if (selectedCurso && nuevoEstado) {
      setCursos(prevCursos => 
        prevCursos.map(c => 
          c.id === selectedCurso.id 
            ? { ...c, estado: nuevoEstado as 'activo' | 'inactivo' } 
            : c
        )
      );
      
      setShowEstadoCursoModal(false);
      setSelectedCurso(null);
      setNuevoEstado('');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Cursos</h1>
          <p className="text-gray-600">Administra y supervisa los cursos de la plataforma</p>
        </div>
        {esAdminOProfesor && (
          <button onClick={() => { setSelectedCurso(null); setIsModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <span className="text-xl">+</span> Nuevo Curso
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semestre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profesor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cursos.map((curso, index) => {
              const estaHabilitado = esAdminOProfesor || (index === 0 || !!cursos[index - 1].completado);

              return (
                <tr key={curso.id} className={`hover:bg-gray-50 transition-colors ${!estaHabilitado ? 'opacity-50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{curso.codigo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{curso.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{curso.semestre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{curso.profesor}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span 
                      onClick={() => esAdminOProfesor && openEstadoModal(curso)}
                      className={`px-2 py-1 text-xs rounded-full transition-opacity ${
                        esAdminOProfesor ? 'cursor-pointer hover:opacity-80' : 'cursor-default'
                      } ${
                        curso.estado === 'activo' ? 'bg-green-100 text-green-800' :
                        curso.estado === 'inactivo' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {curso.estado.charAt(0).toUpperCase() + curso.estado.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => estaHabilitado && handleTest(curso)}
                        disabled={!estaHabilitado}
                        className={`p-1 rounded-md transition-colors ${estaHabilitado ? 'text-purple-600 hover:bg-purple-50' : 'text-gray-300 cursor-not-allowed'}`}
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </button>

                      {esAdminOProfesor && (
                        <>
                          <button onClick={() => handleStudents(curso)} className="p-1 text-green-600 hover:bg-green-50 rounded-md transition-colors">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                          </button>
                          <button onClick={() => handleEdit(curso)} className="p-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL DE ESTADO: Se mantiene tu HTML, solo se asegura interactividad con clases de Tailwind */}
      {showEstadoCursoModal && selectedCurso && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Overlay: clickable para cerrar */}
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowEstadoCursoModal(false)}>
              <div className="fixed inset-0 bg-black opacity-30"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            {/* Contenido del modal: se agrega relative y z-index para que reciba clics */}
            <div className="relative z-[110] inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Cambiar Estado del Curso</h3>
              
              <div className="space-y-3 mb-6">
                {[
                  { id: 'activo', label: 'Activo', color: 'bg-green-100 text-green-800' },
                  { id: 'inactivo', label: 'Inactivo', color: 'bg-red-100 text-red-800' }
                ].map((opt) => (
                  <label key={opt.id} className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${nuevoEstado === opt.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                    <input 
                      type="radio" 
                      name="estado_curso" 
                      checked={nuevoEstado === opt.id} 
                      onChange={() => setNuevoEstado(opt.id)} 
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500" 
                    />
                    <span className={`ml-3 px-2 py-1 text-xs rounded-full ${opt.color}`}>{opt.label}</span>
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modales adicionales */}
      {isModalOpen && <CourseFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} courseData={selectedCurso} />}
      {showStudentsModal && selectedCurso && <CourseStudentsModal isOpen={showStudentsModal} onClose={() => setShowStudentsModal(false)} {...(selectedCurso as any)} />}
      {showTestModal && selectedCurso && <CourseTestModal isOpen={showTestModal} onClose={() => setShowTestModal(false)} courseData={selectedCurso as any} onSuccess={() => { handleTestSuccess(selectedCurso!.id); setShowTestModal(false); }} />}
    </div>
  );
}