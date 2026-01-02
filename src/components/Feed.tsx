// src/components/Feed.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { usePermission } from '@/hooks/usePermission';
import { Post } from '@/lib/types/post.types';
import CreatePost from '@/components/posts/CreatePost/CreatePost';
import PostCard from '@/components/posts/PostCard/PostCard';
import { Carousel } from '@/components/ui/Carousel/Carousel';
import { ChevronLeft, ChevronRight, BookOpen, Users, Edit2, Trash2, CheckCircle2, Lock } from 'lucide-react';

// Modales de gestión
import CourseFormModal from '@/components/CourseFormModal';
import CourseStudentsModal from '@/components/CourseStudentsModal';

// --- DATOS MOCK ---
const CURSOS_BASE = [
  { id: '1', codigo: 'MAT101', nombre: 'Matemáticas Básicas', creditos: 4, semestre: '2024-I', profesor: 'Carlos Mendoza', estado: 'activo', estudiantes: 45, completado: false },
  { id: '2', codigo: 'FIS201', nombre: 'Física General', creditos: 5, semestre: '2024-I', profesor: 'Ana López', estado: 'activo', estudiantes: 38, completado: false },
  { id: '3', codigo: 'PROG301', nombre: 'Programación I', creditos: 4, semestre: '2024-I', profesor: 'Roberto Gómez', estado: 'activo', estudiantes: 50, completado: false },
  { id: '4', codigo: 'QUIM401', nombre: 'Química Orgánica', creditos: 4, semestre: '2024-I', profesor: 'Elena Torres', estado: 'inactivo', estudiantes: 30, completado: false },
  { id: '5', codigo: 'HIS102', nombre: 'Historia Universal', creditos: 2, semestre: '2024-I', profesor: 'Luis Rivas', estado: 'activo', estudiantes: 25, completado: false },
  { id: '6', codigo: 'BIO101', nombre: 'Biología Celular', creditos: 4, semestre: '2024-I', profesor: 'Martha Soto', estado: 'activo', estudiantes: 12, completado: false },
];

const carouselImages = [
  { id: '1', src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80', alt: 'Campus universitario', title: 'Nuestro Campus', description: 'Instalaciones modernas para una educación de excelencia' },
  { id: '2', src: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80', alt: 'Biblioteca universitaria', title: 'Biblioteca Central', description: 'Más de 50,000 libros disponibles para nuestros estudiantes' }
];

const mockPosts: Post[] = [
  {
    id: '1',
    user: { id: '1', name: 'Admin Universidad', username: 'admin', role: 'admin', avatar: null, email: 'admin@universidad.edu', createdAt: '2024-01-01' },
    content: '¡Bienvenidos al nuevo sistema de la Universidad PuroPolio!',
    timestamp: '2024-01-15T10:30:00Z',
    likes: 24, liked: false, comments: [], shares: 5, shared: false
  },
  {
    id: '2',
    user: { id: '2', name: 'Profesor Carlos Mendoza', username: 'cmendoza', role: 'teacher', avatar: null, email: 'profesor@universidad.edu', createdAt: '2024-01-01' },
    content: 'Recordatorio: Las evaluaciones del primer parcial comienzan la próxima semana.',
    timestamp: '2024-01-14T14:20:00Z',
    likes: 18, liked: false, comments: [], shares: 2, shared: false
  }
]; 

export default function Feed() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { isRole, userRole } = usePermission();
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [isMobile, setIsMobile] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [cursos, setCursos] = useState(CURSOS_BASE);
  const [selectedCurso, setSelectedCurso] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showStudentsModal, setShowStudentsModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const savedProgress = localStorage.getItem('progreso_cursos');
      if (savedProgress) {
        try {
          const completadosIds = JSON.parse(savedProgress);
          setCursos(CURSOS_BASE.map(c => ({ ...c, completado: completadosIds.includes(c.id) })));
        } catch (e) { console.error(e); }
      }
    }
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isAuthenticated]);

  const esAdminOProfesor = userRole === 'admin' || userRole === 'teacher';

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const moveDistance = clientWidth * 0.5;
      const scrollTo = direction === 'left' ? scrollLeft - moveDistance : scrollLeft + moveDistance;
      scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header móvil */}
      {isMobile && (
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 lg:hidden">
          <div className="px-4 py-3">
            <h1 className="text-xl font-bold text-gray-900 truncate">Feed Universitario</h1>
            <p className="text-sm text-gray-600 mt-1 truncate">
              {isAuthenticated && user ? `Bienvenido, ${user.name}` : 'Explora contenido académico'}
            </p>
          </div>
        </div>
      )}

      <div className={`${isMobile ? 'p-3' : 'max-w-7xl mx-auto p-4 lg:p-6'}`}>
        {!isMobile && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Feed Universitario</h1>
            {isAuthenticated && user ? (
              <p className="text-gray-600 mt-2">Bienvenido, {user.name}. Comparte y descubre contenido académico.</p>
            ) : (
              <p className="text-gray-600 mt-2">Explora contenido académico. Inicia sesión para interactuar.</p>
            )}
          </div>
        )}

        {/* --- SECCIÓN DE CURSOS (SOLO SI ESTÁ AUTENTICADO) --- */}
        {isAuthenticated && (
          <div className="mb-10 relative">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Cursos disponibles</h2>
              <div className="flex gap-2">
                <button onClick={() => scroll('left')} className="p-2 rounded-full border border-gray-200 bg-white hover:bg-gray-100 shadow-sm transition-all active:scale-95">
                  <ChevronLeft size={20} className="text-gray-600" />
                </button>
                <button onClick={() => scroll('right')} className="p-2 rounded-full border border-gray-200 bg-white hover:bg-gray-100 shadow-sm transition-all active:scale-95">
                  <ChevronRight size={20} className="text-gray-600" />
                </button>
              </div>
            </div>

            <div ref={scrollContainerRef} className="flex overflow-x-auto gap-5 pb-4 scroll-smooth snap-x no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {cursos.map((curso, index) => {
                const estaHabilitado = esAdminOProfesor || (index === 0 || !!cursos[index - 1].completado);

                return (
                  <div key={curso.id} className={`min-w-[300px] md:min-w-[320px] bg-white rounded-2xl border border-gray-100 shadow-sm p-6 snap-start transition-all ${!estaHabilitado ? 'opacity-50 grayscale-[0.5]' : 'hover:shadow-md'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-1 rounded">{curso.codigo}</span>
                      <div className="flex gap-1">
                        {isRole('admin') && (
                          <>
                            <button onClick={() => { setSelectedCurso(curso); setIsModalOpen(true); }} className="p-1 hover:bg-blue-50 text-blue-400 rounded transition-colors"><Edit2 size={14} /></button>
                          </>
                        )}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight h-12 line-clamp-2">{curso.nombre}</h3>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-gray-500 text-sm flex items-center"><Users size={16} className="mr-1.5" /> {curso.profesor}</p>
                      <button onClick={() => { setSelectedCurso(curso); setShowStudentsModal(true); }} className="text-[10px] font-bold text-blue-600 hover:underline">{curso.estudiantes} alumnos</button>
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-[11px] font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">{curso.creditos} CRÉDITOS</div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${curso.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{curso.estado.toUpperCase()}</span>
                    </div>
                    <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                      <button 
                        onClick={() => estaHabilitado && router.push('/dashboard/gestion-cursos')}
                        disabled={!estaHabilitado}
                        className={`flex items-center gap-2 font-bold text-sm ${estaHabilitado ? 'text-purple-600 hover:scale-105 transition-transform' : 'text-gray-400 cursor-not-allowed'}`}
                      >
                        {estaHabilitado ? <BookOpen size={20} /> : <Lock size={20} />}
                        <span>{estaHabilitado ? 'Ir al curso' : 'Bloqueado'}</span>
                      </button>
                      {curso.completado && <CheckCircle2 size={22} className="text-green-500" fill="currentColor" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Layout de tres columnas original e intacto */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          
          {/* Columna izquierda: Identidad */}
          <div className="hidden lg:block lg:w-1/6">
            <div className="sticky top-6 space-y-6">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="relative h-96">
                  <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Uni" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p className="text-white font-semibold">Universidad PuroPollo</p>
                    <p className="text-white/90 text-sm">Excelencia Educativa</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-lg p-6 text-center">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">ESR</span>
                </div>
                <h4 className="font-bold text-gray-800 mb-2 text-sm">Empresa Socialmente Responsable</h4>
                <p className="text-xs text-gray-600">Certificación 2024</p>
              </div>
            </div>
          </div>

          {/* Columna central: Feed */}
          <div className="lg:w-3/5">
            {isAuthenticated && user && (isRole('admin') || isRole('teacher')) && (
              <div className="mb-6">
                {!isMobile && <h2 className="text-xl font-semibold mb-4 text-gray-800">¿Qué quieres compartir, {user.name}?</h2>}
                <CreatePost currentUser={user} onPostCreated={(newPost) => setPosts([newPost, ...posts])} />
              </div>
            )}
            {!isAuthenticated && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-start">
                <div className="mr-3 text-blue-500 text-lg">💡</div>
                <p className="text-blue-700 text-sm"><strong>Inicia sesión</strong> para ver tus cursos, interactuar con posts y seguir tu progreso académico.</p>
              </div>
            )}
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} onLike={() => {}} onComment={() => {}} onShare={() => {}} />
              ))}
            </div>
          </div>

          {/* Columna derecha: Galería y Eventos */}
          <div className={`${isMobile ? 'w-full mt-6' : 'lg:w-1/4'}`}>
            <div className="sticky top-6 space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-4">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center"><span className="mr-2">📸</span> Galería Universitaria</h3>
                <Carousel images={carouselImages} autoPlay interval={4000} showControls={!isMobile} showIndicators />
              </div>
              <div className="bg-white rounded-xl shadow-lg p-4">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center"><span className="mr-2">📅</span> Próximos Eventos</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-800 text-sm">Conferencia: IA en Educación</p>
                    <p className="text-xs text-blue-600">25 Enero, 4:00 PM</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="font-medium text-green-800 text-sm">Feria de Empleo</p>
                    <p className="text-xs text-green-600">30 Enero, 9:00 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && <CourseFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} courseData={selectedCurso} />}
      {showStudentsModal && selectedCurso && <CourseStudentsModal isOpen={showStudentsModal} onClose={() => setShowStudentsModal(false)} {...selectedCurso} />}
    </div>
  );
}