import type { ChoicePlayDTO } from "../models/Quiz";

interface ChoiceButtonProps {
  choice: ChoicePlayDTO;
  index: number;
  isSelected: boolean;
  showResult: boolean;
  isCorrect: boolean;
  onSelect: () => void;
}

export default function ChoiceButton({
  choice,
  index,
  isSelected,
  showResult,
  isCorrect,
  onSelect,
}: ChoiceButtonProps) {
  const getClassName = () => {
    let className = `choice-button choice-button-${index}`;
    if (isSelected) className += " selected";
    if (showResult) {
      if (isCorrect) className += " correct";
      else if (isSelected) className += " incorrect";
    }
    return className;
  };

  return (
    <button
      className={getClassName()}
      onClick={onSelect}
      disabled={showResult}
    >
      {choice.text}
    </button>
  );
}
