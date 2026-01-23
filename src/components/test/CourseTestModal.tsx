// src/components/test/CourseTestModal.tsx
"use client";

import { Fragment, useState, useEffect, useCallback, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";

// ICONOS (Mantenidos igual para no alterar diseño)
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
const PlayIcon = () => (
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
      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const DocumentIcon = () => (
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
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);
const ClockIcon = () => (
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
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const Star = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.05 9.401c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  </svg>
);

export default function CourseTestModal({
  isOpen,
  onClose,
  onSuccess,
  courseData,
}: any) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<
    "content" | "quiz" | "survey" | "results"
  >("content");
  const [surveyData, setSurveyData] = useState<Record<string, number>>({
    ensenanza: 5,
    consistencia: 5,
    riesgo: 5,
    contenido: 5,
  });
  const lastTimeReached = useRef(0);
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [currentPDF, setCurrentPDF] = useState<any>(null);
  const [attempts, setAttempts] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState<any[]>([]);
  const [quizTimeLeft, setQuizTimeLeft] = useState<number>(1800);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [pdfScrollReached, setPdfScrollReached] = useState(false);
  const [viewedVideos, setViewedVideos] = useState<Set<string>>(new Set());
  const [viewedPdfs, setViewedPdfs] = useState<Set<string>>(new Set());

  const totalVideos = courseData?.videos?.length || 0;
  const totalPdfs = courseData?.pdfs?.length || 0;
  const allWatched =
    (totalVideos === 0 || viewedVideos.size === totalVideos) &&
    (totalPdfs === 0 || viewedPdfs.size === totalPdfs);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep("content");
      setScore(0);
      setUserAnswers({});
      setViewedVideos(new Set());
      setViewedPdfs(new Set());
      setSurveyData({ ensenanza: 5, consistencia: 5, riesgo: 5, contenido: 5 });
      const questions = courseData?.questions || [];
      setShuffledQuestions([...questions].sort(() => Math.random() - 0.5));
      setQuizTimeLeft((courseData?.duracionExamen || 30) * 60);
      setAttempts(0);
    }
  }, [isOpen, courseData]);

  const handleFinishExam = useCallback(async () => {
    const questions = shuffledQuestions;
    let correctas = 0;
    questions.forEach((q: any) => {
      if (userAnswers[q.id] === q.answer) correctas++;
    });
    const notaFinal =
      questions.length > 0
        ? Math.round((correctas / questions.length) * 100)
        : 100;
    setScore(notaFinal);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/courses/register-completion`,
        {
          courseId: courseData.id,
          userId: Number(user?.id),
          score: notaFinal,
        },
      );
    } catch (error) {
      console.error("Error al registrar intento:", error);
    }

    if (notaFinal >= 90) {
      setCurrentStep("survey");
    } else {
      const nuevosIntentos = attempts + 1;
      setAttempts(nuevosIntentos);
      if (nuevosIntentos >= 2) {
        alert("❌ Has fallado 2 intentos. Tu progreso ha sido reiniciado.");
        setViewedVideos(new Set());
        setViewedPdfs(new Set());
        setAttempts(0);
        setCurrentStep("content");
      } else {
        setCurrentStep("results");
      }
    }
  }, [shuffledQuestions, userAnswers, attempts, courseData, user]);

  const handleSaveToPostgres = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/courses/register-completion`,
        {
          courseId: courseData.id,
          userId: Number(user?.id),
          score: score,
          survey: surveyData,
        },
      );
      setCurrentStep("results");
      if (onSuccess) onSuccess(100);
    } catch (error) {
      alert("Error al guardar en la base de datos");
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentStep === "quiz" && quizTimeLeft > 0) {
      timer = setInterval(() => {
        setQuizTimeLeft((prev) => {
          if (prev <= 1) {
            handleFinishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentStep, quizTimeLeft, handleFinishExam]);

  const handleOptionSelect = (qId: string, option: string) => {
    setUserAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const isComplete =
    shuffledQuestions.length > 0 &&
    shuffledQuestions.every((q: any) => userAnswers[q.id]);
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePDFScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight * 0.98) {
      if (!pdfScrollReached) setPdfScrollReached(true);
    }
  };

  const markPDFAsRead = () => {
    if (currentPDF && pdfScrollReached) {
      setViewedPdfs((prev) => new Set(prev).add(currentPDF.id));
      setCurrentPDF(null);
      setPdfScrollReached(false);
    }
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
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
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
              <Dialog.Panel className="w-full max-w-6xl max-h-[90vh] transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all flex flex-col">
                <div className="flex justify-between items-center mb-6 border-b pb-4 flex-shrink-0">
                  <div>
                    <Dialog.Title className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
                      {courseData?.nombre}
                    </Dialog.Title>
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">
                      Material de estudio y evaluación
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <XMarkIcon />
                  </button>
                </div>

                <div className="flex space-x-4 mb-8 flex-shrink-0">
                  <button
                    onClick={() => setCurrentStep("content")}
                    className={`px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${currentStep === "content" ? "bg-black text-white shadow-lg" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}
                  >
                    CONTENIDO
                  </button>
                  <button
                    onClick={() => allWatched && setCurrentStep("quiz")}
                    disabled={!allWatched}
                    className={`px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${currentStep === "quiz" ? "bg-green-600 text-white shadow-lg" : allWatched ? "bg-gray-100 text-black hover:bg-gray-200" : "bg-gray-50 text-gray-300 cursor-not-allowed shadow-inner"}`}
                  >
                    CUESTIONARIO {!allWatched ? "🔒" : "✅"}
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                  {currentStep === "content" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-4">
                      <div className="space-y-4">
                        <h4 className="font-black text-blue-600 text-xs uppercase tracking-widest">
                          Videos ({viewedVideos.size}/{totalVideos})
                        </h4>
                        {courseData?.videos?.map((video: any) => (
                          <button
                            key={video.id}
                            onClick={() => {
                              setCurrentVideo(video);
                              lastTimeReached.current = 0;
                            }}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${viewedVideos.has(video.id) ? "bg-green-50 border-green-200" : "bg-gray-50 border-transparent hover:border-blue-200"}`}
                          >
                            <div
                              className={`p-2 rounded-lg ${viewedVideos.has(video.id) ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"}`}
                            >
                              <PlayIcon />
                            </div>
                            <span className="font-bold text-sm">
                              {video.title}
                            </span>
                            {viewedVideos.has(video.id) && (
                              <span className="ml-auto text-[10px] font-black text-green-600 uppercase">
                                Visto
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-black text-red-600 text-xs uppercase tracking-widest">
                          PDFs ({viewedPdfs.size}/{totalPdfs})
                        </h4>
                        {courseData?.pdfs?.map((pdf: any) => (
                          <button
                            key={pdf.id}
                            onClick={() => {
                              setCurrentPDF(pdf);
                              setPdfScrollReached(false);
                            }}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${viewedPdfs.has(pdf.id) ? "bg-green-50 border-green-200" : "bg-gray-50 border-transparent hover:border-red-200"}`}
                          >
                            <div
                              className={`p-2 rounded-lg ${viewedPdfs.has(pdf.id) ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                            >
                              <DocumentIcon />
                            </div>
                            <span className="font-bold text-sm">
                              {pdf.title}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentStep === "quiz" && (
                    <div className="space-y-8 pb-6">
                      <div className="flex justify-between items-center p-6 bg-black text-white rounded-3xl sticky top-0 z-10 shadow-lg">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Intento
                          </span>
                          <span className="text-xl font-black">
                            {attempts + 1} / 2
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <ClockIcon />
                          <span
                            className={`text-2xl font-black ${quizTimeLeft < 60 ? "text-red-500 animate-pulse" : ""}`}
                          >
                            {formatTime(quizTimeLeft)}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Mínimo para aprobar
                          </span>
                          <span className="text-xl font-black text-green-500">
                            90%
                          </span>
                        </div>
                      </div>
                      {shuffledQuestions.map((q: any, i: number) => (
                        <div
                          key={q.id}
                          className="p-8 border-2 border-gray-100 rounded-[2rem] bg-gray-50 space-y-6"
                        >
                          <p className="text-xl font-black text-gray-800 italic">
                            {i + 1}. {q.question}
                          </p>
                          <div className="grid grid-cols-1 gap-4">
                            {q.options?.map((opt: string, idx: number) => (
                              <label
                                key={idx}
                                className={`flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all ${userAnswers[q.id] === opt ? "bg-blue-600 border-blue-600 text-white shadow-lg" : "bg-white border-transparent hover:border-gray-200 text-gray-700"}`}
                              >
                                <input
                                  type="radio"
                                  className="hidden"
                                  checked={userAnswers[q.id] === opt}
                                  onChange={() => handleOptionSelect(q.id, opt)}
                                />
                                <span className="font-bold">{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={handleFinishExam}
                        disabled={!isComplete}
                        className={`w-full py-6 rounded-[2rem] font-black text-xl shadow-xl transition-all ${isComplete ? "bg-green-600 text-white hover:scale-[1.02]" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                      >
                        {isComplete
                          ? "ENVIAR PARA CALIFICACIÓN"
                          : "RESPONDE TODO PARA ENVIAR"}
                      </button>
                    </div>
                  )}

                  {currentStep === "survey" && (
                    <div className="space-y-8 py-6">
                      <h3 className="text-2xl font-black text-center uppercase text-black">
                        Encuesta de Calidad
                      </h3>
                      {["ensenanza", "consistencia", "riesgo", "contenido"].map(
                        (item) => (
                          <div
                            key={item}
                            className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl"
                          >
                            <span className="font-bold uppercase text-xs text-gray-600">
                              {item}
                            </span>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((starValue) => (
                                <button
                                  key={starValue}
                                  onClick={() =>
                                    setSurveyData({
                                      ...surveyData,
                                      [item]: starValue,
                                    })
                                  }
                                >
                                  <Star
                                    className={`w-6 h-6 ${surveyData[item] >= starValue ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                        ),
                      )}
                      <button
                        onClick={handleSaveToPostgres}
                        className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase shadow-lg"
                      >
                        GUARDAR Y FINALIZAR
                      </button>
                    </div>
                  )}

                  {currentStep === "results" && (
                    <div className="text-center py-10 space-y-8">
                      <div
                        className={`text-[8rem] font-black tracking-tighter leading-none ${score >= 90 ? "text-green-600" : "text-red-600"}`}
                      >
                        {score}%
                      </div>
                      <p className="text-2xl font-black uppercase italic">
                        {score >= 90 ? "¡Aprobado!" : "Aprobación Fallida"}
                      </p>
                      <div className="flex gap-4 justify-center">
                        {score < 90 && (
                          <button
                            onClick={() => {
                              setScore(0);
                              setUserAnswers({});
                              setCurrentStep("quiz");
                              setQuizTimeLeft(
                                (courseData?.duracionExamen || 30) * 60,
                              );
                            }}
                            className="px-10 py-4 bg-black text-white rounded-2xl font-black hover:scale-105 transition-all"
                          >
                            REINTENTAR AHORA
                          </button>
                        )}
                        <button
                          onClick={onClose}
                          className={`px-10 py-4 rounded-2xl font-black transition-all ${score >= 90 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"}`}
                        >
                          {score >= 90 ? "FINALIZAR" : "CERRAR"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* VISUALIZADOR DE VIDEO (OVERLAY) */}
                {currentVideo && (
                  <div className="fixed inset-0 bg-black/95 z-[70] flex items-center justify-center p-8">
                    <div className="w-full max-w-5xl aspect-video relative">
                      <button
                        onClick={() => setCurrentVideo(null)}
                        className="absolute -top-12 right-0 text-white flex items-center gap-2 font-black tracking-widest text-xs uppercase"
                      >
                        <XMarkIcon /> CERRAR VIDEO
                      </button>
                      <video
                        controls
                        autoPlay
                        controlsList="nodownload noplaybackrate"
                        className="w-full h-full rounded-3xl bg-black shadow-2xl"
                        onTimeUpdate={(e: any) => {
                          const v = e.target;
                          if (v.currentTime > lastTimeReached.current + 1.5)
                            v.currentTime = lastTimeReached.current;
                          else lastTimeReached.current = v.currentTime;
                        }}
                        onEnded={() =>
                          setViewedVideos((prev) =>
                            new Set(prev).add(currentVideo.id),
                          )
                        }
                      >
                        {currentVideo?.fileUrl && (
                          <source src={currentVideo.fileUrl} type="video/mp4" />
                        )}
                      </video>
                    </div>
                  </div>
                )}
                {/* VISUALIZADOR DE PDF - SOLUCIÓN DEFINITIVA */}
                {currentPDF && (
                  <div className="fixed inset-0 bg-black/95 z-[80] flex items-center justify-center p-2 md:p-6">
                    <div className="w-full max-w-6xl h-[95vh] flex flex-col overflow-hidden">
                      {/* Cabecera */}
                      <div className="flex justify-between items-center mb-3 text-white px-2">
                        <h3 className="font-black uppercase tracking-widest truncate max-w-[70%]">
                          {currentPDF.title}
                        </h3>
                        <button
                          onClick={() => {
                            setCurrentPDF(null);
                            setPdfScrollReached(false);
                          }}
                          className="flex items-center gap-2 font-black text-xs uppercase hover:text-red-500 transition-colors"
                        >
                          <XMarkIcon className="w-4 h-4" /> CERRAR LECTURA
                        </button>
                      </div>

                      {/* CONTENEDOR DE LECTURA: Eliminamos el overflow del padre para matar el doble scroll */}
                      <div className="flex-1 w-full bg-[#525659] rounded-xl overflow-hidden relative shadow-2xl">
                        {/* El PDF al 100% de su capacidad. Aquí el scroll es el nativo del visor gris. */}
                        <iframe
                          src={`${currentPDF.fileUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
                          className="w-full h-full border-none"
                          title={currentPDF.title}
                          onLoad={() => {
                            // Como no podemos detectar el scroll dentro del PDF por seguridad (CORS),
                            // usamos un pequeño truco: si el usuario hace scroll en el contenedor
                            // o pasa tiempo suficiente, habilitamos el botón.
                          }}
                        />

                        {/* CAPA DE VALIDACIÓN INVISIBLE: 
            Esta capa detecta el movimiento del mouse/touch al final del área.
        */}
                        <div
                          onMouseEnter={() => setPdfScrollReached(true)}
                          className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/20 to-transparent pointer-events-auto"
                          title="Pasa el mouse por aquí al terminar de leer"
                        />
                      </div>

                      {/* Footer de confirmación */}
                      <div className="mt-4 flex flex-col items-center gap-2">
                        {!pdfScrollReached && (
                          <span className="text-orange-400 font-black text-[10px] uppercase animate-pulse">
                            ⬇️ Lee todo el documento para habilitar la
                            confirmación
                          </span>
                        )}

                        <button
                          disabled={!pdfScrollReached}
                          onClick={markPDFAsRead}
                          className={`w-full max-w-md py-4 rounded-2xl font-black uppercase transition-all duration-300 ${
                            pdfScrollReached
                              ? "bg-green-600 text-white shadow-[0_0_20px_rgba(22,163,74,0.4)] scale-[1.02]"
                              : "bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5"
                          }`}
                        >
                          {pdfScrollReached
                            ? "CONFIRMAR LECTURA COMPLETADA"
                            : "LECTURA EN PROGRESO..."}
                        </button>
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
