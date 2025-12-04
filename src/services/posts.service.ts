// src/services/posts.service.ts - ARCHIVO COMPLETO
import { Post, Comment } from '@/lib/types/post.types';

export const postsService = {
  async getPosts(): Promise<Post[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockPosts: Post[] = [
          {
            id: '1',
            user: {
              id: 'user1',
              name: 'Admin Universidad',
              email: 'admin@universidad.edu',
              role: 'admin',
              avatar: null,
              createdAt: '2024-01-01',
              department: 'Administración'
            },
            content: '¡Bienvenidos al nuevo sistema de la Universidad PuroPolio!',
            timestamp: '2024-07-15T10:30:00Z',
            likes: 24,
            liked: false,
            comments: [],
            shares: 5,
            shared: false
          },
          {
            id: '2',
            user: {
              id: 'user2',
              name: 'Profesor Carlos Mendoza',
              email: 'carlos.mendoza@universidad.edu',
              role: 'teacher',
              avatar: null,
              createdAt: '2023-09-01',
              department: 'Matemáticas'
            },
            content: 'Recordatorio: Las evaluaciones del primer parcial comienzan la próxima semana.',
            timestamp: '2024-12-14T09:15:00Z',
            likes: 18,
            liked: false,
            comments: [
              {
                id: 'comment1',
                user: {
                  id: 'user3',
                  name: 'Estudiante Ejemplo',
                  email: 'estudiante@universidad.edu',
                  role: 'student',
                  avatar: null,
                  createdAt: '2024-08-01',
                  department: 'Ingeniería'
                },
                content: '¿Habrá repaso?',
                timestamp: '2024-12-14T10:00:00Z',
                likes: 2,
                liked: false
              }
            ],
            shares: 2,
            shared: false
          }
        ];
        resolve(mockPosts);
      }, 500);
    });
  },

  async createPost(content: string): Promise<Post> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newPost: Post = {
          id: Date.now().toString(),
          user: {
            id: 'current-user',
            name: 'Usuario Actual',
            email: 'usuario@ejemplo.com',
            role: 'user',
            avatar: null,
            createdAt: new Date().toISOString(),
            department: 'General'
          },
          content,
          timestamp: new Date().toISOString(),
          likes: 0,
          liked: false,
          comments: [],
          shares: 0,
          shared: false
        };
        resolve(newPost);
      }, 300);
    });
  },

  async likePost(postId: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Liked post ${postId}`);
        resolve();
      }, 200);
    });
  },

  async commentOnPost(postId: string, content: string): Promise<Comment> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newComment: Comment = {
          id: Date.now().toString(),
          user: {
            id: 'current-user',
            name: 'Usuario Actual',
            email: 'usuario@ejemplo.com',
            role: 'user',
            avatar: null,
            createdAt: new Date().toISOString(),
            department: 'General'
          },
          content,
          timestamp: new Date().toISOString(),
          likes: 0,
          liked: false
        };
        resolve(newComment);
      }, 300);
    });
  },

  async sharePost(postId: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Shared post ${postId}`);
        resolve();
      }, 200);
    });
  }
};