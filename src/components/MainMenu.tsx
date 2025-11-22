import type { Quiz } from "../models/Quiz";

interface MainMenuProps {
  quizzes: Quiz[];
  onQuizSelect: (quiz: Quiz) => void;
}

export default function MainMenu({ quizzes, onQuizSelect }: MainMenuProps) {
  return (
    <div className="main-menu">
      <h1>Quiz Game</h1>
      <h2>Select a Quiz</h2>
      <div className="quiz-list">
        {quizzes.map((quiz, index) => (
          <button
            key={index}
            className="quiz-button"
            onClick={() => onQuizSelect(quiz)}
          >
            {quiz.title}
          </button>
        ))}
      </div>
    </div>
  );
}
