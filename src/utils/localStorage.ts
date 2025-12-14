import type { QuestionPlayDTO } from "../models/Quiz";

export interface QuizProgress {
  quizId: number;
  quizTitle: string;
  currentQuestionIndex: number;
  correctCount: number;
  answeredCount: number;
  selectedAnswer: number | null;
  showResult: boolean;
  isCorrectAnswer: boolean;
  wrongAnswers: {
    question: string;
    userAnswer: string;
    correctAnswer: string;
  }[];
  randomizedQuestions: QuestionPlayDTO[];
  timestamp: number;
}

export interface QuizScore {
  quizId: number;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  grade: string;
  completedAt: number;
}

const PROGRESS_KEY = "quiz_progress";
const HISTORY_KEY = "quiz_history";

export function saveQuizProgress(progress: QuizProgress): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error("Failed to save quiz progress:", error);
  }
}

export function loadQuizProgress(): QuizProgress | null {
  try {
    const data = localStorage.getItem(PROGRESS_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Failed to load quiz progress:", error);
    return null;
  }
}

export function clearQuizProgress(): void {
  try {
    localStorage.removeItem(PROGRESS_KEY);
  } catch (error) {
    console.error("Failed to clear quiz progress:", error);
  }
}

export function saveQuizScore(score: QuizScore): void {
  try {
    const history = loadQuizHistory();
    history.push(score);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Failed to save quiz score:", error);
  }
}

export function loadQuizHistory(): QuizScore[] {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    if (!data) return [];

    const parsed = JSON.parse(data);
    // Ensure the parsed data is an array
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to load quiz history:", error);
    return [];
  }
}

export function getQuizHistory(quizId: number): QuizScore[] {
  const history = loadQuizHistory();
  return history.filter((score) => score.quizId === quizId);
}

export function clearQuizHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error("Failed to clear quiz history:", error);
  }
}
