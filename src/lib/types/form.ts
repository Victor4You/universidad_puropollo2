// types/form.ts
export interface Question {
  id: string;
  type: 'cerrada' | 'abierta';
  question: string;
  options?: string[];
  correctAnswer?: string;
}

export interface VideoResource {
  id: string;
  title: string;
  url: string;
  checked: boolean;
}

export interface PDFResource {
  id: string;
  title: string;
  url: string;
  checked: boolean;
}

export interface Period {
  startDate: string;
  endDate: string;
}

export interface CourseFormData {
  category: string;
  title: string;
  description: string;
  quizDuration: number;
  periods: Period[];
  bannerText: string;
  videos: VideoResource[];
  pdfs: PDFResource[];
  questions: Question[];
}