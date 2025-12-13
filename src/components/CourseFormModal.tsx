// components/CourseFormModal.tsx
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

const VideoCameraIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const DocumentIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

interface Period {
  startDate: string;
  endDate: string;
}

interface VideoItem {
  id: string;
  title: string;
  fileUrl: string;
  checked: boolean;
}

interface PDFItem {
  id: string;
  title: string;
  fileUrl: string;
  checked: boolean;
}

interface Question {
  id: string;
  title: string;
  type: 'open' | 'closed';
  question: string;
  answer?: string;
  options?: string[];
}

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseData?: {
    id: string;
    codigo: string;
    nombre: string;
    creditos: number;
    semestre: string;
    profesor: string;
    estado: 'activo' | 'inactivo' | 'pendiente';
    estudiantes: number;
  } | null;
}

export default function CourseFormModal({ isOpen, onClose, courseData }: CourseFormModalProps) {
  // Estado del formulario
  const [category, setCategory] = useState('OPERATIVO SUCURSAL');
  const [title, setTitle] = useState('TALLER ATENCION Y SERVICIO AL CLIENTE');
  const [description, setDescription] = useState('La atención y el servicio al cliente, dos pilares fundamentales e importantes para seguir el cumplimiento.');
  const [quizDuration, setQuizDuration] = useState('30');
  
  // Períodos
  const [periods, setPeriods] = useState<Period[]>([
    { startDate: '01/10/2025', endDate: '31/12/2025' },
    { startDate: '18/09/2025', endDate: '30/11/2025' }
  ]);
  
  // Videos
  const [videos, setVideos] = useState<VideoItem[]>([
    {
      id: '1',
      title: 'Como tratar a un cliente enojado',
      fileUrl: 'https://api.ppollo.org/uploads/cursos/019962e9-a583-741d-968f-890747dc4434.mp4',
      checked: false
    },
    {
      id: '2',
      title: 'Ejemplo de Buena y Mala atención al cliente',
      fileUrl: 'https://api.ppollo.org/uploads/cursos/019962eb-7141-717b-b95a-8271d8da1566.mp4',
      checked: false
    }
  ]);
  
  // PDFs
  const [pdfs, setPdfs] = useState<PDFItem[]>([
    {
      id: '1',
      title: 'SERVICIOS DE VENTAS_PP (1)',
      fileUrl: 'https://api.ppollo.org/uploads/cursos/01968d05-284c-76ee-b042-2c602654e427.pdf',
      checked: false
    },
    {
      id: '2',
      title: 'SERVICIO AL CLIENTE',
      fileUrl: 'https://api.ppollo.org/uploads/cursos/019972b8-1fc0-76be-ab69-033eba22f7d5.pdf',
      checked: false
    }
  ]);
  
  // Preguntas - Inicializamos con una pregunta vacía
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      title: 'Pregunta #1',
      type: 'closed',
      question: '',
      answer: '',
      options: []
    }
  ]);

  // Cargar datos del curso si existe
  useEffect(() => {
    if (courseData && isOpen) {
      setTitle(courseData.nombre);
    }
  }, [courseData, isOpen]);

  // Funciones para manejar el formulario
  const handleAddPeriod = () => {
    setPeriods([...periods, { startDate: '', endDate: '' }]);
  };

  const handleRemovePeriod = (index: number) => {
    setPeriods(periods.filter((_, i) => i !== index));
  };

  const handlePeriodChange = (index: number, field: keyof Period, value: string) => {
    const newPeriods = [...periods];
    newPeriods[index][field] = value;
    setPeriods(newPeriods);
  };

  const handleAddVideo = () => {
    setVideos([...videos, {
      id: Date.now().toString(),
      title: '',
      fileUrl: '',
      checked: false
    }]);
  };

  const handleRemoveVideo = (id: string) => {
    setVideos(videos.filter(video => video.id !== id));
  };

  const handleVideoChange = (id: string, field: keyof VideoItem, value: string | boolean) => {
    setVideos(videos.map(video => 
      video.id === id ? { ...video, [field]: value } : video
    ));
  };

  const handleAddPDF = () => {
    setPdfs([...pdfs, {
      id: Date.now().toString(),
      title: '',
      fileUrl: '',
      checked: false
    }]);
  };

  const handleRemovePDF = (id: string) => {
    setPdfs(pdfs.filter(pdf => pdf.id !== id));
  };

  const handlePDFChange = (id: string, field: keyof PDFItem, value: string | boolean) => {
    setPdfs(pdfs.map(pdf => 
      pdf.id === id ? { ...pdf, [field]: value } : pdf
    ));
  };

  const handleAddQuestion = () => {
    const newId = (questions.length + 1).toString();
    const newQuestion: Question = {
      id: newId,
      title: `Pregunta #${newId}`,
      type: 'closed',
      question: '',
      answer: '',
      options: []
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleRemoveQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(question => question.id !== id));
    }
  };

  const handleQuestionChange = (id: string, field: keyof Question, value: string | string[]) => {
    setQuestions(questions.map(question => 
      question.id === id ? { ...question, [field]: value } : question
    ));
  };

  const handleAddOption = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      const newOptions = [...(question.options || []), ''];
      handleQuestionChange(questionId, 'options', newOptions);
    }
  };

  const handleRemoveOption = (questionId: string, index: number) => {
    const question = questions.find(q => q.id === questionId);
    if (question && question.options) {
      const newOptions = question.options.filter((_, i) => i !== index);
      handleQuestionChange(questionId, 'options', newOptions);
    }
  };

  const handleOptionChange = (questionId: string, index: number, value: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question && question.options) {
      const newOptions = [...question.options];
      newOptions[index] = value;
      handleQuestionChange(questionId, 'options', newOptions);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      courseData,
      formData: {
        category,
        title,
        description,
        quizDuration,
        periods,
        videos,
        pdfs,
        questions
      }
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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <Dialog.Title as="h3" className="text-2xl font-bold text-gray-900">
                      {courseData ? `Editar Curso: ${courseData.codigo}` : 'Curso - Formulario'}
                    </Dialog.Title>
                    {courseData && (
                      <p className="text-sm text-gray-500 mt-1">
                        {courseData.nombre} • {courseData.creditos} créditos • {courseData.estado}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <XMarkIcon />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 max-h-[70vh] overflow-y-auto pr-4">
                  {/* Información básica */}
                  <div className="space-y-6">
                    <h4 className="text-lg font-semibold text-gray-900 border-b pb-2">
                      Información del Curso
                    </h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoría
                      </label>
                      <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div className="w-48">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duración del cuestionario (minutos)
                      </label>
                      <input
                        type="number"
                        value={quizDuration}
                        onChange={(e) => setQuizDuration(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Períodos */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-semibold text-gray-900">
                        Periodos
                      </h4>
                      <button
                        type="button"
                        onClick={handleAddPeriod}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <PlusIcon />
                        Agregar período
                      </button>
                    </div>

                    <div className="space-y-4">
                      {periods.map((period, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-lg">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Fecha inicio
                            </label>
                            <input
                              type="text"
                              value={period.startDate}
                              onChange={(e) => handlePeriodChange(index, 'startDate', e.target.value)}
                              placeholder="DD/MM/YYYY"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Fecha final
                            </label>
                            <input
                              type="text"
                              value={period.endDate}
                              onChange={(e) => handlePeriodChange(index, 'endDate', e.target.value)}
                              placeholder="DD/MM/YYYY"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                          </div>
                          {periods.length > 1 && (
                            <div className="col-span-2 flex justify-end">
                              <button
                                type="button"
                                onClick={() => handleRemovePeriod(index)}
                                className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                              >
                                <TrashIcon />
                                Eliminar período
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Videos */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-semibold text-gray-900">
                        Videos
                      </h4>
                      <button
                        type="button"
                        onClick={handleAddVideo}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <PlusIcon />
                        Agregar archivo
                      </button>
                    </div>

                    <div className="space-y-4">
                      {videos.map((video) => (
                        <div key={video.id} className="p-4 border border-gray-200 rounded-lg space-y-3">
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={video.checked}
                              onChange={(e) => handleVideoChange(video.id, 'checked', e.target.checked)}
                              className="mt-1"
                            />
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 flex-1">
                                  <VideoCameraIcon />
                                  <input
                                    type="text"
                                    value={video.title}
                                    onChange={(e) => handleVideoChange(video.id, 'title', e.target.value)}
                                    placeholder="Título del video"
                                    className="flex-1 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveVideo(video.id)}
                                  className="text-red-600 hover:text-red-800 ml-2"
                                >
                                  <TrashIcon />
                                </button>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Archivo
                                </label>
                                <input
                                  type="text"
                                  value={video.fileUrl}
                                  onChange={(e) => handleVideoChange(video.id, 'fileUrl', e.target.value)}
                                  placeholder="URL del video"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* PDFs */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-semibold text-gray-900">
                        PDFs
                      </h4>
                      <button
                        type="button"
                        onClick={handleAddPDF}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <PlusIcon />
                        Agregar archivo
                      </button>
                    </div>

                    <div className="space-y-4">
                      {pdfs.map((pdf) => (
                        <div key={pdf.id} className="p-4 border border-gray-200 rounded-lg space-y-3">
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={pdf.checked}
                              onChange={(e) => handlePDFChange(pdf.id, 'checked', e.target.checked)}
                              className="mt-1"
                            />
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 flex-1">
                                  <DocumentIcon />
                                  <input
                                    type="text"
                                    value={pdf.title}
                                    onChange={(e) => handlePDFChange(pdf.id, 'title', e.target.value)}
                                    placeholder="Título del PDF"
                                    className="flex-1 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemovePDF(pdf.id)}
                                  className="text-red-600 hover:text-red-800 ml-2"
                                >
                                  <TrashIcon />
                                </button>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Archivo
                                </label>
                                <input
                                  type="text"
                                  value={pdf.fileUrl}
                                  onChange={(e) => handlePDFChange(pdf.id, 'fileUrl', e.target.value)}
                                  placeholder="URL del PDF"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Preguntas */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-semibold text-gray-900">
                        Preguntas
                      </h4>
                      <button
                        type="button"
                        onClick={handleAddQuestion}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <PlusIcon />
                        Agregar pregunta
                      </button>
                    </div>

                    <div className="space-y-6">
                      {questions.map((question) => (
                        <div key={question.id} className="border border-gray-200 rounded-lg p-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium text-gray-900">{question.title}</h5>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Tipo de pregunta:</span>
                                <select
                                  value={question.type}
                                  onChange={(e) => handleQuestionChange(question.id, 'type', e.target.value as 'open' | 'closed')}
                                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                                >
                                  <option value="closed">Cerrada</option>
                                  <option value="open">Abierta</option>
                                </select>
                              </div>
                              {questions.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveQuestion(question.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <TrashIcon />
                                </button>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Pregunta
                            </label>
                            <input
                              type="text"
                              value={question.question}
                              onChange={(e) => handleQuestionChange(question.id, 'question', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                              placeholder="Escribe la pregunta aquí..."
                            />
                          </div>

                          {question.type === 'closed' && (
                            <>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Respuesta correcta
                                </label>
                                <input
                                  type="text"
                                  value={question.answer || ''}
                                  onChange={(e) => handleQuestionChange(question.id, 'answer', e.target.value)}
                                  placeholder="Ej: c) Las acciones que tomamos antes, durante y después..."
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                              </div>

                              <div>
                                <div className="flex justify-between items-center mb-2">
                                  <label className="block text-sm font-medium text-gray-700">
                                    Opciones
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => handleAddOption(question.id)}
                                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                                  >
                                    <PlusIcon />
                                    Agregar opción
                                  </button>
                                </div>
                                
                                <div className="space-y-2">
                                  {question.options?.map((option, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                      <span className="text-sm text-gray-500 w-6">
                                        {String.fromCharCode(97 + index)})
                                      </span>
                                      <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => handleOptionChange(question.id, index, e.target.value)}
                                        placeholder={`Opción ${index + 1}`}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                      />
                                      {(question.options?.length || 0) > 1 && (
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveOption(question.id, index)}
                                          className="text-red-600 hover:text-red-800"
                                        >
                                          <TrashIcon />
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Botón para agregar nueva pregunta - también al final */}
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={handleAddQuestion}
                        className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors"
                      >
                        <PlusIcon />
                        Agregar nueva pregunta
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
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {courseData ? 'Guardar Cambios' : 'Crear Curso'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}