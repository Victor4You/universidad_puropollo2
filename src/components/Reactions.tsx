'use client';

import { Post } from '@/types/post';
import { useAuth } from '@/contexts/AuthContext';

interface ReactionsProps {
  post: Post;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
}

export default function Reactions({ post, onLike, onComment, onShare }: ReactionsProps) {
  const { isAuthenticated } = useAuth();

  const handleLike = () => {
    if (!isAuthenticated) return;
    onLike();
  };

  const handleComment = () => {
    if (!isAuthenticated) return;
    onComment();
  };

  const handleShare = () => {
    if (!isAuthenticated) return;
    onShare();
  };

  return (
    <div className="flex justify-between pt-3">
      <button
        onClick={handleLike}
        disabled={!isAuthenticated}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors flex-1 justify-center ${
          !isAuthenticated 
            ? 'text-gray-400 cursor-not-allowed' 
            : post.liked 
            ? 'bg-red-50 text-red-600 hover:bg-red-100' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <span className="text-lg">{post.liked ? '❤️' : '🤍'}</span>
        <span className="font-medium">Me gusta</span>
      </button>

      <button
        onClick={handleComment}
        disabled={!isAuthenticated}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors flex-1 justify-center ${
          !isAuthenticated 
            ? 'text-gray-400 cursor-not-allowed' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <span className="text-lg">💬</span>
        <span className="font-medium">Comentar</span>
      </button>

      <button
        onClick={handleShare}
        disabled={!isAuthenticated}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors flex-1 justify-center ${
          !isAuthenticated 
            ? 'text-gray-400 cursor-not-allowed' 
            : post.shared 
            ? 'bg-green-50 text-green-600 hover:bg-green-100' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <span className="text-lg">{post.shared ? '🔄' : '↗️'}</span>
        <span className="font-medium">Compartir</span>
      </button>
    </div>
  );
}