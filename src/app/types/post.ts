export interface User {
  id: string;
  name: string;
  role: 'admin' | 'user' | 'teacher' | 'student';
  avatar: string | null;
  email: string;
}

export interface Post {
  id: string;
  user: User;
  content: string;
  media?: {
    type: 'image' | 'file' | 'link';
    url: string;
    name?: string;
  };
  poll?: {
    question: string;
    options: { id: string; text: string; votes: number }[];
    voted?: boolean;
  };
  timestamp: string;
  likes: number;
  liked: boolean;
  comments: Comment[];
  shares: number;
  shared: boolean;
}

export interface Comment {
  id: string;
  user: User;
  content: string;
  timestamp: string;
  likes: number;
  liked: boolean;
}