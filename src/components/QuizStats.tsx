interface QuizStatsProps {
  currentQuestion: number;
  totalQuestions: number;
  correctCount: number;
  answeredCount: number;
}

export default function QuizStats({
  currentQuestion,
  totalQuestions,
  correctCount,
  answeredCount,
}: QuizStatsProps) {
  return (
    <div className="quiz-stats">
      <p>
        Question {currentQuestion} of {totalQuestions}
      </p>
      <p>
        Score: {correctCount}/{answeredCount}
      </p>
    </div>
  );
}
