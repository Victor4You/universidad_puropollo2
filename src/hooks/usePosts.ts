// src/hooks/usePosts.ts
"use client";
import { useState, useEffect, useCallback } from "react";
import { Post } from "@/lib/types/post.types";
import { postsService } from "@/services/posts.service";
import { useAuth } from "@/hooks/useAuth";

export function usePosts() {
  const { isAuthenticated, user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await postsService.getPosts();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Error al cargar las publicaciones");
      console.error("Error fetching posts:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const addPost = async (formData: FormData): Promise<Post> => {
    try {
      const newPost = await postsService.createPost(formData);
      setPosts((prev) => [newPost, ...prev]);
      return newPost;
    } catch (err) {
      console.error("Error creating post:", err);
      throw err;
    }
  };

  const likePost = async (postId: string) => {
    try {
      const updatedPost = await postsService.likePost(postId);
      if (updatedPost) {
        setPosts((prev) =>
          prev.map((p) => (p?.id === postId ? updatedPost : p)),
        );
      }
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const commentOnPost = async (postId: string, content: string) => {
    try {
      await postsService.commentOnPost(postId, content);
      const data = await postsService.getPosts();
      setPosts(data);
    } catch (err) {
      console.error("Error commenting on post:", err);
    }
  };

  const sharePost = async (postId: string) => {
    try {
      const updatedPost = await postsService.sharePost(postId);
      if (updatedPost) {
        setPosts((prev) =>
          prev.map((p) => (p?.id === postId ? updatedPost : p)),
        );
      }
    } catch (err) {
      console.error("Error sharing post:", err);
    }
  };

  const voteOnPoll = async (postId: string, optionIndex: number) => {
    // AJUSTE: Si no hay usuario en el estado, no disparamos la petición
    if (!user?.id) {
      console.warn("⚠️ Esperando identificación de usuario para votar...");
      return;
    }

    try {
      const updatedPost = await postsService.votePoll(postId, optionIndex);
      if (updatedPost) {
        setPosts((prev) =>
          prev.map((p) => (p?.id === postId ? updatedPost : p)),
        );
      }
    } catch (err) {
      console.error("Error voting:", err);
    }
  };

  return {
    posts,
    setPosts,
    isLoading,
    error,
    addPost,
    likePost,
    commentOnPost,
    sharePost,
    voteOnPoll,
    refetch: fetchPosts,
  };
}
