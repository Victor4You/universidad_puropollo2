'use client';

import { useState, useRef } from 'react';
import { User, Post } from '@/types/post';

interface CreatePostProps {
  currentUser: User;
  onPostCreated: (post: Post) => void;
}

export default function CreatePost({ currentUser, onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaType, setMediaType] = useState<'none' | 'image' | 'file' | 'link' | 'poll'>('none');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);

    // Simular envío
    setTimeout(() => {
      const newPost: Post = {
        id: Date.now().toString(),
        user: currentUser,
        content: content.trim(),
        timestamp: 'Hace unos momentos',
        likes: 0,
        liked: false,
        comments: [],
        shares: 0,
        shared: false
      };

      onPostCreated(newPost);
      setContent('');
      setMediaType('none');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"></div>
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Comparte una actualización, noticia o recurso con la comunidad..."
              className="w-full border border-gray-300 rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
            
            {/* Opciones de medios */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setMediaType('image')}
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-100"
                >
                  <span>🖼️</span>
                  <span className="text-sm">Imagen</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMediaType('poll')}
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-100"
                >
                  <span>📊</span>
                  <span className="text-sm">Encuesta</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-100"
                >
                  <span>📎</span>
                  <span className="text-sm">Archivo</span>
                </button>
              </div>
              
              <button
                type="submit"
                disabled={!content.trim() || isSubmitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Publicando...' : 'Publicar'}
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setMediaType('file');
                }
              }}
            />
          </form>
        </div>
      </div>
    </div>
  );
}