// src/hooks/usePosts.ts - VERSIÓN FINAL
'use client';

import { useState, useEffect } from 'react';
import { Post, Comment } from '@/lib/types/post.types';
import { postsService } from '@/services/posts.service';

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await postsService.getPosts();
      setPosts(data);
    } catch (err) {
      setError('Error al cargar las publicaciones');
      console.error('Error fetching posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const addPost = async (content: string): Promise<Post> => {
    try {
      const newPost = await postsService.createPost(content);
      setPosts(prev => [newPost, ...prev]);
      return newPost;
    } catch (err) {
      console.error('Error creating post:', err);
      throw err;
    }
  };

  const likePost = async (postId: string) => {
    try {
      await postsService.likePost(postId);
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1, liked: true }
          : post
      ));
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const commentOnPost = async (postId: string, content: string) => {
    try {
      const newComment = await postsService.commentOnPost(postId, content);
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment]
          };
        }
        return post;
      }));
    } catch (err) {
      console.error('Error commenting on post:', err);
    }
  };

  const sharePost = async (postId: string) => {
    try {
      await postsService.sharePost(postId);
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, shares: post.shares + 1, shared: true }
          : post
      ));
    } catch (err) {
      console.error('Error sharing post:', err);
    }
  };

  return {
    posts,
    isLoading,
    error,
    addPost,
    likePost,
    commentOnPost,
    sharePost,
    refetch: fetchPosts,
  };
}