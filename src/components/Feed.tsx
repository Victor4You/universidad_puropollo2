// src/components/Feed.tsx - VERSIÓN SIMPLIFICADA
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Post } from '@/lib/types/post.types';
import CreatePost from '@/components/posts/CreatePost/CreatePost';
import PostCard from '@/components/posts/PostCard/PostCard';

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

  const addPost = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  const handleLike = (postId: string) => {
    if (!isAuthenticated) {
      return; // Silenciosamente no hacer nada
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
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
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

  return (
    <div className="max-w-2xl mx-auto p-4">
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

      {/* Formulario para crear publicación - SOLO si usuario autenticado */}
      {isAuthenticated && user && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            ¿Qué quieres compartir, {user.name}?
          </h2>
          <CreatePost 
            currentUser={user}
            onPostCreated={addPost} 
          />
        </div>
      )}

      {/* Mensaje sutil para usuarios no autenticados */}
      {!isAuthenticated && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <div className="flex items-start">
            <div className="mr-3 text-blue-500">💡</div>
            <div>
              <p className="text-blue-700 text-sm">
                <strong>Inicia sesión</strong> para poder dar like, comentar, compartir y crear publicaciones
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lista de publicaciones - VISIBLE PARA TODOS */}
      <div className="space-y-6">
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
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No hay publicaciones aún
            </h3>
            <p className="text-gray-500">
              Sé el primero en compartir algo con la comunidad universitaria.
            </p>
            {!isAuthenticated && (
              <p className="text-blue-600 mt-3">
                Inicia sesión para crear la primera publicación
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}