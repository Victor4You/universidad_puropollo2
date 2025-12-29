// components/CourseFormModal.tsx
'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';

// Íconos SVG (Mantenidos según tu diseño)
const XMarkIcon = () => (<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>);
const PlusIcon = () => (<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>);
const TrashIcon = () => (<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>);

export default function CourseFormModal({ isOpen, onClose, courseData }: any) {
  // 1. INFORMACIÓN GENERAL (Precargada de la prueba)
  const [nombre, setNombre] = useState(courseData?.nombre || 'TALLER ATENCION Y SERVICIO AL CLIENTE');
  const [duracion, setDuracion] = useState(30);

  // 2. VIDEOS (Precargados de la prueba)
  const [videos, setVideos] = useState([
    { id: '1', title: 'Como tratar a un cliente enojado', fileUrl: 'https://api.ppollo.org/uploads/cursos/019962e9-a583-741d-968f-890747dc4434.mp4' },
    { id: '2', title: 'Ejemplo de Buena y Mala atención al cliente', fileUrl: 'https://api.ppollo.org/uploads/cursos/019962eb-7141-717b-b95a-8271d8da1566.mp4' }
  ]);

  // 3. PDFS (Precargados de la prueba)
  const [pdfs, setPdfs] = useState([
    { id: '1', title: 'SERVICIOS DE VENTAS_PP (1)', fileUrl: 'https://api.ppollo.org/uploads/cursos/01968d05-284c-76ee-b042-2c602654e427.pdf' },
    { id: '2', title: 'SERVICIO AL CLIENTE', fileUrl: 'https://api.ppollo.org/uploads/cursos/019972b8-1fc0-76be-ab69-033eba22f7d5.pdf' }
  ]);

  // 4. PREGUNTAS (Precargadas de la prueba)
  const [questions, setQuestions] = useState<any[]>([
    {
      id: '1',
      title: 'Pregunta #1',
      type: 'closed',
      question: '¿Qué es el servicio al cliente?',
      answer: 'c) Las acciones que tomamos antes, durante y después de la venta', // Respuesta correcta actual
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
      question: 'Explica brevemente la importancia de la comunicación en el servicio al cliente.',
      answer: ''
    }
  ]);

  // --- FUNCIONES PARA MODIFICAR TODO ---

  const handleUpdateQuestion = (id: string, field: string, value: any) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const handleUpdateOption = (qId: string, optIdx: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        const newOpts = [...q.options];
        newOpts[optIdx] = value;
        return { ...q, options: newOpts };
      }
      return q;
    }));
  };

  const addOption = (qId: string) => {
    setQuestions(questions.map(q => q.id === qId ? { ...q, options: [...q.options, ''] } : q));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("DATOS FINALES MODIFICADOS:", { nombre, duracion, videos, pdfs, questions });
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
              
              <div className="flex justify-between items-center mb-8 border-b pb-4">
                <Dialog.Title className="text-2xl font-black text-gray-800">CONFIGURACIÓN INTEGRAL DEL CURSO</Dialog.Title>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><XMarkIcon /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10 max-h-[70vh] overflow-y-auto pr-4">
                
                {/* 1. DATOS GENERALES */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500">NOMBRE DEL CURSO</label>
                    <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500">TIEMPO EXAMEN (MIN)</label>
                    <input type="number" value={duracion} onChange={(e) => setDuracion(Number(e.target.value))} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>

                {/* 2. VIDEOS Y PDFS */}
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-bold text-blue-600">Videos Precargados</h4>
                    {videos.map((v, i) => (
                      <div key={v.id} className="p-4 bg-gray-50 rounded-xl space-y-2 border border-gray-100">
                        <input value={v.title} onChange={(e) => {const n = [...videos]; n[i].title = e.target.value; setVideos(n)}} placeholder="Título" className="w-full bg-transparent font-bold text-sm outline-none" />
                        <input value={v.fileUrl} onChange={(e) => {const n = [...videos]; n[i].fileUrl = e.target.value; setVideos(n)}} placeholder="URL" className="w-full bg-transparent text-xs text-blue-500 outline-none" />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-bold text-red-600">Documentos Precargados</h4>
                    {pdfs.map((p, i) => (
                      <div key={p.id} className="p-4 bg-gray-50 rounded-xl space-y-2 border border-gray-100">
                        <input value={p.title} onChange={(e) => {const n = [...pdfs]; n[i].title = e.target.value; setPdfs(n)}} placeholder="Título" className="w-full bg-transparent font-bold text-sm outline-none" />
                        <input value={p.fileUrl} onChange={(e) => {const n = [...pdfs]; n[i].fileUrl = e.target.value; setPdfs(n)}} placeholder="URL" className="w-full bg-transparent text-xs text-red-500 outline-none" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. CUESTIONARIO DINÁMICO */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b-2 border-gray-800 pb-2">
                    <h4 className="font-black text-gray-800 tracking-tighter text-xl">CONTENIDO DEL EXAMEN</h4>
                    <button type="button" onClick={() => setQuestions([...questions, {id: Date.now().toString(), title: `Pregunta #${questions.length+1}`, type:'closed', question:'', options:[''], answer:''}])} className="text-xs bg-black text-white px-4 py-2 rounded-full font-bold">+ AÑADIR PREGUNTA</button>
                  </div>

                  {questions.map((q, idx) => (
                    <div key={q.id} className="p-6 border-2 border-gray-200 rounded-3xl space-y-4 relative">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black px-3 py-1 bg-gray-200 rounded-full">{q.title}</span>
                        <select value={q.type} onChange={(e) => handleUpdateQuestion(q.id, 'type', e.target.value)} className="text-xs border-none font-bold bg-transparent text-blue-600 outline-none">
                          <option value="closed">Selección Múltiple</option>
                          <option value="open">Pregunta Abierta</option>
                        </select>
                      </div>

                      <input value={q.question} onChange={(e) => handleUpdateQuestion(q.id, 'question', e.target.value)} placeholder="Enunciado de la pregunta" className="w-full text-lg font-bold outline-none border-b focus:border-blue-500" />

                      {q.type === 'closed' && (
                        <div className="space-y-3 pt-2">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Opciones de respuesta (Marca la correcta):</p>
                          {q.options.map((opt: string, oIdx: number) => (
                            <div key={oIdx} className="flex items-center gap-3">
                              <input type="radio" name={`correct-${q.id}`} checked={q.answer === opt && opt !== ''} onChange={() => handleUpdateQuestion(q.id, 'answer', opt)} className="w-4 h-4 text-blue-600" />
                              <input value={opt} onChange={(e) => handleUpdateOption(q.id, oIdx, e.target.value)} placeholder={`Opción ${oIdx + 1}`} className="flex-1 bg-gray-100 px-4 py-2 rounded-xl text-sm outline-none focus:bg-white border-2 border-transparent focus:border-blue-200" />
                              <button type="button" onClick={() => handleUpdateQuestion(q.id, 'options', q.options.filter((_:any, i:number) => i !== oIdx))}><TrashIcon /></button>
                            </div>
                          ))}
                          <button type="button" onClick={() => addOption(q.id)} className="text-xs font-bold text-blue-600 underline">+ Añadir opción</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* BOTONES DE ACCIÓN */}
                <div className="flex justify-end gap-4 pt-8 border-t">
                  <button type="button" onClick={onClose} className="px-8 py-3 font-bold text-gray-400 hover:text-gray-800 transition-colors">DESCARTAR</button>
                  <button type="submit" className="px-10 py-3 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-100 hover:scale-105 transition-all">GUARDAR CAMBIOS</button>
                </div>

              </form>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}