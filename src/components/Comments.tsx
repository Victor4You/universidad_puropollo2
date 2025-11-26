'use client';

import { useState } from 'react';
import { Post, User, Comment as CommentType } from '@/types/post';
import Avatar from './Avatar';

interface CommentsProps {
  post: Post;
  currentUser: User;
  onCommentAdded: (comment: CommentType) => void;
}

export default function Comments({ post, currentUser, onCommentAdded }: CommentsProps) {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);

    // Simular envío
    setTimeout(() => {
      const comment: CommentType = {
        id: Date.now().toString(),
        user: currentUser,
        content: newComment.trim(),
        timestamp: 'Hace unos momentos',
        likes: 0,
        liked: false
      };

      onCommentAdded(comment);
      setNewComment('');
      setIsSubmitting(false);
    }, 500);
  };

  const handleLikeComment = (commentId: string, currentlyLiked: boolean) => {
    // En una app real, aquí harías una llamada a la API
    console.log(`Comment ${commentId} ${currentlyLiked ? 'unliked' : 'liked'}`);
  };

  return (
    <div className="border-t bg-gray-50">
      {/* Lista de comentarios existentes */}
      {post.comments.length > 0 && (
        <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
          {post.comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              <Avatar 
                src={comment.user.avatar} 
                alt={`Avatar de ${comment.user.name}`}
                size="w-8 h-8"
              />
              <div className="flex-1">
                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-sm text-gray-900">
                      {comment.user.name}
                    </span>
                    <span className="text-xs text-gray-500">{comment.timestamp}</span>
                  </div>
                  <p className="text-gray-800 text-sm">{comment.content}</p>
                </div>
                <div className="flex items-center space-x-4 mt-1 px-2">
                  <button
                    onClick={() => handleLikeComment(comment.id, comment.liked)}
                    className={`text-xs ${
                      comment.liked ? 'text-red-600 font-medium' : 'text-gray-500'
                    }`}
                  >
                    Me gusta
                  </button>
                  <button className="text-xs text-gray-500">Responder</button>
                  {comment.likes > 0 && (
                    <span className="text-xs text-gray-500">{comment.likes} me gusta</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Formulario para nuevo comentario */}
      <div className="p-4 border-t">
        <form onSubmit={handleSubmitComment} className="flex space-x-3">
          <Avatar 
            src={currentUser.avatar} 
            alt={`Tu avatar`}
            size="w-8 h-8"
          />
          <div className="flex-1">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe un comentario..."
              className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={!newComment.trim() || isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? '...' : 'Comentar'}
          </button>
        </form>
      </div>
    </div>
  );
}