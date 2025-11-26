'use client';

import { useState } from 'react';
import { Post, User } from '@/types/post';
import Reactions from './Reactions';
import Comments from './Comments';
import Avatar from './Avatar';

interface PostCardProps {
  post: Post;
  currentUser: User | null;
  onUpdate: (postId: string, updatedPost: Partial<Post>) => void;
}

export default function PostCard({ post, currentUser, onUpdate }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    if (!currentUser) return; // No hacer nada si no está autenticado
    
    const updatedLikes = post.liked ? post.likes - 1 : post.likes + 1;
    onUpdate(post.id, {
      likes: updatedLikes,
      liked: !post.liked
    });
  };

  const handleShare = () => {
    if (!currentUser) return; // No hacer nada si no está autenticado
    
    const updatedShares = post.shared ? post.shares - 1 : post.shares + 1;
    onUpdate(post.id, {
      shares: updatedShares,
      shared: !post.shared
    });
  };

  const handleCommentAdded = (newComment: any) => {
    if (!currentUser) return; // No hacer nada si no está autenticado
    
    const updatedComments = [...post.comments, newComment];
    onUpdate(post.id, { comments: updatedComments });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header de la publicación */}
      <div className="p-6">
        <div className="flex items-start space-x-3">
          <Avatar 
            src={post.user.avatar} 
            alt={`Avatar de ${post.user.name}`}
            size="w-12 h-12"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900">{post.user.name}</h3>
              {post.user.role === 'admin' && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  Administrador
                </span>
              )}
              {post.user.role === 'teacher' && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Profesor
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm">{post.user.role} • {post.timestamp}</p>
          </div>
        </div>

        {/* Contenido de la publicación */}
        <div className="mt-4">
          <p className="text-gray-800 whitespace-pre-line">{post.content}</p>
          
          {/* Media: Imagen */}
          {post.media?.type === 'image' && (
            <div className="mt-4">
              <img 
                src={post.media.url} 
                alt="Contenido multimedia"
                className="rounded-lg w-full max-h-96 object-cover"
              />
            </div>
          )}

          {/* Media: Archivo */}
          {post.media?.type === 'file' && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">📄</div>
                <div>
                  <p className="font-medium text-gray-900">{post.media.name || 'Archivo adjunto'}</p>
                  <p className="text-sm text-gray-500">Haz clic para descargar</p>
                </div>
              </div>
            </div>
          )}

          {/* Media: Enlace */}
          {post.media?.type === 'link' && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <a href={post.media.url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 hover:bg-gray-100 rounded-lg p-2">
                <div className="text-2xl">🔗</div>
                <div>
                  <p className="font-medium text-gray-900">Enlace compartido</p>
                  <p className="text-sm text-gray-500">{post.media.url}</p>
                </div>
              </a>
            </div>
          )}

          {/* Encuesta */}
          {post.poll && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <h4 className="font-semibold text-gray-900 mb-3">{post.poll.question}</h4>
              <div className="space-y-2">
                {post.poll.options.map((option) => {
                  const totalVotes = post.poll!.options.reduce((sum, opt) => sum + opt.votes, 0);
                  const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                  
                  return (
                    <div key={option.id} className="relative">
                      <button
                        disabled={post.poll?.voted}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                          post.poll?.voted 
                            ? 'bg-blue-50 border-blue-200' 
                            : 'bg-white border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>{option.text}</span>
                          {post.poll?.voted && (
                            <span className="text-sm text-gray-600">
                              {option.votes} ({percentage.toFixed(1)}%)
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
              {!post.poll.voted && (
                <p className="text-sm text-gray-500 mt-2">{post.poll.options.reduce((sum, opt) => sum + opt.votes, 0)} votos</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Estadísticas e interacciones */}
      <div className="px-6 pb-3">
        {(post.likes > 0 || post.comments.length > 0 || post.shares > 0) && (
          <div className="flex items-center space-x-4 text-sm text-gray-500 border-b pb-3">
            {post.likes > 0 && (
              <span>{post.likes} me gusta</span>
            )}
            {post.comments.length > 0 && (
              <span>{post.comments.length} comentarios</span>
            )}
            {post.shares > 0 && (
              <span>{post.shares} compartidos</span>
            )}
          </div>
        )}

        {/* Botones de interacción */}
        <Reactions
          post={post}
          onLike={handleLike}
          onComment={() => setShowComments(!showComments)}
          onShare={handleShare}
        />
      </div>

      {/* Sección de comentarios */}
      {showComments && (
        <Comments
          post={post}
          currentUser={currentUser}
          onCommentAdded={handleCommentAdded}
        />
      )}
    </div>
  );
}