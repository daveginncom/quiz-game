interface QuizHeaderProps {
  title: string;
  onExit: () => void;
}

export default function QuizHeader({ title, onExit }: QuizHeaderProps) {
  const handleExit = () => {
    const confirmed = window.confirm(
      "Are you sure you want to return to the main menu? Your progress will be lost."
    );
    if (confirmed) {
      onExit();
    }
  };

  return (
    <div className="quiz-header">
      <h1>{title}</h1>
      <button onClick={handleExit}>Back to Menu</button>
    </div>
  );
}
