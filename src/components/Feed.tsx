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
import { ChevronLeft, ChevronRight, BookOpen, Users, CheckCircle2, Lock as LockIcon } from 'lucide-react';

import CourseFormModal from '@/components/CourseFormModal';
import CourseStudentsModal from '@/components/CourseStudentsModal';

const carouselImages = [
  { id: '1', src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80', alt: 'Campus universitario', title: 'Nuestro Campus', description: 'Instalaciones modernas para una educación de excelencia' },
  { id: '2', src: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80', alt: 'Biblioteca universitaria', title: 'Biblioteca Central', description: 'Más de 50,000 libros disponibles para nuestros estudiantes' }
];

const mockPosts: Post[] = [
  {
    id: '1',
    user: { id: '1', name: 'Admin Universidad', username: 'admin', role: 'admin', avatar: null, email: 'admin@universidad.edu', createdAt: '2024-01-01' },
    content: '¡Bienvenidos al nuevo sistema de la Universidad PuroPollo!',
    timestamp: '2024-01-15T10:30:00Z',
    likes: 24, liked: false, comments: [], shares: 5, shared: false
  }
]; 

export default function Feed() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { isRole, userRole } = usePermission();
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [isMobile, setIsMobile] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [cursos, setCursos] = useState<any[]>([]);
  const [selectedCurso, setSelectedCurso] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showStudentsModal, setShowStudentsModal] = useState(false);

  const loadCursos = () => {
    const savedCursos = localStorage.getItem('lista_cursos_universidad');
    const savedProgress = localStorage.getItem('progreso_cursos');
    
    if (savedCursos) {
      try {
        const cursosData = JSON.parse(savedCursos);
        const completadosIds = savedProgress ? JSON.parse(savedProgress) : [];
        const dataFinal = cursosData.map((c: any) => ({
          ...c,
          completado: completadosIds.includes(c.id) || c.completado
        }));
        setCursos(dataFinal);
      } catch (e) { console.error(e); }
    }
  };

  useEffect(() => {
    if (isAuthenticated) loadCursos();
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

  const handleSaveCourse = (updatedCourse: any) => {
    const updatedList = cursos.map(c => c.id === updatedCourse.id ? updatedCourse : c);
    setCursos(updatedList);
    localStorage.setItem('lista_cursos_universidad', JSON.stringify(updatedList));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`${isMobile ? 'p-3' : 'max-w-7xl mx-auto p-4 lg:p-6'}`}>
        {!isMobile && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Feed Universitario</h1>
            <p className="text-gray-600 mt-2">Bienvenido, {user?.name || 'Invitado'}.</p>
          </div>
        )}

        {isAuthenticated && cursos.length > 0 && (
          <div className="mb-10 relative">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Cursos disponibles</h2>
              <div className="flex gap-2">
                <button onClick={() => scroll('left')} className="p-2 rounded-full border border-gray-200 bg-white hover:bg-gray-100 shadow-sm"><ChevronLeft size={20}/></button>
                <button onClick={() => scroll('right')} className="p-2 rounded-full border border-gray-200 bg-white hover:bg-gray-100 shadow-sm"><ChevronRight size={20}/></button>
              </div>
            </div>

            <div ref={scrollContainerRef} className="flex overflow-x-auto gap-5 pb-4 snap-x no-scrollbar" style={{ scrollbarWidth: 'none' }}>
              {cursos.map((curso, index) => {
                const estaHabilitado = esAdminOProfesor || index === 0 || !!cursos[index - 1].completado;

                return (
                  <div key={curso.id} className={`min-w-[300px] md:min-w-[320px] bg-white rounded-2xl border border-gray-100 shadow-sm p-6 snap-start transition-all ${!estaHabilitado ? 'opacity-50 grayscale-[0.5]' : 'hover:shadow-md'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-1 rounded">{curso.codigo}</span>
                      {/* Visualización de fecha de creación */}
                      <span className="text-[9px] font-bold text-gray-400 uppercase"> {curso.createdAt ? new Date(curso.createdAt).toLocaleDateString() : 'Nuevo'} </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight h-12 line-clamp-2">{curso.nombre}</h3>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-gray-500 text-sm flex items-center"><Users size={16} className="mr-1.5" /> {curso.profesor}</p>
                    </div>
                    {/* Visualización de última modificación */}
                    <div className="text-[10px] text-gray-400 flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span> 
                      Editado: {curso.updatedAt ? new Date(curso.updatedAt).toLocaleDateString() : 'Recientemente'}
                    </div>
                    <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                      <button 
                        onClick={() => estaHabilitado && router.push('/dashboard/gestion-cursos')}
                        disabled={!estaHabilitado}
                        className={`flex items-center gap-2 font-bold text-sm ${estaHabilitado ? 'text-purple-600' : 'text-gray-400 cursor-not-allowed'}`}
                      >
                        {estaHabilitado ? <BookOpen size={20} /> : <LockIcon size={20} />}
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
        
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          <div className="hidden lg:block lg:w-1/6">
             <div className="sticky top-6 space-y-6">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden h-96">
                  <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Uni" className="w-full h-full object-cover" />
                </div>
             </div>
          </div>

          <div className="lg:w-3/5">
            {isAuthenticated && user && (isRole('admin') || isRole('teacher')) && (
              <CreatePost currentUser={user} onPostCreated={(newPost) => setPosts([newPost, ...posts])} />
            )}
            <div className="space-y-6 mt-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} onLike={() => {}} onComment={() => {}} onShare={() => {}} />
              ))}
            </div>
          </div>

          <div className="lg:w-1/4">
             <div className="bg-white rounded-xl shadow-lg p-4">
                <h3 className="font-bold text-gray-800 mb-4">Galería</h3>
                <Carousel images={carouselImages} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}