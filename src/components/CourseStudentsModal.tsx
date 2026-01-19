"use client";
import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import axios from "axios";

const XMarkIcon = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
const UserIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);
const SearchIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

export default function CourseStudentsModal({
  isOpen,
  onClose,
  courseData,
  onUpdateCourse,
}: any) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [inscritos, setInscritos] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sucursalId, setSucursalId] = useState("");
  const [isSearchingSucursal, setIsSearchingSucursal] = useState(false);

  // CORRECCIÓN: Estado faltante para el botón de guardar
  const [loading, setLoading] = useState(false);

  const handleSeeStudentProfile = (studentUsername: string) => {
    onClose();
    router.push(`/profile/${studentUsername}`);
  };

  useEffect(() => {
    if (courseData?.estudiantesInscritos) {
      setInscritos(courseData.estudiantesInscritos);
    }
  }, [courseData]);

  useEffect(() => {
    const term = searchTerm.trim();
    if (term.length >= 1) {
      const timer = setTimeout(() => fetchUsers(term), 300);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  useEffect(() => {
    const cargarAsignados = async () => {
      // Validamos que el ID exista y no sea un string "undefined" accidental
      if (isOpen && courseData?.id && courseData.id !== "undefined") {
        try {
          const res = await axios.get(
            `http://localhost:3001/v1/courses/${courseData.id}/students`
          );
          if (res.data && Array.isArray(res.data)) {
            setInscritos(res.data);
          }
        } catch (error) {
          // Imprimimos el error completo para ver si es un problema de URL, puerto o CORS
          console.error("Error detallado en cargarAsignados:", error);

          if (axios.isAxiosError(error)) {
            console.log("Status:", error.response?.status);
            console.log("Config URL:", error.config?.url);
          }
        }
      }
    };
    cargarAsignados();
  }, [isOpen, courseData?.id]);

  const fetchUsers = async (query: string) => {
    if (!sucursalId) return;

    setIsSearching(true);
    try {
      // Enviamos el 'query' como parámetro 'q' al backend
      const response = await axios.get(
        `http://localhost:3001/v1/courses/users/sucursal/${sucursalId}?q=${query}`
      );

      if (response.data && Array.isArray(response.data)) {
        // Filtrar solo los que NO están inscritos ya
        const filtrados = response.data.filter(
          (user: any) =>
            !inscritos.some(
              (s) =>
                (s.username || "").toLowerCase() ===
                (user.usuario || user.username || "").toLowerCase()
            )
        );
        setSearchResults(filtrados);
      }
    } catch (error) {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleToggleInscripcion = (user: any) => {
    const userKey = user.usuario || user.username;
    const userId = user.id;

    // Verificamos por ID y por Username para estar 100% seguros
    const isAlreadyIn = inscritos.some(
      (s) => s.username === userKey || s.id === userId
    );

    if (isAlreadyIn) {
      // Si ya existe, lo quitamos de la lista actual
      setInscritos((prev) => prev.filter((s) => s.id !== userId));
    } else {
      // Si no existe, lo agregamos
      const newStudent = {
        id: userId,
        name: user.name || `${user.nombre} ${user.apellido}`,
        username: userKey,
        role: user.role || "estudiante",
      };
      setInscritos((prev) => [...prev, newStudent]);
      setSearchTerm("");
      setSearchResults([]);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true); // Ahora este estado sí existe
      if (courseData?.id) {
        // 1. Guardar en Postgres la lista de IDs seleccionados
        await axios.post(
          `http://localhost:3001/v1/courses/${courseData.id}/students`,
          { userIds: inscritos.map((s) => s.id) }
        );

        // 2. Refrescar la página principal (GestionCursosPage)
        // Esto ejecuta loadData() en el padre y actualiza el contador de la tarjeta
        if (onUpdateCourse) {
          await onUpdateCourse();
        }
      }
      onClose();
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al sincronizar con la base de datos");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchBySucursal = async () => {
    if (!sucursalId) return;
    setIsSearchingSucursal(true);

    try {
      // Se agrega el parámetro q vacío para compatibilidad con la nueva lógica del service
      const res = await axios.get(
        `http://localhost:3001/v1/courses/users/sucursal/${sucursalId}?q=`
      );

      // Quitamos el else que lanzaba el alert "La API no permite..."
      if (res.data && Array.isArray(res.data)) {
        const filtrados = res.data.filter((user: any) => {
          const uKey = (user.usuario || user.username || "").toLowerCase();
          return !inscritos.some(
            (s) => (s.username || "").toLowerCase() === uKey
          );
        });
        setSearchResults(filtrados);
      }
    } catch (error) {
      console.error("Error al buscar:", error);
      setSearchResults([]);
    } finally {
      setIsSearchingSucursal(false);
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="relative transform overflow-hidden rounded-[2.5rem] bg-white px-8 pb-8 pt-6 text-left shadow-2xl transition-all sm:w-full sm:max-w-lg">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">
                    Gestión de Alumnos
                  </h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    {courseData?.nombre}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon />
                </button>
              </div>

              {/* CONTENEDOR DE BUSCADORES */}
              <div className="flex gap-2 mb-6">
                {/* BUSCADOR POR SUCURSAL */}
                <div className="relative w-1/3">
                  <input
                    type="number"
                    placeholder="ID SUC."
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl py-3 pl-4 pr-10 text-xs font-bold outline-none transition-all uppercase"
                    value={sucursalId}
                    onChange={(e) => setSucursalId(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleSearchBySucursal()
                    }
                  />
                  <button
                    onClick={handleSearchBySucursal}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 hover:scale-110 transition-transform"
                  >
                    {isSearchingSucursal ? (
                      <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                    ) : (
                      <SearchIcon />
                    )}
                  </button>
                </div>

                {/* BUSCADOR POR NOMBRE (TU INPUT ORIGINAL) */}
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-4 flex items-center text-gray-400">
                    {isSearching ? (
                      <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                    ) : (
                      <SearchIcon />
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="BUSCAR POR NOMBRE..."
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl py-3 pl-12 pr-4 text-xs font-bold outline-none transition-all uppercase"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />

                  {/* DROPDOWN DE RESULTADOS (Se mantiene igual) */}
                  {searchResults.length > 0 && (
                    <div className="absolute z-20 w-full mt-2 bg-white border-2 border-blue-600 rounded-2xl shadow-xl overflow-hidden max-h-52 overflow-y-auto">
                      {searchResults.map((user) => (
                        <button
                          key={user.usuario || user.username}
                          onClick={() => handleToggleInscripcion(user)}
                          className="w-full flex items-center justify-between p-4 hover:bg-blue-50 transition-colors border-b last:border-none text-left"
                        >
                          <div>
                            <p className="font-bold text-gray-900 text-sm">
                              {user.nombre} {user.apellido}
                            </p>
                            <p className="text-[10px] text-blue-600 font-black">
                              @{user.usuario} • {user.sucursalNombre}
                            </p>
                          </div>
                          <span className="text-blue-600 font-black text-[10px] uppercase">
                            + Inscribir
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">
                  Lista Actual ({inscritos.length})
                </h4>
                <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {inscritos.length > 0 ? (
                    inscritos.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-[1.5rem] border-2 border-transparent hover:border-blue-50 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <UserIcon />
                          </div>
                          <div>
                            <button
                              onClick={() =>
                                handleSeeStudentProfile(student.username)
                              }
                              className="font-bold text-gray-900 text-sm hover:text-blue-600 transition-colors block text-left"
                            >
                              {student.name}
                            </button>
                            <div className="text-[10px] text-gray-500 uppercase font-black">
                              @{student.username}
                            </div>
                          </div>
                        </div>
                        {/* BOTÓN CORREGIDO PARA AXE-LINTER */}
                        <button
                          onClick={() => handleToggleInscripcion(student)}
                          aria-label={`Desinscribir a ${student.name}`}
                          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-green-600"
                        >
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center border-2 border-dashed border-gray-100 rounded-[2rem]">
                      <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                        Busca alumnos para el curso
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
                <button
                  onClick={onClose}
                  className="px-6 py-2 text-gray-400 font-black uppercase text-[10px] tracking-widest hover:text-gray-800 transition-colors"
                >
                  Descartar
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-8 py-3 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all uppercase text-[10px] tracking-widest"
                >
                  {loading ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
