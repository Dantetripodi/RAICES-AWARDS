export interface Nominee {
  id: string;
  name: string;
  avatar?: string; // URL to an image or emoji
}

export interface Category {
  id: string;
  title: string;
  description: string;
  emoji: string;
  nominees: Nominee[];
}

export interface Vote {
  studentName: string;
  categoryId: string;
  nomineeId: string;
  timestamp: number;
}

export interface AppState {
  categories: Category[];
  votes: Vote[];
  adminPassword?: string; // Simple protection
}

export enum UserRole {
  LANDING = 'LANDING',
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN'
}

export interface CommentaryResponse {
  headline: string;
  body: string;
}

export interface VoteAnalysis {
  categoryHighlights: {
    categoryId: string;
    highlightText: string;
    isTightRace: boolean;
    leaderId?: string;
  }[];
  generalCommentary: string;
}
