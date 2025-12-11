import { useEffect } from "react";
import Confetti from "react-confetti";
import { getLetterGrade } from "../utils/quizUtils";
import { saveQuizScore, clearQuizProgress } from "../utils/localStorage";

interface WrongAnswer {
  question: string;
  userAnswer: string;
  correctAnswer: string;
}

interface QuizSummaryProps {
  quizId: string;
  quizTitle: string;
  correctCount: number;
  totalQuestions: number;
  wrongAnswers: WrongAnswer[];
  onExit: () => void;
}

export default function QuizSummary({
  quizId,
  quizTitle,
  correctCount,
  totalQuestions,
  wrongAnswers,
  onExit,
}: QuizSummaryProps) {
  const percentage = (correctCount / totalQuestions) * 100;
  const letterGrade = getLetterGrade(percentage);
  const isPerfectScore = wrongAnswers.length === 0;

  // Save score to history when component mounts and clear progress
  useEffect(() => {
    saveQuizScore({
      quizId,
      quizTitle,
      score: correctCount,
      totalQuestions,
      percentage,
      grade: letterGrade,
      completedAt: Date.now(),
    });
    clearQuizProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  return (
    <div className="quiz-complete">
      {isPerfectScore && <Confetti recycle={false} numberOfPieces={500} />}
      <h2>Quiz Complete!</h2>

      <div className="summary-stats">
        <h3>Final Results</h3>
        <p className="score-display">
          Score: {correctCount}/{totalQuestions}
        </p>
        <p className="percentage-display">
          Percentage: {percentage.toFixed(1)}%
        </p>
        <p className="grade-display">
          Final Grade: <span className="grade-badge">{letterGrade}</span>
        </p>
      </div>

      {wrongAnswers.length > 0 ? (
        <div className="wrong-answers-section">
          <h3>Questions to Review ({wrongAnswers.length})</h3>
          <div className="wrong-answers-list">
            {wrongAnswers.map((wrong, index) => (
              <div key={index} className="wrong-answer-item">
                <p className="question-text">
                  <strong>Q:</strong> {wrong.question}
                </p>
                <p className="user-answer">
                  <strong>Your Answer:</strong> {wrong.userAnswer}
                </p>
                <p className="correct-answer">
                  <strong>Correct Answer:</strong> {wrong.correctAnswer}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="perfect-score">
          <h3>🎉 Perfect Score! 🎉</h3>
          <p>You answered all questions correctly!</p>
        </div>
      )}

      <button onClick={onExit} className="finish-button">
        Return to Menu
      </button>
    </div>
  );
}
