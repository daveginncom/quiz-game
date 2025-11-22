interface QuizHeaderProps {
  title: string;
  onExit: () => void;
}

export default function QuizHeader({ title, onExit }: QuizHeaderProps) {
  return (
    <div className="quiz-header">
      <h1>{title}</h1>
      <button onClick={onExit}>Back to Menu</button>
    </div>
  );
}
