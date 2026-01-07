// components/test/CourseTestModal.tsx
'use client';

import { Fragment, useState, useEffect, useCallback } from 'react';
import { Dialog, Transition } from '@headlessui/react';

// TUS ÍCONOS ORIGINALES
const XMarkIcon = () => (<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>);
const PlayIcon = () => (<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const DocumentIcon = () => (<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>);
const ClockIcon = () => (<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);

export default function CourseTestModal({ isOpen, onClose, onSuccess, courseData }: any) {
  const [currentStep, setCurrentStep] = useState<'content' | 'quiz' | 'results'>('content');
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [currentPDF, setCurrentPDF] = useState<any>(null);
  const [quizTimeLeft, setQuizTimeLeft] = useState<number>(1800);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});

  const [viewedVideos, setViewedVideos] = useState<Set<string>>(new Set());
  const [viewedPdfs, setViewedPdfs] = useState<Set<string>>(new Set());

  const totalVideos = courseData?.videos?.length || 0;
  const totalPdfs = courseData?.pdfs?.length || 0;
  
  // Mejora: Si no hay contenido, se considera "visto" para no bloquear el quiz
  const allWatched = (totalVideos === 0 || viewedVideos.size === totalVideos) && 
                     (totalPdfs === 0 || viewedPdfs.size === totalPdfs);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep('content');
      setScore(0);
      setUserAnswers({});
      setViewedVideos(new Set());
      setViewedPdfs(new Set());
      const tiempoMinutos = courseData?.duracionExamen || 30;
      setQuizTimeLeft(tiempoMinutos * 60);
    }
  }, [isOpen, courseData]);

  const handleFinishExam = useCallback(() => {
    const questions = courseData?.questions || [];
    if (questions.length === 0) {
      setScore(100);
      setCurrentStep('results');
      if (onSuccess) onSuccess(100);
      return;
    }

    let correctas = 0;
    questions.forEach((q: any) => {
      if (userAnswers[q.id] === q.answer) {
        correctas++;
      }
    });

    const notaFinal = Math.round((correctas / questions.length) * 100);
    setScore(notaFinal);
    setCurrentStep('results');
    
    if (onSuccess && notaFinal === 100) onSuccess(notaFinal);
  }, [courseData, userAnswers, onSuccess]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentStep === 'quiz' && quizTimeLeft > 0) {
      timer = setInterval(() => {
        setQuizTimeLeft(prev => {
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
    setUserAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const isComplete = courseData?.questions?.every((q: any) => userAnswers[q.id]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
              
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div>
                  <Dialog.Title className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
                    {courseData?.nombre}
                  </Dialog.Title>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">Material de estudio y evaluación</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><XMarkIcon /></button>
              </div>

              <div className="flex space-x-4 mb-8">
                <button onClick={() => setCurrentStep('content')} className={`px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${currentStep === 'content' ? 'bg-black text-white shadow-lg' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>CONTENIDO</button>
                <button 
                  onClick={() => allWatched && setCurrentStep('quiz')} 
                  disabled={!allWatched} 
                  className={`px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                    currentStep === 'quiz' ? 'bg-green-600 text-white shadow-lg' : 
                    allWatched ? 'bg-gray-100 text-black hover:bg-gray-200' : 'bg-gray-50 text-gray-300 cursor-not-allowed shadow-inner'
                  }`}
                >
                  CUESTIONARIO {!allWatched ? '🔒' : '✅'}
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                {currentStep === 'content' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="font-black text-blue-600 text-xs uppercase tracking-widest">Videos ({viewedVideos.size}/{totalVideos})</h4>
                      {courseData?.videos?.map((video: any) => (
                        <button key={video.id} onClick={() => { setCurrentVideo(video); setViewedVideos(prev => new Set(prev).add(video.id)); }} className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${viewedVideos.has(video.id) ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-transparent hover:border-blue-200'}`}>
                          <div className={`p-2 rounded-lg ${viewedVideos.has(video.id) ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}><PlayIcon /></div>
                          <span className="font-bold text-sm">{video.title}</span>
                        </button>
                      ))}
                      {totalVideos === 0 && <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">No hay videos disponibles</p>}
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-black text-red-600 text-xs uppercase tracking-widest">PDFs ({viewedPdfs.size}/{totalPdfs})</h4>
                      {courseData?.pdfs?.map((pdf: any) => (
                        <button key={pdf.id} onClick={() => { setCurrentPDF(pdf); setViewedPdfs(prev => new Set(prev).add(pdf.id)); }} className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${viewedPdfs.has(pdf.id) ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-transparent hover:border-red-200'}`}>
                          <div className={`p-2 rounded-lg ${viewedPdfs.has(pdf.id) ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}><DocumentIcon /></div>
                          <span className="font-bold text-sm">{pdf.title}</span>
                        </button>
                      ))}
                      {totalPdfs === 0 && <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">No hay PDFs disponibles</p>}
                    </div>
                  </div>
                )}

                {currentStep === 'quiz' && (
                  <div className="space-y-8">
                    <div className="flex justify-between items-center p-6 bg-black text-white rounded-3xl">
                      <div className="flex items-center gap-3">
                        <ClockIcon />
                        <span className={`text-2xl font-black ${quizTimeLeft < 60 ? 'text-red-500 animate-pulse' : ''}`}>{formatTime(quizTimeLeft)}</span>
                      </div>
                      <span className="font-black text-xs uppercase tracking-widest text-gray-400">Puntaje requerido: 100%</span>
                    </div>

                    {courseData?.questions?.map((q: any, i: number) => (
                      <div key={q.id} className="p-8 border-2 border-gray-100 rounded-[2rem] bg-gray-50 space-y-6">
                        <p className="text-xl font-black text-gray-800 italic">{i+1}. {q.question}</p>
                        <div className="grid grid-cols-1 gap-4">
                          {q.options?.map((opt: string, idx: number) => (
                            <label key={idx} className={`flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all ${userAnswers[q.id] === opt ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-transparent hover:border-gray-200 text-gray-700'}`}>
                              <input type="radio" name={`q-${q.id}`} checked={userAnswers[q.id] === opt} onChange={() => handleOptionSelect(q.id, opt)} className="hidden" />
                              <span className="font-bold">{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    <button onClick={handleFinishExam} disabled={!isComplete} className={`w-full py-6 rounded-[2rem] font-black text-xl shadow-xl transition-all ${isComplete ? 'bg-green-600 text-white hover:scale-[1.02]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                      {isComplete ? 'ENVIAR PARA CALIFICACIÓN' : 'RESPONDE TODO PARA ENVIAR'}
                    </button>
                  </div>
                )}

                {currentStep === 'results' && (
                  <div className="text-center py-20 space-y-8">
                    <div className={`text-[10rem] font-black tracking-tighter leading-none ${score === 100 ? 'text-green-600' : 'text-red-600'}`}>
                      {score}%
                    </div>
                    <div className="space-y-2">
                      <p className="text-2xl font-black uppercase italic">{score === 100 ? '¡Examen Perfecto!' : 'Aprobación Fallida'}</p>
                      <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
                        {score === 100 ? 'Has completado el curso exitosamente.' : 'Se requiere el 100% de aciertos para aprobar.'}
                      </p>
                    </div>
                    <div className="flex gap-4 justify-center">
                      {score < 100 && (
                        <button onClick={() => {setScore(0); setUserAnswers({}); setCurrentStep('quiz'); setQuizTimeLeft((courseData?.duracionExamen || 30) * 60);}} className="px-10 py-4 bg-black text-white rounded-2xl font-black hover:scale-105 transition-all">REINTENTAR AHORA</button>
                      )}
                      <button onClick={onClose} className={`px-10 py-4 rounded-2xl font-black transition-all ${score === 100 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                        {score === 100 ? 'FINALIZAR' : 'CERRAR'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* VISORES */}
              {currentVideo && (
                <div className="fixed inset-0 bg-black/95 z-[70] flex items-center justify-center p-8">
                  <div className="w-full max-w-5xl aspect-video relative">
                    <button onClick={() => setCurrentVideo(null)} className="absolute -top-12 right-0 text-white flex items-center gap-2 font-black tracking-widest text-xs uppercase"><XMarkIcon /> CERRAR VIDEO</button>
                    <video controls autoPlay className="w-full h-full rounded-3xl bg-black"><source src={currentVideo.fileUrl} type="video/mp4" /></video>
                  </div>
                </div>
              )}
              {currentPDF && (
                <div className="fixed inset-0 bg-black/95 z-[70] flex items-center justify-center p-8">
                  <div className="w-full max-w-6xl h-full relative flex flex-col">
                    <button onClick={() => setCurrentPDF(null)} className="absolute -top-12 right-0 text-white flex items-center gap-2 font-black tracking-widest text-xs uppercase"><XMarkIcon /> CERRAR PDF</button>
                    <iframe title={currentPDF.title} src={currentPDF.fileUrl} className="w-full flex-1 rounded-3xl bg-white" />
                  </div>
                </div>
              )}
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}