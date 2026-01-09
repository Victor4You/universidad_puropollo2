// src/components/CourseStudentsModal.tsx
'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import axios from 'axios';

const XMarkIcon = () => (<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>);
const UserIcon = () => (<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>);
const SearchIcon = () => (<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);

export default function CourseStudentsModal({ isOpen, onClose, courseData, onUpdateCourse }: any) {
  const [searchTerm, setSearchTerm] = useState('');
  const [inscritos, setInscritos] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Sincronizar con los datos del curso al abrir
  useEffect(() => {
    if (courseData?.estudiantesInscritos) {
      setInscritos(courseData.estudiantesInscritos);
    }
  }, [courseData]);

  // BÚSQUEDA AUTOMÁTICA (DEBOUNCE)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim().length >= 1) { // Empieza a buscar desde la primera letra
        fetchUsers();
      } else {
        setSearchResults([]);
      }
    }, 300); // Pausa de 300ms para no saturar el backend

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchUsers = async () => {
    setIsSearching(true);
    try {
      // Llamada a tu backend real (v1/users/user/:username)
      const response = await axios.get(`http://localhost:3001/v1/users/user/${searchTerm}`);
      
      if (response.data) {
        const foundUser = response.data;
        // VALIDACIÓN: Solo mostrar si no está ya en la lista de inscritos
        const yaEstaInscrito = inscritos.some(s => s.username === foundUser.usuario);
        
        if (!yaEstaInscrito) {
          setSearchResults([foundUser]);
        } else {
          setSearchResults([]);
        }
      }
    } catch (error) {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleToggleInscripcion = (user: any) => {
    // Normalizamos el campo del identificador (tu backend usa 'usuario')
    const userKey = user.usuario || user.username;
    const isAlreadyIn = inscritos.some(s => s.username === userKey);
    
    if (isAlreadyIn) {
      // ELIMINAR: Filtramos exactamente por el username para no borrar a todos
      setInscritos(prev => prev.filter(s => s.username !== userKey));
    } else {
      // AÑADIR: Mapeamos los datos de la API universitaria al formato del curso
      const newStudent = {
        id: user.id,
        name: user.name || `${user.nombre} ${user.apellido}`,
        username: userKey,
        role: user.role || 'estudiante'
      };
      setInscritos(prev => [...prev, newStudent]);
      setSearchTerm('');
      setSearchResults([]);
    }
  };

  const handleSave = () => {
    onUpdateCourse({
      ...courseData,
      estudiantes: inscritos.length,
      estudiantesInscritos: inscritos
    });
    onClose();
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
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Gestión de Alumnos</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{courseData?.nombre}</p>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><XMarkIcon /></button>
              </div>

              {/* BARRA DE BÚSQUEDA REACTIVA */}
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-4 flex items-center text-gray-400">
                  {isSearching ? <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" /> : <SearchIcon />}
                </div>
                <input
                  type="text"
                  placeholder="ESCRIBE PARA BUSCAR USUARIO..."
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl py-3 pl-12 pr-4 text-xs font-bold outline-none transition-all uppercase"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                {/* RESULTADOS PREDICTIVOS */}
                {searchResults.length > 0 && (
                  <div className="absolute z-20 w-full mt-2 bg-white border-2 border-blue-600 rounded-2xl shadow-xl overflow-hidden">
                    {searchResults.map((user) => (
                      <button 
                        key={user.usuario} 
                        onClick={() => handleToggleInscripcion(user)} 
                        className="w-full flex items-center justify-between p-4 hover:bg-blue-50 transition-colors"
                      >
                        <div className="text-left">
                          <p className="font-bold text-gray-900 text-sm">{user.nombre} {user.apellido}</p>
                          <p className="text-[10px] text-blue-600 font-black">@{user.usuario}</p>
                        </div>
                        <span className="text-blue-600 font-black text-[10px] uppercase">+ Inscribir</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* LISTA DE INSCRITOS (CORREGIDA) */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Lista Actual ({inscritos.length})</h4>
                <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {inscritos.length > 0 ? (
                    inscritos.map((student) => (
                      <div key={student.username} className="flex items-center justify-between p-4 bg-gray-50 rounded-[1.5rem] border-2 border-transparent hover:border-blue-50 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <UserIcon />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 text-sm">{student.name}</div>
                            <div className="text-[10px] text-gray-500 uppercase font-black">@{student.username}</div>
                          </div>
                        </div>
                        {/* SWITCH DE ESTADO */}
                        <button 
                          onClick={() => handleToggleInscripcion(student)}
                          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-green-600"
                        >
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center border-2 border-dashed border-gray-100 rounded-[2rem]">
                      <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Busca alumnos para el curso</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
                <button onClick={onClose} className="px-6 py-2 text-gray-400 font-black uppercase text-[10px] tracking-widest hover:text-gray-800 transition-colors">Descartar</button>
                <button onClick={handleSave} className="px-8 py-3 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all uppercase text-[10px] tracking-widest">
                  Guardar Cambios
                </button>
              </div>

            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}