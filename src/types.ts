export type QuizCategory = 'Python' | 'Java' | 'SQL' | 'General Knowledge';

export interface Question {
  id: string;
  category: QuizCategory;
  questionText: string;
  options: [string, string, string, string]; // Exactly 4 options
  correctOptionIndex: number; // 0, 1, 2, or 3
  explanation?: string;
  isCustom?: boolean;
  createdAt?: string;
}

export interface QuizResult {
  id: string;
  category: QuizCategory;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  scorePercentage: number;
  date: string;
  timeSpentSeconds: number;
  userAnswers: {
    questionId: string;
    questionText: string;
    options: [string, string, string, string];
    selectedOptionIndex: number;
    correctOptionIndex: number;
    isCorrect: boolean;
  }[];
}

export type ScreenType = 'home' | 'quiz' | 'result' | 'add_question' | 'history';

export interface CategoryMeta {
  id: QuizCategory;
  title: string;
  description: string;
  color: string;
  gradient: string;
  badgeBg: string;
  iconName: string;
  questionCount?: number;
}
