export interface QuizChoice {
  text: string;
  correct: boolean;
}

export interface QuizQuestion {
  question: string;
  choices: QuizChoice[];
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
}
