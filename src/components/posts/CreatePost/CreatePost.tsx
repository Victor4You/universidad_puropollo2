// src/components/posts/CreatePost/CreatePost.tsx - VERSIÓN RESPONSIVA
'use client';

import { useState } from 'react';
import { User, Post } from '@/lib/types/post.types';
import { Avatar } from '@/components/ui/Avatar/Avatar';

interface CreatePostProps {
  currentUser: User;
  onPostCreated: (post: Post) => void;
}

export default function CreatePost({ currentUser, onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canCreate = currentUser.role === 'admin' || currentUser.role === 'teacher';
  
  if (!canCreate) {
    return (
      <div className="p-3 lg:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-700 text-center text-sm lg:text-base">
          Solo administradores y profesores pueden crear publicaciones.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || !currentUser) return;
    
    setIsSubmitting(true);
    
    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newPost: Post = {
      id: `post_${Date.now()}`,
      user: currentUser,
      content: content.trim(),
      timestamp: new Date().toISOString(),
      likes: 0,
      liked: false,
      comments: [],
      shares: 0,
      shared: false,
    };
    
    onPostCreated(newPost);
    setContent('');
    setIsSubmitting(false);
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg lg:rounded-xl shadow-md p-4 lg:p-6 mb-4 lg:mb-6">
      <div className="flex space-x-3 lg:space-x-4">
        <Avatar 
          src={currentUser.avatar} 
          alt={currentUser.name}
          size="md"
          fallbackLetter={currentUser.name.charAt(0)}
          className="flex-shrink-0"
        />
        
        <form onSubmit={handleSubmit} className="flex-1 min-w-0">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`¿Qué quieres compartir, ${currentUser.name}?`}
            className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm lg:text-base"
            rows={window.innerWidth < 640 ? 2 : 3}
            disabled={isSubmitting}
          />
          
          <div className="mt-3 lg:mt-4 flex justify-between items-center">
            <div className="flex space-x-1 lg:space-x-2">
              {/* Botones para adjuntar contenido */}
              <button 
                type="button" 
                className="p-1 lg:p-2 text-gray-500 hover:text-blue-600 text-lg lg:text-xl"
                aria-label="Añadir imagen"
              >
                📷
              </button>
              <button 
                type="button" 
                className="p-1 lg:p-2 text-gray-500 hover:text-blue-600 text-lg lg:text-xl"
                aria-label="Añadir archivo"
              >
                📎
              </button>
              <button 
                type="button" 
                className="p-1 lg:p-2 text-gray-500 hover:text-blue-600 text-lg lg:text-xl"
                aria-label="Añadir gráfico"
              >
                📊
              </button>
            </div>
            
            <button
              type="submit"
              disabled={!content.trim() || isSubmitting}
              className="px-4 lg:px-6 py-1.5 lg:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base font-medium transition-colors"
            >
              {isSubmitting ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}