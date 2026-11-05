import { Question, QuizCategory, QuizResult } from '../types';
import { DEFAULT_QUESTIONS } from '../data/defaultQuestions';

const STORAGE_KEYS = {
  QUESTIONS: 'quizmaster_questions_v1',
  HISTORY: 'quizmaster_history_v1',
  BEST_SCORE: 'quizmaster_best_score_v1',
  SETTINGS: 'quizmaster_settings_v1',
};

export interface AppSettings {
  soundEnabled: boolean;
  timerEnabled: boolean;
  timePerQuestion: number; // in seconds, default 20
}

export const StorageService = {
  getQuestions(): Question[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(DEFAULT_QUESTIONS));
        return DEFAULT_QUESTIONS;
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return DEFAULT_QUESTIONS;
      }
      return parsed;
    } catch {
      return DEFAULT_QUESTIONS;
    }
  },

  getQuestionsByCategory(category: QuizCategory): Question[] {
    const all = this.getQuestions();
    return all.filter((q) => q.category === category);
  },

  saveQuestion(question: Omit<Question, 'id' | 'isCustom' | 'createdAt'>): Question {
    const current = this.getQuestions();
    const newQuestion: Question = {
      ...question,
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      isCustom: true,
      createdAt: new Date().toISOString(),
    };
    const updated = [newQuestion, ...current];
    try {
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
    return newQuestion;
  },

  deleteQuestion(id: string): boolean {
    const current = this.getQuestions();
    const updated = current.filter((q) => q.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(updated));
      return true;
    } catch {
      return false;
    }
  },

  resetDefaultQuestions(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(DEFAULT_QUESTIONS));
    } catch (e) {
      console.error(e);
    }
  },

  getQuizHistory(): QuizResult[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  saveQuizResult(result: QuizResult): void {
    const history = this.getQuizHistory();
    const updated = [result, ...history];
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
      // Update overall best score if beaten
      const currentBest = this.getBestScore();
      if (result.scorePercentage > currentBest) {
        localStorage.setItem(STORAGE_KEYS.BEST_SCORE, String(result.scorePercentage));
      }
    } catch (e) {
      console.error('Failed to save quiz result:', e);
    }
  },

  clearQuizHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
    } catch (e) {
      console.error(e);
    }
  },

  getBestScore(category?: QuizCategory): number {
    const history = this.getQuizHistory();
    if (history.length === 0) return 0;

    const filtered = category ? history.filter((h) => h.category === category) : history;
    if (filtered.length === 0) return 0;

    return Math.max(...filtered.map((h) => h.scorePercentage));
  },

  getSettings(): AppSettings {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!raw) {
        return { soundEnabled: true, timerEnabled: true, timePerQuestion: 20 };
      }
      return JSON.parse(raw);
    } catch {
      return { soundEnabled: true, timerEnabled: true, timePerQuestion: 20 };
    }
  },

  saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  },
};
