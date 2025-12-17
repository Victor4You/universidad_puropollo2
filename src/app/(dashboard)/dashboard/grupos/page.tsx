// src/app/(dashboard)/dashboard/grupos/page.tsx
'use client';
// Nota: He añadido React.Fragment para manejar el despliegue de filas en la tabla sin romper la estructura de HTML.
import React from 'react';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePermission } from '@/hooks/usePermission';

// Importación de componentes UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Importación de los Formularios
import { GrupoForm } from "@/components/Forms/GrupoForm";
import { EstudianteForm } from "@/components/Forms/EstudianteForm";

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

// Datos de ejemplo
const estudiantesMock: Estudiante[] = [
  { id: '1', nombre: 'Juan Pérez', matricula: '20230001', email: 'juan.perez@universidad.edu', telefono: '+51 999 111 222', estado: 'activo' },
  { id: '2', nombre: 'María López', matricula: '20230002', email: 'maria.lopez@universidad.edu', telefono: '+51 999 111 223', estado: 'activo' },
  { id: '3', nombre: 'Carlos Sánchez', matricula: '20230003', email: 'carlos.sanchez@universidad.edu', telefono: '+51 999 111 224', estado: 'activo' },
  { id: '4', nombre: 'Ana Rodríguez', matricula: '20230004', email: 'ana.rodriguez@universidad.edu', telefono: '+51 999 111 225', estado: 'inactivo' },
];

const gruposMock: Grupo[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `${i + 1}`,
  nombre: `Grupo ${String.fromCharCode(65 + i)} - Curso ${i + 1}`,
  curso: i % 2 === 0 ? 'Matemáticas' : 'Programación',
  codigo: `GRP-00${i + 1}`,
  instructor: 'Carlos Mendoza',
  estudiantes: 4,
  capacidad: 30,
  estado: i % 3 === 0 ? 'inactivo' : 'activo',
  horario: 'Lun/Mié/Vie 8:00-10:00',
  aula: 'Aula 301',
  fechaInicio: '15/01/2024',
  fechaFin: '15/06/2024',
  estudiantesLista: estudiantesMock
}));

export default function GruposPage() {
  const { canView } = usePermission();
  const canEdit = canView(['admin', 'teacher']);

  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [filteredGrupos, setFilteredGrupos] = useState<Grupo[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const itemsPerPage = 5;

  // ESTADOS PARA FORMULARIOS
  const [showGrupoForm, setShowGrupoForm] = useState(false);
  const [showEstudianteForm, setShowEstudianteForm] = useState(false);

  // ESTADOS PARA CAMBIO DE ESTADO (MODAL)
  const [showEstadoModal, setShowEstadoModal] = useState<{ open: boolean; type: 'grupo' | 'estudiante'; data: any }>({
    open: false,
    type: 'grupo',
    data: null
  });
  const [nuevoEstado, setNuevoEstado] = useState<string>('');

  useEffect(() => {
    setTimeout(() => {
      setGrupos(gruposMock);
      setFilteredGrupos(gruposMock);
      setIsLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    const filtered = grupos.filter(g =>
      g.nombre.toLowerCase().includes(search.toLowerCase()) ||
      g.codigo.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredGrupos(filtered);
    setCurrentPage(1); // Reiniciar a la primera página en cada búsqueda
  }, [search, grupos]);

  // Lógica de Paginación
  const totalPages = Math.ceil(filteredGrupos.length / itemsPerPage);
  const currentGrupos = filteredGrupos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleRow = (grupoId: string) => {
    setExpandedRows(prev => prev.includes(grupoId) ? prev.filter(id => id !== grupoId) : [...prev, grupoId]);
  };

  const getEstadoColor = (estado: string) => {
    return estado === 'activo' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200';
  };

  const manejarCambioEstado = () => {
    if (!showEstadoModal.data) return;

    if (showEstadoModal.type === 'grupo') {
      setGrupos(prev => prev.map(g => g.id === showEstadoModal.data.id ? { ...g, estado: nuevoEstado as any } : g));
    } else {
      const { grupoId, estudianteId } = showEstadoModal.data;
      setGrupos(prev => prev.map(g => {
        if (g.id === grupoId) {
          return {
            ...g,
            estudiantesLista: g.estudiantesLista.map(e => e.id === estudianteId ? { ...e, estado: nuevoEstado as any } : e)
          };
        }
        return g;
      }));
    }
    setShowEstadoModal({ open: false, type: 'grupo', data: null });
  };

  if (isLoading) return <div className="p-10 text-center animate-pulse text-gray-500">Cargando grupos...</div>;

  return (
    <div className="space-y-6 pb-10">
      {/* Header Responsivo */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Grupos</h1>
          <p className="text-sm text-gray-600">Administra tus clases y estudiantes matriculados</p>
        </div>
        {canEdit && (
          <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700" onClick={() => setShowGrupoForm(true)}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Nuevo Grupo
          </Button>
        )}
      </div>

      {/* Buscador */}
      <div className="relative w-full max-w-md">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </span>
        <Input className="pl-10" placeholder="Buscar por nombre o código..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Tabla Responsiva (Scroll horizontal en móviles) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Grupo</th>
                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Curso</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estudiantes</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentGrupos.map((grupo) => (
                <React.Fragment key={grupo.id}>
                  <tr className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => toggleRow(grupo.id)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <svg className={`w-4 h-4 mr-2 transition-transform ${expandedRows.includes(grupo.id) ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        <div>
                          <div className="text-sm font-bold text-gray-900">{grupo.nombre}</div>
                          <div className="text-xs text-gray-500">{grupo.codigo}</div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-600">{grupo.curso}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{grupo.estudiantes}/{grupo.capacidad}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowEstadoModal({ open: true, type: 'grupo', data: grupo }); setNuevoEstado(grupo.estado); }}
                        className={`px-3 py-1 text-[10px] font-bold rounded-full border ${getEstadoColor(grupo.estado)}`}
                      >
                        {grupo.estado.toUpperCase()} ✎
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800" onClick={() => setShowEstudianteForm(true)}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                      </Button>
                    </td>
                  </tr>
                  {expandedRows.includes(grupo.id) && (
                    <tr className="bg-gray-50/50">
                      <td colSpan={5} className="px-6 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {grupo.estudiantesLista.map(est => (
                            <div key={est.id} className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between items-center shadow-sm">
                              <div>
                                <div className="text-sm font-semibold">{est.nombre}</div>
                                <div className="text-[10px] text-gray-400">{est.matricula}</div>
                              </div>
                              <button 
                                onClick={() => { setShowEstadoModal({ open: true, type: 'estudiante', data: { grupoId: grupo.id, estudianteId: est.id } }); setNuevoEstado(est.estado); }}
                                className={`text-[9px] px-2 py-0.5 rounded-full border font-bold ${getEstadoColor(est.estado)}`}
                              >
                                {est.estado.toUpperCase()}
                              </button>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINACIÓN RESPONSIVA */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Anterior</Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Siguiente</Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> a <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredGrupos.length)}</span> de <span className="font-medium">{filteredGrupos.length}</span> resultados
              </p>
            </div>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 text-sm rounded-md border ${currentPage === i + 1 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RENDERIZADO DE FORMULARIOS INTEGRADOS */}
      {showGrupoForm && <GrupoForm onClose={() => setShowGrupoForm(false)} />}
      {showEstudianteForm && <EstudianteForm onClose={() => setShowEstudianteForm(false)} />}

      {/* MODAL PARA CAMBIO DE ESTADO */}
      {showEstadoModal.open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-xs animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Actualizar Estado</h3>
            <p className="text-xs text-gray-500 mb-4">Selecciona el nuevo estado para el registro.</p>
            <select 
              className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none mb-4"
              value={nuevoEstado}
              onChange={(e) => setNuevoEstado(e.target.value)}
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
            <div className="flex flex-col gap-2">
              <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={manejarCambioEstado}>Guardar cambios</Button>
              <Button variant="ghost" className="w-full text-gray-500" onClick={() => setShowEstadoModal({ open: false, type: 'grupo', data: null })}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}