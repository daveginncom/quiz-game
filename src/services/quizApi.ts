import type {
  QuizListItem,
  QuizPlayDTO,
  AnswerSubmissionDTO,
  AnswerResultDTO,
} from "../models/Quiz";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export async function fetchQuizList(): Promise<QuizListItem[]> {
  const response = await fetch(`${API_BASE_URL}/quizzes`);
  if (!response.ok) {
    throw new Error(`Failed to fetch quiz list: ${response.statusText}`);
  }
  const quizzes = await response.json();
  // Map full quiz objects to list items
  return quizzes.map((quiz: { id: number; title: string }) => ({
    id: quiz.id,
    title: quiz.title,
  }));
}

export async function fetchQuizForPlay(id: number): Promise<QuizPlayDTO> {
  const response = await fetch(`${API_BASE_URL}/quizzes/${id}/play`);
  if (!response.ok) {
    throw new Error(`Failed to fetch quiz: ${response.statusText}`);
  }
  return response.json();
}

export async function submitAnswer(
  quizId: number,
  questionId: number,
  submission: AnswerSubmissionDTO
): Promise<AnswerResultDTO> {
  const response = await fetch(
    `${API_BASE_URL}/quizzes/${quizId}/questions/${questionId}/submit`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submission),
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to submit answer: ${response.statusText}`);
  }
  return response.json();
}
