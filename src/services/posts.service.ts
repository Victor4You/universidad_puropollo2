// src/services/posts.service.ts - ARCHIVO COMPLETO
import api from "@/lib/api/axios"; // Importamos la instancia que configuramos antes
import { Post, Comment } from "@/lib/types/post.types";

export const postsService = {
  // Obtiene las publicaciones de la base de datos
  async getPosts(): Promise<Post[]> {
    const response = await api.get<Post[]>("/posts");
    return response.data;
  },

  // Crea una publicación real con soporte para FormData (fotos/documentos)
  async createPost(formData: FormData): Promise<Post> {
    // Usamos FormData porque para subir fotos/documentos no basta con un string
    const response = await api.post<Post>("/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Registra el Like en la base de datos
  async likePost(postId: string): Promise<void> {
    await api.patch(`/posts/${postId}/like`);
  },

  // Guarda el comentario de forma permanente
  async commentOnPost(postId: string, content: string): Promise<Comment> {
    const response = await api.post<Comment>(`/posts/${postId}/comments`, {
      content,
    });
    return response.data;
  },

  // Registra la acción de compartir
  async sharePost(postId: string): Promise<void> {
    await api.patch(`/posts/${postId}/share`);
  },
};
