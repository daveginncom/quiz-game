export interface QuizChoice {
  text: string;
  correct: boolean;
}

export interface QuizQuestion {
  question: string;
  choices: QuizChoice[];
}

export interface Quiz {
  title: string;
  questions: QuizQuestion[];
}
