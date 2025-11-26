'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import { Post } from '@/types/post';

// Datos de ejemplo
const mockPosts: Post[] = [
  {
    id: '1',
    user: {
      id: '2',
      name: 'Ana García',
      role: 'admin',
      avatar: null,
      email: 'ana@universidad.edu'
    },
    content: '🎓 ¡Gran noticia! Hemos lanzado nuestro nuevo programa de becas para el próximo semestre. Los estudiantes interesados pueden aplicar a través del portal estudiantil hasta el 30 de noviembre.',
    timestamp: 'Hace 2 horas',
    likes: 24,
    liked: false,
    comments: [
      {
        id: '1-1',
        user: {
          id: '3',
          name: 'María López',
          role: 'student',
          avatar: null,
          email: 'maria@estudiante.edu'
        },
        content: '¡Excelente oportunidad! ¿Dónde puedo encontrar más información sobre los requisitos?',
        timestamp: 'Hace 1 hora',
        likes: 3,
        liked: false
      }
    ],
    shares: 5,
    shared: false
  },
  {
    id: '2',
    user: {
      id: '4',
      name: 'Carlos Mendoza',
      role: 'teacher',
      avatar: null,
      email: 'carlos@universidad.edu'
    },
    content: '📚 Recordatorio importante: El período de inscripción para los cursos electivos del próximo trimestre comienza este lunes. Asegúrense de revisar la oferta académica en nuestra plataforma.',
    media: {
      type: 'image',
      url: '/images/academic-calendar.jpg'
    },
    timestamp: 'Hace 5 horas',
    likes: 18,
    liked: true,
    comments: [],
    shares: 2,
    shared: false
  },
  {
    id: '3',
    user: {
      id: '2',
      name: 'Ana García',
      role: 'admin',
      avatar: null,
      email: 'ana@universidad.edu'
    },
    content: '¿Qué tema les gustaría que cubriéramos en nuestro próximo webinar?',
    poll: {
      question: 'Tema para próximo webinar',
      options: [
        { id: '1', text: 'Inteligencia Artificial en Educación', votes: 15 },
        { id: '2', text: 'Metodologías de Aprendizaje Activo', votes: 8 },
        { id: '3', text: 'Herramientas Digitales para la Investigación', votes: 12 }
      ],
      voted: false
    },
    timestamp: 'Hace 1 día',
    likes: 32,
    liked: false,
    comments: [],
    shares: 7,
    shared: true
  },
  {
    id: '4',
    user: {
      id: '5',
      name: 'Dr. Roberto Silva',
      role: 'teacher',
      avatar: null,
      email: 'roberto@universidad.edu'
    },
    content: 'Comparto con ustedes este interesante artículo sobre innovación educativa que puede ser de utilidad para todos.',
    media: {
      type: 'link',
      url: 'https://ejemplo.com/articulo-innovacion-educativa'
    },
    timestamp: 'Hace 2 días',
    likes: 11,
    liked: false,
    comments: [
      {
        id: '4-1',
        user: {
          id: '3',
          name: 'María López',
          role: 'student',
          avatar: null,
          email: 'maria@estudiante.edu'
        },
        content: 'Muy interesante, gracias por compartir profesor!',
        timestamp: 'Hace 1 día',
        likes: 2,
        liked: false
      }
    ],
    shares: 3,
    shared: false
  },
  {
    id: '5',
    user: {
      id: '2',
      name: 'Ana García',
      role: 'admin',
      avatar: null,
      email: 'ana@universidad.edu'
    },
    content: '📢 Aviso importante: El próximo viernes no habrá clases por mantenimiento de las instalaciones. Las actividades se reanudarán normalmente el lunes.',
    timestamp: 'Hace 3 días',
    likes: 45,
    liked: true,
    comments: [
      {
        id: '5-1',
        user: {
          id: '4',
          name: 'Carlos Mendoza',
          role: 'teacher',
          avatar: null,
          email: 'carlos@universidad.edu'
        },
        content: 'Gracias por la información. Ajustaré el calendario de entregas en consecuencia.',
        timestamp: 'Hace 2 días',
        likes: 5,
        liked: false
      },
      {
        id: '5-2',
        user: {
          id: '3',
          name: 'María López',
          role: 'student',
          avatar: null,
          email: 'maria@estudiante.edu'
        },
        content: 'Perfecto, gracias por el aviso!',
        timestamp: 'Hace 2 días',
        likes: 1,
        liked: false
      }
    ],
    shares: 8,
    shared: false
  }
];

export default function Feed() {
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>(mockPosts);

  const addPost = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  const updatePost = (postId: string, updatedPost: Partial<Post>) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, ...updatedPost } : post
    ));
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      {/* Crear nueva publicación (solo para admin y teachers autenticados) */}
      {isAuthenticated && (user?.role === 'admin' || user?.role === 'teacher') && (
        <CreatePost currentUser={user} onPostCreated={addPost} />
      )}
      
      {/* Lista de publicaciones - Visible para todos */}
      <div className="space-y-6 mt-6">
        {posts.map(post => (
          <PostCard 
            key={post.id} 
            post={post} 
            currentUser={user}
            onUpdate={updatePost}
          />
        ))}
      </div>

      {/* Mensaje para usuarios no autenticados */}
      {!isAuthenticated && (
        <div className="text-center py-8">
          <div className="bg-blue-50 rounded-lg p-6 max-w-md mx-auto">
            <div className="text-blue-600 text-4xl mb-4">🔒</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Inicia sesión para interactuar
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Puedes ver las publicaciones, pero necesitas iniciar sesión para dar like, comentar o compartir.
            </p>
          </div>
        </div>
      )}

      {/* Mensaje cuando no hay publicaciones */}
      {posts.length === 0 && isAuthenticated && (user?.role === 'admin' || user?.role === 'teacher') && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay publicaciones aún</h3>
          <p className="text-gray-500">Sé el primero en compartir algo con la comunidad.</p>
        </div>
      )}
    </div>
  );
}