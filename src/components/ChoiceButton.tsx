import type { QuizChoice } from "../models/Quiz";
import { choiceColors } from "../utils/quizUtils";

interface ChoiceButtonProps {
  choice: QuizChoice;
  index: number;
  isSelected: boolean;
  showResult: boolean;
  onSelect: () => void;
}

export default function ChoiceButton({
  choice,
  index,
  isSelected,
  showResult,
  onSelect,
}: ChoiceButtonProps) {
  const getClassName = () => {
    let className = "choice-button";
    if (isSelected) className += " selected";
    if (showResult) {
      if (choice.isCorrect) className += " correct";
      else if (isSelected) className += " incorrect";
    }
    return className;
  };

  return (
    <button
      className={getClassName()}
      style={{
        backgroundColor: choiceColors[index % choiceColors.length],
      }}
      onClick={onSelect}
      disabled={showResult}
    >
      {choice.text}
    </button>
  );
}
