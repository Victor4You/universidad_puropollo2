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
    if (!currentUser) return;
    
    const updatedLikes = post.liked ? post.likes - 1 : post.likes + 1;
    onUpdate(post.id, {
      likes: updatedLikes,
      liked: !post.liked
    });
  };

  const handleShare = () => {
    if (!currentUser) return;
    
    const updatedShares = post.shared ? post.shares - 1 : post.shares + 1;
    onUpdate(post.id, {
      shares: updatedShares,
      shared: !post.shared
    });
  };

  const handleCommentAdded = (newComment: any) => {
    if (!currentUser) return;
    
    const updatedComments = [...post.comments, newComment];
    onUpdate(post.id, { comments: updatedComments });
  };

  const handleVote = (optionId: string) => {
    if (!currentUser || !post.poll || post.poll.voted) return;

    const updatedOptions = post.poll.options.map(option => 
      option.id === optionId 
        ? { ...option, votes: option.votes + 1 }
        : option
    );

    onUpdate(post.id, {
      poll: {
        ...post.poll,
        options: updatedOptions,
        voted: true
      }
    });
  };

  // Calcular totalVotes fuera del map para que esté disponible en todo el componente
  const totalVotes = post.poll ? post.poll.options.reduce((sum, opt) => sum + opt.votes, 0) : 0;

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

          {post.media?.type === 'file' && (
  <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
    <div className="flex items-center space-x-3">
      <div className="text-2xl">
        {post.media.name?.endsWith('.pdf') ? '📕' :
         post.media.name?.endsWith('.doc') || post.media.name?.endsWith('.docx') ? '📄' :
         post.media.name?.endsWith('.xls') || post.media.name?.endsWith('.xlsx') ? '📊' :
         post.media.name?.endsWith('.ppt') || post.media.name?.endsWith('.pptx') ? '📽️' :
         post.media.name?.endsWith('.zip') || post.media.name?.endsWith('.rar') ? '📦' : '📎'}
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{post.media.name || 'Archivo adjunto'}</p>
        <p className="text-sm text-gray-500">Haz clic para descargar</p>
      </div>
      <a 
        href={post.media.url} 
        download={post.media.name}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        Descargar
      </a>
    </div>
  </div>
)}

          {/* Encuesta */}
          {post.poll && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <h4 className="font-semibold text-gray-900 mb-3">{post.poll.question}</h4>
              <div className="space-y-2">
                {post.poll.options.map((option) => {
                  const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                  
                  return (
                    <div key={option.id} className="relative">
                      <button
                        onClick={() => handleVote(option.id)}
                        disabled={!currentUser || post.poll?.voted || currentUser.role === 'admin' || currentUser.role === 'teacher'}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                          post.poll?.voted 
                            ? 'bg-blue-50 border-blue-200' 
                            : currentUser && (currentUser.role === 'student' || currentUser.role === 'user')
                            ? 'bg-white border-gray-200 hover:border-blue-300 cursor-pointer'
                            : 'bg-gray-100 border-gray-200 cursor-not-allowed'
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
              <p className="text-sm text-gray-500 mt-2">
                {post.poll.voted 
                  ? `✅ Ya votaste - ${totalVotes} votos totales`
                  : `${totalVotes} votos totales`
                }
              </p>
              {!currentUser && (
                <p className="text-sm text-yellow-600 mt-2">
                  ⚠️ Inicia sesión para votar en la encuesta
                </p>
              )}
              {currentUser && (currentUser.role === 'admin' || currentUser.role === 'teacher') && (
                <p className="text-sm text-gray-500 mt-2">
                  👨‍🏫 Los administradores y profesores no pueden votar en las encuestas
                </p>
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