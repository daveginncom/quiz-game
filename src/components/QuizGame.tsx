import { useState, useMemo, useEffect, useCallback } from "react";
import Confetti from "react-confetti";
import type { Quiz } from "../models/Quiz";
import { shuffleArray } from "../utils/quizUtils";
import { playCorrectSound, playIncorrectSound } from "../utils/soundEffects";
import {
  saveQuizProgress,
  loadQuizProgress,
} from "../utils/localStorage";
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
  // Try to restore saved progress first
  const savedProgress = loadQuizProgress();
  const shouldRestore = savedProgress && savedProgress.quizId === quiz.id;

  // Randomize questions once when component mounts, or use saved randomized questions
  const randomizedQuestions = useMemo(() => {
    if (shouldRestore && savedProgress.randomizedQuestions) {
      return savedProgress.randomizedQuestions;
    }
    return shuffleArray(quiz.questions).map((q) => ({
      ...q,
      choices: shuffleArray(q.choices),
    }));
  }, [quiz, shouldRestore, savedProgress]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    shouldRestore ? savedProgress.currentQuestionIndex : 0
  );
  const [correctCount, setCorrectCount] = useState(
    shouldRestore ? savedProgress.correctCount : 0
  );
  const [answeredCount, setAnsweredCount] = useState(
    shouldRestore ? savedProgress.answeredCount : 0
  );
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(
    shouldRestore ? savedProgress.selectedAnswer : null
  );
  const [showResult, setShowResult] = useState(
    shouldRestore ? savedProgress.showResult : false
  );
  const [showConfetti, setShowConfetti] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(
    shouldRestore ? savedProgress.isCorrectAnswer : false
  );
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>(
    shouldRestore ? savedProgress.wrongAnswers : []
  );

  const currentQuestion = randomizedQuestions[currentQuestionIndex];
  const totalQuestions = randomizedQuestions.length;

  // Save progress to localStorage whenever state changes
  useEffect(() => {
    if (answeredCount > 0) {
      // Only save if quiz has started
      saveQuizProgress({
        quizId: quiz.id,
        quizTitle: quiz.title,
        currentQuestionIndex,
        correctCount,
        answeredCount,
        selectedAnswer,
        showResult,
        isCorrectAnswer,
        wrongAnswers,
        randomizedQuestions,
        timestamp: Date.now(),
      });
    }
  }, [
    quiz.id,
    quiz.title,
    currentQuestionIndex,
    correctCount,
    answeredCount,
    selectedAnswer,
    showResult,
    isCorrectAnswer,
    wrongAnswers,
    randomizedQuestions,
  ]);

  const handleAnswerSelect = (choiceIndex: number) => {
    if (showResult) return;

    // Immediately submit the answer when selected
    setSelectedAnswer(choiceIndex);

    const isCorrect = currentQuestion.choices[choiceIndex].correct;
    setIsCorrectAnswer(isCorrect);

    if (isCorrect) {
      setCorrectCount(correctCount + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      playCorrectSound();
    } else {
      const correctChoice = currentQuestion.choices.find((c) => c.correct);
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

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowConfetti(false);
      setIsCorrectAnswer(false);
    }
  }, [currentQuestionIndex, totalQuestions]);

  // Auto-advance after 3 seconds on correct answer
  useEffect(() => {
    if (
      showResult &&
      isCorrectAnswer &&
      currentQuestionIndex < totalQuestions - 1
    ) {
      const timer = setTimeout(() => {
        handleNextQuestion();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [
    showResult,
    isCorrectAnswer,
    currentQuestionIndex,
    totalQuestions,
    handleNextQuestion,
  ]);

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
          quizId={quiz.id}
          quizTitle={quiz.title}
          correctCount={correctCount}
          totalQuestions={totalQuestions}
          wrongAnswers={wrongAnswers}
          onExit={onExit}
        />
      )}
    </div>
  );
}
