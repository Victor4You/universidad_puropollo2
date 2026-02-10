// src/app/(dashboard)/dashboard/gestion-cursos/page.tsx
"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api/axios";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Users,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  BookOpen,
  Star,
  Lock as LockIcon,
  CheckCircle,
} from "lucide-react";
import CourseFormModal from "@/components/CourseFormModal";
import CourseStudentsModal from "@/components/CourseStudentsModal";
import CourseTestModal from "@/components/test/CourseTestModal";
import { Loader } from "@/components/ui/Loader/Loader";
import { useAuth } from "@/hooks/useAuth";
import { usePermission } from "@/hooks/usePermission";

interface Curso {
  id: string;
  codigo: string;
  nombre: string;
  creditos: number;
  semestre: string;
  profesor: string;
  estado: "activo" | "inactivo";
  estudiantes: number;
  estudiantesInscritos?: any[];
  completado?: boolean;
  calificacion?: number;
  videos?: any[];
  pdfs?: any[];
  questions?: any[];
  duracionExamen?: number;
  fechaLimite?: string; // Se añade para dar soporte a la lógica de expiración existente
}

// Tus cursos Mock originales
const cursosMock: Curso[] = [
  {
    id: "1",
    codigo: "ASC-001",
    nombre: "TALLER ATENCION Y SERVICIO AL CLIENTE",
    creditos: 4,
    semestre: "2024-I",
    profesor: "Carlos Mendoza",
    estado: "activo",
    estudiantes: 45,
    completado: false,
  },
  {
    id: "2",
    codigo: "BPM-002",
    nombre: "INDUCCIÓN A LAS BUENAS PRACTICAS DE MANUFACTURA",
    creditos: 5,
    semestre: "2024-I",
    profesor: "Ana López",
    estado: "activo",
    estudiantes: 38,
    completado: false,
  },
];

export default function GestionCursosPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { isRole } = usePermission();

  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    if (!authLoading && user) {
      loadData();
    }
  }, [user, authLoading]);

  // NUEVA FUNCIÓN: Sincronizar con PostgreSQL
  const loadPostgresProgress = async () => {
    try {
      setLoading(true);
      const savedCursos = localStorage.getItem("lista_cursos_universidad");
      const baseCursos: Curso[] = savedCursos
        ? JSON.parse(savedCursos)
        : cursosMock;

      if (user?.id) {
        // CAMBIO: Se usa 'api' y ruta relativa
        const response = await api.get(
          `/courses/user-progress?userId=${user.id}`,
        );
        const completadosIds = response.data;

        const actualizados = baseCursos.map((c) => ({
          ...c,
          completado: completadosIds.includes(c.id),
        }));
        setCursos(actualizados);
      } else {
        setCursos(baseCursos);
      }
    } catch (error) {
      console.error("Error cargando progreso:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    if (authLoading || !user) return;
    setLoading(true);
    try {
      const isAdminOProfesor = isRole("admin") || isRole("teacher");

      // CAMBIO: Rutas relativas
      const url = isAdminOProfesor
        ? `/courses`
        : `/courses/enrolled/${user.id}`;

      const res = await api.get(url);
      let cursosBase = res.data;

      if (!isAdminOProfesor && user?.id) {
        try {
          const progRes = await api.get(
            `/courses/user-progress?userId=${user.id}`,
          );
          const completadosIds = Array.isArray(progRes.data)
            ? progRes.data.map((id: any) => String(id))
            : [];

          cursosBase = cursosBase.map((c: any) => ({
            ...c,
            completado: completadosIds.includes(String(c.id)),
          }));
        } catch (e) {
          console.error("Error al traer progreso");
        }
      }
      setCursos(cursosBase);
    } catch (e) {
      console.error("Error de conexión:", e);
      setCursos(cursosMock);
    } finally {
      setLoading(false);
    }
  };

  // EL RESTO DE TUS FUNCIONES ORIGINALES (SIN CAMBIOS)
  const handleSaveCourse = async (courseFormData: any) => {
    // 1. Construimos el payload incluyendo el campo 'secciones' y el 'tipo'
    const payload = {
      codigo: courseFormData.codigo,
      nombre: courseFormData.nombre,
      profesor: courseFormData.profesor,
      creditos: Number(courseFormData.creditos),
      semestre: courseFormData.semestre,
      estado: courseFormData.estado,
      tipo: courseFormData.tipo, // Importante para saber si es estándar o especializado
      fechaLimite: courseFormData.fechaLimite,
      videos: courseFormData.videos,
      pdfs: courseFormData.pdfs,
      questions: courseFormData.questions,
      secciones: courseFormData.secciones || [],
      duracionExamen: Number(courseFormData.duracionExamen),
    };

    try {
      if (selectedCurso) {
        await api.patch(`/courses/${selectedCurso.id}`, payload);
      } else {
        await api.post(`/courses`, payload);
      }
      // IMPORTANTE: Refrescar datos después de guardar
      await loadData();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error en Vercel:", error);
      alert("Error al guardar: Verifica la conexión con la base de datos.");
    }
  };
  const handleUpdateCourseData = (updatedCourse: Curso) => {
    const nuevosCursos = cursos.map((c) =>
      c.id === updatedCourse.id ? updatedCourse : c,
    );
    setCursos(nuevosCursos);
    localStorage.setItem(
      "lista_cursos_universidad",
      JSON.stringify(nuevosCursos),
    );
  };

  const handleDeleteCourse = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este curso?")) {
      try {
        // CAMBIO: api.delete y ruta relativa
        await api.delete(`/courses/${id}`);

        // Actualizar estado local solo si se borró en el back
        const nuevosCursos = cursos.filter((c) => c.id !== id);
        setCursos(nuevosCursos);

        localStorage.setItem(
          "lista_cursos_universidad",
          JSON.stringify(nuevosCursos),
        );
      } catch (error) {
        console.error("Error al eliminar el curso:", error);
        alert("No se pudo eliminar el curso del servidor.");
      }
    }
  };

  const esAdminOProfesor = isRole("admin") || isRole("teacher");
  const filteredCursos = cursos.filter(
    (curso) =>
      curso.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      curso.codigo.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const currentItems = filteredCursos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const totalPages = Math.ceil(filteredCursos.length / itemsPerPage);

  if (authLoading || loading)
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader />
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Cursos
          </h1>
          <p className="text-gray-500">
            Administra y supervisa los cursos de la plataforma
          </p>
        </div>
        {esAdminOProfesor && (
          <button
            onClick={() => {
              setSelectedCurso(null);
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5 mr-2" /> Nuevo Curso
          </button>
        )}
      </div>

      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar curso..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {currentItems.map((curso, index) => {
          // TU LÓGICA DE CANDADOS ORIGINAL
          const ahora = new Date();
          const fechaLimiteObj = curso.fechaLimite
            ? new Date(curso.fechaLimite)
            : null;
          const estaExpirado = fechaLimiteObj ? ahora > fechaLimiteObj : false;
          const cursoAnteriorCompletado =
            index === 0 || currentItems[index - 1].completado;
          const estaHabilitado =
            esAdminOProfesor || (cursoAnteriorCompletado && !estaExpirado);

          return (
            <div
              key={curso.id}
              className={`bg-white rounded-2xl border border-gray-100 shadow-sm transition-all flex flex-col overflow-hidden relative ${!estaHabilitado ? "opacity-60 grayscale" : "hover:shadow-md"}`}
            >
              {!estaHabilitado && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/10 backdrop-blur-[1px]">
                  <LockIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}

              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-1 rounded">
                    {curso.codigo}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${curso.estado === "activo" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                  >
                    {curso.estado}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">
                  {curso.nombre}
                </h3>
                <p className="text-gray-500 text-sm mb-4 flex items-center">
                  <Users className="w-4 h-4 mr-1.5" /> {curso.profesor}
                </p>
                <div className="flex items-center gap-3">
                  <div className="text-[11px] font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100 uppercase">
                    {curso.creditos} CRÉDITOS
                  </div>
                  <div
                    className={estaExpirado ? "text-red-600" : "text-gray-500"}
                  >
                    {estaExpirado
                      ? "EXPIRADO"
                      : `LÍMITE: ${
                          curso.fechaLimite
                            ? new Date(curso.fechaLimite).toLocaleDateString()
                            : "SIN FECHA"
                        }`}
                  </div>
                  <div className="flex items-center text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100 uppercase">
                    <Users className="w-3 h-3 mr-1" />
                    {curso.estudiantes || 0} Registrados
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
                <div className="flex space-x-1">
                  <button
                    onClick={() => {
                      if (estaHabilitado && !curso.completado) {
                        setSelectedCurso(curso);
                        setShowTestModal(true);
                      } else if (curso.completado && !esAdminOProfesor) {
                        alert("Ya has completado este curso.");
                      }
                    }}
                    className={`p-2 rounded-lg transition-colors ${curso.completado ? "text-green-600 bg-green-50" : estaHabilitado ? "text-purple-600 hover:bg-purple-100" : "text-gray-400 cursor-not-allowed"}`}
                  >
                    <BookOpen className="w-5 h-5" />{" "}
                  </button>
                  {esAdminOProfesor && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedCurso(curso);
                          setShowStudentsModal(true);
                        }}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                      >
                        <Users className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCurso(curso);
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(curso.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
                {curso.completado && (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mb-10">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-2 rounded-lg border hover:bg-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-2 rounded-lg border hover:bg-white"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {isModalOpen && (
        <CourseFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCurso(null);
          }}
          courseData={selectedCurso}
          onSave={handleSaveCourse}
        />
      )}
      {showStudentsModal && selectedCurso && (
        <CourseStudentsModal
          isOpen={showStudentsModal}
          onClose={() => {
            setShowStudentsModal(false);
            setSelectedCurso(null);
          }}
          courseData={selectedCurso}
          onUpdateCourse={loadData} // CAMBIA handleUpdateCourseData por loadData
        />
      )}
      {showTestModal && selectedCurso && (
        <CourseTestModal
          isOpen={showTestModal}
          onClose={() => {
            setShowTestModal(false);
            setSelectedCurso(null);
          }}
          courseData={selectedCurso}
          onSuccess={() => loadPostgresProgress()} // Sincroniza al terminar
        />
      )}
    </div>
  );
}
