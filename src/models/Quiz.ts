// Play DTOs (used for gameplay - no correct answers exposed)
export interface ChoicePlayDTO {
  id: number;
  text: string;
}

export interface QuestionPlayDTO {
  id: number;
  question: string;
  choices: ChoicePlayDTO[];
}

export interface QuizPlayDTO {
  id: number;
  title: string;
  questions: QuestionPlayDTO[];
}

// Answer submission and result DTOs
export interface AnswerSubmissionDTO {
  choiceId: number;
}

export interface AnswerResultDTO {
  correct: boolean;
  correctChoiceId: number;
  explanation?: string;
}

// Admin DTOs (full quiz with correct answers - for backwards compatibility)
export interface QuizChoice {
  id: number;
  text: string;
  correct: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  choices: QuizChoice[];
}

export interface Quiz {
  id: number;
  title: string;
  questions: QuizQuestion[];
}

// List item for quiz selection
export interface QuizListItem {
  id: number;
  title: string;
}
