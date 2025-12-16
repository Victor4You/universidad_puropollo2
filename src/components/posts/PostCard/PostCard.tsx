// src/components/posts/PostCard/PostCard.tsx - VERSIÓN COMPLETA RESPONSIVA
'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/lib/types/post.types';
import Reactions from '@/components/shared/Reactions/Reactions';
import Comments from '@/components/posts/Comments/Comments';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import { useAuth } from '@/hooks/useAuth';

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string, content: string) => void;
  onShare?: (postId: string) => void;
}

export default function PostCard({ post, onLike, onComment, onShare }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user: currentUser } = useAuth();

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLike = () => {
    if (!currentUser) return;
    onLike?.(post.id);
  };

  const handleShare = () => {
    if (!currentUser) return;
    onShare?.(post.id);
  };

  const handleCommentAdded = (content: string) => {
    if (!currentUser) return;
    onComment?.(post.id, content);
  };

  const handleVote = (optionId: string) => {
    if (!currentUser || !post.poll || post.poll.voted) return;
    alert(`¡Voto registrado para la opción ${optionId}!`);
  };

  const totalVotes = post.poll ? post.poll.options.reduce((sum, opt) => sum + opt.votes, 0) : 0;

  // Formatear fecha según dispositivo
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    if (isMobile) {
      return date.toLocaleDateString('es-ES', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4 lg:mb-6">
      {/* Header */}
      <div className="p-4 lg:p-6">
        <div className="flex items-start space-x-3">
          <Avatar 
            src={post.user.avatar} 
            alt={`Avatar de ${post.user.name}`}
            size={isMobile ? "sm" : "md"}
            fallbackLetter={post.user.name.charAt(0)}
            className="flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-1 sm:mb-0">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900 text-sm lg:text-base truncate">
                    {post.user.name}
                  </h3>
                  {post.user.role === 'admin' && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-full flex-shrink-0">
                      {isMobile ? 'A' : 'Admin'}
                    </span>
                  )}
                  {post.user.role === 'teacher' && (
                    <span className="bg-green-100 text-green-800 text-xs px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-full flex-shrink-0">
                      {isMobile ? 'P' : 'Prof'}
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-xs lg:text-sm truncate">
                  {post.user.role} • {formatDate(post.timestamp)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="mt-3 lg:mt-4">
          <p className="text-gray-800 whitespace-pre-line text-sm lg:text-base break-words">
            {post.content}
          </p>
          
          {/* Imagen */}
          {post.media?.type === 'image' && (
            <div className="mt-3 lg:mt-4">
              <img 
                src={post.media.url} 
                alt="Contenido multimedia"
                className="rounded-lg w-full h-auto max-h-48 lg:max-h-96 object-cover"
              />
            </div>
          )}

          {/* Archivo */}
          {post.media?.type === 'file' && (
            <div className="mt-3 lg:mt-4 p-3 lg:p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center space-x-2 lg:space-x-3">
                <div className="text-xl lg:text-2xl flex-shrink-0">
                  {post.media.name?.endsWith('.pdf') ? '📕' :
                   post.media.name?.endsWith('.doc') || post.media.name?.endsWith('.docx') ? '📄' :
                   post.media.name?.endsWith('.xls') || post.media.name?.endsWith('.xlsx') ? '📊' :
                   '📎'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm lg:text-base truncate">
                    {post.media.name || 'Archivo adjunto'}
                  </p>
                  <p className="text-gray-500 text-xs lg:text-sm">
                    Haz clic para descargar
                  </p>
                </div>
                <a 
                  href={post.media.url} 
                  download={post.media.name}
                  className="bg-blue-600 text-white px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg text-xs lg:text-sm font-medium hover:bg-blue-700 transition-colors flex-shrink-0"
                >
                  {isMobile ? '⬇️' : 'Descargar'}
                </a>
              </div>
            </div>
          )}

          {/* Encuesta */}
          {post.poll && (
            <div className="mt-3 lg:mt-4 p-3 lg:p-4 bg-gray-50 rounded-lg border">
              <h4 className="font-semibold text-gray-900 mb-2 lg:mb-3 text-sm lg:text-base">
                {post.poll.question}
              </h4>
              <div className="space-y-1.5 lg:space-y-2">
                {post.poll.options.map((option) => {
                  const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                  
                  return (
                    <div key={option.id} className="relative">
                      <button
                        onClick={() => handleVote(option.id)}
                        disabled={!currentUser || post.poll?.voted || currentUser.role === 'admin' || currentUser.role === 'teacher'}
                        className={`w-full text-left p-2 lg:p-3 rounded-lg border-2 transition-all text-sm lg:text-base ${
                          post.poll?.voted 
                            ? 'bg-blue-50 border-blue-200' 
                            : currentUser && (currentUser.role === 'student' || currentUser.role === 'user')
                            ? 'bg-white border-gray-200 hover:border-blue-300 cursor-pointer'
                            : 'bg-gray-100 border-gray-200 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="truncate pr-2">{option.text}</span>
                          {post.poll?.voted && (
                            <span className="text-gray-600 text-xs lg:text-sm flex-shrink-0">
                              {isMobile ? `${percentage.toFixed(0)}%` : `${option.votes} (${percentage.toFixed(1)}%)`}
                            </span>
                          )}
                        </div>
                        {post.poll?.voted && (
                          <div 
                            className="absolute bottom-0 left-0 h-1 bg-blue-500 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
              <p className="text-gray-500 text-xs lg:text-sm mt-2">
                {post.poll.voted 
                  ? `✅ ${isMobile ? 'Votaste' : 'Ya votaste'} - ${totalVotes} ${isMobile ? 'votos' : 'votos totales'}`
                  : `${totalVotes} ${isMobile ? 'votos' : 'votos totales'}`
                }
              </p>
              {!currentUser && (
                <p className="text-yellow-600 text-xs lg:text-sm mt-1">
                  ⚠️ {isMobile ? 'Inicia sesión' : 'Inicia sesión para votar'}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Estadísticas */}
      <div className="px-4 lg:px-6 pb-2 lg:pb-3">
        {(post.likes > 0 || post.comments.length > 0 || post.shares > 0) && (
          <div className="flex items-center space-x-3 lg:space-x-4 text-xs lg:text-sm text-gray-500 border-b pb-2 lg:pb-3">
            {post.likes > 0 && (
              <span>{post.likes} {isMobile ? '👍' : 'me gusta'}</span>
            )}
            {post.comments.length > 0 && (
              <span>{post.comments.length} {isMobile ? '💬' : 'comentarios'}</span>
            )}
            {post.shares > 0 && (
              <span>{post.shares} {isMobile ? '↗️' : 'compartidos'}</span>
            )}
          </div>
        )}

        {/* Botones de interacción */}
        <Reactions
          post={post}
          onLike={handleLike}
          onComment={() => setShowComments(!showComments)}
          onShare={handleShare}
          isMobile={isMobile} // ← Pasar isMobile
        />
      </div>

      {/* Comentarios */}
      {showComments && (
        <div className="border-t">
          <Comments 
            post={post}
            currentUser={currentUser}
            onCommentAdded={(comment) => {
              onComment?.(post.id, comment.content);
            }}
            isMobile={isMobile} // ← Pasar isMobile
          />
        </div>
      )}
    </div>
  );
}