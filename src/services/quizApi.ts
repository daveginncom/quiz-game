import type { Quiz } from "../models/Quiz";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://app-quiz.orangewater-1f234770.westus.azurecontainerapps.io/api";

export interface QuizListItem {
  id: string;
  title: string;
}

export async function fetchQuizList(): Promise<QuizListItem[]> {
  const response = await fetch(`${API_BASE_URL}/quizzes`);
  if (!response.ok) {
    throw new Error(`Failed to fetch quiz list: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchQuizById(id: string): Promise<Quiz> {
  const response = await fetch(`${API_BASE_URL}/quizzes/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch quiz: ${response.statusText}`);
  }
  return response.json();
}
