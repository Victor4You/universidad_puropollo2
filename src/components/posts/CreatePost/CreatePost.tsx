// src/components/posts/CreatePost/CreatePost.tsx
'use client';

import { useState } from 'react';
import { User, Post } from '@/lib/types/post.types';
import { Avatar } from '@/components/ui/Avatar/Avatar';

// Hacer currentUser opcional
interface CreatePostProps {
  currentUser?: User | null;  // ← Cambiar a opcional
  onPostCreated: (newPost: Post) => void;
}

export default function CreatePost({ currentUser, onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // No renderizar si no hay usuario
  if (!currentUser) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex space-x-4">
        <Avatar 
          src={currentUser.avatar} 
          alt={currentUser.name}
          size="md"
          fallbackLetter={currentUser.name.charAt(0)}
        />
        
        <form onSubmit={handleSubmit} className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`¿Qué quieres compartir, ${currentUser.name}?`}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            disabled={isSubmitting}
          />
          
          <div className="mt-4 flex justify-between items-center">
            <div className="flex space-x-2">
              {/* Botones para adjuntar contenido */}
              <button type="button" className="p-2 text-gray-500 hover:text-blue-600">
                📷
              </button>
              <button type="button" className="p-2 text-gray-500 hover:text-blue-600">
                📎
              </button>
              <button type="button" className="p-2 text-gray-500 hover:text-blue-600">
                📊
              </button>
            </div>
            
            <button
              type="submit"
              disabled={!content.trim() || isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}