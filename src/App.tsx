import { useState, useEffect } from "react";
import "./App.css";
import type { Quiz } from "./models/Quiz";
import { fetchQuizById } from "./services/quizApi";
import { loadQuizProgress, clearQuizProgress } from "./utils/localStorage";
import MainMenu from "./components/MainMenu";
import QuizGame from "./components/QuizGame";

function App() {
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
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

    const loadQuiz = async () => {
      try {
        setLoading(true);
        setError(null);
        const quiz = await fetchQuizById(selectedQuizId);
        setSelectedQuiz(quiz);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load quiz");
        setSelectedQuizId(null);
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
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
