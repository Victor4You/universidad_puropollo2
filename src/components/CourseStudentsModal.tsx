// components/CourseStudentsModal.tsx
'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';

// Íconos SVG
const XMarkIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const PlusIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const UserIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

interface Estudiante {
  id: string;
  nombre: string;
  email: string;
  matricula: string;
  telefono?: string;
  departamento?: string;
  inscrito: boolean;
}

interface CourseStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseData: {
    id: string;
    codigo: string;
    nombre: string;
    creditos: number;
    semestre: string;
    profesor: string;
    estado: 'activo' | 'inactivo' | 'pendiente';
    estudiantes: number;
  };
}

export default function CourseStudentsModal({ isOpen, onClose, courseData }: CourseStudentsModalProps) {
  // Estado para el período
  const [periodo, setPeriodo] = useState({
    inicio: '2025-05-26',
    fin: '2025-06-15'
  });

  // Estado para estudiantes
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([
    {
      id: '1',
      nombre: 'JESUS ARNOLDO CHAVEZ LOPEZ',
      email: 'jesus.chavez@ejemplo.com',
      matricula: '20230001',
      departamento: 'OFICINA',
      inscrito: true
    },
    {
      id: '2',
      nombre: 'MARIA FERNANDA GARCIA',
      email: 'maria.garcia@ejemplo.com',
      matricula: '20230002',
      departamento: 'INGENIERÍA',
      inscrito: true
    },
    {
      id: '3',
      nombre: 'CARLOS EDUARDO MARTINEZ',
      email: 'carlos.martinez@ejemplo.com',
      matricula: '20230003',
      departamento: 'ADMINISTRACIÓN',
      inscrito: true
    },
    {
      id: '4',
      nombre: 'ANA LUCIA SANCHEZ',
      email: 'ana.sanchez@ejemplo.com',
      matricula: '20230004',
      departamento: 'RECURSOS HUMANOS',
      inscrito: false
    },
    {
      id: '5',
      nombre: 'LUIS ALBERTO RAMIREZ',
      email: 'luis.ramirez@ejemplo.com',
      matricula: '20230005',
      departamento: 'VENTAS',
      inscrito: true
    }
  ]);

  // Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [nuevoEstudiante, setNuevoEstudiante] = useState('');

  // Filtrar estudiantes basados en búsqueda y estado
  const estudiantesFiltrados = estudiantes.filter(estudiante => {
    const matchesSearch = searchTerm === '' || 
      estudiante.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estudiante.matricula.includes(searchTerm) ||
      estudiante.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Contadores
  const totalEstudiantes = estudiantes.length;
  const estudiantesInscritos = estudiantes.filter(e => e.inscrito).length;

  // Funciones
  const handleToggleInscripcion = (id: string) => {
    setEstudiantes(estudiantes.map(estudiante => 
      estudiante.id === id 
        ? { ...estudiante, inscrito: !estudiante.inscrito }
        : estudiante
    ));
  };

  const handleAgregarEstudiante = () => {
    if (nuevoEstudiante.trim() === '') return;

    const nuevoId = (estudiantes.length + 1).toString();
    const nuevoEstudianteObj: Estudiante = {
      id: nuevoId,
      nombre: nuevoEstudiante.toUpperCase(),
      email: `${nuevoEstudiante.toLowerCase().replace(/\s+/g, '.')}@universidad.edu`,
      matricula: `2023${String(estudiantes.length + 1).padStart(4, '0')}`,
      departamento: 'SIN DEPARTAMENTO',
      inscrito: true
    };

    setEstudiantes([...estudiantes, nuevoEstudianteObj]);
    setNuevoEstudiante('');
  };

  const handleEliminarEstudiante = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar a este estudiante del curso?')) {
      setEstudiantes(estudiantes.filter(e => e.id !== id));
    }
  };

  const handleGuardar = () => {
    // Aquí iría la lógica para guardar los cambios en la API
    console.log('Guardando cambios:', {
      curso: courseData,
      periodo,
      estudiantes
    });
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <Dialog.Title as="h3" className="text-2xl font-bold text-gray-900">
                      Estudiantes del curso
                    </Dialog.Title>
                    <p className="text-sm text-gray-500 mt-1">Formulario</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <XMarkIcon />
                  </button>
                </div>

                {/* Información del curso */}
                <div className="mb-8 p-4 bg-blue-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{courseData.codigo} - {courseData.nombre}</h4>
                      <p className="text-sm text-gray-600">{courseData.creditos} créditos • {courseData.semestre}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Profesor: <span className="font-medium">{courseData.profesor}</span></p>
                      <p className="text-sm text-gray-600">Estado: <span className={`font-medium ${
                        courseData.estado === 'activo' ? 'text-green-600' : 
                        courseData.estado === 'inactivo' ? 'text-red-600' : 'text-yellow-600'
                      }`}>{courseData.estado}</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{courseData.estudiantes}</p>
                      <p className="text-sm text-gray-600">Estudiantes matriculados</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4">
                  {/* Periodo */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">Estudiantes</h4>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-700">Periodo:</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="date"
                          value={periodo.inicio}
                          onChange={(e) => setPeriodo({...periodo, inicio: e.target.value})}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                        <span className="text-gray-500">al</span>
                        <input
                          type="date"
                          value={periodo.fin}
                          onChange={(e) => setPeriodo({...periodo, fin: e.target.value})}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Barra de búsqueda */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SearchIcon />
                    </div>
                    <input
                      type="text"
                      placeholder="Buscar estudiantes por nombre, matrícula o email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>

                  {/* Agregar estudiante */}
                  <div className="space-y-3">
                    <h5 className="font-medium text-gray-900">Agregar estudiante...</h5>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Nombre del estudiante"
                        value={nuevoEstudiante}
                        onChange={(e) => setNuevoEstudiante(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAgregarEstudiante}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        <PlusIcon />
                        Agregar
                      </button>
                    </div>
                  </div>

                  {/* Lista de estudiantes */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h5 className="font-medium text-gray-900">
                        Lista de Estudiantes ({estudiantesFiltrados.length})
                      </h5>
                      <div className="text-sm text-gray-500">
                        <span className="text-green-600 font-medium">{estudiantesInscritos} inscritos</span>
                        {' • '}
                        <span className="text-gray-600">{totalEstudiantes} total</span>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Estudiante
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Matrícula
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Departamento
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Inscrito
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Acciones
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {estudiantesFiltrados.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                No se encontraron estudiantes
                              </td>
                            </tr>
                          ) : (
                            estudiantesFiltrados.map((estudiante) => (
                              <tr key={estudiante.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                      <UserIcon />
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">
                                        {estudiante.nombre}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {estudiante.matricula}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {estudiante.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                                    {estudiante.departamento}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <button
                                    onClick={() => handleToggleInscripcion(estudiante.id)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                                      estudiante.inscrito ? 'bg-green-600' : 'bg-gray-300'
                                    }`}
                                  >
                                    <span
                                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                        estudiante.inscrito ? 'translate-x-6' : 'translate-x-1'
                                      }`}
                                    />
                                  </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <button
                                    onClick={() => handleEliminarEstudiante(estudiante.id)}
                                    className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                                  >
                                    Eliminar
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Ejemplo de estudiante de la imagen */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          JESUS ARNOLDO CHAVEZ LOPEZ
                        </div>
                        <div className="text-sm text-gray-600">
                          Departamento: <span className="font-medium">OFICINA</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggleInscripcion('1')}
                        className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-600"
                      >
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                      </button>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex justify-end gap-4 pt-6 border-t">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleGuardar}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}