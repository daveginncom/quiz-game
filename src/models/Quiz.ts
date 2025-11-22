export interface QuizChoice {
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  question: string;
  choices: QuizChoice[];
}

export interface Quiz {
  title: string;
  questions: QuizQuestion[];
}
