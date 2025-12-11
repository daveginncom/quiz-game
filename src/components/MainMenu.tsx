import { useState, useEffect } from "react";
import type { QuizListItem } from "../services/quizApi";
import { fetchQuizList } from "../services/quizApi";

interface MainMenuProps {
  onQuizSelect: (quizId: string) => void;
}

export default function MainMenu({ onQuizSelect }: MainMenuProps) {
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        setLoading(true);
        const quizList = await fetchQuizList();
        setQuizzes(quizList);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load quizzes");
      } finally {
        setLoading(false);
      }
    };

    loadQuizzes();
  }, []);

  return (
    <div className="main-menu">
      <h1>Quiz Game</h1>
      <h2>Select a Quiz</h2>

      {loading && <p className="loading-message">Loading quizzes...</p>}

      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <div className="quiz-list">
          {quizzes.map((quiz) => (
            <button
              key={quiz.id}
              className="quiz-button"
              onClick={() => onQuizSelect(quiz.id)}
            >
              {quiz.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
