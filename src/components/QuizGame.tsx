import { useState, useMemo } from "react";
import Confetti from "react-confetti";
import type { Quiz } from "../models/Quiz";
import { shuffleArray } from "../utils/quizUtils";
import { playCorrectSound, playIncorrectSound } from "../utils/soundEffects";
import QuizHeader from "./QuizHeader";
import QuizStats from "./QuizStats";
import QuestionDisplay from "./QuestionDisplay";
import QuizSummary from "./QuizSummary";

interface WrongAnswer {
  question: string;
  userAnswer: string;
  correctAnswer: string;
}

interface QuizGameProps {
  quiz: Quiz;
  onExit: () => void;
}

export default function QuizGame({ quiz, onExit }: QuizGameProps) {
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

  const handleAnswerSelect = (choiceIndex: number) => {
    if (showResult) return;

    // Immediately submit the answer when selected
    setSelectedAnswer(choiceIndex);

    const isCorrect = currentQuestion.choices[choiceIndex].isCorrect;
    setIsCorrectAnswer(isCorrect);

    if (isCorrect) {
      setCorrectCount(correctCount + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      playCorrectSound();
    } else {
      const correctChoice = currentQuestion.choices.find((c) => c.isCorrect);
      setWrongAnswers([
        ...wrongAnswers,
        {
          question: currentQuestion.question,
          userAnswer: currentQuestion.choices[choiceIndex].text,
          correctAnswer: correctChoice?.text || "",
        },
      ]);
      playIncorrectSound();
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

      <QuizHeader title={quiz.title} onExit={onExit} />

      <QuizStats
        currentQuestion={answeredCount + 1}
        totalQuestions={totalQuestions}
        correctCount={correctCount}
        answeredCount={answeredCount}
      />

      {!isQuizComplete ? (
        <>
          <QuestionDisplay
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            showResult={showResult}
            isCorrectAnswer={isCorrectAnswer}
            onAnswerSelect={handleAnswerSelect}
          />

          <div className="action-buttons">
            {showResult && (
              <button onClick={handleNextQuestion} className="next-button">
                Next Question
              </button>
            )}
          </div>
        </>
      ) : (
        <QuizSummary
          correctCount={correctCount}
          totalQuestions={totalQuestions}
          wrongAnswers={wrongAnswers}
          onExit={onExit}
        />
      )}
    </div>
  );
}
