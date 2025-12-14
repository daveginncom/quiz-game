import { useState, useEffect } from "react";
import "./App.css";
import type { QuizPlayDTO } from "./models/Quiz";
import { fetchQuizForPlay } from "./services/quizApi";
import { loadQuizProgress, clearQuizProgress } from "./utils/localStorage";
import MainMenu from "./components/MainMenu";
import QuizGame from "./components/QuizGame";

function App() {
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizPlayDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Restore progress on mount
  useEffect(() => {
    const savedProgress = loadQuizProgress();
    if (savedProgress) {
      setSelectedQuizId(savedProgress.quizId);
    }
  }, []);

  useEffect(() => {
    if (!selectedQuizId) {
      setSelectedQuiz(null);
      return;
    }

    let cancelled = false;

    const loadQuiz = async () => {
      try {
        setLoading(true);
        setError(null);
        const quiz = await fetchQuizForPlay(selectedQuizId);
        if (!cancelled) {
          setSelectedQuiz(quiz);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load quiz");
          setSelectedQuizId(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadQuiz();

    return () => {
      cancelled = true;
    };
  }, [selectedQuizId]);

  const handleExit = () => {
    clearQuizProgress(); // Clear progress when exiting
    setSelectedQuizId(null);
    setSelectedQuiz(null);
    setError(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={handleExit} className="back-button">
          Back to Menu
        </button>
      </div>
    );
  }

  if (selectedQuiz) {
    return <QuizGame quiz={selectedQuiz} onExit={handleExit} />;
  }

  return <MainMenu onQuizSelect={setSelectedQuizId} />;
}

export default App;
