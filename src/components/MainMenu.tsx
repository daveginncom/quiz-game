import { useState, useEffect } from "react";
import type { QuizListItem } from "../models/Quiz";
import { fetchQuizList } from "../services/quizApi";
import { getQuizHistory } from "../utils/localStorage";

interface MainMenuProps {
  onQuizSelect: (quizId: number) => void;
}

export default function MainMenu({ onQuizSelect }: MainMenuProps) {
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadQuizzes = async () => {
      try {
        setLoading(true);
        const quizList = await fetchQuizList();
        if (!cancelled) {
          setQuizzes(quizList);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load quizzes");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadQuizzes();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="main-menu">
      <h1>Quiz Game</h1>

      {!showHistory ? (
        <>
          <h2>Select a Quiz</h2>
          <button
            className="history-toggle-button"
            onClick={() => setShowHistory(true)}
          >
            View Score History
          </button>

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
        </>
      ) : (
        <>
          <h2>Score History</h2>
          <button
            className="history-toggle-button"
            onClick={() => setShowHistory(false)}
          >
            Back to Quizzes
          </button>

          <div className="history-list">
            {quizzes.map((quiz) => {
              const history = getQuizHistory(quiz.id);
              if (history.length === 0) return null;

              return (
                <div key={quiz.id} className="quiz-history-section">
                  <h3>{quiz.title}</h3>
                  <div className="history-items">
                    {history.map((score, index) => (
                      <div key={index} className="history-item">
                        <div className="history-score">
                          Score: {score.score}/{score.totalQuestions} (
                          {score.percentage.toFixed(1)}%)
                        </div>
                        <div className="history-grade">
                          Grade:{" "}
                          <span className="grade-badge">{score.grade}</span>
                        </div>
                        <div className="history-date">
                          {new Date(score.completedAt).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            {quizzes.every((quiz) => getQuizHistory(quiz.id).length === 0) && (
              <p className="no-history">
                No quiz history yet. Complete a quiz to see your scores here!
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
