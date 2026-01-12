// Types for Chatnary E-Library System

export type UserRole = 'user' | 'librarian' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  quota: {
    used: number; // in bytes
    limit: number; // in bytes
  };
  createdAt: string;
}

export interface ProjectMember {
  userId: string;
  role: 'viewer' | 'editor' | 'owner';
  joinedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  ownerId: string;
  members: ProjectMember[];
  documentIds: string[];
  createdAt: string;
  updatedAt: string;
}

export type DocumentStatus = 'processing' | 'done' | 'error';
export type DocumentType = 'pdf' | 'docx';

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  status: DocumentStatus;
  size: number; // in bytes
  pageCount?: number;
  uploadedBy: string;
  uploadedAt: string;
  allowDownload: boolean;
  projectId?: string;
  url?: string; // URL to the document file
  metadata?: {
    title?: string;
    author?: string;
    year?: number;
    language?: string;
    category?: string;
    tags?: string[];
  };
}

export interface Citation {
  documentId: string;
  documentName: string;
  pageNumber: number;
  excerpt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  timestamp: string;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  projectId?: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface QuizOption {
  label: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  citation: Citation;
}

export interface Quiz {
  id: string;
  projectId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: QuizQuestion[];
  createdAt: string;
}

export interface QuizResult {
  quizId: string;
  userId: string;
  answers: Record<string, 'A' | 'B' | 'C' | 'D'>;
  score: number;
  totalQuestions: number;
  completedAt: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  documentIds: string[];
  access: 'public' | 'members' | 'faculty';
  createdBy: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface SystemStats {
  totalUsers: number;
  newUsersThisMonth: number;
  totalDocuments: number;
  totalStorage: number; // in bytes
  aiQueriesThisMonth: number;
  tokenUsage: number;
}
