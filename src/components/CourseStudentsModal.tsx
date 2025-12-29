'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';

const XMarkIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const UserIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

interface CourseStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseName: string; // Restaurado a string
}

export default function CourseStudentsModal({ isOpen, onClose, courseName }: CourseStudentsModalProps) {
  const [inscritos, setInscritos] = useState(['1', '2']);

  const handleToggleInscripcion = (id: string) => {
    setInscritos(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                  <div>
                    <Dialog.Title className="text-xl font-bold text-gray-900">Inscribir Alumnos</Dialog.Title>
                    <p className="text-sm text-gray-500 mt-1">Curso: {courseName}</p>
                  </div>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-500"><XMarkIcon /></button>
                </div>

                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {/* Alumno de Ejemplo 1 */}
                  <div className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <UserIcon />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">Juan Pérez</div>
                        <div className="text-xs text-gray-500 uppercase font-semibold">Departamento: OFICINA</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleToggleInscripcion('1')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${inscritos.includes('1') ? 'bg-green-600' : 'bg-gray-200'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${inscritos.includes('1') ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  {/* Alumno de Ejemplo 2 */}
                  <div className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <UserIcon />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">Maria García</div>
                        <div className="text-xs text-gray-500 uppercase font-semibold">Departamento: VENTAS</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleToggleInscripcion('2')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${inscritos.includes('2') ? 'bg-green-600' : 'bg-gray-200'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${inscritos.includes('2') ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
                  <button onClick={onClose} className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-50 rounded-lg">Cancelar</button>
                  <button onClick={onClose} className="px-8 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md transition-all">Guardar Cambios</button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}