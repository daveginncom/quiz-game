import type { QuestionPlayDTO } from "../models/Quiz";
import FeedbackMessage from "./FeedbackMessage";
import ChoiceButton from "./ChoiceButton";

interface QuestionDisplayProps {
  question: QuestionPlayDTO;
  selectedAnswer: number | null;
  showResult: boolean;
  isCorrectAnswer: boolean;
  correctAnswerText?: string;
  onAnswerSelect: (index: number) => void;
}

export default function QuestionDisplay({
  question,
  selectedAnswer,
  showResult,
  isCorrectAnswer,
  correctAnswerText,
  onAnswerSelect,
}: QuestionDisplayProps) {
  return (
    <>
      <div className="question-section">
        <h2>{question.question}</h2>
        {showResult && (
          <FeedbackMessage
            isCorrect={isCorrectAnswer}
            correctAnswerText={!isCorrectAnswer ? correctAnswerText : undefined}
          />
        )}
      </div>

      <div className="choices-section">
        {question.choices.map((choice, index) => (
          <ChoiceButton
            key={choice.id}
            choice={choice}
            index={index}
            isSelected={selectedAnswer === index}
            showResult={showResult}
            isCorrect={showResult && isCorrectAnswer && selectedAnswer === index}
            onSelect={() => onAnswerSelect(index)}
          />
        ))}
      </div>
    </>
  );
}
