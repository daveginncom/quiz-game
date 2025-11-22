import type { QuizQuestion } from "../models/Quiz";
import FeedbackMessage from "./FeedbackMessage";
import ChoiceButton from "./ChoiceButton";

interface QuestionDisplayProps {
  question: QuizQuestion;
  selectedAnswer: number | null;
  showResult: boolean;
  isCorrectAnswer: boolean;
  onAnswerSelect: (index: number) => void;
}

export default function QuestionDisplay({
  question,
  selectedAnswer,
  showResult,
  isCorrectAnswer,
  onAnswerSelect,
}: QuestionDisplayProps) {
  const correctAnswerText = question.choices.find((c) => c.isCorrect)?.text;

  return (
    <>
      <div className="question-section">
        <h2>{question.question}</h2>
        {showResult && (
          <FeedbackMessage
            isCorrect={isCorrectAnswer}
            correctAnswerText={correctAnswerText}
          />
        )}
      </div>

      <div className="choices-section">
        {question.choices.map((choice, index) => (
          <ChoiceButton
            key={index}
            choice={choice}
            index={index}
            isSelected={selectedAnswer === index}
            showResult={showResult}
            onSelect={() => onAnswerSelect(index)}
          />
        ))}
      </div>
    </>
  );
}
