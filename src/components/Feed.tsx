// src/components/Feed.tsx - VERSIÓN RESPONSIVA
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Post } from '@/lib/types/post.types';
import CreatePost from '@/components/posts/CreatePost/CreatePost';
import PostCard from '@/components/posts/PostCard/PostCard';
import { Carousel } from '@/components/ui/Carousel/Carousel';

// imagenes carrusel
const carouselImages = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    alt: 'Campus universitario',
    title: 'Nuestro Campus',
    description: 'Instalaciones modernas para una educación de excelencia'
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    alt: 'Biblioteca universitaria',
    title: 'Biblioteca Central',
    description: 'Más de 50,000 libros disponibles para nuestros estudiantes'
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1524178234883-043d5c3f3cf4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    alt: 'Laboratorios de investigación',
    title: 'Laboratorios Avanzados',
    description: 'Tecnología de punta para investigación científica'
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    alt: 'Actividades extracurriculares',
    title: 'Vida Estudiantil',
    description: 'Clubes y actividades para desarrollo integral'
  }
];

// Datos mock para pruebas
const mockPosts: Post[] = [
  {
    id: '1',
    user: {
      id: '1',
      name: 'Admin Universidad',
      role: 'admin',
      avatar: null,
      email: 'admin@universidad.edu',
      createdAt: '2024-01-01'
    },
    content: '¡Bienvenidos al nuevo sistema de la Universidad PuroPolio!',
    timestamp: '2024-01-15T10:30:00Z',
    likes: 24,
    liked: false,
    comments: [],
    shares: 5,
    shared: false
  },
  {
    id: '2',
    user: {
      id: '2',
      name: 'Profesor Carlos Mendoza',
      role: 'teacher',
      avatar: null,
      email: 'profesor@universidad.edu',
      createdAt: '2024-01-01'
    },
    content: 'Recordatorio: Las evaluaciones del primer parcial comienzan la próxima semana.',
    timestamp: '2024-01-14T14:20:00Z',
    likes: 18,
    liked: true,
    comments: [
      {
        id: 'c1',
        user: {
          id: '4',
          name: 'Estudiante Ejemplo',
          role: 'student',
          avatar: null,
          email: 'estudiante@universidad.edu',
          createdAt: '2024-01-01'
        },
        content: '¿Podría publicar los temas que entrarán en el examen?',
        timestamp: '2024-01-14T15:30:00Z',
        likes: 3,
        liked: false
      }
    ],
    shares: 2,
    shared: false
  }
]; 

export default function Feed() {
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const addPost = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  const handleLike = (postId: string) => {
    if (!isAuthenticated) {
      return;
    }
    
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.liked ? post.likes - 1 : post.likes + 1, liked: !post.liked }
        : post
    ));
  };

  const handleComment = (postId: string, content: string) => {
    if (!isAuthenticated) {
      return;
    }
    
    setPosts(posts.map(post => { 
      if (post.id === postId) { 
        const newComment = { 
          id: `c${Date.now()}`, 
          user: user!, 
          content, 
          timestamp: new Date().toISOString(), 
          likes: 0, 
          liked: false 
        };
        return { ...post, comments: [...post.comments, newComment]}; 
      }
      return post;
    }));
  };

  const handleShare = (postId: string) => {
    if (!isAuthenticated) {
      return;
    }
    
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, shares: post.shared ? post.shares - 1 : post.shares + 1, shared: !post.shared }
        : post
    ));
  };

  // Función para verificar si puede publicar
  const canCreatePost = () => {
    if (!isAuthenticated || !user) return false;
    return user.role === 'admin' || user.role === 'teacher';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header para móviles */}
      {isMobile && (
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 lg:hidden">
          <div className="px-4 py-3">
            <h1 className="text-xl font-bold text-gray-900 truncate">
              Feed Universitario
            </h1>
            {isAuthenticated && user ? (
              <p className="text-sm text-gray-600 mt-1 truncate">
                Bienvenido, {user.name}
              </p>
            ) : (
              <p className="text-sm text-gray-600 mt-1">
                Explora contenido académico
              </p>
            )}
          </div>
        </div>
      )}

      <div className={`${isMobile ? 'p-3' : 'max-w-7xl mx-auto p-4 lg:p-6'}`}>
        {/* Header para desktop */}
        {!isMobile && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Feed Universitario
            </h1>
            {isAuthenticated && user ? (
              <p className="text-gray-600 mt-2">
                Bienvenido, {user.name}. Comparte y descubre contenido académico.
              </p>
            ) : (
              <p className="text-gray-600 mt-2">
                Explora contenido académico. Inicia sesión para interactuar.
              </p>
            )}
          </div>
        )}
        
        {/* Layout de tres columnas en desktop, una en móvil */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          
          {/* Columna izquierda - Ocultar en móvil, mostrar en desktop */}
          <div className="hidden lg:block lg:w-1/6">
            <div className="sticky top-6 space-y-6">
              {/* Imagen estática vertical */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="relative h-96">
                  <img
                    src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    alt="Universidad PuroPolio"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p className="text-white font-semibold">Universidad PuroPollo</p>
                    <p className="text-white/90 text-sm">Excelencia Educativa</p>
                  </div>
                </div>
              </div>

              {/* Logo ESR */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-lg p-4 lg:p-6 text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">ESR</span>
                  </div>
                </div>
                <h4 className="font-bold text-gray-800 mb-2 text-sm lg:text-base">Empresa Socialmente Responsable</h4>
                <p className="text-xs lg:text-sm text-gray-600">
                  Comprometidos con el desarrollo sostenible
                </p>
                <div className="mt-4 pt-4 border-t border-green-200">
                  <p className="text-xs text-green-700">
                    Certificación ESR 2024
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna central - Feed principal */}
          <div className="lg:w-3/5">
            {/* Formulario para crear publicación */}
            {isAuthenticated && user && canCreatePost() && (
              <div className="mb-6">
                {!isMobile && (
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    ¿Qué quieres compartir, {user.name}?
                  </h2>
                )}
                <CreatePost 
                  currentUser={user}
                  onPostCreated={addPost} 
                />
              </div>
            )}

            {/* Mensaje sutil para usuarios no autenticados */}
            {!isAuthenticated && (
              <div className="mb-6 p-3 lg:p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="flex items-start">
                  <div className="mr-3 text-blue-500 text-lg">💡</div>
                  <div>
                    <p className="text-blue-700 text-sm lg:text-base">
                      <strong>Inicia sesión</strong> para interactuar con las publicaciones
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Lista de publicaciones */}
            <div className="space-y-4 lg:space-y-6">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onComment={handleComment}
                  onShare={handleShare}
                />
              ))}
              
              {posts.length === 0 && (
                <div className="text-center py-8 lg:py-12">
                  <h3 className="text-lg lg:text-xl font-semibold text-gray-700 mb-2">
                    No hay publicaciones aún
                  </h3>
                  <p className="text-gray-500 text-sm lg:text-base">
                    Sé el primero en compartir algo con la comunidad universitaria.
                  </p>
                  {!isAuthenticated && (
                    <p className="text-blue-600 mt-3 text-sm lg:text-base">
                      Inicia sesión para crear la primera publicación
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Columna derecha - Carrusel y eventos */}
          <div className={`${isMobile ? 'w-full mt-6' : 'lg:w-1/4'}`}>
            <div className={`${isMobile ? 'space-y-4' : 'sticky top-6 space-y-6'}`}>
              {/* Carrusel - Responsivo */}
              <div className="bg-white rounded-lg lg:rounded-xl shadow-lg p-3 lg:p-4">
                <h3 className="font-bold text-gray-800 mb-3 lg:mb-4 flex items-center text-sm lg:text-base">
                  <span className="mr-2">📸</span> Galería Universitaria
                </h3>
                <Carousel 
                  images={carouselImages}
                  autoPlay={true}
                  interval={4000}
                  showControls={!isMobile}
                  showIndicators={true}
                />
              </div>

              {/* Eventos próximos */}
              <div className="bg-white rounded-lg lg:rounded-xl shadow-lg p-3 lg:p-4">
                <h3 className="font-bold text-gray-800 mb-3 lg:mb-4 flex items-center text-sm lg:text-base">
                  <span className="mr-2">📅</span> Próximos Eventos
                </h3>
                
                <div className="space-y-2 lg:space-y-3">
                  <div className="p-2 lg:p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-800 text-sm lg:text-base">Conferencia: IA en Educación</p>
                    <p className="text-xs lg:text-sm text-blue-600">25 Enero, 4:00 PM</p>
                  </div>
                  
                  <div className="p-2 lg:p-3 bg-green-50 rounded-lg">
                    <p className="font-medium text-green-800 text-sm lg:text-base">Feria de Empleo</p>
                    <p className="text-xs lg:text-sm text-green-600">30 Enero, 9:00 AM</p>
                  </div>
                  
                  <div className="p-2 lg:p-3 bg-purple-50 rounded-lg">
                    <p className="font-medium text-purple-800 text-sm lg:text-base">Taller de Programación</p>
                    <p className="text-xs lg:text-sm text-purple-600">1 Febrero, 3:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}