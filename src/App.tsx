import { useState, useMemo } from "react";
import Confetti from "react-confetti";
import "./App.css";
import type { Quiz } from "./models/Quiz";
import britishAmericaQuiz from "./data/british-america.json";

const availableQuizzes: Quiz[] = [britishAmericaQuiz as Quiz];

// Shuffle array utility
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Calculate letter grade on 10-point scale
function getLetterGrade(percentage: number): string {
  if (percentage >= 90) return "A";
  if (percentage >= 80) return "B";
  if (percentage >= 70) return "C";
  if (percentage >= 60) return "D";
  return "F";
}

// Color scheme for choices - always in the same order
const choiceColors = ["#3498db", "#e74c3c", "#f39c12", "#9b59b6"]; // Blue, Red, Orange, Purple

interface WrongAnswer {
  question: string;
  userAnswer: string;
  correctAnswer: string;
}

function QuizGame({ quiz, onExit }: { quiz: Quiz; onExit: () => void }) {
  // Randomize questions once when component mounts
  const randomizedQuestions = useMemo(() => {
    return shuffleArray(quiz.questions).map((q) => ({
      ...q,
      choices: shuffleArray(q.choices),
    }));
  }, [quiz]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);

  const currentQuestion = randomizedQuestions[currentQuestionIndex];
  const totalQuestions = randomizedQuestions.length;
  const percentage =
    answeredCount > 0 ? (correctCount / answeredCount) * 100 : 0;
  const letterGrade = getLetterGrade(percentage);

  const handleAnswerSelect = (choiceIndex: number) => {
    if (showResult) return; // Prevent changing answer after submission
    setSelectedAnswer(choiceIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = currentQuestion.choices[selectedAnswer].isCorrect;
    setIsCorrectAnswer(isCorrect);

    if (isCorrect) {
      setCorrectCount(correctCount + 1);
      setShowConfetti(true);
      // Stop confetti after 3 seconds
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      // Track wrong answer
      const correctChoice = currentQuestion.choices.find((c) => c.isCorrect);
      setWrongAnswers([
        ...wrongAnswers,
        {
          question: currentQuestion.question,
          userAnswer: currentQuestion.choices[selectedAnswer].text,
          correctAnswer: correctChoice?.text || "",
        },
      ]);
    }
    setAnsweredCount(answeredCount + 1);
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowConfetti(false);
      setIsCorrectAnswer(false);
    }
  };

  const isQuizComplete =
    currentQuestionIndex === totalQuestions - 1 && showResult;

  return (
    <div className="quiz-container">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}

      <div className="quiz-header">
        <h1>{quiz.title}</h1>
        <button onClick={onExit}>Back to Menu</button>
      </div>

      <div className="quiz-stats">
        <p>
          Question {answeredCount + 1} of {totalQuestions}
        </p>
        <p>
          Score: {correctCount}/{answeredCount}
        </p>
      </div>

      {!isQuizComplete ? (
        <>
          <div className="question-section">
            <h2>{currentQuestion.question}</h2>
            {showResult && (
              <div
                className={`feedback-message ${
                  isCorrectAnswer ? "correct-feedback" : "incorrect-feedback"
                }`}
              >
                {isCorrectAnswer ? (
                  <p>✓ Correct! Well done!</p>
                ) : (
                  <>
                    <p>✗ Incorrect.</p>
                    <p className="correct-answer-text">
                      The correct answer is:{" "}
                      <strong>
                        {currentQuestion.choices.find((c) => c.isCorrect)?.text}
                      </strong>
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="choices-section">
            {currentQuestion.choices.map((choice, index) => (
              <button
                key={index}
                className={`choice-button ${
                  selectedAnswer === index ? "selected" : ""
                } ${
                  showResult
                    ? choice.isCorrect
                      ? "correct"
                      : selectedAnswer === index
                      ? "incorrect"
                      : ""
                    : ""
                }`}
                style={{
                  backgroundColor: choiceColors[index % choiceColors.length],
                }}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
              >
                {choice.text}
              </button>
            ))}
          </div>

          <div className="action-buttons">
            {!showResult ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className="submit-button"
              >
                Submit Answer
              </button>
            ) : (
              <button onClick={handleNextQuestion} className="next-button">
                Next Question
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="quiz-complete">
          {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
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
      )}
    </div>
  );
}

function App() {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  if (selectedQuiz) {
    return (
      <QuizGame quiz={selectedQuiz} onExit={() => setSelectedQuiz(null)} />
    );
  }

  return (
    <div className="main-menu">
      <h1>Quiz Game</h1>
      <h2>Select a Quiz</h2>
      <div className="quiz-list">
        {availableQuizzes.map((quiz, index) => (
          <button
            key={index}
            className="quiz-button"
            onClick={() => setSelectedQuiz(quiz)}
          >
            {quiz.title}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
