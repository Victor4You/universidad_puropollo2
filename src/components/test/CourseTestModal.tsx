// components/CourseTestModal.tsx
'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';

// Íconos SVG
const XMarkIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const PlayIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DocumentIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const ClockIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

interface VideoItem {
  id: string;
  title: string;
  fileUrl: string;
  duration?: number;
  watched: boolean;
}

interface PDFItem {
  id: string;
  title: string;
  fileUrl: string;
  viewed: boolean;
}

interface Question {
  id: string;
  title: string;
  type: 'open' | 'closed';
  question: string;
  answer?: string;
  options?: string[];
  userAnswer?: string;
  isCorrect?: boolean;
}

interface CourseTestModalProps {
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
    duracionExamen?: number; // minutos
  };
}

export default function CourseTestModal({ isOpen, onClose, courseData }: CourseTestModalProps) {
  // Estados para el contenido del curso
  const [videos, setVideos] = useState<VideoItem[]>([
    {
      id: '1',
      title: 'Como tratar a un cliente enojado',
      fileUrl: 'https://api.ppollo.org/uploads/cursos/019962e9-a583-741d-968f-890747dc4434.mp4',
      duration: 180, // 3 minutos
      watched: false 
    },
    {
      id: '2',
      title: 'Ejemplo de Buena y Mala atención al cliente',
      fileUrl: 'https://api.ppollo.org/uploads/cursos/019962eb-7141-717b-b95a-8271d8da1566.mp4',
      duration: 240, // 4 minutos
      watched: false
    }
  ]);

  const [pdfs, setPdfs] = useState<PDFItem[]>([
    {
      id: '1',
      title: 'SERVICIOS DE VENTAS_PP (1)',
      fileUrl: 'https://api.ppollo.org/uploads/cursos/01968d05-284c-76ee-b042-2c602654e427.pdf',
      viewed: false
    },
    {
      id: '2',
      title: 'SERVICIO AL CLIENTE',
      fileUrl: 'https://api.ppollo.org/uploads/cursos/019972b8-1fc0-76be-ab69-033eba22f7d5.pdf',
      viewed: false
    }
  ]);

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      title: 'Pregunta #1',
      type: 'closed',
      question: '¿Qué es el servicio al cliente?',
      answer: 'c) Las acciones que tomamos antes, durante y después de la venta',
      options: [
        'a) Solo atender quejas',
        'b) Vender productos',
        'c) Las acciones que tomamos antes, durante y después de la venta',
        'd) Cobrar facturas'
      ]
    },
    {
      id: '2',
      title: 'Pregunta #2',
      type: 'open',
      question: 'Explica brevemente la importancia de la comunicación en el servicio al cliente.'
    },
    {
      id: '3',
      title: 'Pregunta #3',
      type: 'closed',
      question: '¿Cuál NO es una habilidad esencial para el servicio al cliente?',
      answer: 'd) Ser agresivo con los clientes difíciles',
      options: [
        'a) Empatía',
        'b) Comunicación efectiva',
        'c) Resolución de problemas',
        'd) Ser agresivo con los clientes difíciles'
      ]
    }
  ]);

  // Estados para la navegación
  const [currentStep, setCurrentStep] = useState<'content' | 'quiz' | 'results'>('content');
  const [currentVideo, setCurrentVideo] = useState<VideoItem | null>(null);
  const [currentPDF, setCurrentPDF] = useState<PDFItem | null>(null);
  const [quizTimeLeft, setQuizTimeLeft] = useState<number>(1800); // 30 minutos en segundos
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Temporizador para el cuestionario
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (currentStep === 'quiz' && quizTimeLeft > 0 && !quizSubmitted) {
      timer = setInterval(() => {
        setQuizTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [currentStep, quizTimeLeft, quizSubmitted]);

  // Funciones para manejar contenido
  const handleVideoClick = (video: VideoItem) => {
    setCurrentVideo(video);
    // Marcar como visto
    setVideos(prev => prev.map(v => 
      v.id === video.id ? { ...v, watched: true } : v
    ));
  };

  const handlePDFClick = (pdf: PDFItem) => {
    setCurrentPDF(pdf);
    // Marcar como visto
    setPdfs(prev => prev.map(p => 
      p.id === pdf.id ? { ...p, viewed: true } : p
    ));
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId ? { ...q, userAnswer: answer } : q
    ));
  };

  const handleStartQuiz = () => {
    const allContentWatched = videos.every(v => v.watched) && pdfs.every(p => p.viewed);
    
    if (!allContentWatched) {
      if (!confirm('Aún no has visto todo el contenido. ¿Deseas comenzar el cuestionario de todas formas?')) {
        return;
      }
    }
    
    setCurrentStep('quiz');
    setQuizTimeLeft(courseData.duracionExamen ? courseData.duracionExamen * 60 : 1800);
  };

  const handleSubmitQuiz = () => {
    if (quizSubmitted) return;
    
    let correctAnswers = 0;
    const updatedQuestions = questions.map(question => {
      let isCorrect = false;
      
      if (question.type === 'closed' && question.answer && question.userAnswer) {
        isCorrect = question.userAnswer.trim() === question.answer.trim();
        if (isCorrect) correctAnswers++;
      } else if (question.type === 'open') {
        // Para preguntas abiertas, consideramos cualquier respuesta válida
        isCorrect = !!question.userAnswer && question.userAnswer.trim().length > 0;
        if (isCorrect) correctAnswers++;
      }
      
      return { ...question, isCorrect };
    });
    
    setQuestions(updatedQuestions);
    setScore(Math.round((correctAnswers / questions.length) * 100));
    setQuizSubmitted(true);
    setCurrentStep('results');
  };

  const handleRetakeQuiz = () => {
    setQuestions(prev => prev.map(q => ({ 
      ...q, 
      userAnswer: undefined, 
      isCorrect: undefined 
    })));
    setQuizSubmitted(false);
    setScore(0);
    setCurrentStep('content');
  };

  // Calcular progreso
  const totalContent = videos.length + pdfs.length;
  const completedContent = 
    videos.filter(v => v.watched).length + 
    pdfs.filter(p => p.viewed).length;
  const progress = totalContent > 0 ? (completedContent / totalContent) * 100 : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
                      {courseData.nombre} - Prueba del Curso
                    </Dialog.Title>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm text-gray-500">{courseData.codigo} • {courseData.creditos} créditos</span>
                      <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        Profesor: {courseData.profesor}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <XMarkIcon />
                  </button>
                </div>

                {/* Barra de progreso */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Progreso del curso: {completedContent}/{totalContent}
                    </span>
                    <span className="text-sm font-medium text-blue-600">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Navegación entre pasos */}
                <div className="mb-8">
                  <nav className="flex space-x-4">
                    <button
                      onClick={() => setCurrentStep('content')}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        currentStep === 'content'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Contenido del Curso
                    </button>
                    <button
                      onClick={handleStartQuiz}
                      disabled={currentStep === 'quiz' || currentStep === 'results'}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        currentStep === 'quiz' || currentStep === 'results'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } ${currentStep === 'quiz' || currentStep === 'results' ? '' : 'disabled:opacity-50'}`}
                    >
                      Cuestionario
                    </button>
                    {quizSubmitted && (
                      <button
                        onClick={() => setCurrentStep('results')}
                        className={`px-4 py-2 rounded-lg font-medium ${
                          currentStep === 'results'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Resultados
                      </button>
                    )}
                  </nav>
                </div>

                {/* Contenido principal */}
                <div className="max-h-[60vh] overflow-y-auto pr-4">
                  {currentStep === 'content' && (
                    <div className="space-y-8">
                      {/* Videos */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900">Videos del Curso</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {videos.map((video) => (
                            <div 
                              key={video.id} 
                              className={`border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow ${
                                video.watched ? 'border-green-300 bg-green-50' : 'border-gray-200'
                              }`}
                              onClick={() => handleVideoClick(video)}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                  video.watched ? 'bg-green-100' : 'bg-blue-100'
                                }`}>
                                  {video.watched ? (
                                    <CheckIcon />
                                  ) : (
                                    <PlayIcon />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900">{video.title}</h5>
                                  <div className="flex items-center justify-between mt-2">
                                    <span className="text-sm text-gray-500">
                                      Duración: {video.duration ? Math.floor(video.duration / 60) : 0} min
                                    </span>
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                      video.watched 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {video.watched ? 'Visto' : 'Por ver'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Documentos PDF */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900">Documentos del Curso</h4>
                        <div className="space-y-3">
                          {pdfs.map((pdf) => (
                            <div 
                              key={pdf.id} 
                              className={`border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow ${
                                pdf.viewed ? 'border-green-300 bg-green-50' : 'border-gray-200'
                              }`}
                              onClick={() => handlePDFClick(pdf)}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                  pdf.viewed ? 'bg-green-100' : 'bg-blue-100'
                                }`}>
                                  <DocumentIcon />
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900">{pdf.title}</h5>
                                  <div className="flex items-center justify-between mt-1">
                                    <span className="text-sm text-gray-500">PDF Document</span>
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                      pdf.viewed 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {pdf.viewed ? 'Leído' : 'Por leer'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Botón para comenzar cuestionario */}
                      <div className="pt-6 border-t">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-gray-600">
                              {completedContent === totalContent 
                                ? '¡Has completado todo el contenido!'
                                : `Te faltan ${totalContent - completedContent} elementos por revisar.`
                              }
                            </p>
                          </div>
                          <button
                            onClick={handleStartQuiz}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          >
                            Comenzar Cuestionario
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cuestionario */}
                  {currentStep === 'quiz' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center gap-2">
                          <ClockIcon />
                          <span className="font-medium">Tiempo restante:</span>
                          <span className={`text-xl font-bold ${
                            quizTimeLeft < 300 ? 'text-red-600' : 'text-gray-900'
                          }`}>
                            {formatTime(quizTimeLeft)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">
                            {questions.filter(q => q.userAnswer).length} de {questions.length} respondidas
                          </span>
                        </div>
                      </div>

                      <div className="space-y-8">
                        {questions.map((question, index) => (
                          <div key={question.id} className="border border-gray-200 rounded-lg p-6 space-y-4">
                            <div className="flex items-center justify-between">
                              <h5 className="font-medium text-gray-900">
                                {question.title} ({question.type === 'closed' ? 'Opción múltiple' : 'Respuesta abierta'})
                              </h5>
                              {question.userAnswer && (
                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                  Respondida
                                </span>
                              )}
                            </div>

                            <div>
                              <p className="text-lg text-gray-900 mb-4">{question.question}</p>
                              
                              {question.type === 'closed' ? (
                                <div className="space-y-3">
                                  {question.options?.map((option, optIndex) => (
                                    <label 
                                      key={optIndex} 
                                      className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                                        question.userAnswer === option
                                          ? 'border-blue-500 bg-blue-50'
                                          : 'border-gray-200'
                                      }`}
                                    >
                                      <input
                                        type="radio"
                                        name={`question-${question.id}`}
                                        value={option}
                                        checked={question.userAnswer === option}
                                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                      />
                                      <span className="ml-3 text-gray-900">{option}</span>
                                    </label>
                                  ))}
                                </div>
                              ) : (
                                <div>
                                  <textarea
                                    value={question.userAnswer || ''}
                                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                    placeholder="Escribe tu respuesta aquí..."
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                  />
                                  <p className="text-sm text-gray-500 mt-2">
                                    Escribe una respuesta completa y detallada.
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-6 border-t">
                        <button
                          onClick={() => setCurrentStep('content')}
                          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Volver al Contenido
                        </button>
                        <button
                          onClick={handleSubmitQuiz}
                          disabled={questions.filter(q => q.userAnswer).length === 0}
                          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {quizTimeLeft > 0 ? 'Enviar Cuestionario' : 'Ver Resultados'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Resultados */}
                  {currentStep === 'results' && (
                    <div className="space-y-8">
                      <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-6">
                          <span className="text-4xl font-bold text-white">{score}%</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {score >= 70 ? '¡Felicidades!' : 'Necesitas mejorar'}
                        </h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                          {score >= 70 
                            ? 'Has aprobado el cuestionario del curso. ¡Excelente trabajo!'
                            : 'No has alcanzado la puntuación mínima. Revisa el contenido y vuelve a intentarlo.'
                          }
                        </p>
                      </div>

                      {/* Detalles de respuestas */}
                      <div className="space-y-6">
                        <h4 className="text-lg font-semibold text-gray-900">Detalle de tus respuestas</h4>
                        <div className="space-y-4">
                          {questions.map((question, index) => (
                            <div 
                              key={question.id} 
                              className={`border rounded-lg p-6 space-y-4 ${
                                question.isCorrect 
                                  ? 'border-green-200 bg-green-50' 
                                  : 'border-red-200 bg-red-50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    question.isCorrect 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {question.isCorrect ? '✓' : '✗'}
                                  </div>
                                  <h5 className="font-medium text-gray-900">Pregunta {index + 1}</h5>
                                </div>
                                <span className={`text-sm px-3 py-1 rounded-full ${
                                  question.isCorrect 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {question.isCorrect ? 'Correcta' : 'Incorrecta'}
                                </span>
                              </div>
                              
                              <div>
                                <p className="text-gray-900 mb-3">{question.question}</p>
                                
                                {question.type === 'closed' && (
                                  <div className="space-y-2">
                                    <div className="text-sm">
                                      <span className="font-medium text-gray-700">Tu respuesta: </span>
                                      <span className={question.isCorrect ? 'text-green-700' : 'text-red-700'}>
                                        {question.userAnswer || 'No respondida'}
                                      </span>
                                    </div>
                                    {!question.isCorrect && question.answer && (
                                      <div className="text-sm">
                                        <span className="font-medium text-gray-700">Respuesta correcta: </span>
                                        <span className="text-green-700">{question.answer}</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                                
                                {question.type === 'open' && (
                                  <div>
                                    <div className="text-sm font-medium text-gray-700 mb-1">Tu respuesta:</div>
                                    <div className="p-3 bg-white rounded border border-gray-300">
                                      {question.userAnswer || 'No respondida'}
                                    </div>
                                    {question.answer && (
                                      <div className="mt-3">
                                        <div className="text-sm font-medium text-gray-700 mb-1">Respuesta esperada:</div>
                                        <div className="p-3 bg-green-50 rounded border border-green-200">
                                          {question.answer}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Resumen estadístico */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-6 rounded-lg">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-2">
                              {questions.filter(q => q.isCorrect).length}/{questions.length}
                            </div>
                            <div className="text-sm text-gray-600">Respuestas correctas</div>
                          </div>
                        </div>
                        <div className="bg-green-50 p-6 rounded-lg">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-green-600 mb-2">{score}%</div>
                            <div className="text-sm text-gray-600">Puntuación final</div>
                          </div>
                        </div>
                        <div className="bg-purple-50 p-6 rounded-lg">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600 mb-2">
                              {formatTime((courseData.duracionExamen || 30) * 60 - quizTimeLeft)}
                            </div>
                            <div className="text-sm text-gray-600">Tiempo utilizado</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-center gap-4 pt-6 border-t">
                        <button
                          onClick={handleRetakeQuiz}
                          className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          Volver a Intentar
                        </button>
                        <button
                          onClick={() => setCurrentStep('content')}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Revisar Contenido
                        </button>
                        <button
                          onClick={onClose}
                          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Finalizar
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Reproductor de video modal */}
                {currentVideo && (
                  <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg w-full max-w-4xl">
                      <div className="p-4 border-b flex justify-between items-center">
                        <h3 className="text-lg font-semibold">{currentVideo.title}</h3>
                        <button
                          onClick={() => setCurrentVideo(null)}
                          className="p-2 hover:bg-gray-100 rounded-full"
                        >
                          <XMarkIcon />
                        </button>
                      </div>
                      <div className="p-4">
                        <div className="aspect-video bg-black rounded-lg overflow-hidden">
                          <video
                            controls
                            className="w-full h-full"
                            onEnded={() => setCurrentVideo(null)}
                          >
                            <source src={currentVideo.fileUrl} type="video/mp4" />
                            Tu navegador no soporta el elemento de video.
                          </video>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Visualizador de PDF modal */}
                {currentPDF && (
                  <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg w-full max-w-6xl h-[80vh] flex flex-col">
                      <div className="p-4 border-b flex justify-between items-center">
                        <h3 className="text-lg font-semibold">{currentPDF.title}</h3>
                        <button
                          onClick={() => setCurrentPDF(null)}
                          className="p-2 hover:bg-gray-100 rounded-full"
                        >
                          <XMarkIcon />
                        </button>
                      </div>
                      <div className="flex-1 p-4">
                        <iframe
                          src={`${currentPDF.fileUrl}#view=fitH`}
                          className="w-full h-full rounded-lg border"
                          title={currentPDF.title}
                        />
                        <div className="mt-4 text-center">
                          <a
                            href={currentPDF.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            <DocumentIcon />
                            Descargar PDF
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}