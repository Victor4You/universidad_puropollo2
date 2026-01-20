// components/CourseFormModal.tsx
"use client";

import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";

// TUS ÍCONOS ORIGINALES
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
const TrashIcon = () => (
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
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

export default function CourseFormModal({
  isOpen,
  onClose,
  courseData,
  onSave,
}: any) {
  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [profesor, setProfesor] = useState("");
  const [creditos, setCreditos] = useState(0);
  const [semestre, setSemestre] = useState("");
  const [estado, setEstado] = useState("activo");
  const [duracion, setDuracion] = useState(30);
  const [fechaLimite, setFechaLimite] = useState("");
  const [createdAt, setCreatedAt] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [videos, setVideos] = useState<any[]>([]);
  const [pdfs, setPdfs] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (courseData) {
        setNombre(courseData.nombre || "");
        setCodigo(courseData.codigo || "");
        setProfesor(courseData.profesor || "");
        setCreditos(courseData.creditos || 0);
        setSemestre(courseData.semestre || "");
        setEstado(courseData.estado || "activo");
        setDuracion(courseData.duracionExamen || 30);

        // CORRECCIÓN: Formato exacto para datetime-local (YYYY-MM-DDTHH:mm)
        if (courseData.fechaLimite) {
          const date = new Date(courseData.fechaLimite);
          const formatted = date.toISOString().slice(0, 16);
          setFechaLimite(formatted);
        } else {
          setFechaLimite("");
        }

        if (courseData.createdAt) {
          setCreatedAt(
            new Date(courseData.createdAt).toISOString().split("T")[0]
          );
        }

        setVideos(Array.isArray(courseData.videos) ? courseData.videos : []);
        setPdfs(Array.isArray(courseData.pdfs) ? courseData.pdfs : []);
        setQuestions(
          Array.isArray(courseData.questions) ? courseData.questions : []
        );
      } else {
        setNombre("");
        setCodigo("");
        setProfesor("");
        setCreditos(0);
        setSemestre("");
        setEstado("activo");
        setDuracion(30);
        setFechaLimite("");
        setVideos([]);
        setPdfs([]);
        setQuestions([]);
      }
    }
  }, [courseData, isOpen]);

  const handleFileUpload = async (
    index: number,
    type: "video" | "pdf",
    fileRaw: File
  ) => {
    try {
      const formData = new FormData();
      formData.append("file", fileRaw);
      const res = await axios.post(
        "http://localhost:3001/v1/courses/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (type === "video") {
        const newVideos = [...videos];
        newVideos[index].fileUrl = res.data.url;
        setVideos(newVideos);
      } else {
        const newPdfs = [...pdfs];
        newPdfs[index].fileUrl = res.data.url;
        setPdfs(newPdfs);
      }
    } catch (error) {
      console.error("Error subiendo archivo", error);
    }
  };

  const handleUpdateQuestion = (id: string, field: string, value: any) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const handleUpdateOption = (qId: string, optIdx: number, value: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === qId) {
          const newOpts = [...q.options];
          newOpts[optIdx] = value;
          return { ...q, options: newOpts };
        }
        return q;
      })
    );
  };

  const addOption = (qId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === qId ? { ...q, options: [...q.options, ""] } : q
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      id: courseData?.id,
      nombre,
      codigo,
      profesor,
      creditos: Number(creditos),
      semestre,
      estado,
      duracionExamen: Number(duracion),
      fechaLimite,
      videos,
      pdfs,
      questions,
    };
    onSave(payload);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
              <div className="flex justify-between items-center mb-8 border-b pb-4">
                <Dialog.Title className="text-2xl font-black text-gray-800 uppercase tracking-tighter">
                  {courseData
                    ? "Configuración Integral del Curso"
                    : "Crear Nuevo Curso"}
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XMarkIcon />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-10 max-h-[75vh] overflow-y-auto pr-4 custom-scrollbar"
              >
                <div className="bg-gray-50 p-6 rounded-3xl space-y-6 border border-gray-100">
                  <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest">
                    1. Datos de la Tarjeta e Identificación
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Nombre del curso
                      </label>
                      <input
                        required
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-transparent focus:border-blue-500 rounded-xl outline-none font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Código
                      </label>
                      <input
                        required
                        type="text"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-transparent focus:border-blue-500 rounded-xl outline-none"
                        placeholder="EJ: MAT101"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Profesor
                      </label>
                      <input
                        type="text"
                        value={profesor}
                        onChange={(e) => setProfesor(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-transparent focus:border-blue-500 rounded-xl outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Créditos
                      </label>
                      <input
                        type="number"
                        value={creditos}
                        onChange={(e) => setCreditos(Number(e.target.value))}
                        className="w-full px-4 py-2 border-2 border-transparent focus:border-blue-500 rounded-xl outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Semestre
                      </label>
                      <input
                        type="text"
                        value={semestre}
                        onChange={(e) => setSemestre(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-transparent focus:border-blue-500 rounded-xl outline-none"
                        placeholder="2024-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Estado
                      </label>
                      <select
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-transparent focus:border-blue-500 rounded-xl outline-none bg-white font-bold"
                      >
                        <option value="activo">Activo (Verde)</option>
                        <option value="inactivo">Inactivo (Gris)</option>
                        <option value="pendiente">Pendiente (Naranja)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Tiempo Examen (Minutos)
                      </label>
                      <input
                        required
                        type="number"
                        value={duracion}
                        onChange={(e) => setDuracion(Number(e.target.value))}
                        className="w-full px-4 py-2 border-2 border-transparent focus:border-blue-500 rounded-xl outline-none font-bold"
                      />
                    </div>
                  </div>

                  {/* SECCIÓN DE FECHAS REORGANIZADA SEGÚN TU PETICIÓN */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                        Fecha de Creación
                      </label>
                      <input
                        type="date"
                        value={createdAt}
                        readOnly
                        className="w-full bg-gray-100 border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-500 cursor-not-allowed outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Fecha Límite para completar
                      </label>
                      <input
                        type="datetime-local"
                        value={fechaLimite}
                        onChange={(e) => setFechaLimite(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-blue-500 rounded-xl outline-none font-bold bg-white shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. CONTENIDO MULTIMEDIA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-black text-blue-600 text-xs uppercase tracking-widest">
                      2. Videos del Curso
                    </h4>
                    {videos.map((v, i) => (
                      <div
                        key={v.id}
                        className="p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 relative group space-y-2"
                      >
                        <input
                          value={v.title}
                          onChange={(e) => {
                            const n = [...videos];
                            n[i].title = e.target.value;
                            setVideos(n);
                          }}
                          placeholder="Título Video"
                          className="w-full bg-transparent font-bold text-sm outline-none"
                        />
                        <div className="flex gap-2 items-center">
                          <input
                            value={v.fileUrl}
                            onChange={(e) => {
                              const n = [...videos];
                              n[i].fileUrl = e.target.value;
                              setVideos(n);
                            }}
                            placeholder="URL .mp4"
                            className="flex-1 bg-white px-2 py-1 rounded text-xs text-blue-500 outline-none border"
                          />
                          <input
                            type="file"
                            id={`vid-${i}`}
                            className="hidden"
                            accept="video/*"
                            onChange={(e) =>
                              e.target.files?.[0] &&
                              handleFileUpload(i, "video", e.target.files[0])
                            }
                          />
                          <button
                            type="button"
                            onClick={() =>
                              document.getElementById(`vid-${i}`)?.click()
                            }
                            className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded-lg font-bold"
                          >
                            SUBIR
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setVideos(videos.filter((x) => x.id !== v.id))
                          }
                          className="absolute top-2 right-2 text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setVideos([
                          ...videos,
                          { id: Date.now().toString(), title: "", fileUrl: "" },
                        ])
                      }
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      + AÑADIR VIDEO
                    </button>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-black text-red-600 text-xs uppercase tracking-widest">
                      3. Documentos PDF
                    </h4>
                    {pdfs.map((p, i) => (
                      <div
                        key={p.id}
                        className="p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 relative group space-y-2"
                      >
                        <input
                          value={p.title}
                          onChange={(e) => {
                            const n = [...pdfs];
                            n[i].title = e.target.value;
                            setPdfs(n);
                          }}
                          placeholder="Título PDF"
                          className="w-full bg-transparent font-bold text-sm outline-none"
                        />
                        <div className="flex gap-2 items-center">
                          <input
                            value={p.fileUrl}
                            onChange={(e) => {
                              const n = [...pdfs];
                              n[i].fileUrl = e.target.value;
                              setPdfs(n);
                            }}
                            placeholder="URL .pdf"
                            className="flex-1 bg-white px-2 py-1 rounded text-xs text-red-500 outline-none border"
                          />
                          <input
                            type="file"
                            id={`pdf-${i}`}
                            className="hidden"
                            accept=".pdf"
                            onChange={(e) =>
                              e.target.files?.[0] &&
                              handleFileUpload(i, "pdf", e.target.files[0])
                            }
                          />
                          <button
                            type="button"
                            onClick={() =>
                              document.getElementById(`pdf-${i}`)?.click()
                            }
                            className="text-[10px] bg-red-600 text-white px-2 py-1 rounded-lg font-bold"
                          >
                            SUBIR
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setPdfs(pdfs.filter((x) => x.id !== p.id))
                          }
                          className="absolute top-2 right-2 text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setPdfs([
                          ...pdfs,
                          { id: Date.now().toString(), title: "", fileUrl: "" },
                        ])
                      }
                      className="text-xs font-bold text-red-600 hover:underline"
                    >
                      + AÑADIR PDF
                    </button>
                  </div>
                </div>

                {/* 4. EXAMEN */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b-2 border-gray-800 pb-2">
                    <h4 className="font-black text-gray-800 tracking-tighter text-xl">
                      4. CONTENIDO DEL EXAMEN
                    </h4>
                    <button
                      type="button"
                      onClick={() =>
                        setQuestions([
                          ...questions,
                          {
                            id: Date.now().toString(),
                            title: `Pregunta #${questions.length + 1}`,
                            type: "closed",
                            question: "",
                            options: [""],
                            answer: "",
                          },
                        ])
                      }
                      className="text-xs bg-black text-white px-4 py-2 rounded-full font-bold hover:scale-105 transition-transform"
                    >
                      + AÑADIR PREGUNTA
                    </button>
                  </div>

                  {questions.map((q) => (
                    <div
                      key={q.id}
                      className="p-6 border-2 border-gray-100 rounded-3xl space-y-4 relative group bg-gray-50/30"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black px-3 py-1 bg-gray-200 rounded-full">
                          {q.title}
                        </span>
                        <select
                          value={q.type}
                          onChange={(e) =>
                            handleUpdateQuestion(q.id, "type", e.target.value)
                          }
                          className="text-xs border-none font-bold bg-transparent text-blue-600 outline-none"
                        >
                          <option value="closed">Selección Múltiple</option>
                          <option value="open">Pregunta Abierta</option>
                        </select>
                      </div>
                      <input
                        value={q.question}
                        onChange={(e) =>
                          handleUpdateQuestion(q.id, "question", e.target.value)
                        }
                        placeholder="Enunciado de la pregunta"
                        className="w-full text-lg font-bold outline-none border-b-2 border-transparent focus:border-blue-500 transition-colors bg-transparent"
                      />
                      {q.type === "closed" && (
                        <div className="space-y-3 pt-2">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Opciones (Marca la correcta):
                          </p>
                          {q.options.map((opt: string, oIdx: number) => (
                            <div key={oIdx} className="flex items-center gap-3">
                              <input
                                type="radio"
                                name={`correct-${q.id}`}
                                checked={q.answer === opt && opt !== ""}
                                onChange={() =>
                                  handleUpdateQuestion(q.id, "answer", opt)
                                }
                                className="w-4 h-4 text-blue-600"
                              />
                              <input
                                value={opt}
                                onChange={(e) =>
                                  handleUpdateOption(q.id, oIdx, e.target.value)
                                }
                                placeholder={`Opción ${oIdx + 1}`}
                                className="flex-1 bg-white px-4 py-2 rounded-xl text-sm outline-none border-2 border-transparent focus:border-blue-200 transition-all shadow-sm"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateQuestion(
                                    q.id,
                                    "options",
                                    q.options.filter(
                                      (_: any, i: number) => i !== oIdx
                                    )
                                  )
                                }
                                className="text-gray-300 hover:text-red-500"
                              >
                                <TrashIcon />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addOption(q.id)}
                            className="text-xs font-bold text-blue-600 underline"
                          >
                            + Añadir opción
                          </button>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setQuestions(questions.filter((x) => x.id !== q.id))
                        }
                        className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-4 pt-8 border-t">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-8 py-3 font-bold text-gray-400 hover:text-gray-800 transition-colors"
                  >
                    DESCARTAR
                  </button>
                  <button
                    type="submit"
                    className="px-10 py-3 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-100 hover:scale-105 transition-all uppercase text-sm tracking-widest"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
